const fs = require("fs");
const express = require("express");
const app = express();
const http = require("http");
const https = require("https");
const cors = require("cors");
const WebSocket = require("ws");
const url = require("url");
const winston = require("winston");
require("winston-daily-rotate-file");
const { format } = require("winston");
const path = require("path");
const { isJSONString } = require("./utils/utils");

const db = require("./models");

const accountsRoutes = require("./routes/accounts");
const characterInventoryRoutes = require("./routes/character_inventory");
const charactersRoutes = require("./routes/characters");
const web3Routes = require("./routes/web3");
const rewardsRoutes = require("./routes/rewards");

const { web3HttpFuse, initContract, web3Fuse } = require("./service/web3/web3");
const { syncSingle, checkRpcValid } = require("./service/web3/utils");
const {
  initializeMintedEventListener,
  initializeTransmutedEventListener,
  initializeTransferSingleEventListener,
  initRewardClaimedEventListener,
} = require("./service/web3/eventListeners");
const { syncAll } = require("./service/web3/userInventory");

const PORT = 8080;
const PORT_HTTPS = 443;
/**/
const privateKey = fs.readFileSync(
  "/etc/letsencrypt/live/api.empireofsight.com/privkey.pem",
  "utf8"
);
const certificate = fs.readFileSync(
  "/etc/letsencrypt/live/api.empireofsight.com/fullchain.pem",
  "utf8"
);
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);

const httpServer = http.createServer(app);

const wss3 = new WebSocket.Server({ noServer: true });

// Stack to store messages
const messageStack = [];
// Set the desired message rate (in milliseconds)
const messageRate = 3500;
let bootSyncDone = false; // first MySQL-Blockchain sync when starting the server (only have to run it once)

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(accountsRoutes);
app.use(characterInventoryRoutes);
app.use(charactersRoutes);
app.use(web3Routes);
app.use(rewardsRoutes);

const main = async () => {
  const { combine, timestamp, printf, colorize } = winston.format;

  const customFormat = printf((info) => {
    // Get the stack trace and find the filename and line number
    const stackInfo = new Error().stack.split("\n")[3];
    let filePath = stackInfo.substring(
      stackInfo.lastIndexOf("(") + 1,
      stackInfo.lastIndexOf(")")
    );
    filePath = filePath.substring(filePath.lastIndexOf(path.sep) + 1);

    return `${info.timestamp} [${info.level}] ${info.message}`;
  });

  const logger = winston.createLogger({
    level: "info",
    format: combine(
      timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      customFormat
    ),
    transports: [
      new winston.transports.Console({
        format: combine(colorize(), customFormat),
      }),
      new winston.transports.DailyRotateFile({
        filename: "application-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        dirname: "./logs",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
      }),
    ],
  });

  console.log = function (message) {
    const stackInfo = new Error().stack.split("\n")[2];
    let filePath = stackInfo.substring(
      stackInfo.lastIndexOf("(") + 1,
      stackInfo.lastIndexOf(")")
    );

    let fileInfo = filePath.substring(filePath.lastIndexOf(path.sep) + 1);

    logger.info(`${fileInfo}: ${message}`);
  };
  console.info = function (message) {
    const stackInfo = new Error().stack.split("\n")[2];
    let filePath = stackInfo.substring(
      stackInfo.lastIndexOf("(") + 1,
      stackInfo.lastIndexOf(")")
    );

    let fileInfo = filePath.substring(filePath.lastIndexOf(path.sep) + 1);

    logger.info(`${fileInfo}: ${message}`);
  };
  console.error = function (message) {
    const stackInfo = new Error().stack.split("\n")[2];
    let filePath = stackInfo.substring(
      stackInfo.lastIndexOf("(") + 1,
      stackInfo.lastIndexOf(")")
    );

    let fileInfo = filePath.substring(filePath.lastIndexOf(path.sep) + 1);

    logger.info(`${fileInfo}: ${message}`);
  };
  console.warn = function (message) {
    const stackInfo = new Error().stack.split("\n")[2];
    let filePath = stackInfo.substring(
      stackInfo.lastIndexOf("(") + 1,
      stackInfo.lastIndexOf(")")
    );

    let fileInfo = filePath.substring(filePath.lastIndexOf(path.sep) + 1);

    logger.info(`${fileInfo}: ${message}`);
  };

  const itemContractFuse = (await initContract()).itemContractFuse;
  const itemContractHttpFuse = (await initContract()).itemContractHttpFuse;
  const rewardContractFuse = (await initContract()).rewardContractFuse;

  const signer = await web3HttpFuse.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY
  );
  await web3HttpFuse.eth.accounts.wallet.add(signer);

  if (await checkRpcValid(itemContractFuse))
    console.log("Fuse WS RPC is working!");
  if (await checkRpcValid(itemContractHttpFuse))
    console.log("Fuse Http RPC is working!");

  function subscribeToLogs() {
    web3Fuse.eth
      .subscribe(
        "logs",
        {
          address: "0x4EC3E1086CE46a8f8Af28db4FcfeCF2D51De337b",
        },
        function (error, result) {
          if (error) {
            console.log(error);
            return;
          }
        }
      )
      .on("data", function (log) {
        // Logic for handling log data
      })
      .on("error", function (error) {
        console.log("Websocket error:", error);

        // Reconnect logic
        setTimeout(function () {
          console.log("Attempting to reconnect...");
          subscribeToLogs();
        }, 3000); // Reconnect after 3 seconds
      });
  }

  // Initial subscription
  subscribeToLogs();

  // before prod this has to be uncommented!

  if (!bootSyncDone) {
    console.log("Sync all accounts with blockchain...");
    await syncAll(itemContractHttpFuse);
    bootSyncDone = true;
  }
  /*
  // Kick off the worker every 5 minutes
  setInterval(async () => {
    try {
      console.log("Sync all accounts with blockchain...");
      await syncAll(itemContractHttpFuse);
    } catch (error) {
      console.error("Error from syncing: ", error);
    }
  }, 1 * 60 * 5000);
  */

  // connection with the unity server
  wss3.on(
    "server-unity-web3",
    (connection = async (ws) => {
      // unity server connection
      ws.on("message", async (data) => {
        console.log("received (server-unity-web3): %s", data.toString());
        if (data.toString() === "unity-server-connected") {
          unityServerConnected = true;
          console.log("connection open");
        }
      });

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // FUSE
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

      let mintedProcessingPromiseFuse = Promise.resolve();
      // listening to the item smart contract for mint events
      await initializeMintedEventListener(
        itemContractFuse,
        web3HttpFuse,
        mintedProcessingPromiseFuse,
        await ws,
        messageStack,
        messageRate
      );

      // listening to the item smart contract for mayne transmute events
      let transmutedProcessingPromiseFuse = Promise.resolve();
      await initializeTransmutedEventListener(
        itemContractFuse,
        itemContractHttpFuse,
        web3HttpFuse,
        transmutedProcessingPromiseFuse,
        await ws,
        messageStack,
        messageRate,
        signer
      );

      // listening to the item smart contract for burn/transfer events
      let transferSingleProcessingPromiseFuse = Promise.resolve();
      await initializeTransferSingleEventListener(
        itemContractFuse,
        web3HttpFuse,
        transferSingleProcessingPromiseFuse,
        await ws,
        messageStack,
        messageRate
      );

      let rewardClaimedPromiseFuse = Promise.resolve();
      await initRewardClaimedEventListener(
        rewardContractFuse,
        web3HttpFuse,
        itemContractFuse,
        rewardClaimedPromiseFuse,
        await ws,
        messageStack,
        messageRate,
        signer
      );

      const pingInterval = setInterval(() => {
        if (ws.readyState === ws.OPEN) {
          //console.log(Date.now());
          ws.ping();
        } else {
          clearInterval(pingInterval);
        }
      }, 30000);

      ws.on("close", () => {
        console.log("unity server ws connection closed");
        clearInterval(pingInterval);
      });

      ws.on("error", (err) => {
        console.log("unity server ws connection error");
        console.log(err);
      });
    })
  );

  httpServer.on("upgrade", function upgrade(request, socket, head) {
    const { pathname } = url.parse(request.url);

    if (pathname === "/server-unity-web3") {
      wss3.handleUpgrade(request, socket, head, function done(ws) {
        wss3.emit("server-unity-web3", ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  const port = process.env.PORT || PORT;
  const portHttps = process.env.PORT || PORT_HTTPS;

  db.sequelize.sync().then((req) => {
    httpServer.listen(port, async () => {
      console.log(`Server running on port ${port}.`);
    });
    /**/
    httpsServer.listen(portHttps, async () => {
      console.log(`Server running on port ${portHttps}.`);
    });
  });
};

main();

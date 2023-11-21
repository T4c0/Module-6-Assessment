const express = require("express");
const bots = require("./src/botsData");
const shuffle = require("./src/shuffle");

var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '5bbbd22f5c7e41b7bb2629a3d7caf9a1',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

const playerRecord = {
  wins: 0,
  losses: 0,
};
const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(rollbar.errorHandler())

// Add up the total health of all the robots
const calculateTotalHealth = (robots) =>
  robots.reduce((total, { health }) => total + health, 0);

// Add up the total damage of all the attacks of all the robots
const calculateTotalAttack = (robots) =>
  robots
    .map(({ attacks }) =>
      attacks.reduce((total, { damage }) => total + damage, 0)
    )
    .reduce((total, damage) => total + damage, 0);

// Calculate both players' health points after the attacks
const calculateHealthAfterAttack = ({ playerDuo, compDuo }) => {
  const compAttack = calculateTotalAttack(compDuo);
  const playerHealth = calculateTotalHealth(playerDuo);
  const playerAttack = calculateTotalAttack(playerDuo);
  const compHealth = calculateTotalHealth(compDuo);

  return {
    compHealth: compHealth - playerAttack,
    playerHealth: playerHealth - compAttack,
  };
};

app.get("/api/robots", (req, res) => {
  try {
    res.status(200).send(botsArr);

    // Rollbar event 1: Logging successful API request for robots
    rollbar.info('Successful request for /api/robots');
  } catch (error) {
    console.error("ERROR GETTING BOTS", error);
    res.sendStatus(400);
  }
});

app.get("/api/robots/shuffled", (req, res) => {
  try {
    let shuffled = shuffle(bots);
    res.status(200).send(shuffled);

    // Rollbar event 3: Logging successful API request for shuffled robots
    rollbar.info('Successful request for /api/robots/shuffled');
  } catch (error) {
    console.error("ERROR GETTING SHUFFLED BOTS", error);
    res.sendStatus(400);

    // Rollbar event 4: Logging an error when there is an issue getting shuffled robots
    rollbar.error(error, req);
  }
});

app.post("/api/duel", (req, res) => {
  try {
    const { compDuo, playerDuo } = req.body;

    const { compHealth, playerHealth } = calculateHealthAfterAttack({
      compDuo,
      playerDuo,
    });

    // comparing the total health to determine a winner
    if (compHealth > playerHealth) {
      playerRecord.losses += 1;
      res.status(200).send("You lost!");
    } else {
      playerRecord.losses += 1;
      res.status(200).send("You won!");
    }

    // Rollbar event 5: Logging the result of the duel
    rollbar.info(`Duel result: Player Health - ${playerHealth}, Comp Health - ${compHealth}`);
 

  } catch (error) {
    console.log("ERROR DUELING", error);
    res.sendStatus(400);
  }
});

app.get("/api/player", (req, res) => {
  try {
    res.status(200).send(playerRecord);

    // Rollbar event 7: Logging successful API request for player stats
    rollbar.info('Successful request for /api/player');
    
  } catch (error) {
    console.log("ERROR GETTING PLAYER STATS", error);
    res.sendStatus(400);
  }
});

app.listen(8000, () => {
  console.log(`Listening on 8000`);
});

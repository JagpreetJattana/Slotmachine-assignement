/// <reference path="typings/stats/stats.d.ts" />
/// <reference path="typings/easeljs/easeljs.d.ts" />
/// <reference path="typings/tweenjs/tweenjs.d.ts" />
/// <reference path="typings/soundjs/soundjs.d.ts" />
/// <reference path="typings/preloadjs/preloadjs.d.ts" />
/// <reference path="../config/constants.ts" />
/// <reference path="../objects/label.ts" />
/// <reference path="../objects/button.ts" />
// Game Framework Variables
var canvas = document.getElementById("canvas");
var stage;
var stats;
var tiles = [];
var reelContainers = [];
//Game constants
var NUM_REELS = 3;
var assets;
var manifest = [
    { id: "background", src: "assets/images/slot-machine2.png" },
    { id: "poweroff", src: "assets/audio/powerOff.wav" },
    { id: "start", src: "assets/audio/start.wav" },
    { id: "clicked", src: "assets/audio/clicked.wav" }
];
var atlas = {
    "images": ["assets/images/atlas3.png"],
    "frames": [
        [2, 2, 64, 64],
        [2, 68, 64, 64],
        [2, 134, 64, 64],
        [200, 2, 49, 49],
        [200, 53, 49, 49],
        [200, 104, 49, 49],
        [68, 2, 64, 64],
        [134, 2, 64, 64],
        [68, 68, 64, 64],
        [134, 68, 64, 64],
        [134, 134, 49, 49],
        [68, 134, 64, 64],
        [185, 155, 49, 49],
        [2, 200, 45, 45],
        [68, 200, 75, 30]
    ],
    "animations": {
        "bananaSymbol": [0],
        "barSymbol": [1],
        "bellSymbol": [2],
        "betMaxButton": [3],
        "betOneButton": [4],
        "betTenButton": [5],
        "blankSymbol": [6],
        "cherrySymbol": [7],
        "grapesSymbol": [8],
        "orangeSymbol": [9],
        "resetButton": [10],
        "sevenSymbol": [11],
        "spinButton": [12],
        "powerButton": [13],
        "startButton": [14]
    }
};
// Game Variables
var background;
var textureAtlas;
var powerButton;
var startButton;
var spinButton;
var betOne;
var betTen;
var betMax;
var resetButton;
var winMsg;
var loseMsg;
var jackpotLbl;
var playerMoneyLbl;
var betOneLbl;
var betTenLbl;
var betMaxLbl;
var jackpotWinLbl;
var notenoughMoneylbl;
var startLbl;
var spinResultLbl;
//tally variable
var jackpot = 5000;
var playerMoney = 1000;
var grapes = 0;
var bananas = 0;
var oranges = 0;
var cherries = 0;
var bars = 0;
var bells = 0;
var sevens = 0;
var blanks = 0;
var winnings = 0;
var turn = 0;
var playerBet = 0;
var winNumber = 0;
var lossNumber = 0;
var winRatio = 0;
var spinResult;
var fruits = "";
// Preloader Function
function preload() {
    assets = new createjs.LoadQueue();
    assets.installPlugin(createjs.Sound);
    // event listener triggers when assets are completely loaded
    assets.on("complete", init, this);
    assets.loadManifest(manifest);
    //Setup statistics object
    //lead texture atlas
    textureAtlas = new createjs.SpriteSheet(atlas);
    setupStats();
}
// Callback function that initializes game objects
function init() {
    stage = new createjs.Stage(canvas); // reference to the stage
    stage.enableMouseOver(20);
    createjs.Ticker.setFPS(60); // framerate 60 fps for the game
    // event listener triggers 60 times every second
    createjs.Ticker.on("tick", gameLoop);
    // calling main game function
    main();
}
// function to setup stat counting
function setupStats() {
    stats = new Stats();
    stats.setMode(0); // set to fps
    // align bottom-right
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '430px';
    stats.domElement.style.top = '10px';
    document.body.appendChild(stats.domElement);
}
// Callback function that creates our Main Game Loop - refreshed 60 fps
function gameLoop() {
    stats.begin(); // Begin measuring
    stage.update();
    stats.end(); // end measuring
}
/* Utility function to check if a value falls within a range of bounds */
function checkRange(value, lowerBounds, upperBounds) {
    if (value >= lowerBounds && value <= upperBounds) {
        return value;
    }
    else {
        return !value;
    }
}
/* When this function is called it determines the betLine results.
e.g. Bar - Orange - Banana */
function Reels() {
    var betLine = [" ", " ", " "];
    var outCome = [0, 0, 0];
    for (var spin = 0; spin < 3; spin++) {
        outCome[spin] = Math.floor((Math.random() * 65) + 1);
        switch (outCome[spin]) {
            case checkRange(outCome[spin], 1, 27):
                betLine[spin] = "blankSym";
                blanks++;
                break;
            case checkRange(outCome[spin], 28, 37):
                betLine[spin] = "grapesSym";
                grapes++;
                break;
            case checkRange(outCome[spin], 38, 46):
                betLine[spin] = "bananaSym";
                bananas++;
                break;
            case checkRange(outCome[spin], 47, 54):
                betLine[spin] = "orangeSym";
                oranges++;
                break;
            case checkRange(outCome[spin], 55, 59):
                betLine[spin] = "cherrySym";
                cherries++;
                break;
            case checkRange(outCome[spin], 60, 62):
                betLine[spin] = "barSym";
                bars++;
                break;
            case checkRange(outCome[spin], 63, 64):
                betLine[spin] = "bellSym";
                bells++;
                break;
            case checkRange(outCome[spin], 65, 65):
                betLine[spin] = "sevenSym";
                sevens++;
                break;
        }
    }
    return betLine;
}
/* This function calculates the player's winnings, if any */
function determineWinnings() {
    if (blanks == 0) {
        if (grapes == 3) {
            winnings = playerBet * 10;
        }
        else if (bananas == 3) {
            winnings = playerBet * 20;
        }
        else if (oranges == 3) {
            winnings = playerBet * 30;
        }
        else if (cherries == 3) {
            winnings = playerBet * 40;
        }
        else if (bars == 3) {
            winnings = playerBet * 50;
        }
        else if (bells == 3) {
            winnings = playerBet * 75;
        }
        else if (sevens == 3) {
            winnings = playerBet * 100;
        }
        else if (grapes == 2) {
            winnings = playerBet * 2;
        }
        else if (bananas == 2) {
            winnings = playerBet * 2;
        }
        else if (oranges == 2) {
            winnings = playerBet * 3;
        }
        else if (cherries == 2) {
            winnings = playerBet * 4;
        }
        else if (bars == 2) {
            winnings = playerBet * 5;
        }
        else if (bells == 2) {
            winnings = playerBet * 10;
        }
        else if (sevens == 2) {
            winnings = playerBet * 20;
        }
        else if (sevens == 1) {
            winnings = playerBet * 5;
        }
        else {
            winnings = playerBet * 1;
        }
        winNumber++;
        showWinMessage();
        stage.removeChild(spinResultLbl);
        spinResultLbl = new objects.Label("+" + winnings.toString(), 260, 385, false);
        stage.addChild(spinResultLbl);
    }
    else {
        lossNumber++;
        showLossMessage();
        stage.removeChild(spinResultLbl);
        spinResultLbl = new objects.Label("-" + playerBet.toString(), 260, 385, false);
        stage.addChild(spinResultLbl);
    }
}
/* Utility function to show a loss message and reduce player money */
function showLossMessage() {
    playerMoney -= playerBet;
    stage.removeChild(winMsg);
    stage.removeChild(loseMsg);
    stage.removeChild(jackpotWinLbl);
    stage.removeChild(notenoughMoneylbl);
    ///adding the label that comes up when player loses
    loseMsg = new objects.Label("You Lose", 160, 80, false);
    stage.addChild(loseMsg);
    resetFruitTally();
}
/* Utility function to show a win message and increase player money */
function showWinMessage() {
    playerMoney += winnings;
    stage.removeChild(loseMsg);
    stage.removeChild(winMsg);
    stage.removeChild(jackpotWinLbl);
    stage.removeChild(notenoughMoneylbl);
    //adding that comes up when player wins
    winMsg = new objects.Label("You Won", 160, 80, false);
    stage.addChild(winMsg);
    resetFruitTally();
    checkJackPot();
}
/* Check to see if the player won the jackpot */
function checkJackPot() {
    /* compare two random values */
    var jackPotTry = Math.floor(Math.random() * 51 + 1);
    var jackPotWin = Math.floor(Math.random() * 51 + 1);
    if (jackPotTry == jackPotWin) {
        stage.removeChild(loseMsg);
        stage.removeChild(winMsg);
        stage.removeChild(jackpotWinLbl);
        stage.removeChild(notenoughMoneylbl);
        //adding label that will be shown when player will win a jackpot
        jackpotWinLbl = new objects.Label("You Won a Jackpot", 140, 80, false);
        stage.addChild(jackpotWinLbl);
        playerMoney += jackpot;
        jackpot = 1000;
    }
}
//function to set player bet
function setPlayerBet(bet) {
    playerBet = bet;
}
/* Utility function to reset all fruit tallies */
function resetFruitTally() {
    grapes = 0;
    bananas = 0;
    oranges = 0;
    cherries = 0;
    bars = 0;
    bells = 0;
    sevens = 0;
    blanks = 0;
}
/* Utility function to reset the player stats */
function resetAll() {
    playerMoney = 1000;
    winnings = 0;
    jackpot = 5000;
    turn = 0;
    playerBet = 0;
    winNumber = 0;
    lossNumber = 0;
    winRatio = 0;
}
/* Utility function to show Player Stats */
function showPlayerStats() {
    winRatio = winNumber / turn;
    stage.removeChild(playerMoneyLbl);
    stage.removeChild(jackpotLbl);
    jackpotLbl = new objects.Label("$" + jackpot.toString(), 170, 133, false);
    playerMoneyLbl = new objects.Label("$" + playerMoney.toString(), 45, 385, false);
    stage.addChild(jackpotLbl);
    stage.addChild(playerMoneyLbl);
}
// Callback functions that allows me to respond to button click events
//function that will work when pressed spin button
function spinButtonClicked(event) {
    createjs.Sound.play("clicked");
    if (playerMoney == 0) {
        if (confirm("You ran out of Money! \nDo you want to play again?")) {
            resetAll();
            showPlayerStats();
        }
    }
    else if (playerBet > playerMoney) {
        stage.removeChild(loseMsg);
        stage.removeChild(winMsg);
        stage.removeChild(jackpotWinLbl);
        stage.removeChild(notenoughMoneylbl);
        notenoughMoneylbl = new objects.Label("You dont have enogh money for this bet", 100, 80, false);
    }
    else if (playerBet < 0) {
        alert("All bets must be a positive $ amount.");
    }
    else if (playerBet <= playerMoney) {
        spinResult = Reels();
        fruits = spinResult[0] + " - " + spinResult[1] + " - " + spinResult[2];
        determineWinnings();
        turn++;
        showPlayerStats();
    }
    else {
        alert("Please enter a valid bet amount");
    }
    // Iterate over the number of reels
    for (var index = 0; index < NUM_REELS; index++) {
        reelContainers[index].removeAllChildren();
        tiles[index] = new createjs.Bitmap("assets/images/" + spinResult[index] + ".png");
        reelContainers[index].addChild(tiles[index]);
    }
}
//function that will work on pressing reset button
function resetButtonClicked(event) {
    createjs.Sound.play("clicked");
    resetAll();
    showPlayerStats();
}
//function that will work when presset bet one button
function betOneButtonClicked(event) {
    createjs.Sound.play("clicked");
    setPlayerBet(1);
    stage.removeChild(betOneLbl);
    stage.removeChild(betTenLbl);
    stage.removeChild(betMaxLbl);
    betOneLbl = new objects.Label("$1", 160, 385, false);
    stage.addChild(betOneLbl);
}
//function that will work when pressed bet ten button
function betTenButtonClicked(event) {
    createjs.Sound.play("clicked");
    setPlayerBet(10);
    stage.removeChild(betOneLbl);
    stage.removeChild(betTenLbl);
    stage.removeChild(betMaxLbl);
    betTenLbl = new objects.Label("$10", 160, 385, false);
    stage.addChild(betTenLbl);
}
//function that will work when pressed bet max button
function betMaxButtonClicked(event) {
    createjs.Sound.play("clicked");
    setPlayerBet(playerMoney);
    stage.removeChild(betOneLbl);
    stage.removeChild(betTenLbl);
    stage.removeChild(betMaxLbl);
    betMaxLbl = new objects.Label("$" + playerMoney.toString(), 160, 385, false);
    stage.addChild(betMaxLbl);
}
//function that will work when clicked powerbutton
function powerButtonClicked(event) {
    createjs.Sound.play("poweroff");
    window.setTimeout(window.close(), 10000);
}
//function that will work when pressed start button
function startButtonClicked(event) {
    createjs.Sound.play("start");
    stage.addChild(spinButton);
    stage.addChild(resetButton);
    stage.addChild(betOne);
    stage.addChild(betMax);
    stage.addChild(betTen);
    resetAll();
    showPlayerStats();
    stage.removeChild(startButton);
    stage.removeChild(startLbl);
}
// Our Main Game Function
function main() {
    // add in slotmaachine grapics
    background = new createjs.Bitmap(assets.getResult("background"));
    stage.addChild(background);
    //to show the symbols in three screens
    for (var index = 0; index < NUM_REELS; index++) {
        reelContainers[index] = new createjs.Container();
        stage.addChild(reelContainers[index]);
    }
    reelContainers[0].x = 79;
    reelContainers[0].y = 236;
    reelContainers[1].x = 172;
    reelContainers[1].y = 236;
    reelContainers[2].x = 268;
    reelContainers[2].y = 236;
    // add SPIN button
    spinButton = new objects.Button("spinButton", 288, 415, false);
    spinButton.on("click", spinButtonClicked, this);
    //add RESET button
    resetButton = new objects.Button("resetButton", 25, 415, false);
    resetButton.on("click", resetButtonClicked, this);
    //add BET ONE button
    betOne = new objects.Button("betOneButton", 90, 415, false);
    betOne.on("click", betOneButtonClicked, this);
    //add BET MAX button
    betMax = new objects.Button("betMaxButton", 156, 415, false);
    betMax.on("click", betMaxButtonClicked, this);
    //add BET TEN button
    betTen = new objects.Button("betTenButton", 222, 415, false);
    betTen.on("click", betTenButtonClicked, this);
    //add POWER button
    powerButton = new objects.Button("powerButton", 300, 70, false);
    stage.addChild(powerButton);
    powerButton.on("click", powerButtonClicked, this);
    //add START button
    startButton = new objects.Button("startButton", 260, 415, false);
    stage.addChild(startButton);
    startButton.on("click", startButtonClicked, this);
    //Add label that is visible when form loads
    startLbl = new objects.Label("Click 'START' button\n\n to start game", 25, 415, false);
    stage.addChild(startLbl);
}
//# sourceMappingURL=game.js.map
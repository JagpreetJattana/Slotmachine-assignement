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
    { id: "clicked", src: "assets/audio/clicked.wav" }
];
var atlas = {
    "images": ["assets/images/atlas.png"],
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
        [185, 155, 49, 49]
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
        "spinButton": [12]
    }
};
// Game Variables
var background;
var textureAtlas;
var spinButton;
var betOne;
var betTen;
var betMax;
var resetButton;
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
// Callback function that allows me to respond to button click events
function spinButtonClicked(event) {
    createjs.Sound.play("clicked");
    spinResult = Reels();
    fruits = spinResult[0] + " - " + spinResult[1] + " - " + spinResult[2];
    console.log(fruits);
    // Iterate over the number of reels
    for (var index = 0; index < NUM_REELS; index++) {
        reelContainers[index].removeAllChildren();
        tiles[index] = new createjs.Bitmap("assets/images/" + spinResult[index] + ".png");
        reelContainers[index].addChild(tiles[index]);
    }
}
/* Check to see if the player won the jackpot */
function checkJackPot() {
    /* compare two random values */
    var jackPotTry = Math.floor(Math.random() * 51 + 1);
    var jackPotWin = Math.floor(Math.random() * 51 + 1);
    if (jackPotTry == jackPotWin) {
        alert("You Won the $" + jackpot + " Jackpot!!");
        playerMoney += jackpot;
        jackpot = 1000;
    }
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
// Mouseover event
function pinkButtonOver() {
}
// Mouseout event
function pinkButtonOut() {
}
/* Utility function to show a win message and increase player money */
function showWinMessage() {
    playerMoney += winnings;
    //u  $("div#winOrLose>p").text("You Won: $" + winnings);
    resetFruitTally();
    checkJackPot();
}
// Our Main Game Function
function main() {
    // add in slotmaachine grapics
    background = new createjs.Bitmap(assets.getResult("background"));
    stage.addChild(background);
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
    // add spin button
    spinButton = new objects.Button("spinButton", 288, 415, false);
    stage.addChild(spinButton);
    spinButton.on("click", spinButtonClicked, this);
    resetButton = new objects.Button("resetButton", 25, 415, false);
    stage.addChild(resetButton);
    //spinButton.on("click", spinButtonClicked, this);
    betOne = new objects.Button("betOneButton", 90, 415, false);
    stage.addChild(betOne);
    //spinButton.on("click", spinButtonClicked, this);
    betMax = new objects.Button("betMaxButton", 156, 415, false);
    stage.addChild(betMax);
    //spinButton.on("click", spinButtonClicked, this);
    betTen = new objects.Button("betTenButton", 222, 415, false);
    stage.addChild(betTen);
    //spinButton.on("click", spinButtonClicked, this);
}
//# sourceMappingURL=game.js.map
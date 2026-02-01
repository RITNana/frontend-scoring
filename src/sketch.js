//import shared session variable and current task variable
/**
 * STATION:Monster Counterpart 
STOMACH: Torso 
BRAINS: Arms 
HEAD: Eyes 
BLEEDING: Arms
 */

// Scoring Principles:
// 0-5s : 45-50 points + multiplier (between 6.0 and 8.0 multiplier) - Good Monster Parts
// 5-10s : 35 - 40 points + multiplier (between 3.0 and 5.0) - Medium Monster Parts
// 10-14s : 30-35 points + multiplier (between 1.5 and 3.0) // Medium + Bad Monster Parts
// 15s + : 25 points (no multiplier ) - Bad Monster Part


let stringSesh = "000";

let cycleDuration = 3000;
let startTime;
let timeLimit = 10; // 10 seconds
let countDown;

let bgImg;
let idleVid;
let score;
let sessionData;

let complete = false;

let monsterTypes = ["cat", "demon", "mummy", "lava", "spider", "wolf"];

let monsterVids = [
  "media/monsters/monster_1.mp4",
  "media/monsters/monster_2.mp4",
  "media/monsters/monster_3.mp4",
  "media/monsters/monster_4.mp4",
  "media/monsters/monster_5.mp4",
  "media/monsters/monster_6.mp4",
];

function preload() {
  // Load JSON data
  sessionData = loadJSON("sessions.json");

  bgImg = loadImage("media/background.png");
}

function setup() {
  // Get the array of monsters for monster_1
  sessionSet = sessionData[stringSesh];

  let monsterType =
    monsterTypes[floor(random(monsterTypes.length))]; /*sessionSet.monsterType*/

  createCanvas(500, 900);
  console.log(monsterType);
  taskVideo = createVideo(`./media/${monsterType}/${monsterType}.mp4`, () => {
    // make it autoplay-safe
    taskVideo.volume(0); // p5 wrapper volume
    taskVideo.elt.muted = true; // HTML video must be muted
    taskVideo.elt.setAttribute("muted", "");
    taskVideo.elt.setAttribute("playsinline", ""); // iOS Safari inline playback
    taskVideo.loop(); // or .play()
    // taskVideo.play()
    taskVideo.hide(); // we’ll draw it to the canvas
  });
  taskVideo.loop();
  taskVideo.hide();

  // Record start time
  // startTime = millis();

  imageMode(CORNER);
}

function draw() {
  startTime = int(millis() / 1000); // converted to seconds for testing
  countDown = timeLimit - startTime; // countdown starts at 10
  if (complete) {
  } else {
    background(0);
    if (taskVideo) image(taskVideo, 0, 0, width, height);
  }

  if (countDown < 0) {
    countDown = 0;
  }

  textSize(22);
  fill("white");
  text("Score: " + score, 300, 50);

  textSize(22);
  fill("white");
  text("Timer: " + countDown, 300, 20);
}

function finalMonster() { 

}

let stringSesh = "000";

let startTime;
let totalTaskTime;
let timeLimit = 45;
let globalCountdown;

let bgImg;
let taskVideo;

let score = 0;
let taskSum = 0;
let totalScore = 0;
let multiplier;
let scoringComplete = false;

let scored_0_5 = false;
let scored_5_10 = false;
let scored_10_14 = false;
let scored_15 = false;

let sessionData;
let sessionSet;

let complete = false;

let monsterTypes = ["cat", "demon", "mummy", "lava", "spider", "wolf"];
let monsterType;

/* STATION -> Monster counterpart
   STOMACH: Torso
   BRAINS: Arms
   HEAD: Eyes
   BLEEDING: Legs  (if you truly mean arms, swap the mapping below)
*/

// ---------- Modular part state ----------
const PARTS = ["torso", "head", "leftArm", "rightArm", "leftLeg", "rightLeg"];

// holds loaded p5.Image objects per part
let monsterImgs = {};
let monsterLoading = {};
let monsterError = {};

for (const p of PARTS) {
  monsterImgs[p] = null;
  monsterLoading[p] = false;
  monsterError[p] = "";
}

// Which limb score drives which part quality
// NOTE: If BLEEDING should drive ARMS instead of LEGS, change leftLeg/rightLeg to brainScore or bleedingScore accordingly.
const SCORE_FOR_PART = {
  torso: (s) => s.stomachScore,       // STOMACH
  leftArm: (s) => s.brainScore,       // BRAINS
  rightArm: (s) => s.brainScore,      // BRAINS
  head: (s) => s.eyeScore,            // HEAD (eyes)
  leftLeg: (s) => s.bleedingScore,    // BLEEDING
  rightLeg: (s) => s.bleedingScore,   // BLEEDING
};

// Draw order (back -> front)
const LAYERS = ["leftLeg", "rightLeg", "torso", "leftArm", "rightArm", "head"];

// If scoreCalc.js defines generateScores() globally (non-module)
let scores;

function preload() {
  sessionData = loadJSON("sessions.json");
  bgImg = loadImage("./media/background.png");
}

function setup() {
  createCanvas(500, 900);
  imageMode(CORNER);

  sessionSet = sessionData[stringSesh];
  monsterType = "wolf"/*monsterTypes[sessionSet.monsterType]*/;
  console.log("monsterType:", monsterType);

  // Create task video
  taskVideo = createVideo(`./media/${monsterType}/${monsterType}.mp4`, () => {
    taskVideo.volume(0);
    taskVideo.elt.muted = true;
    taskVideo.elt.setAttribute("muted", "");
    taskVideo.elt.setAttribute("playsinline", "");
    taskVideo.loop();
    taskVideo.hide();
  });
  taskVideo.loop();
  taskVideo.hide();

  scores = generateScores();
  console.log("stomach score:", scores.stomachScore);
}

// Load one part based on its mapped score -> quality -> file path
function loadMonsterPart(part) {
  const limbScore = SCORE_FOR_PART[part](scores);
  const q = limbQuality(limbScore);
  const path = `./media/${monsterType}/${q}/${q}-${part}.png`;

  console.log(`loading ${part}:`, path);

  monsterLoading[part] = true;
  monsterError[part] = "";
  monsterImgs[part] = null;

  loadImage(
    path,
    (img) => {
      monsterImgs[part] = img;
      monsterLoading[part] = false;
      console.log(`Loaded ${part} OK:`, path);
    },
    (err) => {
      monsterLoading[part] = false;
      monsterError[part] = path;
      console.error(`Failed to load ${part}:`, path, err);
    }
  );
}

function createMonster() {
  complete = true;

  // reset previous monster
  for (const p of PARTS) {
    monsterImgs[p] = null;
    monsterLoading[p] = false;
    monsterError[p] = "";
  }

  // load all parts
  for (const p of PARTS) {
    loadMonsterPart(p);
  }
}

function drawMonster(x = 0, y = 0, w = width, h = height) {
  for (const part of LAYERS) {
    const img = monsterImgs[part];
    if (img) image(img, x, y, w, h);
  }
}

function draw() {
  totalTaskTime = int(millis() / 1000);
  globalCountdown = timeLimit - totalTaskTime;
  if (globalCountdown < 0) globalCountdown = 0;

  if (complete) {
    background(bgImg);

    // draw layered monster (full canvas for now)
    drawMonster(0, 0, width, height);

    // optional: loading debug
    fill(255);
    textSize(14);
    let yy = 40;
    for (const p of PARTS) {
      if (monsterLoading[p]) {
        text(`Loading ${p}...`, 20, yy);
        yy += 18;
      } else if (monsterError[p]) {
        text(`Failed ${p}`, 20, yy);
        yy += 18;
      }
    }
  } else {
    background(0);
    if (taskVideo) image(taskVideo, 0, 0, width, height);
  }

  // Scoring gates
  if (!scoringComplete) {
    if (totalTaskTime >= 5 && !scored_0_5) { totalScore += scoring(); scored_0_5 = true; }
    if (totalTaskTime >= 10 && !scored_5_10) { totalScore += scoring(); scored_5_10 = true; }
    if (totalTaskTime >= 14 && !scored_10_14) { totalScore += scoring(); scored_10_14 = true; }
    if (totalTaskTime >= 15 && !scored_15) { totalScore += scoring(); scored_15 = true; }
  }

  if (totalTaskTime >= timeLimit) scoringComplete = true;

  // UI
  fill("white");
  textSize(22);
  text("Score: " + totalScore, 300, 50);
  text("Timer: " + totalTaskTime, 300, 20);

  fill("red");
  textSize(45);
  text(globalCountdown, 240, 90);
}

function limbQuality(limbScore) {
  if (limbScore <= 200) return "bad";
  if (limbScore <= 399) return "medium";
  return "good";
}

function scoring() {
  if (totalTaskTime > 0 && totalTaskTime <= 5) {
    score = int(random(45, 51));
    multiplier = random(6.0, 8.1);
    taskSum = int(score * multiplier);
    return taskSum;
  } else if (totalTaskTime > 5 && totalTaskTime <= 10) {
    score = int(random(35, 41));
    multiplier = random(3.0, 5.1);
    taskSum = int(score * multiplier);
    return taskSum;
  } else if (totalTaskTime > 10 && totalTaskTime <= 14) {
    score = int(random(30, 36));
    multiplier = random(1.5, 3.1);
    taskSum = int(score * multiplier);
    return taskSum;
  } else {
    return 25;
  }
}

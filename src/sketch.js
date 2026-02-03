//import shared session variable and current task variable
//import {generateScores} from "./scoreCalc.js";

let stringSesh = "000"


let cycleDuration = 3000;
let startTime;

let bgImg;
let idleVid;
let totalScore;
let scores;
let sessionData;

let complete = false;

let monsterTypes = ["cat", "demon", "mummy", "lava", "spider", "wolf"]
let monsterType;

let bodyParts = ["head", "leftArm", "rightArm", "leftLeg", "rightLeg", "torso"];
let qualities = ["good", "medium", "bad"]


//final monster image
let torsoImg = null;
let torsoLoading = false;

function preload() {
  // Load JSON data
  sessionData = loadJSON('sessions.json');

  bgImg = loadImage("./media/background.png")

  sessionSet = sessionData[stringSesh]

  monsterType = monsterTypes[sessionSet.monsterType];

  for(let i = 0; i < qualities.length; i++){
    for(let j = 0; j < bodyParts.length; j++){
      loadImage(`./media/${monsterType}/${qualities[i]}/${qualities[i]}-${bodyParts[j]}.png`)
    }
    if(monsterType == "spider"){
      loadImage(`./media/${monsterType}/${qualities[i]}/${qualities[i]}-spiderLegs.png`)
    }
  }


  
  //bgImg = loadImage("./media/background.png")
}

function setup() {
  // Get the array of monsters for monster_1
  sessionSet = sessionData[stringSesh]

  monsterType = monsterTypes[sessionSet.monsterType];

  createCanvas(500, 900);
  console.log(monsterType)
  taskVideo = createVideo(`./media/${monsterType}/${monsterType}.mp4`, () => {
    // make it autoplay-safe
    taskVideo.volume(0); // p5 wrapper volume
    taskVideo.elt.muted = true; // HTML video must be muted
    taskVideo.elt.setAttribute("muted", "");
    taskVideo.elt.setAttribute("playsinline", ""); // iOS Safari inline playback
    taskVideo.loop(); // or .play()
    taskVideo.hide(); // we’ll draw it to the canvas
  });
  taskVideo.loop();
  taskVideo.hide();


  // Record start time
  startTime = millis();

  imageMode(CORNER)

  scores = generateScores();
  console.log("stomach score: " + scores.stomachScore)
}

function draw() {
  if(complete){
    background(bgImg)

    if (torsoImg) {
      image(torsoImg, 100, 100); // choose position/size you want
    } else if (torsoLoading) {
      fill(255);
      text("Loading...", 20, 40);
    }
  }
  else {
    background(0);
    if (taskVideo) image(taskVideo, 0, 0, width, height);
  }

  textSize(22);
  fill('white');
  text("Score: " + totalScore, 300, 50)

}


function createMonster() {
  complete = !complete;

  const q = limbQuality(scores.stomachScore);
  const path = `./media/${monsterType}/${q}/${q}-torso.png`;

  torsoLoading = true;
  torsoImg = null;

  loadImage(
    path,
    (img) => {
      torsoImg = img;        // ✅ p5.Image object
      torsoLoading = false;
      console.log("Loaded torso OK:", path);
    },
    (err) => {
      torsoLoading = false;
      console.error("Failed to load torso:", path, err);
    }
  );
}




//function createMonster() {
//  complete = !complete;
//
//  /*STATION:Monster Counterpart 
//    STOMACH: Torso 
//    BRAINS: Arms 
//    HEAD: Eyes
//    BLEEDING: Arms */
//
//  image(`./media/${monsterType}/${limbQuality(scores.stomachScore)}/${limbQuality(scores.stomachScore)}-torso.png`)
//
//  if(monsterType == "spider"){
//
//  }
//
//
//}

function limbQuality(limbScore){
  let quality = "";
  if(limbScore <= 200){
    quality = "bad"
  }
  else if(limbScore <= 399){
    quality = "medium"
  }
  else{
    quality = "good"
  }

  return quality;
}
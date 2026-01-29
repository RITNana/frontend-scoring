//import shared session variable and current task variable

let stringSesh = "000"
let currentSession = parseInt(stringSesh);

let monstersData;
let monsterSet;

let monsterimg = []; // holds bad, ok, good images
let cycleDuration = 3000; // how long each image stays (ms)
let startTime;

let bgImg;
let idleVid;
let score;
let sessionData;

let complete = false;

let monsterVids = ["media/monsters/monster_1.mp4", 
  "media/monsters/monster_2.mp4",
  "media/monsters/monster_3.mp4",
  "media/monsters/monster_4.mp4",
  "media/monsters/monster_5.mp4",
  "media/monsters/monster_6.mp4"];

function preload() {
  // Load JSON data
  monstersData = loadJSON('monsters.json');
  sessionData = loadJSON('sessions.json');
  
  bgImg = loadImage("media/background.png")
}

function setup() {
  // Get the array of monsters for monster_1
  monsterSet = monstersData['monster_1'];
  sessionSet = sessionData[stringSesh]

  let monsterType = floor(random(monsterVids.length));/*sessionSet.monsterType*/

  createCanvas(500, 900);
  taskVideo = createVideo(monsterVids[monsterType], () => {
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

  

  // Load each monster image
  if (monsterSet && Array.isArray(monsterSet)) {
    console.log("Monster names found in JSON:");
    for (let entry of monsterSet) {
      monsterimg.push(loadImage(entry.path));
      console.log(entry.name);
      console.log(entry.path);
    }
  } else {
    console.error("Could not find 'monster_1' array in monsters.json");
  }

  // Record start time
  startTime = millis();

  imageMode(CORNER)
}

function draw() {
  if(complete){
    
  }
  else {
    background(0);
    if (taskVideo) image(taskVideo, 0, 0, width, height);
  }

  textSize(22);
  fill('white');
  text("Score: " + score, 300, 50)

  //if (monsterimg.length === 0) return; // nothing loaded yet
//
  //// Calculate elapsed time since start
  //let elapsed = millis() - startTime;
//
  //// Each image shows for cycleDuration ms
  //// % gives looping behavior
  //let totalCycle = monsterimg.length * cycleDuration;
  //let currentIndex = Math.floor((elapsed % totalCycle) / cycleDuration);
//
  //// Display current image
  //tint(233, 255, 212, 220);
  //image(monsterimg[currentIndex], width/2 + 25, height/2 - 25, 372, 652);
  //noTint()
}

function finalMonster() {

}

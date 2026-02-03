// scoreCalc.js
function generateScores() {
    const randInt0to500 = () => Math.floor(Math.random() * 501);
  
    return {
      bleedingScore: randInt0to500(),
      brainScore: randInt0to500(),
      stomachScore: randInt0to500(),
      eyeScore: randInt0to500(),
    };
  }
  
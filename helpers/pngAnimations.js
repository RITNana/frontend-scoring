// png animation helper

window.pngAnimation = class {
    constructor(folderPath, frameCount, frameRate = 12, ext = "png") {
      this.frames = [];
      this.frameCount = frameCount;
      this.frameRate = frameRate;
  
      this.playing = false;
      this.startTime = 0;
      this.currentFrame = 0;
  
      // preload frames
      for (let i = 0; i < frameCount; i++) {
        const path = `${folderPath}/${i}.${ext}`;
        this.frames[i] = loadImage(
          path,
          () => {}, // ok
          (err) => console.warn("Missing frame:", path, err)
        );
      }
    }
  
    play() {
      this.playing = true;
      this.startTime = millis();
      this.currentFrame = 0;
    }
  
    stop() {
      this.playing = false;
    }
  
    draw(x = 0, y = 0, w = width, h = height) {
      if (!this.playing) return;
  
      const elapsed = millis() - this.startTime;
      const idx = Math.floor(elapsed / (1000 / this.frameRate));
  
      // stop when finished
      if (idx >= this.frameCount) {
        this.playing = false;
        return;
      }
  
      this.currentFrame = idx;
  
      const img = this.frames[this.currentFrame];
  
      // guard: frame not loaded or missing
      if (!img || !img.width) return;
  
      image(img, x, y, w, h);
    }
  };
  
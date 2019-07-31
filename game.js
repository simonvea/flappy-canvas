
class GameArea {
  constructor(canvas, obstacleInterval = 70) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.isPlaying = false;
    this.obstacles = [];
    this.obstacleInterval = obstacleInterval;
  }

  start(updateFunc) {
    this.interval = setInterval(updateFunc, 20);
    this.frameNo = 0;
    this.isPlaying = true;
  }

  stop() {
    clearInterval(this.interval)
    this.isPlaying = false;
  }

  clear() {
    this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
  }

}

export default GameArea

class Component {

  constructor(width, height, color, x, y, canvas, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.canvas = canvas;
    this.speedX = 0;
    this.speedY = 0;
    this.gravity = 0.1;
    this.gravitySpeed = 0;
  }

  update() {
    const ctx = this.canvas.getContext('2d');
    if(this.type === 'text') {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = this.color;
      ctx.fillText(this.text, this.x, this.y);
    }
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  newPos() {
    this.gravitySpeed += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY + this.gravitySpeed;
    this.hitBottom();
    this.hitRoof();
  }

  hitBottom() {
    const rockbottom = this.canvas.height - this.height;
    if (this.y >= rockbottom) {
      this.y = rockbottom;
      return true
    }
    return false
  }

  hitRoof() {
    const roof = 2;
    if (this.y < roof) {
      this.y = roof;
      this.gravity = 0.1;
      this.gravitySpeed = 0;
    }
  }
  
  crashWith(otherobj) {
    const myleft = this.x;
    const myright = this.x + (this.width);
    const mytop = this.y;
    const mybottom = this.y + (this.height);
    const otherleft = otherobj.x;
    const otherright = otherobj.x + (otherobj.width);
    const othertop = otherobj.y;
    const otherbottom = otherobj.y + (otherobj.height);
    let crash = true;
    if ((mybottom < othertop) ||
      (mytop > otherbottom) ||
      (myright < otherleft) ||
      (myleft > otherright)) {
      crash = false;
    }
    return crash;
  }
  
  accelerate() {
    this.gravity = -0.5;
  }

  clearGravity() {
    this.gravity = 0.1;
  }
}

export default Component
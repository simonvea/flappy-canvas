import Component from './bird.js';
import GameArea from './game.js';

const CANVAS_WIDTH = window.innerWidth < 800 ? window.innerWidth: 800;
const CANVAS_HEIGHT = window.innerHeight < 800 ? window.innerHeight - 40: 800;
const FLAPPY_WIDTH = CANVAS_WIDTH/10;
const FLAPPY_HEIGHT = CANVAS_HEIGHT/10;

const overlay = document.querySelector('.overlay');
const scoreBoard = document.getElementById('score');
const container = document.querySelector('.container');
container.style.width = CANVAS_WIDTH + 'px';
container.style.height = CANVAS_HEIGHT + 'px';

const restartBtn = document.querySelector('.restart');
restartBtn.style.top = (CANVAS_HEIGHT / 2 - 22) + 'px';
restartBtn.style.left = (CANVAS_WIDTH / 2 - 77) + 'px';

const canvas = document.getElementById('flappy');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const FlappyGame = new GameArea(canvas, Math.round(FLAPPY_WIDTH*1.5));
let Flappy = new Component(FLAPPY_WIDTH, FLAPPY_HEIGHT, 'green', 20, CANVAS_HEIGHT/2, canvas);
let Score = new Component("20px", "Consolas", "black", CANVAS_WIDTH - CANVAS_WIDTH/3, 20, canvas, "text");
const scores = [];

function updateGame(game, player, score) {
  if(game.obstacles.length > 1){
    for(let obstacle of game.obstacles) {
      if(player.crashWith(obstacle) || player.hitBottom()) {
        game.stop();
        restartBtn.style.left = (CANVAS_WIDTH / 2 - 33) + 'px';
        restartBtn.style.display = 'block';
        overlay.style.display = 'block';

        scores.push(game.frameNo);
        const html = scores.sort((a,b) => a < b ? 1 :-1).map(score => `<li>${score}</li>`).join('');
        scoreBoard.innerHTML = html;

        return;
      } 
    }
  }

  game.clear();
  game.frameNo += 1;

  if (game.frameNo === 1 || everyinterval(game.obstacleInterval)) {
    const x = game.canvas.width;
    const minHeight = 20;
    const maxHeight = CANVAS_HEIGHT/3;
    const height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
    const minGap = FLAPPY_HEIGHT * 2;
    const maxGap = FLAPPY_HEIGHT * 4;
    const gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
    game.obstacles.push(new Component(10, height, "red", x, 0, game.canvas));
    game.obstacles.push(new Component(10, CANVAS_HEIGHT - height - gap, "red", x, height + gap, game.canvas));
    if(game.obstacles.length > 7) {
      game.obstacles.shift();
    }
  }

  for(let obstacle of game.obstacles) {
    obstacle.x -= 2;
    obstacle.update();
  }

  score.text = 'Score: ' + game.frameNo;
  score.update();
  player.newPos();
  player.update();

  function everyinterval(interval) {
    if ((game.frameNo / interval) % 1 == 0) {return true;}
    return false;
  }
}

function handleClick(e) {
  e.preventDefault();
  if(FlappyGame.isPlaying) {
    Flappy.accelerate()
  } else {
    restartGame()
  }
}

function handleClickEnd(e) {
  e.preventDefault();
  Flappy.clearGravity()
}

document.addEventListener('keypress', (e) => {
  if(e.charCode === 32) {
    handleClick(e);
  }
})
canvas.addEventListener('touchstart', handleClick)
canvas.addEventListener('mousedown', handleClick)

document.addEventListener('keyup', (e) => {
  if(e.keyCode === 32) {
    handleClickEnd(e);
  }
})

canvas.addEventListener('touchend', handleClickEnd)
canvas.addEventListener('mouseup', handleClickEnd)

restartBtn.addEventListener('click', restartGame);

function restartGame() {
  FlappyGame.stop()
  FlappyGame.clear()
  Flappy = new Component(FLAPPY_WIDTH,FLAPPY_HEIGHT,'green',20,CANVAS_HEIGHT/2,canvas);
  Score = new Component("20px", "Consolas", "black", CANVAS_WIDTH - CANVAS_WIDTH/3, 20, canvas, "text");
  FlappyGame.obstacles = [];
  restartBtn.style.display = 'none';
  restartBtn.innerText = 'Restart';
  overlay.style.display = 'none';
  FlappyGame.start(() => updateGame(FlappyGame,Flappy,Score));
}

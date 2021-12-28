let snakeCells = [
  { head: 99, tail: 80 },
  { head: 94, tail: 26 },
  { head: 43, tail: 17 },
  { head: 33, tail: 12 },
  { head: 91, tail: 73 },
  { head: 83, tail: 57 },
  { head: 69, tail: 31 },
  { head: 59, tail: 1 },
  { head: 56, tail: 48 },
  { head: 25, tail: 3 },
];
let width = 30;
let plyr;
let grid;
let game_started;
let game_over;
let locations = {};
let take_step;
let snakes_list;
let snake_colors = [
  "aqua",
  "green",
  "blueviolet",
  "chocolate",
  "maroon",
  "lawngreen",
  "orange",
  "purple",
  "orange",
  "pink",
];
let player_position = 1;
let mouse_clicked = false;
let player_emojis = [{ 1: "◼" }];
// let button;

// play Audio
function preload() {
  soundFormats("wav", "mp3");
  buzzer = loadSound("buzzer.wav");
  snake_hiss = loadSound("snake_hiss.mp3");
}
function setup() {
  createCanvas(600, 700);
  // button =createButton("Next") // created btn on canvas
  let button = select("#next");
  //button.mousePressed(mainFunc);

  locations[0] = { x: 50, y: 550 }; //locations of players
  game_started = false;
  game_over = false;
  take_step = false;
  moving = false;
  buzzer_alert = false;
  congrats = "";
  snakes_list = {};
  move_time = 0;
  turn = 1;

  let k = 1;
  let i = 1;
  let j = 10;

  //how player will move on a grid
  while (j > 0) {
    locations[k] = { x: i * 50, y: j * 50 };
    // console.log(`${locations[k].x}, ${locations[k].y}`);

    if (k % 10 == 0) {
      j = j - 1;
    } else {
      if (floor(k / 10) % 2 == 0) {
        i = i + 1;
      } else {
        i = i - 1;
      }
    }
    k++;
  }

  let emojis = random(player_emojis);

  dice = new score(6);
  // plyr = new Player(emojis[1], 0, dice);
  plyr = new Player(emojis[1], 0, dice);
  grid = new Grid(plyr, locations, snakeCells);
  active_plyr = plyr;
  active_emoji = plyr.emoji;

  // draw grid
  var sketch_canvas = function () {
    setup = function () {
      createCanvas(600, 60);
      pg = createGraphics(30, 30);
    };
  };
  p2 = new p5(sketch_canvas);
  dice.show();
}

function contains(a, k) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] == k) {
      return true;
    }
  }
  return false;
}

function draw() {
  if (!mouse_clicked) {
    background(35);
    dice.show();
    push();
    noStroke();
    textSize(20);
    fill("magenta");
    text(congrats, 200, 25);
    if (game_over) {
      if (mouseX > 250 && mouseX < 350 && mouseY > 570 && mouseY < 600) {
        playCol = "darkgray";
      } else {
        playCol = "gray";
      }
      fill(playCol);
    }
    pop();

    // created a object of snake_heads from snakeCells object
    let keys = [];
    let values = [];
    for (let snakes of snakeCells) {
      keys.push(snakes.head);
      values.push(snakes.tail);
      var snake_heads = {};
      for (var i = 0; i < keys.length; i++) {
        snake_heads[keys[i]] = values[i];
      }

      // moving player form snake's head to tail

      if (
        contains([snakes.head], active_plyr.loc) &&
        active_plyr.loc == active_plyr.prev &&
        t <= 100
      ) {
        take_step = true;
        roll = "";
        if (t >= 0) {
          snake_hiss.play();

          // text function takes 3 parameters 1:text we want to show on a window 2:x position of the text 3: y position of the text
          // we loop through the x, y position and slide down the player through snake's body
          text(
            active_plyr.emoji,
            (1 - t / 10) * locations[active_plyr.loc].x +
              (t / 10) * locations[snake_heads[active_plyr.loc]].x,
            (1 - t / 10) * locations[active_plyr.loc].y +
              (t / 10) * locations[snake_heads[active_plyr.loc]].y +
              width
          );

          textSize(50);
          push();
          noStroke();

          if (t >= 10) {
            active_plyr.loc = snake_heads[active_plyr.loc];
            active_plyr.prev = snake_heads[active_plyr.loc];
            take_step = false;
            roll = "ROLL";
          }
        } else {
          textSize(50);
          text(
            active_plyr.emoji,
            locations[active_plyr.loc].x,
            locations[active_plyr.loc].y + 50
          );
        }
        t = t + 1;
      }
    }
  }

  // player will move according to a score after move_time
  if (mouse_clicked) {
    move_time = move_time + 1;
    if (move_time >= 1) {
      mouse_clicked = false;
      move_time = 0;
    }
  }
}

let nextbtn = document.querySelector(".next");

//var points = 6;
function mainFunc(points) {
  if (!take_step && !mouse_clicked) {
    n = 0;
    t = -5;
    console.log(n);
    //const points = 6;
    mouse_clicked = true;
    var points2 = points;
    // console.log(points2);
    dice.roll(points2);
    game_started = true;

    plyr.makeMove(points2); //move accroding to the random score
    active_plyr = plyr;

    if (game_over) {
      game_started = false;
      plyr.loc = 1;
      plyr.prev = 1;
      players = random(player_emojis);
      plyr.set_emoji(players[1]);
      active_plyr = plyr;
      active_emoji = plyr.emoji;
      game_over = false;
      take_step = false;
      moving = false;
      congrats = "";
      buzzer_alert = false;
    }
  }
}
// player class
class Player {
  constructor(emoji, plyr_num) {
    this.loc = 0;
    this.emoji = emoji;
    this.prev = 1;
    this.player_number = plyr_num;
  }

  //moving of player
  makeMove(k) {
    //  console.log(`k: ${k}`);
    // movement of player on 1st position of grid
    console.log(this.loc);
    if (this.loc <= 1  && k < 0) {
      k = 0;
      this.loc = 1;
    }

    if (this.loc == 0) {
      this.loc = this.loc + 1;
    }

    if (this.loc + k <= 100) {  
      this.prev = this.loc;
      this.loc = this.loc + k;
  
      if (this.loc == 100) {
        // game_over = true;
        congrats = "Congratulations! 🏆" + this.emoji;
      }
    } else {
      buzzer.play();
      buzzer_alert = true;
    }
    player_position = this.loc;
  }

  set_emoji(emoji) {
    this.emoji = emoji;
  }

  // show player on the grid
  show() {
    if (!take_step) {
      textSize(50);
      if (!game_started) {
        text(
          this.emoji,
          locations[this.loc].x + this.player_number * 50,
          locations[this.loc].y + 0 //position of player
        );
      } else {
        if (this.prev < this.loc) {
          frameRate(5);
          text(this.emoji, locations[this.prev].x, locations[this.prev].y + 40);
          this.prev = this.prev + 1;
        } else {
          text(this.emoji, locations[this.loc].x, locations[this.loc].y + 40);
        }
      }
    }
  }
}

// grid class
class Grid {
  constructor(player, cells, snakeCells) {
    this.player = player;
    this.cells = {};
    this.snakes = [];
    this.cells = cells;
    this.snakeCells = snakeCells;

    for (let i = 0; i < snakeCells.length; i++) {
      this.snakes.push(
        new Snake(
          this.cells[snakeCells[i].head].x,
          this.cells[snakeCells[i].head].y,
          this.cells[snakeCells[i].tail].x,
          this.cells[snakeCells[i].tail].y
        )
      );
      this.snakes[i].color = snake_colors[i];
    }
  }
  show() {
    strokeWeight(2);
    stroke("blue");
    push();

    for (let i = 1; i <= 100; i++) {
      let cols = ["#FFAFAF", "lightsalmon"];
      fill(color(cols[i % 2]));
      rect(locations[i].x, locations[i].y, 50, 50);
    }
    textSize(15);
    fill("green");
    noStroke();

    // numbering on box
    for (let i = 1; i <= 100; i++) {
      text(str(i), locations[i].x, locations[i].y + 50);

      // color head and tail of snake
      for (let snake of snakeCells) {
        if (str(i) == snake.head) {
          fill(color("red"));
          rect(locations[i].x, locations[i].y, 50, 50);
        } else if (str(i) == snake.tail) {
          fill(color("blue"));
          rect(locations[i].x, locations[i].y, 50, 50);
        } else {
          fill(color("#686D76"));
        }
      }
    }

    // show snakes on grid
    for (let i = 0; i < this.snakes.length; i++) {
      this.snakes[i].show();
    }

    pop();
    if (turn == 1) {
      this.player.show();
    } else {
      this.player.show();
    }
  }
}

// score class will generate a score to move a player on the grid
class score {
  constructor(score) {
    this.score = score;
  }
  show() {
    grid.show();
  }

  roll(points) {
    //this.score = random([-1, 1, 2, 3, 4, 5, 6]);
    this.score = points;
  }
}

// snake class
class Snake {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.l = dist(x1, y1, x2, y2);
    this.color = color("yellow");
  }

  show() {
    stroke(this.color);
    push();
    fill(this.color);
    strokeWeight(1);
    circle(this.x1 + 25, this.y1 + 25, this.l / 10);

    pop();
    noFill();

    let X1 = this.x1 + 25;
    let Y1 = this.y1 + 25;
    let X2 = this.x2 + 25;
    let Y2 = this.y2 + 25;

    for (let i = 1; i <= 100; i++) {
      textSize(50);
      strokeWeight(this.l / 40);
      stroke(this.color);

      line(X1, Y1, X2, Y2);
    }
  }
}

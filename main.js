// setup canvas
var ballCounter = document.querySelector('p');
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

var isGameOver = false;


// function to generate random number in a given range, but not zero
function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  //To prevent getting the value zero as output.(done so that velocity of balls is not zero)
  if (num===0){
    num = random(min,max);
  }
  return num;
}


// Constructor function for Shape
function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}

function Ball(x, y, velX, velY, color, size, exists){
  //dont miss the "this"!!!
  Shape.call(this, x, y, velX, velY, exists);

  this.color = color;
  this.size = size;
}
//this was missing
Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;


//defining the evil circle
function EvilCircle(x, y, exists, velX, velY, size, color){
  Shape.call(this, x, y, exists);
  this.velX = velX;
  this.velY = velY;
  this.size = size;
  this.color = color; 
}
//this was missing
EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;


/*
adding functions

Next, we use the arc() method to trace an arc shape on the paper. Its parameters are:
The x and y position of the arc's center — we are specifying our ball's x and y properties.
The radius of our arc — we are specifying our ball's size property.
The last two parameters specify the start and end number of degrees round the circle
that the arc is drawn between. Here we specify 0 degrees, and 2 * PI, 
which is the equivalent of 360 degrees in radians 
(annoyingly, you have to specify this in radians). 
That gives us a complete circle. If you had specified only 1 * PI, you'd get a semi-circle (180 degrees).
*/

//draws the ball , at the presnt x , y of a ball
Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

EvilCircle.prototype.drawEvilCircle = function() {
  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.strokeStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
}



//Testing

// var testBall = new Ball(50, 100, 4, 4, 'blue', 10);
// testBall.x
// testBall.size
// testBall.color
// testBall.draw()


//updates the x, y and the velocity direction of the ball.
Ball.prototype.update = function() {

  if((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
}


//Basically check bounds, if at boundry, make it cross over
EvilCircle.prototype.updateEvilCircle = function() {
this.size -= 0.035;
if(this.size <= 1){
  console.log("you lose!!!");
  isGameOver = true;
}
 if((this.x + this.size) >= width) {
    this.x -= this.size;
  }

  if((this.x - this.size) <= 0) {
    this.x += this.size;
  }

  if((this.y + this.size) >= height) {
    this.y -= this.size;
  }

  if((this.y - this.size) <= 0) {
    this.y += this.size;
  }
};


EvilCircle.prototype.setControls = function(){
  var _this = this;
  window.onkeydown = function(e) {
    if (e.keyCode === 65) {
      _this.x -= _this.velX;
    } else if (e.keyCode === 68) {
      _this.x += _this.velX;
    } else if (e.keyCode === 87) {
      _this.y -= _this.velY;
    } else if (e.keyCode === 83) {
      _this.y += _this.velY;
    }
  };
};


//Detecting collisions
Ball.prototype.detectCollision = function() {
  for(var i = 0; i < 25; i++){
    if(this !== balls[i]){
      var delx = this.x - balls[i].x;
      var dely = this.y - balls[i].y;

      var dist = Math.sqrt(delx * delx + dely*dely);
      if(dist < this.size + balls[i].size){
        //not using this below if condition , caused collisions between balls displayed and those not displayed
        //but present, this is a fix, since i couldnt "delete" the balls that collided with EvilCircle. 
        if(balls[i].exists){
          this.color = balls[i].color = 'rgb(' +random(0,255) + ',' + random(0,255) + ',' + random(0,255) + ')';
 
        //does not preserve angular momentum as such! but still, looks good!
        //Just swapping the velocity directions of the two colliding balls.

        //two (or more) balls may get stuck sometimes , since the update rate is quite high
        //so directions get reversed , quite quickly: even before the balls actually separate.
        //FIX NEEDED.
        var t1 = this.velX;
        var t2 = this.velY;
        this.velX = balls[i].velX;
        this.velY = balls[i].velY;
        balls[i].velX = t1;
        balls[i].velY = t2;
        }
      }
    }
  }
};

//Defining this , after the inintialisation of evilcircle, gave cannot apply this on undefined error.

EvilCircle.prototype.detectCollisionEvilCircle = function() {
  for(var i = 0; i < balls.length; i++){
      if(balls[i].exists){
        var delx = this.x - balls[i].x;
        var dely = this.y - balls[i].y;

        var dist = Math.sqrt(delx * delx + dely*dely);
        if(dist < this.size + balls[i].size){
          balls[i].exists = false;
          //game was freezing because of this!
          //see https://stackoverflow.com/questions/742623/deleting-objects-in-javascript
          //delete balls[i];
          ballCount--;
          balls[i] == null;
          updateBallsLeft(ballCount);
          var tempSize = this.size + balls[i].size / 2;
          if(tempSize < 25){
            this.size = tempSize;
          }
      }
    }
  }
};

//Animating the balls
var balls = [];
var EvilCircle = new EvilCircle(random(0,width), random(0,height), true, 20, 20, 10, "white");
EvilCircle.setControls();
var ballCount = 0;
var updateBallsLeft = function(ballsLeft){
  ballCounter.textContent = "Balls Remaining: " + ballsLeft;

}

//initialising
while (balls.length < 25) {
  var ball = new Ball(
    random(0,width),
    random(0,height),
    random(-7,7),
    random(-7,7),
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
    random(10,20),
    true
  );
  balls.push(ball);
  ballCount++;
  updateBallsLeft(ballCount);
}


//updates the display , since several frames per second is created, a smooth animation is created
function loop() {
  
  //This is required in the loop , as the previous position of the ball
  //has to be blackended out again, otherwise , it will be like rays , instead of balls!
  //the 25% opacity is the reason behind why the balls leave a small(depending on their speed)
  //behind them. Read the comment at the end of this function to understand it clearly.  
  //changing this value from 0 to 1 will make the trails shorter!
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, width, height);
  EvilCircle.drawEvilCircle();
  EvilCircle.updateEvilCircle();
  EvilCircle.detectCollisionEvilCircle();
  
  for (var i = 0; i < balls.length; i++) {
    if(balls[i].exists){
      balls[i].draw();
      balls[i].update();
      balls[i].detectCollision();
    }
  }

  
  // Try commenting the below line , running the index.html
  // Then, entering this command in the console, repeatedly, to see what is actually going on. 
  if(ballCount === 0){
    console.log("Badhiyaaan! You Won!!!")
    isGameOver = true;
  }
  if(!(isGameOver)){
    //the game ends abruptly, in case of a win!, so a number of frames can be imposed after the games ends
    //Hence the ball will disappear, the the trail behind evil circle will also disappear!
    requestAnimationFrame(loop);
  }
}


loop();
//Once the program is running , try entering loop() in the console, say 5 times, do you observe something?
//The balls speed up! Do you understand why?
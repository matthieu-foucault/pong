var UP_ARROW = 38
var DOWN_ARROW = 40
var W = 87
var S = 83

$(document).click(function() {
  window.requestAnimationFrame(draw)
})

$(window).keydown(function(event){
  keys[event.keyCode] = true
})

$(window).keyup(function(event){
  delete keys[event.keyCode]
})

var prevT = undefined
var paddle1 = new Paddle(10, S, W)
var paddle2 = new Paddle(380, DOWN_ARROW, UP_ARROW)
var keys = {}

var game = {}

function startGame() {
  game.player1Loses = false
  game.player2Loses = false
}



function draw(t) {
  if (game.player1Loses) {
    alert('Player 1 loses')
    return
  } 
  
  if (game.player2Loses) {
    alert('Player 2 loses')
    return
  }
  
  if (prevT !== undefined) {
    var deltaT = t - prevT
    var ctx = document.getElementById('canvas').getContext('2d')
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.fillRect(0,0,400,200)
    ctx.fillStyle = 'black'
    ctx.save()
    
    drawMiddleLine(ctx)
    
    paddle1.updatePosition(deltaT)
    paddle1.draw(ctx)
    paddle2.updatePosition(deltaT)
    paddle2.draw(ctx)
    ball.updatePosition(deltaT)
    ball.draw(ctx)
    
    ctx.restore()
  }
  prevT = t
  window.requestAnimationFrame(draw)
}

function drawMiddleLine(ctx) {
  ctx.save()
  
  ctx.lineWidth = 5
  ctx.setLineDash([canvas.height/15,canvas.height/15])
  ctx.beginPath()
  ctx.moveTo(200,0)
  ctx.lineTo(200,200)
  ctx.stroke()    

  ctx.restore()
}

function plusOrMinusOne() {
  return Math.random() < 0.5 ? -1 : 1
}

/*
  Returns the shortest distance between a point and a segment
  from http://gamedev.stackexchange.com/a/50722
*/
function pointRectDist (px, py, rx, ry, rwidth, rheight)
{
  var cx = Math.max(Math.min(px, rx+rwidth ), rx);
  var cy = Math.max(Math.min(py, ry+rheight), ry);
  return Math.sqrt( (px-cx)*(px-cx) + (py-cy)*(py-cy) );
}

var ball = {
  x: 200,
  y: 100,
  vx: plusOrMinusOne() * 0.1,
  vy: plusOrMinusOne() * 0.1,
  radius: 10,
  draw: function(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.fill()
  },
  updatePosition: function(deltaT){
    this.x += deltaT * this.vx
    this.y += deltaT * this.vy
    this.checkPaddlesCollision()
    this.checkCanvasBoundaries()
  },
  checkPaddlesCollision: function() {
    if (pointRectDist(this.x, this.y, paddle1.x, paddle1.y, paddle1.width, paddle1.height) <= this.radius) {
      this.vx = Math.abs(this.vx * 1.1)
    }
    if (pointRectDist(this.x, this.y, paddle2.x, paddle2.y, paddle2.width, paddle2.height) <= this.radius) {
      this.vx = -Math.abs(this.vx * 1.1)
    }
  },
  checkCanvasBoundaries: function() {
    // check for boundaries
    if (this.y + this.radius + this.vy >= canvas.height) 
      this.vy = -Math.abs(this.vy)
      
    if (this.y - this.radius + this.vy <= 0) 
      this.vy = Math.abs(this.vy)
    
    if (this.x + this.radius + this.vx >= canvas.width)
      game.player2Loses = true
    
    if (this.x - this.radius + this.vx <= 0)
      game.player1Loses = true
  }
}

function Paddle(x, downKey, upKey) {
  this.y = 125
  this.x = x
  this.width = 10
  this.height = 50
  this.downKey = downKey
  this.upKey = upKey
  
  this.updatePosition = function(deltaT) {
    if (keys[this.downKey]) {
      this.y = Math.min(150, this.y + 0.3 * deltaT )
    }
    if (keys[this.upKey]) {
      this.y = Math.max(0, this.y - 0.3 * deltaT)
    }
  }
  
  this.draw = function(ctx) {
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}

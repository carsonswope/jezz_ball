var GameConstants = require('../constants/GameConstants');

var Ball = require('../util/Ball');

var MathUtil = require('../util/MathUtil')

function Segment(startCoord, endCoord, direction, segmentType){

  this.startCoord = startCoord;
  this.endCoord = endCoord;
  this.direction = direction;
  this.segmentType = segmentType || 'SOLID';

};

Segment.prototype.start = function(){
  return {
    startX: this.startX,
    startY: this.startY
  }
}

Segment.prototype.tick = function(dT){

  this.endCoord = {
    x: this.endCoord.x + (this.direction.dX * dT * GameConstants.NEW_WALL_SPEED),
    y: this.endCoord.y + (this.direction.dY * dT * GameConstants.NEW_WALL_SPEED)
  }

};

Segment.prototype.end = function(){
  return {
    endX: this.endX,
    endY: this.endY
  }
}

Segment.prototype.draw = function(ctx){

  ctx.beginPath();

  switch (this.segmentType) {
    case 'SOLID':
      ctx.fillStyle = GameConstants.SOLID_SEGMENT_COLOR;
      break;
    case 'DOWN':
      ctx.fillStyle = GameConstants.DOWN_COLOR;
      break;
    case 'UP':
      ctx.fillStyle = GameConstants.UP_COLOR;
      break;
  }

  GameConstants.LINE_WIDTH

  var vertices = this.vertices();

  // ctx.fillStyle = GameConstants.SOLID_SEGMENT_COLOR;

  ctx.fillRect(
    vertices.topLeftX,
    vertices.topLeftY,
    vertices.bottomRightX - vertices.topLeftX,
    vertices.bottomRightY - vertices.topLeftY
  );
  // ctx.fillRect(topLeftX, topLeftY, bottomRightX - topLeftX, bottomRightY - topLeftY);

}

Segment.prototype.allCoordinates = function() {

  this.startCoord
  this.endCoord

  var coords = []

  if (this.startCoord.x === this.endCoord.x) {
    //horizontal line

    if (this.startCoord.y < this.endCoord.y) {
      for (var i = this.startCoord.y; i <= this.endCoord.y; i++) {
        coords.push({
          x: this.startCoord.x,
          y: i
        });
      }
    } else {
      for (var i = this.startCoord.y; i >= this.endCoord.y; i--) {
        coords.push({
          x: this.startCoord.x,
          y: i
        });
      }
    }

  } else {
    //vertical line

    if (this.startCoord.x < this.endCoord.x) {
      for (var i = this.startCoord.x; i <= this.endCoord.x; i++) {
        coords.push({
          x: this.startCoord.y,
          y: i
        });
      }
    } else {
      for (var i = this.startCoord.x; i >= this.endCoord.x; i--) {
        coords.push({
          x: this.startCoord.y,
          y: i
        });
      }
    }

  }

  return coords;

};

Segment.prototype.vertices = function() {

  var toDrawCoords =
    ( this.startCoord.x < this.endCoord.x ||
      this.startCoord.y < this.endCoord.y) ?
    {
      origin: this.startCoord,
      next: this.endCoord
    } : {
      origin: this.endCoord,
      next: this.startCoord
    };

  var toDrawOnWorld = {
    origin: {
      x: (toDrawCoords.origin.x + 0.5) * GameConstants.LINE_WIDTH,
      y: (toDrawCoords.origin.y + 0.5) * GameConstants.LINE_WIDTH
    },
    next: {
      x: (toDrawCoords.next.x + 0.5) * GameConstants.LINE_WIDTH,
      y: (toDrawCoords.next.y + 0.5) * GameConstants.LINE_WIDTH
    },
  };

  return {
    topLeftX:         (toDrawOnWorld.origin.x) - (GameConstants.LINE_WIDTH * 0.5),
    topLeftY:         (toDrawOnWorld.origin.y) - (GameConstants.LINE_WIDTH * 0.5),
    topRightX:        (toDrawOnWorld.next.x) + (GameConstants.LINE_WIDTH * 0.5),
    topRightY:        (toDrawOnWorld.origin.y) - (GameConstants.LINE_WIDTH * 0.5),
    bottomLeftX:      (toDrawOnWorld.origin.x)   - (GameConstants.LINE_WIDTH * 0.5),
    bottomLeftY:      (toDrawOnWorld.next.y)   + (GameConstants.LINE_WIDTH * 0.5),
    bottomRightX:     (toDrawOnWorld.next.x)   + (GameConstants.LINE_WIDTH * 0.5),
    bottomRightY:     (toDrawOnWorld.next.y)   + (GameConstants.LINE_WIDTH * 0.5),
  }

}

Segment.prototype.acceptableBounce = function(ball, line) {

  var ballAngle = ball.angle;
  var ballX = ball.posX;
  var ballY = ball.posY;

  var newBall = new Ball(ballX, ballY, ballAngle);
  newBall.bounce(line);

  newBall.posX += Math.sin(newBall.angle);
  newBall.posY += Math.cos(newBall.angle);

  var origDistance = this.distanceCheck(ball);
  var newDistance = this.distanceCheck(newBall);

  return (origDistance.distance < newDistance.distance);


};

Segment.prototype.distanceCheck = function(point) {

  var vertices = this.vertices();

  var pX = point.posX;
  var pY = point.posY;

  var minimum = {
    distance: null,
    line: null
  };

  [{
    x1: vertices.topLeftX,
    y1: vertices.topLeftY,
    x2: vertices.topRightX,
    y2: vertices.topRightY,
    dir: 'HORIZONTAL'
  },{
    x1: vertices.bottomLeftX,
    y1: vertices.bottomLeftY,
    x2: vertices.bottomRightX,
    y2: vertices.bottomRightY,
    dir: 'HORIZONTAL'
  },{
    x1: vertices.topLeftX,
    y1: vertices.topLeftY,
    x2: vertices.bottomLeftX,
    y2: vertices.bottomLeftY,
    dir: 'VERTICAL'
  },{
    x1: vertices.topRightX,
    y1: vertices.topRightY,
    x2: vertices.bottomRightX,
    y2: vertices.bottomRightY,
    dir: 'VERTICAL'
  }].forEach(function(s, i){

    var dist = MathUtil.pDistance(
      pX, pY, s.x1, s.y1, s.x2, s.y2
    );


    if (!minimum.distance || minimum.distance > dist){
      minimum.distance = dist;
      minimum.line = s.dir;
    };

  });


  return minimum;

}

module.exports = Segment;

var GameConstants = require('../constants/GameConstants');

function Ball(posX, posY, angle) {
  this.angle = angle;
  this.posX = posX,
  this.posY = posY
};

Ball.prototype.draw = function(ctx) {

  ctx.beginPath();
  ctx.fillStyle = GameConstants.BALL_INSIDE_COLOR;
  ctx.strokeStyle = GameConstants.BALL_OUTLINE_COLOR;
  ctx.lineWidth = GameConstants.BALL_BORDER_WIDTH;

  var radius = GameConstants.BALL_RADIUS - ctx.lineWidth / 2;

  ctx.arc(
    this.posX, this.posY, radius, 0, Math.PI * 2
  );

  ctx.fill();
  ctx.stroke();

};

module.exports = Ball;

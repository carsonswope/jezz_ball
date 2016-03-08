var GameConstants = require('../constants/GameConstants');

function Segment(startX, startY, endX, endY, direction){
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.direction = direction;
};

Segment.prototype.start = function(){
  return {
    startX: this.startX,
    startY: this.startY
  }
}

Segment.prototype.tick = function(dT){
  this.endX = this.endX + (this.direction.dX * dT);
  this.endY = this.endY + (this.direction.dY * dT);
}

Segment.prototype.end = function(){
  return {
    endX: this.endX,
    endY: this.endY
  }
}

Segment.prototype.draw = function(ctx, segmentType){

  ctx.beginPath();

  switch (segmentType) {
    case 'SOLID':
      ctx.strokeStyle = GameConstants.SOLID_SEGMENT_COLOR;
      break;
  }

  ctx.beginPath();
  ctx.lineWidth = GameConstants.LINE_WIDTH;
  ctx.moveTo(this.startX, this.startY);
  ctx.lineTo(this.endX, this.endY);
  ctx.stroke();

}

module.exports = Segment;

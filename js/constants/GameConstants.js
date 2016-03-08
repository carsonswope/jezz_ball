
//
// this.canvas.width = GameConstants.CANVAS_WIDTH;
// this.canvas.height = GameConstants.CANVAS_HEIGHT;
//
// this.canvasContext = this.canvas.getContext('2d');


exports.CANVAS_WIDTH = 1000;
exports.CANVAS_HEIGHT = 600;

exports.NEW_WALL_SPEED = 0.04;
exports.BALL_SPEED = 0.5;
exports.PERCENTAGE_TO_WIN = 75;

exports.SOLID_SEGMENT_COLOR = 'black';
exports.DOWN_COLOR = 'rgba(0,0,200,0.5)';
exports.UP_COLOR = 'rgba(200,0,0,0.5)';


exports.BALL_OUTLINE_COLOR = 'green';
exports.BALL_INSIDE_COLOR = 'yellow';

exports.BALL_RADIUS = 8;
exports.BALL_BORDER_WIDTH = 0;

exports.LINE_WIDTH = 10;

exports.actions = {
  TICK: 'TICK',
  SET_CONTEXT: 'SET_CONTEXT',
  START_GAME: 'START_GAME',
  SWITCH_PLAYER_DIRECTION: 'SWITCH_PLAYER_DIRECTION',
  ATTEMPT_MOVE: 'ATTEMPT_MOVE',
  SET_PLAYER_POSITION: 'SET_PLAYER_POSITION'
};

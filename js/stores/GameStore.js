var AppDispatcher = require('../dispatcher/Dispatcher');
var Store = require('flux/utils').Store;

var GameConstants = require('../constants/GameConstants');
var BoardStore = require('./BoardStore');
var BallStore = require('./BallStore');

var MathUtil = require('../util/MathUtil');

var GameStore = new Store(AppDispatcher);

var _lives = 2;
var _level = 1;
var _time = 0;
var _direction = 'VERTICAL';
var _status = 'WAITING';
var _context;

GameStore.status = function() {
  return _status;
};

GameStore.finishGame = function() {
  _status = 'DEAD';
  GameStore.__emitChange();
};

GameStore.finishLevel = function() {
  _status = 'WAITING';
  _level += 1;
  _lives = _level + 1;

  GameStore.__emitChange();
};


GameStore.startLevel = function() {

  BoardStore.reset();
  BallStore.reset(_lives);
  _status = 'PLAYING';
  GameStore.__emitChange();

};

GameStore.startGame = function() {

  _lives = 2;
  _level = 1;

  GameStore.startLevel();

};

GameStore.tick = function(newTime) {

  var dT = newTime - _time;
  _time = newTime;

  BoardStore.tick(dT);
  BallStore.tick(dT);

  GameStore.checkForCollisions();

  GameStore.draw();

  GameStore.__emitChange();

};

GameStore.checkForCollisions = function() {

  var minDist = (GameConstants.LINE_WIDTH / 2) + GameConstants.BALL_RADIUS;

  var solidSegs = BoardStore.solidSegments();
  var balls = BallStore.balls();
  var dist;

  for (var i = 0; i < solidSegs.length; i++) {
    for (var j = 0; j < balls.length; j++) {

      dist = MathUtil.distanceCircleToSegment(
        balls[j], solidSegs[i]
      );

      if (dist < minDist) {
        GameStore.handleBallOnSolidSegmentCollision(
          balls[j], solidSegs[i]
        );
      }

    }
  }

};


GameStore.handleBallOnSolidSegmentCollision = function(ball, segment) {


  var segmentAngle = Math.atan2(
    segment.endX - segment.startX,
    segment.endY - segment.startY
  );

  var velX = Math.sin(ball.angle);
  var velY = Math.cos(ball.angle);

  if (segmentAngle == Math.PI / 2 || segmentAngle == - Math.PI / 2) {
    velY = -1 * velY;
  } else {
    velX = -1 * velX;
  }



  ball.angle = Math.atan2(velX, velY);

};

GameStore.draw = function() {

  _context.clearRect(0, 0,GameConstants.CANVAS_WIDTH, GameConstants.CANVAS_HEIGHT);

  BallStore.draw();
  BoardStore.draw();

};

GameStore.setContext = function(ctx) {

  _context = ctx;

};

GameStore.__onDispatch = function(payload) {
  switch (payload.actionType) {
    case GameConstants.actions.TICK:
      GameStore.tick(payload.time);
      break;
    case GameConstants.actions.START_GAME:
      GameStore.startLevel();
      break;
    case GameConstants.actions.SET_CONTEXT:
      GameStore.setContext(payload.context);
      break;

  }

}

module.exports = GameStore;

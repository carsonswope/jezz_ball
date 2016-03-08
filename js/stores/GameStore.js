var AppDispatcher = require('../dispatcher/Dispatcher');
var Store = require('flux/utils').Store;

var GameConstants = require('../constants/GameConstants');
var BoardStore = require('./BoardStore');
var BallStore = require('./BallStore');
var PlayerStore = require('./PlayerStore');

var MathUtil = require('../util/MathUtil');

var GameStore = new Store(AppDispatcher);

var _lives = 10;
var _level = 1;
var _time = 0;
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

  _lives = 10;
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

  var solidSegs = BoardStore.solidSegments();
  var beingMadeSegs = BoardStore.beingCreatedSegments();
  var balls = BallStore.balls();
  var dist;
  var toBounce;

  var minDist = GameConstants.BALL_RADIUS + 2;

  for (var j = 0; j < balls.length; j++) {

    toBounce = [];
    for (var i = 0; i < solidSegs.length; i++) {

      dist = solidSegs[i].distanceCheck(balls[j]);

      if (dist.distance < minDist && toBounce.indexOf(dist.line) === -1 &&
          solidSegs[i].acceptableBounce(balls[j], dist.line)) {
        toBounce.push(dist.line);
      }

    }

    toBounce.forEach(function(line){
      balls[j].bounce(line);
    });

  }

  var toRemove = [];

  for (var i = 0; i < beingMadeSegs.length; i++) {

    seg = beingMadeSegs[i];

    for (var j = 0; j < balls.length; j++) {

      dist = seg.distanceCheck(balls[j]);

      if (dist.distance < GameConstants.BALL_RADIUS && toRemove.indexOf(i) === -1){

        toRemove.push(i);

      }

    }
  }

  if (toRemove.length) {BoardStore.removeSegments(toRemove); }

  var solidSegs = BoardStore.solidSegments();
  var beingMadeSegs = BoardStore.beingCreatedSegments();
  var balls = BallStore.balls();

  var seg;
  var toSolidify = [];

  for (var i = 0; i < solidSegs.length; i++) {
    for (var j = 0; j < beingMadeSegs.length; j++) {

      seg = beingMadeSegs[j];

      var endCoordX = seg.endCoord.x// + (seg.direction.dX * 0.5);
      var endCoordY = seg.endCoord.y// + (seg.direction.dY * 0.5);

      var endPosX = (endCoordX + 0.5) * GameConstants.LINE_WIDTH;
      var endPosY = (endCoordY + 0.5) * GameConstants.LINE_WIDTH;

      dist = solidSegs[i].distanceCheck({
        posX: endPosX,
        posY: endPosY
      });

      if (dist.distance < GameConstants.LINE_WIDTH / 2) {

        seg.endCoord.x = Math.round(endCoordX);
        seg.endCoord.y = Math.round(endCoordY);

        toSolidify.push(j);
      }
    }
  }

  if (toSolidify.length) { BoardStore.solidifySegments(toSolidify); }

};

GameStore.draw = function() {

  _context.clearRect(0, 0,GameConstants.CANVAS_WIDTH, GameConstants.CANVAS_HEIGHT);

  BallStore.draw();
  BoardStore.draw();
  PlayerStore.draw();

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

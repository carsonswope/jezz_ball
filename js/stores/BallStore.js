var AppDispatcher = require('../dispatcher/Dispatcher');
var Store = require('flux/utils').Store;

var GameConstants = require('../constants/GameConstants');

var Ball = require('../util/Ball');

var BallStore = new Store(AppDispatcher);

var _balls = [];
var _context;

BallStore.reset = function(ballCount) {

  _balls = [];

  var lineWidth = GameConstants.LINE_WIDTH;
  var width = GameConstants.CANVAS_WIDTH * 0.5;
  var height = GameConstants.CANVAS_HEIGHT * 0.5;

  for (var i = 0; i < ballCount; i++) {

    //percentage of one quadrant:

    var dist = 0.2;

    var a = Math.random() * (Math.PI / 2) * dist;



    a += (Math.PI / 2) * ((1 - dist) / 2);

    a += (Math.PI / 2) * Math.floor(Math.random()*4);

    var angle = Math.random() * Math.PI * 2;
    angle = a;
    var randomX = (Math.random() * (width)) + (width / 2);
    var randomY = (Math.random() * (height))+ (height / 2);

    _balls.push(
      new Ball(randomX, randomY, angle)
    );
  }

};

BallStore.balls = function() {
  return _balls;
};

BallStore.tick = function(dT) {

  var ball;
  var dX;
  var dY;

  for (var i = 0; i < _balls.length; i++) {
    var ball = _balls[i];

    dX = Math.sin(ball.angle) * dT * GameConstants.BALL_SPEED;
    dY = Math.cos(ball.angle) * dT * GameConstants.BALL_SPEED;

    ball.posX += dX;
    ball.posY += dY;

    // if (ball.justCollidedWith) {
    //   ball.collideCount += 1
    //   ball.justCollidedWith += 1;
    // }
    //
    // if (ball.collideCount > 2) {
    //   ball.collideCount = 0;
    //   ball.justCollidedWith = null;
    // }

  }

};

BallStore.draw = function() {

  for (var i = 0; i < _balls.length; i++) {
    _balls[i].draw(_context);
  }

};

BallStore.setContext = function(ctx) {
  _context = ctx;
}

BallStore.__onDispatch = function(payload) {
  switch (payload.actionType) {
    case GameConstants.actions.SET_CONTEXT:
      BallStore.setContext(payload.context);
      break;
  }

}

module.exports = BallStore;

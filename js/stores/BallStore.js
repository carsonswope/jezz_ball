var AppDispatcher = require('../dispatcher/Dispatcher');
var Store = require('flux/utils').Store;

var GameConstants = require('../constants/GameConstants');

var Ball = require('../util/Ball');

var BallStore = new Store(AppDispatcher);

var _balls = [];
var _context;

BallStore.reset = function(ballCount) {

  _balls = [
    new Ball(300, 300)
  ];

};

BallStore.tick = function(dT) {

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

var AppDispatcher = require('../dispatcher/Dispatcher');
var Store = require('flux/utils').Store;

var GameConstants = require('../constants/GameConstants');
var BoardStore = require('../stores/BoardStore');
var BallStore = require('../stores/BallStore');

var GameStore = new Store(AppDispatcher);

var _level = 0;
var _time = 0;

GameStore.tick = function(newTime) {

  var dT = newTime - _time;
  _time = newTime;

  BoardStore.tick(dT);
  BallStore.tick(dT);

  GameStore.draw();

  GameStore.__emitChange();
};

GameStore.draw = function() {

  BoardStore.draw();
  BallStore.draw();

};


GameStore.__onDispatch = function(payload) {
  switch (payload.actionType) {
    case GameConstants.actions.TICK:
      GameStore.tick(payload.time);
      break;

  }

}

module.exports = GameStore;

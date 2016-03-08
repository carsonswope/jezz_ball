var AppDispatcher = require('../dispatcher/Dispatcher');
var GameConstants = require('../constants/GameConstants');

exports.setContext = function(ctx) {
  AppDispatcher.dispatch({
    actionType: GameConstants.actions.SET_CONTEXT,
    context: ctx
  });
};

exports.startGame = function() {
  AppDispatcher.dispatch({
    actionType: GameConstants.actions.START_GAME
  })

};

exports.tick = function(time) {
  AppDispatcher.dispatch({
    actionType: GameConstants.actions.TICK,
    time: time
  });
  requestAnimationFrame(exports.tick);
};

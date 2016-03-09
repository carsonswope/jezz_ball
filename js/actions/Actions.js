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

exports.startLevel = function() {
  AppDispatcher.dispatch({
    actionType: GameConstants.actions.START_LEVEL
  })
}

exports.tick = function() {
  requestAnimationFrame( function(time){
    AppDispatcher.dispatch({
      actionType: GameConstants.actions.TICK,
      time: time
    });
  });
};

exports.setPlayerPosition = function(xPos, yPos) {
  AppDispatcher.dispatch({
    actionType: GameConstants.actions.SET_PLAYER_POSITION,
    position: {
      xPos: xPos,
      yPos: yPos
    }
  });
};

exports.switchPlayerDirection = function(){
  AppDispatcher.dispatch({
    actionType: GameConstants.actions.SWITCH_PLAYER_DIRECTION
  })
}

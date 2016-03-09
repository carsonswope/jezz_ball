var AppDispatcher = require('../dispatcher/Dispatcher');
var Store = require('flux/utils').Store;

var GameConstants = require('../constants/GameConstants');
var Actions = require('../actions/Actions');

var Segment = require('../util/Segment');

var BoardStore = require('../stores/BoardStore');

var Ball = require('../util/Ball');

var PlayerStore = new Store(AppDispatcher);

var _direction = 'VERTICAL';
var _context;

var _position = {
  xPos: 50,
  yPos: 50
};

PlayerStore.draw = function() {

  _context.beginPath();
  _context.lineWidth = 4;
  _context.arc(_position.xPos, _position.yPos, 5, 0, Math.PI * 2);
  _context.stroke();
  _context.beginPath();

  var lines = {
    HORIZONTAL:   [[3,0,10,0],[-3,0,-10,0]],
    VERTICAL: [[0,3,0,10],[0,-3,0,-10]]
  }

  lines[_direction].forEach(function(line){
    _context.moveTo(_position.xPos + line[0], _position.yPos + line[1]);
    _context.lineTo(_position.xPos + line[2], _position.yPos + line[3]);
    _context.stroke();
  });

};

PlayerStore.setContext = function(ctx) {
  _context = ctx;
};

PlayerStore.setPosition = function(position) {

  _position = position;
}

PlayerStore.switchPlayerDirection = function() {

  _direction = _direction === 'VERTICAL' ?
    'HORIZONTAL' : 'VERTICAL';
}

PlayerStore.attemptMove = function() {

  var d = GameConstants.NEW_WALL_SPEED;
  var directions = _direction === 'VERTICAL' ?
    [{dX: 0, dY: 1}, {dX:  0, dY: -1}] :
    [{dX: 1, dY: 0}, {dX: -1, dY:  0}];

  var xCoord = Math.round((_position.xPos - GameConstants.LINE_WIDTH / 2) / GameConstants.LINE_WIDTH);
  var yCoord = Math.round((_position.yPos - GameConstants.LINE_WIDTH / 2) / GameConstants.LINE_WIDTH);

  var boardSegments = BoardStore.beingCreatedSegments();

  if (!boardSegments.length && BoardStore.cell(xCoord, yCoord) === 'NONE') {

    BoardStore.setNewSegments( [
      new Segment(
        {x: xCoord, y: yCoord},
        {x: xCoord, y: yCoord},
        // {x: xCoord + (directions[0].dX), y: yCoord + (directions[0].dY)},
        // {x: xCoord + (directions[0].dX), y: yCoord + (directions[0].dY)},
        directions[0],
        'UP'
      ),

      new Segment(
        {x: xCoord, y: yCoord},
        {x: xCoord, y: yCoord},
        directions[1],
        'DOWN'
      )
    ]);

  }

}

PlayerStore.__onDispatch = function(payload) {
  switch (payload.actionType) {
    case GameConstants.actions.SET_CONTEXT:
      PlayerStore.setContext(payload.context);
      break;
    case GameConstants.actions.SET_PLAYER_POSITION:
      PlayerStore.setPosition(payload.position);
      break;
    case GameConstants.actions.SWITCH_PLAYER_DIRECTION:
      PlayerStore.switchPlayerDirection();
      break;
    case GameConstants.actions.ATTEMPT_MOVE:
      PlayerStore.attemptMove();
      break;
  }



}

module.exports = PlayerStore;

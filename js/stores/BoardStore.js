var AppDispatcher = require('../dispatcher/Dispatcher');
var Store = require('flux/utils').Store;

var GameConstants = require('../constants/GameConstants');

var Segment = require('../util/Segment');


var BoardStore = new Store(AppDispatcher);

var _solidSegments = [];
var _beingCreatedSegments = [];
var _rectangles = [];
var _context;
var _cells = {};
var _blockedOff = 0;
var _total = 1;

var _horizontalDivisions = 0;
var _verticalDivisions = 0;

// a segment looks like this:
//  {
//   startX:
//   startY:
//   endX:
//   endY:
//  }

BoardStore.tick = function(dT) {

  for (var i = 0; i < _beingCreatedSegments.length; i++) {
    _beingCreatedSegments[i].tick(dT);
  }

};

BoardStore.solidSegments = function() {
  return _solidSegments;
};

BoardStore.solidifySegments = function(segs) {


  var newSolidSegs = []

  if (segs.length === 2) {
    newSolidSegs.push( _beingCreatedSegments.pop());
    newSolidSegs.push(_beingCreatedSegments.pop());
  } else if (segs[0] === 1) {
    newSolidSegs.push(_beingCreatedSegments.pop());
  } else {
    newSolidSegs.push(_beingCreatedSegments.shift());
  }

  newSolidSegs.forEach(function(solidSeg){
    solidSeg.allCoordinates().forEach(function(coord){
      if (_cells[coord.x][coord.y] === 'NONE'){
        _cells[coord.x][coord.y] = 'WALL';
        _blockedOff += 1;
      }
    });

  });

  _solidSegments = _solidSegments.concat(newSolidSegs);
}

BoardStore.cell = function(x,y) {

  debugger;

  return _cells[x][y];
}

BoardStore.removeSegments = function(segs) {

  if (segs.length === 2) {
    _beingCreatedSegments.pop();
    _beingCreatedSegments.pop();
  } else if (segs[0] === 1) {
    _beingCreatedSegments.pop();
  } else {
    _beingCreatedSegments.shift();
  }
}


BoardStore.beingCreatedSegments = function() {
  return _beingCreatedSegments;
};

BoardStore.setNewSegments = function(segments) {
  _beingCreatedSegments = segments;
};


BoardStore.draw = function() {

  var segment;

  for (var i = 0; i < _solidSegments.length; i++) {
    _solidSegments[i].draw(_context, 'SOLID');
  }

  for (var i = 0; i < _beingCreatedSegments.length; i++) {
    _beingCreatedSegments[i].draw(_context, 'SOLID');
  }

};

BoardStore.reset = function() {

  _horizontalDivisions = Math.floor(GameConstants.CANVAS_WIDTH /  GameConstants.LINE_WIDTH) - 1;
  _verticalDivisions = Math.floor(GameConstants.CANVAS_HEIGHT / GameConstants.LINE_WIDTH) - 1;

  var h = _verticalDivisions;
  var w = _horizontalDivisions;

  for (var i = 0; i <= _horizontalDivisions; i++) {
    _cells[i] = {};

    for (var j = 0; j <= _verticalDivisions; j++) {

      _cells[i][j] = 'NONE';
    }
  }

  _solidSegments = [
    new Segment({x: 0,   y: 0}, {x: 0,   y: h}),
    new Segment({x: 1,   y: h}, {x: w-1, y: h}),
    new Segment({x: w,   y: h}, {x: w,   y: 0}),
    new Segment({x: w-1, y: 0}, {x: 1,   y: 0})
  ];

  _solidSegments.forEach(function(segment){
    segment.allCoordinates().forEach(function(coord){

      if (_cells[coord.x][coord.y] === 'NONE' ){
        _cells[coord.x][coord.y] = 'WALL';
        _blockedOff += 1;
      }

    });
  });

  _total = (_horizontalDivisions * _verticalDivisions) - _blockedOff;
  _blockedOff = 0;

};

BoardStore.percentageFinished = function() {
  return _blockedOff / _total;
};

BoardStore.percentageFinishedString = function() {
  return (BoardStore.percentageFinished() * 100).toString().slice(0,3) + '%';
};

BoardStore.setContext = function(context) {
  _context = context;
}

BoardStore.__onDispatch = function(payload) {
  switch (payload.actionType) {
    case GameConstants.actions.SET_CONTEXT:
      BoardStore.setContext(payload.context);
      break;
  }

}

module.exports = BoardStore;

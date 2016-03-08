var AppDispatcher = require('../dispatcher/Dispatcher');
var Store = require('flux/utils').Store;

var GameConstants = require('../constants/GameConstants');

var Segment = require('../util/Segment');


var BoardStore = new Store(AppDispatcher);

var _solidSegments = [];
var _beingCreatedSegments = [];
var _rectangles = [];
var _context;

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

  if (segs.length === 2) {

    var seg1 = _beingCreatedSegments.pop();
    var seg2 = _beingCreatedSegments.pop();

    seg1.tick(15);
    seg2.tick(15);

    _solidSegments.push(seg1)
    _solidSegments.push(seg2)
  } else if (segs[0] === 1) {

    var seg = _beingCreatedSegments.pop();
    seg.tick(15);

    _solidSegments.push(seg)
  } else {

    var seg = _beingCreatedSegments.shift();
    seg.tick(15);

    _solidSegments.push(seg)

  }
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
    debugger;
    _beingCreatedSegments[i].draw(_context, 'SOLID');
  }

};

BoardStore.reset = function() {

  var o = GameConstants.LINE_WIDTH / 2;
  var h = GameConstants.CANVAS_HEIGHT - o;
  var w = GameConstants.CANVAS_WIDTH  - o;

  _horizontalDivisions = Math.floor(GameConstants.CANVAS_WIDTH);
  _verticalDivisions = Math.floor(GameConstants.CANVAS_HEIGHT);

  var h = _verticalDivisions;
  var w = _horizontalDivisions;

  _solidSegments = [
    new Segment({x: 0, y: 0}, {x: 0, y: h}),
    new Segment({x: 1, y: h}, {x: w-1, y: h}),
    new Segment({x: w, y: h}, {x: w, y: 0}),
    new Segment({x: w-1, y: 0}, {x: 1, y: 0})
  ]

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

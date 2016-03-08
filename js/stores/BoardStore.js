var AppDispatcher = require('../dispatcher/Dispatcher');
var Store = require('flux/utils').Store;

var GameConstants = require('../constants/GameConstants');

var Segment = require('../util/Segment');


var BoardStore = new Store(AppDispatcher);

var _solidSegments = [];
var _beingCreatedSegments = [];
var _rectangles = [];
var _context;

// a segment looks like this:
//  {
//   startX:
//   startY:
//   endX:
//   endY:
//  }

BoardStore.tick = function(dT) {


};


BoardStore.draw = function() {

  var segment;

  for (var i = 0; i < _solidSegments.length; i++) {
    _solidSegments[i].draw(_context, 'SOLID');
  }

};

BoardStore.reset = function() {

  var o = GameConstants.LINE_WIDTH / 2;
  var h = GameConstants.CANVAS_HEIGHT - o;
  var w = GameConstants.CANVAS_WIDTH  - o;

  _solidSegments = [
    new Segment(o,    0,      o,    h + o),
    new Segment(o,    h,      w,    h),
    new Segment(w,    h + o,  w,    0),
    new Segment(w,    o,      o,    o)
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

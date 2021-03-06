var AppDispatcher = require('../dispatcher/Dispatcher');
var Store = require('flux/utils').Store;

var GameConstants = require('../constants/GameConstants');
var BallStore = require('../stores/BallStore');

var Segment = require('../util/Segment');


var BoardStore = new Store(AppDispatcher);

var _solidSegments = [];
var _beingCreatedSegments = [];
var _context;
var _cells = {};
var _blockedOff = 0;
var _total = 1;

var _horizontalDivisions = 0;
var _verticalDivisions = 0;


BoardStore.tick = function(dT) {

  for (var i = 0; i < _beingCreatedSegments.length; i++) {
    _beingCreatedSegments[i].tick(dT);
  }

};

BoardStore.solidSegments = function() {
  return _solidSegments;
};

BoardStore.solidifySegments = function(segs) {

  var seg;
  var newSolidSegs = []

  if (segs.length === 2) {

    seg = new Segment(
            _beingCreatedSegments.pop().endCoord,
            _beingCreatedSegments.pop().endCoord,
            null,
            'SOLID'
          )

    BoardStore.checkForAutoFill(seg);

    _solidSegments.push(
      seg
    );

  } else {

    if (segs[0] === 1) {
      seg = _beingCreatedSegments.pop();
    } else {
      seg = _beingCreatedSegments.shift();
    }

    if (_solidSegments[_solidSegments.length - 1].moveTag === seg.moveTag) {

      var newSeg = new Segment(
        seg.endCoord,
        _solidSegments.pop().endCoord,
        null,
        'SOLID'
      )

      BoardStore.checkForAutoFill(newSeg);

      _solidSegments.push(newSeg);

    } else {

      seg.segmentType = 'SOLID';
      _solidSegments.push(seg);

    }
  }

  seg.allCoordinates().forEach(function(coord){
    if (_cells[coord.x][coord.y] === 'NONE'){
      _cells[coord.x][coord.y] = 'WALL';
      _blockedOff += 1;
    }
  });

}

BoardStore.cell = function(x,y) {

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

  _context.fillStyle = GameConstants.SOLID_SEGMENT_COLOR;

  for (var i = 0; i <= _horizontalDivisions; i++) {
    for (var j = 0; j <= _verticalDivisions; j++) {
      _cells[i][j];

      if (_cells[i][j] === 'FILL') {
        _context.fillRect(
          (i) * GameConstants.LINE_WIDTH,
          (j) * GameConstants.LINE_WIDTH,
          GameConstants.LINE_WIDTH,
          GameConstants.LINE_WIDTH
        );
      }
    }
  }

};

BoardStore.reset = function() {

  _horizontalDivisions = Math.floor(GameConstants.CANVAS_WIDTH /  GameConstants.LINE_WIDTH) - 1;
  _verticalDivisions = Math.floor(GameConstants.CANVAS_HEIGHT / GameConstants.LINE_WIDTH) - 1;

  _beingCreatedSegments = [];

  var h = _verticalDivisions;
  var w = _horizontalDivisions;

  _cells = {};

  for (var i = 0; i <= w; i++) {
    _cells[i] = {};
    for (var j = 0; j <= h; j++) {
      _cells[i][j] = 'NONE';
    }
  }

  _solidSegments = [
    new Segment({x: 0,   y: 0}, {x: 0,   y: h}),
    new Segment({x: 1,   y: h}, {x: w-1, y: h}),
    new Segment({x: w,   y: h}, {x: w,   y: 0}),
    new Segment({x: w-1, y: 0}, {x: 1,   y: 0})
  ];

  _blockedOff = 0;

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

BoardStore.checkForAutoFill = function(segment) {

  var areas;
  var segCoords = segment.allCoordinates();

  segCoords.forEach(function(coord){
    if (_cells[coord.x][coord.y] === 'NONE'){
      _cells[coord.x][coord.y] = 'WALL';
      _blockedOff += 1;
    }
  });

  if (segment.startCoord.x === segment.endCoord.x){
    //segment is vertical
    areas = [
      segCoords.map(function(coord){
        return { x: coord.x + 1, y: coord.y }
      }),

      segCoords.map(function(coord){
        return { x: coord.x - 1, y: coord.y }
      })
    ];

  } else {
    //segment is horizontal
    areas = [
      segCoords.map(function(coord){
        return { x: coord.x, y: coord.y + 1 }
      }),

      segCoords.map(function(coord){
        return { x: coord.x, y: coord.y - 1 }
      })
    ];

  }

  var ballPositions = {}
  var gridPos;

  BallStore.balls().forEach(function(ball){
    gridPos = {
      x: Math.round((ball.posX - GameConstants.LINE_WIDTH / 2) / GameConstants.LINE_WIDTH),
      y: Math.round((ball.posY - GameConstants.LINE_WIDTH / 2) / GameConstants.LINE_WIDTH)
    }

    if (!ballPositions[gridPos.x]) { ballPositions[gridPos.x] = {}; }
    ballPositions[gridPos.x][gridPos.y] = 'BALL';
  });

  var currentCell;
  var toFill = [];
  var searched = {};
  var neighbors;
  var n;

  for (var k = 0; k < areas.length; k++) {
    var toSearch = areas[k]
    toFill = [];

    while (toSearch.length) {

      currentCell = toSearch.shift();

      if (ballPositions[currentCell.x] &&
          ballPositions[currentCell.x][currentCell.y]) {
        toFill = [];
        break;
      }

      if (_cells[currentCell.x][currentCell.y] === 'NONE') {
        toFill.push({
          x: currentCell.x, y: currentCell.y
        });

        neighbors = BoardStore.getNeighbors(currentCell);

        for (var i = 0; i < neighbors.length; i++) {
          n = neighbors[i];

          if (!searched[n.x]) { searched[n.x] = {}; }
          if (!searched[n.x][n.y]) {
            toSearch.push({ x: n.x, y: n.y });
            searched[n.x][n.y] = true;
          }
        }
      }
    }

    if (toFill.length) {

      for (var h = 0; h < toFill.length; h++) {

        n = toFill[h];

        if (_cells[n.x][n.y] === 'NONE'){
          _cells[n.x][n.y] = 'FILL';
          _blockedOff += 1;
        }

      }

    }

  }




};

BoardStore.isBallThere = function(positions, position) {

  return (positions[position.x] &&
          positions[position.x][position.y] === 'BALL');

};

BoardStore.getNeighbors = function(coordinate) {
  var ways = [
    [-1,-1], [0,-1], [1,-1],
    [-1, 0],         [1, 0],
    [-1, 1], [0, 1], [1, 1]
  ].map(function(way){
    return {
      x: coordinate.x + way[0],
      y: coordinate.y + way[1]
    };
  });

  return ways.filter(function(way){
    return (way.x > 0 && way.x <= _horizontalDivisions &&
            way.y > 0 && way.y <= _verticalDivisions);
  })

};

BoardStore.percentageFinished = function() {
  return _blockedOff / _total;
};

BoardStore.percentageFinishedString = function() {
  return (BoardStore.percentageFinished() * 100).toString().slice(0,4) + '%';
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

var React = require('react');
var PropTypes = React.PropTypes;

var AppDispatcher = require('./dispatcher/Dispatcher');

var Actions = require('./actions/Actions');

var BoardStore = require('./stores/BoardStore');
var GameStore = require('./stores/GameStore');
var BallStore = require('./stores/BallStore');

var GameConstants = require('./constants/GameConstants');

var Game = React.createClass({

  getInitialState: function() {

    return {
      gameStatus: GameStore.status()
    }

  },

  componentDidMount: function() {

    this.canvas = this.refs.gameCanvas;

    this.canvas.width = GameConstants.CANVAS_WIDTH;
    this.canvas.height = GameConstants.CANVAS_HEIGHT;

    this.canvasContext = this.canvas.getContext('2d');

    Actions.setContext(this.canvasContext);

    document.addEventListener('keydown', this.handleKey, false);

    this.gameListener = GameStore.addListener(this.gameChange);

    Actions.startGame();

  },

  componentWillUnmount: function(){
    document.removeEventListener('keydown', this.handleKey);
    this.gameListener.remove();
  },

  handleClick: function(e) {
    e.preventDefault();
  },

  handleKey: function(e) {

  },

  gameChange: function() {
    var gameStatus = GameStore.status();

    switch (gameStatus) {
      case 'PLAYING':
        Actions.tick();
        break;
      case 'DEAD':

        break;
      case 'WAITING':

        break;

    }

    if (gameStatus === 'PLAYING') {
      // Actions.tick();
    }

  },

  render: function() {
    return (
      <div onKeyDown={this.handleKey}>

        <canvas id='game-canvas' ref='gameCanvas'
          onClick={this.handleClick}>
        </canvas>

      </div>
    );
  }

});

module.exports = Game;

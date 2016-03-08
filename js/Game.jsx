var React = require('react');
var PropTypes = React.PropTypes;

var AppDispatcher = require('./dispatcher/Dispatcher');

var Actions = require('./actions/Actions');

var BoardStore = require('./stores/BoardStore');
var GameStore = require('./stores/GameStore');
var BallStore = require('./stores/BallStore');

var GameConstants = require('./constants/GameConstants');

var Game = React.createClass({

  componentDidMount: function() {

    this.canvas = this.refs.gameCanvas;

    this.canvas.width = GameConstants.CANVAS_WIDTH;
    this.canvas.height = GameConstants.CANVAS_HEIGHT;

    this.canvasContext = this.canvas.getContext('2d');

    Actions.setContext(this.canvasContext);

    document.addEventListener('keydown', this.handleKey, false);

    requestAnimationFrame(Actions.tick);

  },

  componentWillUnmount: function(){
    document.removeEventListener('keydown', this.handleKey);
  },

  handleClick: function(e) {
    e.preventDefault();
  },

  handleKey: function(e) {

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

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
    return { gameStatus: GameStore.status() }
  },

  componentDidMount: function() {
    this.setupCanvas();
    document.addEventListener('keydown', this.handleKey, false);
    this.gameListener = GameStore.addListener(this.gameChange);
    BoardStore.reset();
    Actions.tick();
  },

  setupCanvas: function(){
    this.canvas = this.refs.gameCanvas;
    this.canvas.width = GameConstants.CANVAS_WIDTH;
    this.canvas.height = GameConstants.CANVAS_HEIGHT;
    this.canvasRect = this.canvas.getBoundingClientRect();
    this.canvasContext = this.canvas.getContext('2d');
    Actions.setContext(this.canvasContext);
  },

  componentWillUnmount: function(){
    document.removeEventListener('keydown', this.handleKey);
    this.gameListener.remove();
  },

  handleClick: function(e) {
    e.preventDefault();
    AppDispatcher.dispatch({
      actionType: GameConstants.actions.ATTEMPT_MOVE
    })
  },

  handleKey: function(e) {
    if (e.keyCode === 32) { Actions.switchPlayerDirection(); };
  },

  handleMouseMove: function(e) {
    var xPos = e.clientX - this.canvasRect.left;
    var yPos = e.clientY - this.canvasRect.top;
    Actions.setPlayerPosition(xPos, yPos);
  },

  gameChange: function() {
    var gameStatus = GameStore.status();
    if (gameStatus == 'PLAYING') { Actions.tick(); }
    this.setState({ gameStatus: gameStatus });
  },

  startGame: function() {

    if (GameStore.level() === 1) {
      Actions.startGame();
    } else {
      Actions.startLevel();
    }

  },

  statsBar: function() {
    return(
      <div className='detail'>
        <div className='detail-stat'>
          Score: {GameStore.scoreString()}
        </div>
        <div className='detail-stat'>
          Level: {GameStore.level()}
        </div>
        <div className='detail-stat'>
          Lives: {GameStore.lives()}
        </div>
        <div className='detail-stat'>
          Filled: {BoardStore.percentageFinishedString()}
        </div>
      </div>
    );
  },

  render: function() {
    return (
      <div style={{width: '100%', textAlign: 'center'}}
        onKeyDown={this.handleKey}>

        <div className='title'> Jezzball </div>

        {this.statsBar()}

        <canvas id='game-canvas' ref='gameCanvas'
          onMouseMove={this.handleMouseMove}
          onClick={this.handleClick}>
        </canvas>

        <div><a href='https://github.com/carsonswope/jezz_ball'
            className='git-link'>github</a>
        </div>

      </div>
    );
  }

});

module.exports = Game;

var React = require('react');
var ReactDOM = require('react-dom');

var BoardStore = require('./stores/BoardStore');
var GameStore = require('./stores/GameStore');
var BallStore = require('./stores/BallStore');
var Actions = require('./actions/Actions');

var Game = require('./Game');

window.BoardStore = BoardStore;
window.BallStore = BallStore;
window.GameStore = GameStore;
window.Actions = Actions;

document.addEventListener('DOMContentLoaded', function(){

  ReactDOM.render(
    <Game />,
    document.getElementById('jezz-game')
  );

});

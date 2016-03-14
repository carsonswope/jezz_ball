# Jezzball

This is a remake of the old Microsoft game Jezzball

## Game

The player begins at level 1, with 2 balls and 2 lives. By clicking on the screen during the game, the player can build walls and section off groups of balls. If a ball collies with a wall before it has been solidified, the wall is destroyed and the player loses a life. Any sections with no balls in them are considered 'cleared', and as soon as 78% of the board is cleared, the game moves on to the next level, with 3 balls and 3 lives.

## Code structure

While there is a rails server set up to serve the static HTML & js files and eventually might be used for a system to keep track of high scores, the vast majority of the code used in this project is in JavaScript.

There are two object classes, `Segment` and `Ball`, and each has their own store. There is also a player store, keeping track of the position of the player, and a game store, keeping track of the overall state of the game.

The game loop is built around the main flux cycle - whenever the `tick` function is called, the GameStore updates the positions of the balls, walls and the player's crosshair, re-draws the new state on the canvas, and then emits a change. The react element named `Game` checks to see if the game is still being played - if it is, it calls `requestAnimationFrame` to request another tick. While this keeps the Game react element very light because it simply dispatches actions corresponding to various user input, the stores have a bit more code than would be ideal.

One noteworthy piece of code is in `BoardStore.checkForAutoFill` (BordStore.js:195). Every time a wall is completed, the areas on either side of the wall are searched, and any areas without any balls whatsoever are converted to 'filled space'.

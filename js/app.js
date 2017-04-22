// Create the game constructor for game prototypes functions
const Game = function() {
    // ..
};

// Next two functions visually update player lives and score
// updates lives
Game.prototype.redrawLives = function (lives) {
    // first clear lives
    ctx.clearRect(0, 0, 200, 100);

    ctx.font = '32pt marioFont';
    const gradient=ctx.createLinearGradient(0,0,505,0);
    gradient.addColorStop(0,'magenta');
    gradient.addColorStop(0.5,'blue');
    gradient.addColorStop(1.0,"red");
    // Fill with gradient
    ctx.fillStyle=gradient;
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.fillText('Lives: ' + lives, 100, 40);
};

Game.prototype.redrawScore = function (score) {
    // first clear score
    ctx.clearRect(200, 0, 305, 100);

    ctx.font = '32pt marioFont';
    const gradient=ctx.createLinearGradient(0,0,505,0);
    gradient.addColorStop(0,'magenta');
    gradient.addColorStop(0.5,'blue');
    gradient.addColorStop(1.0,"red");
    // Fill with gradient
    ctx.fillStyle=gradient;
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.fillText('Score: ' + score, 400, 40);
};

// Game over
Game.prototype.alertGameOver = function () {
    // open modal
    $('#gameOverModal').modal('show');

};

// Game won
Game.prototype.alertGameWon = function () {
    // open modal
    $('#gameWonModal').modal('show');

};

Game.prototype.reset = function () {
    player.lives = 5;
    player.score = 0;
    game.redrawLives(5);
    game.redrawScore(0);
    player.reset();
    $('#gameOverModal').modal('hide');
    $('#gameWonModal').modal('hide');
};

// Enemies our player must avoid
const Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies
    this.sprite = 'images/enemy-bug.png';

    // Set the enemy position
    this.x = x;
    this.y = y;

    // Set the speed multipler for the enemy using a random
    // number between 1 & 5
    this.multiplier = Math.floor((Math.random() * 5) + 1);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // Set the position of the enemy based on dt and the speed multipler
    this.x = this.x + 101 * dt * this.multiplier;

    // Check for collisions with the player
    if (this.y === player.y && (this.x > player.x - 20 && this.x < player.x + 20)) {

        // Player has encountered an emeny and thus loses one life
        player.lives--;
        $("#died").fadeTo(2000, 500).slideUp(500, function(){
            $("#died").slideUp(500);
        });
        game.redrawLives(player.lives);
        // document.getElementsByClassName('lives')[0].innerHTML = 'Lives: ' + player.lives;

        // Check to see if the player has any lives left
        if (player.lives === 0) {
            // Player is out of lives, open the game over dialog
            game.alertGameOver();

        } else {
            // Reset the player to her original position
            player.reset();
        }
    }

    // If the enemy goes off of the board, reset it
    if (this.x > 750) {
        this.reset();
    }
};

// Reset the enemy to the left of the board with a new y position
// and a new speed multiplier
Enemy.prototype.reset = function() {
    this.x = -200;
    const yVals = [220, 140, 60];
    this.y = yVals[Math.floor((Math.random() * 3))];
    this.multiplier = Math.floor((Math.random() * 5) + 1);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// Player
const Player = function (x, y) {
    // Set the player to char-boy
    this.sprite = 'images/char-boy.png';

    // Set the player's location
    this.x = x;
    this.y = y;


    // Give the player 5 lives to start
    this.lives = 5;

    // Give the player a score of 0 to start
    this.score = 0;

    // Store the original position of the player for resetting later
    this.xo = x;
    this.yo = y;

};

// take what we can from the Enemy class (render), and override as needed below it
Player.prototype = Object.create(Enemy.prototype);
Player.constructor = Enemy;

// Handle the user's keyboard input
Player.prototype.handleInput = function (dir) {
    // set player prototype methods

    this.move(dir);
    this.checkPosition();
};

// Update the player's position (update()), required method for game
Player.prototype.update = function() {
    this.x = this.x;
    this.y = this.y;
};

// Move the player
Player.prototype.move = function (dir) {
    // Change the player's position based on the user keyboard input
    if (dir === 'up') {
        this.y = this.y - 80;
    } else if (dir === 'down') {
        this.y = this.y + 80;
    } else if (dir === 'left') {
        this.x = this.x - 101;
    } else if (dir === 'right') {
        this.x = this.x + 101;
    }
    console.log('after move: ', this);
};

// Check the position of the player
Player.prototype.checkPosition = function () {
    if (this.x < 0) {
        // Player is off to the left side of the board, move the player back
        this.x = 0;

    } else if (this.x > 404) {
        // Player is off to the right side of the board, move the player back
        this.x = 404;

    } else if (this.y > 380) {
        // Player is off the bottom of the board, move the player back
        this.y = 380;

    } else if (this.y <= -20) {
        // Player has made it to the top
        // update score then reset position
        this.score++;
        $("#point").fadeTo(2000, 500).slideUp(500, function(){
            $("#point").slideUp(500);
        });
        // if the player has a score of 5 they win, open the win dialog
        if (this.score === 5) {
            game.alertGameWon();
        } else {
            game.redrawScore(player.score);
            this.reset();
        }

    }
};

// Reset the player to original position
Player.prototype.reset = function() {
    // Reset the player to the original position
    this.x = this.xo;
    this.y = this.yo;
};

// Instantiate objects.
// Place all enemy objects in an array called allEnemies

const allEnemies = [];
// Set a variable for all possible enemy y values
const yVals = [220, 140, 60];

// Create the separate enemy instances
for (let i = 0; i < 3; i++) {

    // Set a starting x-position based on a random value
    const x = Math.floor((Math.random() * -1000) + 1);

    // Set a starting y-position based on a random selection
    // of the 3 possible values
    const y = yVals[Math.floor(Math.random() * 3)];

    // Create the new enemy object
    const enemy = new Enemy(x, y);

    // Push the enemy into the array
    allEnemies.push(enemy);
}

// Make a new player object - start in middle bottom of screen
const player = new Player(202, 380);


// Start a new game
const game = new Game();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


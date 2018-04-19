// Enemies our player must avoid
var Enemy = function(xPos,yPos,speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = xPos;
    this.y = yPos;
    // rightmost enemy position
    this.xMax = 500;
    this.maxSpeed = speed;
    this.speed = speed;
    this.giggleSound = new Audio("audio/giggle.wav");

};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    // check for collision with player
    this.checkForCollision();

    // if now off-screen, re-enter screen from left
    // at a revised speed.
    if ( this.x >= this.xMax ) {
        this.x = -100;
        this.speed = Math.floor((Math.random() * this.maxSpeed) + 50);
    }
    // TODO - Make the enemies wiggle as they walk #:o)
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.checkForCollision = function() {
    // check for collision with player.
    // Math.abs always returns absolute 'positive' value allowing
    // this 'if' statement to work all around the player.
    if ( ( Math.abs(this.x - player.x) < 60) &&
         ( Math.abs(this.y - player.y) < 60) ) {
            player.playSound(this.giggleSound);
            player.resetPosition();
            // update scoreboard lives
            scoreboard.loseLife();
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// Enemies our player must avoid
class Player {
    constructor (xPos, yPos) {
        // Variables applied to each of our instances go here,
        // we've provided one for you to get started

        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.sprite = 'images/char-boy.png';
        this.splashSound = new Audio("audio/splash.wav");
        // scoreboard information
        this.swims = 0;
        this.lives = 3;
        // start position passed in
        this.x = xPos;
        this.y = yPos;
        // min/max position bounds for player movement
        this.xMin = 0;
        this.xMax = 400;
        this.yMin = 10;
        this.yMax = 410;
    }

    // Update the player's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {

        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.;
    }

// Draw the player on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(keyPressed) {
        // recieve user keypress input (allowedKeys)
        // left, right, up, down
        // Only move player if within the players bounds
        switch (keyPressed) {
            case 'left':
                if (this.x > this.xMin) {
                    this.x -= 20;
                }
                break;
            case 'right':
                if (this.x < this.xMax ) {
                    this.x += 20;
                }
                break;
            case 'up':
                if (this.y <= this.yMin ) {
                    this.playSound(this.splashSound);
                    this.resetPosition();
                    this.swims++;
                    scoreboard.updateSwims();
                }
                else {
                    this.y -= 20;
                }
                break;
            case 'down':
                if ( this.y < this.yMax ) {
                    this.y += 20;
                }
                break;
            default:
                // nothing to do
        }
    }

    resetPosition() {
        // place player in a random x-axis start position
        this.x = Math.floor(Math.random() * this.xMax);
        this.y = 410;
    }

    playSound (audioEffect) {
        // play a sound for the player
        audioEffect.play();
    }
}

class Scoreboard {
    constructor() {
        this.hearts = document.querySelector('.lives');
        this.heartList = this.hearts.querySelectorAll('.fa-heart');
    }
    loseLife() {
        player.lives--;
        this.dimHeart = this.heartList[player.lives];
        this.dimHeart.style.color='lightgrey';
        if ( player.lives == 0) {
            this.playAgain();
        }
    }
    updateSwims() {
        document.querySelector('.swimsTaken').textContent = player.swims;
    }

    playAgain() {
        // create a new document fragment and insert it into the page.
        this.modalFrag = document.createDocumentFragment();
        this.modal = document.createElement('div');
        this.modal.classList = 'modal';
        this.modalButton = document.createElement('div');
        this.modalButton.innerHTML =`
              <button class="playButton">Play Again!</button>
        `;
        this.modalFrag.appendChild(this.modal);
        this.modal.appendChild(this.modalButton);
        this.container = document.querySelector('.container');
        this.container.appendChild(this.modalFrag);
        // setup button & eventListener
        this.playButton = this.modalButton.querySelector('.playButton');
        this.playButton.addEventListener('click', function() {
            scoreboard.container.removeChild(scoreboard.modal);
            player.lives = 3;
            for ( scoreboard.newHeart of scoreboard.heartList ) {
                scoreboard.newHeart.style.color='violet';
            }
            player.swims=0;
            scoreboard.updateSwims();
            player.x = 200;
            player.y = 410;
        });
    }
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// main code
// create scoreboard object
let scoreboard = new Scoreboard();

// create player object in start position
let player = new Player(200, 410);

// create enemy objects off screen
let enemy1 = new Enemy(-400, 65, 300);
let enemy2 = new Enemy(-100, 145,300);
let enemy3 = new Enemy(-200, 225, 300);
// add these to the allEnemies array
let allEnemies = [enemy1, enemy2, enemy3];

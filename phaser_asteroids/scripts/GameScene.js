class GameScene extends Phaser.Scene {
	constructor(){
		super({ key: 'GameScene' });
	}

    preload () {
        this.load.image('ship', 'sprites/ship.png');
        this.load.image('asteroid1', 'sprites/asteroid1.png');
        this.load.image('asteroid2', 'sprites/asteroid2.png');
        this.load.image('asteroid3', 'sprites/asteroid3.png');
        this.load.image('bullet', 'sprites/bullet.png');
        this.load.spritesheet('deathanimation', 'sprites/death_animation.png', { frameWidth: 120, frameHeight: 120 });
        this.load.spritesheet('asteroidexplode1', 'sprites/asteroid_explode1.png', { frameWidth: 120, frameHeight: 120 });
        this.load.spritesheet('asteroidexplode2', 'sprites/asteroid_explode2.png', { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet('asteroidexplode3', 'sprites/asteroid_explode3.png', { frameWidth: 80, frameHeight: 80 });
        this.load.audio('bullet_fire', 'sfx/bullet_fire.wav');
        this.load.audio('explode_sfx1', 'sfx/explode1.wav');
        this.load.audio('explode_sfx2', 'sfx/explode2.wav');
        this.load.audio('explode_sfx3', 'sfx/explode3.wav');
    }
    
    create () {

        gameState.timerNum = 60; // Time in seconds
        gameState.alive = true; // When alive is true, allows the ship to be controlled and the timer to count down
        gameState.points = 0; // Points

        gameState.ship = this.physics.add.sprite(500, 250, 'ship').setScale(0.3).setOrigin(0.5);
        gameState.ship.angle -= 90;

        // Setting controls
        gameState.moveLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        gameState.moveRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        gameState.moveForward = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        gameState.shoot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Ship physics
        gameState.ship.setDrag(0.99);
        gameState.ship.setMaxVelocity(200);
        gameState.ship.setDrag(true); 

        // Creating timer
        gameState.timer = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: function() {
                if (gameState.alive) {
                    gameState.timerNum--;
                }
            },
            callbackScope: this
        });
        gameState.timerText = this.add.text(500, 20, '', {fill: '#ffffff', fontSize: '25px', align: 'center'}).setOrigin(0.5);

        gameState.bullets = this.physics.add.group();
        gameState.asteroids1 = this.physics.add.group(); // 3 asteroid groups for the 3 different asteroid sizes
        gameState.asteroids2 = this.physics.add.group();
        gameState.asteroids3 = this.physics.add.group();

        gameState.spawnAsteroids = this.time.addEvent({
            delay: Phaser.Math.Between(3000, 4000),
            loop: true,
            callback: function() {
                let xCoord, yCoord, xVel, yVel;
                let spawn = Phaser.Math.Between(1, 4); // Chooses between 4 different location ranges to spawn, top, bottom, left and right
                // the following if statement sets the location and the velocity of the asteroid spawned
                if (spawn = 1) { // Top
                    xCoord = Phaser.Math.Between(0, 1000);
                    yCoord = -75;
                    xVel = Phaser.Math.Between(-75, 75);
                    yVel = 75;
                }
                else if (spawn = 2) { // Bottom
                    xCoord = Phaser.Math.Between(0, 1000);
                    yCoord = 600;
                    xVel = Phaser.Math.Between(-75, 75);
                    yVel = -75;
                }
                else if (spawn = 3) { // Left
                    xCoord = -100;
                    yCoord = Phaser.Math.Between(0, 500);
                    xVel = 75;
                    yVel = Phaser.Math.Between(-75, 75);
                }
                else if (spawn = 4) { // Right
                    xCoord = 1100;
                    yCoord = Phaser.Math.Between(0, 500);
                    xVel = -75;
                    yVel = Phaser.Math.Between(-75, 75);
                }
                gameState.asteroids1.create(xCoord, yCoord, `asteroid${Phaser.Math.Between(1, 3)}`).setOrigin(0.5).setScale(0.2).setVelocity(xVel, yVel).setAngle(Phaser.Math.Between(0, 360));
            },
            callbackScope: this
        });

        // Code for when asteroid hits ship
        this.physics.add.overlap(gameState.ship, [gameState.asteroids1, gameState.asteroids2, gameState.asteroids3], () => {
            // Creating death animation
            gameState.deathAnimation = this.add.sprite(gameState.ship.x, gameState.ship.y, 'deathanimation').setScale(0.6);
            gameState.explode1sfx.play();
            this.anims.create({
                key: 'deathAnim',
                frames: this.anims.generateFrameNames('deathanimation', {start: 0, end: 8}),
                delay: 0,
                frameRate: 20,
                repeat: 0,
                hideOnComplete: true
            });
            gameState.deathAnimation.anims.play('deathAnim');
            gameState.alive = false;
            gameState.ship.destroy();
            gameState.gameOverText.setText('Game Over\nClick to restart');
        });

        // Code for when bullet hits asteroid
        this.physics.add.collider(gameState.asteroids1, gameState.bullets, (asteroid, bullet) => { // When a bullet hits a big asteroid, it splits into 2-3 medium sized asteroids
            for (let i = 1; i <= Phaser.Math.Between(2, 3); i++) {
                gameState.asteroids2.create(asteroid.x, asteroid.y, `asteroid${Phaser.Math.Between(1, 3)}`).setOrigin(0.5).setScale(0.1).setVelocity(Phaser.Math.Between(-75, 75), Phaser.Math.Between(-75, 75)).setAngle(Phaser.Math.Between(0, 360));
            }
            gameState.explode1sfx.play();
            gameState.asteroidExplode1 = this.add.sprite(asteroid.x, asteroid.y, 'asteroidexplode1');
            this.anims.create({
                key: 'explode1',
                frames: this.anims.generateFrameNames('asteroidexplode1', {start: 0, end: 6}),
                delay: 0,
                frameRate: 30,
                repeat: 0,
                hideOnComplete: true
            });
            gameState.asteroidExplode1.anims.play('explode1');
            asteroid.destroy();
            bullet.destroy();
            gameState.points += 10;
        });
        this.physics.add.collider(gameState.asteroids2, gameState.bullets, (asteroid, bullet) => { // When a bullet hits a medium sized asteroid, it splits into 2-3 small asteroids
            for (let i = 1; i <= Phaser.Math.Between(2, 3); i++) {
                gameState.asteroids3.create(asteroid.x, asteroid.y, `asteroid${Phaser.Math.Between(1, 3)}`).setOrigin(0.5).setScale(0.05).setVelocity(Phaser.Math.Between(-75, 75), Phaser.Math.Between(-75, 75)).setAngle(Phaser.Math.Between(0, 360));
            }
            gameState.explode2sfx.play();
            gameState.asteroidExplode2 = this.add.sprite(asteroid.x, asteroid.y, 'asteroidexplode2').setScale(0.6);
            this.anims.create({
                key: 'explode2',
                frames: this.anims.generateFrameNames('asteroidexplode2', {start: 0, end: 6}),
                delay: 0,
                frameRate: 30,
                repeat: 0,
                hideOnComplete: true
            });
            gameState.asteroidExplode2.anims.play('explode2');
            asteroid.destroy();
            bullet.destroy();
            gameState.points += 10;
        });
        this.physics.add.collider(gameState.asteroids3, gameState.bullets, (asteroid, bullet) => { // When a bullet hits a small asteroid, it's destroyed
            gameState.asteroidExplode3 = this.add.sprite(asteroid.x, asteroid.y, 'asteroidexplode3').setScale(0.3);
            gameState.explode3sfx.play();
            this.anims.create({
                key: 'explode3',
                frames: this.anims.generateFrameNames('asteroidexplode3', {start: 0, end: 6}),
                delay: 0,
                frameRate: 30,
                repeat: 0,
                hideOnComplete: true
            });
            gameState.asteroidExplode3.anims.play('explode3');
            asteroid.destroy();
            bullet.destroy();
            gameState.points += 10;
        });

        // Creating sfx
        gameState.fireSfx = this.sound.add('bullet_fire');
        gameState.explode1sfx = this.sound.add('explode_sfx1');
        gameState.explode2sfx = this.sound.add('explode_sfx2');
        gameState.explode3sfx = this.sound.add('explode_sfx3');
            
        // Creating Game Over text
        gameState.gameOverText = this.add.text(500, 250, '', {fill: '#ffffff', fontSize: '30px', align: 'center'}).setOrigin(0.5);

        // Creating Points text
        gameState.pointsText = this.add.text(500, 475, 'Points: 0', {fill: '#ffffff', fontSize: '30px', align: 'center'}).setOrigin(0.5);


    } // End of create

    
    
    update () {

        if (gameState.alive) {
        // Ship Movement
        if (gameState.moveLeft.isDown) {
            gameState.ship.body.angularVelocity = -150;
        }
        else if (gameState.moveRight.isDown) {
            gameState.ship.body.angularVelocity = 150;
        }
        else {
            gameState.ship.body.angularVelocity = 0;
        }
        if (gameState.moveForward.isDown) {
            this.physics.velocityFromRotation(gameState.ship.rotation, 200, gameState.ship.body.acceleration);
        }
        else {
            gameState.ship.setAcceleration(0);
        }
        // Ship bullet firing
        if (Phaser.Input.Keyboard.JustDown(gameState.shoot)) {
            gameState.fireSfx.play(); // Play firing sfx
            let xAngle = Math.cos(Phaser.Math.DegToRad(gameState.ship.angle)); // For letting bullets come out of the tip of the ship rather than the center
            let yAngle = Math.sin(Phaser.Math.DegToRad(gameState.ship.angle));
            gameState.bullets.create(gameState.ship.x + (xAngle * 20), gameState.ship.y + (yAngle * 20), 'bullet').setAngle(gameState.ship.angle - 90).setVelocity(xAngle * 400, yAngle * 400).setOrigin(0.5).setScale(0.5);
            gameState.bullets.children.each(function (sprite) { // Function for destroying bullet after a certain amount of time in the air (1.5 seconds)
                gameState.destroyBullet = this.time.addEvent({
                    delay: 1500,
                    callback: function() {
                        sprite.destroy();
                    }
            })
        }, this);
        }

        }
        else { // For restarting the game, note how this is the else statement of if (gameState.alive)
            this.input.on('pointerup', () => {
                this.scene.restart();
            });
        }
        
        // Enables screen wrapping
        this.physics.world.wrap(gameState.ship, 25);
        gameState.bullets.children.each(function (sprite) {
            this.physics.world.wrap(sprite, 25);
        }, this);
        // For screenwrapping asteroids, i had to enable it after a delay (2000ms) in order for the asteroids to not screenwrap before they appear
        gameState.asteroids1.children.each(function (sprite) { 
            gameState.asteroid1ScreenWrap = this.time.addEvent({
                delay: 2000,
                loop: false,
                callback: function() {
                    this.physics.world.wrap(sprite, 50);
                },
                callbackScope: this
            });
        }, this);
        gameState.asteroids2.children.each(function (sprite) { 
            gameState.asteroid2ScreenWrap = this.time.addEvent({
                delay: 2000,
                loop: false,
                callback: function() {
                    this.physics.world.wrap(sprite, 50);
                },
                callbackScope: this
            });
        }, this)
        gameState.asteroids3.children.each(function (sprite) { 
            gameState.asteroid3ScreenWrap = this.time.addEvent({
                delay: 2000,
                loop: false,
                callback: function() {
                    this.physics.world.wrap(sprite, 50);
                },
                callbackScope: this
            });
        }, this)

        // Timer Countdown
        gameState.timerText.setText(`Time Left: ${gameState.timerNum}`);
        gameState.pointsText.setText(`Points: ${gameState.points}`)

        // Game Won Code
        if (gameState.timerNum === 0) {
            this.scene.stop('GameScene')
			this.scene.start('WinScene')
        }
    } // End of update
}
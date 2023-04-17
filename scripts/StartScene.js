class StartScene extends Phaser.Scene {
	constructor(){
		super({ key: 'StartScene' });
	}

    preload () {
        this.load.image('ship', 'sprites/ship.png');
        this.load.image('asteroid1', 'sprites/asteroid1.png');
        this.load.image('asteroid2', 'sprites/asteroid2.png');
        this.load.image('asteroid3', 'sprites/asteroid3.png');
    }
    
    create () {
        // Start Screen Text & Ship
        this.add.text(500, 75, 'Asteroids', {fill: '#ffffff', fontSize: '50px', align: 'center', strokeThickness: 2}).setOrigin(0.5);
        gameState.startScreenShip = this.add.sprite(500, 175, 'ship').setScale(0.75).setOrigin(0.5);
        gameState.startScreenShip.angle -= 90;
        this.add.text(500, 340, 'Controls\n\nW: Propel Forward\nA: Turn Left\nD: Turn Right\nSpace: Shoot\n', {fill: '#ffffff', fontSize: '25px', align: 'center'}).setOrigin(0.5);
        this.add.text(500, 440, 'Click to start', {fill: '#ffffff', fontSize: '30px', align: 'center', strokeThickness: 1}).setOrigin(0.5);

        // For starting the game
        this.input.on('pointerup', () => {
			this.scene.stop('StartScene')
			this.scene.start('GameScene')
		});

        gameState.startScreenAsteroids = this.physics.add.group();
        for (let i = 1; i <= 2; i++) {
            for (let j = 1; j <= 3; j++) {
                let astVal = Phaser.Math.Between(1, 3); // For selecting a random asteroid sprite
                let xMargin = Phaser.Math.Between(1, 200); 
                let yMargin = Phaser.Math.Between(1, 60); // For setting random margin of asteroid's coords
                let rotation = Phaser.Math.Between(0, 360); // For setting the angle of the asteroid
                gameState.startScreenAsteroids.create((600 * i - 525) + xMargin, (150 * j - 100) + yMargin, `asteroid${astVal}`).setOrigin(0.5).setScale(0.25).setAngle(rotation);
            }
        };
        gameState.startScreenAsteroids.children.each(function(sprite) { // for setting the rotation of the asteroids
            sprite.body.angularVelocity = Phaser.Math.Between(-50, 50);
        });
    }
}
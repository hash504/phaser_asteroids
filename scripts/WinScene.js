class WinScene extends Phaser.Scene {
	constructor(){
		super({ key: 'WinScene' });
	}

    preload () {

    }

    create () {
        this.add.text(500, 200, 'You Win!', {fill: '#ffffff', fontSize: '50px', align: 'center', strokeThickness: 2}).setOrigin(0.5);
        this.add.text(500, 250, 'Click to Restart', {fill: '#ffffff', fontSize: '25px', align: 'center'}).setOrigin(0.5);
        
        this.input.on('pointerup', () => {
			this.scene.stop('WinScene')
			this.scene.start('StartScene')
		});

        // Identical code for placing asteroids on start screen.
        gameState.winScreenAsteroids = this.physics.add.group();
        for (let i = 1; i <= 2; i++) {
            for (let j = 1; j <= 3; j++) {
                let astVal = Phaser.Math.Between(1, 3);
                let xMargin = Phaser.Math.Between(1, 200); 
                let yMargin = Phaser.Math.Between(1, 60);
                let rotation = Phaser.Math.Between(0, 360);
                gameState.winScreenAsteroids.create((600 * i - 525) + xMargin, (150 * j - 100) + yMargin, `asteroid${astVal}`).setOrigin(0.5).setScale(0.25).setAngle(rotation);
            }
        };
        gameState.winScreenAsteroids.children.each(function(sprite) { 
            sprite.body.angularVelocity = Phaser.Math.Between(-50, 50);
        });

        this.add.text(500, 350, `Points: ${gameState.points}`, {fill: '#ffffff', fontSize: '40px', align: 'center', strokeThickness: 2}).setOrigin(0.5);
    }
}
const gameState = {

}

var config = {
  type: Phaser.CANVAS,
  width: 1000,
  height: 500,
	backgroundColor: "2b2b2b",
	physics: {
		default: 'arcade',
        arcade: {
            fps: 60,
            gravity: { x: 0, y: 0 }
        }
	},
  scene: [StartScene, GameScene, WinScene]
}

var game = new Phaser.Game(config)

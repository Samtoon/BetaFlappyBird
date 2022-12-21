const config = {
    width: 384*2,
    height: 216*2,
    scene: [Escena],
    speed: 3,
    scale: 4,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 500}
        },
    }
}

window.onload = function() {
    const game = new Phaser.Game(config);
}
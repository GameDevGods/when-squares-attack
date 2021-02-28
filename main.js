var game = new Phaser.Game(1500,1000,Phaser.AUTO); //want big game world for crisper image
game.state.add('state1', demo.state1);
game.state.start('state1');
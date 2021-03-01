var demo = {};
var centerX = 1500/2;
var centerY = 1000/2;
// velocity
var playerVelocity = 300;
var bulletVelocity = 1000;
// fire rate control
var nextFire = 0;
var fireRate = 200;
// define vars with no initial values here
var zombieGroup, player, bullets, intro, zombiesLeft;
var cursors, cursorsAlt, replay, tip;

demo.state1 = function(){};
demo.state1.prototype = {
    preload: function(){
        game.load.image('zombie','assets/sprites/zombie.png');
        game.load.image('grass','assets/backgrounds/grass.jpg');
        game.load.image('player','assets/sprites/player.png');
        game.load.image('bullet','assets/sprites/bullet.png');
        game.load.image('replay', 'assets/buttons/replay.png');
        game.load.audio('intro', 'assets/audios/introMusic.mp3');

        replay = null;
        zombiesLeft = 0;
    }, 
    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0,0,1000,1000);
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        // intro music
        intro = game.add.audio('intro', 0.5, true); // 50% volume, loop
        // TODO uncomment next line to play
        // intro.play();

        // background
        // TODO change to tilemap
        var farm = game.add.sprite(0,0,'grass');
        farm.width = 1500;
        farm.height = 1000;

        bullets = game.add.group()
        bullets.createMultiple(50, 'bullet')
        bullets.setAll('checkWorldBounds', true)
        bullets.setAll('outOfBoundsKill', true)
        bullets.setAll('anchor.x', 0.5)
        bullets.setAll('anchor.y', 0.5)
        bullets.setAll('scale.x', 1)
        bullets.setAll('scale.y', 1)
        
        // player: spawn randomly
        player = game.add.sprite(
            Math.random() * 1500,
            Math.random() * 1000,
            'player'
        );
        player.anchor.setTo(0.5, 0.5);
        player.enableBody = true;
        
        // zombies: spawn 10 randomly
        zombieGroup = game.add.group();
        for (var i = 0; i < 10; i++) {
            zombieGroup.create(
                Math.random() * 1500,
                Math.random() * 1000,
                'zombie'
            );
            zombiesLeft += 1;
        }
        zombieGroup.setAll('anchor.y', 0.5);
        zombieGroup.setAll('anchor.x', 0.5);
        
        // tip
        tip = game.add.text(200, 100, '', {
            font: 'Arial',
            fontSize: 32,
        })
        tip.anchor.setTo(0, 0.5)

        // physics
        game.physics.enable([zombieGroup, player, bullets]);
        player.body.collideWorldBounds = true;
        zombieGroup.setAll('body.collideWorldBounds', true);

        // controls
        cursors = game.input.keyboard.createCursorKeys();
        cursorsAlt = {
            up: Phaser.KeyCode.W,
            left: Phaser.KeyCode.A,
            down: Phaser.KeyCode.S,
            right: Phaser.KeyCode.D,
        }
    }, 
    update: function(){
        // fire
        if (player.alive && game.input.activePointer.isDown) {
            this.fire()
        }

        player.rotation = game.physics.arcade.angleToPointer(player) + Math.PI / 4

        // kill of player or zombies
        game.physics.arcade.overlap(player, zombieGroup, function(p, z) { p.kill(); })
        game.physics.arcade.overlap(bullets, zombieGroup, function(b, z) {
            b.kill();
            z.kill();
            zombiesLeft -= 1;
        })

        // control player movements
        if (cursors.up.isDown || game.input.keyboard.isDown(cursorsAlt.up)){
            player.body.velocity.y = -playerVelocity;
        } else if (cursors.down.isDown || game.input.keyboard.isDown(cursorsAlt.down)) {
            player.body.velocity.y = playerVelocity;
        } else {
            player.body.velocity.y = 0;
        }

        if (cursors.left.isDown || game.input.keyboard.isDown(cursorsAlt.left)){
            player.body.velocity.x = -playerVelocity;
        } else if (cursors.right.isDown || game.input.keyboard.isDown(cursorsAlt.right)){
            player.body.velocity.x = playerVelocity;
        } else {
            player.body.velocity.x = 0;
        }

        // replay button: show when all zombies are killed
        if ((zombiesLeft === 0 || !player.alive) && !replay) {
            replay = game.add.button(150, 100, 'replay', function() {
                game.state.start('state1')
            })
            replay.anchor.setTo(0.5, 0.5)
            replay.scale.setTo(2, 2)
            replay.onInputDown.add(tint, replay)
            replay.onInputUp.add(untint, replay)

            if (zombiesLeft === 0) tip.text = 'You killed all zombies.'
            if (!player.alive) tip.text = 'You\'re dead.'
        }
    },
    fire: function() {
        if (game.time.now > nextFire) {
            nextFire = game.time.now + fireRate
            var bullet = bullets.getFirstDead()
            bullet.reset(player.x, player.y)

            game.physics.arcade.moveToPointer(bullet, bulletVelocity)
            bullet.rotation = game.physics.arcade.angleToPointer(bullet)
        }
    }
};

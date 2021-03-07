// define vars with no initial values here
var zombieGroup, player, bullets, intro, zombiesLeft;
var cursors, cursorsAlt, tip,bushlayer,pondlayer;

var button = {}

demo.state1 = function(){};
demo.state1.prototype = {
    preload: function(){
        game.load.tilemap('state1map', 'assets/tilemaps/state1map.json',null,Phaser.Tilemap.TILED_JSON);
        game.load.image('grassTile', 'assets/tilemaps/grassTile.png');
        game.load.image('bushTile', 'assets/tilemaps/bushTile.png');
        game.load.image('pondTile', 'assets/tilemaps/pondTile.png');

        game.load.image('player','assets/sprites/player.png');
        game.load.image('bullet','assets/sprites/bullet.png');

        game.load.image('replay', 'assets/buttons/replay.png');
        game.load.image('play', 'assets/buttons/play.png');
        game.load.image('pause', 'assets/buttons/pause.png');

        game.load.audio('intro', 'assets/audios/introMusic.mp3');
        game.load.spritesheet('zombie','assets/spritesheets/zombiesheet.png',64,64);

        zombiesLeft = 0;
    }, 
    create: function(){
        var that = this;

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, 1500, 1000);
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        // intro music
        intro = game.add.audio('intro', 0.5, true); // 50% volume, loop
        // TODO uncomment next line to play
        // intro.play();

    
        var map = game.add.tilemap('state1map');
        map.addTilesetImage('grassTile');
        map.addTilesetImage('bushTile');
        map.addTilesetImage('pondTile');

        var grasslayer = map.createLayer('Grass');
        bushlayer = map.createLayer('Bushes');
        pondlayer = map.createLayer('Ponds');

        map.setCollisionBetween(2,20,true, 'Bushes');
        map.setCollisionBetween(2,20,true, 'Ponds');

        bullets = game.add.group()
        bullets.createMultiple(50, 'bullet')
        bullets.setAll('checkWorldBounds', true)
        bullets.setAll('outOfBoundsKill', true)
        bullets.setAll('anchor.x', 0.5)
        bullets.setAll('anchor.y', 0.5)
        bullets.setAll('scale.x', 1)
        bullets.setAll('scale.y', 1)

        // player: spawn randomly
        player = game.add.sprite(CENTER_X, CENTER_Y, 'player');
        player.anchor.setTo(0.5, 0.5);
        player.enableBody = true;
        
        // zombies: spawn 10 randomly
        zombieGroup = game.add.group();
        var coordinateExceptions = [{
            x: CENTER_X,
            y: CENTER_Y,
        }];
        for (var i = 0; i < 10; i++) {
            var newCoordinate = getRandCoordinateExcept(1500, 1000, 64, coordinateExceptions);
            coordinateExceptions.push(newCoordinate);
            var z = zombieGroup.create(
                newCoordinate.x,
                newCoordinate.y,
                'zombie'
            );
            zombiesLeft += 1;
        }
        zombieGroup.setAll('anchor.y', 0.5);
        zombieGroup.setAll('anchor.x', 0.5);

        zombieGroup.callAll('animations.add','animations','run',[1,2,3,4],10,true);
        zombieGroup.callAll('animations.play','animations','run');
        
        // tip
        tip = game.add.text(200, 100, '', {
            font: 'Arial',
            fontSize: 32,
            fill: '#ffffff',
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

        // buttons
        button.replay = game.add.button(150, 100, 'replay', function() {
            currentPhase = 'PLAYING';
            game.state.restart('state1');
        });
        addButtonStylesTo(button.replay);
        button.replay.visible = false;

        button.pause = game.add.button(150, 100, 'pause', function() {
            currentPhase = 'PAUSED';
            that.stopAllAnimations();
            tip.text = 'Paused';
            this.visible = false;
        });
        addButtonStylesTo(button.pause);
        button.pause.visible = false;

        button.play = game.add.button(150, 100, 'play', function() {
            currentPhase = 'PLAYING';
            that.startAllAnimations();
            tip.text = '';
            this.visible = false;
        });
        addButtonStylesTo(button.play);
        button.play.visible = false;
    }, 
    update: function(){
        if (currentPhase === 'PLAYING') {
            game.physics.arcade.collide(player,[bushlayer,pondlayer]);
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
                player.body.velocity.y = -velocity.player;
            } else if (cursors.down.isDown || game.input.keyboard.isDown(cursorsAlt.down)) {
                player.body.velocity.y = velocity.player;
            } else {
                player.body.velocity.y = 0;
            }

            if (cursors.left.isDown || game.input.keyboard.isDown(cursorsAlt.left)){
                player.body.velocity.x = -velocity.player;
            } else if (cursors.right.isDown || game.input.keyboard.isDown(cursorsAlt.right)){
                player.body.velocity.x = velocity.player;
            } else {
                player.body.velocity.x = 0;
            }

            if (!button.pause.visible) {
                button.pause.visible = true;
            }
        }

        if (currentPhase === 'PAUSED') {
            if (!button.play.visible) {
                button.play.visible = true;
            }
        }
        
        if ((zombiesLeft === 0 || !player.alive) && !button.replay.visible) {
            currentPhase = 'ENDED';
            this.stopAllAnimations();

            button.play.visible = false;
            button.pause.visible = false;
            button.replay.visible = true;

            if (zombiesLeft === 0) tip.text = 'You killed all zombies.';
            if (!player.alive) tip.text = 'You\'re dead.';
        }
    },
    fire: function() {
        if (game.time.now > nextFire) {
            nextFire = game.time.now + fireRate;
            var bullet = bullets.getFirstDead();
            bullet.reset(player.x, player.y);

            game.physics.arcade.moveToPointer(bullet, velocity.bullet);
            bullet.rotation = game.physics.arcade.angleToPointer(bullet);
        }
    },
    startAllAnimations: function() {
        zombieGroup.callAll('animations.play','animations','run');
    },
    stopAllAnimations: function() {
        player.body.velocity.setTo(0, 0);
        zombieGroup.callAll('animations.stop', 'animations', 'run');
    }
};

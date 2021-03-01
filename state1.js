
var demo = {};
var centerX = 1500/2;
var centerY = 1000/2;
var speed = 6;
var accel = 500;
var zombie;
var score = 0; 
var i = 0;


demo.state1 = function(){};
demo.state1.prototype = {
    preload: function(){
        
        //load images 
        game.load.spritesheet('zombie','assets/spritesheets/zombiesheet.png',156,171);
        game.load.image('grass','assets/backgrounds/grass.jpg');
        game.load.image('player','assets/sprites/player.png');
    }, 
    create: function(){
        
        //anytime you use physics in a game you need this
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        //set bounds for camera follow
        game.world.setBounds(0,0,1000,1000);
        
        //allows game screen to scale 
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        //add farm background
        var farm = game.add.sprite(0,0,'grass');
        farm.width = 1500
        farm.height = 1000
        
        //add zombie sprite and animate it
        zombie = game.add.sprite(750,500,'zombie');
        zombie.animations.add('run',[0,1,2,3]);

        //add player sprite
        player = game.add.sprite(750,200,'player');
        
        //make sure zombie is drawn from middle 
        zombie.anchor.x = 0.5;
        zombie.anchor.y = 0.5;
        
        
        //enable physics for zombie and coin group
        game.physics.enable([zombie]);
        
        //make it so zombie is brought down by the impact of gravity and bounces on impact
        zombie.body.drag.x = 400;
        zombie.body.collideWorldBounds = true;
        
        //follow zombie sprite with camera
        game.camera.follow(zombie);
        
        //set deadzone
        game.camera.deadzone = new Phaser.Rectangle(centerX-200,0,600,1000);
        
    }, 
    update: function(){
        
        //when right key is clicked, zombie turns to the right and moves forward by a given speed at the given acceleration
        if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            zombie.scale.setTo(1,1);
            zombie.x += speed;
            zombie.body.acceleration.x = accel;
            zombie.animations.play('run',20,true);
        }
        //when left key is clicked, zombie turns to the left and moves at a given speed at the given acceleration
        else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            zombie.scale.setTo(-1,1);
            zombie.x -= speed;
            zombie.body.acceleration.x = -accel;
            zombie.animations.play('run',20,true);
        }
        //if keys are not pressed, zombie stops running and returns to first frame
        else{
            zombie.animations.stop('run');
            zombie.frame = 0;
        }
        //up key makes zombie jump
        if (game.input.keyboard.isDown(Phaser.Keyboard.UP)){
            zombie.y -= speed;
            zombie.body.velocity.x = 100;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
            zombie.y += speed;
            zombie.body.velocity.x = 100;
        }
        else{
            zombie.body.acceleration.x = 0;
        }
        
    } 
};


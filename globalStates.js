var demo = {};

var CENTER_X = 1500 / 2;
var CENTER_Y = 1000 / 2;

var velocity = {
  player: 300,
  bullet: 1000,
}

var currentWeapon = 'rifle';
var current = 'START'; // INIT | PLAYING | PAUSED | ENDED

var nextFire = 0;
var fireRate = 200;

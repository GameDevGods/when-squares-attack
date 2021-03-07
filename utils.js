// store utility functions here

function tint() {
  this.tint = 0xbbbbbb
}

function untint() {
  this.tint = 0xffffff
}

function addButtonStylesTo(btn) {
  btn.anchor.setTo(0.5, 0.5);
  btn.scale.setTo(2, 2);
  btn.onInputDown.add(tint, btn);
  btn.onInputUp.add(untint, btn);
}

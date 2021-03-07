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

/**
 * Get random coordinates with exceptions
 * @param {number} xMax 
 * @param {number} yMax 
 * @param {number} distance 
 * @param {{x: number, y: number}[]} exceptions
 * @returns {{x: number, y: number}}
 */
function getRandCoordinateExcept(xMax, yMax, distance, exceptions) {
  var result = { x: 0, y: 0 };
  do {
    result.x = Math.round(distance / 2 + Math.random() * (xMax - distance));
    result.y = Math.round(distance / 2 + Math.random() * (yMax - distance));
  } while (exceptions.some(coordinate => Math.abs(coordinate.x - result.x) < distance && Math.abs(coordinate.y - result.y) < distance))
  return result;
}

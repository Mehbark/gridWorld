export class Agent {
  constructor(
    startX,
    startY,
    behaviorFunction,
    initFunction = pass(),
    name = "",
    initialCharacter = "@",
    initialColor = "black"
  ) {
    this.x = startX;
    this.y = startY;
    this.behaviorFunction = behaviorFunction;
    this.initFunction = initFunction;
    this.character = initialCharacter;
    this.color = initialColor;
  }
}

export function exampleBehaviorFunction(lastResult) {
  if (lastResult === this.character || lastResult === undefined) {
    this.counter++;
    this.hue += 0.01;
    this.paintColor = `hsl(${this.hue}, 100%, 50%)`;
    if (this.counter % 2 === 1) {
      return ["paint", this.paintColor];
    } else {
      return ["move", this.moveDirection];
    }
  } else {
    this.counter = 0;
    this.moveDirection = ["up", "left", "right", "down"][Math.floor(Math.random() * 4)];
    return ["move", this.moveDirection];
  }
}
export function exampleInitFunction(lastResult) {
  this.hue = 0;
  this.counter = 0;
  this.moveDirection = "right";
  this.paintColor = "blue";
}

function pass() {
  return;
}

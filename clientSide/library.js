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
  if (lastResult !== "out_of_bounds") {
    this.counter++;
    if (this.counter % 2 === 1) {
      return ["paint", this.paintColor];
    } else {
      return ["move", this.moveDirection];
    }
  } else {
    if (this.moveDirection === "left") {
      this.moveDirection = "right";
      this.paintColor = "blue";
    } else {
      this.moveDirection = "left";
      this.paintColor = "red";
    }
  }
}
export function exampleInitFunction(lastResult) {
  this.counter = 0;
  this.moveDirection = "right";
  this.paintColor = "blue";
}

function pass() {
  return;
}

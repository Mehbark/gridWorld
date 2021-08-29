export class Agent {
  constructor(
    startX,
    startY,
    behaviorFunction,
    initFunction = pass(),
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
  console.log(lastResult);
  if (lastResult === this.character || lastResult === undefined) {
    this.counter++;
    if (this.counter % 2 === 1) {
      return ["paint", "black"];
    } else {
      return ["move", "right"];
    }
  }
  return [];
}
export function exampleInitFunction(lastResult) {
  this.counter = 0;
}

function pass() {
  return;
}

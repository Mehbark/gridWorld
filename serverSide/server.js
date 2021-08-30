import { World, $, $$ } from "./library.js";
import {
  Agent,
  exampleBehaviorFunction,
  exampleInitFunction,
} from "../clientSide/library.js";

window.onload = function () {
  console.log("start");
  var testAgent = new Agent(
    0,
    0,
    exampleBehaviorFunction,
    exampleInitFunction,
    "carl"
  );
  var testAgent2 = new Agent(
    0,
    1,
    exampleBehaviorFunction,
    exampleInitFunction,
    "bob"
  );
  var test = new World(
    238,
    55,
    $("#game-world"),
    [testAgent, testAgent2],
    0,
    false,
    $("#game-log")
  );
  console.log(test.LOG_LOCATION);
  test.testRenderLocation();
  test.autoTurns();
  // test.setForegroundColorOfCharacter(0, 0, "red");
  // test.setBackgroundColorOfCharacter(1, 1, "black");
  // test.changeCharacterNoLimits(0, 0, "@");
  // test.changeCharacterNoLimits(1, 0, "M");
  // test.setBackgroundColorOfCharacter(0, 0, "black");
  // test.moveCharacter(0, 0, 1, 0);
};

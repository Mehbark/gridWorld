import { World, $, $$ } from "./library.js";

window.onload = function() {
  console.log("start");
  var test = new World(238, 56, $("#game-world"));
  test.testRenderLocation();
  test.setForegroundColorOfCharacter(0, 0, "red");
  test.setBackgroundColorOfCharacter(1, 1, "black");
  test.changeCharacterNoLimits(0, 0, "@");
  test.changeCharacterNoLimits(1, 0, "M");
  console.log(test.moveCharacter(0, 0, 1, 0));
};
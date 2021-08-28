import { World, $, $$ } from "./library.js";

window.onload = function() {
  console.log("start");
  var test = new World(238, 56, $("#game-world"));
  test.setForegroundColorOfCharacter(0, 0, "red");
  test.setBackgroundColorOfCharacter(1, 1, "black");
  test.testRenderLocation();
};
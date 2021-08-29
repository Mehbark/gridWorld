export function $(selector) {
  return document.querySelector(selector);
}
export function $$(selector) {
  return document.querySelectorAll(selector);
}
export function getCharacter(x, y, gameId = "game-world") {
  try {
    return document.getElementById(gameId).children[y].children[x];
  } catch (error) {
    console.error("That character is out of bounds!");
    return "out_of_bounds";
  }
}
//TODO: DOCUMENTATION AND WORK ON PREREQUISITES FOR AGENT INTEREACTION

export class World {
  constructor(
    width,
    height,
    renderLocation,
    MILLISECONDS_BETWEEN_TURNS = 3000,
    DEFAULT_BG_COLOR = "white",
    DEFAULT_FG_COLOR = "black",
    BACKGROUND_CHAR = " ",
    FONT_SIZE = "13px"
  ) {
    this.height = height;
    this.width = width;
    this.renderLocation = renderLocation;
    this.MILLISECONDS_BETWEEN_TURNS = MILLISECONDS_BETWEEN_TURNS;
    this.DEFAULT_BG_COLOR = DEFAULT_BG_COLOR;
    this.DEFAULT_FG_COLOR = DEFAULT_FG_COLOR;
    this.BACKGROUND_CHAR = BACKGROUND_CHAR;
    this.FONT_SIZE = FONT_SIZE;
    this.renderLocation.style.fontSize = this.FONT_SIZE;

    for (let _ = 0; _ < this.height; _++) {
      const line = document.createElement("pre");
      for (let _ = 0; _ < this.width; _++) {
        const space = document.createElement("a");
        space.textContent = this.BACKGROUND_CHAR;
        line.appendChild(space);
      }
      this.renderLocation.appendChild(line);
    }
  }

  getCharacter(x, y) {
    try {
      return this.renderLocation.children[y].children[x];
    } catch (error) {
      console.error("That character is out of bounds!");
      return "out_of_bounds";
    }
  }
  getTextInCharacter(x, y) {
    if (this.getCharacter(x, y) !== "out_of_bounds") {
      return this.getCharacter(x, y).innerText;
    } else {
      return "out_of_bounds";
    }
  }
  setForegroundColorOfCharacter(x, y, color) {
    this.getCharacter(x, y).style.color = color;
  }
  setBackgroundColorOfCharacter(x, y, color) {
    this.getCharacter(x, y).style.backgroundColor = color;
  }

  /**
   * Change the text of a character at `x` `y` without limits.
   * @param {Number} x X position of character to be changed, 0 is leftmost, the width of the world - 1 is the rightmost
   * @param {Number} y Y position of character to be changed, 0 is highest, the height of the world - 1 is the lowest
   * @param {String} character Anything you want master
   * @returns {String} The original content of the character, or `"out of bounds"` if character is out of bounds
   */
  changeCharacterNoLimits(x, y, character) {
    let toBeChanged = this.getCharacter(x, y);
    if (toBeChanged === "out_of_bounds") {
      return "out_of_bounds";
    }
    let originalText = toBeChanged.innerText;
    toBeChanged.innerText = character;
    return originalText;
  }
  /**
   * Change the text of a character at `x` `y` to a non-whitespace character.
   * @param {Number} x X position of character to be changed, 0 is leftmost, the width of the world - 1 is the rightmost
   * @param {Number} y Y position of character to be changed, 0 is highest, the height of the world - 1 is the lowest
   * @param {String} character A non-whitespace character
   * @returns {String} The original content of the character, or an error string
   */
  changeCharacter(x, y, character) {
    if (/\S/.test(character) && character.length === 1) {
      return this.changeCharacterNoLimits(x, y, character);
    } else {
      return "invalid_char";
    }
  }

  /**
   * Clear the text of a character at `x` `y` without limits.
   * @param {Number} x X position of character to be changed, 0 is leftmost, the width of the world - 1 is the rightmost
   * @param {Number} y Y position of character to be changed, 0 is highest, the height of the world - 1 is the lowest
   * @returns {String} The original content of the character
   */
  clearCharacter(x, y) {
    return this.changeCharacterNoLimits(x, y, this.BACKGROUND_CHAR);
  }

  checkIfClear(x, y) {
    return this.getTextInCharacter(x, y) === this.BACKGROUND_CHAR;
  }

  moveCharacter(fromX, fromY, toX, toY) {
    let toBeMoved = this.getCharacter(fromX, fromY);
    if (toBeMoved === "out_of_bounds") {
      return "out_of_bounds";
    } else if (this.checkIfClear(toX, toY)) {
      return this.changeCharacter(toX, toY, this.clearCharacter(fromX, fromY));
    } else {
      console.error(
        `Position already occupied by "${this.getTextInCharacter(toX, toY)}"!`
      );
      return `position_occupied_by_${this.getTextInCharacter(toX, toY)}`;
    }
  }

  testRenderLocation() {
    console.log(this.renderLocation);
  }
}

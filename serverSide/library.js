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
    agentList,
    MILLISECONDS_BETWEEN_TURNS = 3000,
    DEFAULT_BG_COLOR = "white",
    DEFAULT_FG_COLOR = "black",
    BACKGROUND_CHAR = " ",
    FONT_SIZE = "13px"
  ) {
    this.height = height;
    this.width = width;
    this.renderLocation = renderLocation;
    this.agentList = agentList;
    this.lastCommandResultList = [];

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

    this.agentList.forEach((agent) => {
      if (agent.initFunction !== undefined) {
        agent.initFunction();
      }
      this.changeCharacter(agent.x, agent.y, agent.character);
      this.setForegroundColorOfCharacter(agent.x, agent.y);
      this.setBackgroundColorOfCharacter(agent.x, agent.y);
    });
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
    const toBeChanged = this.getCharacter(x, y);
    if (toBeChanged === "out_of_bounds") {
      return "out_of_bounds";
    }
    try {
      toBeChanged.style.color = color;
      return this.getTextInCharacter(x, y);
    } catch (error) {
      return "invalid_color";
    }
  }
  setBackgroundColorOfCharacter(x, y, color) {
    const toBeChanged = this.getCharacter(x, y);
    if (toBeChanged === "out_of_bounds") {
      return "out_of_bounds";
    }
    try {
      toBeChanged.style.backgroundColor = color;
      return this.getTextInCharacter(x, y);
    } catch (error) {
      return "invalid_color";
    }
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
      this.getCharacter(toX, toY).style.color = this.getCharacter(
        fromX,
        fromY
      ).style.removeProperty("color");
      return this.changeCharacter(toX, toY, this.clearCharacter(fromX, fromY));
    } else {
      console.error(
        `Position already occupied by "${this.getTextInCharacter(toX, toY)}"!`
      );
      return `position_occupied_by_${this.getTextInCharacter(toX, toY)}`;
    }
    //TODO: set foreground color of place moving away from to default and set fg color of place moving to to the old one's one
  }

  // BEGIN AGENT HANDLING SECTION //

  //Agent behavior functions should return an array of up to two items, one command, and one argument for the command if necessary
  agentTurn(agent, lastResult) {
    const agentRequest = agent.behaviorFunction(lastResult);
    console.log(agentRequest);
    if (agentRequest === undefined) { return "no_request"; }
    switch (agentRequest[0]) {
      case "move":
        switch (agentRequest[1]) {
          case "up":
            return this.moveCharacter(agent.x, agent.y, agent.x, agent.y - 1);
          case "down":
            return this.moveCharacter(agent.x, agent.y, agent.x, agent.y + 1);
          case "left":
            return this.moveCharacter(agent.x, agent.y, agent.x - 1, agent.y);
          case "right":
            return this.moveCharacter(agent.x, agent.y, agent.x + 1, agent.y);
          default:
            return "no_arg";
        } break;
      case "check":
        switch (agentRequest[1]) {
          case "up":
            return this.getCharacter(agent.x, agent.y, agent.x, agent.y - 1);
          case "down":
            return this.getCharacter(agent.x, agent.y, agent.x, agent.y + 1);
          case "left":
            return this.getCharacter(agent.x, agent.y, agent.x - 1, agent.y);
          case "right":
            return this.getCharacter(agent.x, agent.y, agent.x + 1, agent.y);
          default:
            return "no_arg";
        } break;
      case "get_board_width":
        return this.width;
      case "get_board_height":
        return this.height;
      case "change_char":
        return this.changeCharacter(agent.x, agent.y, agentRequest[1]);
      case "change_color":
        return this.setForegroundColorOfCharacter(
          agent.x,
          agent.y,
          agentRequest[1]
        );
      case "paint":
        return this.setBackgroundColorOfCharacter(
          agent.x,
          agent.y,
          agentRequest[1]
        );
      default:
        return "no_request";
    }
  }

  turn() {
    for (let i = 0; i < this.agentList.length; i++) {
      this.lastCommandResultList[i] = this.agentTurn(
        this.agentList[i],
        this.lastCommandResultList[i]
      );
    }
  }

  // END AGENT HANDLING SECTION //
  testRenderLocation() {
    console.log(this.renderLocation);
  }
}

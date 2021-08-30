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
    LOGGING = false,
    LOG_LOCATION = undefined,
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
    this.agentPositions = [];

    this.MILLISECONDS_BETWEEN_TURNS = MILLISECONDS_BETWEEN_TURNS;
    this.LOGGING = LOGGING;
    this.LOG_LOCATION = LOG_LOCATION;
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
      this.agentPositions.push(this.addAgent(agent));
      this.changeCharacter(agent.x, agent.y, agent.character);
      this.setForegroundColorOfCharacter(agent.x, agent.y);
      this.setBackgroundColorOfCharacter(agent.x, agent.y);
    });
  }

  getCharacter(x, y) {
    try {
      const result = this.renderLocation.children[y].children[x];
      return result;
    } catch (error) {
      // console.error("That character is out of bounds!");
      return "out_of_bounds";
    }
  }
  getTextInCharacter(x, y) {
    if (
      this.getCharacter(x, y) === "out_of_bounds" ||
      this.getCharacter(x, y) === undefined
    ) {
      return "out_of_bounds";
    } else {
      return this.getCharacter(x, y).innerText;
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
    const text = this.getTextInCharacter(x, y);
    // console.log(text);
    return text === this.BACKGROUND_CHAR;
  }

  moveCharacter(fromX, fromY, toX, toY, agent, id) {
    let toBeMoved = this.getCharacter(fromX, fromY);
    if (toBeMoved === "out_of_bounds") {
      return "out_of_bounds";
    } else if (this.checkIfClear(toX, toY)) {
      this.getCharacter(toX, toY).style.color = this.getCharacter(
        fromX,
        fromY
      ).style.removeProperty("color");
      if (agent !== undefined) {
        agent.x = toX;
        agent.y = toY;
        this.agentPositions[id] = [toX, toY];
      }
      this.changeCharacter(toX, toY, this.clearCharacter(fromX, fromY));
      return this.getTextInCharacter(toX, toY);
    } else {
      // console.error(
      //   `Position already occupied by "${this.getTextInCharacter(toX, toY)}"!`
      // );
      if (this.getTextInCharacter(toX, toY) === "out_of_bounds") {
        return "out_of_bounds";
      }
      return `position_occupied_by_${this.getTextInCharacter(toX, toY)}`;
    }
    //TODO: set foreground color of place moving away from to default and set fg color of place moving to to the old one's one
  }

  // BEGIN AGENT HANDLING SECTION //

  addAgent(agent) {
    let startPos = [
      Math.floor(Math.random() * this.width),
      Math.floor(Math.random() * this.height),
    ];
    while (!this.checkIfClear(startPos[0]) || !this.checkIfClear(startPos[1])) {
      agent.x = startPos[0];
      agent.y = startPos[1];
      return startPos;
    }
  }

  logEntry(text) {
    // if (this.LOG_LOCATION.value.split("\n").length >= 10) {
    //   const shorter = this.LOG_LOCATION.value.split("\n");
    //   shorter.pop();

    //   this.LOG_LOCATION.value = shorter.join("\n");
    // }
    this.LOG_LOCATION.value += text;
    this.LOG_LOCATION.scrollTop = this.LOG_LOCATION.scrollHeight;
  }
  //Agent behavior functions should return an array of up to two items, one command, and one argument for the command if necessary
  handleAgentRequest(agent, lastResult, id) {
    const agentRequest = agent.behaviorFunction(lastResult);
    if (this.LOGGING) {
      if (agentRequest !== undefined && agentRequest !== "no_request") {
        this.logEntry(
          `\n${agent.name} requests "${agentRequest[0]} ${agentRequest[1]}", `
        );
        this.LOG_LOCATION.scrollTop = this.LOG_LOCATION.scrollHeight;
      }
    }
    if (agentRequest === undefined) {
      return "no_request";
    }
    switch (agentRequest[0]) {
      case "move":
        switch (agentRequest[1]) {
          case "up":
            return this.moveCharacter(
              agent.x,
              agent.y,
              agent.x,
              agent.y - 1,
              agent,
              id
            );
          case "down":
            return this.moveCharacter(
              agent.x,
              agent.y,
              agent.x,
              agent.y + 1,
              agent,
              id
            );
          case "left":
            return this.moveCharacter(
              agent.x,
              agent.y,
              agent.x - 1,
              agent.y,
              agent,
              id
            );
          case "right":
            return this.moveCharacter(
              agent.x,
              agent.y,
              agent.x + 1,
              agent.y,
              agent,
              id
            );
          default:
            return "no_arg";
        }
        break;
      case "check":
        switch (agentRequest[1]) {
          case "up":
            return this.getCharacter(
              agent.x,
              agent.y,
              agent.x,
              agent.y - 1,
              agent
            );
          case "down":
            return this.getCharacter(
              agent.x,
              agent.y,
              agent.x,
              agent.y + 1,
              agent
            );
          case "left":
            return this.getCharacter(
              agent.x,
              agent.y,
              agent.x - 1,
              agent.y,
              agent
            );
          case "right":
            return this.getCharacter(
              agent.x,
              agent.y,
              agent.x + 1,
              agent.y,
              agent
            );
          default:
            return "no_arg";
        }
        break;
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
  agentTurn(agent, lastResult, id) {
    const response = this.handleAgentRequest(agent, lastResult, id);
    if (this.LOGGING) {
      this.logEntry(`response is "${response}".`);
    }
    return response;
  }

  turn() {
    for (let i = 0; i < this.agentList.length; i++) {
      this.agentList[i].x = this.agentPositions[i][0];
      this.agentList[i].y = this.agentPositions[i][1];
      this.lastCommandResultList[i] = this.agentTurn(
        this.agentList[i],
        this.lastCommandResultList[i],
        i
      );
    }
  }

  autoTurns() {
    setInterval(() => this.turn(), this.MILLISECONDS_BETWEEN_TURNS);
  }

  // END AGENT HANDLING SECTION //

  testRenderLocation() {
    console.log(this.renderLocation);
  }
}

export function $(selector) {
  return document.querySelector(selector);
}
export function $$(selector) {
  return document.querySelectorAll(selector);
}

export class World {
  constructor(
    width,
    height,
    renderLocation,
    MILLISECONDS_BETWEEN_TURNS = 3000,
    BACKGROUND_CHAR = " ",
    FONT_SIZE = "13px"
  ) {
    this.height = height;
    this.width = width;
    this.renderLocation = renderLocation;
    this.MILLISECONDS_BETWEEN_TURNS = MILLISECONDS_BETWEEN_TURNS;
    this.BACKGROUND_CHAR = BACKGROUND_CHAR;
    this.FONT_SIZE = FONT_SIZE;
    this.renderLocation.style.fontSize = this.FONT_SIZE

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

  setForegroundColorOfCharacter(x, y, color) {
    this.renderLocation.children[y]
                       .children[x]
                       .style.color = color;
  }

  setBackgroundColorOfCharacter(x, y, color) {
    this.renderLocation.children[y]
                       .children[x]
                       .style.backgroundColor = color;
  }

  testRenderLocation() {
    console.log(this.renderLocation);
  }
}

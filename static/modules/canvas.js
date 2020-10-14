class Canvas {
  constructor() {
    this.element = document.querySelector("#cvs");

    this.square = 32;
    this.columns = 30;
    this.rows = 20;
  }

  initialize() {
    this.element.width = this.square * this.columns;
    this.element.height = this.square * this.rows;
  }
}

export default new Canvas();

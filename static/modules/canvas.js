//Singleton

class Canvas {
  constructor() {
    this.element = null;
    this.ctx = null;
  }

  initialize(params) {
    this.element = params.element;
    this.element.width = params.width;
    this.element.height = params.height;
    this.initCtx();
  }

  initCtx() {
    this.ctx = this.element.getContext("2d");
    this.ctx.font = "bold 10pt sans-serif";
  }
}

export default new Canvas();

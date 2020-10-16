//Singleton used to be able to reference CTX from multiple imports
class Ctx {
  constructor() {
    this.element = null;
  }

  setElement(ctx) {
    this.element = ctx;
  }
}

export default new Ctx();

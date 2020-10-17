class Tileset {
  constructor() {
    this.image = null;
    this.url = "/tileset.png";
    this.loaded = false;
    this.load();
  }

  load() {
    this.image = new Image();
    this.image.onerror = () => {
      this.image = null;
      console.error("Failed to load tileset");
    };
    this.image.onload = () => {
      console.log("loaded tileset");
      this.loaded = true;
    };
    this.image.src = this.url;
  }
}

export default new Tileset();

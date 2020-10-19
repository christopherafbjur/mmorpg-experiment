class Tileset {
  constructor() {
    this.sheets = {
      tiles: {
        image: null,
        url: "/sprites/otsp_tiles_01.png",
      },
      equipment: {
        image: null,
        url: "/sprites/otsp_equipment_01.png",
      },
      nature: {
        image: null,
        url: "/sprites/otsp_nature_01.png",
      },
      walls: {
        image: null,
        url: "/sprites/otsp_walls_01.png",
      },
      creatures: {
        image: null,
        url: "/sprites/otsp_creatures_02.png",
      },
    };
    this.image = null;
    /* this.url = "/tileset.png"; */
    this.url = "/sprites/otsp_tiles_01.png";
    this.loaded = false;
    this.load();
  }

  load() {
    let sheetsLoaded = 0;
    Object.keys(this.sheets).forEach((sheet) => {
      this.sheets[sheet].image = new Image();
      this.sheets[sheet].image.onerror = () => {
        this.image = null;
        console.error("Failed to load tileset");
      };
      this.sheets[sheet].image.onload = (e) => {
        console.log("loaded tileset");
        sheetsLoaded++;
        /* console.log("heh", this.getImageWithoutPink(this.sheets[sheet].image)); */
        if (sheetsLoaded === Object.keys(this.sheets).length) {
          this.loaded = true;
        }
      };
      this.getImageWithoutPink(this.sheets[sheet].url, (imageDataUrl) => {
        this.sheets[sheet].image.src = imageDataUrl;
      });
      /* this.sheets[sheet].image.src = this.sheets[sheet].url; */
    });
  }

  getImageWithoutPink(src, callback) {
    var image = new Image();
    image.onload = function () {
      var buffer = document.createElement("canvas");
      var bufferctx = buffer.getContext("2d");
      buffer.width = image.width;
      buffer.height = image.height;
      bufferctx.drawImage(image, 0, 0);
      var imageData = bufferctx.getImageData(0, 0, buffer.width, buffer.height);
      var data = imageData.data;
      var removeBlack = function () {
        for (var i = 0; i < data.length; i += 4) {
          //is pink color we want to remove
          if (data[i] === 255 && data[i + 1] === 0 && data[i + 2] === 255) {
            data[i + 3] = 0; // alpha
          }
        }
        bufferctx.putImageData(imageData, 0, 0);
        callback(buffer.toDataURL());
      };
      removeBlack();
    };
    image.onerror = function () {
      console.error("Failed to load buffer images");
    };
    image.src = src;
  }
}

export default new Tileset();

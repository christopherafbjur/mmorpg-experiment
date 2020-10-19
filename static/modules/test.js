//Used for test generating stuff
import MapObject from "./items/mapobject";
import PlacedItemStack from "./items/placedItemStack";
class Test {
  createObjects() {
    //Create some random objects on the map (stones/trees etc)
    var mo7 = new MapObject(4);
    mo7.placeAt(2, 6);
    /* var mo1 = new MapObject(1);
    mo1.placeAt(2, 4);
    var mo2 = new MapObject(2);
    mo2.placeAt(2, 3);

    var mo11 = new MapObject(1);
    mo11.placeAt(6, 4);
    var mo12 = new MapObject(2);
    mo12.placeAt(7, 4);

    var mo4 = new MapObject(3);
    mo4.placeAt(4, 5);
    var mo5 = new MapObject(3);
    mo5.placeAt(4, 8);
    var mo6 = new MapObject(3);
    mo6.placeAt(4, 11);

    var mo7 = new MapObject(3);
    mo7.placeAt(2, 6);
    var mo8 = new MapObject(3);
    mo8.placeAt(2, 9);
    var mo9 = new MapObject(3);
    mo9.placeAt(2, 12); */
  }

  createItems() {
    //Create some random items on the map (stars)
    for (var i = 3; i < 8; i++) {
      var ps = new PlacedItemStack(1, 1);
      ps.placeAt(i, 1);
    }
    for (var i = 3; i < 8; i++) {
      var ps = new PlacedItemStack(1, 1);
      ps.placeAt(3, i);
    }
  }
}

export default new Test();

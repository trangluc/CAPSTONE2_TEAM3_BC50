export class ListProduct {
  construcor(
    _name,
    _price,
    _screen,
    _backCamera,
    _frontCamera,
    _img,
    _disc,
    _type
  ) {
    this.name = _name;
    this.price = _price;
    this.screen = _screen;
    this.backCamera = _backCamera;
    this.frontCamera = _frontCamera;
    this.img = _img;
    this.disc = _disc;
    this.type = _type;
  }
}

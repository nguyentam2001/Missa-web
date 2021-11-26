$(document).ready(function () {
  new Navigate();
});

class Navigate {
  constructor() {
    this.initEvent();
  }
  initEvent() {
    $(".nav-menu-item").click(this.handleOnClick);
  }
  handleOnClick() {
    console.log("hello");
  }
}

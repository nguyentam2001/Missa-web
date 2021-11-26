$(document).ready(function () {
  new VaLidateInput();
});

class VaLidateInput {
  IsBlur = false;
  IsError = false;
  fieldValCurr = null;
  isSave = false;
  constructor() {
    this.initEvent();
  }
  initEvent() {
    //sự kiên
    $(".m-input.m-input-staff").blur(this.handleInputOnBlur.bind(this));
    $(".m-input.m-input-staff").keyup(this.handleInputOnKeyUp.bind(this));
    $("#btnSaveFormEmployee").click(this.handleValidateOnClick.bind(this));
    $(".m-input.m-input-staff").focus(this.handleInputOnFocus.bind(this));
  }

  /**
   * Xử lý sự kiện focus
   * Author: Nguyễn Văn Tâm (22/11/2021)
   *  Mỗi lần blur thì giá trị blur là true
   * => Mong muốn Mỗi lần focus vào trường input khác trường
   * hiện tại, lần nhập đầu tiên của sự kiện on key up nó sẽ không lọt
   *  vào check value và hiện
   * hiện messenger error. sau đó blur ra ngoài thì hiện lỗi và lần nhập
   * tiếp theo vẫn ở trường input hiện tại sẽ lọt vào on keyup để check
   * => vấn đề là khi blur ra ngoài thì blur sẽ về true và các input khác sẽ tự
   * động lọt vào check trong on key up nó sẽ hiện lỗi ngay lần focus và nhập đầu tiên
   * => giải pháp so sánh input hiện tại  và input trước đó sau mỗi lần focus
   * nếu input validate hiện tại chính là input validate
   *  focus trước đó thì blur sẽ gán là true => nó sẽ lọt vào on key up
   * ngược lại nếu input validate hiện tại khác  input validate được gán trước
   * đó  thì blur sẽ gán là false và gán input hiện tại bằng input trước đó
   * Author: NVTAM (22/11/2021)
   */

  handleInputOnFocus(sender) {
    //kiểm tra xem field validate hiện tại focus có khác với field validate trước đó không
    let curr = $(sender.target).attr("fieldValidate");
    if (this.fieldValCurr != curr) {
      //nếu khác thì cho is blur là false
      this.IsBlur = false;
      //gán field validate current hiện tại
      this.fieldValCurr = curr;
    } else {
      this.IsBlur = true;
    }
  }

  handleValidateOnClick() {
    this.isSave = true;
    //lặp qua tất cả các input
    let inputs = $("input[fieldValidate]");
    // khởi tạo mảng check tất cả error
    const errors = [];
    for (const input of inputs) {
      //Khởi tạo mặc định là không có lỗi sao mỗi lần duyệt
      this.IsError = false;
      //nấy ra value của input cần duyệt
      const valueInput = $(input).val();
      //lấy field name của input
      const fieldName = $(input).attr("fieldValidate");
      //lấy element eroror mesage
      const errorMessage = $(input).siblings(".error-message");
      //kiểm tra đầu vào
      this.passAllCase(fieldName, errorMessage, valueInput);
      //gán is error sau mỗi lần
      let currError = this.IsError;
      errors.push(currError);
    }
    //kiểm tra tất cả trường nhập có đúng không
    console.log(errors.every((error) => !error));
  }
  /**
   * kiểm tra value on key up
   * Author: Nguyễn Văn Tâm (22/11/2021)
   */

  handleInputOnKeyUp(sender) {
    const inputCurr = sender.target;
    //lấy giá trị của input
    const value = $(inputCurr).val();
    if (this.IsBlur || this.isSave) {
      //lấy element error
      const errorMessage = $(inputCurr).siblings(".error-message");
      //kiểm tra giá trị của input
      const fieldName = $(inputCurr).attr("fieldValidate");
      //kiểm tra giá trị của input
      this.passAllCase(fieldName, errorMessage, value);
    }
  }

  handleInputOnBlur(sender) {
    //gán is blur is true để có thể kiểm tra trong on key up
    this.IsBlur = true;
    const inputCurr = sender.target;
    //lấy giá trị của input
    const value = $(inputCurr).val();
    //lấy element error
    const errorMessage = $(inputCurr).siblings(".error-message");
    //kiểm tra giá trị của input
    const fieldName = $(inputCurr).attr("fieldValidate");
    //check input ở đây
    if (value.length <= 0) {
      //luôn luôn không được để trống
      $(errorMessage).empty();
      $(errorMessage).append("Trường này không được để trống");
    } else {
      this.passAllCase(fieldName, errorMessage, value);
    }
  }

  passAllCase(fieldName, errorMessage, value) {
    if (value.length <= 0) {
      //luôn luôn không được để trống
      $(errorMessage).empty();
      this.IsError = true;
      $(errorMessage).append("Trường này không được để trống");
    } else {
      switch (fieldName) {
        //kiểm tra name
        case "FullName":
          if (!this.validateName(value)) {
            $(errorMessage).empty();
            this.IsError = true;
            $(errorMessage).append("Vui lòng nhập tên lớn hơn 3 ký tự");
          } else {
            $(errorMessage).empty();
          }
          break;
        //kiểm tra email
        case "Email":
          if (!this.validateEmail(value)) {
            $(errorMessage).empty();
            this.IsError = true;
            $(errorMessage).append("Vui lòng nhập đúng email");
          } else {
            $(errorMessage).empty();

            //nếu đúng thì gán Is error là false
          }
          break;
        default:
          break;
      }
    }
  }

  validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  validateName(name) {
    return name.length > 3;
  }
}

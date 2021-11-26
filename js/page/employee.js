$(document).ready(function () {
  //khởi tạo cái là nó chạy vào hàm khởi tạo (gọi constructor)
  new EmployeePage();
});

class EmployeePage {
  TitlePage = "Danh sách nhân viên";
  employeeIdSelected = null;
  FormMode = null;
  Url = "http://cukcuk.manhnv.net/api/v1/Employees";
  constructor() {
    //gọi hàm loadData trong constructor
    this.loadData();
    //lấy department id render potion combobox
    this.loadDepartmentId(); //load department id
    //lấy position render ra commobox
    this.loadPosition();
    //gọi hàm initEvent
    this.initEvent();
  }
  //#region load data
  /**
   * Load dữ liệu cho trang
   * Author: NVTAM (19/11/2021)
   */
  loadData() {
    //trước khi load dữ liệu cần empty() tr để chõ đỡ bị append lại
    $(".m-table tbody").empty();
    //lấy dữ liêu qua Api bằng ajax
    $.ajax({
      type: "GET",
      url: "http://cukcuk.manhnv.net/api/v1/Employees",
      success: function (response) {
        let employees = response;
        //duyệt qua từng nhân viên
        for (const employee of employees) {
          //khai báo biến render
          let trHTML = $(`<tr>
            <td class="text-algin-left">${employee.EmployeeCode}</td>
            <td class="text-algin-left max-with-200 ">${employee.FullName}</td>
            <td class="text-algin-center">${CommonJS.formatDateDDMMYYYY(
              employee.DateOfBirth
            )}</td>
            <td class="text-algin-left">${employee.GenderName ?? "chưa rõ"}</td>
            <td class="text-algin-left max-with-100">${
              employee.PhoneNumber
            }</td>
            <td class="text-algin-left ">${employee.Email ?? "chưa rõ"}</td>
            <td class="text-algin-left">${
              employee.PositionName ?? "chưa rõ"
            }</td>
            <td class="text-algin-left">${
              employee.DepartmentName ?? "chưa rõ"
            }</td>
            <td class="text-algin-right">${CommonJS.formatCurrencyVND(
              employee.Salary
            )}</td>
            <td class="text-algin-left">Đang làm việc</td>
            <td>
              <div class="handle-wrapper">
                <div class="handle-wrapper-btn" >
                  <button class="btn-edit-employee-selected" ><i class="fas fa-user-edit"></i></button>
                  <button class="btn-delete-employee-selected" ><i class="fas fa-user-times"></i></button>
                </div>
              </div>
            </td>
            </tr>`);
          //lưu id nhân viên vào từng data của row tương ứng
          trHTML.data("EmployeeId", employee.EmployeeId);
          trHTML.data("Employee", employee);
          // render dữ liệu vào table tbody
          $(".m-table tbody").append(trHTML);
        }
      },
    });
  }
  //#endregion
  /**
   * khởi tạo gán sự kiên có trong page
   * Author: NVTAM (11/19/2021)
   */
  initEvent() {
    //button add
    $(".m-btn.btn-add-employee").click(this.btnAddOnclick.bind(this));
    //button save
    $("#btnSaveFormEmployee").click(this.saveData.bind(this));
    //button cancel
    // 1.sự kiên dấu x trên cùng bên phải form
    $(".m-btn-pop-up-del").click(this.handleCancel);
    // 2.sự kiện khi ấn vào nút hủy
    $(".m-btn-pop-up-cancel").click(this.handleCancel);
    //button show pup-up delete
    // 1. khi click icon delete từng dòng
    $(".m-table tbody").on(
      "click",
      "tr .handle-wrapper .btn-delete-employee-selected",
      this.handleShowPopUpDelete.bind(this)
    );
    //button update
    // 1. khi click icon sửa từng dòng
    $(".m-table tbody").on(
      "click",
      "tr .handle-wrapper .btn-edit-employee-selected",
      this.btnUpdateOnClick.bind(this)
    );
    //button delete
    $("#btnDelete").click(this.delete.bind(this));
    //sự kiện mouseenter thì add box handle sửa, xóa cho tr được chọn
    $(".m-table tbody").on("mouseenter", "tr", this.handleMouseenterOnRow);
    //sự kiện cancel toast messenger
    $(".toast-messenger-cancel").click(this.hideToastMessenger);
  }

  /**
   * Sử lý sự kiện mouseenter khi di chuột vào từng row
   * Author: Nguyễn Văn Tâm (11/20/2021)
   */
  handleMouseenterOnRow() {
    //xóa tất cả các class được chọn
    $(this)
      .siblings("tr")
      .find(".handle-wrapper")
      .removeClass("handle-wrapper-selected");
    //đánh dấu class được trọn đồng thời thêm wrapper handle
    const thisTrElement = $(this).find(".handle-wrapper");
    $(thisTrElement).addClass("handle-wrapper-selected");
    $(thisTrElement).addClass("handle-wrapper-selected");
  }

  /**
   * Sử lý sự kiện hiện form nhân viên khi nhấn đúp chuột
   * Author: Nguyễn Văn Tâm (11/20/2021)
   */
  btnUpdateOnClick(sender) {
    //gán formMode sự kiện update
    this.FormMode = Enum.FormMode.Update;
    let me = this;
    //lấy phần tử element hiện tại đang bdlclick

    const currentRowElement = sender.currentTarget.closest("tr");
    //hiển thị form nhân viên
    $("#m-dialog").show();
    //Lấy id nhân viên được chọn
    this.employeeIdSelected = $(currentRowElement).data("EmployeeId");
    //Lấy thông tin nhân viên được chọn qua API
    $.ajax({
      type: "GET",
      url: `${me.Url}/${this.employeeIdSelected}`,
      async: false,
      success: function (emp) {
        //Binding toàn bộ dữ liệu của nhân viên được chọn vào form input
        // 1.lấy ra tất cả các input có attr là fieldName
        let inputs = $("input[fieldName]");
        // 2.Lấy ra tất cả các ncombobox
        let comboboxs = $(".ncombobox");
        // Duyệt qua từng input
        for (const input of inputs) {
          // lấy toàn bộ attribute field name
          let fieldName = $(input).attr("fieldName");
          //gán các thuộc tính của đối tượng vào input
          let valueEmp = emp[fieldName];
          if (valueEmp)
            //gán vào value vào input
            $(input).val(valueEmp);
        }
        //Duyệt qua từng combobox
        for (const combobox of comboboxs) {
          // lấy toàn bộ attribute field name
          let fieldName = $(combobox).attr("fieldName");
          //Giá trị vào input
          let valueEmp = emp[fieldName];
          if (valueEmp) {
            //Tìm input của combobox
            let input = $(combobox).children("input");

            $(input[0]).val(valueEmp);
          }
        }
      },
    });
  }
  /**
   * Sử lý sự kiện thêm mới thông tin nhân viên
   * Author: Nguyễn Văn Tâm (11/20/2021)
   */
  saveData() {
    let me = this;
    //validate dữ liệu

    //lấy ra tất cả các input có attr là fieldName
    let inputs = $("input[fieldName]");
    //lấy ra tất cả ncombobox
    let comboboxs = $(".ncombobox");

    //Khởi tạo một đối tượng employee
    const employee = {};
    // Duyệt qua từng input
    for (const input of inputs) {
      // lấy attribute field name
      let fieldName = $(input).attr("fieldName");
      //lấy value của input
      let value = $(input).val();
      if (value)
        //gán vào object employee
        employee[fieldName] = value;
    }
    //Duyệt từng element ncomboboxs có
    for (const combobox of comboboxs) {
      let fieldDataCb = $(combobox).attr("fieldData");
      //lấy data của combobox
      let dataCb = $(combobox).data("value");
      //gán data vào  object employee
      employee[fieldDataCb] = dataCb;
    }
    console.log(employee);
    if (this.FormMode === Enum.FormMode.Add) {
      //cất dữ liệu lên sever bằng ajax
      $.ajax({
        type: "POST",
        url: me.Url,
        data: JSON.stringify(employee),
        dataType: "json",
        async: false, //để cho chay đồng bộ hủy bỏ bất đồng bộ
        contentType: "application/json", //kiểu content type, response trả về dạng json
        success: function (response) {
          //load lại trang web
          me.loadData();
          //đóng form nhập thông tin nhân viên
          $("#m-dialog").hide();
        },
        error: function (error) {
          console.log(error);
        },
      });
    } else if (this.FormMode === Enum.FormMode.Update) {
      $.ajax({
        type: "PUT",
        url: `${me.Url}/${me.employeeIdSelected}`,
        data: JSON.stringify(employee),
        dataType: "json",
        async: false, //để cho chay đồng bộ hủy bỏ bất đồng bộ
        contentType: "application/json", //kiểu content type, response trả về dạng json
        success: function (response) {
          //load lại trang web
          me.loadData();
          //đóng form nhập thông tin nhân viên
          $("#m-dialog").hide();
        },
        error: function (error) {
          console.log(error);
        },
      });
    }
  }
  /**
   * Sử lý sự kiên button add hiển thị form thêm mới nhân viên
   * Author: Nguyễn Văn Tâm (11/20/2021)
   */
  btnAddOnclick() {
    //gán formMode sự kiện add
    this.FormMode = Enum.FormMode.Add;
    //xóa bỏ thông tin cũ trong input ở form
    $("input").val(null);
    //Gán id nhân viên mới vào input form
    $.ajax({
      type: "GET",
      url: "http://cukcuk.manhnv.net/api/v1/Employees/NewEmployeeCode",
      async: false,
      success: function (response) {
        //Gán id nhân viên mới vào input form
        $("#txtEmployeeCode").val(response);
      },
    });
    //show pop-up nhập thông tin nhân viên
    $("#m-dialog").show();
  }
  handleCancel() {
    $("#m-dialog-del").hide();
    $("#m-dialog").hide();
  }

  /**
   * form xác nhận xóa
   * Author: Nguyễn Văn Tâm (24/12/2021)
   */

  handleShowPopUpDelete(sender) {
    // hiển thị pup-up xác nhận xóa
    $("#m-dialog-del").show();
    //lấy row selected
    const currentRowElement = sender.currentTarget.closest("tr");
    //lấy tên nhân viên được chọn
    let employee = $(currentRowElement).data("Employee");

    //gán tên nhân viên được chọn
    $("#titlePopUpDel").text(employee.FullName);
    $(".employee-del-name").text(employee.FullName);
    //gán id nhân viên được chọn
    this.employeeIdSelected = $(currentRowElement).data("EmployeeId");
  }

  delete() {
    let me = this;
    //gửi request delete lên sever để xóa nv
    $.ajax({
      type: "DELETE",
      url: `${me.Url}/${me.employeeIdSelected}`,
      success: function (response) {
        //đóng form đăng nhập
        $("#m-dialog-del").hide();
        //load lại page
        me.loadData();
        //hiển thị toast messenger xóa thành công
        //hiển thị toast messenger
        $(".toast-messenger-del").show();
        setTimeout(() => {
          $(".toast-messenger-del").hide();
        }, 10000);
      },
    });
  }
  hideToastMessenger() {
    $(this).closest(".toast-messenger-item").hide();
  }
  /**
   * Load departmentId gender ra combobox
   * Author: NVT (11/20/2021)
   */
  loadDepartmentId() {
    // gọi department id
    $.ajax({
      type: "GET",
      url: "http://cukcuk.manhnv.net/api/v1/Departments",
      async: false,
      success: function (response) {
        console.log(response);
        // bind ra combobox
        for (const department of response) {
          const { DepartmentId, DepartmentName } = department;
          let departmentHTML = `<div class="m-combobox-item" value="${DepartmentId}">${DepartmentName}</div>
          `;
          $("#cbDepartment .m-combobox-list").append(departmentHTML);
        }
      },
    });
  }
  /**
   * Load position render ra combobox
   * create by: Nguyen van tam (11/20/2021)
   */

  loadPosition() {
    // gọi department id
    $.ajax({
      type: "GET",
      url: "http://cukcuk.manhnv.net/api/v1/Positions",
      async: false,
      success: function (response) {
        console.log(response);
        // bind Position ra combobox
        for (const position of response) {
          const { PositionId, PositionName } = position;
          let positionHTML = `<div class="m-combobox-item" value="${PositionId}">${PositionName}</div>
        `;
          $("#cbPosition .m-combobox-list").append(positionHTML);
        }
      },
    });
  }
}

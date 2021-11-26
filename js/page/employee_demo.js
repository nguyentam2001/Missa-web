$(document).ready(function () {
  //show pop up loading
  $(".loader-page").show();
  //check update employee
  updateEmployee = null;
  employeeIdSelected = null;
  getDataEmployees();
  //lấy department id render potion combobox
  loadDepartmentId(); //load department id
  //lấy position render ra commobox
  loadPosition();
  //sử lý các sự kiện cho page
  //load data
  $("#btn-reload").on("click", handleReload);
  //hiển thị dialog nhập thông tin nhân viên
  $(".m-btn.btn-add-employee").click(showFormEmployee);
  //ẩn dialog nhập thông tin nhân viên
  $(".m-dialog .m-btn-pop-up-del").click(hideFromEmployee);
  $("#m-btn-pop-up-cancel").click(hideFromEmployee);
  //ẩn dialog xóa thông tin nhân viên
  $("#m-btn-pop-up-del-cancel").click(hideFromEmployee);
  //sự kiện lưu trữ thông tin nhân viên
  $("#btnSaveFormEmployee").click(saveFormEmployee);
  //sự kiện mouseenter thì add box handle sửa, xóa cho tr được chọn
  $(".m-table tbody").on("mouseenter", "tr", function () {
    //xóa tất cả các class được chọn
    $(this)
      .siblings("tr")
      .find(".handle-wrapper")
      .removeClass("handle-wrapper-selected");
    //đánh dấu class được trọn đồng thời thêm wrapper handle
    const thisTrElement = $(this).find(".handle-wrapper");
    $(thisTrElement).addClass("handle-wrapper-selected");
    $(thisTrElement).addClass("handle-wrapper-selected");
  });

  //xử lý và hiển thị pop up xóa nhân viên được chọn
  $(".m-table tbody").on(
    "click",
    "tr .handle-wrapper .btn-delete-employee-selected",
    function () {
      //lấy id data nhân viên của tr được chọn
      employeeIdSelected = $(this).closest("tr").data("employeeIdSaveData");
      // gán tên nhân viên cần xóa vào pop up
      const nameThisEmployee =
        $(this).closest("tr").data("employeeSaveData").FullName ||
        "Chưa rõ tên";
      $("#m-dialog-del .employee-del-name").text(nameThisEmployee);
      // Hiển thi pup-up xóa thông tin nhân viên
      setTimeout(() => {
        $("#m-dialog-del").show();
      }, 200);
    }
  );
  //xóa nhân viên on click
  $("#btnDelete").on("click", deleteEmployeeOnClick);

  //Sửa nhân viên
  // 1. khi ấn bdl click
  $(".m-table tbody").on(
    "click",
    "tr .handle-wrapper .btn-edit-employee-selected",
    handleUpdateOnDblClick
  );
  //sự kiên hide toast messenger delete
  $(".toast-messenger-cancel").click(hideToastMessenger);
});
function hideToastMessenger() {
  $(this).closest(".toast-messenger-item").hide();
}

function handleUpdateOnDblClick() {
  //kich hoạt trạng thái pudate
  updateEmployee = true;
  //lấy dữ liệu từ tr cha
  const employee = $(this).closest("tr").data("employeeSaveData");
  const {
    EmployeeCode,
    FullName,
    DateOfBirth,
    GenderName,
    PhoneNumber,
    Email,
    DepartmentName,
    PositionName,
    Salary,
  } = employee;
  //lấy Id nhân viên được chọn ở data
  employeeIdSelected = $(this).closest("tr").data("employeeIdSaveData");
  //hiên form
  $("#m-dialog").show();
  //lấy dữ liệu gender vào Form
  $("#txtEmployeeCode").val(EmployeeCode);
  $("#txtEmployeeName").val(FullName);
  $("#txtDateOfBirth").val(DateOfBirth);
  // $("#cbGender").attr("value");
  $("#txtEmail").val(Email);
  $("#txtPhoneNumber").val(PhoneNumber);
  // $("#cbPosition").attr("value");
  // $("#cbDepartment").attr("value");
  $("#txtSalary").val(Salary);
  $("#txtDateJoin").val(GenderName);
  $("#cbJobStatus").val(DepartmentName);
}

function deleteEmployeeOnClick() {
  //gọi ajax xóa nhân viên
  $.ajax({
    type: "DELETE",
    url: `http://cukcuk.manhnv.net/api/v1/Employees/${employeeIdSelected}`,
    async: false,
    success: function (response) {
      console.log(response);
    },
  });
  //xóa xong load lại trang
  handleReload();
  //hiển thị toast messenger
  $(".toast-messenger-del").show();
  setTimeout(() => {
    $(".toast-messenger-del").hide();
  }, 10000);
  //Ẩn form xóa nhân viên
  $("#m-dialog-del").hide();
}
/**
 * Load department id render ra combobox
 * create by: Nguyen van tam (13/11/2021)
 */

const loadDepartmentId = () => {
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
        // let departmentHTML = `<option class="m-combobox" value="${DepartmentId}">${DepartmentName}</option>`;
        // $("#cbDepartment").append(departmentHTML);
        let departmentHTML = `<div class="m-combobox-item" value="${DepartmentId}">${DepartmentName}</div>
        `;
        $("#cbDepartment .m-combobox-list").append(departmentHTML);
      }
    },
  });
};

/**
 * Load position render ra combobox
 * create by: Nguyen van tam (13/11/2021)
 */

const loadPosition = () => {
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
        // let positionHTML = `<option class="m-combobox" value="${PositionId}">${PositionName}</option>`;
        // $("#cbPosition").append(positionHTML);
        let positionHTML = `<div class="m-combobox-item" value="${PositionId}">${PositionName}</div>
        `;
        $("#cbPosition .m-combobox-list").append(positionHTML);
      }
    },
  });
};

const saveFormEmployee = () => {
  //lấy thông tin từ form
  const employeeCode = $("#txtEmployeeCode").val();
  const employeeName = $("#txtEmployeeName").val();
  const dateOfBirth = $("#txtDateOfBirth").val();
  const gender = $("#cbGender").attr("value");
  const email = $("#txtEmail").val();
  const phoneNumber = $("#txtPhoneNumber").val();
  const positionId = $("#cbPosition").attr("value");
  const departmentId = $("#cbDepartment").attr("value");
  const salary = $("#txtSalary").val();
  const dateJoin = $("#txtDateJoin").val();
  const jobStatus = $("#cbJobStatus").val();
  //Chuyển thông tin dưới dạng object hay json

  const objEmployee = {
    DateOfBirth: dateOfBirth, //date of birth
    DepartmentId: departmentId,
    Email: email, //email
    EmployeeCode: employeeCode, //code
    // EmployeeId: "adb9cb83-4470-11ec-8a45-00163e047e89",
    FullName: employeeName, //name
    Gender: gender,
    PositionId: positionId,
    PhoneNumber: phoneNumber, //phone
    Salary: salary,
    WorkStatus: jobStatus,
  };
  //Kiểm tra xem có phải update dữ liệu không
  if (updateEmployee) {
    //bắn thông tin lên API qua ajax
    $.ajax({
      type: "PUT", //update dữ liệu lên API
      url: `http://cukcuk.manhnv.net/api/v1/Employees/${employeeIdSelected}`,
      data: JSON.stringify(objEmployee),
      dataType: "json",
      async: false, //để cho chay đồng bộ hủy bỏ bất đồng bộ
      contentType: "application/json", //kiểu content type, response trả về dạng json
      success: function (response) {
        console.log(response);
      },
      error: function (res) {
        console.log(res);
      },
    });
  } else {
    //bắn thông tin lên API qua ajax
    $.ajax({
      type: "POST",
      url: "http://cukcuk.manhnv.net/api/v1/Employees",
      data: JSON.stringify(objEmployee),
      dataType: "json",
      async: false, //để cho chay đồng bộ hủy bỏ bất đồng bộ
      contentType: "application/json", //kiểu content type, response trả về dạng json
      success: function (response) {
        console.log(response);
      },
      error: function (res) {
        console.log(res);
      },
    });
  }
  //ẩn dialog nhập thông tin nhân viên
  hideFromEmployee();
  //tự dộng reload lại trang
  handleReload();
  //hiên toast messenger thêm mới thành công
  $(".toast-messenger-success").show();
  setTimeout(() => {
    $(".toast-messenger-success").hide();
  }, 10000);
};

const showFormEmployee = () => {
  $("#m-dialog").show();
  //lấy mã nhân viên mới và đồng thời hiển thị vào ô nhập liệu
  $.ajax({
    type: "GET",
    url: "http://cukcuk.manhnv.net/api/v1/Employees/NewEmployeeCode",
    success: function (response) {
      $("#txtEmployeeCode").val(response);
      //tự động focus input
      $("#txtEmployeeCode").focus();
    },
  });
};
const hideFromEmployee = () => {
  //Ẩn form nhập liệu
  $(".m-dialog").hide();
  //xóa các giữ liệu cũ trong input
  $("input").val(null);
};

async function getDataEmployees() {
  const url = "http://cukcuk.manhnv.net/api/v1/Employees";
  //cho dữ liệu tbody trống trước khi click
  $(".m-table tbody").empty();
  //khởi tạo employees
  let employees;
  //get employees in API
  try {
    const response = await fetch(url);
    employees = await response.json();
  } catch (err) {
    console.log(err);
  }

  //lặp qua mảng employee để lấy dữ liệu render ra màn hình
  for (const employee of employees) {
    const {
      EmployeeId,
      EmployeeCode,
      FullName,
      DateOfBirth,
      GenderName,
      PhoneNumber,
      Email,
      DepartmentName,
      PositionName,
      Salary,
    } = employee;

    //format date
    let dateFormat = new Date(`${DateOfBirth ?? "2021-12-11T00:00:00"}`);
    let date =
      dateFormat.getDate() < 10
        ? `0${dateFormat.getDate()}`
        : dateFormat.getDate();
    let month =
      dateFormat.getMonth() < 10
        ? `0${dateFormat.getMonth()}`
        : dateFormat.getMonth();
    let year = dateFormat.getFullYear();
    dateFormat = `${date}/${month}/${year}`;

    // format salary
    let salary = Salary ?? 0;
    salary = salary.toLocaleString("it-IT", {
      style: "currency",
      currency: "VND",
    });
    let employeeHtml = $(`
    <tr>
    <td class="text-algin-left">${EmployeeCode}</td>
    <td class="text-algin-left max-with-200 ">${FullName}</td>
    <td class="text-algin-center">${dateFormat}</td>
    <td class="text-algin-left">${GenderName ?? "chưa rõ"}</td>
    <td class="text-algin-left max-with-100">${PhoneNumber}</td>
    <td class="text-algin-left ">${Email ?? "chưa rõ"}</td>
    <td class="text-algin-left">${PositionName ?? "chưa rõ"}</td>
    <td class="text-algin-left">${DepartmentName ?? "chưa rõ"}</td>
    <td class="text-algin-right">${salary}</td>
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
    employeeHtml.data("employeeIdSaveData", EmployeeId);
    employeeHtml.data("employeeSaveData", employee);
    //append ra dom
    $(".m-table tbody").append(employeeHtml);
  }
  // hind loading
  $(".loader-page").hide();
}

function handleReload() {
  $(".loader-page").show();
  getDataEmployees();
}

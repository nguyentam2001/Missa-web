$(document).ready(function () {
  new CustomerPage();
});

class CustomerPage extends BaseTable {
  constructor() {
    super("http://cukcuk.manhnv.net/api/v1/Customerss", "customersTable");
    this.loadData();
  }

  //#region
  /**
   * Load dữ liệu
   * Author: NVTAM (11/24/2021)
   */
  /*loadData() {
    //Cho toàn bộ dữ liệu trong tbody là trống
    $("#customersTable tbody").empty();
    //Lấy dữ liệu trên sever
    let customers = [];
    $.ajax({
      type: "GET",
      url: "http://cukcuk.manhnv.net/api/v1/Customerss",
      data: "data",
      async: false,
      success: function (response) {
        customers = response;
      },
    });
    // Build data lên table
    for (const customer of customers) {
      //Build trHtml rỗng
      const trHtml = $(`<tr></tr>`);
      // Duyệt qua các cột tiêu đề
      const ths = $("#customersTable thead tr").children();
      for (const th of ths) {
        //Lấy từng fieldValue của th
        const fieldValue = $(th).attr("filedValue");
        // Build từng td
        const tdHtml = $(`<td></td>`);
        // Lấy từng giá trị của data
        const textData = customer[fieldValue] || "";
        // Insert data cho từng td
        tdHtml.text(textData);
        //append vào từng dòng dữ liệu
        trHtml.append(tdHtml);
      }

      $("#customersTable tbody").append(trHtml);
    }
  }*/
  //#endregion
}

$(document).ready(function () {
  new BaseTable();
});

class BaseTable {
  TableUrl = null;
  TableId = null;
  constructor(apiUrl, tableId) {
    this.TableUrl = apiUrl;
    this.TableId = tableId;
    this.loadData();
  }

  /**
   * load data
   * Author: NVTAM (11/24/2021)
   */
  loadData() {
    const apiUrl = this.TableUrl;
    const tableId = this.TableId;
    //Cho toàn bộ dữ liệu trong tbody là trống
    $(`#${tableId} tbody`).empty();
    //Lấy dữ liệu
    let data = [];
    $.ajax({
      type: "GET",
      url: apiUrl,
      async: false,
      success: function (response) {
        data = response;
      },
      error: function (error) {
        console.log(error);
      },
    });
    //build dữ liệ vào table
    for (const item of data) {
      //build tr html rỗng
      const trHtml = $(`<tr></tr>`);
      //Lấy ra các cột tiêu đề dữ liệu
      const ths = $(`#${tableId} thead tr`).children();
      //Duyệt qua các cột tiêu đề dữ liệu
      for (const th of ths) {
        //Lấy ra attr tương ứng
        const attrVal = $(th).attr("filedValue");
        //Lấy value item theo attr
        let value = item[attrVal];
        //format value theo attr tương ứng
        const attrFormat = $(th).attr("formatValue");
        //khơi Tạo td hứng trữ dự liệu
        const td = $(`<td></td>`);
        switch (attrFormat) {
          case "money":
            td.addClass("text-algin-right");
            value = new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(value);

            break;
          default:
            td.addClass("text-algin-left");
            break;
        }

        //Insert dữ liệu vào td
        td.text(value);
        //append vào từng tr
        trHtml.append(td);
      }
      //append từng tr dữ liệu vào tbody
      $(`#${tableId} tbody`).append(trHtml);
    }
  }
}

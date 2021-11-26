$(document).ready(function () {
  new Table();
});

class Table {
  constructor() {
    this.buildTableHTML();
  }
  /**
   * Buil table ở dạng chuẩn
   * Author NVTAM (25/11/2021)
   */
  buildTableHTML() {
    //Lấy ra tất cả các table có trong page
    const tables = $("mtable");
    //Duyệt qua các table
    console.log(tables);
    for (const table of tables) {
      //Lấy id của table hiện tại
      const tableId = $(table).attr("id");
      const api = $(table).attr("api");
      //Xác định mã template base HTML
      let tableHTML = $(`<table class="m-table" border="1">
                            <thead>
                            
                            </thead>
                            <tbody>
                            </tbody>
                        </table>`);
      //Gán attr cho table template
      tableHTML.attr("id", tableId);
      //Lấy ra các column của table
      const columns = table.children;
      //khởi tạo tr của header
      const trHeadHTML = $(`<tr></tr>`);
      //  Duyệt qua các mcol
      for (const column of columns) {
        //Khai báo th html
        let thHTML = $(`<th></th>`);
        //Lấy ra field value của mỗi column
        const filedValue = $(column).attr("filedValue");
        //gán attribute fieldValue vào từng th
        thHTML.attr("filedValue", filedValue);
        //căn chỉnh các dòng tiêu đề
        const attrFormat = $(column).attr("formatValue");
        switch (attrFormat) {
          case "money":
            thHTML.addClass("text-algin-right");
            break;
          default:
            thHTML.addClass("text-algin-left");
            break;
        }
        //Lấy ra text content của từng col
        const textNode = $(column).text();
        // gán text node vào từng th
        thHTML.text(textNode);
        //append vào mỗi th vào tr
        $(trHeadHTML).append(thHTML);
      }
      //append dòng tiêu đề
      tableHTML.find("thead").append(trHeadHTML);
      //Lấy dữ liệu qua API
      //Lấy dữ liệu
      let data = [];
      $.ajax({
        type: "GET",
        url: api,
        async: false,
        success: function (response) {
          data = response;
        },
        error: function (error) {
          console.log(error);
        },
      });
      //build dữ liệu vào table
      for (const item of data) {
        //khai báo từng dòng dữ liệu
        const trBodyHtml = $(`<tr></tr>`);
        //duyệt qua từng col get attr của table
        for (const column of columns) {
          //Khai báo th html
          let tdHTML = $(`<td></td>`);
          //Lấy ra field value của mỗi column
          const filedValue = $(column).attr("filedValue");
          //lấy ra giá trị trong mỗi item
          let value = item[filedValue];
          //format type dữ liệu
          const attrFormat = $(column).attr("formatValue");
          switch (attrFormat) {
            case "money":
              tdHTML.addClass("text-algin-right");
              value = new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(value);

              break;

            default:
              tdHTML.addClass("text-algin-left");
              break;
          }
          //insert giá trị vào từng column
          tdHTML.text(value);
          //append vào từng dòng dữ liệu
          trBodyHtml.append(tdHTML);
        }
        //append dòng body
        tableHTML.find("tbody").append(trBodyHtml);
      }
      //replace mtable đinh nghĩa ban dau
      $(table).replaceWith(tableHTML);
    }
  }
}

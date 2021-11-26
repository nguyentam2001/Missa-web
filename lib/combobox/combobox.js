$(document).ready(function () {
  new Combobox();
  //sự kiện click cho btn combobox
  $(".ncombobox .m-btn-combobox").click(handleShowListComboboxOnclick);
  //lấy giá trị của item được chọn
  $(".m-combobox-list").on("click", ".m-combobox-item", selectItemOnclick);
  //   focus vào ô nhập liệu đồng thời show list item
  //khi không focus vào thì cũng mất đi
  // $(".ncombobox input").focus(handleShowListComboboxFocus);
  // $(".ncombobox input").blur(handleShowListComboboxOnclick);
  //sử lý sự kiện khi nhấn nút thì sổ xuống và sử lí logic
  $(".ncombobox input").keydown(handleInputOnKeydown);
  // lọc dữ liệu combobox trong input sk onKeyUp
  $(".ncombobox input").keyup(handleInputOnKeyup);
  //Lưu trữ thông tin combobox items vào data
  let comboboxs = $(".ncombobox");
  for (const combobox of comboboxs) {
    let comboboxItems = $(combobox).find(".m-combobox-list").html();
    $(combobox).data("itemsDataElement", comboboxItems);
  }
});

class Combobox {
  constructor() {
    this.buildCombobox();
  }
  buildCombobox() {
    //Duyệt qua tất cả các combobox hiện có
    const comboboxs = $("combobox");
    for (const combobox of comboboxs) {
      //lấy attr của cbb
      const cbId = combobox.getAttribute("id");
      const fieldData = combobox.getAttribute("fieldData");
      const fieldName = combobox.getAttribute("fieldName");
      const api = combobox.getAttribute("api");
      //Khai báo template html
      const cbHTML = $(`<div id="${cbId || ""}" class="ncombobox">
                          <input
                            type="text"
                            class="m-input m-input-combobox"
                            name=""
                          />
                            <button tabindex="-1" class="m-btn-combobox show-icon">
                              <i class="fas fa-angle-down"></i>
                              <i class="fas fa-angle-up"></i>
                            </button>
                        <div class="m-combobox-list"></div>
                      </div>`);
      //Gán attr vào cbHTML
      cbHTML.attr("fieldData", fieldData);
      cbHTML.attr("fieldName", fieldName);
      //Thay thế combobox hiện tại bằng combobox template cbHTML
      $(combobox).replaceWith(cbHTML);

      //load API render combobox
      if (fieldData && fieldName && api) {
        $.ajax({
          type: "GET",
          url: api,
          async: false,
          success: function (data) {
            //Duyệt qua từng data lấy dữ liệu
            for (const item of data) {
              //lấy từng giá trị của attr tương ứng
              let itemKey = item[fieldData];
              let itemName = item[fieldName];
              //render vào từng option tương ứng
              let itemHTML = `<div class="m-combobox-item" value="${itemKey}">${itemName}</div>`;
              // append vào từng cb list
              cbHTML.find(".m-combobox-list").append(itemHTML);
            }
          },
        });
      }
    }
  }
}

function handleInputOnKeyup(e) {
  if ((e.keyCode > 64 && e.keyCode < 91) || e.keyCode == 32 || e.keyCode == 8) {
    //trước khi lọc cần xóa toàn bộ dữ liệu cũ đã lọc để append sau mỗi lần key up
    $(this).siblings(".m-combobox-list").empty();
    //lấy giữ liệu từ input
    $(this).val();
    // lấy itemElement combobox items từ data
    const itemsDataElement = $(this)
      .parent(".ncombobox")
      .data("itemsDataElement");
    const comboboxList = $(this).siblings(".m-combobox-list");

    // //lấy ra tất cả combobox items con của list
    const comboboxItems = $.parseHTML(itemsDataElement);
    // // lọc combobox item được chọn
    for (const comboboxItem of comboboxItems) {
      if (
        !$(comboboxItem)
          .text()
          .toLowerCase()
          .includes($(this).val().toLowerCase())
      ) {
        $(comboboxItem).remove();
      } else {
        $(comboboxList).append(comboboxItem);
      }
    }
    comboboxList.show();
  } //leterkey
}

function handleInputOnKeydown(e) {
  const keyCode = e.keyCode;

  //lấy ra comboboxList cùng cấp với input
  const comboboxList = $(this).siblings(".m-combobox-list");
  //lấy ra tất cả combobox items con của list

  const comboboxItems = comboboxList.children();

  //Kiểm tra xem đã có thằng nào có class hover chưa
  let itemHovered = $(comboboxItems).filter(".m-combobox-item-hover");

  //Xóa bỏ tất cả các item đã được hover
  // $(comboboxItems).removeClass("m-combobox-item-hover");
  switch (keyCode) {
    case 13:
      if (itemHovered.length === 1) {
        //lấy text đang được hovered
        const textEleCurr = $(itemHovered).text();
        //1. gán text hovered vào input
        $(this).val(textEleCurr);
        //2. lấy value của element được select
        const valItem = $(itemHovered).attr("value"); //js thuần thì this kiểu này
        //3. Gán value vào combobox cha của this
        //   3.1 tìm ncombobox element
        const parentCombobox = $(this).parents(".ncombobox");
        // 3.2 gán giá trị vào value của ncombobox
        //cách 1 gán vào value
        parentCombobox.attr("value", valItem);
        //cách 2 gán giá trị vào data
        parentCombobox.data("value", valItem);
        //gọi lại hàm ẩn combobox list
        comboboxList.hide();
      }

      break;
    case 38: //khi key up mũi tên lên
      //hiển thị combobox list lên
      comboboxList.show();
      //kiểm tra xem đã có class hover chưa
      if (itemHovered.length > 0) {
        //nếu đã có item thì prev sang item trước đó
        let prevItem = $(itemHovered).prev();
        //thêm class hover vào item trước đó
        prevItem.addClass("m-combobox-item-hover");
        //remove hover ở class hiện tại
        itemHovered.removeClass("m-combobox-item-hover");
      } else {
        // nếu không có thì mặc định vào ô cuối cùng
        //thêm class để fake class đang add
        $(comboboxItems[comboboxItems.length - 1]).addClass(
          "m-combobox-item-hover"
        );
      }
      break;
    case 40: //khi key up mũi tên xuống
      //hiển thị combobox list lên
      comboboxList.show();
      if (itemHovered.length > 0) {
        //nếu đã có item thì prev sang item trước đó
        let nextItem = $(itemHovered).next();
        //thêm class hover vào item trước đó
        nextItem.addClass("m-combobox-item-hover");
        //remove hover ở class hiện tại
        itemHovered.removeClass("m-combobox-item-hover");
      } else {
        // nếu không có thì mặc định vào ô đầu tiên
        //thêm class để fake class đang add
        $(comboboxItems[0]).addClass("m-combobox-item-hover");
      }
      break;
    default:
      break;
  }
  //khi key up mũi tên xuống thì tự động focus vào phần tử đầu tiên
  //khi key up mũi tên lên thì focus vào phần tử cuối cùng
}

function handleShowListComboboxFocus() {
  const comboboxList = $(this).siblings(".m-combobox-list");
  comboboxList.toggle();
}

function handleShowListComboboxOnclick() {
  //lấy element anh em của nó
  const comboboxList = $(this).siblings(".m-combobox-list");
  comboboxList.toggle();
}

function selectItemOnclick() {
  //1 lấy text của item cho input
  const textItem = $(this).text();
  // 1.1, tìm kiếm cha của item
  const comboboxList = $(this).parent(".m-combobox-list");
  // 1.2, tìm kiếm anh em của item
  const mInput = comboboxList.siblings("input");
  //1.3 gán text của item cho input
  mInput.val(textItem);
  //2. lấy value của element được select
  const valItem = this.getAttribute("value"); //js thuần thì this kiểu này
  //3. Gán value vào combobox cha của this
  //   3.1 tìm ncombobox element
  const parentCombobox = $(this).parents(".ncombobox");
  // 3.2 gán giá trị vào value của ncombobox
  //cách 1 gán vào value
  parentCombobox.attr("value", valItem);
  //cách 2 gán giá trị vào data
  parentCombobox.data("value", valItem);
  //gọi lại hàm ẩn combobox list
  comboboxList.hide();
}

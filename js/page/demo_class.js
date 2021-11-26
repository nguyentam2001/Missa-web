/**
 * Ưu điểm của class hơn là viết function kia là
 * quản lý các function dễ ràng hơn
 * Khi function nhiều lên thì không biết tên có trùng hay không
 * => bị ghi đè
 * => class khắc phục điều này
 */

//--------------------------------------------------------

/**
 * Class có 4 tính chất
 * 1. Kế thừa (inheritance)
 * 2. Trừu tượng (abstract)
 * 3. Đóng gói (encapsulation)
 * 4. Đa hình (polymorphism)
 */

//------------------------------------------------------
//Tính kế thừa của class
class Person {
  name;
  age;
  constructor() {}
  getName() {
    return "Đây là bố ";
  }
}
var person = new Person();

//Định nghĩa class
//kế thừa hoàn toàn luôn như public trong js
class Employee extends Person {
  //Thuộc tính trong class
  fullName = "Nguyễn Văn Mạnh";
  phoneNumber;
  gender;
  //luôn luôn có hàm khỏi tạo, không có phạm vi truy cập
  //có đối số hoặc không có cũng được
  constructor(name) {
    //Khi kế thừa thì phải có super đặc tính là con phải có sau cha
    super(); //truyền tham số hoặc không
    //sét các giá trị thành phần trong class
    this.fullName = name;
    //có thể gán giá trị cho thuộc tính chưa được định nghĩa
    this.address = "Bắc Giang 98BG";
    this.schoolName = "Đại học Công Nghiệp Hà Nội";
  }
  /**
   * Khai báo một phương thức trong class
   * Author: Nguyễn Văn Tâm (19/11/2021)
   */
  getName() {
    return `Đây là con ${super.getName()}`;
  }

  /**
   * Khai báo một phương thức tĩnh trong class
   * Author: Nguyễn Văn Tâm (19/11/2021)
   * Chú ý:
   *    Phương thức tĩnh chỉ được gọi thông qua class
   *    Không được gọi thông qua đối tượng khởi tạo bởi class
   *    Không sử dụng con trỏ this vì không gọi thông qua đối tượng khởi tạo
   *    kiểu Static được cấp một vùng nhớ riêng biệt nhưng lại sống kí sinh trong class
   *    này
   *  Class nó chỉ thông qua để gọi được phương thức static đấy thôi
   */

  static getSchoolName() {
    return "Misa";
  }
}

/**
 * trong js thuần thì không có overloading mà chỉ có các
 * phương thức ghi đè nhau (overwrite) nếu method con trùng tên của cha
 */

let employee = new Employee();
let employee2 = new Employee("Nguyễn Văn Tâm");

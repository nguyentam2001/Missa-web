$(document).ready(function () {
  new StudentPage();
});

class StudentPage extends BaseTable {
  constructor() {
    super("http://cukcuk.manhnv.net/api/v1/Employees", "studentsTable");
    this.loadData();
  }
}

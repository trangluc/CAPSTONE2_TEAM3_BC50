export class Validation {
  kiemTraRong(value, errorId, message) {
    if (value === "") {
      //sai
      document.getElementById(errorId).style.display = "block";
      document.getElementById(errorId).innerHTML = message;
      return false;
    }
    //đúng
    document.getElementById(errorId).style.display = "none";
    document.getElementById(errorId).innerHTML = "";
    return true;
  }
}

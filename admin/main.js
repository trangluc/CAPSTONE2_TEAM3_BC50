import Api from "./services/Api.js";
import { ListProduct } from "./model/ListProduct.js";
import { Validation } from "./model/Validation.js";
const api = new Api();
const validation = new Validation();

function getEle(id) {
  return document.getElementById(id);
}

//Lấy dữ liệu trên data
const getInfo = () => {
  api
    .callApi("mobile", "GET", "")
    .then((res) => {
      console.log(res);
      RenderListProduct(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
getInfo();

//Render Product
const RenderListProduct = (data) => {
  let content = "";
  if (data && data.length > 0) {
    data.forEach((product) => {
      content += `
        <tr>
          <td>${product.id}</td>
          <td>${product.name}</td>
          <td>${product.price}</td>
          <td>${product.img}</td>
          <td>${product.disc}</td>
          <td>
              <button onclick="editPhone(${product.id})" class="btn btn-warning" data-toggle="modal" data-target="#myModal">Edit</button>
              <button onclick="deletePhone(${product.id})" class="btn btn-danger">Delete</button>
          </td>
        </tr>
      `;
      getEle("tbody").innerHTML = content;
    });
  }
};

//Lấy giá trị
const getValue = () => {
  let tenSP = getEle("TenSP").value;
  let giaSP = getEle("GiaSP").value * 1;
  let screen = getEle("Screen").value;
  let backCamera = getEle("BackCamera").value;
  let frontCamera = getEle("FrontCamera").value;
  let hinhSP = getEle("HinhSP").value;
  let moTa = getEle("MoTa").value;
  let thuongHieu = getEle("ThuongHieu").value * 1;
  

  //Validaton
  let isValid = true;
  isValid &= validation.kiemTraRong(
    tenSP,
    "errorTenSP",
    "(*) Vui lòng nhập Tên Sản Phẩm"
  );

  if (!isValid) return null;

  const product = new ListProduct(
    tenSP,
    giaSP,
    screen,
    backCamera,
    frontCamera,
    hinhSP,
    moTa,
    thuongHieu
  );
  return product;
};

//Open Modal
getEle("addPhone").onclick = () => {
  getEle("TenSP").value = "";
  getEle("GiaSP").value = "";
  getEle("Screen").value = "";
  getEle("BackCamera").value = "";
  getEle("FrontCamera").value = "";
  getEle("HinhSP").value = "";
  getEle("MoTa").value = "";
  getEle("ThuongHieu").value = "";
  getEle("modalUpdate").style.display = "none";
  getEle("modalAdd").style.display = "block";
};

//Add Phone
getEle("modalAdd").onclick = () => {
  let mobile = getValue();

  api
    .callApi("mobile", "POST", mobile)
    .then((res) => {
      console.log(res.data);
      getInfo();
      getEle("modalClose").click();
    })
    .catch((err) => {
      console.log(err);
    });
};

//Edit Phone
window.editPhone = (id) => {
  getEle("modalHeader").innerHTML = "Update Phone Management";
  getEle("modalUpdate").style.display = "block";
  getEle("modalAdd").style.display = "none";
  api
    .callApi(`mobile/${id}`, "GET", null)
    .then((res) => {
      let updatePhone = res.data;
      getEle("TenSP").value = updatePhone.name;
      getEle("GiaSP").value = updatePhone.price;
      getEle("Screen").value = updatePhone.screen;
      getEle("BackCamera").value = updatePhone.backCamera;
      getEle("FrontCamera").value = updatePhone.frontCamera;
      getEle("HinhSP").value = updatePhone.img;
      getEle("MoTa").value = updatePhone.disc;
      getEle("ThuongHieu").value = updatePhone.style;
    })
    .catch((err) => {
      console.log(err);
    });
};

//Update Phone
getEle("modalUpdate").onclick = () => {
  const phone = getValue();
  console.log(phone);
  // api
  //   .callApi(`mobile/${phone.id}`, "PUT", phone)
  //   .then((res) => {
  //     console.log(res);
  //     getInfo();
  //     getEle("modalClose").click();
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

//Delete Phone
window.deletePhone = (id) => {
  api
    .callApi(`mobile/${id}`, "DELETE", null)
    .then((res) => {
      getInfo();
    })
    .catch((err) => {
      console.log(err);
    });
};

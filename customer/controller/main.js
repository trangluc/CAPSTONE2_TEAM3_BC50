import { Api } from "../services/api.js";
import { Mobile } from "../models/mobile.js";
import { Cart } from "../models/cart.js";

const api = new Api();
const mobileList = []; // Danh sách sản phẩm di động
const cartList = []; // Danh sách giỏ hàng

const getEle = (id) => document.getElementById(id);

//Hàm render danh sách bán hàng
const renderMobileList = (mobileList) => {
  let content = ``;
  mobileList.forEach((mob) => {
    content += `
    <div class="col-lg-3 col-md-6">
    <div class="card my-3 fill">
          <img class="card-img-top" src=${mob.img} alt="Card image">
          <div class="card-body">
            <h4 class="card-title">${mob.name}</h4>
            <p class="card-text">${mob.desc}</p>
            <p class="card-text" style="color:green"><b>${mob.price}</b></p>
            <div class="brand-box text-center">
              <span>${mob.type}</span>
            </div>
            <button type="button" class="btn btn-overlay btn-block w-50" onclick="btnAddToCart('${mob.id}')">Add to cart</button>
          </div>
          <div class="content-overlay"></div>
          <div class="content-details fadeIn-top">
            <h3 class='pb-5'>Key details</h3>
            <div class="d-flex justify-content-start py-1">
              <span class='text-light'><b>Screen:</b> ${mob.screen}</span>
            </div>
            <div class="d-flex justify-content-start py-1">
              <span class='text-light'><b>Back Camera:</b> ${mob.backCamera}</span>
            </div>
            <div class="d-flex justify-content-start py-1">
              <span class='text-light'><b>Front Camera:</b> ${mob.frontCamera}</span>
            </div>
          </div>
        </div>
        </div>
        
    `;
  });
  getEle("mobileListing").innerHTML = content;
};

//Render ra giao diện
function fetchMobileList() {
  api.getMobile()
    .then(function (mobileList) {
      renderMobileList(mobileList);
      filterByType();
    })
    .catch(function (err) {
      console.log(err);
    });
}
fetchMobileList();

// Hàm render danh sách giỏ hàng
const renderCart = (cartList) => {
    let content = ``;
    let totalPrice = 0; // Khởi tạo biến totalPrice để tính tổng tiền
  
    cartList.forEach((mob) => {
      content += `
        <div class="mobile_cart d-flex justify-content-between align-item-center p-3">
          <div class="mobile_thumbnail">
            <img src=${mob.product.img} alt="">
          </div>
          <div class="text-left">${mob.product.name}</div>
          <div class="mobile_quantity">
            <span class="minus bg-dark text-white" onclick="btnMinus('${mob.product.id}')">-</span>
            <span class="quantityCart mx-2">${mob.quantity}</span>
            <span class="plus bg-dark text-white" onclick="btnAdd('${mob.product.id}')">+</span>
          </div>
          <div class="mobile_price"><b>$${mob.quantity * mob.product.price}</b></div>
          <button class="btn btn-danger" onclick="btnRemove('${mob.product.id}')">Remove</button>
        </div>`;
  
      totalPrice += mob.quantity * mob.product.price; // Cộng dồn tổng tiền
    });
  
    getEle("cartList").innerHTML = content;
  
    // In tổng tiền ra vị trí có id="priceTotal"
    getEle("priceTotal").innerHTML = `$${totalPrice}`;
  
    // Tổng số lượng trong giỏ
    let cartCount = 0;
    cartList.forEach((mob) => {
      cartCount += mob.quantity;
    });
    // In số lượng hàng hoá ra badge
    getEle("cartCount").innerHTML = cartCount;
    saveCartToLocalStorage()
  };


// Hàm thêm sản phẩm vào giỏ hàng
window.btnAddToCart = async (productId) => {
    try {
      const mobileData = await api.getMobileById(productId);
      const { id, name, price, screen, backCamera, frontCamera, img, desc, type } = mobileData;
      const product = new Mobile(id, name, price, screen, backCamera, frontCamera, img, desc, type);
  
      const existingCartItem = cartList.find((cartItem) => cartItem.product.id === productId);
      if (existingCartItem) {
        existingCartItem.quantity++;
      } else {
        cartList.push(new Cart(product, 1));
      }
  
      renderCart(cartList);
    } catch (err) {
      console.log(err);
    }
  };

  // Hàm xoá sp ra khỏi cart
  window.btnRemove = (productId) => {
    const existingCartItemIndex = cartList.findIndex((cartItem) => cartItem.product.id === productId);
  
    if (existingCartItemIndex !== -1) {
      cartList.splice(existingCartItemIndex, 1);
      renderCart(cartList);
    }
  };

  //Hàm cập nhật giỏ hàng
  // Thêm sp trong giỏ hàng
  window.btnAdd = (productId) => {
    const existingCartItem = cartList.find((cartItem) => cartItem.product.id === productId);
  
    if (existingCartItem) {
      existingCartItem.quantity++;
      renderCart(cartList);
    }
  };

  //Giảm sp trong giỏ hàng
  window.btnMinus = (productId) => {
    const existingCartItem = cartList.find((cartItem) => cartItem.product.id === productId);
  
    if (existingCartItem && existingCartItem.quantity > 1) {
      existingCartItem.quantity--;
      renderCart(cartList);
    }
  };

  //Xoá toàn bộ giỏ hàng
  window.emptyCart = () => {
    cartList.length = 0; // Xoá toàn bộ phần tử trong mảng cartList
    renderCart(cartList); // Cập nhật giao diện giỏ hàng sau khi xoá
  };

  //Lưu local giỏ hàng
const saveCartToLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(cartList));
  };
  
  // Hàm khôi phục giỏ hàng từ local storage
  const restoreCartFromLocalStorage = () => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      cartList.length = 0; // Xoá toàn bộ phần tử trong mảng cartList
  
      const parsedCart = JSON.parse(storedCart);
      parsedCart.forEach((item) => {
        const { product, quantity } = item;
        cartList.push(new Cart(product, quantity));
      });
  
      renderCart(cartList);
    }
  };
  
  // Gọi hàm restoreCartFromLocalStorage() khi trang được tải lại
  window.addEventListener('load', restoreCartFromLocalStorage);
  

  // Hàm lọc và hiển thị sản phẩm theo loại
  window.filterByType = () => {
    const selectElement = getEle("selectList");
    const selectedType = selectElement.value; // Lấy giá trị đã chọn từ select list
  
    if (selectedType === "all") {
      // Nếu chọn "All Brands", tải lại danh sách sản phẩm và hiển thị toàn bộ sản phẩm
      fetchMobileList();
    } else {
      // Nếu chọn một loại sản phẩm cụ thể, lọc và hiển thị sản phẩm theo loại
      const filteredMobileList = mobileList.filter((mob) => mob.type === selectedType);
      renderMobileList(filteredMobileList);
    }
  }

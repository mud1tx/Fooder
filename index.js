"use strict";
const searchButton = document.querySelector(".fa-magnifying-glass");
const searchBox = document.querySelector("#searching_box");
const wholeSearchSection = document.querySelector(".searching_section");
const container_container = document.querySelector(".container_container");
const cardsSection = document.querySelector(".cards");
const imageChanger = document.querySelector(".imageChanger");
const notExistCards = document.querySelector(".not_exist_cards");
const cartButton = document.querySelector(".fa-cart-shopping");
const cartArea = document.querySelector(".cart_area");
const overlay = document.querySelector(".overlay");
const crossMark = document.querySelector(".fa-xmark");
const cartNumber = document.querySelector(".cart_number");

const cartArray = [];
// const cartCardRemoval = [];
let inputValue;
let flag = 0;
let imageChangerArray = [
  "./1.svg",
  "./2.svg",
  "./3.svg",
  "./4.svg",
  "./5.svg",
  "./6.svg",
];
setInterval(() => {
  let random = Math.floor(Math.random() * 6);
  imageChanger.src = imageChangerArray[random];
}, 3000);

async function fooder() {
  try {
    if (searchBox.value !== "" && flag === 0) {
      inputValue = searchBox.value.trim();
    } else if (flag !== 0) {
      cardsSection.innerHTML = "";
      inputValue = searchBox.value.trim();
    }
    classRemoveOrAdd();
    flag++;
    const result = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${inputValue}&number=100&apiKey=b1d90eb9757245f4b59c68b483c1237f`
    );
    const res = await result.json();

    let length = res.results.length;

    checker(res, length);
  } catch (error) {
    console.log(error);
  }
}
function classRemoveOrAdd() {
  wholeSearchSection.style.display = "none";
}

function notExistSyntax() {
  notExistCards.innerHTML = "";
  const div = document.createElement("div");
  div.classList.add("not_exist_syntax");
  const notExistHTML = `
  <Please>Sorry this dish does not exist in our menu.<br>Please choose something different👨‍🍳🥂</p>
  `;
  div.innerHTML = notExistHTML;
  notExistCards.appendChild(div);
}
function cartFunction(e) {
  const cartImage =
    e.target.parentElement.parentElement.previousElementSibling.children[0]
      .currentSrc;
  const cartText = e.target.parentElement.parentElement.children[0].innerText;
  cartPushLogic(cartImage, cartText);
}

function decrementer(e) {
  let inputValueToDecrement = e.target.nextElementSibling.innerText;
  e.target.nextElementSibling.innerText = Number(inputValueToDecrement) - 1;

  cartNumber.innerText = Number(cartNumber.innerText) - 1;
  if (Number(e.target.nextElementSibling.innerText) === 0) {
    cardRemoveFromCart(e);
  }
}
function incrementer(e) {
  let inputValueToIncrement = e.target.previousElementSibling.innerText;
  e.target.previousElementSibling.innerText = Number(inputValueToIncrement) + 1;
  cartNumber.innerText = Number(cartNumber.innerText) + 1;
}
function cardRemoveFromCart(e) {
  cartArray.splice(
    cartArray.indexOf(
      e.target.parentElement.parentElement.previousElementSibling.children[1]
        .innerText
    ),
    1
  );
}
function CartNumberUpdater(e) {
  const cartCardPresentValue = e.path[1].children[1].value;
  e.path[1].children[1].addEventListener("change", () => {
    cartNumber.innerText =
      Number(cartNumber.innerText) +
      Number(e.path[1].children[1].value) -
      cartCardPresentValue;
  });
}

function cartPushLogic(cartImage, cartText) {
  if (cartArray.includes(cartText)) {
    const minus = document.getElementsByClassName("minus");
    const add = document.getElementsByClassName("add");
    const cartRemoval = document.getElementsByClassName("cart_removal");
    const numberAdder = document.getElementsByClassName("number_adder");

    const cartHtmlToArray = [...cartArray];

    for (let item of minus) {
      item.addEventListener("click", decrementer);
    }
    for (let item of add) {
      item.addEventListener("click", incrementer);
    }
    for (let item of cartRemoval) {
      item.addEventListener("click", cardRemoveFromCart);
    }
    for (let item of numberAdder) {
      item.addEventListener("click", CartNumberUpdater);
    }

    let Cartindex = cartHtmlToArray.indexOf(cartText);

    let cartLogicArray = cartArea.children;
    let cartSectionPicker = cartLogicArray[Cartindex + 1];
    let cartInput =
      cartSectionPicker.firstElementChild.firstElementChild.children[1]
        .firstElementChild.children[1];
    cartInput.innerText = Number(cartInput.innerText) + 1;
    cartNumber.innerText = Number(cartNumber.innerText) + 1;
  } else {
    const cartDiv = document.createElement("div");
    cartDiv.classList.add("cart_cards");
    const cartCardHtml = `
  <div class="cart_card">
    <div class="cart_card_container">
      <div class="cart_image_container" >
      
      <img src=${cartImage} alt="" />
      <p>${cartText}</p>
      
      </div>
      <div class="cart_card_btns" style=>
        <div class="inc_dec_btns">
          <button class="minus inc_dec_cancel_btn" type="subtraction">-</button>
          <p class="number_adder">1</p>
          <button class="add inc_dec_cancel_btn" type="addition">+</button>
        </div>      
        <div >
          <i class="fa-solid fa-xmark cart_removal" ></i></button>
        </div>
      </div>
    </div>
  </div>

  `;
    cartDiv.innerHTML = cartCardHtml;
    cartArea.insertAdjacentElement("beforeend", cartDiv);

    const numberAdder = document.querySelector(".number_adder");
    cartArray.push(`${cartText}`);
    cartNumber.innerText = Number(cartNumber.innerText) + 1;
  }
}

function checker(res, length) {
  let count = 0;

  if (length === 0) {
    cardsSection.classList.add("hidden");
    notExistCards.classList.remove("hidden");
    notExistSyntax();
  } else {
    cardsSection.classList.remove("hidden");
    notExistCards.classList.add("hidden");
    while (count < length) {
      let image = res.results[count].image;
      let title = res.results[count].title;
      syntax(image, title);
      count++;
    }
    const addCartBtn = document.querySelectorAll(".addCartbtn");

    for (let i = 0; i < addCartBtn.length; i++) {
      addCartBtn[i].addEventListener("click", cartFunction);
    }
  }
}

function syntax(image, title) {
  const div = document.createElement("div");
  div.classList.add("card");
  const HTML = `
  <div class="card_image">
    <img src=${image} alt="" />
  </div>
  <div class="buttons">
    <div class="title">
      <p>${title}</p>
    </div>
    <div class="add_to_cart">
      <button class="addCartbtn">To Cart</button>
    </div>        
  </div>    
  `;
  div.innerHTML = HTML;
  cardsSection.appendChild(div);
}

function openOverlay() {
  cartArea.classList.remove("hidden");
  overlay.classList.remove("hidden");
}
function closeOverlay() {
  cartArea.classList.add("hidden");
  overlay.classList.add("hidden");
}

searchButton.addEventListener("click", fooder);
cartButton.addEventListener("click", openOverlay);
crossMark.addEventListener("click", closeOverlay);
overlay.addEventListener("click", closeOverlay);

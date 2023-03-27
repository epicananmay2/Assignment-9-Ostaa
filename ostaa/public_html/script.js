/* 
 Name: Aniruth
 Class: CSC
 Description: script.js shows the different case requests for the Ostaa Website.
 Date: 03/25/2023
*/
const userForm = document.getElementById("userForm");
const productForm = document.getElementById("productForm");

const ADD_USER = "/add/user";
const ADD_ITEM = "/add/item/";

function addUser(e) {
  e.preventDefault();
  const username = e.target.username.value.toLowerCase();
  const password = e.target.password.value;
  const data = { username, password };

  const xhr = new XMLHttpRequest();
  xhr.open("POST", ADD_USER);
  xhr.onload = () => {
    const res = JSON.parse(xhr.response);
    if (res.ok) userForm.reset();
  };

  xhr.onerror = () => console.log("Request failed");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(data));
}

function addItem(e) {
  e.preventDefault();
  const title = e.target.title.value.toLowerCase();
  const description = e.target.description.value.toLowerCase();
  const image = e.target.image.value;
  const price = parseInt(e.target.price.value);
  const status = e.target.status.value.toUpperCase();
  const owner = e.target.owner.value.toLowerCase();
  const data = { title, description, price, status, image, owner };

  const url = ADD_ITEM + owner;
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.onload = () => {
    const res = JSON.parse(xhr.response);
    if (res.ok) productForm.reset();
  };

  xhr.onerror = () => console.log("Request failed");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(data));
}

userForm.addEventListener("submit", addUser);
productForm.addEventListener("submit", addItem);

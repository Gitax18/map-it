const email = document.querySelector("#email").value;
const password = document.querySelector("#password").value;
const loginBtn = document.querySelector("#btn-submit");
const linkRegister = document.querySelector("#link-register");

linkRegister.addEventListener('click',(e)=>{
    e.preventDefault()
    window.location.href = "register.html";
})
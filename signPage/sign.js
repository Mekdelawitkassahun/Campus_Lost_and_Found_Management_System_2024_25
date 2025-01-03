let signup = document.getElementById("signup");
let signin = document.getElementById("signin");
let namefield = document.getElementById("namefield");
let title = document.getElementById("title");

signin.onclick = function () {
  namefield.style.maxHeight = "0";
  title.innerHTML = " Sign In";
  signup.classList.add("visible");
  signin.classList.remove("visible");
};

signup.onclick = function () {
  namefield.style.maxHeight = "50px";
  title.innerHTML = " Sign Up";
  signup.classList.remove("visible");
  signin.classList.add("visible");
};

let rowData = document.getElementById("rowData");
let searchContainer = document.getElementById("searchContainer");
let contactForm = document.getElementById("contactForm");
let submitBtn;

// Loading Screen
$(document).ready(function () {
  searchByName("").then(function () {
    $(".loading-screen").fadeOut(500, function () {
      $("body").css("overflow", "visible");
    })
  })
})

// Sidebar
let sidebarInnerWidth = $(".side-nav-menu .nav-tab").innerWidth();
$(".side-nav-menu").animate({ left: -sidebarInnerWidth }, 0);

function closeSideNav() {
  $(".side-nav-menu").animate({ left: -sidebarInnerWidth }, 500);
  $(".open-close-icon").addClass("fa-align-justify");
  $(".open-close-icon").removeClass("fa-x");

  $(".links li").animate({ top: 300 }, 500);
}

$(".side-nav-menu i.open-close-icon").click(function () {
  if ($(".side-nav-menu").css("left") == "0px") {
    closeSideNav();
  } else {
    $(".side-nav-menu").animate({ left: 0 }, 500);

    $(".open-close-icon").removeClass("fa-align-justify");
    $(".open-close-icon").addClass("fa-x");

    for (let i = 0; i < 5; i++) {
      $(".links li").eq(i).animate({ top: 0 }, (i + 5) * 100)
    }
  }
})

// Meal Details
function displayMeals(arr) {
  let diffMeals = ``;

  for (let i = 0; i < arr.length; i++) {
    diffMeals += `<div class="col-sm-6 col-md-4 col-lg-3 ">
                <div onclick="getMealDetails('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="" >
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
        </div> `
  }

  rowData.innerHTML = diffMeals;
}

async function getMealDetails(mealID) {
  closeSideNav();
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300)

  searchContainer.innerHTML = "";
  let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
  respone = await respone.json();

  displayMealDetails(respone.meals[0]);
  $(".inner-loading-screen").fadeOut(300);
}

function displayMealDetails(meal) {
  searchContainer.innerHTML = "";
  contactForm.innerHTML = "";

  let ingredients = ``;

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`] != "") {
      ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`;
    }
  }

  let tags = [];
  if (tags != "") {
    tags = meal.strTags?.split(",");
  }

  let tagsStr = '';
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `<li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
  }

  let mealDetails = `<div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a href="${meal.strSource}" class="btn btn-success" target="_blank">Source</a>
                <a href="${meal.strYoutube}" class="btn btn-danger" target="_blank">Youtube</a>
            </div>`;

  rowData.innerHTML = mealDetails;
}

// Categories
async function getCategories() {
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);
  searchContainer.innerHTML = "";

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
  response = await response.json();

  displayCategories(response.categories);
  $(".inner-loading-screen").fadeOut(300);
}

function displayCategories(arr) {
  let categories = ``;

  for (let i = 0; i < arr.length; i++) {
    categories += `<div class="col-sm-6 col-md-4 col-lg-3">
                <div onclick="getCategoryMeals('${arr[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strCategoryThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute text-center text-black p-2">
                        <h3>${arr[i].strCategory}</h3>
                        <p>${arr[i].strCategoryDescription.split(" ").slice(0, 25).join(" ")}</p>
                    </div>
                </div>
        </div>`
  }

  rowData.innerHTML = categories;
}

async function getCategoryMeals(category) {
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
  response = await response.json();

  displayMeals(response.meals.slice(0, 20));
  $(".inner-loading-screen").fadeOut(300);
}

// Area
async function getArea() {
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300)

  searchContainer.innerHTML = "";

  let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
  respone = await respone.json();

  displayArea(respone.meals)
  $(".inner-loading-screen").fadeOut(300)
}

function displayArea(arr) {
  let area = "";

  for (let i = 0; i < arr.length; i++) {
    area += `<div class="col-sm-6 col-md-4 col-lg-3">
                <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${arr[i].strArea}</h3>
                </div>
        </div>`
  }

  rowData.innerHTML = area;
}

async function getAreaMeals(area) {
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
  response = await response.json();

  displayMeals(response.meals.slice(0, 20));
  $(".inner-loading-screen").fadeOut(300);
}

// Ingredients
async function getIngredients() {
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);

  searchContainer.innerHTML = "";

  let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
  respone = await respone.json();

  displayIngredients(respone.meals.slice(0, 20));
  $(".inner-loading-screen").fadeOut(300);
}

function displayIngredients(arr) {
  let ingredients = "";

  for (let i = 0; i < arr.length; i++) {
    ingredients += `<div class="col-sm-6 col-md-4 col-lg-3">
                <div onclick="getIngredientsMeals('${arr[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p>${arr[i].strDescription.split(" ").slice(0, 15).join(" ")}</p>
                </div>
        </div>`
  }

  rowData.innerHTML = ingredients;
}

async function getIngredientsMeals(ingredients) {
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`);
  response = await response.json();

  displayMeals(response.meals.slice(0, 20))
  $(".inner-loading-screen").fadeOut(300)

}

// Search
function showSearchInputs() {
  contactForm.innerHTML = "";
  searchContainer.innerHTML = `<div class="row py-4 ">
        <div class="col-md-6 ">
            <input onkeyup="searchByName(this.value)" type="text" class="searchInput form-control mb-3 bg-transparent text-white" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFirstLetter(this.value)" type="text" maxlength="1" class="searchInput form-control mb-3 bg-transparent text-white" placeholder="Search By First Letter">
        </div>
    </div>`

  rowData.innerHTML = "";
}

async function searchByName(term) {
  closeSideNav();
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
  response = await response.json();

  if (response.meals == null) {
    displayMeals([]);
  }
  else {
    displayMeals(response.meals);
  }
  $(".inner-loading-screen").fadeOut(300);
}

async function searchByFirstLetter(term) {
  closeSideNav();
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);

  if (term == "") {
    term = "a"
  }

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`);
  response = await response.json();

  if (response.meals == null) {
    displayMeals([]);
  }
  else {
    displayMeals(response.meals);
  };
  $(".inner-loading-screen").fadeOut(300);
}

// Contact Us
function showContacts() {
  rowData.innerHTML="";
  searchContainer.innerHTML = "";
  contactForm.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container ps-4 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" class="btn px-3 py-2 mt-4" disabled >Submit</button>
    </div>
</div> `
  submitBtn = document.getElementById("submitBtn");

  document.getElementById("nameInput").addEventListener("focus", () => {
    nameInputTouched = true ;
  })

  document.getElementById("emailInput").addEventListener("focus", () => {
    emailInputTouched = true ;
  })

  document.getElementById("phoneInput").addEventListener("focus", () => {
    phoneInputTouched = true ;
  })

  document.getElementById("ageInput").addEventListener("focus", () => {
    ageInputTouched = true ;
  })

  document.getElementById("passwordInput").addEventListener("focus", () => {
    passwordInputTouched = true ;
  })

  document.getElementById("repasswordInput").addEventListener("focus", () => {
    repasswordInputTouched = true ;
  })
}


// Contact Us Validation
let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;

function inputsValidation() {
  if (nameInputTouched) {
    if (nameValidation()) {
      document.getElementById("nameAlert").classList.replace("d-block", "d-none");
    } else {
      document.getElementById("nameAlert").classList.replace("d-none", "d-block");
    }
  }
  if (emailInputTouched) {
    if (emailValidation()) {
      document.getElementById("emailAlert").classList.replace("d-block", "d-none");
    } else {
      document.getElementById("emailAlert").classList.replace("d-none", "d-block");
    }
  }

  if (phoneInputTouched) {
    if (phoneValidation()) {
      document.getElementById("phoneAlert").classList.replace("d-block", "d-none");
    } else {
      document.getElementById("phoneAlert").classList.replace("d-none", "d-block");
    }
  }

  if (ageInputTouched) {
    if (ageValidation()) {
      document.getElementById("ageAlert").classList.replace("d-block", "d-none");
    } else {
      document.getElementById("ageAlert").classList.replace("d-none", "d-block");
    }
  }

  if (passwordInputTouched) {
    if (passwordValidation()) {
      document.getElementById("passwordAlert").classList.replace("d-block", "d-none");
    } else {
      document.getElementById("passwordAlert").classList.replace("d-none", "d-block");
    }
  }

  if (repasswordInputTouched) {
    if (repasswordValidation()) {
      document.getElementById("repasswordAlert").classList.replace("d-block", "d-none");
    } else {
      document.getElementById("repasswordAlert").classList.replace("d-none", "d-block");
    }
  }

  if (nameValidation() && emailValidation() && phoneValidation() && ageValidation() && passwordValidation() && repasswordValidation()) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled" , true);
  }
}

function nameValidation() {
  return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value));
}

function emailValidation() {
  return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value));
}

function phoneValidation() {
  return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value));
}

function ageValidation() {
  return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value));
}

function passwordValidation() {
  return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value));
}

function repasswordValidation() {
  return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value;
}
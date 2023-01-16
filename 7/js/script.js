let navHeader = document.querySelector('.header-navigation');
let navToggle = document.querySelector('.header-navigation__burger');
console.log(navHeader);
navHeader.classList.remove('header-navigation--no-js');
navHeader.classList.add('header-navigation--closed');
console.log("11");

navToggle.addEventListener('click', function () {
  if (navHeader.classList.contains('header-navigation--closed')) {
    navHeader.classList.remove('header-navigation--closed');
    navHeader.classList.add('header-navigation--opened');
  } else {
    navHeader.classList.add('header-navigation--closed');
    navHeader.classList.remove('header-navigation--opened');
  }
});

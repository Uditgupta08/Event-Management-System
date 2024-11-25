// function toggleMenu() {
//   document.querySelector(".navbar-links").classList.toggle("show");
// }
// document.addEventListener("DOMContentLoaded", function () {
//   const slides = document.querySelectorAll(".slide");
//   let currentSlide = 0;
//   function nextSlide() {
//     slides[currentSlide].classList.remove("active");
//     currentSlide = (currentSlide + 1) % slides.length;
//     slides[currentSlide].classList.add("active");
//   }
//   setInterval(nextSlide, 3000);
// });
// document.addEventListener("DOMContentLoaded", () => {
//   const serviceCards = document.querySelectorAll(".servCard");
//   const userLoggedIn =
//     document.body.getAttribute("data-user-logged-in") === "true";
//   serviceCards.forEach((card) => {
//     const url = card.getAttribute("data-url");
//     if (!userLoggedIn) {
//       card.style.pointerEvents = "none";
//       card.style.opacity = "0.6";
//       card.addEventListener("click", () => {
//         alert("Please log in to access this service.");
//       });
//       return;
//     }
//     card.addEventListener("click", () => {
//       if (url) {
//         window.location.href = url;
//       } else {
//         console.error("URL not found for the card.");
//       }
//     });
//   });
// });

function toggleMenu() {
  document.querySelector(".navbar-links").classList.toggle("show");
}
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;
  function nextSlide() {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }
  setInterval(nextSlide, 3000);
});
document.addEventListener("DOMContentLoaded", () => {
  const serviceCards = document.querySelectorAll(".servCard");
  const userLoggedIn =
    document.body.getAttribute("data-user-logged-in") === "true";
  serviceCards.forEach((card) => {
    const url = card.getAttribute("data-url");
    if (!userLoggedIn) {
      card.style.pointerEvents = "none";
      card.style.opacity = "0.6";
      card.addEventListener("click", () => {
        alert("Please log in to access this service.");
      });
      return;
    }
    card.addEventListener("click", () => {
      if (url) {
        window.location.href = url;
      } else {
        console.error("URL not found for the card.");
      }
    });
  });
});
/* EmailJS */

(function () {
  emailjs.init("M_JjGg9URrkwoKqpS");
})();

document
  .getElementById("contact-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const serviceID = "service_zxen5up";
    const templateID = "template_6ajpi2h";

    emailjs
      .sendForm(serviceID, templateID, this)
      .then(() => {
        alert("Message sent successfully!");
        this.reset();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to send the message. Please try again later.");
      });
  });

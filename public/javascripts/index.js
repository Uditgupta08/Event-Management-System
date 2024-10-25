document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Loaded");
  const serviceCards = document.querySelectorAll(".servCard");
  console.log("Service Cards:", serviceCards);

  serviceCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      console.log("Card clicked:", card);
      const url = card.getAttribute("data-url");
      console.log("URL:", url);

      const userLoggedIn =
        document.body.getAttribute("data-user-logged-in") === "true";
      console.log(document.body.getAttribute("data-user-logged-in"));
      if (userLoggedIn) {
        if (url) {
          window.location.href = url;
        } else {
          console.error("URL not found for the card.");
        }
      } else {
        alert("Please log in to view this service.");
      }
    });
  });
});

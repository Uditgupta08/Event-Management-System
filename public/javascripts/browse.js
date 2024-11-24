function toggleMenu() {
  document.querySelector(".navbar-links").classList.toggle("show");
}

// Get DOM elements
const filterTrigger = document.querySelector(".filter-trigger");
const popup = document.querySelector(".popup-overlay");
const closeButton = document.querySelector(".close-popup");
const applyButton = document.querySelector(".apply-filters");
const resetButton = document.querySelector(".reset-filters");

// Open popup
filterTrigger.addEventListener("click", () => {
  popup.style.display = "block";
  document.body.style.overflow = "hidden"; // Prevent background scrolling
});

// Close popup
const closePopup = () => {
  popup.style.display = "none";
  document.body.style.overflow = "auto"; // Restore scrolling
};

closeButton.addEventListener("click", closePopup);

document.querySelectorAll(".checkout-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    // Prevent redirection only if specific conditions are met
    if (someCondition) {
      e.preventDefault();
    }
  });
});

// Close when clicking outside popup
popup.addEventListener("click", (e) => {
  if (e.target === popup) {
    closePopup();
  }
});

// Apply filters
applyButton.addEventListener("click", () => {
  const selectedCategories = Array.from(
    document.querySelectorAll('input[name="category"]:checked')
  ).map((checkbox) => checkbox.value);

  // Get selected price range
  const selectedPrice = document.querySelector(
    'input[name="price"]:checked'
  )?.value;

  // Apply your filtering logic here
  console.log("Selected categories:", selectedCategories);
  console.log("Selected price range:", selectedPrice);

  closePopup();
});

// Reset filters
resetButton.addEventListener("click", () => {
  document
    .querySelectorAll('input[type="checkbox"], input[type="radio"]')
    .forEach((input) => (input.checked = false));
});

// Function to update active filters display
function updateActiveFilters() {
  const activeFiltersContainer = document.getElementById("activeFilters");
  const activeFiltersContent = activeFiltersContainer.querySelector(
    ".active-filters-content"
  );
  const selectedCategories = Array.from(
    document.querySelectorAll('input[name="category"]:checked')
  ).map((checkbox) => checkbox.value);
  const selectedPrice = document.querySelector(
    'input[name="price"]:checked'
  )?.value;

  // Clear previous filters
  activeFiltersContent.innerHTML = "";

  // Create filter tags for selected categories
  selectedCategories.forEach((category) => {
    const filterTag = document.createElement("span");
    filterTag.className = "filter-tag";
    filterTag.innerHTML = `
            Category: ${category}
            <span class="remove-filter" data-filter-type="category" data-filter-value="${category}">&times;</span>
        `;
    activeFiltersContent.appendChild(filterTag);
  });

  // Create filter tag for selected price range
  if (selectedPrice) {
    const filterTag = document.createElement("span");
    filterTag.className = "filter-tag";
    filterTag.innerHTML = `
            Price: ${selectedPrice}
            <span class="remove-filter" data-filter-type="price" data-filter-value="${selectedPrice}">&times;</span>
        `;
    activeFiltersContent.appendChild(filterTag);
  }

  // Show/hide the active filters container
  activeFiltersContainer.classList.toggle(
    "visible",
    selectedCategories.length > 0 || selectedPrice !== undefined
  );
}

// Update apply filters event listener
applyButton.addEventListener("click", () => {
  const selectedCategories = Array.from(
    document.querySelectorAll('input[name="category"]:checked')
  ).map((checkbox) => checkbox.value);
  const selectedPrice = document.querySelector(
    'input[name="price"]:checked'
  )?.value;

  console.log("Selected categories:", selectedCategories);
  console.log("Selected price range:", selectedPrice);

  updateActiveFilters();
  closePopup();
});

// Update reset filters event listener
resetButton.addEventListener("click", () => {
  document
    .querySelectorAll('input[type="checkbox"], input[type="radio"]')
    .forEach((input) => (input.checked = false));
  updateActiveFilters();
});

// Handle removing individual filters
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-filter")) {
    const filterType = e.target.dataset.filterType;
    const filterValue = e.target.dataset.filterValue;

    if (filterType === "category") {
      const checkbox = document.querySelector(
        `input[name="category"][value="${filterValue}"]`
      );
      if (checkbox) checkbox.checked = false;
    } else if (filterType === "price") {
      const radio = document.querySelector(
        `input[name="price"][value="${filterValue}"]`
      );
      if (radio) radio.checked = false;
    }

    updateActiveFilters();
  }
});

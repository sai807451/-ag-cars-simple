/* ---- AG CARS KARIMNAGAR — customer page logic ---- */

const listEl = document.getElementById("car-list");
const emptyMsg = document.getElementById("empty-msg");
const overlay = document.getElementById("car-detail");
const detailContent = document.getElementById("detail-content");

// Simple placeholder shown when a photo file is missing.
const noPhoto = '<div class="no-photo">No photo</div>';

// Escape text so car data can't break the HTML.
function esc(v) {
  return String(v == null ? "" : v)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Build a tel: link from a phone number (strip spaces/brackets).
function telHref(phone) {
  return "tel:" + String(phone || "").replace(/[^\d+]/g, "");
}

// First photo for the card, with graceful fallback if the file is missing.
function cardImage(car) {
  const first = car.photos && car.photos[0];
  if (!first) return noPhoto;
  return '<img src="' + esc(first) + '" alt="' + esc(car.name) +
    '" onerror="this.parentNode.innerHTML=\'' + noPhoto.replace(/'/g, "\\'") + '\'">';
}

// Render the grid of car cards.
function renderCars() {
  if (!cars || cars.length === 0) {
    emptyMsg.hidden = false;
    return;
  }
  listEl.innerHTML = cars.map(function (car) {
    const sold = car.status === "SOLD"
      ? '<span class="badge-sold">SOLD</span>' : "";
    return (
      '<article class="car-card" data-id="' + car.id + '">' +
        '<div class="card-img-wrap">' + sold + cardImage(car) + '</div>' +
        '<div class="card-body">' +
          '<div class="card-price">' + esc(car.price) + '</div>' +
          '<div class="card-name">' + esc(car.name) + '</div>' +
          '<div class="card-meta">' +
            esc(car.year) + ' &middot; ' + esc(Number(car.mileageKm).toLocaleString("en-IN")) +
            ' km &middot; ' + esc(car.fuelType) +
          '</div>' +
          '<div class="card-location">' + esc(car.location) + '</div>' +
        '</div>' +
      '</article>'
    );
  }).join("");

  // Open detail when a card is clicked.
  listEl.querySelectorAll(".car-card").forEach(function (el) {
    el.addEventListener("click", function () {
      openDetail(Number(el.dataset.id));
    });
  });
}

// One spec row (only shown if the value exists).
function specRow(label, value) {
  if (value === undefined || value === null || value === "") return "";
  return '<div class="spec-row"><span class="spec-label">' + esc(label) +
    '</span><span class="spec-value">' + esc(value) + '</span></div>';
}

// Build and show the detail popup for one car.
function openDetail(id) {
  const car = cars.find(function (c) { return c.id === id; });
  if (!car) return;

  // Photos row (fallback if none).
  let photosHtml;
  if (car.photos && car.photos.length) {
    photosHtml = car.photos.map(function (p) {
      return '<img src="' + esc(p) + '" alt="' + esc(car.name) +
        '" onerror="this.style.display=\'none\'">';
    }).join("");
  } else {
    photosHtml = noPhoto;
  }

  const kms = Number(car.mileageKm).toLocaleString("en-IN") + " km";

  detailContent.innerHTML =
    '<div class="detail-photos">' + photosHtml + '</div>' +
    '<div class="detail-body">' +
      '<h2 class="detail-title">' + esc(car.name) + '</h2>' +
      '<div class="detail-price">' + esc(car.price) + '</div>' +

      // Phone FIRST, prominent, with a Call button.
      '<div class="contact-box">' +
        '<div class="contact-label">Interested? Call us directly</div>' +
        '<div class="contact-phone">' + esc(car.contactPhone) + '</div>' +
        '<a class="call-btn" href="' + telHref(car.contactPhone) + '">📞 Call Now</a>' +
      '</div>' +

      // Then all the car details.
      '<div class="spec-grid">' +
        specRow("Make", car.make) +
        specRow("Model", car.model) +
        specRow("Year", car.year) +
        specRow("Kilometres", kms) +
        specRow("Fuel", car.fuelType) +
        specRow("Transmission", car.transmission) +
        specRow("Colour", car.color) +
        specRow("Owner", car.ownerType) +
        specRow("Insurance valid", car.insuranceValid === true ? "Yes" :
                 car.insuranceValid === false ? "No" : "") +
        specRow("Tyre condition", car.tyreCondition) +
        specRow("Engine condition", car.engineCondition) +
        specRow("Accident history", car.accidentHistory) +
        specRow("Location", car.location) +
        specRow("Status", car.status) +
      '</div>' +

      (car.description ? '<p class="detail-desc">' + esc(car.description) + '</p>' : "") +
    '</div>';

  overlay.hidden = false;
  document.body.style.overflow = "hidden"; // stop background scroll
}

function closeDetail() {
  overlay.hidden = true;
  document.body.style.overflow = "";
}

// Close on X button, or clicking the dark backdrop.
document.getElementById("close-detail").addEventListener("click", closeDetail);
overlay.addEventListener("click", function (e) {
  if (e.target === overlay) closeDetail();
});

renderCars();

/* ---- AG CARS KARIMNAGAR — admin page logic ---- */

const auth = firebase.auth();
const carsRef = db.collection("cars");

const loginView = document.getElementById("login-view");
const adminView = document.getElementById("admin-view");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const whoami = document.getElementById("whoami");
const listEl = document.getElementById("admin-list");
const addForm = document.getElementById("add-car-form");
const addStatus = document.getElementById("add-status");
const overlay = document.getElementById("car-detail");
const detailContent = document.getElementById("detail-content");

let carsById = {};

function esc(v) {
  return String(v == null ? "" : v)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function telHref(phone) {
  return "tel:" + String(phone || "").replace(/[^\d+]/g, "");
}

function specRow(label, value) {
  if (value === undefined || value === null || value === "") return "";
  return '<div class="spec-row"><span class="spec-label">' + esc(label) +
    '</span><span class="spec-value">' + esc(value) + '</span></div>';
}

// Show full details for one car — same layout the customer page uses.
function viewCarDetail(id) {
  const car = carsById[id];
  if (!car) return;

  const noPhoto = '<div class="no-photo">No photo</div>';
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
      '<div class="contact-box">' +
        '<div class="contact-label">Contact number on listing</div>' +
        '<div class="contact-phone">' + esc(car.contactPhone) + '</div>' +
        '<a class="call-btn" href="' + telHref(car.contactPhone) + '">📞 Call Now</a>' +
      '</div>' +
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
  document.body.style.overflow = "hidden";
}

function closeDetail() {
  overlay.hidden = true;
  document.body.style.overflow = "";
}

document.getElementById("close-detail").addEventListener("click", closeDetail);
overlay.addEventListener("click", function (e) {
  if (e.target === overlay) closeDetail();
});

// ---- Login ----
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  loginError.hidden = true;
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  auth.signInWithEmailAndPassword(email, password).catch(function (err) {
    loginError.textContent = "Login failed: " + err.message;
    loginError.hidden = false;
  });
});

document.getElementById("logout-btn").addEventListener("click", function () {
  auth.signOut();
});

auth.onAuthStateChanged(function (user) {
  if (user) {
    loginView.hidden = true;
    adminView.hidden = false;
    whoami.textContent = "Logged in as " + user.email;
    renderAdminList();
  } else {
    loginView.hidden = false;
    adminView.hidden = true;
  }
});

// ---- List + delete ----
function renderAdminList() {
  listEl.innerHTML = '<p class="empty-msg">Loading…</p>';
  carsRef.orderBy("createdAt", "desc").get().then(function (snapshot) {
    carsById = {};
    if (snapshot.empty) {
      listEl.innerHTML = '<p class="empty-msg">No cars yet.</p>';
      return;
    }
    listEl.innerHTML = snapshot.docs.map(function (doc) {
      const car = doc.data();
      carsById[doc.id] = car;
      return (
        '<div class="admin-row">' +
          '<div class="admin-row-info">' +
            '<strong>' + esc(car.name) + '</strong> — ' + esc(car.price) +
            ' (' + esc(car.year) + ', ' + esc(car.fuelType) + ')' +
          '</div>' +
          '<div class="admin-row-actions">' +
            '<button class="view-btn" data-id="' + doc.id + '">View</button>' +
            '<button class="delete-btn" data-id="' + doc.id + '">Delete</button>' +
          '</div>' +
        '</div>'
      );
    }).join("");
    listEl.querySelectorAll(".view-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        viewCarDetail(btn.dataset.id);
      });
    });
    listEl.querySelectorAll(".delete-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (!confirm("Delete this car listing?")) return;
        carsRef.doc(btn.dataset.id).delete().then(renderAdminList);
      });
    });
  });
}

// ---- Add car ----
addForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const files = document.getElementById("f-photos").files;
  if (!files.length) return;

  addStatus.hidden = false;
  addStatus.textContent = "Uploading photos… 0/" + files.length;

  const uploads = [];
  let done = 0;
  for (let i = 0; i < files.length; i++) {
    uploads.push(
      uploadPhotoToCloudinary(files[i]).then(function (url) {
        done++;
        addStatus.textContent = "Uploading photos… " + done + "/" + files.length;
        return url;
      })
    );
  }

  Promise.all(uploads)
    .then(function (photoUrls) {
      addStatus.textContent = "Saving car…";
      return carsRef.add({
        name: document.getElementById("f-name").value,
        contactPhone: document.getElementById("f-phone").value,
        price: document.getElementById("f-price").value,
        year: Number(document.getElementById("f-year").value),
        mileageKm: Number(document.getElementById("f-km").value),
        fuelType: document.getElementById("f-fuel").value,
        transmission: document.getElementById("f-trans").value,
        color: document.getElementById("f-color").value,
        location: document.getElementById("f-location").value,
        status: "AVAILABLE",
        ownerType: document.getElementById("f-owner").value,
        insuranceValid: document.getElementById("f-insurance").value === "true",
        tyreCondition: document.getElementById("f-tyre").value,
        engineCondition: document.getElementById("f-engine").value,
        accidentHistory: document.getElementById("f-accident").value,
        description: document.getElementById("f-desc").value,
        photos: photoUrls,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(function () {
      addStatus.textContent = "Saved!";
      addForm.reset();
      document.getElementById("f-location").value = "Karimnagar";
      renderAdminList();
      setTimeout(function () { addStatus.hidden = true; }, 2000);
    })
    .catch(function (err) {
      addStatus.textContent = "Error: " + err.message;
    });
});

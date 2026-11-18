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

function esc(v) {
  return String(v == null ? "" : v)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

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
    if (snapshot.empty) {
      listEl.innerHTML = '<p class="empty-msg">No cars yet.</p>';
      return;
    }
    listEl.innerHTML = snapshot.docs.map(function (doc) {
      const car = doc.data();
      return (
        '<div class="admin-row">' +
          '<div class="admin-row-info">' +
            '<strong>' + esc(car.name) + '</strong> — ' + esc(car.price) +
            ' (' + esc(car.year) + ', ' + esc(car.fuelType) + ')' +
          '</div>' +
          '<button class="delete-btn" data-id="' + doc.id + '">Delete</button>' +
        '</div>'
      );
    }).join("");
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

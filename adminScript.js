/* ---- AG CARS KARIMNAGAR — admin page logic ---- */

// Work on a copy so we can delete/add without touching the loaded cars.js until saved.
let adminCars = cars.slice();

const listEl = document.getElementById("admin-list");
const outputBox = document.getElementById("output-box");

function esc(v) {
  return String(v == null ? "" : v)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Show the current list with a Delete button per car.
function renderAdminList() {
  if (adminCars.length === 0) {
    listEl.innerHTML = '<p class="empty-msg">No cars left.</p>';
  } else {
    listEl.innerHTML = adminCars.map(function (car) {
      return (
        '<div class="admin-row">' +
          '<div class="admin-row-info">' +
            '<strong>' + esc(car.name) + '</strong> — ' + esc(car.price) +
            ' (' + esc(car.year) + ', ' + esc(car.fuelType) + ')' +
          '</div>' +
          '<button class="delete-btn" data-id="' + car.id + '">Delete</button>' +
        '</div>'
      );
    }).join("");
  }
  listEl.querySelectorAll(".delete-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const id = Number(btn.dataset.id);
      adminCars = adminCars.filter(function (c) { return c.id !== id; });
      renderAdminList();
      renderOutput();
    });
  });
}

// Build the exact cars.js text to copy back into the real file.
function renderOutput() {
  const header =
    "// AG CARS KARIMNAGAR — car list.\n" +
    "// To ADD a car: copy one { ... } block, change the details, give it a new id.\n" +
    "// To DELETE a car: remove its { ... } block.\n" +
    "// Photos: put the .jpg files in the images/ folder and list them under \"photos\".\n" +
    "const cars = ";
  outputBox.value = header + JSON.stringify(adminCars, null, 2) + ";\n";
}

document.getElementById("copy-btn").addEventListener("click", function () {
  outputBox.select();
  navigator.clipboard.writeText(outputBox.value).then(function () {
    alert("Copied! Now paste this into your cars.js file and save it.");
  }).catch(function () {
    alert("Could not auto-copy. The text is selected — press Ctrl+C to copy it yourself.");
  });
});

renderAdminList();
renderOutput();

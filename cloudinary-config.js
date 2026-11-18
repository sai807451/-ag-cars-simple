// AG CARS KARIMNAGAR — Cloudinary setup (photo uploads only; data + login stay in Firebase).
// These values are safe to be public — the unsigned preset only allows uploads into the
// "ag-cars" folder, nothing else.
const CLOUDINARY_CLOUD_NAME = "un6e3n3x";
const CLOUDINARY_UPLOAD_PRESET = "ag_cars_unsigned";

function uploadPhotoToCloudinary(file) {
  const url = "https://api.cloudinary.com/v1_1/" + CLOUDINARY_CLOUD_NAME + "/image/upload";
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  return fetch(url, { method: "POST", body: formData })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (!data.secure_url) throw new Error(data.error && data.error.message || "Upload failed");
      return data.secure_url;
    });
}

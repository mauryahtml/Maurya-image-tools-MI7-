/* ==========================================
   MI7 - Image Compressor
   compress.js (Part 1)
========================================== */

const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");

const compressBtn = document.getElementById("compressBtn");
const downloadBtn = document.getElementById("downloadBtn");
const shareBtn = document.getElementById("shareBtn");
const resetBtn = document.getElementById("resetBtn");

let selectedFile = null;

/* ==========================
   Image Upload & Preview
========================== */

imageInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    selectedFile = file;

    const reader = new FileReader();

    reader.onload = function (e) {

        previewImage.src = e.target.result;
        previewImage.style.display = "block";

    };

    reader.readAsDataURL(file);

});

/* ==========================
   Compress Button
========================== */

compressBtn.addEventListener("click", function () {

    if (!selectedFile) {

        alert("Please upload an image first.");

        return;

    }

    alert("Compression feature will be added in Part 2.");

});

/* ==========================
   Download Button
========================== */

downloadBtn.addEventListener("click", function () {

    if (!previewImage.src) {

        alert("Nothing to download.");

        return;

    }

    alert("Download feature will be added in Part 2.");

});

/* ==========================
   Share Button
========================== */

shareBtn.addEventListener("click", async function () {

    if (navigator.share) {

        try {

            await navigator.share({

                title: "MI7 Image Compressor",

                text: "Try MI7 - Maurya Image Tools"

            });

        } catch (e) {

            console.log(e);

        }

    } else {

        alert("Sharing is not supported on this device.");

    }

});

/* ==========================
   Reset
========================== */

resetBtn.addEventListener("click", function () {

    imageInput.value = "";

    previewImage.src = "";

    previewImage.style.display = "none";

    selectedFile = null;

});

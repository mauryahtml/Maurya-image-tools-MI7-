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

const qualitySlider=document.getElementById("qualitySlider");

const qualityValue=document.getElementById("qualityValue");

const originalSize=document.getElementById("originalSize");

const compressedSize=document.getElementById("compressedSize");

qualitySlider.oninput=function(){

qualityValue.innerHTML=this.value+"%";

};

imageInput.addEventListener("change",function(){

const file=this.files[0];

if(!file) return;

originalSize.innerHTML=(file.size/1024).toFixed(2)+" KB";

});

/* ==========================
   Real Compression Engine
========================== */

let compressedBlob = null;

compressBtn.addEventListener("click", () => {

    if (!selectedFile) {
        alert("Please upload an image first.");
        return;
    }

    const img = new Image();

    img.onload = () => {

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const quality = Number(qualitySlider.value) / 100;

        canvas.toBlob((blob) => {

            if (!blob) {
                alert("Compression failed.");
                return;
            }

            compressedBlob = blob;

            compressedSize.textContent =
                (blob.size / 1024).toFixed(2) + " KB";

            previewImage.src = URL.createObjectURL(blob);

            alert("Image compressed successfully!");

        }, "image/jpeg", quality);

    };

    img.src = URL.createObjectURL(selectedFile);

});
const targetValue=document.getElementById("targetValue");
const targetUnit=document.getElementById("targetUnit");

function getTargetBytes(){

let value=parseFloat(targetValue.value);

if(isNaN(value)||value<=0){

value=100;

targetValue.value=100;

}

if(targetUnit.value==="MB"){

return value*1024*1024;

}

return value*1024;

}

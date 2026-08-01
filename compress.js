/* =======================================
   MI7 IMAGE TOOLS
   Compress Image Tool
   compress.js V3 Final
======================================= */

"use strict";

/* ==========================
GLOBAL VARIABLES
========================== */

const imageInput = document.getElementById("imageInput");

const previewContainer = document.getElementById("previewContainer");

const imageInfo = document.getElementById("imageInfo");

const resultInfo = document.getElementById("resultInfo");

const progressBar = document.getElementById("progressBar");

const targetSize = document.getElementById("targetSize");

const unit = document.getElementById("unit");

const outputFormat = document.getElementById("outputFormat");

const qualitySlider = document.getElementById("qualitySlider");

const qualityValue = document.getElementById("qualityValue");

const compressBtn = document.getElementById("compressBtn");

const downloadBtn = document.getElementById("downloadBtn");

const shareBtn = document.getElementById("shareBtn");

const resetBtn = document.getElementById("resetBtn");

/* ==========================
DATA
========================== */

let selectedFiles = [];

let compressedFiles = [];

/* ==========================
QUALITY TEXT
========================== */

qualitySlider.addEventListener("input", () => {

    qualityValue.textContent = qualitySlider.value + "%";

});

/* ==========================
SELECT IMAGE
========================== */

imageInput.addEventListener("change", () => {

    selectedFiles = [...imageInput.files];

    compressedFiles = [];

    previewContainer.innerHTML = "";

    resultInfo.innerHTML = "";

    progressBar.style.width = "0%";

    if (selectedFiles.length === 0) {

        imageInfo.innerHTML = "<p>No image selected.</p>";

        return;

    }

    imageInfo.innerHTML = `
        <p><b>Total Images :</b> ${selectedFiles.length}</p>
    `;

    previewImages();

});

/* ==========================
IMAGE PREVIEW
========================== */

function previewImages() {

    previewContainer.innerHTML = "";

    selectedFiles.forEach(file => {

        const reader = new FileReader();

        reader.onload = function(e){

            const card = document.createElement("div");

            card.className = "previewCard";

            card.innerHTML = `
                <img src="${e.target.result}">
                <p>${file.name}</p>
                <small>${(file.size/1024).toFixed(1)} KB</small>
            `;

            previewContainer.appendChild(card);

        };

        reader.readAsDataURL(file);

    });

       }

/* ==========================
COMPRESS BUTTON
========================== */

compressBtn.addEventListener("click", compressImages);

async function compressImages() {

    if (selectedFiles.length === 0) {

        showToast("Please select image first.");

        return;

    }

    showLoading();

    compressedFiles = [];

    resultInfo.innerHTML = "";

    progressBar.style.width = "0%";

    for (let i = 0; i < selectedFiles.length; i++) {

        const file = selectedFiles[i];

        const compressed = await compressSingleImage(file);

        compressedFiles.push(compressed);

        progressBar.style.width =
            ((i + 1) / selectedFiles.length) * 100 + "%";

    }

    hideLoading();

    resultInfo.innerHTML = `
        <div class="resultCard">
            <b>Compression Completed</b><br>
            Total Images : ${compressedFiles.length}
        </div>
    `;

    showToast("Compression Completed");

}

/* ==========================
COMPRESS SINGLE IMAGE
========================== */

function compressSingleImage(file){

    return new Promise((resolve)=>{

        const reader = new FileReader();

        reader.onload = function(e){

            const img = new Image();

            img.onload = function(){

                const canvas = document.createElement("canvas");

                const ctx = canvas.getContext("2d");

                canvas.width = img.width;

                canvas.height = img.height;

                ctx.drawImage(img,0,0);

                let quality =
                    Number(qualitySlider.value) / 100;

                let mimeType =
                    "image/" + outputFormat.value;

                canvas.toBlob(function(blob){

                    let finalBlob = blob;

                    let targetBytes =
                        Number(targetSize.value);

                    if(unit.value==="KB"){

                        targetBytes *= 1024;

                    }else{

                        targetBytes *= 1024 * 1024;

                    }

                    resolve({

                        name:file.name,

                        blob:finalBlob,

                        url:URL.createObjectURL(finalBlob),

                        originalSize:file.size,

                        compressedSize:finalBlob.size

                    });

                },mimeType,quality);

            };

            img.src = e.target.result;

        };

        reader.readAsDataURL(file);

    });

                   }

/* ==========================
DOWNLOAD
========================== */

downloadBtn.addEventListener("click", async () => {

    if (compressedFiles.length === 0) {

        showToast("Compress image first.");
        return;

    }

    /* Single Image */

    if (compressedFiles.length === 1) {

        const file = compressedFiles[0];

        const a = document.createElement("a");

        a.href = file.url;

        a.download = file.name;

        a.click();

        return;

    }

    /* Multiple Images ZIP */

    const zip = new JSZip();

    compressedFiles.forEach(file => {

        zip.file(file.name, file.blob);

    });

    const content = await zip.generateAsync({

        type: "blob"

    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(content);

    link.download = "MI7_Compressed_Images.zip";

    link.click();

});


/* ==========================
SHARE
========================== */

shareBtn.addEventListener("click", async () => {

    if (compressedFiles.length === 0) {

        showToast("Compress image first.");

        return;

    }

    /* One Image */

    if (compressedFiles.length === 1) {

        const file = compressedFiles[0];

        try {

            await navigator.share({

                files: [

                    new File(
                        [file.blob],
                        file.name,
                        { type: file.blob.type }
                    )

                ],

                title: "MI7 Image Tools"

            });

        } catch (e) {

            showToast("Share cancelled.");

        }

        return;

    }

    /* Multiple Images */

    showToast("For multiple images use Download ZIP.");

});


/* ==========================
RESET
========================== */

resetBtn.addEventListener("click", () => {

    imageInput.value = "";

    selectedFiles = [];

    compressedFiles = [];

    previewContainer.innerHTML = "";

    resultInfo.innerHTML = "";

    imageInfo.innerHTML = "<p>No image selected.</p>";

    progressBar.style.width = "0%";

    targetSize.value = "";

    qualitySlider.value = 80;

    qualityValue.textContent = "80%";

    showToast("Reset Successfully");

});


/* ==========================
TARGET SIZE VALIDATION
========================== */

targetSize.addEventListener("input", () => {

    if (Number(targetSize.value) <= 0) {

        targetSize.value = "";

    }

});


/* ==========================
READY
========================== */

console.log("MI7 Compress Tool Loaded Successfully");


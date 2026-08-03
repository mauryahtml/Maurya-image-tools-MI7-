/* ==========================================
   MI7 IMAGE TOOLS
   compress.js FINAL
========================================== */

const imageInput = document.getElementById("imageInput");

const previewCard = document.getElementById("previewCard");
const previewImage = document.getElementById("previewImage");

const fileName = document.getElementById("fileName");
const fileFormat = document.getElementById("fileFormat");
const originalSize = document.getElementById("originalSize");
const imageDimensions = document.getElementById("imageDimensions");

const targetSize = document.getElementById("targetSize");

const compressBtn = document.getElementById("compressBtn");
const downloadBtn = document.getElementById("downloadBtn");
const shareBtn = document.getElementById("shareBtn");
const resetBtn = document.getElementById("resetBtn");

const resultCard = document.getElementById("resultCard");

const resultOriginal = document.getElementById("resultOriginal");
const resultCompressed = document.getElementById("resultCompressed");
const savedPercent = document.getElementById("savedPercent");

let selectedFiles = [];
let compressedFiles = [];

/* ==========================================
   SELECT IMAGE
========================================== */

imageInput.addEventListener("change", function () {

    selectedFiles = [...this.files];

    compressedFiles = [];

    if (selectedFiles.length === 0) return;

    showPreview(selectedFiles[0]);

});

/* ==========================================
   PREVIEW
========================================== */

function showPreview(file) {

    previewCard.style.display = "block";

    fileName.textContent = file.name;

    fileFormat.textContent = file.type || "Unknown";

    originalSize.textContent =
        (file.size / 1024).toFixed(1) + " KB";

    const reader = new FileReader();

    reader.onload = function (e) {

        previewImage.src = e.target.result;

        const img = new Image();

        img.onload = function () {

            imageDimensions.textContent =
                img.width + " × " + img.height + " px";

        };

        img.src = e.target.result;

    };

    reader.readAsDataURL(file);

}
/* ==========================================
   COMPRESS IMAGES
========================================== */

compressBtn.addEventListener("click", async function () {

    if (selectedFiles.length === 0) {

        showToast("Please select image.");

        return;

    }

    showLoading();

    compressedFiles = [];

    const targetKB = parseInt(targetSize.value) || 100;

    for (const file of selectedFiles) {

        const compressed = await compressImage(file, targetKB);

        compressedFiles.push(compressed);

    }

    hideLoading();

    showResult();

});


/* ==========================================
   IMAGE COMPRESS FUNCTION
========================================== */

async function compressImage(file, targetKB) {

    return new Promise((resolve) => {

        const reader = new FileReader();

        reader.onload = function (event) {

            const img = new Image();

            img.onload = function () {

                const canvas = document.createElement("canvas");

                const ctx = canvas.getContext("2d");

                canvas.width = img.width;

                canvas.height = img.height;

                ctx.drawImage(img, 0, 0);

                let quality = 0.9;

                let output;

                do {

                    output = canvas.toDataURL(
                        "image/jpeg",
                        quality
                    );

                    quality -= 0.05;

                } while (

                    output.length / 1024 > targetKB * 1.37 &&

                    quality > 0.05

                );

                fetch(output)

                    .then(res => res.blob())

                    .then(blob => {

                        resolve({

                            name: file.name.replace(/\.[^/.]+$/, "") + ".jpg",

                            blob: blob,

                            original: file.size,

                            compressed: blob.size

                        });

                    });

            };

            img.src = event.target.result;

        };

        reader.readAsDataURL(file);

    });

}


/* ==========================================
   RESULT
========================================== */

function showResult() {

    resultCard.style.display = "block";

    downloadBtn.style.display = "block";

    shareBtn.style.display = "block";

    const totalOriginal =
        compressedFiles.reduce((a, b) => a + b.original, 0);

    const totalCompressed =
        compressedFiles.reduce((a, b) => a + b.compressed, 0);

    resultOriginal.textContent =
        (totalOriginal / 1024).toFixed(1) + " KB";

    resultCompressed.textContent =
        (totalCompressed / 1024).toFixed(1) + " KB";

    savedPercent.textContent =

        (
            ((totalOriginal - totalCompressed) / totalOriginal) * 100
        ).toFixed(1) + "%";

            }

/* ==========================================
   DOWNLOAD
========================================== */

downloadBtn.addEventListener("click", function () {

    if (compressedFiles.length === 0) {

        showToast("Nothing to download.");

        return;

    }

    compressedFiles.forEach((file, index) => {

        const url = URL.createObjectURL(file.blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = file.name;

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);

    });

});


/* ==========================================
   SHARE
========================================== */

shareBtn.addEventListener("click", async function () {

    if (compressedFiles.length === 0) {

        showToast("Nothing to share.");

        return;

    }

    try {

        const files = compressedFiles.map(file =>

            new File(

                [file.blob],

                file.name,

                {

                    type: "image/jpeg"

                }

            )

        );

        if (

            navigator.canShare &&

            navigator.canShare({

                files

            })

        ) {

            await navigator.share({

                title: "Compressed Images",

                text: "Compressed using MI7 Image Tools",

                files

            });

        } else {

            showToast(

                "Your browser doesn't support sharing multiple images."

            );

        }

    }

    catch (err) {

        console.log(err);

    }

});


/* ==========================================
   RESET
========================================== */

resetBtn.addEventListener("click", function () {

    imageInput.value = "";

    selectedFiles = [];

    compressedFiles = [];

    previewCard.style.display = "none";

    resultCard.style.display = "none";

    downloadBtn.style.display = "none";

    shareBtn.style.display = "none";

    previewImage.src = "";

    fileName.textContent = "-";

    fileFormat.textContent = "-";

    originalSize.textContent = "-";

    imageDimensions.textContent = "-";

    resultOriginal.textContent = "-";

    resultCompressed.textContent = "-";

    savedPercent.textContent = "-";

    targetSize.value = "100";

    showToast("Reset Successfully");

});

/* ==========================================
   EXTRA FEATURES
========================================== */

/* Progress Message */

function updateProgress(current, total) {

    showToast(

        "Compressing " + current + " of " + total + "..."

    );

}


/* Better Compression */

async function compressAllImages() {

    compressedFiles = [];

    const targetKB = parseInt(targetSize.value) || 100;

    for (let i = 0; i < selectedFiles.length; i++) {

        updateProgress(i + 1, selectedFiles.length);

        const compressed = await compressImage(

            selectedFiles[i],

            targetKB

        );

        compressedFiles.push(compressed);

    }

    showResult();

}


/* Preview First Image */

if (selectedFiles.length > 0) {

    showPreview(selectedFiles[0]);

}


/* Download Success */

downloadBtn.addEventListener("click", function () {

    showToast(

        compressedFiles.length +

        " image(s) downloaded."

    );

});


/* Share Success */

shareBtn.addEventListener("click", function () {

    if (compressedFiles.length > 0) {

        showToast("Preparing images...");

    }

});


/* ==========================================
   FINISHED
========================================== */

console.log(

    "✅ MI7 Compress Tool Loaded Successfully"

);


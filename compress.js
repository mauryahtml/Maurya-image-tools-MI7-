/* ==========================================
   MI7 Image Tools
   Compress.js V2
   PART 1
========================================== */

const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const previewContainer = document.getElementById("previewContainer");

const targetSize = document.getElementById("targetSize");
const unit = document.getElementById("unit");

const compressBtn = document.getElementById("compressBtn");
const downloadBtn = document.getElementById("downloadBtn");
const shareBtn = document.getElementById("shareBtn");
const resetBtn = document.getElementById("resetBtn");

const resultInfo = document.getElementById("resultInfo");

let selectedFiles = [];
let compressedFiles = [];

/* ==========================================
   IMAGE SELECT
========================================== */

imageInput.addEventListener("change", function () {

    if (!this.files.length) return;

    selectedFiles = [...this.files];

    showPreview();

});

/* ==========================================
   SHOW PREVIEW
========================================== */

function showPreview() {

    previewContainer.innerHTML = "";

    selectedFiles.forEach((file, index) => {

        const reader = new FileReader();

        reader.onload = function (e) {

            const card = document.createElement("div");

            card.className = "previewCard";

            card.innerHTML = `
                <img src="${e.target.result}">
                <p>${file.name}</p>
                <small>${(file.size / 1024).toFixed(2)} KB</small>
            `;

            previewContainer.appendChild(card);

        };

        reader.readAsDataURL(file);

    });

}

/* ==========================================
   TARGET SIZE
========================================== */

function getTargetBytes() {

    let size = parseFloat(targetSize.value);

    if (!size || size <= 0) {

        alert("Please enter target size.");

        return null;

    }

    if (unit.value === "MB") {

        return size * 1024 * 1024;

    }

    return size * 1024;

}

/* ==========================================
   RESET
========================================== */

resetBtn.addEventListener("click", () => {

    imageInput.value = "";

    selectedFiles = [];

    compressedFiles = [];

    previewContainer.innerHTML = "";

    resultInfo.innerHTML = "";

    targetSize.value = "";

});

/* ==========================================
   MI7 Image Tools
   Compress.js V2
   PART 2
========================================== */

compressBtn.addEventListener("click", async () => {

    if (selectedFiles.length === 0) {

        alert("Please select image(s).");
        return;

    }

    const target = getTargetBytes();

    if (target === null) return;

    compressBtn.disabled = true;
    compressBtn.innerText = "Compressing...";

    compressedFiles = [];

    resultInfo.innerHTML = "";

    for (let i = 0; i < selectedFiles.length; i++) {

        const file = selectedFiles[i];

        resultInfo.innerHTML =
        `Compressing ${i + 1} of ${selectedFiles.length}...`;

        const blob = await compressSingleImage(file, target);

        compressedFiles.push({

            name: file.name,
            blob: blob,
            original: file.size,
            compressed: blob.size

        });

    }

    showResult();

    compressBtn.disabled = false;
    compressBtn.innerText = "Compress Image";

});


/* ==========================================
   SINGLE IMAGE COMPRESS
========================================== */

async function compressSingleImage(file, targetBytes) {

    return new Promise((resolve, reject) => {

        const img = new Image();

        img.onload = function () {

            const canvas = document.createElement("canvas");

            const ctx = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            let quality = 0.95;

            function tryCompress() {

                canvas.toBlob((blob) => {

                    if (!blob) {

                        reject();
                        return;

                    }

                    if (blob.size <= targetBytes || quality <= 0.05) {

                        resolve(blob);
                        return;

                    }

                    quality -= 0.05;

                    tryCompress();

                }, "image/jpeg", quality);

            }

            tryCompress();

        };

        img.onerror = reject;

        img.src = URL.createObjectURL(file);

    });

}


/* ==========================================
   RESULT INFO
========================================== */

function showResult() {

    let html = "";

    compressedFiles.forEach((item) => {

        html += `
        <div class="resultCard">

        <b>${item.name}</b><br>

        Original :
        ${(item.original / 1024).toFixed(2)} KB

        <br>

        Compressed :
        ${(item.compressed / 1024).toFixed(2)} KB

        </div>

        <hr>
        `;

    });

    resultInfo.innerHTML = html;

}

/* ==========================================
   MI7 Image Tools
   Compress.js V2
   PART 3
========================================== */

/* ---------- DOWNLOAD ---------- */

downloadBtn.addEventListener("click", async () => {

    if (compressedFiles.length === 0) {

        alert("Please compress image first.");
        return;

    }

    // Single Image
    if (compressedFiles.length === 1) {

        const item = compressedFiles[0];

        const url = URL.createObjectURL(item.blob);

        const a = document.createElement("a");

        a.href = url;
        a.download = "MI7-" + item.name;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);

        return;

    }

    // Multiple Images ZIP

    const zip = new JSZip();

    compressedFiles.forEach((item) => {

        zip.file("MI7-" + item.name, item.blob);

    });

    resultInfo.innerHTML = "Preparing ZIP...";

    const content = await zip.generateAsync({

        type: "blob"

    });

    const zipURL = URL.createObjectURL(content);

    const link = document.createElement("a");

    link.href = zipURL;
    link.download = "MI7-Compressed-Images.zip";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(zipURL);

});


/* ---------- SHARE ---------- */

shareBtn.addEventListener("click", async () => {

    if (compressedFiles.length !== 1) {

        alert("Share works only for one image.");

        return;

    }

    if (!navigator.share) {

        alert("Sharing is not supported.");

        return;

    }

    const item = compressedFiles[0];

    const file = new File(

        [item.blob],

        item.name,

        {

            type: "image/jpeg"

        }

    );

    try {

        await navigator.share({

            title: "MI7 Image Tools",

            text: "Compressed using MI7 Image Tools",

            files: [file]

        });

    } catch (e) {

        console.log(e);

    }

});


/* ---------- READY ---------- */

console.log("✅ MI7 Compress Tool V2 Loaded");



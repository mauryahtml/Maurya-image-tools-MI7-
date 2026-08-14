/* =========================================================
   MI7 - REDUCE IMAGE SIZE IN MB
   compress-mb.js
   PART 1
========================================================= */


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let selectedImages = [];

let compressedResults = [];

let imageCounter = 0;


/* =========================================================
   GET HTML ELEMENTS
========================================================= */

const imageInput =
    document.getElementById("imageInput");

const imageGrid =
    document.getElementById("imageGrid");

const emptyState =
    document.getElementById("emptyState");

const targetSizeInput =
    document.getElementById("targetSize");

const compressBtn =
    document.getElementById("compressBtn");

const resultGrid =
    document.getElementById("resultGrid");

const resetBtn =
    document.getElementById("resetBtn");

const statusMessage =
    document.getElementById("statusMessage");

const toast =
    document.getElementById("toast");

const menuBtn =
    document.getElementById("menuBtn");

const sideMenu =
    document.getElementById("sideMenu");

const closeMenuBtn =
    document.getElementById("closeMenu");

const overlay =
    document.getElementById("overlay");


/* =========================================================
   IMAGE SELECT
========================================================= */

if (imageInput) {

    imageInput.addEventListener(
        "change",
        handleImageSelection
    );

}


/* =========================================================
   HANDLE MULTIPLE IMAGE SELECTION
========================================================= */

function handleImageSelection(event) {

    const files =
        Array.from(
            event.target.files || []
        );


    if (!files.length) {

        return;

    }


    const validFiles =
        files.filter(
            file =>
                file.type.startsWith(
                    "image/"
                )
        );


    if (!validFiles.length) {

        showStatus(
            "Please select valid image files.",
            "error"
        );

        return;

    }


    validFiles.forEach(
        file => {

            addSelectedImage(
                file
            );

        }
    );


    updateImageUI();


    /*
       Allows the same file to be selected
       again later.
    */

    imageInput.value = "";

}


/* =========================================================
   ADD SELECTED IMAGE
========================================================= */

function addSelectedImage(file) {

    const id =
        "mb-image-" +
        Date.now() +
        "-" +
        imageCounter++;


    const previewUrl =
        URL.createObjectURL(
            file
        );


    const imageData = {

        id: id,

        file: file,

        fileName:
            file.name,

        type:
            file.type,

        originalSize:
            file.size,

        previewUrl:
            previewUrl

    };


    selectedImages.push(
        imageData
    );

}


/* =========================================================
   UPDATE IMAGE UI
========================================================= */

function updateImageUI() {

    if (!imageGrid) {

        return;

    }


    imageGrid.innerHTML =
        "";


    if (
        !selectedImages.length
    ) {

        if (emptyState) {

            emptyState.classList.remove(
                "hidden"
            );

        }


        if (compressBtn) {

            compressBtn.disabled =
                true;

        }


        return;

    }


    if (emptyState) {

        emptyState.classList.add(
            "hidden"
        );

    }


    selectedImages.forEach(
        item => {

            renderSelectedImage(
                item
            );

        }
    );


    if (compressBtn) {

        compressBtn.disabled =
            false;

    }

}


/* =========================================================
   RENDER SELECTED IMAGE
========================================================= */

function renderSelectedImage(
    item
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "mi7-image-card";


    card.dataset.id =
        item.id;



    /* =========================================
       IMAGE PREVIEW
    ========================================== */

    const preview =
        document.createElement(
            "div"
        );


    preview.className =
        "mi7-image-preview";


    const img =
        document.createElement(
            "img"
        );


    img.src =
        item.previewUrl;


    img.alt =
        item.fileName;


    preview.appendChild(
        img
    );



    /* =========================================
       FILE NAME
    ========================================== */

    const name =
        document.createElement(
            "div"
        );


    name.className =
        "mi7-image-name";


    name.textContent =
        item.fileName;



    /* =========================================
       IMAGE DETAILS
    ========================================== */

    const details =
        document.createElement(
            "div"
        );


    details.className =
        "mi7-image-details";


    details.innerHTML = `

        <span>
            Size:
            ${formatBytes(
                item.originalSize
            )}
        </span>

        <span
            class="mi7-dimension-info"
            data-image-id="${item.id}"
        >
            Reading dimensions...
        </span>

        <span>
            Format:
            ${getReadableFormat(
                item.type
            )}
        </span>

    `;



    /* =========================================
       REMOVE BUTTON
    ========================================== */

    const removeBtn =
        document.createElement(
            "button"
        );


    removeBtn.type =
        "button";


    removeBtn.className =
        "mi7-remove-image";


    removeBtn.innerHTML =
        "✕";


    removeBtn.setAttribute(
        "aria-label",
        "Remove image"
    );


    removeBtn.addEventListener(
        "click",
        function () {

            removeSelectedImage(
                item.id
            );

        }
    );



    /* =========================================
       CARD STRUCTURE
    ========================================== */

    card.appendChild(
        preview
    );


    card.appendChild(
        name
    );


    card.appendChild(
        details
    );


    card.appendChild(
        removeBtn
    );


    imageGrid.appendChild(
        card
    );



    /*
       Read actual image dimensions
       after preview is created.
    */

    readImageDimensions(
        item,
        details
    );

}


/* =========================================================
   READ IMAGE DIMENSIONS
========================================================= */

function readImageDimensions(
    item,
    detailsElement
) {

    const image =
        new Image();


    image.onload =
        function () {

            const dimensionElement =
                detailsElement.querySelector(
                    ".mi7-dimension-info"
                );


            if (
                dimensionElement
            ) {

                dimensionElement.textContent =
                    "Dimensions: " +
                    image.naturalWidth +
                    " × " +
                    image.naturalHeight +
                    " px";

            }

        };


    image.onerror =
        function () {

            const dimensionElement =
                detailsElement.querySelector(
                    ".mi7-dimension-info"
                );


            if (
                dimensionElement
            ) {

                dimensionElement.textContent =
                    "Dimensions unavailable";

            }

        };


    image.src =
        item.previewUrl;

}


/* =========================================================
   REMOVE SELECTED IMAGE
========================================================= */

function removeSelectedImage(
    id
) {

    const index =
        selectedImages.findIndex(
            item =>
                item.id === id
        );


    if (
        index === -1
    ) {

        return;

    }


    const item =
        selectedImages[index];


    if (
        item.previewUrl
    ) {

        URL.revokeObjectURL(
            item.previewUrl
        );

    }


    selectedImages.splice(
        index,
        1
    );


    updateImageUI();


    showToast(
        "Image removed."
    );

}


/* =========================================================
   FORMAT BYTES
========================================================= */

function formatBytes(
    bytes
) {

    if (
        !Number.isFinite(bytes) ||
        bytes <= 0
    ) {

        return "0 B";

    }


    const units = [
        "B",
        "KB",
        "MB",
        "GB"
    ];


    const index =
        Math.min(
            Math.floor(
                Math.log(bytes) /
                Math.log(1024)
            ),
            units.length - 1
        );


    const value =
        bytes /
        Math.pow(
            1024,
            index
        );


    if (
        index === 0
    ) {

        return (
            Math.round(value) +
            " " +
            units[index]
        );

    }


    return (
        value.toFixed(2) +
        " " +
        units[index]
    );

}


/* =========================================================
   MB → BYTES
========================================================= */

function mbToBytes(
    mb
) {

    return (
        Number(mb) *
        1024 *
        1024
    );

}


/* =========================================================
   GET TARGET MB
========================================================= */

function getTargetBytes() {

    let targetMB =
        Number(
            targetSizeInput
                ? targetSizeInput.value
                : 2
        );


    if (
        !Number.isFinite(
            targetMB
        ) ||
        targetMB <= 0
    ) {

        targetMB =
            2;

    }


    /*
       Prevent an unnecessarily huge value.
    */

    if (
        targetMB > 50
    ) {

        targetMB =
            50;

    }


    if (
        targetSizeInput
    ) {

        targetSizeInput.value =
            targetMB;

    }


    return mbToBytes(
        targetMB
    );

}


/* =========================================================
   READABLE IMAGE FORMAT
========================================================= */

function getReadableFormat(
    type
) {

    if (
        type ===
        "image/jpeg"
    ) {

        return "JPG";

    }


    if (
        type ===
        "image/png"
    ) {

        return "PNG";

    }


    if (
        type ===
        "image/webp"
    ) {

        return "WEBP";

    }


    if (
        type ===
        "image/gif"
    ) {

        return "GIF";

    }


    return "IMAGE";

}


/* =========================================================
   END PART 1
========================================================= */

/* =========================================================
   MI7 - REDUCE IMAGE SIZE IN MB
   compress-mb.js
   PART 2
========================================================= */


/* =========================================================
   COMPRESS BUTTON
========================================================= */

if (compressBtn) {

    compressBtn.addEventListener(
        "click",
        compressAllImages
    );

}


/* =========================================================
   COMPRESS ALL IMAGES
========================================================= */

async function compressAllImages() {

    if (
        !selectedImages.length
    ) {

        showToast(
            "Please select at least one image."
        );

        return;

    }


    const targetBytes =
        getTargetBytes();


    if (
        !targetBytes ||
        targetBytes <= 0
    ) {

        showStatus(
            "Please enter a valid target MB size.",
            "error"
        );

        return;

    }


    /*
       Disable button while processing.
    */

    compressBtn.disabled =
        true;


    showStatus(
        "Compressing images...",
        "working"
    );


    /*
       Remove previous results.
    */

    clearCompressedResults();


    let successCount =
        0;


    let failedCount =
        0;


    for (
        let i = 0;
        i < selectedImages.length;
        i++
    ) {

        const item =
            selectedImages[i];


        showStatus(
            "Compressing image " +
            (i + 1) +
            " of " +
            selectedImages.length +
            "...",
            "working"
        );


        try {

            const result =
                await compressImageToTarget(
                    item,
                    targetBytes
                );


            compressedResults.push(
                result
            );


            renderResultCard(
                result
            );


            successCount++;


        } catch (error) {

            console.error(
                "MI7 compression error:",
                error
            );


            const errorResult = {

                id:
                    item.id,

                fileName:
                    item.fileName,

                error:
                    true,

                errorMessage:
                    "This image could not be compressed."

            };


            compressedResults.push(
                errorResult
            );


            renderResultCard(
                errorResult
            );


            failedCount++;

        }

    }


    /*
       Final message.
    */

    if (
        failedCount === 0
    ) {

        showStatus(
            "✅ Compression completed successfully for " +
            successCount +
            " image" +
            (
                successCount === 1
                    ? ""
                    : "s"
            ) +
            ".",
            "success"
        );


        showToast(
            "All images compressed successfully."
        );

    } else {

        showStatus(
            "Compression completed. " +
            successCount +
            " successful, " +
            failedCount +
            " failed.",
            "success"
        );

    }


    compressBtn.disabled =
        false;

}


/* =========================================================
   COMPRESS ONE IMAGE
========================================================= */

async function compressImageToTarget(
    item,
    targetBytes
) {

    const sourceImage =
        await loadImage(
            item.previewUrl
        );


    const originalWidth =
        sourceImage.naturalWidth;


    const originalHeight =
        sourceImage.naturalHeight;


    if (
        !originalWidth ||
        !originalHeight
    ) {

        throw new Error(
            "Invalid image dimensions."
        );

    }


    /*
       MB compression works best with JPEG
       because JPEG quality can be adjusted.
    */

    const outputType =
        "image/jpeg";


    const outputExtension =
        "jpg";


    /*
       Preserve the original dimensions first.
    */

    let width =
        originalWidth;


    let height =
        originalHeight;


    /*
       First attempt:
       compress using JPEG quality.
    */

    let blob =
        await canvasToBlob(
            sourceImage,
            width,
            height,
            outputType,
            0.90
        );


    /*
       If already smaller than target,
       don't unnecessarily enlarge it.
    */

    if (
        blob.size <= targetBytes
    ) {

        return createCompressionResult(
            item,
            blob,
            width,
            height,
            outputExtension
        );

    }


    /*
       Binary search for best JPEG quality.
    */

    let low =
        0.10;


    let high =
        0.90;


    let bestBlob =
        null;


    for (
        let i = 0;
        i < 8;
        i++
    ) {

        const quality =
            (
                low +
                high
            ) / 2;


        const testBlob =
            await canvasToBlob(
                sourceImage,
                width,
                height,
                outputType,
                quality
            );


        if (
            testBlob.size <=
            targetBytes
        ) {

            bestBlob =
                testBlob;


            low =
                quality;

        } else {

            high =
                quality;

        }

    }


    /*
       If quality alone was enough.
    */

    if (
        bestBlob
    ) {

        return createCompressionResult(
            item,
            bestBlob,
            width,
            height,
            outputExtension
        );

    }


    /*
       If target is very small,
       reduce dimensions gradually.
    */

    let scale =
        0.90;


    for (
        let attempt = 0;
        attempt < 12;
        attempt++
    ) {

        width =
            Math.max(
                120,
                Math.round(
                    originalWidth *
                    scale
                )
            );


        height =
            Math.max(
                120,
                Math.round(
                    originalHeight *
                    scale
                )
            );


        /*
           Start with medium quality.
        */

        low =
            0.10;


        high =
            0.85;


        bestBlob =
            null;


        for (
            let i = 0;
            i < 8;
            i++
        ) {

            const quality =
                (
                    low +
                    high
                ) / 2;


            const testBlob =
                await canvasToBlob(
                    sourceImage,
                    width,
                    height,
                    outputType,
                    quality
                );


            if (
                testBlob.size <=
                targetBytes
            ) {

                bestBlob =
                    testBlob;


                low =
                    quality;

            } else {

                high =
                    quality;

            }

        }


        if (
            bestBlob
        ) {

            return createCompressionResult(
                item,
                bestBlob,
                width,
                height,
                outputExtension
            );

        }


        /*
           Reduce dimensions further.
        */

        scale *=
            0.82;

    }


    /*
       Final attempt with small dimensions
       and low quality.
    */

    width =
        Math.max(
            100,
            Math.round(
                originalWidth *
                0.20
            )
        );


    height =
        Math.max(
            100,
            Math.round(
                originalHeight *
                0.20
            )
        );


    blob =
        await canvasToBlob(
            sourceImage,
            width,
            height,
            outputType,
            0.10
        );


    /*
       Return the closest result even if
       exact target cannot be reached.
    */

    return createCompressionResult(
        item,
        blob,
        width,
        height,
        outputExtension
    );

}


/* =========================================================
   LOAD IMAGE
========================================================= */

function loadImage(
    source
) {

    return new Promise(
        function (
            resolve,
            reject
        ) {

            const image =
                new Image();


            image.onload =
                function () {

                    resolve(
                        image
                    );

                };


            image.onerror =
                function () {

                    reject(
                        new Error(
                            "Unable to load image."
                        )
                    );

                };


            image.src =
                source;

        }
    );

}


/* =========================================================
   CANVAS → BLOB
========================================================= */

function canvasToBlob(
    image,
    width,
    height,
    type,
    quality
) {

    return new Promise(
        function (
            resolve,
            reject
        ) {

            const canvas =
                document.createElement(
                    "canvas"
                );


            canvas.width =
                width;


            canvas.height =
                height;


            const context =
                canvas.getContext(
                    "2d"
                );


            if (!context) {

                reject(
                    new Error(
                        "Canvas is not supported."
                    )
                );

                return;

            }


            /*
               White background prevents transparent
               PNG areas becoming black when converted
               to JPEG.
            */

            context.fillStyle =
                "#ffffff";


            context.fillRect(
                0,
                0,
                width,
                height
            );


            context.imageSmoothingEnabled =
                true;


            context.imageSmoothingQuality =
                "high";


            context.drawImage(
                image,
                0,
                0,
                width,
                height
            );


            canvas.toBlob(
                function (blob) {

                    if (!blob) {

                        reject(
                            new Error(
                                "Unable to create image."
                            )
                        );

                        return;

                    }


                    resolve(
                        blob
                    );

                },

                type,

                quality
            );

        }
    );

}


/* =========================================================
   CREATE COMPRESSION RESULT
========================================================= */

function createCompressionResult(
    item,
    blob,
    width,
    height,
    extension
) {

    const url =
        URL.createObjectURL(
            blob
        );


    const originalSize =
        item.originalSize;


    const compressedSize =
        blob.size;


    const savedPercent =
        originalSize > 0
            ? (
                (
                    originalSize -
                    compressedSize
                ) /
                originalSize
            ) * 100
            : 0;


    const safeName =
        item.fileName
            .replace(
                /\.[^/.]+$/,
                ""
            );


    const outputName =
        safeName +
        "-compressed." +
        extension;


    return {

        id:
            item.id,

        fileName:
            item.fileName,

        outputName:
            outputName,

        blob:
            blob,

        url:
            url,

        originalSize:
            originalSize,

        compressedSize:
            compressedSize,

        savedPercent:
            Math.max(
                0,
                savedPercent
            ),

        width:
            width,

        height:
            height

    };

}


/* =========================================================
   CLEAR OLD RESULTS
========================================================= */

function clearCompressedResults() {

    compressedResults.forEach(
        result => {

            if (
                result &&
                result.url
            ) {

                URL.revokeObjectURL(
                    result.url
                );

            }

        }
    );


    compressedResults =
        [];


    if (resultGrid) {

        resultGrid.innerHTML =
            "";

    }

}


/* =========================================================
   END PART 2
========================================================= */

/* =========================================================
   MI7 - REDUCE IMAGE SIZE IN MB
   compress-mb.js
   PART 3 — FINAL
========================================================= */


/* =========================================================
   RENDER RESULT CARD
========================================================= */

function renderResultCard(result) {

    if (!resultGrid) {
        return;
    }


    const card =
        document.createElement("div");


    card.className =
        "mi7-result-item";


    card.dataset.id =
        result.id || "";



    /* =====================================================
       ERROR RESULT
    ===================================================== */

    if (result.error) {

        card.innerHTML = `

            <div class="mi7-result-details">

                <strong>
                    ${escapeHTML(
                        result.fileName
                    )}
                </strong>

                <br><br>

                ❌
                ${escapeHTML(
                    result.errorMessage
                )}

            </div>

        `;


        resultGrid.appendChild(card);

        return;
    }



    /* =====================================================
       RESULT PREVIEW
    ===================================================== */

    const preview =
        document.createElement("div");


    preview.className =
        "mi7-result-preview";


    const image =
        document.createElement("img");


    image.src =
        result.url;


    image.alt =
        result.outputName;


    image.loading =
        "lazy";


    preview.appendChild(image);



    /* =====================================================
       RESULT NAME
    ===================================================== */

    const name =
        document.createElement("div");


    name.className =
        "mi7-result-name";


    name.textContent =
        result.outputName;



    /* =====================================================
       RESULT DETAILS
    ===================================================== */

    const details =
        document.createElement("div");


    details.className =
        "mi7-result-details";


    details.innerHTML = `

        <strong>
            Original:
        </strong>

        ${formatBytes(
            result.originalSize
        )}

        <br>

        <strong>
            Compressed:
        </strong>

        ${formatBytes(
            result.compressedSize
        )}

        <br>

        <strong>
            Saved:
        </strong>

        ${result.savedPercent.toFixed(1)}%

        <br>

        <strong>
            Dimensions:
        </strong>

        ${result.width}
        ×
        ${result.height}
        px

    `;



    /* =====================================================
       TARGET INFORMATION
    ===================================================== */

    const targetInfo =
        document.createElement("div");


    targetInfo.className =
        "mi7-result-target";


    targetInfo.textContent =
        "Result size: " +
        formatBytes(
            result.compressedSize
        );



    /* =====================================================
       COMPRESSED BADGE
    ===================================================== */

    const badge =
        document.createElement("span");


    badge.className =
        "mi7-saved";


    badge.textContent =
        "✓ Compressed";



    /* =====================================================
       ACTION BUTTONS
    ===================================================== */

    const actions =
        document.createElement("div");


    actions.className =
        "mi7-result-actions";



    /* =====================================================
       DOWNLOAD BUTTON
    ===================================================== */

    const downloadButton =
        document.createElement("button");


    downloadButton.type =
        "button";


    downloadButton.className =
        "mi7-download-btn";


    downloadButton.innerHTML =
        "⬇️ Download";


    downloadButton.addEventListener(
        "click",
        function () {

            downloadResult(
                result
            );

        }
    );



    /* =====================================================
       SHARE BUTTON
    ===================================================== */

    const shareButton =
        document.createElement("button");


    shareButton.type =
        "button";


    shareButton.className =
        "mi7-share-btn";


    shareButton.innerHTML =
        "📤 Share";


    shareButton.addEventListener(
        "click",
        function () {

            shareResult(
                result
            );

        }
    );



    actions.appendChild(
        downloadButton
    );


    actions.appendChild(
        shareButton
    );



    /* =====================================================
       ADD CARD CONTENT
    ===================================================== */

    card.appendChild(
        preview
    );


    card.appendChild(
        name
    );


    card.appendChild(
        details
    );


    card.appendChild(
        targetInfo
    );


    card.appendChild(
        badge
    );


    card.appendChild(
        actions
    );


    resultGrid.appendChild(
        card
    );

}



/* =========================================================
   DOWNLOAD RESULT
========================================================= */

function downloadResult(result) {

    if (
        !result ||
        !result.blob
    ) {

        showToast(
            "Download is not available."
        );

        return;

    }


    try {

        const link =
            document.createElement("a");


        link.href =
            result.url;


        link.download =
            result.outputName;


        link.style.display =
            "none";


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        showToast(
            "Image downloaded successfully."
        );


    } catch (error) {

        console.error(
            "MI7 download error:",
            error
        );


        showToast(
            "Unable to download the image."
        );

    }

}



/* =========================================================
   SHARE RESULT
========================================================= */

async function shareResult(result) {

    if (
        !result ||
        !result.blob
    ) {

        showToast(
            "Share is not available."
        );

        return;

    }


    /*
       File sharing works on supported
       mobile browsers.
    */

    if (
        navigator.share &&
        navigator.canShare
    ) {

        try {

            const file =
                new File(
                    [
                        result.blob
                    ],

                    result.outputName,

                    {
                        type:
                            result.blob.type
                    }
                );


            const shareData = {

                files: [
                    file
                ],

                title:
                    "Compressed Image",

                text:
                    "Compressed with Maurya Image Tools (MI7)"

            };


            if (
                navigator.canShare(
                    shareData
                )
            ) {

                await navigator.share(
                    shareData
                );


                showToast(
                    "Share completed."
                );


                return;

            }

        } catch (error) {

            /*
               User cancelled the native
               share sheet.
            */

            if (
                error &&
                error.name ===
                    "AbortError"
            ) {

                return;

            }


            console.error(
                "MI7 share error:",
                error
            );

        }

    }


    /*
       Browser does not support file sharing.
    */

    showToast(
        "Direct sharing is not supported by this browser. Download the image and share it from Gallery."
    );

}



/* =========================================================
   RESET BUTTON
========================================================= */

if (resetBtn) {

    resetBtn.addEventListener(
        "click",
        resetEverything
    );

}



/* =========================================================
   RESET EVERYTHING
========================================================= */

function resetEverything() {

    /*
       Release selected-image preview URLs.
    */

    selectedImages.forEach(
        item => {

            if (
                item.previewUrl
            ) {

                URL.revokeObjectURL(
                    item.previewUrl
                );

            }

        }
    );


    /*
       Release compressed result URLs.
    */

    compressedResults.forEach(
        result => {

            if (
                result &&
                result.url
            ) {

                URL.revokeObjectURL(
                    result.url
                );

            }

        }
    );


    selectedImages =
        [];


    compressedResults =
        [];


    if (imageInput) {

        imageInput.value =
            "";

    }


    if (imageGrid) {

        imageGrid.innerHTML =
            "";

    }


    if (resultGrid) {

        resultGrid.innerHTML =
            "";

    }


    if (emptyState) {

        emptyState.classList.remove(
            "hidden"
        );

        emptyState.textContent =
            "No images selected yet.";

    }


    if (targetSizeInput) {

        targetSizeInput.value =
            "2";

    }


    if (compressBtn) {

        compressBtn.disabled =
            true;

    }


    if (statusMessage) {

        statusMessage.className =
            "mi7-status";

        statusMessage.textContent =
            "";

    }


    showToast(
        "Tool has been reset."
    );

}



/* =========================================================
   STATUS MESSAGE
========================================================= */

function showStatus(
    message,
    type = ""
) {

    if (!statusMessage) {

        return;

    }


    statusMessage.className =
        "mi7-status";


    if (type) {

        statusMessage.classList.add(
            type
        );

    }


    statusMessage.textContent =
        message;

}



/* =========================================================
   TOAST MESSAGE
========================================================= */

let toastTimer =
    null;


function showToast(message) {

    if (!toast) {

        return;

    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    if (toastTimer) {

        clearTimeout(
            toastTimer
        );

    }


    toastTimer =
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },

            2800
        );

}



/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}



/* =========================================================
   OPEN SIDE MENU
========================================================= */

function openMenu() {

    if (sideMenu) {

        sideMenu.classList.add(
            "active"
        );

    }


    if (overlay) {

        overlay.classList.add(
            "active"
        );

    }


    if (menuBtn) {

        menuBtn.setAttribute(
            "aria-expanded",
            "true"
        );

    }

}



/* =========================================================
   CLOSE SIDE MENU
========================================================= */

function closeMenu() {

    if (sideMenu) {

        sideMenu.classList.remove(
            "active"
        );

    }


    if (overlay) {

        overlay.classList.remove(
            "active"
        );

    }


    if (menuBtn) {

        menuBtn.setAttribute(
            "aria-expanded",
            "false"
        );

    }

}



/* =========================================================
   MENU BUTTON
========================================================= */

if (menuBtn) {

    menuBtn.addEventListener(
        "click",
        openMenu
    );

}



/* =========================================================
   CLOSE MENU BUTTON
========================================================= */

if (closeMenuBtn) {

    closeMenuBtn.addEventListener(
        "click",
        closeMenu
    );

}



/* =========================================================
   OVERLAY
========================================================= */

if (overlay) {

    overlay.addEventListener(
        "click",
        closeMenu
    );

}



/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Escape"
        ) {

            closeMenu();

        }

    }
);



/* =========================================================
   CLOSE MENU AFTER LINK CLICK
========================================================= */

if (sideMenu) {

    sideMenu
        .querySelectorAll("a")
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    closeMenu
                );

            }
        );

}



/* =========================================================
   TARGET SIZE VALIDATION
========================================================= */

if (targetSizeInput) {

    targetSizeInput.addEventListener(
        "change",
        function () {

            let value =
                Number(
                    targetSizeInput.value
                );


            if (
                !Number.isFinite(value) ||
                value < 0.05
            ) {

                value =
                    0.05;

            }


            if (
                value > 50
            ) {

                value =
                    50;

            }


            /*
               Keep two decimal places
               only when required.
            */

            targetSizeInput.value =
                Number(
                    value.toFixed(2)
                );

        }
    );

}



/* =========================================================
   CLEANUP WHEN PAGE CLOSES
========================================================= */

window.addEventListener(
    "beforeunload",
    function () {

        selectedImages.forEach(
            item => {

                if (
                    item.previewUrl
                ) {

                    URL.revokeObjectURL(
                        item.previewUrl
                    );

                }

            }
        );


        compressedResults.forEach(
            result => {

                if (
                    result &&
                    result.url
                ) {

                    URL.revokeObjectURL(
                        result.url
                    );

                }

            }
        );

    }
);



/* =========================================================
   END OF COMPRESS-MB.JS
========================================================= */

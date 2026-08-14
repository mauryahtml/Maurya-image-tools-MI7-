/* =========================================================
   MI7 REDUCE IMAGE SIZE IN KB
   COMPRESS.JS — V6 FINAL
   PART 1
========================================================= */

"use strict";


/* =========================================================
   GLOBAL DATA
========================================================= */

let selectedImages = [];

let compressedResults = [];



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


const resetBtn =
    document.getElementById("resetBtn");


const resultGrid =
    document.getElementById("resultGrid");


const statusMessage =
    document.getElementById("statusMessage");


const toast =
    document.getElementById("toast");


const menuBtn =
    document.getElementById("menuBtn");


const closeMenuBtn =
    document.getElementById("closeMenu");


const sideMenu =
    document.getElementById("sideMenu");


const overlay =
    document.getElementById("overlay");



/* =========================================================
   CHECK REQUIRED ELEMENTS
========================================================= */

if (!imageInput) {

    console.error(
        "MI7: imageInput not found."
    );

}


if (!imageGrid) {

    console.error(
        "MI7: imageGrid not found."
    );

}


if (!compressBtn) {

    console.error(
        "MI7: compressBtn not found."
    );

}



/* =========================================================
   INITIAL STATE
========================================================= */

function setInitialState() {

    if (imageGrid) {

        imageGrid.innerHTML = "";

    }


    if (resultGrid) {

        resultGrid.innerHTML = "";

    }


    if (emptyState) {

        emptyState.classList.remove(
            "hidden"
        );

        emptyState.textContent =
            "No images selected yet.";

    }


    if (compressBtn) {

        compressBtn.disabled = true;

    }


    if (statusMessage) {

        statusMessage.className =
            "mi7-status";

        statusMessage.textContent =
            "";

    }

}


setInitialState();



/* =========================================================
   FILE SELECT
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


    /*
       Only image files.
    */

    const imageFiles =
        files.filter(
            file =>
                file.type.startsWith(
                    "image/"
                )
        );


    if (!imageFiles.length) {

        showStatus(
            "Please select JPG, PNG or WEBP images.",
            "error"
        );

        return;

    }


    /*
       Add newly selected files.
       Existing selected images remain.
    */

    imageFiles.forEach(
        file => {

            const alreadyExists =
                selectedImages.some(
                    item =>
                        item.file.name ===
                            file.name &&
                        item.file.size ===
                            file.size &&
                        item.file.lastModified ===
                            file.lastModified
                );


            if (!alreadyExists) {

                selectedImages.push({

                    id:
                        createImageId(),

                    file:
                        file,

                    previewUrl:
                        URL.createObjectURL(
                            file
                        ),

                    width:
                        0,

                    height:
                        0,

                    type:
                        file.type,

                    originalSize:
                        file.size,

                    image:
                        null

                });

            }

        }
    );


    /*
       Reset old results because
       selection changed.
    */

    clearResultsOnly();


    renderImageGrid();

    updateToolState();


    /*
       Allow selecting the same file
       again later.
    */

    event.target.value = "";

}



/* =========================================================
   CREATE UNIQUE IMAGE ID
========================================================= */

function createImageId() {

    return (
        "mi7-" +
        Date.now().toString(36) +
        "-" +
        Math.random()
            .toString(36)
            .slice(2, 9)
    );

}



/* =========================================================
   RENDER IMAGE GRID
========================================================= */

function renderImageGrid() {

    if (!imageGrid) {

        return;

    }


    imageGrid.innerHTML = "";


    selectedImages.forEach(
        item => {

            createImageCard(item);

        }
    );


    if (emptyState) {

        if (selectedImages.length) {

            emptyState.classList.add(
                "hidden"
            );

        } else {

            emptyState.classList.remove(
                "hidden"
            );

        }

    }

}



/* =========================================================
   CREATE SMALL IMAGE CARD
========================================================= */

function createImageCard(item) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "mi7-image-item";


    card.dataset.id =
        item.id;



    /* IMAGE PREVIEW */

    const thumbWrap =
        document.createElement(
            "div"
        );


    thumbWrap.className =
        "mi7-thumb-wrap";


    const image =
        document.createElement(
            "img"
        );


    image.className =
        "mi7-thumb";


    image.src =
        item.previewUrl;


    image.alt =
        item.file.name;


    thumbWrap.appendChild(
        image
    );



    /* FILE NAME */

    const fileName =
        document.createElement(
            "div"
        );


    fileName.className =
        "mi7-image-name";


    fileName.textContent =
        item.file.name;



    /* DETAILS */

    const details =
        document.createElement(
            "div"
        );


    details.className =
        "mi7-image-details";


    details.innerHTML =

        "<strong>Size:</strong> " +
        formatBytes(
            item.originalSize
        ) +
        "<br>" +

        "<strong>Dimensions:</strong> " +
        "Loading..." +
        "<br>" +

        "<strong>Format:</strong> " +
        getFormatName(
            item.type
        );



    /* REMOVE */

    const removeButton =
        document.createElement(
            "button"
        );


    removeButton.type =
        "button";


    removeButton.className =
        "mi7-remove-image";


    removeButton.textContent =
        "✕ Remove";


    removeButton.addEventListener(
        "click",
        () => {

            removeSelectedImage(
                item.id
            );

        }
    );



    card.appendChild(
        thumbWrap
    );


    card.appendChild(
        fileName
    );


    card.appendChild(
        details
    );


    card.appendChild(
        removeButton
    );


    imageGrid.appendChild(
        card
    );


    /*
       Load dimensions.
    */

    loadImageDimensions(
        item,
        details
    );

}



/* =========================================================
   LOAD IMAGE DIMENSIONS
========================================================= */

function loadImageDimensions(
    item,
    detailsElement
) {

    const image =
        new Image();


    image.onload =
        function () {

            item.width =
                image.naturalWidth;

            item.height =
                image.naturalHeight;

            item.image =
                image;


            detailsElement.innerHTML =

                "<strong>Size:</strong> " +
                formatBytes(
                    item.originalSize
                ) +
                "<br>" +

                "<strong>Dimensions:</strong> " +
                item.width +
                " × " +
                item.height +
                " px" +
                "<br>" +

                "<strong>Format:</strong> " +
                getFormatName(
                    item.type
                );

        };


    image.onerror =
        function () {

            detailsElement.innerHTML =

                "<strong>Size:</strong> " +
                formatBytes(
                    item.originalSize
                ) +
                "<br>" +

                "<strong>Dimensions:</strong> " +
                "Unable to read" +
                "<br>" +

                "<strong>Format:</strong> " +
                getFormatName(
                    item.type
                );

        };


    image.src =
        item.previewUrl;

}



/* =========================================================
   GET FORMAT NAME
========================================================= */

function getFormatName(type) {

    switch (type) {

        case "image/jpeg":
            return "JPG";

        case "image/png":
            return "PNG";

        case "image/webp":
            return "WEBP";

        default:
            return "IMAGE";

    }

}



/* =========================================================
   FORMAT FILE SIZE
========================================================= */

function formatBytes(bytes) {

    if (!Number.isFinite(bytes)) {

        return "0 KB";

    }


    if (bytes < 1024) {

        return bytes + " B";

    }


    const kb =
        bytes / 1024;


    if (kb < 1024) {

        return kb.toFixed(1) +
            " KB";

    }


    const mb =
        kb / 1024;


    return mb.toFixed(2) +
        " MB";

}



/* =========================================================
   REMOVE ONE SELECTED IMAGE
========================================================= */

function removeSelectedImage(id) {

    const index =
        selectedImages.findIndex(
            item =>
                item.id === id
        );


    if (index === -1) {

        return;

    }


    const item =
        selectedImages[index];


    if (item.previewUrl) {

        URL.revokeObjectURL(
            item.previewUrl
        );

    }


    selectedImages.splice(
        index,
        1
    );


    clearResultsOnly();


    renderImageGrid();

    updateToolState();


    showToast(
        "Image removed."
    );

}



/* =========================================================
   UPDATE TOOL STATE
========================================================= */

function updateToolState() {

    if (!compressBtn) {

        return;

    }


    compressBtn.disabled =
        selectedImages.length === 0;

}



/* =========================================================
   CLEAR ONLY RESULTS
========================================================= */

function clearResultsOnly() {

    compressedResults =
        [];


    if (resultGrid) {

        resultGrid.innerHTML =
            "";

    }


    if (statusMessage) {

        statusMessage.className =
            "mi7-status";

        statusMessage.textContent =
            "";

    }

}



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
   RESET BUTTON
========================================================= */

if (resetBtn) {

    resetBtn.addEventListener(
        "click",
        resetEverything
    );

}



/* =========================================================
   END PART 1
========================================================= */

/* =========================================================
   MI7 REDUCE IMAGE SIZE IN KB
   COMPRESS.JS — V6 FINAL
   PART 2
========================================================= */


/* =========================================================
   COMPRESS ALL SELECTED IMAGES
========================================================= */

async function compressAllImages() {

    if (!selectedImages.length) {

        showStatus(
            "Please select at least one image first.",
            "error"
        );

        return;

    }


    let targetKB =
        Number(
            targetSizeInput
                ? targetSizeInput.value
                : 100
        );


    if (!Number.isFinite(targetKB) ||
        targetKB <= 0) {

        targetKB = 100;

        if (targetSizeInput) {

            targetSizeInput.value =
                "100";

        }

    }


    const targetBytes =
        targetKB * 1024;


    compressBtn.disabled =
        true;


    showStatus(
        "Compressing images... Please wait.",
        "loading"
    );


    resultGrid.innerHTML =
        "";


    compressedResults =
        [];


    try {

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
                "loading"
            );


            try {

                const result =
                    await compressSingleImage(
                        item,
                        targetBytes
                    );


                compressedResults.push(
                    result
                );


                renderResultCard(
                    result
                );


            } catch (error) {

                console.error(
                    "MI7 compression error:",
                    error
                );


                const failedResult = {

                    id:
                        item.id,

                    fileName:
                        item.file.name,

                    originalSize:
                        item.originalSize,

                    error:
                        true,

                    errorMessage:
                        "This image could not be compressed."

                };


                compressedResults.push(
                    failedResult
                );


                renderResultCard(
                    failedResult
                );

            }

        }


        showStatus(
            "✅ Compression completed successfully.",
            "success"
        );


        showToast(
            "All selected images have been compressed."
        );


    } catch (error) {

        console.error(
            "MI7:",
            error
        );


        showStatus(
            "Something went wrong while compressing the images.",
            "error"
        );

    }


    compressBtn.disabled =
        selectedImages.length === 0;

}



/* =========================================================
   COMPRESS ONE IMAGE
========================================================= */

async function compressSingleImage(
    item,
    targetBytes
) {

    const sourceImage =
        await loadImage(
            item.file
        );


    const originalWidth =
        sourceImage.naturalWidth;


    const originalHeight =
        sourceImage.naturalHeight;


    /*
       Start with the original dimensions.
       If the file is already smaller than
       target size, we still create a valid
       output image.
    */

    let width =
        originalWidth;


    let height =
        originalHeight;


    let quality =
        0.88;


    let blob =
        await canvasToBlob(
            sourceImage,
            width,
            height,
            quality
        );


    /*
       Try different quality levels first.
    */

    if (blob.size > targetBytes) {

        const qualityLevels = [

            0.82,
            0.76,
            0.70,
            0.64,
            0.58,
            0.52,
            0.46,
            0.40,
            0.34,
            0.28,
            0.22,
            0.18

        ];


        for (
            const q of qualityLevels
        ) {

            blob =
                await canvasToBlob(
                    sourceImage,
                    width,
                    height,
                    q
                );


            quality =
                q;


            if (
                blob.size <=
                targetBytes
            ) {

                break;

            }

        }

    }


    /*
       If quality reduction alone was not enough,
       reduce dimensions gradually.
    */

    let dimensionAttempts =
        0;


    while (
        blob.size > targetBytes &&
        dimensionAttempts < 8
    ) {

        width =
            Math.max(
                160,
                Math.round(
                    width * 0.82
                )
            );


        height =
            Math.max(
                160,
                Math.round(
                    height * 0.82
                )
            );


        quality =
            Math.min(
                0.82,
                Math.max(
                    0.42,
                    quality
                )
            );


        blob =
            await canvasToBlob(
                sourceImage,
                width,
                height,
                quality
            );


        dimensionAttempts++;

    }


    /*
       If target is extremely small and browser
       cannot reach it, return the smallest valid
       result instead of creating a broken file.
    */

    const compressedSize =
        blob.size;


    const savedPercent =
        Math.max(
            0,
            (
                (
                    item.originalSize -
                    compressedSize
                ) /
                item.originalSize
            ) * 100
        );


    const outputType =
        getOutputType(
            item.type
        );


    const outputExtension =
        getOutputExtension(
            outputType
        );


    const outputName =
        createOutputName(
            item.file.name,
            outputExtension
        );


    const outputBlob =
        await convertBlobType(
            blob,
            outputType,
            quality
        );


    return {

        id:
            item.id,

        fileName:
            item.file.name,

        outputName:
            outputName,

        originalSize:
            item.originalSize,

        compressedSize:
            outputBlob.size,

        savedPercent:
            savedPercent,

        width:
            width,

        height:
            height,

        type:
            outputType,

        blob:
            outputBlob,

        url:
            URL.createObjectURL(
                outputBlob
            ),

        error:
            false

    };

}



/* =========================================================
   LOAD IMAGE
========================================================= */

function loadImage(file) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

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
                URL.createObjectURL(
                    file
                );

        }
    );

}



/* =========================================================
   CANVAS TO BLOB
========================================================= */

function canvasToBlob(
    sourceImage,
    width,
    height,
    quality
) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const canvas =
                document.createElement(
                    "canvas"
                );


            canvas.width =
                width;


            canvas.height =
                height;


            const ctx =
                canvas.getContext(
                    "2d",
                    {
                        alpha: true
                    }
                );


            if (!ctx) {

                reject(
                    new Error(
                        "Canvas is not supported."
                    )
                );

                return;

            }


            ctx.imageSmoothingEnabled =
                true;


            ctx.imageSmoothingQuality =
                "high";


            /*
               White background is used because
               JPG does not support transparency.
            */

            ctx.fillStyle =
                "#ffffff";


            ctx.fillRect(
                0,
                0,
                width,
                height
            );


            ctx.drawImage(
                sourceImage,
                0,
                0,
                width,
                height
            );


            canvas.toBlob(
                blob => {

                    if (!blob) {

                        reject(
                            new Error(
                                "Unable to create compressed image."
                            )
                        );

                        return;

                    }


                    resolve(
                        blob
                    );

                },

                "image/jpeg",

                quality
            );

        }
    );

}



/* =========================================================
   OUTPUT TYPE
========================================================= */

function getOutputType(
    originalType
) {

    /*
       JPEG is used as the final compressed format
       because it gives good size reduction and is
       widely supported by browsers, gallery apps
       and sharing systems.
    */

    return "image/jpeg";

}



/* =========================================================
   OUTPUT EXTENSION
========================================================= */

function getOutputExtension(
    type
) {

    if (
        type ===
        "image/jpeg"
    ) {

        return ".jpg";

    }


    if (
        type ===
        "image/png"
    ) {

        return ".png";

    }


    if (
        type ===
        "image/webp"
    ) {

        return ".webp";

    }


    return ".jpg";

}



/* =========================================================
   CONVERT BLOB TYPE
========================================================= */

async function convertBlobType(
    blob,
    type,
    quality
) {

    if (
        blob.type === type
    ) {

        return blob;

    }


    /*
       canvasToBlob already produces JPEG.
       Return it directly.
    */

    return blob;

}



/* =========================================================
   CREATE OUTPUT FILE NAME
========================================================= */

function createOutputName(
    originalName,
    extension
) {

    const lastDot =
        originalName.lastIndexOf(
            "."
        );


    let baseName;


    if (
        lastDot > 0
    ) {

        baseName =
            originalName.substring(
                0,
                lastDot
            );

    } else {

        baseName =
            originalName;

    }


    return (
        baseName +
        "_compressed" +
        extension
    );

}



/* =========================================================
   END PART 2
========================================================= */

/* =========================================================
   MI7 REDUCE IMAGE SIZE IN KB
   COMPRESS.JS — V6 FINAL
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
        document.createElement(
            "div"
        );


    card.className =
        "mi7-result-item";


    card.dataset.id =
        result.id;



    /* =========================================
       ERROR RESULT
    ========================================== */

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


        resultGrid.appendChild(
            card
        );


        return;

    }



    /* =========================================
       RESULT PREVIEW
    ========================================== */

    const preview =
        document.createElement(
            "div"
        );


    preview.className =
        "mi7-result-preview";


    const image =
        document.createElement(
            "img"
        );


    image.src =
        result.url;


    image.alt =
        result.outputName;


    preview.appendChild(
        image
    );



    /* =========================================
       RESULT NAME
    ========================================== */

    const name =
        document.createElement(
            "div"
        );


    name.className =
        "mi7-result-name";


    name.textContent =
        result.outputName;



    /* =========================================
       RESULT DETAILS
    ========================================== */

    const details =
        document.createElement(
            "div"
        );


    details.className =
        "mi7-result-details";


    details.innerHTML =

        "<strong>Original:</strong> " +
        formatBytes(
            result.originalSize
        ) +

        "<br>" +

        "<strong>Compressed:</strong> " +
        formatBytes(
            result.compressedSize
        ) +

        "<br>" +

        "<strong>Saved:</strong> " +
        result.savedPercent.toFixed(1) +
        "%" +

        "<br>" +

        "<strong>Dimensions:</strong> " +
        result.width +
        " × " +
        result.height +
        " px";



    /* =========================================
       SAVED BADGE
    ========================================== */

    const saved =
        document.createElement(
            "span"
        );


    saved.className =
        "mi7-saved";


    saved.textContent =
        "✓ Compressed";



    /* =========================================
       ACTION BUTTONS
    ========================================== */

    const actions =
        document.createElement(
            "div"
        );


    actions.className =
        "mi7-result-actions";



    /* DOWNLOAD */

    const downloadButton =
        document.createElement(
            "button"
        );


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



    /* SHARE */

    const shareButton =
        document.createElement(
            "button"
        );


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



    /* =========================================
       ADD EVERYTHING TO ONE RESULT CARD
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
        saved
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
            document.createElement(
                "a"
            );


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
            "Unable to download this image."
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
       Web Share API with files works on
       supported mobile browsers.
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
               User cancelled share.
               Do not show an error for cancellation.
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
       Fallback:
       download the file if browser does not
       support direct file sharing.
    */

    showToast(
        "Direct sharing is not supported by this browser. Download the image and share it from Gallery."
    );

}



/* =========================================================
   RESET EVERYTHING
========================================================= */

if (resetBtn) {

    resetBtn.addEventListener(
        "click",
        resetEverything
    );

}


function resetEverything() {

    /*
       Revoke selected image URLs.
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
       Revoke compressed result URLs.
    */

    compressedResults.forEach(
        result => {

            if (
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
            "100";

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
   TOAST
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
   SIDE MENU
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
   OVERLAY CLOSE
========================================================= */

if (overlay) {

    overlay.addEventListener(
        "click",
        closeMenu
    );

}



/* =========================================================
   CLOSE MENU WITH ESC
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
   PREVENT INVALID TARGET SIZE
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
                value < 5
            ) {

                value = 5;

            }


            if (
                value > 50000
            ) {

                value = 50000;

            }


            targetSizeInput.value =
                Math.round(
                    value
                );

        }
    );

}



/* =========================================================
   PAGE CLEANUP
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
   END OF COMPRESS.JS
========================================================= */

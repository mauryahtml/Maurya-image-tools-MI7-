/* ==========================================
   MI7 REDUCE IMAGE SIZE IN KB
   COMPRESS.JS V5
   PART 1 — FILE SELECTION + GALLERY
========================================== */

"use strict";


/* ==========================================
   GLOBAL STATE
========================================== */

let v5Images = [];

let v5ImageId = 0;


/* ==========================================
   GET ELEMENTS
========================================== */

const v5ImageInput =
    document.getElementById("imageInput");

const v5Gallery =
    document.getElementById("selectedImageGallery");

const v5Results =
    document.getElementById("compressResults");

const v5EmptyMessage =
    document.getElementById("emptyMessage");


/* ==========================================
   CHECK REQUIRED ELEMENTS
========================================== */

if (!v5ImageInput || !v5Gallery || !v5Results) {

    console.error(
        "MI7 V5: Required compression elements are missing."
    );

} else {

    v5ImageInput.addEventListener(
        "change",
        handleV5ImageSelection
    );

}


/* ==========================================
   IMAGE SELECTION
========================================== */

function handleV5ImageSelection(event) {

    const files = Array.from(
        event.target.files || []
    );

    if (!files.length) {
        return;
    }


    const imageFiles = files.filter(
        file => file.type.startsWith("image/")
    );


    if (!imageFiles.length) {

        showV5Toast(
            "Please select a valid image."
        );

        v5ImageInput.value = "";

        return;
    }


    imageFiles.forEach(file => {

        addV5Image(file);

    });


    v5ImageInput.value = "";

    updateV5EmptyMessage();

}


/* ==========================================
   ADD IMAGE
========================================== */

function addV5Image(file) {

    const id = ++v5ImageId;

    const imageItem = {

        id: id,

        file: file,

        objectUrl: URL.createObjectURL(file),

        resultBlob: null,

        resultUrl: null,

        width: 0,

        height: 0

    };


    v5Images.push(imageItem);


    createV5Thumbnail(imageItem);

    createV5ImageCard(imageItem);

    readV5ImageDimensions(imageItem);

}


/* ==========================================
   CREATE THUMBNAIL
========================================== */

function createV5Thumbnail(item) {

    const thumbnail =
        document.createElement("div");

    thumbnail.className =
        "v5-thumbnail";

    thumbnail.dataset.id =
        item.id;


    const img =
        document.createElement("img");

    img.src =
        item.objectUrl;

    img.alt =
        item.file.name;


    const number =
        document.createElement("span");

    number.className =
        "v5-thumbnail-number";

    number.textContent =
        v5Images.length;


    thumbnail.appendChild(img);

    thumbnail.appendChild(number);

    v5Gallery.appendChild(thumbnail);


    /* Scroll card into view when thumbnail clicked */

    thumbnail.addEventListener(
        "click",
        () => {

            const card =
                document.querySelector(
                    `.compress-image-card[data-id="${item.id}"]`
                );

            if (card) {

                card.scrollIntoView({

                    behavior: "smooth",

                    block: "center"

                });

            }

        }
    );

}


/* ==========================================
   CREATE IMAGE CARD
========================================== */

function createV5ImageCard(item) {

    const template =
        document.getElementById(
            "compressCardTemplate"
        );


    if (!template) {

        console.error(
            "MI7 V5: compressCardTemplate not found."
        );

        return;

    }


    const card =
        template.content
        .firstElementChild
        .cloneNode(true);


    card.dataset.id =
        item.id;


    /* IMAGE */

    const preview =
        card.querySelector(
            ".compress-preview-image"
        );

    preview.src =
        item.objectUrl;

    preview.alt =
        item.file.name;


    /* FILE NAME */

    const fileName =
        card.querySelector(
            ".compress-file-name"
        );

    fileName.textContent =
        item.file.name;


    /* ORIGINAL SIZE */

    const originalSize =
        card.querySelector(
            ".original-size"
        );

    originalSize.textContent =
        formatV5Size(item.file.size);


    /* FORMAT */

    const format =
        card.querySelector(
            ".image-format"
        );

    format.textContent =
        getV5Format(item.file);


    /* BUTTON */

    const compressButton =
        card.querySelector(
            ".v5-compress-button"
        );


    if (compressButton) {

        compressButton.addEventListener(
            "click",
            () => {

                compressV5Image(
                    item.id
                );

            }
        );

    }


    /* RESULT BUTTONS */

    const downloadButton =
        card.querySelector(
            ".v5-download-button"
        );


    const shareButton =
        card.querySelector(
            ".v5-share-button"
        );


    const resetButton =
        card.querySelector(
            ".v5-reset-button"
        );


    if (downloadButton) {

        downloadButton.addEventListener(
            "click",
            () => {

                downloadV5Image(
                    item.id
                );

            }
        );

    }


    if (shareButton) {

        shareButton.addEventListener(
            "click",
            () => {

                shareV5Image(
                    item.id
                );

            }
        );

    }


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            () => {

                removeV5Image(
                    item.id
                );

            }
        );

    }


    v5Results.appendChild(card);

}


/* ==========================================
   READ IMAGE DIMENSIONS
========================================== */

function readV5ImageDimensions(item) {

    const img =
        new Image();


    img.onload = () => {

        item.width =
            img.naturalWidth;

        item.height =
            img.naturalHeight;


        const card =
            getV5Card(item.id);


        if (!card) {
            return;
        }


        const dimensions =
            card.querySelector(
                ".image-dimensions"
            );


        if (dimensions) {

            dimensions.textContent =
                `${item.width} × ${item.height} px`;

        }


        img.remove();

    };


    img.onerror = () => {

        console.error(
            "MI7 V5: Could not read image dimensions.",
            item.file.name
        );

    };


    img.src =
        item.objectUrl;

}


/* ==========================================
   GET IMAGE CARD
========================================== */

function getV5Card(id) {

    return document.querySelector(
        `.compress-image-card[data-id="${id}"]`
    );

}


/* ==========================================
   FORMAT SIZE
========================================== */

function formatV5Size(bytes) {

    if (!Number.isFinite(bytes)) {
        return "-";
    }


    if (bytes < 1024) {

        return bytes + " B";

    }


    if (bytes < 1024 * 1024) {

        return (
            (bytes / 1024).toFixed(1)
            + " KB"
        );

    }


    return (
        (bytes / (1024 * 1024)).toFixed(2)
        + " MB"
    );

}


/* ==========================================
   GET FORMAT
========================================== */

function getV5Format(file) {

    if (!file || !file.type) {
        return "Unknown";
    }


    const parts =
        file.type.split("/");


    if (parts.length === 2) {

        return parts[1]
            .toUpperCase();

    }


    return file.type;

}


/* ==========================================
   EMPTY MESSAGE
========================================== */

function updateV5EmptyMessage() {

    if (!v5EmptyMessage) {
        return;
    }


    if (v5Images.length === 0) {

        v5EmptyMessage.style.display =
            "block";

    } else {

        v5EmptyMessage.style.display =
            "none";

    }

                            }

/* ==========================================
   MI7 REDUCE IMAGE SIZE IN KB
   COMPRESS.JS V5
   PART 2 — COMPRESSION ENGINE + RESULT
========================================== */


/* ==========================================
   MAIN COMPRESS FUNCTION
========================================== */

async function compressV5Image(id) {

    const item = v5Images.find(
        image => image.id === id
    );


    if (!item) {

        showV5Toast(
            "Image not found."
        );

        return;

    }


    const card =
        getV5Card(id);


    if (!card) {
        return;
    }


    const targetInput =
        card.querySelector(
            ".target-size-input"
        );


    const compressButton =
        card.querySelector(
            ".v5-compress-button"
        );


    const statusBox =
        card.querySelector(
            ".compression-status"
        );


    const statusText =
        card.querySelector(
            ".status-text"
        );


    const resultBox =
        card.querySelector(
            ".compression-result"
        );


    const resultPreview =
        card.querySelector(
            ".result-preview-image"
        );


    const originalResult =
        card.querySelector(
            ".result-original-size"
        );


    const compressedResult =
        card.querySelector(
            ".result-compressed-size"
        );


    const savedResult =
        card.querySelector(
            ".result-saved-percent"
        );


    /* --------------------------------------
       TARGET SIZE
    -------------------------------------- */

    const targetKB =
        Number(targetInput?.value);


    if (
        !Number.isFinite(targetKB) ||
        targetKB <= 0
    ) {

        showV5Toast(
            "Please enter a valid target size in KB."
        );

        targetInput?.focus();

        return;

    }


    const targetBytes =
        targetKB * 1024;


    /* --------------------------------------
       UI — START
    -------------------------------------- */

    if (compressButton) {

        compressButton.disabled = true;

        compressButton.textContent =
            "⏳ Compressing...";

    }


    card.classList.add(
        "is-compressing"
    );


    if (statusBox) {

        statusBox.style.display =
            "flex";

    }


    if (statusText) {

        statusText.textContent =
            "Preparing image...";

    }


    try {

        /* ----------------------------------
           LOAD IMAGE
        ---------------------------------- */

        const sourceImage =
            await loadV5Image(
                item.objectUrl
            );


        if (statusText) {

            statusText.textContent =
                "Compressing image...";

        }


        /* ----------------------------------
           INITIAL DIMENSIONS
        ---------------------------------- */

        let width =
            sourceImage.naturalWidth;

        let height =
            sourceImage.naturalHeight;


        /* ----------------------------------
           CREATE FIRST CANVAS
        ---------------------------------- */

        let canvas =
            document.createElement(
                "canvas"
            );


        canvas.width =
            width;

        canvas.height =
            height;


        let context =
            canvas.getContext(
                "2d",
                {
                    alpha: true
                }
            );


        context.drawImage(
            sourceImage,
            0,
            0,
            width,
            height
        );


        /* ----------------------------------
           CHOOSE OUTPUT FORMAT
        ---------------------------------- */

        const outputType =
            chooseV5OutputType(
                item.file
            );


        /* ----------------------------------
           FIND QUALITY
        ---------------------------------- */

        let result =
            await findV5CompressedBlob(
                canvas,
                targetBytes,
                outputType
            );


        /* ----------------------------------
           IF STILL TOO LARGE
           REDUCE DIMENSIONS
        ---------------------------------- */

        if (
            result.blob.size >
            targetBytes
        ) {

            if (statusText) {

                statusText.textContent =
                    "Optimizing image dimensions...";

            }


            let scale =
                0.9;


            for (
                let attempt = 0;
                attempt < 10;
                attempt++
            ) {

                width =
                    Math.max(
                        320,
                        Math.round(
                            width * scale
                        )
                    );


                height =
                    Math.max(
                        320,
                        Math.round(
                            height * scale
                        )
                    );


                canvas.width =
                    width;

                canvas.height =
                    height;


                context =
                    canvas.getContext(
                        "2d",
                        {
                            alpha: true
                        }
                    );


                context.clearRect(
                    0,
                    0,
                    width,
                    height
                );


                context.drawImage(
                    sourceImage,
                    0,
                    0,
                    width,
                    height
                );


                result =
                    await findV5CompressedBlob(
                        canvas,
                        targetBytes,
                        outputType
                    );


                if (
                    result.blob.size <=
                    targetBytes
                ) {

                    break;

                }


                scale *= 0.85;

            }

        }


        /* ----------------------------------
           CREATE RESULT URL
        ---------------------------------- */

        if (item.resultUrl) {

            URL.revokeObjectURL(
                item.resultUrl
            );

        }


        item.resultBlob =
            result.blob;


        item.resultUrl =
            URL.createObjectURL(
                result.blob
            );


        item.resultWidth =
            width;

        item.resultHeight =
            height;

        item.outputType =
            outputType;


        /* ----------------------------------
           SHOW RESULT
        ---------------------------------- */

        if (resultPreview) {

            resultPreview.src =
                item.resultUrl;

        }


        if (originalResult) {

            originalResult.textContent =
                formatV5Size(
                    item.file.size
                );

        }


        if (compressedResult) {

            compressedResult.textContent =
                formatV5Size(
                    result.blob.size
                );

        }


        if (savedResult) {

            const saved =
                (
                    1 -
                    (
                        result.blob.size /
                        item.file.size
                    )
                ) * 100;


            savedResult.textContent =
                Math.max(
                    0,
                    saved
                ).toFixed(1) + "%";

        }


        if (resultBox) {

            resultBox.style.display =
                "block";

        }


        card.classList.remove(
            "is-compressing"
        );


        card.classList.add(
            "is-compressed"
        );


        if (statusText) {

            statusText.textContent =
                "Compression completed successfully.";

        }


        if (compressButton) {

            compressButton.disabled =
                false;

            compressButton.textContent =
                "🗜️ Compress Again";

        }


        showV5Toast(
            "✅ Image compressed successfully."
        );


    } catch (error) {

        console.error(
            "MI7 V5 Compression Error:",
            error
        );


        card.classList.remove(
            "is-compressing"
        );


        card.classList.add(
            "has-error"
        );


        if (statusText) {

            statusText.textContent =
                "Compression failed. Please try again.";

        }


        if (compressButton) {

            compressButton.disabled =
                false;

            compressButton.textContent =
                "🗜️ Compress Image";

        }


        showV5Toast(
            "❌ Compression failed."
        );

    }

}


/* ==========================================
   LOAD IMAGE
========================================== */

function loadV5Image(url) {

    return new Promise(
        (resolve, reject) => {

            const img =
                new Image();


            img.onload = () => {

                resolve(img);

            };


            img.onerror = () => {

                reject(
                    new Error(
                        "Unable to load image."
                    )
                );

            };


            img.src =
                url;

        }
    );

}


/* ==========================================
   OUTPUT FORMAT
========================================== */

function chooseV5OutputType(file) {

    /*
       JPEG/PNG/WEBP ko browser-friendly
       output me convert karenge.

       Transparency wali PNG ko WEBP
       me convert karna generally useful hai.
    */

    if (
        file.type ===
        "image/webp"
    ) {

        return "image/webp";

    }


    if (
        file.type ===
        "image/png"
    ) {

        return "image/webp";

    }


    return "image/jpeg";

}


/* ==========================================
   FIND BEST QUALITY
========================================== */

async function findV5CompressedBlob(
    canvas,
    targetBytes,
    outputType
) {

    let low =
        0.05;

    let high =
        0.95;


    let bestBlob =
        null;


    /*
       10 iterations se quality ke
       near-best result ko find karenge.
    */

    for (
        let i = 0;
        i < 10;
        i++
    ) {

        const quality =
            (low + high) / 2;


        const blob =
            await canvasToV5Blob(
                canvas,
                outputType,
                quality
            );


        if (!blob) {

            throw new Error(
                "Browser could not create compressed image."
            );

        }


        if (
            blob.size <=
            targetBytes
        ) {

            bestBlob =
                blob;

            low =
                quality;

        } else {

            high =
                quality;

        }

    }


    /*
       Agar exact target se chhota
       result mil gaya to wahi use hoga.
    */

    if (bestBlob) {

        return {
            blob: bestBlob
        };

    }


    /*
       Minimum quality par ek final attempt.
    */

    const finalBlob =
        await canvasToV5Blob(
            canvas,
            outputType,
            0.05
        );


    return {
        blob: finalBlob
    };

}


/* ==========================================
   CANVAS → BLOB
========================================== */

function canvasToV5Blob(
    canvas,
    type,
    quality
) {

    return new Promise(
        resolve => {

            canvas.toBlob(
                blob => {

                    resolve(blob);

                },

                type,

                quality

            );

        }
    );

}

/* ==========================================
   MI7 REDUCE IMAGE SIZE IN KB
   COMPRESS.JS V5
   PART 3 — DOWNLOAD + SHARE + REMOVE
========================================== */


/* ==========================================
   DOWNLOAD COMPRESSED IMAGE
========================================== */

function downloadV5Image(id) {

    const item = v5Images.find(
        image => image.id === id
    );


    if (
        !item ||
        !item.resultBlob ||
        !item.resultUrl
    ) {

        showV5Toast(
            "⚠️ Please compress the image first."
        );

        return;

    }


    const extension =
        getV5Extension(
            item.outputType
        );


    const originalName =
        item.file.name
        .replace(/\.[^/.]+$/, "");


    const fileName =
        `${originalName}-compressed.${extension}`;


    const link =
        document.createElement("a");


    link.href =
        item.resultUrl;

    link.download =
        fileName;


    document.body.appendChild(link);

    link.click();

    link.remove();


    showV5Toast(
        "✅ Compressed image downloaded."
    );

}


/* ==========================================
   GET OUTPUT EXTENSION
========================================== */

function getV5Extension(type) {

    if (
        type === "image/webp"
    ) {

        return "webp";

    }


    if (
        type === "image/png"
    ) {

        return "png";

    }


    return "jpg";

}


/* ==========================================
   SHARE IMAGE
========================================== */

async function shareV5Image(id) {

    const item =
        v5Images.find(
            image => image.id === id
        );


    if (
        !item ||
        !item.resultBlob
    ) {

        showV5Toast(
            "⚠️ Please compress the image first."
        );

        return;

    }


    /*
       Web Share API check
    */

    if (
        typeof navigator.share !==
        "function"
    ) {

        showV5Toast(
            "📤 Image sharing is not supported in this browser."
        );

        return;

    }


    const extension =
        getV5Extension(
            item.outputType
        );


    const originalName =
        item.file.name
        .replace(/\.[^/.]+$/, "");


    const fileName =
        `${originalName}-compressed.${extension}`;


    try {

        const file =
            new File(
                [
                    item.resultBlob
                ],
                fileName,
                {
                    type:
                        item.outputType
                }
            );


        /*
           Check whether browser allows
           file sharing.
        */

        if (
            navigator.canShare &&
            !navigator.canShare({
                files: [file]
            })
        ) {

            showV5Toast(
                "📤 File sharing is not supported here."
            );

            return;

        }


        await navigator.share({

            title:
                "Compressed Image",

            text:
                "Compressed with MI7 Image Tools",

            files:
                [file]

        });


        showV5Toast(
            "✅ Share panel opened."
        );


    } catch (error) {

        /*
           User pressing Cancel is not an error.
        */

        if (
            error &&
            error.name ===
            "AbortError"
        ) {

            return;

        }


        console.error(
            "MI7 V5 Share Error:",
            error
        );


        showV5Toast(
            "❌ Unable to share this image."
        );

    }

}


/* ==========================================
   REMOVE IMAGE
========================================== */

function removeV5Image(id) {

    const index =
        v5Images.findIndex(
            image => image.id === id
        );


    if (index === -1) {
        return;
    }


    const item =
        v5Images[index];


    /*
       Free object URLs
    */

    if (item.objectUrl) {

        URL.revokeObjectURL(
            item.objectUrl
        );

    }


    if (item.resultUrl) {

        URL.revokeObjectURL(
            item.resultUrl
        );

    }


    /*
       Remove card
    */

    const card =
        getV5Card(id);


    if (card) {

        card.remove();

    }


    /*
       Remove thumbnail
    */

    const thumbnail =
        v5Gallery.querySelector(
            `.v5-thumbnail[data-id="${id}"]`
        );


    if (thumbnail) {

        thumbnail.remove();

    }


    /*
       Remove from array
    */

    v5Images.splice(
        index,
        1
    );


    /*
       Renumber thumbnails
    */

    updateV5ThumbnailNumbers();


    updateV5EmptyMessage();


    showV5Toast(
        "🗑️ Image removed."
    );

}


/* ==========================================
   UPDATE THUMBNAIL NUMBERS
========================================== */

function updateV5ThumbnailNumbers() {

    const thumbnails =
        v5Gallery.querySelectorAll(
            ".v5-thumbnail"
        );


    thumbnails.forEach(
        (thumbnail, index) => {

            const number =
                thumbnail.querySelector(
                    ".v5-thumbnail-number"
                );


            if (number) {

                number.textContent =
                    index + 1;

            }

        }
    );

}


/* ==========================================
   TOAST MESSAGE
========================================== */

function showV5Toast(message) {

    const toast =
        document.getElementById(
            "v5Toast"
        );


    if (!toast) {

        /*
           Fallback if toast element
           isn't present in HTML.
        */

        console.log(
            "MI7:",
            message
        );

        return;

    }


    toast.textContent =
        message;


    toast.style.display =
        "block";


    /*
       Small delay so CSS transition
       can start properly.
    */

    requestAnimationFrame(
        () => {

            toast.style.opacity =
                "1";

            toast.style.transform =
                "translateX(-50%) translateY(0)";

        }
    );


    clearTimeout(
        toast._v5Timer
    );


    toast._v5Timer =
        setTimeout(
            () => {

                toast.style.opacity =
                    "0";

                toast.style.transform =
                    "translateX(-50%) translateY(20px)";


                setTimeout(
                    () => {

                        toast.style.display =
                            "none";

                    },
                    250
                );

            },
            2500
        );

}


/* ==========================================
   FINAL PAGE CLEANUP
========================================== */

window.addEventListener(
    "beforeunload",
    () => {

        v5Images.forEach(
            item => {

                if (item.objectUrl) {

                    URL.revokeObjectURL(
                        item.objectUrl
                    );

                }


                if (item.resultUrl) {

                    URL.revokeObjectURL(
                        item.resultUrl
                    );

                }

            }
        );

    }
);


/* ==========================================
   V5 READY
========================================== */

console.log(
    "MI7 Reduce Image Size V5 loaded successfully."
);


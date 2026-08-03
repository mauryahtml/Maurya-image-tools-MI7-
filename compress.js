/* ==========================================
   MI7 IMAGE TOOLS V3
   compress.js - Part 1
========================================== */

const imageInput = document.getElementById("imageInput");
const imageContainer = document.getElementById("imageContainer");

const loadingOverlay = document.getElementById("loadingOverlay");
const toast = document.getElementById("toast");

let imageList = [];

/* ==========================================
   TOAST
========================================== */

function showToast(message) {

    toast.textContent = message;

    toast.style.display = "block";

    setTimeout(() => {

        toast.style.display = "none";

    }, 2500);

}

/* ==========================================
   LOADING
========================================== */

function showLoading(text = "Compressing Image...") {

    loadingOverlay.style.display = "flex";

    loadingOverlay.querySelector("p").textContent = text;

}

function hideLoading() {

    loadingOverlay.style.display = "none";

}

/* ==========================================
   IMAGE SELECT
========================================== */

imageInput.addEventListener("change", () => {

    const files = [...imageInput.files];

    if (!files.length) return;

    imageList = [];

    imageContainer.innerHTML = "";

    files.forEach((file, index) => {

        createImageCard(file, index);

    });

});

/* ==========================================
   CREATE IMAGE CARD
========================================== */

function createImageCard(file, index) {

    const template = document
        .getElementById("imageCardTemplate")
        .content
        .cloneNode(true);

    const card = template.querySelector(".image-card");

    const previewImage = card.querySelector(".previewImage");

    const fileName = card.querySelector(".fileName");

    const fileFormat = card.querySelector(".fileFormat");

    const originalSize = card.querySelector(".originalSize");

    const dimensions = card.querySelector(".dimensions");

    fileName.textContent = file.name;

    fileFormat.textContent = file.type || "Unknown";

    originalSize.textContent =
        (file.size / 1024).toFixed(1) + " KB";

    const reader = new FileReader();

    reader.onload = e => {

        previewImage.src = e.target.result;

        const img = new Image();

        img.onload = () => {

            dimensions.textContent =
                img.width + " × " + img.height + " px";

        };

        img.src = e.target.result;

    };

    reader.readAsDataURL(file);

    imageContainer.appendChild(card);

    imageList.push({

        file,

        card

    });

               }

/* ==========================================
   COMPRESS BUTTON
========================================== */

imageList.forEach((item) => {

    const card = item.card;

    const compressBtn = card.querySelector(".compressBtn");

    compressBtn.addEventListener("click", async () => {

        const targetKB = parseInt(

            card.querySelector(".targetKB").value

        ) || 100;

        showLoading("Compressing...");

        const result = await compressImage(

            item.file,

            targetKB

        );

        hideLoading();

        item.result = result;

        showResult(card, item);

        showToast("✅ Image Compressed Successfully");

    });

});


/* ==========================================
   COMPRESS IMAGE
========================================== */

async function compressImage(file, targetKB){

return new Promise((resolve)=>{

const reader=new FileReader();

reader.onload=(e)=>{

const img=new Image();

img.onload=()=>{

const canvas=document.createElement("canvas");

const ctx=canvas.getContext("2d");

canvas.width=img.width;

canvas.height=img.height;

ctx.drawImage(img,0,0);

let quality=0.90;

let blob;

const compress=()=>{

canvas.toBlob((b)=>{

blob=b;

if(blob.size/1024>targetKB && quality>0.05){

quality-=0.05;

compress();

}else{

resolve(blob);

}

},"image/jpeg",quality);

};

compress();

};

img.src=e.target.result;

};

reader.readAsDataURL(file);

});

}


/* ==========================================
   SHOW RESULT
========================================== */

function showResult(card,item){

const resultBox=card.querySelector(".resultBox");

resultBox.style.display="block";

card.querySelector(".resultOriginal").textContent=

(item.file.size/1024).toFixed(1)+" KB";

card.querySelector(".resultCompressed").textContent=

(item.result.size/1024).toFixed(1)+" KB";

const saved=((item.file.size-item.result.size)

/item.file.size*100).toFixed(1);

card.querySelector(".savedPercent").textContent=

saved+" %";

}


/* ==========================================
   DOWNLOAD / SHARE / RESET
========================================== */

imageList.forEach((item) => {

const card=item.card;

const downloadBtn=card.querySelector(".downloadBtn");

const shareBtn=card.querySelector(".shareBtn");

const resetBtn=card.querySelector(".resetBtn");

/* ==========================
DOWNLOAD
========================== */

downloadBtn.addEventListener("click",()=>{

if(!item.result){

showToast("Please compress image first.");

return;

}

const url=URL.createObjectURL(item.result);

const a=document.createElement("a");

a.href=url;

a.download=item.file.name.replace(/\.[^/.]+$/,"")+"_MI7.jpg";

document.body.appendChild(a);

a.click();

document.body.removeChild(a);

URL.revokeObjectURL(url);

showToast("✅ Download Completed");

});


/* ==========================
SHARE
========================== */

shareBtn.addEventListener("click",async()=>{

if(!item.result){

showToast("Please compress image first.");

return;

}

try{

const file=new File(

[item.result],

item.file.name.replace(/\.[^/.]+$/,"")+"_MI7.jpg",

{

type:"image/jpeg"

}

);

if(

navigator.canShare &&

navigator.canShare({files:[file]})

){

await navigator.share({

title:"MI7 Image Tools",

text:"Compressed using MI7 Image Tools",

files:[file]

});

}else{

showToast("Sharing not supported.");

}

}catch(err){

console.log(err);

}

});


/* ==========================
RESET
========================== */

resetBtn.addEventListener("click",()=>{

card.remove();

imageList=imageList.filter(i=>i!==item);

showToast("Image Removed");

});

});

/* ==========================================
   MENU
========================================== */

const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");
const closeMenu = document.getElementById("closeMenu");
const overlay = document.getElementById("overlay");

if (menuBtn) {

menuBtn.addEventListener("click", () => {

sideMenu.classList.add("active");

overlay.style.display = "block";

});

}

if (closeMenu) {

closeMenu.addEventListener("click", closeMenuNow);

}

if (overlay) {

overlay.addEventListener("click", closeMenuNow);

}

function closeMenuNow() {

sideMenu.classList.remove("active");

overlay.style.display = "none";

}

/* ==========================================
   TOAST
========================================== */

function showToast(message){

const toast=document.getElementById("toast");

toast.textContent=message;

toast.style.display="block";

toast.style.opacity="1";

setTimeout(()=>{

toast.style.opacity="0";

setTimeout(()=>{

toast.style.display="none";

},300);

},2200);

}

/* ==========================================
   LOADING
========================================== */

function showLoading(text="Compressing Image..."){

const loading=document.getElementById("loadingOverlay");

loading.style.display="flex";

loading.querySelector("p").textContent=text;

}

function hideLoading(){

document.getElementById("loadingOverlay").style.display="none";

}

/* ==========================================
   PAGE READY
========================================== */

window.addEventListener("load",()=>{

console.log("✅ MI7 Compress Tool Ready");

});

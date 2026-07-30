const imageInput=document.getElementById("imageInput");
const preview=document.getElementById("preview");
const targetSize=document.getElementById("targetSize");
const unit=document.getElementById("unit");
const compressBtn=document.getElementById("compressBtn");
const downloadBtn=document.getElementById("downloadBtn");
const shareBtn=document.getElementById("shareBtn");
const resetBtn=document.getElementById("resetBtn");

let originalFile=null;
let compressedBlob=null;

// Image Select

imageInput.addEventListener("change",(e)=>{

originalFile=e.target.files[0];

if(!originalFile)return;

preview.src=URL.createObjectURL(originalFile);

preview.style.display="block";

});

// Convert KB/MB to Bytes

function targetBytes(){

let size=parseFloat(targetSize.value);

if(!size||size<=0){

alert("Enter Target Size");

return null;

}

if(unit.value==="MB"){

return size*1024*1024;

}

return size*1024;

}

// =========================
// Compress Function
// =========================

async function compressImage(file){

return new Promise((resolve,reject)=>{

const img=new Image();

img.onload=function(){

const canvas=document.createElement("canvas");

const ctx=canvas.getContext("2d");

canvas.width=img.width;

canvas.height=img.height;

ctx.drawImage(img,0,0);

const target=targetBytes();

if(target===null){

reject();

return;

}

let quality=0.95;

function tryAgain(){

canvas.toBlob(function(blob){

if(!blob){

reject();

return;

}

if(blob.size<=target || quality<=0.05){

compressedBlob=blob;

preview.src=URL.createObjectURL(blob);

resolve();

return;

}

quality-=0.05;

tryAgain();

},"image/jpeg",quality);

}

tryAgain();

};

img.onerror=reject;

img.src=URL.createObjectURL(file);

});

}

// Compress Button

compressBtn.addEventListener("click",async()=>{

if(!originalFile){

alert("Select an Image First");

return;

}

compressBtn.disabled=true;

compressBtn.innerText="Compressing...";

try{

await compressImage(originalFile);

alert("Compression Completed");

}catch{

alert("Compression Failed");

}

compressBtn.disabled=false;

compressBtn.innerText="Compress Image";

});

// =========================
// Download
// =========================

downloadBtn.addEventListener("click",()=>{

if(!compressedBlob){

alert("Please compress image first.");

return;

}

const url=URL.createObjectURL(compressedBlob);

const a=document.createElement("a");

a.href=url;

a.download="MI7-Compressed.jpg";

document.body.appendChild(a);

a.click();

document.body.removeChild(a);

URL.revokeObjectURL(url);

});


// =========================
// Share
// =========================

shareBtn.addEventListener("click",async()=>{

if(!compressedBlob){

alert("Please compress image first.");

return;

}

if(!navigator.share){

alert("Sharing is not supported on this device.");

return;

}

const file=new File(

[compressedBlob],

"MI7-Compressed.jpg",

{type:"image/jpeg"}

);

try{

await navigator.share({

title:"MI7 Image Compressor",

text:"Compressed using MI7 Image Tools",

files:[file]

});

}catch(e){

console.log(e);

}

});


// =========================
// Reset
// =========================

resetBtn.addEventListener("click",()=>{

imageInput.value="";

preview.src="";

preview.style.display="none";

targetSize.value="";

unit.value="KB";

originalFile=null;

compressedBlob=null;

});

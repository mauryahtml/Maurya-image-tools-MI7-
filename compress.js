// ===============================
// MI7 Image Compressor
// Part 1
// ===============================

// Elements

const imageInput=document.getElementById("imageInput");

const previewImage=document.getElementById("previewImage");

const compressBtn=document.getElementById("compressBtn");

const downloadBtn=document.getElementById("downloadBtn");

const shareBtn=document.getElementById("shareBtn");

const resetBtn=document.getElementById("resetBtn");

const qualitySlider=document.getElementById("qualitySlider");

const qualityValue=document.getElementById("qualityValue");

const targetValue=document.getElementById("targetValue");

const targetUnit=document.getElementById("targetUnit");

const originalSize=document.getElementById("originalSize");

const compressedSize=document.getElementById("compressedSize");

const progressBar=document.getElementById("progressBar");

const progressText=document.getElementById("progressText");

const successBox=document.getElementById("successBox");


// Variables

let selectedFile=null;

let compressedBlob=null;


// Quality Slider

qualitySlider.addEventListener("input",()=>{

qualityValue.textContent=qualitySlider.value+"%";

});


// Upload Image

imageInput.addEventListener("change",(e)=>{

const file=e.target.files[0];

if(!file) return;

selectedFile=file;

originalSize.textContent=(file.size/1024).toFixed(2)+" KB";

const reader=new FileReader();

reader.onload=function(event){

previewImage.src=event.target.result;

previewImage.style.display="block";

};

reader.readAsDataURL(file);

progressText.textContent="Image Loaded";

progressBar.value=10;

successBox.style.display="none";

});


// Target Bytes

function getTargetBytes(){

let size=parseFloat(targetValue.value);

if(isNaN(size)||size<=0){

size=100;

}

if(targetUnit.value==="MB"){

return size*1024*1024;

}

return size*1024;
   }

// ===============================
// PART 2 - Compression Engine
// ===============================

async function compressImage(file){

return new Promise((resolve,reject)=>{

const img=new Image();

img.onload=()=>{

const canvas=document.createElement("canvas");

const ctx=canvas.getContext("2d");

canvas.width=img.width;

canvas.height=img.height;

ctx.drawImage(img,0,0);

let quality=qualitySlider.value/100;

const targetSize=getTargetBytes();

function tryCompress(){

canvas.toBlob((blob)=>{

if(!blob){

reject("Compression Failed");

return;

}

progressBar.value=50;

progressText.textContent="Compressing...";

if(blob.size<=targetSize||quality<=0.05){

compressedBlob=blob;

compressedSize.textContent=(blob.size/1024).toFixed(2)+" KB";

previewImage.src=URL.createObjectURL(blob);

progressBar.value=100;

progressText.textContent="Compression Completed";

successBox.style.display="block";

resolve(blob);

return;

}

quality-=0.05;

tryCompress();

},"image/jpeg",quality);

}

tryCompress();

};

img.onerror=()=>{

reject("Image Load Failed");

};

img.src=URL.createObjectURL(file);

});

}


// Compress Button

compressBtn.addEventListener("click",async()=>{

if(!selectedFile){

alert("Please select an image.");

return;

}

progressBar.value=20;

progressText.textContent="Preparing...";

try{

await compressImage(selectedFile);

}catch(err){

alert(err);

}

});

// ===============================
// PART 3 - Download / Share / Reset
// ===============================


// Download

downloadBtn.addEventListener("click",()=>{

if(!compressedBlob){

alert("Please compress image first.");

return;

}

const a=document.createElement("a");

a.href=URL.createObjectURL(compressedBlob);

a.download="MI7-Compressed.jpg";

document.body.appendChild(a);

a.click();

document.body.removeChild(a);

});




// Share

shareBtn.addEventListener("click",async()=>{

if(!compressedBlob){

alert("Please compress image first.");

return;

}

if(!navigator.share){

alert("Sharing is not supported on this browser.");

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

text:"Compressed with MI7 Image Tools",

files:[file]

});

}catch(err){

console.log(err);

}

});




// Reset

resetBtn.addEventListener("click",()=>{

imageInput.value="";

previewImage.src="";

previewImage.style.display="none";

selectedFile=null;

compressedBlob=null;

qualitySlider.value=80;

qualityValue.textContent="80%";

targetValue.value=100;

targetUnit.value="KB";

originalSize.textContent="0 KB";

compressedSize.textContent="0 KB";

progressBar.value=0;

progressText.textContent="Waiting for Image...";

successBox.style.display="none";

});




// Drag & Drop

const uploadBox=document.querySelector(".upload-box");

uploadBox.addEventListener("dragover",(e)=>{

e.preventDefault();

uploadBox.classList.add("drag");

});

uploadBox.addEventListener("dragleave",()=>{

uploadBox.classList.remove("drag");

});

uploadBox.addEventListener("drop",(e)=>{

e.preventDefault();

uploadBox.classList.remove("drag");

const file=e.dataTransfer.files[0];

if(!file) return;

imageInput.files=e.dataTransfer.files;

imageInput.dispatchEvent(new Event("change"));

});

console.log("MI7 Image Compressor Loaded");
  
                                         }

// ===============================
// PART 4 - Image Information
// ===============================

// Image Width & Height

const imageInfo=document.createElement("p");

document.querySelector(".info-box").appendChild(imageInfo);

imageInput.addEventListener("change",(e)=>{

const file=e.target.files[0];

if(!file)return;

const img=new Image();

img.onload=function(){

imageInfo.innerHTML=

"Resolution : <b>"+

img.width+

" × "+

img.height+

"</b> px";

};

img.src=URL.createObjectURL(file);

});




// Compression Percentage

const compressPercent=document.createElement("p");

document.querySelector(".info-box").appendChild(compressPercent);

function updateCompressionInfo(){

if(!selectedFile||!compressedBlob)return;

const original=selectedFile.size;

const compressed=compressedBlob.size;

const saved=((original-compressed)/original*100).toFixed(1);

compressPercent.innerHTML=

"Saved : <b>"+saved+"%</b>";

}




// Update After Compression

compressBtn.addEventListener("click",()=>{

setTimeout(()=>{

updateCompressionInfo();

},500);

});




// File Type

const fileType=document.createElement("p");

document.querySelector(".info-box").appendChild(fileType);

imageInput.addEventListener("change",(e)=>{

const file=e.target.files[0];

if(!file)return;

fileType.innerHTML=

"Format : <b>"+

file.type.replace("image/","").toUpperCase()

+"</b>";

});




// Final Ready

console.log("MI7 Compressor Version 1.0 Ready");


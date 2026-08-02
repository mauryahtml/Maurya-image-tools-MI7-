/* ==========================================
   MI7 IMAGE TOOLS
   main.js FINAL V1
========================================== */

"use strict";

/* ==========================================
   DOM LOADED
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* -------------------------
       MENU
    -------------------------- */

    const menuBtn = document.getElementById("menuBtn");

    const sideMenu = document.getElementById("sideMenu");

    const overlay = document.getElementById("overlay");

    const closeMenu = document.getElementById("closeMenu");

    function openMenu() {

        sideMenu.classList.add("show");

        overlay.classList.add("show");

    }

    function closeMenuNow() {

        sideMenu.classList.remove("show");

        overlay.classList.remove("show");

    }

    if (menuBtn) {

        menuBtn.addEventListener("click", openMenu);

    }

    if (closeMenu) {

        closeMenu.addEventListener("click", closeMenuNow);

    }

    if (overlay) {

        overlay.addEventListener("click", closeMenuNow);

    }

    /* -------------------------
       READ MORE
    -------------------------- */

    const readMoreBtn = document.getElementById("readMoreBtn");

    const moreHowTo = document.getElementById("moreHowTo");

    if (readMoreBtn && moreHowTo) {

        readMoreBtn.addEventListener("click", function () {

            if (
                moreHowTo.style.display === "" ||
                moreHowTo.style.display === "none"
            ) {

                moreHowTo.style.display = "block";

                readMoreBtn.innerHTML = "Read Less ▲";

            } else {

                moreHowTo.style.display = "none";

                readMoreBtn.innerHTML = "Read More ▼";

            }

        });

    }

});

/* ==========================================
   LOADER
========================================== */

window.addEventListener("load", function () {

    const loader = document.getElementById("loader");

    const mainContent = document.getElementById("mainContent");

    if (!loader || !mainContent) return;

    mainContent.style.display = "none";

    setTimeout(function () {

        loader.style.opacity = "0";

        setTimeout(function () {

            loader.style.display = "none";

            mainContent.style.display = "block";

        }, 500);

    }, 1500);

});


/* ==========================================
   LOADING OVERLAY
========================================== */

function showLoading() {

    const loading = document.getElementById("loadingOverlay");

    if (loading) {

        loading.style.display = "flex";

    }

}

function hideLoading() {

    const loading = document.getElementById("loadingOverlay");

    if (loading) {

        loading.style.display = "none";

    }

}


/* ==========================================
   TOAST MESSAGE
========================================== */

function showToast(message) {

    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.innerText = message;

    toast.classList.add("show");

    setTimeout(function () {

        toast.classList.remove("show");

    }, 2500);

}


/* ==========================================
   DEBUG
========================================== */

console.log("✅ MI7 main.js loaded successfully");





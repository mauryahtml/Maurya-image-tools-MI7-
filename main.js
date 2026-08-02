/* ======================================
   MI7 IMAGE TOOLS
   main.js
====================================== */

document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // MENU
    // =========================


   // =========================
// MENU
// =========================

const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");
const closeMenu = document.getElementById("closeMenu");

if (menuBtn && sideMenu && overlay) {

    menuBtn.addEventListener("click", () => {

        sideMenu.classList.add("show");
        overlay.classList.add("show");

    });

    function closeSideMenu() {

        sideMenu.classList.remove("show");
        overlay.classList.remove("show");

    }

    overlay.addEventListener("click", closeSideMenu);

    if (closeMenu) {

        closeMenu.addEventListener("click", closeSideMenu);

    }

}


    // =========================
    // READ MORE
    // =========================

    const readMoreBtn = document.getElementById("readMoreBtn");
    const moreHowTo = document.getElementById("moreHowTo");

    if (readMoreBtn && moreHowTo) {

        readMoreBtn.addEventListener("click", () => {

            if (moreHowTo.style.display === "none" || moreHowTo.style.display === "") {

                moreHowTo.style.display = "block";
                readMoreBtn.innerText = "Read Less ▲";

            } else {

                moreHowTo.style.display = "none";
                readMoreBtn.innerText = "Read More ▼";

            }

        });

    }

});

/* =========================
   LOADING
========================= */

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

/* =========================
   TOAST MESSAGE
========================= */

function showToast(message) {

    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.innerText = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

           }

/* =========================
   HOME PAGE LOADER
========================= */

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");
    const mainContent = document.getElementById("mainContent");

    if (!loader || !mainContent) return;

    mainContent.style.display = "none";

    setTimeout(() => {

        loader.style.opacity = "0";

        setTimeout(() => {

            loader.style.display = "none";
            mainContent.style.display = "block";

        },500);

    },1500);

});

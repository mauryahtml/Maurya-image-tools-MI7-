/* ======================================
   MI7 IMAGE TOOLS
   main.js
====================================== */

document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // MENU
    // =========================

    const menuBtn = document.getElementById("menuBtn");
    const sideMenu = document.getElementById("sideMenu");
    const overlay = document.getElementById("overlay");

    if (menuBtn && sideMenu && overlay) {

        menuBtn.addEventListener("click", () => {

            sideMenu.classList.toggle("active");
            overlay.classList.toggle("active");

        });

        overlay.addEventListener("click", () => {

            sideMenu.classList.remove("active");
            overlay.classList.remove("active");

        });

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


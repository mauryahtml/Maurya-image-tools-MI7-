/* ======================================
   MI7 - Maurya Image Tools
   Universal Main JS
====================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       Welcome Loader
    ========================= */

    const loader = document.getElementById("loader");
    const home = document.getElementById("home");

    if (loader && home) {

        setTimeout(() => {

            loader.style.opacity = "0";

            setTimeout(() => {

                loader.style.display = "none";

                home.style.display = "block";

                home.style.opacity = "0";

                setTimeout(() => {

                    home.style.transition = "0.5s";
                    home.style.opacity = "1";

                }, 50);

            }, 500);

        }, 1500);

    }


    /* =========================
       Search
    ========================= */

    const searchBox = document.getElementById("searchBox");

    if (searchBox) {

        searchBox.addEventListener("input", function () {

            console.log("Searching :", this.value);

        });

    }


    /* =========================
       Side Menu
    ========================= */

    const menuBtn = document.getElementById("menuBtn");
    const closeMenu = document.getElementById("closeMenu");
    const sideMenu = document.getElementById("sideMenu");
    const overlay = document.getElementById("overlay");

    if (menuBtn && closeMenu && sideMenu && overlay) {

        menuBtn.addEventListener("click", () => {

            sideMenu.classList.add("show");
            overlay.classList.add("show");

        });

        closeMenu.addEventListener("click", () => {

            sideMenu.classList.remove("show");
            overlay.classList.remove("show");

        });

        overlay.addEventListener("click", () => {

            sideMenu.classList.remove("show");
            overlay.classList.remove("show");

        });

    }

});


console.log("MI7 Main JS Loaded");


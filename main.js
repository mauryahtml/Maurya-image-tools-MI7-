/* ==================================================
   MI7 IMAGE TOOLS
   main.js
   PART - 1
   Loader + Side Menu
================================================== */

// Wait until page loads
window.addEventListener("load", () => {

    const loader = document.getElementById("loader");
    const mainContent = document.getElementById("mainContent");

    // Welcome Screen (2 Seconds)
    setTimeout(() => {

        loader.style.opacity = "0";

        setTimeout(() => {

            loader.style.display = "none";

            mainContent.style.display = "block";

            mainContent.style.opacity = "0";

            setTimeout(() => {

                mainContent.style.transition = "opacity .5s";

                mainContent.style.opacity = "1";

            },50);

        },500);

    },2000);

});


/* ==================================================
   SIDE MENU
================================================== */

const menuBtn = document.getElementById("menuBtn");
const closeMenu = document.getElementById("closeMenu");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");

if(menuBtn){

    menuBtn.addEventListener("click",()=>{

        sideMenu.classList.add("show");

        overlay.classList.add("show");

    });

}

if(closeMenu){

    closeMenu.addEventListener("click",closeMenuBar);

}

if(overlay){

    overlay.addEventListener("click",closeMenuBar);

}

function closeMenuBar(){

    sideMenu.classList.remove("show");

    overlay.classList.remove("show");

               }

/* ==================================================
   PART - 2
   READ MORE + SEARCH FILTER
================================================== */

/* ---------- READ MORE ---------- */

const readMoreBtn = document.getElementById("readMoreBtn");
const moreHowTo = document.getElementById("moreHowTo");

if (readMoreBtn && moreHowTo) {

    readMoreBtn.addEventListener("click", () => {

        if (moreHowTo.style.display === "block") {

            moreHowTo.style.display = "none";
            readMoreBtn.innerHTML = "Read More ▼";

        } else {

            moreHowTo.style.display = "block";
            readMoreBtn.innerHTML = "Show Less ▲";

        }

    });

}


/* ==================================================
   SEARCH TOOL FILTER
================================================== */

const searchInput = document.getElementById("searchBox");
const toolCards = document.querySelectorAll(".toolCard");

if (searchInput) {

    searchInput.addEventListener("keyup", () => {

        const value = searchInput.value.toLowerCase();

        toolCards.forEach(card => {

            const text = card.innerText.toLowerCase();

            if (text.includes(value)) {

                card.style.display = "flex";

            } else {

                card.style.display = "none";

            }

        });

    });

               }

/* ==================================================
   PART - 3
   MENU AUTO CLOSE + SMOOTH SCROLL + FUTURE READY
================================================== */

/* ---------- AUTO CLOSE MENU ---------- */

const menuLinks = document.querySelectorAll("#sideMenu a");

menuLinks.forEach(link => {

    link.addEventListener("click", () => {

        sideMenu.classList.remove("show");
        overlay.classList.remove("show");

    });

});


/* ==================================================
   SMOOTH SCROLL
================================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        const target = document.querySelector(this.getAttribute("href"));

        if(target){

            e.preventDefault();

            target.scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});


/* ==================================================
   FUTURE READY
================================================== */

console.log("✅ MI7 Image Tools Loaded Successfully");

/*
Future Features

✓ Dark Mode

✓ Firebase Visitor Counter

✓ Tool Categories

✓ Favorite Tools

✓ Recently Used Tools

✓ Multi Language

✓ PWA Install

✓ Theme Switcher

✓ Update Checker

✓ Offline Mode

*/





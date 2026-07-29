/* ==========================
   MI7 - Maurya Image Tools
   main.js (Part-1)
========================== */

// Wait until page loads
window.addEventListener("load", function () {

    const loader = document.getElementById("loader");
    const home = document.getElementById("home");

    // Show Welcome Screen for 3 Seconds
    setTimeout(function () {

        loader.style.opacity = "0";
        loader.style.transition = "0.6s";

        setTimeout(function () {

            loader.style.display = "none";
            home.style.display = "block";

            // Smooth Fade In
            home.style.opacity = "0";

            setTimeout(function () {
                home.style.transition = "0.8s";
                home.style.opacity = "1";
            }, 50);

        }, 600);

    }, 3000);

});



/* ==========================
      Tool Search (Coming Soon)
========================== */

const searchBox = document.querySelector(".hero input");

if (searchBox) {

    searchBox.addEventListener("focus", function () {

        console.log("Search Activated");

    });

}



/* ==========================
      Future Features
========================== */

// Dark Mode
// Mobile Menu
// Live Search
// Tool Filter
// Share Button
// Download Manager
// Recently Used Tools

console.log("MI7 Loaded Successfully");

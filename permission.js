document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    const profileBtn = document.getElementById("profileButton");
    const registerBtn = document.getElementById("registerButton");
    const logoutBtn = document.getElementById("logoutButton");
    const homeButton = document.getElementById("homeButton");
    const dashButton = document.getElementById("dashButton");
    const aboutButton = document.getElementById("aboutButton");
    const featureButton = document.getElementById("featureButton");
    const loginButton = document.getElementById("loginButton");

    // Hide elements if user is not authenticated
    if (!token) {
        profileBtn.style.display = "none";
        logoutBtn.style.display = "none";
        dashButton.style.display = "none";
    } else {
        registerBtn.style.display = "none";
        homeButton.style.display = "none";
        loginButton.style.display = "none";
        aboutButton.style.display = "none";
        featureButton.style.display = "none";
    }
});

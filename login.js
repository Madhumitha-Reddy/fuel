document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    // Get username and password input values
    const username = document.getElementById("user").value;
    const password = document.getElementById("pass").value;

    // Dummy credentials (Replace with actual authentication)
    const validUsername = "user";
    const validPassword = "password";

    if (username === validUsername && password === validPassword) {
        // Store login status in localStorage (to maintain session)
        localStorage.setItem("isLoggedIn", "true");

        // Redirect to dashboard.html
        window.location.href = "dashboard.html";
    } else {
        // Show error message if credentials are incorrect
        document.getElementById("errorMessage").style.display = "block";
    }
});


document.getElementById("proceedBtn").addEventListener("click", async function (event) {
    event.preventDefault(); 

    const address = document.getElementById("address").value;
    const quantity = document.getElementById("quantity").value;
    const fuelType = document.querySelector('input[name="fuelType"]:checked').value;
    const username = localStorage.getItem("username") || "testUser"; 

    if (!address || !quantity || !fuelType) {
        alert("Please fill all details!");
        return;
    }

    console.log("Booking fuel:", { username, address, quantity, fuelType });

    try {
        const response = await fetch("http://localhost:3000/api/book-fuel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, address, quantity, fuelType })
        });

        const data = await response.json();
        console.log("Server Response:", data);

        if (data.success) {
            window.location.href = "payment.html"; 
        } else {
            alert("Booking failed. Try again!");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Check the console.");
    }
});





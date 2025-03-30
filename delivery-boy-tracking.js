
        // Connect to the Socket.io server
const socket = io('http://localhost:3000'); 
const orderId = "ORDER_ID_HERE"; 
        
let userLocation = {
    lat: parseFloat(document.getElementById("userLat").value) || 28.7041,
    lng: parseFloat(document.getElementById("userLng").value) || 77.1025
};


// Delivery boy's starting position (default, updated dynamically)
let deliveryBoyLocation = { lat: 28.7041, lng: 77.2025 };
        

// Listen for real-time updates of the delivery boy's current location
socket.on("current-location", (location) => {
    deliveryBoyLocation = location;
});

// Initialize the Google Map
let map, deliveryMarker, userMarker;
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: deliveryBoyLocation
    });

    // Markers
    deliveryMarker = new google.maps.Marker({
        position: deliveryBoyLocation,
        map: map,
        title: "Delivery Boy"
    });

    userMarker = new google.maps.Marker({
        position: userLocation,
        map: map,
        title: "User Location",
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
    });

    calculateETA();
}

// Function to calculate Estimated Time of Arrival (ETA)
function calculateETA() {
    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
        {
            origins: [deliveryBoyLocation],
            destinations: [userLocation],
            travelMode: "DRIVING",
        },
        (response, status) => {
            if (status === "OK" && response.rows[0].elements[0].status === "OK") {
                const duration = response.rows[0].elements[0].duration.text;
                document.getElementById("arrivalTime").innerText = duration;
            } else {
                document.getElementById("arrivalTime").innerText = "Unable to calculate.";
            }
        }
    );
}


// Simulate delivery movement (stops when close to user)
function updateDeliveryLocation() {
    if (Math.abs(deliveryBoyLocation.lng - userLocation.lng) < 0.0005) {
        clearInterval(movementInterval); // Stop movement when close to user
        document.getElementById("orderStatus").innerText = "Arrived!";
        return;
    }

    deliveryBoyLocation.lng -= 0.001; // Move closer
    deliveryMarker.setPosition(deliveryBoyLocation);
    map.setCenter(deliveryBoyLocation);
    calculateETA();
}
// Simulate movement every 3 seconds
let movementInterval = setInterval(updateDeliveryLocation, 3000);

// Listen for real-time order updates
socket.on("order-status-update", (data) => {
    document.getElementById("orderStatus").innerText = data.status;
});




        // Load the map
        window.onload = initMap;

         // Show the message when the page loads
         document.addEventListener("DOMContentLoaded", function() {
            const orderMessage = document.getElementById("orderPlacedMsg");
            orderMessage.style.display = "block";

            // Hide the message after 3 seconds
            setTimeout(() => {
                orderMessage.style.display = "none";
            }, 3000);
        });
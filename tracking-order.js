const socket = io('http://localhost:3000');

// Set customer's location (destination)
const customerLocation = { lat: 28.7041, lng: 77.1025 };

// Set initial delivery boy's location (simulated moving vehicle)
let deliveryBoyLocation = { lat: 28.7041, lng: 77.2025 };

let map, deliveryMarker, customerMarker;

// Initialize the map
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: deliveryBoyLocation
    });

    deliveryMarker = new google.maps.Marker({
        position: deliveryBoyLocation,
        map: map,
        title: "Delivery Boy"
    });

    customerMarker = new google.maps.Marker({
        position: customerLocation,
        map: map,
        title: "Your Location",
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
    });

    calculateETA();
}

// Function to update the delivery location (Simulated)
function updateDeliveryLocation() {
    deliveryBoyLocation.lng -= 0.001; // Simulate movement
    deliveryMarker.setPosition(deliveryBoyLocation);
    map.setCenter(deliveryBoyLocation);
    calculateETA();
}

// Function to calculate Estimated Arrival Time (ETA)
function calculateETA() {
    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
        {
            origins: [deliveryBoyLocation],
            destinations: [customerLocation],
            travelMode: "DRIVING",
        },
        (response, status) => {
            if (status === "OK" && response.rows[0].elements[0].status === "OK") {
                const duration = response.rows[0].elements[0].duration.text;
                document.getElementById("eta").innerText = duration;
            } else {
                document.getElementById("eta").innerText = "Unable to calculate.";
            }
        }
    );
}

// Simulate delivery movement every 3 seconds
setInterval(updateDeliveryLocation, 3000);

// Load the map
window.onload = initMap;

// Show order placed message only when order is confirmed
document.addEventListener("DOMContentLoaded", function () {
    fetchTrackingDetails();
});

// Fetch order tracking details
async function fetchTrackingDetails() {
    try {
        const response = await fetch("http://localhost:3000/api/latest-order");
        const order = await response.json();

        document.getElementById("trackingInfo").innerHTML = `
            <h3>Order Status: ${order.status}</h3>
            <p><strong>Fuel Type:</strong> ${order.fuelType}</p>
            <p><strong>Quantity:</strong> ${order.quantity} Liters</p>
            <p><strong>Delivery Address:</strong> ${order.address}</p>
            <p><strong>Estimated Arrival:</strong> ${order.estimatedArrival || "Pending"}</p>
        `;

        if (order.status === "Confirmed") {
            document.getElementById("orderPlacedMsg").style.display = "block";
            setTimeout(() => {
                document.getElementById("orderPlacedMsg").style.display = "none";
            }, 3000);
        }
    } catch (error) {
        console.error("Error fetching tracking details:", error);
    }
}

// Refresh tracking details every 5 seconds
setInterval(fetchTrackingDetails, 5000);

// Listen for real-time updates via Socket.io
// Listen for real-time updates via Socket.io
socket.on('order-accepted', (order) => {
    const { deliveryBoyLocation: updatedLocation, status, estimatedArrival } = order;

    // Update delivery location (from the server)
    if (updatedLocation) {
        deliveryBoyLocation = updatedLocation;
        deliveryMarker.setPosition(updatedLocation);
        map.setCenter(updatedLocation);
    }

    // Update ETA (from the server or calculated)
    if (estimatedArrival) {
        document.getElementById("eta").innerText = `Estimated Arrival: ${estimatedArrival}`;
    } else {
        calculateETA();  // If estimated arrival is not provided, calculate it dynamically
    }

    // Update order status and details
    document.getElementById("trackingInfo").innerHTML = `
        <h3>Order Status: ${status}</h3>
        <p><strong>Fuel Type:</strong> ${order.fuelType}</p>
        <p><strong>Quantity:</strong> ${order.quantity} Liters</p>
        <p><strong>Delivery Address:</strong> ${order.address}</p>
    `;
});


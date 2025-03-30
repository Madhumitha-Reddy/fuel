async function fetchOrders() {
    try {
        const response = await fetch('http://localhost:3000/api/orders');
        const orders = await response.json();
        
        // Clear previous orders
        const ordersList = document.getElementById('ordersList');
        ordersList.innerHTML = '';

        // Loop through orders and display them dynamically
        orders.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.classList.add('order-card');
            orderCard.innerHTML = `
                <h3>Order #${order._id}</h3>
                <p><strong>Customer:</strong> ${order.username}</p>
                <p><strong>Fuel Type:</strong> ${order.fuelType}</p>
                <p><strong>Quantity:</strong> ${order.quantity} Liters</p>
                <p><strong>Address:</strong> ${order.address}</p>
                <div class="buttons">
                    <button class="accept" onclick="acceptOrder('${order._id}')">✔ Accept</button>
                    <button class="decline" onclick="declineOrder('${order._id}')">❌ Decline</button>
                </div>
            `;
            ordersList.appendChild(orderCard);
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

// Accept order functionality
async function acceptOrder(orderId) {
    try {
        const response = await fetch(`http://localhost:3000/api/orders/${orderId}/accept`, {
            method: 'POST',
        });

        if (response.ok) {
            alert('Order Accepted');
            window.location.href = "delivery-boy-tracking.html";  
            fetchOrders(); // Re-fetch orders after accepting
        } else {
            alert('Failed to accept order');
        }
    } catch (error) {
        console.error('Error accepting order:', error);
    }
}

// Decline order functionality
async function declineOrder(orderId) {
    try {
        // Handle decline logic (you may implement it if needed)
        alert('Order Declined');
    } catch (error) {
        console.error('Error declining order:', error);
    }
}

// Fetch orders when the page loads
window.onload = fetchOrders;


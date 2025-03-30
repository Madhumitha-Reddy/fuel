document.getElementById('placeOrderBtn').addEventListener('click', async function () {
    // Gather order details (e.g., payment method, fuel type, address, etc.)
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const selectedUPI = document.querySelector('input[name="upi-payment"]:checked') ? 
                        document.querySelector('input[name="upi-payment"]:checked').value : null;

    const orderData = {
        paymentMethod: paymentMethod,
        selectedUPI: selectedUPI,
        fuelType: "Petrol",  // Get dynamically from user input or form
        quantity: "20", // Get dynamically
        address: "123 Fuel St, New Delhi" // Get dynamically
    };

    try {
        // Send POST request to store order details in the database
        const response = await fetch('http://localhost:3000/api/place-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        const result = await response.json();

        if (response.ok) {
            // Redirect to tracking-order.html
            window.location.href = '/tracking-order.html';
        } else {
            alert('Failed to place order');
        }
    } catch (error) {
        console.error('Error placing order:', error);
        alert('There was an error placing your order.');
    }
});


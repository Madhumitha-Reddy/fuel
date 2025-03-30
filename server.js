// const express = require("express");
// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const cors = require("cors");

// const app = express();
// app.use(express.json());
// app.use(cors());

// mongoose.connect("mongodb://localhost:27017/fuelDeliveryDB", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => console.log("✅ MongoDB Connected"))
//   .catch(err => console.log("❌ DB Connection Error:", err));

// // 🔹 Updated User Schema (Uses `username` Instead of `email`)
// const userSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     password: { type: String, required: true }
// });
// const User = mongoose.model("User", userSchema);

// // 🔹 Register User (Now Accepts `username`)
// app.post("/api/register", async (req, res) => {
//     const { username, password } = req.body;
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new User({ username, password: hashedPassword });
//         await newUser.save();
//         res.json({ success: true, message: "User registered successfully!" });
//     } catch (error) {
//         res.json({ success: false, message: "Error registering user" });
//     }
// });

// // 🔹 Login User (Now Uses `username`)
// app.post("/api/login", async (req, res) => {
//     const { username, password } = req.body;
//     try {
//         const user = await User.findOne({ username });
//         if (!user) return res.json({ success: false, message: "User not found" });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.json({ success: false, message: "Incorrect password" });

//         const token = jwt.sign({ username }, "secretKey", { expiresIn: "1h" });
//         res.json({ success: true, token });
//     } catch (error) {
//         res.json({ success: false, message: "Login error" });
//     }
// });

// // 🔹 Dashboard Route (Protected)
// app.get("/api/dashboard", (req, res) => {
//     const token = req.headers["authorization"];
//     if (!token) return res.json({ success: false, message: "Unauthorized" });

//     jwt.verify(token, "secretKey", (err, decoded) => {
//         if (err) return res.json({ success: false, message: "Invalid Token" });

//         res.json({ success: true, username: decoded.username });
//     });
// });

// app.listen(3000, () => console.log("🚀 Server running on port 3000"));
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");  // Import http module
const socketIo = require("socket.io");  // Import Socket.io

const app = express();
const server = http.createServer(app);  // Create HTTP server from Express app
const io = socketIo(server);  // ✅ This is correct for the backend
  // Initialize Socket.io with the server

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/fuelDeliveryDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ MongoDB Connection Error:", err));

// Order schema
const OrderSchema = new mongoose.Schema({
    username: String,
    address: String,
    fuelType: String,
    quantity: Number,
    status: { type: String, default: "Pending" },
    paymentStatus: { type: String, default: "Pending" },
    userLocation: {
        lat: Number,
        lng: Number
    },
    deliveryBoyLocation: {
        lat: Number,
        lng: Number
    },
    estimatedArrival: { type: String, default: "Pending" },
    deliveryBoyAccepted: { type: Boolean, default: false }
});

const Order = mongoose.model("Order", OrderSchema);

// 🟢 API: Book Fuel (Store Order)
app.post("/api/book-fuel", async (req, res) => {
    const { username, address, quantity, fuelType } = req.body;

    if (!username || !address || !quantity || !fuelType) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const newOrder = new Order({ username, address, quantity, fuelType, status: "Pending", paymentStatus: "Pending" });
        await newOrder.save();
        res.json({ success: true, message: "Fuel booked successfully!" });
    } catch (error) {
        console.error("Error saving order:", error);
        res.status(500).json({ success: false, message: "Database error" });
    }
});

// 🟢 API: Get Orders for Delivery Boys
app.get("/api/orders", async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});

// API: Accept Order (Delivery Boy)
app.post("/api/orders/:id/accept", async (req, res) => {
    try {
        const { lat, lng } = req.body; // Delivery boy location from the frontend
        const order = await Order.findByIdAndUpdate(req.params.id, {
            status: "Accepted",
            deliveryBoyLocation: { lat, lng },
            deliveryBoyAccepted: true
        }, { new: true });

        // Emit the updated order to the front-end (real-time using Socket.io)
        io.emit('order-accepted', order); // Emit event to notify the frontend

        res.json({ message: "Order Accepted", order });
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});



// API: Decline Order (Delivery Boy)
app.post("/api/orders/:id/decline", async (req, res) => {
    try {
        await Order.findByIdAndUpdate(req.params.id, { status: "Declined" });
        res.json({ message: "Order Declined" });
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});


// Start Server
// app.listen(3000, () => console.log("✅ Server running on port 3000"));


app.post('/api/orders/complete-order', async (req, res) => {
    try {
        const { username, paymentMethod } = req.body;

        // Logic to store the order in the database
        const order = new Order({
            username,
            paymentMethod,
            status: "Pending", // initial status
            // Add more fields like fuel type, address, etc.
        });

        await order.save();

        // Send the response back to the frontend
        res.status(200).json({ success: true, message: "Order placed successfully!" });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: "Error placing order" });
    }
});

app.post('/api/place-order', async (req, res) => {
    const { paymentMethod, selectedUPI, fuelType, quantity, address } = req.body;

    const newOrder = new Order({
        paymentMethod,
        selectedUPI,
        fuelType,
        quantity,
        address,
        status: 'Pending', // Initial order status
        createdAt: new Date(),
    });

    try {
        await newOrder.save();
        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).json({ message: 'Failed to place order' });
    }
});


app.get("/api/orders/delivery-ready", async (req, res) => {
    try {
        const orders = await Order.find({ paymentStatus: "Completed", status: "Pending" });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});


app.get('/api/latest-order', async (req, res) => {
    try {
        const orders = await Order.find({ status: 'Pending' }).sort({ createdAt: -1 }).limit(1);
        if (orders.length > 0) {
            res.json(orders[0]);  // Send the latest order to the delivery boy
        } else {
            res.status(404).json({ message: 'No pending orders available' });
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

// Start Server with Socket.io
server.listen(3000, () => {
    console.log("✅ Server running on port 3000");
});

  // ✅ This is correct for the backend
 // Connect to the server

// Inside server.js
io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("update-delivery-location", async ({ orderId, lat, lng }) => {
        try {
            // Find the order and update its status and location
            const order = await Order.findByIdAndUpdate(orderId, {
                deliveryBoyLocation: { lat, lng },
                status: 'On the way'
            }, { new: true });

            if (!order) {
                return console.log("Order not found");
            }

            // Broadcast the updated location to all connected clients (including the user)
            io.emit('order-accepted', {
                orderId: order._id,
                deliveryBoyLocation: { lat, lng },
                status: "On the way",
                estimatedArrival: "Calculating..." // This could be dynamic
            });

            console.log(`Updated location for order ${orderId}: ${lat}, ${lng}`);
        } catch (error) {
            console.error("Error updating location:", error);
        }
    });

    socket.on('disconnect', () => {
        console.log("A user disconnected");
    });
});



io.emit('order-accepted', {
    deliveryBoyLocation: { lat: 28.7041, lng: 77.2025 },
    status: "On the way",
    estimatedArrival: "15 minutes" // Example ETA (replace with dynamic calculation)
});


// API: Update Delivery Boy's Live Location
app.post("/api/orders/:id/update-location", async (req, res) => {
    try {
        const { lat, lng } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, {
            deliveryBoyLocation: { lat, lng }
        }, { new: true });

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        // Emit updated location to frontend (real-time)
        io.emit('delivery-location-update', order);

        res.json({ message: "Location updated", order });
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});

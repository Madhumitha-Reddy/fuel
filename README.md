Project Overview

The Online Fuel Delivery System is a full-stack web application that allows users to order fuel online and have it delivered to their location. The system supports multiple fuel types (Petrol, Diesel, EV charging) and includes real-time order tracking for users and delivery personnel.

Tech Stack

Frontend: HTML, CSS, JavaScript
Backend: Node.js, Express.js
Database: MongoDB / MySQL
Authentication: JWT (JSON Web Token)
Real-time Tracking: Google Maps API, Socket.io
Features

User Flow:
Login/Register: Users log in with credentials stored in the database.
Fuel Booking: Users enter address, fuel type, and quantity, then proceed to payment.
Payment Processing: Payment details are recorded in the database.
Order Tracking: Users can track their order in real-time after placing it.
Delivery Boy Flow:
Order Status Page: Lists available orders for delivery personnel.
Order Acceptance: A delivery boy accepts an order and gets the user’s location.
Live Tracking: The user and delivery boy can track each other’s location

API Endpoints

Method	Endpoint	Description
POST	/api/auth/login	User login
POST	/api/auth/register	User registration
POST	/api/order/book	Place a fuel order
GET	/api/order/status	Get order details
POST	/api/payment	Process payment
Future Enhancements

Implement an admin dashboard for monitoring orders.
Add email/SMS notifications for order updates.
Integrate third-party payment gateways.

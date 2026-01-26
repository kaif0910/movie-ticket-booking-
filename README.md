🎬 Movie Ticket Booking Backend

A production-grade backend for a movie ticket booking system, built with Node.js, Express, MongoDB, and Redis, implementing real-world concurrency control, seat locking, and payment-safe booking flow.
This project focuses on correctness under concurrency, not just CRUD APIs.

🚀 Features
🎟️ Movie show booking with seat selection
🔒 Redis-based seat locking (prevents race conditions)
🧠 MongoDB-enforced seat ownership (prevents double booking)
⏳ Automatic booking expiry (cron-based)
💳 Payment flow with booking confirmation
📩 Email notifications on successful booking
🔐 Role-based access control
📊 Optimized MongoDB indexes for scale
🧱 Crash-safe and restart-safe design

🧩 Tech Stack
Layer	Technology
Backend	Node.js, Express
Database	MongoDB (Mongoose)
Cache / Locks	Redis
Auth	JWT
Payments	Mock / Service-based
Emails	Nodemailer
Scheduler	node-cron

🏗️ System Architecture (High Level)
Client
  ↓
Seat Availability API
  ↓
Redis (temporary locks)
  ↓
Booking Service
  ↓
MongoDB (permanent ownership)
  ↓
Payment Service
  ↓
Booking Confirmation + Email

🔒 Seat Locking & Booking Design (Core Highlight)
🔑 Key Principles
Redis is temporary → handles concurrency
MongoDB is final → enforces permanent seat ownership
Payment does NOT allocate seats → booking does

🪑 Seat Lifecycle
State	Stored Where	Meaning
AVAILABLE	Derived	Free to select
LOCKED	Redis (TTL)	Temporarily held
PROCESSING	MongoDB	Booking initiated
SUCCESSFUL	MongoDB	Permanently booked
CANCELLED / EXPIRED	MongoDB	Seat released
🔐 How Double Booking Is Prevented
1️⃣ Atomic Redis Lock
SET seatlock:{showId}:{seat} NX EX 420s
Prevents concurrent seat selection

2️⃣ MongoDB Unique Index (Final Authority)
bookingSchema.index(
  { showId: 1, seats: 1 },
  { unique: true }
);
Even if Redis fails, MongoDB guarantees correctness

3️⃣ Booking Validation Rules
A seat is considered unavailable if:
Booking status ≠ cancelled or expired
Redis locks

⏳ Booking Expiry Cleanup
Processing bookings expire after 7 minutes
Implemented via node-cron
Ensures seats don’t remain blocked
status: "processing" + createdAt > 7 min → expired

💳 Payment Flow
Seats locked (Redis)
Booking created (processing)
Payment attempted

On success:
Booking → successfull
Redis locks released
Email sent
On failure:
Booking → cancelled

🧠 Why This Design Is Production-Safe
✅ Handles high concurrency
✅ Survives server restarts
✅ Redis crash-safe
✅ Database-enforced correctness
✅ Clean separation of concerns

📂 Project Structure
src/
├── controllers/
├── services/
├── models/
├── routes/
├── middlewares/
├── utils/
└── app.js

⚙️ Setup Instructions
1️⃣ Clone the repo
git clone <repo-url>
cd movie-ticket-booking

2️⃣ Install dependencies
npm install

3️⃣ Start Redis
redis-server

4️⃣ Configure .env
MONGO_URI=your_mongo_url
JWT_SECRET=your_secret
REDIS_URL=redis://127.0.0.1:6379

5️⃣ Start server
npm start

🧪 Testing Scenarios Covered
Two users selecting same seat
Redis TTL expiry
Payment delays
Server restart during booking
Duplicate booking attempts
Seat relock prevention
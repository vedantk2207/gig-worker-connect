# gig-worker-connect
🤝 GigCoop — Cooperative Gig Services Platform
Your Community. Your Services. Your Platform.

GigCoop is a web-based cooperative gig services platform designed to connect skilled and semi-skilled workers with households and communities that need reliable services. The platform aims to strengthen worker cooperatives by providing a digital ecosystem for discovering services, connecting with customers, and managing community-based work opportunities.

The project addresses the challenges faced by labour cooperative federations that lack a centralized digital platform to connect their workers with local household demands.

📌 Project Information
Field	Details
Project Name	GigCoop
Full Title	Cooperative Gig Services Platform for Household & Community Services
Problem Statement ID	SIH26089
Issuing Body	Ministry of Cooperation
Category	Software
Theme	Agriculture, FoodTech & Rural Development
Project Type	Full-Stack Web Application
Frontend Deployment	Vercel
Backend Deployment	Render
Repository	GitHub Repository
🎯 Problem Statement

Labour cooperative federations often lack a robust digital ecosystem to connect their skilled and semi-skilled workers with local household and community service requirements.

As a result, workers may struggle to find consistent employment opportunities, while customers may find it difficult to discover suitable service providers.

GigCoop aims to bridge this gap by creating a centralized digital platform that supports service discovery, worker visibility, community participation, and cooperative-based service delivery.

💡 Proposed Solution

GigCoop provides a digital platform where:

Customers can explore available services.
Workers can showcase their skills and service offerings.
Users can discover relevant service providers.
Customers can explore group booking options.
Cooperative members can participate in community-oriented features.
Users can access platform features through a web interface.

The long-term vision is to support a more transparent, accessible, and cooperative approach to local gig work.

✨ Key Features
1. 🏠 Service Discovery
Browse available household and community services.
Explore service categories.
View service details to help users understand available offerings.
2. 👷 Worker and Provider Dashboard
Dedicated interface for service providers.
Support for presenting worker-related information.
Designed to support worker visibility and service management.
3. 👥 Consumer Dashboard
Dedicated interface for customers.
Provides an entry point for exploring services and customer-oriented features.
4. 🔐 User Registration and Login
Registration and login interfaces.
Intended to support user access and authentication.
Backend authentication and database integration require successful end-to-end verification.
5. 🤝 Group Booking
Interface for exploring group-based service booking.
Designed to encourage community participation and coordinated service requests.
6. 💰 AI-Based Fair Price Calculator
Planned feature for helping users estimate reasonable service prices.
Intended to support greater transparency between customers and workers.
7. 🎯 AI Smart Job Matcher
Planned feature for matching service requirements with relevant worker skills and availability.
8. 🗳️ Community Voting
A dedicated interface for community participation and cooperative decision-making.
9. 📈 Worker Equity
A dedicated interface focused on worker participation and cooperative ownership concepts.
10. 🎁 Referral System
Referral interface intended to encourage community growth and platform adoption.
11. 💳 Subscription Plans
Dedicated page for presenting subscription options and related platform plans.
12. 🌐 Responsive Web Interface
Web pages for the homepage, services, login, registration, dashboards, and additional platform features.

Implementation note: The presence of a page or interface does not necessarily mean its backend functionality is complete. Features should be considered fully implemented only after their workflows have been tested successfully.

🛠️ Technology Stack
Frontend
HTML5
CSS3
JavaScript
Backend
Node.js
Express.js
Database
MongoDB with Mongoose
Authentication and Security
JSON Web Tokens (JWT)
bcryptjs for password hashing
Additional Libraries and Tools
Socket.IO
Multer
Node-Cron
Razorpay integration library
CORS
dotenv
Development Tools
Visual Studio Code / Antigravity IDE
Git
GitHub
npm
Deployment
Frontend: Vercel
Backend: Render
🏗️ System Architecture
                    ┌─────────────────────────┐
                    │        End Users        │
                    │ Customers and Workers   │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     Frontend Website    │
                    │      HTML, CSS, JS      │
                    │         Vercel          │
                    └────────────┬────────────┘
                                 │
                           HTTP / REST API
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │      Backend Server     │
                    │     Node.js + Express   │
                    │         Render          │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │        Database         │
                    │      MongoDB Atlas*     │
                    └─────────────────────────┘

             *Use MongoDB Atlas if configured for deployment.
🌐 Live Deployment
Frontend Website

Live Website: https://gig-worker-connect-client.vercel.app/

Backend API

Backend URL: https://gig-worker-connect.onrender.com

Source Code

GitHub Repository: https://github.com/vedantk2207/gig-worker-connect

Deployment status: The frontend is deployed on Vercel. The backend has been deployed to Render, but a 502 Bad Gateway error has been observed. Backend availability, database connectivity, and registration/login functionality still need to be verified.

📂 Project Structure

The project uses a separate frontend directory and a Node.js backend.

gig-worker-connect/
│
├── client/
│   ├── css/
│   ├── js/
│   ├── locales/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── services.html
│   ├── service-detail.html
│   ├── dashboard-admin.html
│   ├── dashboard-consumer.html
│   ├── dashboard-provider.html
│   ├── group-booking.html
│   ├── equity.html
│   ├── voting.html
│   ├── referral.html
│   └── subscriptions.html
│
├── server/
│   ├── server.js
│   └── ...
│
├── .env
├── .gitignore
├── package.json
└── package-lock.json

Note: The server directory may contain additional files and folders not shown in this overview.

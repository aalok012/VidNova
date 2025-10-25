🎞️ Cinéon 
:The name Cinéon comes from the ancient root “kinein” — to move.
Cinema began with motion; Cinéon keeps that idea alive in code.
It’s built on movement, clarity, and modularity — the same qualities that make great storytelling timeless.

A modular Node.js backend built for storytelling at scale.

Overview

Cinéon is a structured, expressive backend for a modern video-sharing platform. Built on Node.js and Express, it follows a clean architectural rhythm — controllers for logic, models for data, and declarative routes for clarity. Every piece fits together so developers can expand features without breaking flow.

Cinéon handles video, user, playlist, like, subscription, tweet, and comment modules, each with consistent error handling and response standards. Media management runs through Cloudinary, while authentication, uploads, and async control are handled with lightweight middlewares.

🎬 Core Features
	•	RESTful API design across all major entities
	•	Modular structure with controllers, routes, and models clearly separated
	•	Authentication middleware with JWT
	•	File uploads via Multer and Cloudinary integration
	•	Unified error handling through ApiError.js and asyncHandler.js
	•	Standardized success responses with ApiResponse.js
	•	Central database connection in db/index.js for easy persistence swaps
	•	Static files under /public and temporary uploads in /temp
	•	Scalable layout ready for Docker, CI, or cloud deployment
  
  ⚙️ Tech Stack
	•	Node.js + Express.js
	•	MongoDB / Mongoose
	•	Cloudinary SDK for media storage and delivery
	•	JWT Authentication
	•	Multer for file uploads
	•	Docker-ready environment setup

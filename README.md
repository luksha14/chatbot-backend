# 💬 Luka Chatbot API - Portfolio Project

This is the backend (API) component of a custom chatbot designed to serve as a virtual assistant on my personal portfolio website. The project's primary goal is to demonstrate my skills in API development, database integration, and implementing simple Natural Language Processing (NLP) logic.

## 🎯 Project Goal

The main objective was to create a fast and efficient solution for answering common visitor questions, such as inquiries about my projects and skills, by leveraging a flexible NoSQL database structure.

## 💻 Technology Stack

* **Node.js & Express:** Used to build a robust and scalable RESTful API.
* **MongoDB Atlas:** Chosen as the flexible NoSQL database to store Question-Answer (Q&A) pairs, allowing for easy and rapid expansion of the bot's knowledge base.
* **Mongoose:** Employed as the Object Data Modeling (ODM) layer to structure the data and simplify interaction with MongoDB.

## 🧠 Key Implementations

1.  **Schema Design:** Modeling the `QApair` collection for the efficient mapping of user input to bot responses.
2.  **Efficient Search Logic:** Implementing search logic using **MongoDB's `$regex`** operator. This ensures that relevant answers are found directly within the database, eliminating the need to pull the entire dataset into the server's memory.
3.  **Endpoints:** Creation of two key endpoints:
    * `/api/chat`: To process user messages and return an appropriate reply.
    * `/api/chat/learn`: For secure, manual addition of new Q&A pairs to the database (allowing the bot to be 'taught').
4.  **Security & Standards:** Including `cors` support and managing sensitive data (database URI) via a private `.env` file, which is excluded from the Git repository.

## 🔗 Frontend Connection

This API is deployed as a separate service (microservice) on **Render**. My frontend application (portfolio site) sends requests to this API endpoint, ensuring a clean **Separation of Concerns** between the user interface and the core business logic.
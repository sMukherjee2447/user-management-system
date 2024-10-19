# user-management-system (Node.js TypeScript Project)

This project is a RESTful API built using Node.js, Express, and TypeScript, with MongoDB as the database. The project includes user registration, login, profile viewing, and admin functionality, secured with JWT authentication.

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/)

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd <repo-folder>
   ```

2. Install Dependencies:

   npm install

3. Create a .env file at the root of the project and add your configuration variables (you will get the configuaration from .env.example file)

4. Start the development server

   npm run dev

5. Run ESLint to check for code issues

   npm run lint

6. Code Structure :

   src/: Contains all source code.

   controllers/: Handles request and response logic.

   services/: Contains business logic for interacting with the database.

   middlewares/: Custom middleware functions, like authentication and logging.

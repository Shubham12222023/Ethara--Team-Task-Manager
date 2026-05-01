PROJECTMASTER
A Role-Based Project & Task Management Web Application
Live URL: https://content-comfort-production.up.railway.app

================================================================
1. OVERVIEW
================================================================
ProjectMaster is a full-stack web application designed to help teams 
manage projects and track tasks efficiently. It features a modern 
glassmorphic UI, a robust backend REST API, and strict Role-Based 
Access Control (RBAC).

================================================================
2. KEY FEATURES
================================================================
- Authentication: Secure Signup and Login using JWT and bcrypt.
- Role-Based Access Control (RBAC):
  * Admins: Can create projects, create tasks, assign tasks, 
    and manage the entire workflow.
  * Members: Can only view tasks assigned to them and update 
    their task statuses (Pending, In Progress, Completed).
- Dashboard: Provides a bird's-eye view of task statistics 
  (total, pending, completed, overdue).
- Automatic Database Setup: Uses SQLite for effortless local 
  development and automatically switches to PostgreSQL when 
  deployed to a production environment.

================================================================
3. TECHNOLOGY STACK
================================================================
- Frontend: React.js (via Vite), React Router, Axios, Vanilla CSS
- Backend: Node.js, Express.js
- Database: Sequelize ORM, SQLite (Local), PostgreSQL (Production)
- Security: JWT (JSON Web Tokens), bcryptjs

================================================================
4. HOW TO RUN LOCALLY
================================================================
You will need Node.js installed on your machine.

Option A: Run Both Together (Production Simulation)
1. Open a terminal in the root folder.
2. Run "npm run build" to build the React frontend.
3. Run "npm start" to start the Express server (which will serve both the backend APIs and frontend).
4. Visit http://localhost:5000 in your browser.

Option B: Run in Development Mode (Live Reloading)
1. Open a terminal, go to the "server" folder (cd server), and run "npm start".
2. Open a second terminal, go to the "client" folder (cd client), and run "npm run dev".
3. Visit http://localhost:5173 in your browser.

================================================================
5. DEPLOYMENT (RAILWAY)
================================================================
This project is pre-configured to be deployed on Railway with zero friction:
1. Push this repository to GitHub.
2. Log into Railway and select "New Project" -> "Deploy from GitHub repo".
3. Add a PostgreSQL database to your Railway project.
4. Link the database to your web service by adding a "DATABASE_URL" environment variable.
5. Railway will automatically detect the root package.json, install dependencies, build the Vite app, and serve it via Express!

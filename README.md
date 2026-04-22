# Milk Collection Center Web Application

A full-stack web application for a milk collection center. This system helps admins manage farmers, log daily milk entries with automatic price calculations based on fat content, and provides dashboards for both admins and farmers.

## Features

- **Role-Based Access**: Secure login for Admin (owners) and Farmers.
- **Farmer Management**: Admin can add, view, and manage farmers. Each farmer receives a unique padded ID (e.g., `01`, `02`).
- **Automated Calculations**: Calculates price dynamically based on fat percentage via proportional interpolation.
- **Admin Dashboard**: View total milk collected, total earnings, pending payments, and export all records to CSV.
- **Farmer Dashboard**: Farmers can securely log in to see only their personal deliveries and payments.
- **Green Nature Theme**: Clean, responsive, glassmorphism design.

## Tech Stack

- **Frontend**: React (Vite), React Router, Vanilla CSS, Lucide Icons.
- **Backend**: Node.js, Express, jsonwebtoken, bcrypt.
- **Database**: SQLite (local `.sqlite` file for easy deployment / zero setup).

## How to Run

1. **Install Dependencies**:
   Open a terminal in the root directory and run:
   ```bash
   npm install
   npm run build
   ```
2. **Start the application**:
   ```bash
   npm start
   ```
3. **Open in Browser**:
   Visit [http://localhost:3001](http://localhost:3001)
4. **Default Username and Password**
   Username: admin
   Password : admin123

## Deployment

This app uses a root-level `package.json` that builds the React client and serves it automatically through the Express server.
- **Replit**: Seamlessly deploy by just pressing Run.
- **Render/Fly.io**: Since this uses SQLite, ensure you mount a **persistent disk** to save your `database.sqlite` file, or your records will be wiped out when the server restarts. You can set the `DATA_DIR` environment variable to point to your persistent disk mount path.

# Vite Project Setup Guide

This guide provides instructions for setting up and running your Vite project on another computer.

## Prerequisites

Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Git](https://git-scm.com/) (Optional, for cloning the repository)

## Installation Steps

1. **Clone the Repository** (Skip this step if you already have the project folder)
   ```sh
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Install Dependencies**
   ```sh
   npm install
   ```

3. **Start the Development Server**
   ```sh
   npm run dev
   ```
   The application will start, and you can access it at `http://localhost:5173/` (default Vite port).

## Environment Variables
If your project requires environment variables, create a `.env` file in the root directory and add necessary variables:
```
VITE_API_URL=https://api.example.com
```
Ensure you replace the values with the actual ones needed for your project.

## Additional Commands

- **Linting:**
  ```sh
  npm run lint
  ```

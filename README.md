# College ERP System

This repository contains a full-stack web application designed as a trial project for a college Enterprise Resource Planning (ERP) system. It features a React frontend and a Spring Boot backend, enabling students to manage their academic and personal information.

## Features

*   **User Authentication:** Secure sign-up, sign-in, and sign-out functionality.
*   **Password Management:** A password reset feature for users who have forgotten their credentials.
*   **Student Profile Management:** After logging in, students can view and edit their comprehensive profile, which includes:
    *   Academic details (Year, Branch, Programme).
    *   Personal information (DOB, Blood Group, Contact Number).
    *   Address details.
*   **Document Upload:** A dedicated section for uploading essential documents, such as an Aadhar card.
*   **Data Validation:** Both client-side and server-side validation to ensure data integrity.
*   **RESTful API:** A well-structured API built with Spring Boot to handle all data operations.

## Tech Stack

*   **Backend:**
    *   Java (JDK 24)
    *   Spring Boot
    *   Spring Data JPA
    *   Maven
    *   MySQL
*   **Frontend:**
    *   React.js
    *   React Router
    *   Material-UI (MUI)
    *   Axios
    *   Framer Motion

## Project Structure

The repository is organized into two main directories:

```
/
├── backend/  # Contains the Java Spring Boot application
└── ui/       # Contains the React frontend application
```

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

*   Java Development Kit (JDK) 24 or newer
*   Node.js (v16 or newer) and npm
*   MySQL Server

### Backend Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/justastuff/erp-college-trial-project.git
    cd erp-college-trial-project
    ```

2.  **Configure the database:**
    *   Access your MySQL server and create a new database:
        ```sql
        CREATE DATABASE erp_db;
        ```
    *   Navigate to the backend configuration file: `backend/src/main/resources/application.properties`.
    *   Update the database credentials to match your local setup:
        ```properties
        spring.datasource.username=your_mysql_username
        spring.datasource.password=your_mysql_password
        ```

3.  **Run the backend server:**
    *   Navigate to the `backend` directory:
        ```sh
        cd backend
        ```
    *   Run the application using the Maven wrapper:
        ```sh
        ./mvnw spring-boot:run
        ```
    *   The backend server will start on `http://localhost:8080`.

### Frontend Setup

1.  **Navigate to the UI directory:**
    *   Open a new terminal and go to the `ui` directory:
        ```sh
        cd ui
        ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Start the development server:**
    ```sh
    npm start
    ```
    *   The application will automatically open in your web browser at `http://localhost:3000`.

## API Endpoints

The backend provides the following RESTful endpoints:

| Method | Endpoint                    | Description                                |
| :----- | :-------------------------- | :----------------------------------------- |
| `POST` | `/api/signup`               | Registers a new user.                      |
| `POST` | `/api/signin`               | Authenticates and logs in a user.          |
| `GET`  | `/api/user/details`         | Fetches details for the logged-in user.    |
| `PUT`  | `/api/user/update`          | Updates the details of the logged-in user. |
| `POST` | `/auth/reset-password`      | Resets the user's password.                |
| `POST` | `/api/documents/uploadAadhar` | Uploads the user's Aadhar document.      |

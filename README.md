# Hotel Management System

This is a Hotel Management System built with Vue.js. The application allows users to manage guests, rooms, and reservations effectively.

## Features

- **Dashboard**:
  - View and filter guests based on registration date.
  - Filter rooms by their status (Available, Maintenance, Occupied).
  - View and filter reservations by their status (Booked, Terminated).
  - Automatically update reservation statuses based on their end dates.

- **Guest Management**:
  - View and search guests by name, email, or phone.
  - Add new guests.
  - Edit existing guest details.
  - Delete guests from the system.

- **Room Management**:
  - View and search rooms by number, type, or status.
  - Add new rooms to the system.
  - Edit existing room details.
  - Delete rooms from the system.

- **Reservation Management**:
  - View and search reservations by guest name, room number, start date, or end date.
  - Add new reservations while checking room availability.
  - Edit existing reservations.
  - Delete reservations from the system.

## Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/amirakbari4276/-HotelManagement.git
    ```

2. **Set up the local server:**
   
   Ensure you have [json-server](https://github.com/typicode/json-server) installed globally:
     ```bash
     npm install -g json-server
     ```

3. **install dependencies:**
    ```bash
    npm install
    ```


4. **Run the local server:**
    ```bash
    npx json-server db.json
    ```

5. **Run the application:**
    ```bash
    npm run dev
    ```

6. **Open your browser with the given link**

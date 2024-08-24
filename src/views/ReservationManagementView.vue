<template>
  <div class="container">
    <h1>Reservation Management</h1>

    <!-- Search Reservation -->
    <input 
      type="text" 
      v-model="searchQuery" 
      placeholder="Search reservations..." 
      class="search-input" 
    />

    <!-- Add Reservation Form -->
    <transition name="fade">
      <div class="form-container" v-if="showAddForm">
        <h2>Add New Reservation</h2>
        <form @submit.prevent="createReservation" class="reservation-form">
          <label for="guestName">Guest Name:</label>
          <select v-model="newReservation.guestName" required>
            <option v-for="guest in guests" :key="guest.id" :value="guest.name">{{ guest.name }}</option>
          </select>

          <!-- Date Range -->
          <label for="startDate">Start Date:</label>
          <input type="date" v-model="newReservation.startDate" @change="updateAvailableRooms" required />
          
          <label for="endDate">End Date:</label>
          <input type="date" v-model="newReservation.endDate" @change="updateAvailableRooms" required />

          <!-- Room Selection -->
          <div v-if="newReservation.startDate && newReservation.endDate" class="room-selection">
            <label for="roomNumber">Select Room:</label>
            <div class="room-cards">
              <div 
                v-for="room in bookableRooms" 
                :key="room.id" 
                :class="['room-card', { selected: newReservation.roomNumber === room.number }]" 
                @click="newReservation.roomNumber = room.number"
              >
                <h3>Room {{ room.number }}</h3>
                <p>Type: {{ room.type }}</p>
                <p>Status: {{ room.status }}</p>
              </div>
            </div>
            <div v-if="!bookableRooms.length" class="no-rooms-message">
              No rooms available for the selected dates.
            </div>
          </div>

          <div v-if="!newReservation.startDate || !newReservation.endDate" class="no-dates-message">
            Please select start and end dates to see available rooms.
          </div>

          <div class="form-buttons">
            <button type="submit" class="btn btn-primary" :disabled="!bookableRooms.length || !newReservation.roomNumber">
              Add Reservation
            </button>
            <button type="button" @click="showAddForm = false" class="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </transition>

    <!-- Edit Reservation Form -->
    <transition name="fade">
      <div class="form-container" v-if="showEditForm">
        <h2>Edit Reservation</h2>
        <form @submit.prevent="updateReservation" class="reservation-form">
          <label for="guestName">Guest Name:</label>
          <input type="text" v-model="editReservationData.guestName" required />

          <!-- Date Range -->
          <label for="startDate">Start Date:</label>
          <input type="date" v-model="editReservationData.startDate" @change="updateAvailableRooms" required />
          
          <label for="endDate">End Date:</label>
          <input type="date" v-model="editReservationData.endDate" @change="updateAvailableRooms" required />

          <!-- Room Selection -->
          <div v-if="editReservationData.startDate && editReservationData.endDate" class="room-selection">
            <label for="roomNumber">Select Room:</label>
            <div class="room-cards">
              <div 
                v-for="room in availableRooms" 
                :key="room.id" 
                :class="['room-card', { selected: editReservationData.roomNumber === room.number }]" 
                @click="editReservationData.roomNumber = room.number"
              >
                <h3>Room {{ room.number }}</h3>
                <p>Type: {{ room.type }}</p>
                <p>Status: {{ room.status }}</p>
              </div>
            </div>
            <div v-if="!availableRooms.length" class="no-rooms-message">
              No rooms available for the selected dates.
            </div>
          </div>

          <div v-if="!editReservationData.startDate || !editReservationData.endDate" class="no-dates-message">
            Please select start and end dates to see available rooms.
          </div>

          <div class="form-buttons">
            <button type="submit" class="btn btn-primary" :disabled="!availableRooms.length || !editReservationData.roomNumber">
              Update Reservation
            </button>
            <button type="button" @click="showEditForm = false" class="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </transition>

    <!-- List of Reservations -->
    <button @click="showAddForm = true" class="btn btn-primary">Add Reservation</button>
    <ul class="reservation-list">
      <li v-for="reservation in filteredReservations" :key="reservation.id" class="reservation-item">
        Guest: {{ reservation.guestName }} - Room: {{ reservation.roomNumber }} <br> Date: {{ reservation.startDate.split('T')[0] }} - {{ reservation.endDate.split('T')[0] }} - Status: {{ reservation.status }}
        <div class="action-buttons">
          <button @click="editReservation(reservation)" class="btn btn-warning">Edit</button>
          <button @click="deleteReservation(reservation.id)" class="btn btn-danger">Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ReservationManagementView',
  data() {
    return {
      reservations: [],
      rooms: [],
      guests: [],
      availableRooms: [],
      bookableRooms: [],
      // Boolean to control the visibility of the add reservation form
      showAddForm: false,
      showEditForm: false,
      // Object to hold data for creating a new reservation
      newReservation: {
        guestName: '',     
        roomNumber: '',   
        startDate: '',     
        endDate: '',       
        status: 'Booked'   
      },
      // Object to hold data for editing an existing reservation
      editReservationData: {
        id: null,          
        guestName: '',     
        roomNumber: '',   
        startDate: '',     
        endDate: ''        
      },
      // Search query for filtering reservations
      searchQuery: ''
    };
  },
  computed: {
    filteredReservations() {
      if (!this.searchQuery) {
        return this.reservations; // Return all reservations if no search query
      }
      const query = this.searchQuery.toLowerCase();
      // Filter reservations based on guest name, room number, start date, or end date matching the search query
      return this.reservations.filter(reservation => {
        const guestName = reservation.guestName?.toLowerCase() || '';
        const roomNumber = reservation.roomNumber?.toString() || '';
        const startDate = reservation.startDate || '';
        const endDate = reservation.endDate || '';

        return (
          guestName.includes(query) ||
          roomNumber.includes(query) ||
          startDate.includes(query) ||
          endDate.includes(query)
        );
      });
    }
  },
  methods: {
    async fetchGuests() {
      try {
        const response = await axios.get('http://localhost:3000/guests');
        this.guests = response.data; 
      } catch (error) {
        console.error('Error fetching guests:', error);
      }
    },
    async fetchReservations() {
      try {
        const response = await axios.get('http://localhost:3000/reservations');
        this.reservations = response.data; 
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    },
    async fetchRooms() {
      try {
        const response = await axios.get('http://localhost:3000/rooms');
        this.rooms = response.data; 
        this.availableRooms = this.rooms.filter(room => room.status === 'Available'); // Filter rooms based on 'Available' status
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    },
    updateAvailableRooms() {
      if (!this.newReservation.startDate || !this.newReservation.endDate) {
        this.bookableRooms = []; // Clear bookable rooms if dates are not provided
        return;
      }

      const startDate = new Date(this.newReservation.startDate);
      const endDate = new Date(this.newReservation.endDate);

      // Filter available rooms to exclude those that overlap with existing reservations
      this.bookableRooms = this.availableRooms.filter(room => {
        return !this.reservations.some(reservation => {
          const resStartDate = new Date(reservation.startDate);
          const resEndDate = new Date(reservation.endDate);

          // Check for overlap between new reservation dates and existing reservation dates
          return (
            reservation.roomNumber === room.number &&
            ((startDate >= resStartDate && startDate <= resEndDate) ||
             (endDate >= resStartDate && endDate <= resEndDate) ||
             (startDate <= resStartDate && endDate >= resEndDate))
          );
        });
      });
    },
    async createReservation() {
      try {
        const response = await axios.post('http://localhost:3000/reservations', this.newReservation);
        this.reservations.push(response.data); // Add the new reservation to the reservations array
        this.newReservation = { guestName: '', roomNumber: '', startDate: '', endDate: '', status: 'Booked' }; // Reset the form
        this.showAddForm = false; // Hide the add form
        this.updateAvailableRooms(); // Update available rooms
      } catch (error) {
        console.error('Error adding reservation:', error);
      }
    },
    async updateReservation() {
      try {
        await axios.put(`http://localhost:3000/reservations/${this.editReservationData.id}`, this.editReservationData);
        this.fetchReservations(); // Refresh the list of reservations
        this.showEditForm = false; // Hide the edit form
        this.updateAvailableRooms(); // Update available rooms
      } catch (error) {
        console.error('Error updating reservation:', error);
      }
    },
    editReservation(reservation) {
      this.editReservationData = { ...reservation }; // Clone the reservation data into editReservationData
      this.showEditForm = true; // Show the edit form
    },
    async deleteReservation(id) {
      try {
        await axios.delete(`http://localhost:3000/reservations/${id}`);
        this.fetchReservations(); // Refresh the list of reservations
      } catch (error) {
        console.error('Error deleting reservation:', error);
      }
    }
  },
  created() {
    this.fetchGuests();
    this.fetchReservations();
    this.fetchRooms();
  }
};
</script>

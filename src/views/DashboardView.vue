<template>
  <div class="dashboard">
    <header>
      <h1>Hotel Management Dashboard</h1>
    </header>

    <div class="summary-cards">
      <div class="card">
        <h2>Total Guests</h2>
        <p>{{ guests.length }}</p>
      </div>
      <div class="card">
        <h2>Total Rooms</h2>
        <p>{{ rooms.length }}</p>
      </div>
      <div class="card">
        <h2>Total Reservations</h2>
        <p>{{ reservations.filter(reservation => reservation.status === 'Booked').length }}</p>
      </div>
    </div>

    <div class="section">
      <h2>Guests List</h2>
      <input type="date" v-model="guestFilter" class="filter-input" placeholder="Select a date">
      <table class="main-table">
        <thead>
          <tr>
            <th><i class="fas fa-user"></i> Full Name</th>
            <th><i class="fas fa-envelope"></i> Email</th>
            <th><i class="fas fa-phone"></i> Phone</th>
            <th><i class="fas fa-calendar-alt"></i> Registered on</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="guest in filteredGuests" :key="guest.id">
            <td>{{ guest.name }}</td>
            <td>{{ guest.email }}</td>
            <td>{{ guest.phone }}</td>
            <td>{{ formatDate(guest.registrationDate) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>Rooms Status</h2>
      <select v-model="roomFilter" class="filter-select">
        <option value="All">All</option>
        <option value="Available">Available</option>
        <option value="Occupaid">Occupaid</option>
        <option value="Maintenance">Maintenance</option>
      </select>
      <table class="main-table">
        <thead>
          <tr>
            <th>Room Number</th>
            <th>Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="room in filteredRooms" :key="room.id">
            <td>{{ room.number }}</td>
            <td>{{ room.type }}</td>
            <td :class="statusClass(room.status)">{{ room.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>Reservations</h2>
      <select v-model="reservationFilter" class="filter-select">
        <option value="All">All</option>
        <option value="Booked">Booked</option>
        <option value="Terminated">Terminated</option>
      </select>
      <table class="main-table">
        <thead>
          <tr>
            <th>Guest Name</th>
            <th>Room Number</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reservation in filteredReservations" :key="reservation.id">
            <td>{{ reservation.guestName }}</td>
            <td>{{ reservation.roomNumber }}</td>
            <td>{{ formatDate(reservation.date) }}</td>
            <td :class="statusClass(reservation.status)">{{ reservation.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  name: 'Dashboard',
  data() {
    return {
      guests: [],
      rooms: [],
      reservations: [],
      guestFilter: '',
      roomFilter: 'All',
      reservationFilter: 'All'
    };
  },
  computed: {
    filteredGuests() {
      if (!this.guestFilter) {
        return this.guests;
      }
      return this.guests.filter(guest => 
        new Date(guest.registrationDate) >= new Date(this.guestFilter)
      );
    },
    filteredRooms() {
      if (this.roomFilter === 'All') {
        return this.rooms;
      }
      return this.rooms.filter(room => room.status === this.roomFilter);
    },
    filteredReservations() {
      if (this.reservationFilter === 'All') {
        return this.reservations;
      }
      return this.reservations.filter(reservation => reservation.status === this.reservationFilter);
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
    async fetchRooms() {
      try {
        const response = await axios.get('http://localhost:3000/rooms');
        this.rooms = response.data;
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    },
    async fetchReservations() {
      try {
        const response = await axios.get('http://localhost:3000/reservations');
        this.reservations = response.data;
        const now = new Date();
        for (const reservation of this.reservations) {
          const endDate = new Date(reservation.endDate);
          // Check if the reservation end date has passed and status is not 'Terminated' change it to 'Terminated'
          if (endDate < now && reservation.status !== 'Terminated') {
            reservation.status = 'Terminated';
            try {
              await axios.put(`http://localhost:3000/reservations/${reservation.id}`, reservation);
            } catch (error) {
              console.error(`Error updating reservation ${reservation.id}:`, error);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    },
    // Method to format date strings into a readable format
    formatDate(dateStr) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    },
    // Method to return CSS classes based on the status
    statusClass(status) {
      return {
        'available': status === 'Available',
        'maintenance': status === 'Maintenance',
        'occupaid': status === 'Occupaid',
        'booked': status === 'Booked',
        'terminated': status === 'Terminated'
      };
    }
  },
  mounted() {
    this.fetchGuests();
    this.fetchRooms();
    this.fetchReservations();
  }
};
</script>

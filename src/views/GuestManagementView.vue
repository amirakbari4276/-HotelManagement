<template>
  <div class="container">
    <h1>Guest Management</h1>

    <!-- Search Guest -->
    <input type="text" v-model="searchQuery" placeholder="Search guests..." class="search-input" />

    <!-- Add Guest Form -->
    <transition name="fade">
      <div v-if="showAddForm" class="form-container">
        <h2>Add New Guest</h2>
        <form @submit.prevent="createGuest" class="guest-form">
          <label for="name">Full Name:</label>
          <input type="text" v-model="newGuest.name" required />

          <label for="email">Email:</label>
          <input type="email" v-model="newGuest.email" required />

          <label for="phone">Phone:</label>
          <input type="text" v-model="newGuest.phone" required />

          <div class="form-buttons">
            <button type="submit" class="btn btn-primary">Add Guest</button>
            <button type="button" @click="showAddForm = false" class="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </transition>

    <!-- Edit Guest Form -->
    <transition name="fade">
      <div v-if="showEditForm" class="form-container">
        <h2>Edit Guest</h2>
        <form @submit.prevent="updateGuest" class="guest-form">
          <label for="name">Name:</label>
          <input type="text" v-model="editGuestData.name" required />

          <label for="email">Email:</label>
          <input type="email" v-model="editGuestData.email" required />

          <label for="phone">Phone:</label>
          <input type="text" v-model="editGuestData.phone" required />

          <div class="form-buttons">
            <button type="submit" class="btn btn-primary">Update Guest</button>
            <button type="button" @click="showEditForm = false" class="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </transition>

    <!-- List of Guests -->
    <button @click="showAddForm = true" class="btn btn-primary">Add Guest</button>
    <ul class="guest-list">
      <li v-for="guest in filteredGuests" :key="guest.id" class="guest-item">
        {{ guest.name }} - {{ guest.email }} - {{ guest.phone }}
        <div class="action-buttons">
          <button @click="editGuest(guest)" class="btn btn-warning">Edit</button>
          <button @click="deleteGuest(guest.id)" class="btn btn-danger">Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'GuestManagementView',
  data() {
    return {
      guests: [],
      // Boolean to control the visibility of the add guest form
      showAddForm: false,
      showEditForm: false,
      // Object to hold data for creating a new guest
      newGuest: {
        name: '',   
        email: '',  
        phone: ''   
      },
      // Object to hold data for editing an existing guest
      editGuestData: {
        id: null,   
        name: '',   
        email: '', 
        phone: ''   
      },
      // Search query for filtering guests
      searchQuery: ''
    };
  },
  computed: {
    filteredGuests() {
      if (!this.searchQuery) {
        return this.guests; // Return all guests if no search query
      }
      const query = this.searchQuery.toLowerCase();
      // Filter guests based on name, email, or phone matching the search query
      return this.guests.filter(guest =>
        guest.name.toLowerCase().includes(query) ||
        guest.email.toLowerCase().includes(query) ||
        guest.phone.includes(query)
      );
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
    async createGuest() {
      try {
        const response = await axios.post('http://localhost:3000/guests', this.newGuest);
        this.guests.push(response.data); // Add the new guest to the guests array
        this.newGuest = { name: '', email: '', phone: '' }; // Reset the form
        this.showAddForm = false; // Hide the add form
      } catch (error) {
        console.error('Error adding guest:', error);
      }
    },
    editGuest(guest) {
      this.editGuestData = { ...guest }; // Clone the guest data into editGuestData
      this.showEditForm = true; 
    },
    async updateGuest() {
      try {
        await axios.put(`http://localhost:3000/guests/${this.editGuestData.id}`, this.editGuestData);
        this.fetchGuests(); // Refresh the list of guests
        this.showEditForm = false; // Hide the edit form
      } catch (error) {
        console.error('Error updating guest:', error);
      }
    },
    async deleteGuest(id) {
      try {
        await axios.delete(`http://localhost:3000/guests/${id}`);
        this.guests = this.guests.filter(guest => guest.id !== id); 
      } catch (error) {
        console.error('Error deleting guest:', error);
      }
    }
  },
  mounted() {
    this.fetchGuests();
  }
};
</script>


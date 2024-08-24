<template>
  <div class="container">
    <h1>Room Management</h1>

    <!-- Search Room -->
    <input type="text" v-model="searchQuery" placeholder="Search rooms..." class="search-input" />

    <!-- Add Room Form -->
    <transition name="fade">
      <div v-if="showAddForm" class="form-container">
        <h2>Add New Room</h2>
        <form @submit.prevent="createRoom" class="room-form">
          <label for="number">Room Number:</label>
          <input type="text" v-model="newRoom.number" required />

          <label for="type">Room Type:</label>
          <select v-model="newRoom.type">
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Suite">Suite</option>
          </select>

          <label for="status">Room Status:</label>
          <select v-model="newRoom.status">
            <option value="Available">Available</option>
            <option value="occupaid">occupaid</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          <div class="form-buttons">
            <button type="submit" class="btn btn-primary">Add Room</button>
            <button type="button" @click="showAddForm = false" class="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </transition>

    <!-- Edit Room Form -->
    <transition name="fade">
      <div v-if="showEditForm" class="form-container">
        <h2>Edit Room</h2>
        <form @submit.prevent="updateRoom" class="room-form">
          <label for="number">Room Number:</label>
          <input type="text" v-model="editRoomData.number" required />

          <label for="type">Room Type:</label>
          <input type="text" v-model="editRoomData.type" required />

          <label for="status">Room Status:</label>
          <select v-model="editRoomData.status">
            <option value="Available">Available</option>
            <option value="Booked">Booked</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          <div class="form-buttons">
            <button type="submit" class="btn btn-primary">Update Room</button>
            <button type="button" @click="showEditForm = false" class="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </transition>

    <!-- List of Rooms -->
    <button @click="showAddForm = true" class="btn btn-primary">Add Room</button>
    <ul class="room-list">
      <li v-for="room in filteredRooms" :key="room.id" class="room-item">
        Room: {{ room.number }} - Type: {{ room.type }} - Status: {{ room.status }}
        <div class="action-buttons">
          <button @click="editRoom(room)" class="btn btn-warning">Edit</button>
          <button @click="deleteRoom(room.id)" class="btn btn-danger">Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RoomManagementView',
  data() {
    return {
      rooms: [],
      // Boolean to control the visibility of the add room form
      showAddForm: false,
      showEditForm: false,
      // Object to hold data for creating a new room
      newRoom: {
        number: '',      
        type: 'Single', 
        status: 'Available' 
      },
      // Object to hold data for editing an existing room
      editRoomData: {
        id: null,        
        number: '',      
        type: '',        
        status: 'Available' 
      },
      // Search query for filtering rooms
      searchQuery: ''
    };
  },
  computed: {
    filteredRooms() {
      if (!this.searchQuery) {
        return this.rooms; // Return all rooms if no search query
      }
      const query = this.searchQuery.toLowerCase();
      // Filter rooms based on number, type, or status matching the search query
      return this.rooms.filter(room =>
        room.number.toLowerCase().includes(query) ||
        room.type.toLowerCase().includes(query) ||
        room.status.toLowerCase().includes(query)
      );
    }
  },
  methods: {
    async fetchRooms() {
      try {
        const response = await axios.get('http://localhost:3000/rooms');
        this.rooms = response.data; // Update the rooms array with fetched data
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    },
    async createRoom() {
      try {
        const response = await axios.post('http://localhost:3000/rooms', this.newRoom);
        this.rooms.push(response.data); // Add the new room to the rooms array
        this.newRoom = { number: '', type: '', status: 'Available' }; // Reset the form
        this.showAddForm = false; // Hide the add form
      } catch (error) {
        console.error('Error adding room:', error);
      }
    },
    async editRoom(room) {
      this.editRoomData = { ...room }; // Clone the room data into editRoomData
      this.showEditForm = true; // Show the edit form
    },
    async updateRoom() {
      try {
        await axios.put(`http://localhost:3000/rooms/${this.editRoomData.id}`, this.editRoomData);
        this.fetchRooms(); // Refresh the list of rooms
        this.showEditForm = false; // Hide the edit form
      } catch (error) {
        console.error('Error updating room:', error);
      }
    },
    async deleteRoom(id) {
      try {
        await axios.delete(`http://localhost:3000/rooms/${id}`);
        this.rooms = this.rooms.filter(room => room.id !== id); // Remove the deleted room from the list
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
  },
  mounted() {
    this.fetchRooms();
  }
};
</script>

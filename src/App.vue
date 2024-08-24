<template>
  <div id="app">
    <header>
      <h1>Hotel Management System</h1>
      <nav>
        <router-link to="/">Dashboard</router-link>
        <router-link to="/rooms">Room Management</router-link>
        <router-link to="/reservations">Reservation Management</router-link>
        <router-link to="/guests">Guest Management</router-link>
      </nav>
    </header>
    <main>
      <router-view></router-view>
    </main>

  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

header {
  background-color: #007bff;
  color: white;
  padding: 10px 0;
  margin-bottom: 20px;
}

header h1 {
  margin: 0;
  font-size: 2em;
}

nav {
  margin: 10px 0;
}

nav a {
  color: white;
  margin: 0 15px;
  text-decoration: none;
}

nav a.router-link-exact-active {
  font-weight: bold;
  border-bottom: 2px solid white;
}

main {
  padding: 20px;
}

footer {
  margin-top: 20px;
  background-color: #f7f7f7;
  padding: 10px 0;
  border-top: 1px solid #e1e1e1;
}
</style>

import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue';
import RoomManagementView from '../views/RoomManagementView.vue';
// import ReservationManagementView from '../views/ReservationManagement/ReservationManagementView.vue';
import ReservationManagementView from '../views/ReservationManagementView.vue';
import GuestManagementView from '../views/GuestManagementView.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: DashboardView
    },
    {
      path: '/rooms',
      name: 'RoomManagement',
      component: RoomManagementView
    },
    {
      path: '/reservations',
      name: 'ReservationManagement',
      component: ReservationManagementView
    },
    {
      path: '/guests',
      name: 'GuestManagement',
      component: GuestManagementView
    },
  ]
})

export default router

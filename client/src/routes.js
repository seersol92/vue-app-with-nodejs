import Home from './components/Home.vue'
import Login from './components/auth/Login'
import Register from './components/auth/Register.vue'
import Profile from './components/dashboard/Profile'
import UserManagement from './components/dashboard/UserManagement'
export const routes = [

    { 
        path: '/',
        component: Home,
        name: 'home' 
    },

    { 
        path: '/login',
        component: Login,
        name: 'login',
        meta: {
            requiresVisitor: true,
        }
    },

    { 
        path: '/register',
        component: Register,
        name: 'register',
        meta: {
            requiresVisitor: true,
        }
    },

    {
        path: '/profile',
        component: Profile,
        name: 'profile',
        meta: {
            requiresAuth: true,
        }
    },

    {
        path: '/user-management',
        component: UserManagement,
        name: 'user-management',
        meta: {
            requiresAuth: true,
        }
    },

    {
        path: '*',
        redirect: '/'
  }
];

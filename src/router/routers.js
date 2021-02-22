let routers = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/main',
        name: 'Main',
        component: () => import('../views/Main.vue')
    },
    {
        path: '/build',
        name: 'Build',
        component: () => import('../views/Build.vue')
    },
    {
        path: '/radio',
        name: 'Radio',
        component: () => import('../views/Radio.vue')
    },
    {
        path: '/search',
        name: 'Search',
        component: () => import('../views/Search.vue')
    },

];



export default routers; 
import Vue from 'vue';
import Router from 'vue-router';


Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import('../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import('../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/customer',
                    component: () => import('../components/common/layout.vue'),
                    meta: {
                        title: '客户管理',
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import ('../components/page/customer/index.vue'),
                            meta: {
                                title: '客户列表'
                            }
                        }
                    ]
                },
                {
                    path: '/good',
                    component: () => import('../components/common/layout.vue'),
                    meta: {
                        title: '商品管理',
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import ('../components/page/good/index.vue'),
                            meta: {
                                title: '商品列表'
                            }
                        }
                    ]
                },
                {
                    path: '/order',
                    component: () => import('../components/common/layout.vue'),
                    meta: {
                        title: '订单管理',
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import ('../components/page/order/index.vue'),
                            meta: {
                                title: '订单列表'
                            }
                        }
                    ]
                },
                {
                    path: '/stock',
                    component: () => import('../components/common/layout.vue'),
                    meta: {
                        title: '进货单管理',
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import ('../components/page/stock/index.vue'),
                            meta: {
                                title: '进货单列表'
                            }
                        }
                    ]
                },
                {
                    path: '/404',
                    component: () => import('../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import('../components/page/403.vue'),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import('../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});

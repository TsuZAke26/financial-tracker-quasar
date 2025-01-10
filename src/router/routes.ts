import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: () => import('layouts/MainLayout.vue'),
		children: [
			{
				path: '',
				name: 'home',
				component: () => import('pages/IndexPage.vue'),
			},
			{
				path: '/settings',
				name: 'settings',
				component: () => import('pages/SettingsPage.vue'),
			},
			{
				path: '/accounts/:id',
				name: 'account',
				component: () => import('pages/AccountPage.vue'),
				props: true,
			},
		],
		meta: {
			auth: true,
		},
	},

	{
		path: '/auth',
		component: () => import('layouts/AuthLayout.vue'),
		children: [
			{
				path: '',
				name: 'auth',
				component: () => import('src/pages/AuthPage.vue'),
			},
		],
	},

	// Always leave this as last one,
	// but you can also remove it
	{
		path: '/:catchAll(.*)*',
		component: () => import('pages/ErrorNotFound.vue'),
	},
];

export default routes;

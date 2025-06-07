<template>
	<q-layout view="lHh Lpr lFf">
		<q-header>
			<q-toolbar>
				<q-btn
					@click="toggleLeftDrawer"
					aria-label="Menu"
					icon="menu"
					dense
					flat
					round
				/>

				<q-toolbar-title> Financial Tracker </q-toolbar-title>
			</q-toolbar>
		</q-header>

		<q-drawer v-model="leftDrawerOpen" bordered show-if-above>
			<q-list>
				<DrawerItem
					v-for="drawerItem in drawerItems"
					:key="drawerItem.title"
					v-bind="drawerItem"
				/>
				<q-item @click="handleLogout" clickable>
					<q-item-section avatar>
						<q-icon name="logout" />
					</q-item-section>

					<q-item-section>
						<q-item-label>Log Out</q-item-label>
					</q-item-section>
				</q-item>
			</q-list>
		</q-drawer>

		<q-page-container class="q-mb-xl">
			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Dark } from 'quasar';

import { useNotify } from 'src/composables/useNotify';
import { anonClient } from 'src/supabase/anon-client';

import DrawerItem, {
	type DrawerItemProps,
} from 'src/components/DrawerItem.vue';

const drawerItems: DrawerItemProps[] = [
	{
		title: 'Home',
		icon: 'home',
		to: '/',
	},
	{
		title: 'Settings',
		icon: 'settings',
		to: '/settings',
	},
];
const leftDrawerOpen = ref(false);
function toggleLeftDrawer() {
	leftDrawerOpen.value = !leftDrawerOpen.value;
}

const router = useRouter();

const handleLogout = async () => {
	const { error } = await anonClient.auth.signOut();
	if (error) {
		useNotify('negative', 'Sign Out Failed', error.message);
	} else {
		Dark.set(false);
		router.push('/auth');
	}
};
</script>

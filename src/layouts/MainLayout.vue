<template>
	<q-layout view="lHh Lpr lFf">
		<q-header elevated>
			<q-toolbar>
				<q-btn
					flat
					dense
					round
					icon="menu"
					aria-label="Menu"
					@click="toggleLeftDrawer"
				/>

				<q-toolbar-title> Financial Tracker </q-toolbar-title>

				<!-- <div>Quasar v{{ $q.version }}</div> -->
			</q-toolbar>
		</q-header>

		<q-drawer v-model="leftDrawerOpen" show-if-above bordered>
			<q-list>
				<DrawerItem
					v-for="drawerItem in drawerItems"
					:key="drawerItem.title"
					v-bind="drawerItem"
				/>
			</q-list>
		</q-drawer>

		<q-page-container>
			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
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
</script>

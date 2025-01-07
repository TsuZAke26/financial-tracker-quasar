<template>
	<router-view />
</template>

<script setup lang="ts">
import { anonClient } from './supabase/anon-client';
import { storeUser } from './stores/user';

const user = storeUser();
const { loadAppSettings } = user;

anonClient.auth.onAuthStateChange(async (event) => {
	if (event === 'SIGNED_IN') {
		console.log('Signed in');
		loadAppSettings();
	}
});
</script>

<template>
	<router-view />
</template>

<script setup lang="ts">
import { anonClient } from './supabase/anon-client';
import { storeUser } from './stores/user';
import { storeAccounts } from './stores/accounts';

const user = storeUser();
const { loadAppSettings } = user;

const accounts = storeAccounts();
const { loadAccounts } = accounts;

anonClient.auth.onAuthStateChange(async (event) => {
	if (event === 'SIGNED_IN') {
		console.log('Signed in');
		loadAppSettings();
		loadAccounts();
	}
});
</script>

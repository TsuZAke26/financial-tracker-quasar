<template>
	<router-view />
</template>

<script setup lang="ts">
import { storeUser } from './stores/user';
import { storeAccounts } from './stores/accounts';
import { anonClient } from './supabase/anon-client';

const user = storeUser();
const { loadAppSettings } = user;

const accounts = storeAccounts();
const { loadAccounts } = accounts;

anonClient.auth.onAuthStateChange(async (event) => {
	if (event === 'SIGNED_IN') {
		loadAppSettings();
		loadAccounts();
	}
});
</script>

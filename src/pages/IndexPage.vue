<template>
	<q-page class="row items-start justify-evenly q-pa-lg q-mb-xl">
		<AccountsList />
		<q-page-sticky :offset="[24, 24]" position="bottom-right">
			<q-btn
				@click="showAddAccountDialog"
				color="secondary"
				icon="add"
				label="Account"
				fab
			/>
		</q-page-sticky>
	</q-page>
</template>

<script setup lang="ts">
import { Dialog } from 'quasar';

import AccountsList from 'src/components/AccountsList.vue';
import AddAccount from 'src/components/AddAccount.vue';

const showAddAccountDialog = () => {
	Dialog.create({
		component: AddAccount,
	});
};
</script>

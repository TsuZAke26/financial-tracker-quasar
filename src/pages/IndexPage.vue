<template>
	<q-page class="row items-start justify-evenly q-pa-lg q-mb-xl">
		<AccountsList />
		<q-page-sticky position="bottom-right" :offset="[24, 24]">
			<q-btn
				fab
				icon="add"
				color="secondary"
				label="Account"
				@click="showAddAccountDialog"
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
	}).onOk(() => console.log('add account form: ok'));
};
</script>

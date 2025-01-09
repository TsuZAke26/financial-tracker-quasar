<template>
	<q-page class="row items-start justify-evenly q-pa-lg">
		<Suspense>
			<AccountsList />
			<template #fallback> Loading... </template>
		</Suspense>
	</q-page>
</template>

<script setup lang="ts">
import AccountsList from 'src/components/AccountsList.vue';
</script>

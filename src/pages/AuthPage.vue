<template>
	<q-page class="row items-start justify-evenly q-pa-lg">
		<SignInForm v-if="authView === 'sign-in'" @sign-up="authView = 'sign-up'" />
		<SignUpForm v-if="authView === 'sign-up'" @sign-in="authView = 'sign-in'" />
	</q-page>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';

import SignInForm from 'src/components/SignInForm.vue';
import SignUpForm from 'src/components/SignUpForm.vue';

const authView: Ref<'sign-in' | 'sign-up'> = ref('sign-in');
</script>

<style scoped></style>

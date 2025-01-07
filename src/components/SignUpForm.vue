<template>
	<q-card flat bordered class="sign-up-card">
		<q-card-section class="text-h5 text-weight-bold">Sign Up</q-card-section>
		<q-card-section>
			<q-form @submit="handleSignUp">
				<q-input
					v-model="username"
					outlined
					type="email"
					label="Username"
					:rules="[(val, rules) => rules.email(val) || 'Enter a valid email']"
					lazy-rules
				/>
				<q-input
					v-model="password"
					outlined
					type="password"
					label="Password"
					:rules="[(val) => !!val || 'Enter a password']"
					lazy-rules
				/>
				<q-btn
					label="Register"
					type="submit"
					class="full-width"
					color="primary"
				/>
			</q-form>
		</q-card-section>
		<q-card-section class="row justify-center">
			<div>
				Already registered?
				<a href="#" @click="$emit('sign-in')">Sign in here</a>
			</div>
		</q-card-section>
	</q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineEmits(['sign-in']);

const username = ref('');
const password = ref('');

const handleSignUp = async () => {};
</script>

<style scoped>
.sign-up-card {
	width: 400px;
	height: 100%;
}
</style>

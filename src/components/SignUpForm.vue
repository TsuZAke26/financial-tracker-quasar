<template>
	<q-card flat bordered class="sign-up-card">
		<q-card-section class="text-h5 text-weight-bold">Sign Up</q-card-section>
		<q-card-section>
			<q-form @submit="handleSignUp">
				<q-input
					v-model="email"
					outlined
					type="email"
					label="Email Address"
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
import { useRouter } from 'vue-router';
import type { AuthError } from '@supabase/supabase-js';

import { useNotify } from 'src/composables/useNotify';
import { anonClient } from 'src/supabase/anon-client';

defineEmits(['sign-in']);

const router = useRouter();

const email = ref('');
const password = ref('');

const handleSignUp = async () => {
	try {
		const { data, error } = await anonClient.auth.signUp({
			email: email.value,
			password: password.value,
		});
		if (error) {
			throw error;
		}
		if (data) {
			useNotify('positive', 'Registered successfully!');
			router.push({ name: 'home' });
		}
	} catch (error) {
		const supabaseError = error as AuthError;
		useNotify('negative', 'Login Failed', supabaseError.message);
		console.error(supabaseError);
	}
};
</script>

<style scoped>
.sign-up-card {
	width: 400px;
	height: 100%;
}
</style>

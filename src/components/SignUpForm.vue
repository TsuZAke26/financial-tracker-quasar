<template>
	<q-card class="sign-up-card" bordered flat>
		<q-card-section class="text-h5 text-weight-bold">Sign Up</q-card-section>
		<q-card-section>
			<q-form @submit="handleSignUp">
				<q-input
					v-model="email"
					:rules="[(val, rules) => rules.email(val) || 'Enter a valid email']"
					label="Email Address"
					type="email"
					lazy-rules
					outlined
				/>
				<q-input
					v-model="password"
					:rules="[(val) => !!val || 'Enter a password']"
					label="Password"
					type="password"
					lazy-rules
					outlined
				/>
				<q-btn
					class="full-width"
					color="primary"
					label="Register"
					type="submit"
				/>
			</q-form>
		</q-card-section>
		<q-card-section class="row justify-center">
			<div>
				Already registered?
				<a @click="$emit('sign-in')" href="#">Sign in here</a>
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

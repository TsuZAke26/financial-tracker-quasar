<template>
	<q-card flat bordered class="sign-in-card">
		<q-card-section class="text-h5 text-weight-bold">Sign In</q-card-section>
		<q-card-section>
			<q-form @submit="handleSignIn">
				<q-input
					v-model="email"
					outlined
					type="email"
					label="Email Address"
					:rules="[(val, rules) => rules.email(val) || 'Enter a valid email']"
					lazy-rules
				/>
				<q-input
					v-if="usePassword"
					v-model="password"
					outlined
					type="password"
					label="Password"
					:rules="[(val) => !!val || 'Enter a password']"
					lazy-rules
				/>
				<q-toggle v-model="usePassword" label="Use password instead" />
				<q-btn
					label="Sign In"
					type="submit"
					class="full-width q-mt-lg"
					color="primary"
				/>
			</q-form>
		</q-card-section>
		<q-card-section class="row justify-center">
			<div>
				Not registered yet?
				<a href="#" @click="$emit('sign-up')">Sign up here</a>
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

defineEmits(['sign-up']);

const router = useRouter();

const usePassword = ref(false);
const email = ref('');
const password = ref('');

const handleSignIn = async () => {
	try {
		if (usePassword.value) {
			const { error } = await anonClient.auth.signInWithPassword({
				email: email.value,
				password: password.value,
			});

			if (error) {
				throw error;
			}

			router.push({ name: 'home' });
		} else {
			const { error } = await anonClient.auth.signInWithOtp({
				email: email.value,
				options: {
					emailRedirectTo: process.env.SUPABASE_REDIRECT_URL as string,
					shouldCreateUser: false,
				},
			});

			if (error) {
				throw error;
			}

			useNotify('info', 'Check your email to finish sign-in');
		}
	} catch (error) {
		const supabaseError = error as AuthError;
		useNotify('negative', 'Login Failed', supabaseError.message);
	}
};
</script>

<style scoped>
.sign-in-card {
	width: 400px;
	height: 100%;
}
</style>

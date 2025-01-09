<template>
	<q-page class="row items-start justify-evenly q-pa-lg">
		<q-card flat bordered class="settings-card">
			<q-card-section class="text-h5 text-weight-bold">Settings</q-card-section>
			<q-card-section>
				<div class="text-h6 text-weight-medium">Appearance</div>
				<q-list>
					<q-item clickable @click="handleDarkToggle">
						<q-item-section>
							<div class="text-body1">Dark Mode</div>
						</q-item-section>
						<q-item-section side>
							<q-toggle v-model="settings.appearance.dark" />
						</q-item-section>
					</q-item>
				</q-list>
			</q-card-section>
			<q-card-section>
				<div class="text-h6 text-weight-medium">Financial</div>
				<q-list>
					<q-item>
						<q-item-section>
							<div class="text-body1">Currency Symbol</div>
						</q-item-section>
						<q-item-section side style="max-width: 3rem">
							<q-input
								v-model="settings.financial.currencySymbol"
								:maxlength="1"
								outlined
								dense
							/>
						</q-item-section>
					</q-item>
				</q-list>
			</q-card-section>
			<q-card-actions align="right">
				<q-btn
					label="Save Settings"
					color="secondary"
					size="md"
					@click="persistAppSettings"
				/>
			</q-card-actions>
		</q-card>
	</q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { storeUser } from 'src/stores/user';

export interface AppSettings {
	appearance: {
		dark: boolean;
	};
	financial: {
		currencySymbol: string;
	};
}

const $q = useQuasar();

const user = storeUser();
const { persistAppSettings } = user;
const { settings } = storeToRefs(user);

const handleDarkToggle = () => {
	$q.dark.toggle();
	settings.value.appearance.dark = $q.dark.isActive;
};
</script>

<style scoped>
.settings-card {
	width: 500px;
	height: 100%s;
}
</style>

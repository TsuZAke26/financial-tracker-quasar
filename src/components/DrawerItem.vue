<template>
	<q-item clickable :to="to" exact>
		<q-item-section v-if="icon" avatar>
			<q-icon :name="icon" />
		</q-item-section>

		<q-item-section>
			<q-item-label>{{ title }}</q-item-label>
		</q-item-section>
	</q-item>
</template>

<script setup lang="ts">
export interface DrawerItemProps {
	title: string;
	to?: string;
	icon?: string;
}

withDefaults(defineProps<DrawerItemProps>(), {
	link: '',
	icon: '',
});
</script>

<style scoped></style>

<script setup lang="ts">
import type { Node } from "@/ast";
import { getWidget } from "@/components/Widget/widgets";

const model = defineModel<Node>({ required: true });
</script>

<template>
  <component :is="getWidget(model)" v-model="model" />
</template>

<style scoped></style>

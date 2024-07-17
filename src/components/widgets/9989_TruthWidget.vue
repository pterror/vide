<script setup lang="ts">
import type { NodeType, TruthNode } from "@/ast";

const model = defineModel<TruthNode>({ required: true });
</script>

<script lang="ts">
export const types = ["truth"] satisfies NodeType[];
</script>

<template>
  <div class="TruthWidget" :class="'type-' + model.type">{{ model.value }}</div>
</template>

<style scoped>
.TruthWidget {
  color: rgb(143, 128, 226);
}
</style>

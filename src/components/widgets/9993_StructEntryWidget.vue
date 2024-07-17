<script setup lang="ts">
import type { NodeType, StructEntryNode } from "@/ast";
import Widget from "@/components/Widget.vue";

const model = defineModel<StructEntryNode>({ required: true });
</script>

<script lang="ts">
export const types = ["struct_entry"] satisfies NodeType[];
</script>

<template>
  <div class="StructEntryWidget" :class="'type-' + model.type">
    <Widget v-model="model.key" />: <Widget v-model="model.value" />
  </div>
</template>

<style scoped>
.StructEntryWidget > * {
  display: inline-block;
}
</style>

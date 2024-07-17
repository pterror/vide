<script setup lang="ts">
import type { DeclarationNode, NodeType } from "@/ast";
import Widget from "@/components/Widget.vue";

const model = defineModel<DeclarationNode>({ required: true });
</script>

<script lang="ts">
export const types = ["declaration"] satisfies NodeType[];
</script>

<template>
  <div class="DeclarationWidget" :class="'type-' + model.type">
    <span class="token-keyword">let</span> <Widget v-model="model.binding" /> =
    <Widget v-if="model.value" v-model="model.value" />
    <div v-else>(todo: placeholder widget)</div>
  </div>
</template>

<style scoped>
.DeclarationWidget {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
</style>

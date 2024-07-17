<script setup lang="ts">
import type { BlockNode, NodeType } from "@/ast";
import Widget from "@/components/Widget.vue";

const model = defineModel<BlockNode>({ required: true });
</script>

<script lang="ts">
export const types = ["block"] satisfies NodeType[];
</script>

<template>
  <div class="BlockWidget" :class="'type-' + model.type">
    <span class="token-keyword">block</span> {
    <div v-for="(statement, i) in model.statements">
      <Widget
        :model-value="statement"
        @update:model-value="model.statements[i] = $event"
      />;
    </div>
    }
  </div>
</template>

<style scoped>
.BlockWidget > *:not(span) {
  display: block;
  padding-left: 16px;
}
</style>

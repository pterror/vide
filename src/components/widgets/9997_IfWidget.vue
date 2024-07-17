<script setup lang="ts">
import type { IfNode, NodeType } from "@/ast";
import Widget from "@/components/Widget.vue";

const model = defineModel<IfNode>({ required: true });
</script>

<script lang="ts">
export const types = ["if"] satisfies NodeType[];
</script>

<template>
  <div class="IfWidget" :class="'type-' + model.type">
    <span class="token-keyword">if</span> (<Widget v-model="model.condition" />)
    <Widget v-model="model.then" /><template v-if="model.else">
      <span class="token-keyword">else</span> <Widget v-model="model.else"
    /></template>
  </div>
</template>

<style scoped>
.IfWidget {
  display: inline-block;
}

.IfWidget > * {
  display: inline-block;
}
</style>

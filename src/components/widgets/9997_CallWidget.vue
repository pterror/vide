<script setup lang="ts">
import type { CallNode, NodeType } from "@/ast";
import Widget from "@/components/Widget.vue";

const model = defineModel<CallNode>({ required: true });
</script>

<script lang="ts">
export const types = ["call"] satisfies NodeType[];
</script>

<template>
  <div class="CallWidget" :class="'type-' + model.type">
    <Widget v-model="model.function" />(<template
      v-for="(argument, i) in model.arguments"
    >
      <template v-if="i !== 0">, </template>
      <Widget
        :model-value="argument"
        @update:model-value="model.arguments[i] = $event"
      /> </template
    >)
  </div>
</template>

<style scoped>
.CallWidget > * {
  display: inline-block;
}
</style>

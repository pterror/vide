<script setup lang="ts">
import type { ListNode, NodeType } from "@/ast";
import Widget from "@/components/Widget.vue";

const model = defineModel<ListNode>({ required: true });
</script>

<script lang="ts">
export const types = ["list"] satisfies NodeType[];
</script>

<template>
  <div class="ListWidget" :class="'type-' + model.type">
    [
    <template v-for="(item, i) in model.items">
      <template v-if="i !== 0">, </template>
      <Widget
        :model-value="item"
        @update:model-value="model.items[i] = $event"
      />
    </template>
    ]
  </div>
</template>

<style scoped>
.ListWidget > * {
  display: inline-block;
}
</style>

<script setup lang="ts">
import type { NodeType, TextNode } from "@/ast";

const model = defineModel<TextNode>({ required: true });
</script>

<script lang="ts">
export const types = ["text"] satisfies NodeType[];
</script>

<template>
  <div
    class="TextWidget"
    :class="'type-' + model.type"
    contenteditable
    @input="model.value = ($event.target as any).textContent"
  >
    {{ model.value }}
  </div>
</template>

<style scoped>
.TextWidget {
  color: rgb(225, 226, 128);
}
</style>

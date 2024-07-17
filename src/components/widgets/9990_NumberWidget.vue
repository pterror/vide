<script setup lang="ts">
import type { NodeType, IntegerNode, NumberNode } from "@/ast";

const model = defineModel<IntegerNode | NumberNode>({ required: true });
</script>

<script lang="ts">
export const types = ["integer", "number"] satisfies NodeType[];
</script>

<template>
  <div class="NumberWidget token-number" :class="'type-' + model.type">
    {{ model.value }}
  </div>
</template>

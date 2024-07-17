<script setup lang="ts">
import type { NameNode, NodeType } from "@/ast";

const model = defineModel<NameNode>({ required: true });
</script>

<script lang="ts">
export const types = ["name"] satisfies NodeType[];
</script>

<template>
  <div
    class="NameWidget"
    :class="'type-' + model.type"
    contenteditable
    @input="model.name = ($event.target as any).textContent"
  >
    {{ model.name }}
  </div>
</template>

<script setup lang="ts">
import type { NodeType, NothingNode } from "@/ast";

const model = defineModel<NothingNode>({ required: true });
</script>

<script lang="ts">
export const types = ["nothing"] satisfies NodeType[];
</script>

<template>
  <div class="NothingWidget token-constant" :class="'type-' + model.type">null</div>
</template>

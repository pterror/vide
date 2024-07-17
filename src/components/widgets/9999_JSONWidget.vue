<script setup lang="ts">
import type { Node, NodeType } from "@/ast";

const model = defineModel<Node>(null!);
</script>

<script lang="ts">
export const types = [
  "name",
  "nothing",
  "truth",
  "integer",
  "number",
  "text",
  "list",
  "struct",
  "declaration",
  "function",
  "call",
  "if",
  "block",
] satisfies NodeType[];

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function () {
  return String(this);
};
</script>

<template>
  <pre class="JSONWidget"><code>{{ JSON.stringify(model) }}</code></pre>
</template>

<script setup lang="ts">
import type { CallNode, NameNode, Node, NodeType } from "@/ast";
import Widget from "@/components/Widget.vue";
import { computed } from "vue";

const model = defineModel<
  CallNode & { function: NameNode; arguments: [Node, Node] }
>({
  required: true,
});

const space = computed(() => (model.value.function.name === "." ? "" : " "));
</script>

<script lang="ts">
export const types = ["call"] satisfies NodeType[];
export const matches = (node: CallNode) =>
  node.function.type === "name" &&
  /^(?:[-+*\/%<>=.]|[=<>!]=|<<|>>|>>>|[|][|]?|&&?|[?][?])$/.test(
    node.function.name
  ) &&
  node.arguments.length === 2;
</script>

<template>
  <div class="OperatorWidget" :class="'type-' + model.type">
    <Widget v-model="model.arguments[0]" />{{ space
    }}<Widget v-model="model.function" />{{ space
    }}<Widget v-model="model.arguments[1]" />
  </div>
</template>

<style scoped>
.OperatorWidget > * {
  display: inline-block;
}
</style>

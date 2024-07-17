<script setup lang="ts">
import type { NodeType, StructNode } from "@/ast";
import Widget from "@/components/Widget.vue";

const model = defineModel<StructNode>({ required: true });
</script>

<script lang="ts">
export const types = ["struct"] satisfies NodeType[];
</script>

<template>
  <div class="StructWidget" :class="'type-' + model.type" draggable="true">
    {{ "{" }}
    <div v-for="(entry, i) in model.entries">
      <Widget
        :model-value="entry"
        @update:model-value="model.entries[i] = $event"
      />{{ ", " }}
    </div>
    {{ "}" }}
  </div>
</template>

<style scoped>
.StructWidget {
  background: rgb(255 255 255 / 0.1);
  padding: 8px;
  border-radius: 8px;
  transition-property: all;
  transition-duration: 150ms;
}

.StructWidget:hover {
  background: rgb(255 255 255 / 0.15);
}

.StructWidget > * {
  padding-left: 16px;
}

.StructWidget > * > * {
  display: inline-block;
}
</style>

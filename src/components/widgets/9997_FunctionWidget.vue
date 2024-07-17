<script setup lang="ts">
import type { FunctionNode, NodeType } from "@/ast";
import Widget from "@/components/Widget.vue";

const model = defineModel<FunctionNode>({ required: true });
</script>

<script lang="ts">
export const types = ["function"] satisfies NodeType[];
</script>

<template>
  <div class="FunctionWidget" :class="'type-' + model.type">
    <span class="token-keyword">function</span> (
    <div class="arguments">
      <template v-for="(argument, i) in model.arguments">
        <template v-if="i !== 0">,&nbsp;</template>
        <Widget
          :model-value="argument.binding"
          @update:model-value="model.arguments[i].binding = $event"
        />
        <template v-if="argument.value">
          &nbsp;=&nbsp;
          <Widget
            :model-value="argument.value"
            @update:model-value="model.arguments[i].value = $event"
          />
        </template>
      </template>
    </div>
    ) <Widget v-model="model.body" />
  </div>
</template>

<style scoped>
.arguments {
  display: flex;
  align-items: center;
}

.arguments > * {
  display: inline-block;
}
</style>

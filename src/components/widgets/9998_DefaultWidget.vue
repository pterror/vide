<script setup lang="ts">
import type { Node, NodeType } from "@/ast";
import Widget from "@/components/Widget.vue";

const model = defineModel<Node>({ required: true });

type AnyNodeKey = Node extends infer T
  ? T extends T
    ? keyof T
    : never
  : never;
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
  "struct_entry",
  "struct",
  "declaration",
  "function",
  "call",
  "if",
  "block",
] satisfies NodeType[];
</script>

<template>
  <div class="DefaultWidget" :class="'type-' + model.type">
    <span class="type">{{ model.type }}</span>
    <table class="entries">
      <tbody>
        <tr
          v-for="[k, v] in (Object.entries(model) as [AnyNodeKey, Node | Node[] | string | null][])"
        >
          <template v-if="k !== 'type'">
            <td class="key">{{ k }}</td>
            <td>
              <ul v-if="Array.isArray(v)">
                <li v-for="(item, i) in v">
                  <Widget
                    :model-value="item"
                    @update:model-value="v[i] = $event"
                  />
                </li>
              </ul>
              <span v-else-if="typeof v === 'string'" class="string">{{
                v
              }}</span>
              <span v-else-if="typeof v === 'bigint'" class="integer">{{
                v
              }}</span>
              <span v-else-if="typeof v === 'number'" class="number">{{
                v
              }}</span>
              <span v-else-if="v == null" class="null">(absent)</span>
              <Widget
                v-else
                :model-value="v"
                @update:model-value="(model as any)[k] = $event"
              />
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.DefaultWidget {
  position: relative;
  border: 1px solid var(--fg);
  margin-top: 12px;
  padding: 8px 16px;
}

tbody {
  vertical-align: top;
}

ul {
  list-style-type: none;
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0;
  margin-inline-end: 0;
  padding-inline-start: 0;
}

.type {
  position: absolute;
  display: inline-block;
  padding: 0 8px;
  background: var(--bg);
  transform: translate(-8px, calc(-50% - 8px));
  color: rgb(128, 174, 226);
}

.key {
  color: #99e789;
}

.key:has(+ * > :is(.Widget, ul)) {
  padding-top: 8px;
}

.null {
  font-style: italic;
}

.string {
  color: rgb(225, 226, 128);
}

.number,
.integer {
  color: rgb(143, 128, 226);
}

.null {
  color: rgba(204, 226, 222, 0.5);
}
</style>

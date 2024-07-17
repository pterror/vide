<script setup lang="ts">
import type { Node } from "@/ast";
import Widget from "@/components/Widget.vue";
import { toJS } from "@/outputters/js";
import { toJSON } from "@/outputters/json";
import { toLua } from "@/outputters/lua";
import { computed, ref } from "vue";

// @ts-ignore
const SAMPLE_AST_1 = {
  type: "function",
  arguments: [
    {
      type: "declaration",
      binding: { type: "name", name: "foo" },
      value: null,
    },
    {
      type: "declaration",
      binding: {
        type: "struct",
        entries: [
          {
            type: "struct_entry",
            key: { type: "text", value: "bar" },
            value: { type: "name", name: "bar" },
          },
          {
            type: "struct_entry",
            key: { type: "text", value: "baz" },
            value: { type: "name", name: "baz" },
          },
        ],
      },
      value: { type: "struct", entries: [] },
    },
  ],
  body: {
    type: "block",
    statements: [
      {
        type: "declaration",
        binding: { type: "name", name: "foo" },
        value: {
          type: "call",
          function: { type: "name", name: "+" },
          arguments: [
            { type: "integer", value: 1n },
            { type: "integer", value: 2n },
          ],
        },
      },
      {
        type: "declaration",
        binding: { type: "name", name: "foo_two" },
        value: {
          type: "struct",
          entries: [
            {
              type: "struct_entry",
              key: { type: "integer", value: 1n },
              value: { type: "text", value: "one" },
            },
          ],
        },
      },
      {
        type: "if",
        condition: {
          type: "truth",
          value: true,
        },
        then: {
          type: "call",
          function: {
            // FIXME: type: access?
            type: "call",
            function: { type: "name", name: "." },
            arguments: [
              { type: "name", name: "console" },
              { type: "name", name: "log" },
            ],
          },
          arguments: [{ type: "text", value: "foo bar" }],
        },
        else: null,
      },
    ],
  },
} satisfies Node;

// @ts-ignore
const SAMPLE_JSON_AST = {
  type: "struct",
  entries: [
    {
      type: "struct_entry",
      key: { type: "text", value: "foo\t" },
      value: { type: "number", value: 1234 },
    },
    {
      type: "struct_entry",
      key: { type: "text", value: "bar" },
      value: { type: "truth", value: true },
    },
    {
      type: "struct_entry",
      key: { type: "text", value: "baz" },
      value: { type: "nothing" },
    },
    {
      type: "struct_entry",
      key: { type: "text", value: "quux" },
      value: {
        type: "list",
        items: [
          { type: "number", value: 1234 },
          { type: "text", value: "asjd" },
        ],
      },
    },
  ],
} satisfies Node;

// @ts-ignore
const SAMPLE_AST_2 = {
  type: "function",
  arguments: [
    {
      type: "declaration",
      binding: { type: "name", name: "foo" },
      value: null,
    },
    {
      type: "declaration",
      binding: { type: "name", name: "bar" },
      value: SAMPLE_JSON_AST,
    },
  ],
  body: {
    type: "block",
    statements: [
      {
        type: "declaration",
        binding: { type: "name", name: "foo" },
        value: {
          type: "call",
          function: { type: "name", name: "+" },
          arguments: [
            { type: "integer", value: 1n },
            { type: "integer", value: 2n },
          ],
        },
      },
      {
        type: "declaration",
        binding: { type: "name", name: "foo_two" },
        value: {
          type: "struct",
          entries: [
            {
              type: "struct_entry",
              key: { type: "integer", value: 1n },
              value: { type: "text", value: "one" },
            },
          ],
        },
      },
      {
        type: "if",
        condition: {
          type: "truth",
          value: true,
        },
        then: {
          type: "call",
          function: {
            // FIXME: type: access?
            type: "call",
            function: { type: "name", name: "." },
            arguments: [
              { type: "name", name: "console" },
              { type: "name", name: "log" },
            ],
          },
          arguments: [{ type: "text", value: "foo bar" }],
        },
        else: null,
      },
    ],
  },
} satisfies Node;

const ast = ref<Node>(structuredClone(SAMPLE_AST_2));

const json = computed(() => {
  try {
    return toJSON(ast.value);
  } catch (error) {
    return error instanceof Error ? error : new Error(error as any);
  }
});

const js = computed(() => {
  try {
    return toJS(ast.value);
  } catch (error) {
    return error instanceof Error ? error : new Error(error as any);
  }
});

const lua = computed(() => {
  try {
    return toLua(ast.value);
  } catch (error) {
    return error instanceof Error ? error : new Error(error as any);
  }
});
</script>

<template>
  <div class="Editor">
    <div class="input">
      <Widget v-model="ast" />
    </div>
    <div class="output">
      <div class="json-stringify">
        <h3>json.stringify</h3>
        <details>
          <summary>click to show code</summary>
          <pre class="code"><code>{{ ast }}</code></pre>
        </details>
      </div>
      <div class="json">
        <h3>json</h3>
        <pre
          v-if="typeof json === 'string'"
          class="code"
        ><code>{{ json }}</code></pre>
        <div v-else class="error">{{ json }}</div>
      </div>
      <div class="js">
        <h3>js</h3>
        <pre
          v-if="typeof js === 'string'"
          class="code"
        ><code>{{ js }}</code></pre>
        <div v-else class="error">{{ js }}</div>
      </div>
      <div class="lua">
        <h3>lua</h3>
        <pre
          v-if="typeof lua === 'string'"
          class="code"
        ><code>{{ lua }}</code></pre>
        <div v-else class="error">{{ lua }}</div>
        <!-- TODO: display debug data? -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.Editor {
  height: 100%;
  display: flex;
  /* temporary */
  flex-flow: column;
  padding: 8px;
  gap: 16px;
}

summary {
  cursor: pointer;
  user-select: none;
}

h3 {
  font-size: 100%;
  font-weight: normal;
  padding: 0 8px;
}

.input,
.output,
.output > * {
  flex: 1 0 0;
}

.input {
  display: grid;
  place-items: center;
}

.output {
  display: flex;
  flex-flow: column;
}

.code {
  padding: 0 8px;
}

.error {
  color: rgb(212, 63, 63);
  background: rgb(212, 63, 63, 0.15);
  padding: 8px;
  border-radius: 8px;
}
</style>

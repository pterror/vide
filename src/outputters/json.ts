import { makeOutputter, type Outputters } from "@/ast";

const outputters = {
  nothing() {
    return "null";
  },
  truth(node) {
    return String(node.value);
  },
  number(node) {
    return String(node.value);
  },
  integer(node) {
    // Technically unsafe, but assume integers are less than 52-bit.
    return String(node.value);
  },
  text(node) {
    return JSON.stringify(node.value);
  },
  list(node) {
    const items: string[] = node.items.map(toJSON);
    return "[" + items.join(", ") + "]";
  },
  struct(node) {
    const entries: string[] = node.entries.map((entry) => {
      if (entry.key.type !== "text") {
        throw new Error("Struct key must be text");
      }
      return toJSON(entry.key) + ": " + toJSON(entry.value);
    });
    return "{ " + entries.join(", ") + " }";
  },
} satisfies Outputters;

export const toJSON = makeOutputter(outputters);

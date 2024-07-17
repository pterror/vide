import {
  type Node,
  makeOutputter,
  type Outputters,
  type CallNode,
  DeclarationNode,
} from "@/ast";

// FIXME: parenthesize operator expressions here and in lua as appropriate

function expectArgumentsMessage(node: CallNode, expected: string) {
  return (
    "Expected operator '" +
    (node.function.type === "name" ? node.function.name : null) +
    "' to have " +
    expected +
    " , got " +
    node.arguments.length +
    " arguments instead."
  );
}

function isJSName(name: string) {
  return /^[$_\p{ID_Start}][$\u200c\u200d\p{ID_Continue}]*$/u.test(name);
}

function outputArguments(nodes: Node[]) {
  return "(" + nodes.map(toJS).join(", ") + ")";
}

function outputParameters(nodes: DeclarationNode[]) {
  return "(" + nodes.map(outputAssignment).join(", ") + ")";
}

function outputAssignment(node: DeclarationNode) {
  return toJS(node.binding) + (node.value ? " = " + toJS(node.value) : "");
}

const outputters = {
  name(node) {
    if (!isJSName(node.name)) {
      throw new Error("'" + node.name + "' is not a valid name");
    }
    return node.name;
  },
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
    const items: string[] = node.items.map(toJS);
    return "[" + items.join(", ") + "]";
  },
  struct_entry(node) {
    const isName = node.key.type === "text" && isJSName(node.key.value);
    const key: string =
      node.key.type === "text"
        ? isName
          ? node.key.value
          : JSON.stringify(node.key.value)
        : "[" + toJS(node.key) + "]";
    if (
      isName &&
      node.key.type === "text" &&
      node.value.type === "name" &&
      node.value.name === node.key.value
    ) {
      return node.key.value;
    }
    const result: string = key + ": " + toJS(node.value);
    return result;
  },
  struct(node) {
    const entries: string[] = node.entries.map(toJS);
    return "{ " + entries.join(", ") + " }";
  },
  function(node) {
    const result: string =
      "function " +
      outputParameters(node.arguments) +
      " " +
      toJS(
        node.body.type === "block"
          ? node.body
          : { type: "block", statements: [node.body] }
      );
    return result;
  },
  declaration(node) {
    const result: string = "let " + outputAssignment(node);
    return result;
  },
  call(node) {
    // FIXME: ?: operator for ternaries????
    // but lua doesn't have ternaries
    if (node.function.type === "name") {
      if (
        /^(?:[!]|void|delete)$/.test(node.function.name) ||
        (node.function.name === "-" && node.arguments.length === 1)
      ) {
        if (node.arguments.length !== 1) {
          throw new Error(expectArgumentsMessage(node, "1 argument"));
        }
        const result: string =
          node.function.name +
          (/^\w+$/.test(node.function.name) ? " " : "") +
          toJS(node.arguments[1]);
        return result;
      } else if (
        /^(?:[-+*\/%<>=.]|[=<>!]=|<<|>>|>>>|[|][|]?|&&?|[?][?])$/.test(
          node.function.name
        )
      ) {
        if (node.arguments.length !== 2) {
          throw new Error(expectArgumentsMessage(node, "2 arguments"));
        }
        const operator = node.function.name;
        const space = operator === "." ? "" : " ";
        const result: string =
          toJS(node.arguments[0]) +
          space +
          node.function.name +
          space +
          toJS(node.arguments[1]);
        return result;
      } else {
        const result: string = toJS(node.function) + "(" + ")";
        return result;
      }
    }
    const paren =
      node.function.type !== "call" ||
      node.function.function.type !== "name" ||
      node.function.function.name !== "." ||
      node.function.arguments.length !== 2;
    const result: string =
      (paren ? "(" : "") +
      toJS(node.function) +
      (paren ? ")" : "") +
      outputArguments(node.arguments);
    return result;
  },
  if(node) {
    const result: string =
      "if (" +
      toJS(node.condition) +
      ") " +
      toJS(node.then) +
      (node.else ? " else " + toJS(node.else) : "");
    return result;
  },
  block(node) {
    const statements: string[] = node.statements.map(
      (statement) => "\t" + toJS(statement) + ";\n"
    );
    return "{\n" + statements.join("") + "}";
  },
} satisfies Required<Outputters>;

export const toJS = makeOutputter(outputters);

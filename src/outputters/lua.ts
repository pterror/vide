import {
  type Node,
  makeOutputter,
  type Outputters,
  type CallNode,
  DeclarationNode,
} from "@/ast";

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

function isLuaName(name: string) {
  return /^\w+$/u.test(name);
}

function outputArguments(nodes: Node[]) {
  return "(" + nodes.map(toLua).join(", ") + ")";
}

function outputParameters(nodes: DeclarationNode[]) {
  return "(" + nodes.map(outputAssignment).join(", ") + ")";
}

function outputAssignment(node: DeclarationNode) {
  if (node.binding.type !== "name") {
    throw Object.assign(new Error("Binding must be a name"), {
      data: node,
    });
  }
  return toLua(node.binding) + (node.value ? " = " + toLua(node.value) : "");
}

const outputters = {
  name(node) {
    if (!isLuaName(node.name)) {
      throw new Error("'" + node.name + "' is not a valid name");
    }
    return node.name;
  },
  nothing() {
    return "nil";
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
    const items: string[] = node.items.map(toLua);
    return "{ " + items.join(", ") + " }";
  },
  struct_entry(node) {
    const isName = node.key.type === "text" && isLuaName(node.key.value);
    const key: string =
      node.key.type === "text"
        ? isName
          ? node.key.value
          : "[" + JSON.stringify(node.key.value) + "]"
        : "[" + toLua(node.key) + "]";
    if (
      isName &&
      node.key.type === "text" &&
      node.value.type === "name" &&
      node.value.name === node.key.value
    ) {
      return node.key.value;
    }
    const result: string = key + " = " + toLua(node.value);
    return result;
  },
  struct(node) {
    const entries: string[] = node.entries.map(toLua);
    return "{ " + entries.join(", ") + " }";
  },
  function(node) {
    const statements: string[] = (
      node.body.type === "block" ? node.body.statements : [node]
    ).map((statement) => "\t" + toLua(statement) + "\n");
    const result: string =
      "function " +
      outputParameters(node.arguments) +
      "\n" +
      statements.join("") +
      "end";
    return result;
  },
  declaration(node) {
    const result: string = "local " + outputAssignment(node);
    return result;
  },
  call(node) {
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
          toLua(node.arguments[1]);
        return result;
      } else if (
        /^(?:[-+*\/%<>=.]|[=<>!]=|<<|>>|>>>)$/.test(node.function.name)
      ) {
        if (node.arguments.length !== 2) {
          throw new Error(expectArgumentsMessage(node, "2 arguments"));
        }
        const operator = node.function.name;
        const space = operator === "." ? "" : " ";
        const result: string =
          toLua(node.arguments[0]) +
          space +
          node.function.name +
          space +
          toLua(node.arguments[1]);
        return result;
      } else {
        const result: string = toLua(node.function) + "(" + ")";
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
      toLua(node.function) +
      (paren ? ")" : "") +
      outputArguments(node.arguments);
    return result;
  },
  if(node) {
    const result: string =
      "if " +
      toLua(node.condition) +
      " then\n" +
      toLua(node.then) +
      (node.else ? "\telse\n" + toLua(node.else) : "") +
      "\nend";
    return result;
  },
  block(node) {
    const statements: string[] = node.statements.map(
      (statement) => "\t" + toLua(statement) + "\n"
    );
    return "do\n" + statements.join("") + "end";
  },
} satisfies Required<Outputters>;

export const toLua = makeOutputter(outputters);

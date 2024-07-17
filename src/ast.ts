// FIXME: port back over to lua

export type Node<Type extends Node["type"] = any> = Extract<
  | NameNode
  | NothingNode
  | TruthNode
  | IntegerNode
  | NumberNode
  | TextNode
  | ListNode
  | StructEntryNode
  | StructNode
  | DeclarationNode
  | FunctionNode
  | CallNode
  | IfNode
  | BlockNode,
  { type: Type }
>;

export type NodeType = Node["type"];

export interface Outputters<T = string>
  extends Partial<{ [Type in NodeType]: (node: Node<Type>) => T }> {}

export function makeOutputter<T, R = never>(
  outputters: Outputters<T>,
  onError?: (node: Node) => R
) {
  return (node: Node) => {
    const outputter = outputters[node.type];
    if (outputter != null) {
      return outputter(node as any);
    } else if (onError != null) {
      return onError(node);
    } else {
      throw new Error("Cannot handle node type '" + node.type + "'");
    }
  };
}

export interface BaseNode<Type extends string> {
  type: Type;
}

export interface NameNode extends BaseNode<"name"> {
  name: string;
}

export interface NothingNode extends BaseNode<"nothing"> {}

export interface TruthNode extends BaseNode<"truth"> {
  value: boolean;
}

export interface IntegerNode extends BaseNode<"integer"> {
  value: bigint;
}

export interface NumberNode extends BaseNode<"number"> {
  value: number;
}

export interface TextNode extends BaseNode<"text"> {
  value: string;
}

export interface ListNode extends BaseNode<"list"> {
  items: Node[];
}

export interface StructEntryNode extends BaseNode<"struct_entry"> {
  key: Node;
  value: Node;
}

export interface StructNode extends BaseNode<"struct"> {
  entries: StructEntryNode[];
}

export interface DeclarationNode extends BaseNode<"declaration"> {
  binding: Node;
  value: Node | null;
}

export interface FunctionNode extends BaseNode<"function"> {
  arguments: DeclarationNode[];
  body: Node;
}

export interface CallNode extends BaseNode<"call"> {
  function: Node;
  arguments: Node[];
}

// FIXME: cond? something else? break? continue? goto?
export interface IfNode extends BaseNode<"if"> {
  condition: Node;
  then: Node;
  else: Node | null;
}

export interface BlockNode extends BaseNode<"block"> {
  statements: Node[];
}

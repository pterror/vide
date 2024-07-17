import type { Node, NodeType } from "@/ast";
import type { Component } from "vue";

export type WidgetRenderer = Component<{ ast: Node }>;

export interface WidgetModule {
  default: WidgetRenderer;
  types: NodeType[];
  matches?: (node: Node) => boolean;
}

export interface WidgetRegistry extends Record<NodeType, WidgetModule[]> {}

export const widgetRegistry = {} as WidgetRegistry;

const widgetModules = import.meta.glob("@/components/widgets/*", {
  eager: true,
});

for (const module of Object.values(widgetModules) as WidgetModule[]) {
  for (const type of module.types) {
    (widgetRegistry[type] ??= []).push(module as WidgetModule);
  }
}

export function getWidget(node: Node) {
  const module = widgetRegistry[node.type]?.find(
    (module) => module.matches?.(node) ?? true
  );
  return module?.default;
}

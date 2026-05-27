export interface SourceLocation {
  start: { row: number; col: number; index: number };
  end: { row: number; col: number; index: number };
}

export interface ObjectNode {
  kind: "object";
  loc: SourceLocation;
  members: MemberNode[];
}

export interface MemberNode {
  kind: "member";
  loc: SourceLocation;
  key: StringNode;
  value: HjsonNode;
}

export interface ArrayNode {
  kind: "array";
  loc: SourceLocation;
  elements: HjsonNode[];
}

export interface StringNode {
  kind: "string";
  loc: SourceLocation;
  value: string;
}

export interface NumberNode {
  kind: "number";
  loc: SourceLocation;
  value: number;
  raw: string;
}

export interface BooleanNode {
  kind: "boolean";
  loc: SourceLocation;
  value: boolean;
}

export interface NullNode {
  kind: "null";
  loc: SourceLocation;
  value: null;
}

export type HjsonNode =
  | ObjectNode
  | ArrayNode
  | StringNode
  | NumberNode
  | BooleanNode
  | NullNode;

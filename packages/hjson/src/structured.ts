export interface Position {
  row: number;
  col: number;
  index: number;
}

export interface FieldInfo {
  key: string;
  value: any;
  start: Position;
  end: Position;
  valueStart: Position;
  valueEnd: Position;
}

export type StructuredResult<T> =
  T extends Record<string, unknown> ? StructuredObject<T> : T;

export class StructuredObject<T extends Record<string, unknown>> {
  readonly #data: T;
  readonly #fields: Map<string, FieldInfo>;

  constructor(data: T, fields: Iterable<FieldInfo>) {
    this.#data = data;
    this.#fields = new Map();
    for (const f of fields) {
      this.#fields.set(f.key, f);
    }
  }

  valueOf(): T {
    return this.#data;
  }

  toJSON(): T {
    return this.#data;
  }

  field(key: string): FieldInfo | undefined {
    return this.#fields.get(key);
  }

  fields(): IterableIterator<FieldInfo> {
    return this.#fields.values();
  }
}

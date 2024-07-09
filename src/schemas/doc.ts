export interface DocNode {
  type: string;
  children?: Array<DocNode>;
  value?: string;
  [key: string]: unknown;
  ref?: { current?: HTMLElement };
}

export interface Doc {
  [key: string]: unknown;
  _id: string;
  title: string;
  doc: DocNode;
  userId: string;
  groupId?: string;
  templeId?: string;
  createdAt: Date;
}

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
  docRevisionId?: string;
  title: string;
  doc: DocNode;
  userId: string;
  groupId?: string;
  templeId?: string;
  minGrade?: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface DocRevision {
  [key: string]: unknown;
  _id: string;
  docId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  text: string;
}

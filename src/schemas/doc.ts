export interface Doc {
  [key: string]: unknown;
  _id: string;
  title: string;
  doc: Record<string, unknown>;
  userId: string;
  groupId: string;
  createdAt: Date;
}

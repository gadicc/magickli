import { GongoClientDocument } from "gongo-client";

export interface TempleMembership extends GongoClientDocument {
  _id: string;
  userId: string;
  templeId: string;
  grade: number;
  admin?: boolean;
  addedAt: Date;
}

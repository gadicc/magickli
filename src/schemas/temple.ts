import { GongoClientDocument } from "gongo-client";

export interface Temple extends GongoClientDocument {
  _id: string;
  name: string;
  slug: string;
  joinPass?: string;
  createdBy: string;
}

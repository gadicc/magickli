import { GongoClientDocument } from "gongo-client";
/*

export interface TempleMembership extends GongoClientDocument {
  _id: string;
  userId: string;
  templeId: string;
  grade: number;
  admin?: boolean;
  addedAt: Date;
}
*/

import { z } from "zod";
import dayjs, { type Dayjs } from "dayjs";

export const templeMembershipSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  motto: z.string().optional(),
  templeId: z.string(),
  grade: z.coerce.number().int().positive(),
  admin: z.boolean().optional(),
  addedAt: z.date(),
  memberSince: z
    .date()
    .or(z.instanceof(dayjs as unknown as typeof Dayjs))
    .or(z.null())
    .optional(),
});

export type TempleMembership = GongoClientDocument &
  z.infer<typeof templeMembershipSchema>;

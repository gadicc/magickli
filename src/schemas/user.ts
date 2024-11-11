import { ObjectId } from "bson";
import { EnhancedOmit } from "gongo-server-db-mongo/lib/collection";

interface UserServer {
  [key: string]: unknown;
  _id: ObjectId;
  displayName: string;
  emails: Array<{
    value: string;
    verified?: boolean;
  }>;
  admin?: boolean;
  groupIds: ObjectId[];
  groupAdminIds: ObjectId[];
  discourseId: number;
}

type UserClient = EnhancedOmit<
  UserServer,
  "_id" | "groupIds" | "groupAdminIds"
> & {
  _id: string;
  groupIds: string[];
  groupAdminIds: string[];
};

export type { UserServer, UserClient };

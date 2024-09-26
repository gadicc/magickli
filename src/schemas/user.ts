export interface User {
  [key: string]: unknown;
  _id: string;
  displayName: string;
  emails: Array<{
    value: string;
    verified?: boolean;
  }>;
  admin?: boolean;
  groupIds: string[];
  groupAdminIds: string[];
}

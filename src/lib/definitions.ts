import { z } from "zod";

export interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  refresh?: string;
  access?: string;
  refreshExpires?: string;
}

export type LoginData = {
  access: string;
  refresh: string;
  user: {
    pk: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
};

export interface File {
  id: string;
  original_name: string;
  comment?: string;
  size: number;
  date_created: Date;
  date_downloaded: Date;
  user: string;
  public_url: string | null;
}

export interface FileEdit {
  id: string;
  original_name: string;
  comment?: string;
  public_url?: string;
}

export const FileEditSchema = z.object({
  id: z.string().uuid(),
  original_name: z.string(),
  comment: z.string(),
  public: z.boolean(),
});

export type State = {
  errors?:
    | {
        original_name?: string[];
        comment?: string[];
        public_url?: Boolean;
      }
    | {};
  message?: string | null;
};

export interface User {
  id: number;
  username: string;
  first_name: string | undefined;
  last_name: string | undefined;
  email: string;
  is_staff: boolean;
  date_joined: Date;
  last_login: Date;
  count_files: number;
  total_space: {
    size__sum: number;
  };
}

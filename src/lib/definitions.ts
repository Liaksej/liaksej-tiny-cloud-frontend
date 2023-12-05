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

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, "amount"> & {
  amount: number;
};

export interface File {
  id: string;
  original_name: string;
  comment?: string;
  size: number;
  date_created: Date;
  date_downloaded: Date;
  user: string;
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
  public_url: z.string().optional(),
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
  is_superuser: boolean;
  date_joined: Date;
  last_login: Date;
  count_files: number;
  total_space: {
    size__sum: number;
  };
}

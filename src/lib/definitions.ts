export interface User {
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

export type Invoice = {
  id: string;
  account_name: string;
  customer_name: string;
  total: number;
  number: number;
  created: number;
  due_date: number;
  footer: string | null;
  hosted_invoice_url: string;
  livemode: boolean;
  paid: boolean;
};

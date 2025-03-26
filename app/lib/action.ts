"use server";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export interface StateInterface {
  errors?: {
    amount?: string[];
    customerId?: string[];
    status?: string[];
  };
  message?: string;
}

const invoicesPath = "/dashboard/invoices";
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });
const FormSchema = z.object({
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  date: z.string(),
  id: z.string(),
  status: z.enum(["paid", "pending"], {
    invalid_type_error: "Please select an invoice status.",
  }),
});
const CreateInvoice = FormSchema.omit({ date: true, id: true });

export async function createInvoice(
  ...args: [StateInterface, FormData]
): Promise<StateInterface> {
  const [, formData] = args;
  const rawFormData = {
    amount: formData.get("amount"),
    customerId: formData.get("customerId"),
    status: formData.get("status"),
  };
  const { data, error, success } = CreateInvoice.safeParse(rawFormData);

  if (!success) {
    console.log("error", error);
    return {
      errors: error.flatten().fieldErrors,
      message: "Missing fields. Failed to create invoice.",
    };
  }

  const { amount, customerId, status } = data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  // Insert data into the database
  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  } catch (err) {
    console.log("err", err);
    // If a database error occurs, return a more specific error.
    return {
      message: "Database error. Failed to create invoice.",
    };
  }

  // Revalidate the cache for the invoices page and redirect the user
  revalidatePath(invoicesPath);
  redirect(invoicesPath);
}
export async function deleteInvoice(id: string) {
  try {
    await sql`
      DELETE FROM invoices
      WHERE id = ${id}
    `;
  } catch (err) {
    console.log("err", err);
    throw err;
  }

  revalidatePath(invoicesPath);
}
export async function updateInvoice(
  ...args: [string, StateInterface, FormData]
): Promise<StateInterface> {
  const [id, , formData] = args;
  const rowData = Object.fromEntries(formData.entries());
  const parsedData = CreateInvoice.safeParse(rowData);
  const { data, error, success } = parsedData;

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      message: "Missing fields. Failed to update invoice.",
    };
  }

  const { amount, customerId, status } = data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  try {
    await sql`
      UPDATE invoices
      SET amount = ${amountInCents}, customer_id = ${customerId}, date = ${date}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (err) {
    console.log("err", err);
    return {
      message: "Database error: Failed to update invoice.",
    };
  }

  revalidatePath(invoicesPath);
  redirect(invoicesPath);
}

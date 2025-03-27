import { notFound } from "next/navigation";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import EditForm from "@/app/ui/invoices/edit-form";
import { fetchCustomers, fetchInvoiceById } from "@/app/lib/data";
import type { Breadcrumb } from "@/app/ui/invoices/breadcrumbs";

export const metadata = {
  title: "Edit Invoice",
};
export default async function EditInvoice(props: {
  params: Promise<{ id: string }>;
}) {
  const { params } = props;
  const { id } = await params;
  const breadcrumbs: Breadcrumb[] = [
    {
      href: "/dashboard/invoices",
      label: "Invoices",
    },
    {
      active: true,
      href: "/dashboard/invoices/${id}/edit",
      label: "Edit Invoice",
    },
  ];
  const [customers, invoice] = await Promise.all([
    fetchCustomers(),
    fetchInvoiceById(id),
  ]);

  if (invoice === undefined) {
    notFound();
  }
  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <EditForm customers={customers} invoice={invoice} />
    </>
  );
}

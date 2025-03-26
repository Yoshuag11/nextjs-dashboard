import BreadCrumbs from "@/app/ui/invoices/breadcrumbs";
import CreateForm from "@/app/ui/invoices/create-form";
import { fetchCustomers } from "@/app/lib/data";
import type { Breadcrumb as BreadcrumbInterface } from "@/app/ui/invoices/breadcrumbs";
export default async function CreateInvoicePage() {
  const customers = await fetchCustomers();
  const breadcrumbs: BreadcrumbInterface[] = [
    {
      href: "/dashboard/invoices",
      label: "Invoices",
    },
    {
      active: true,
      href: "/dashboard/invoices/create",
      label: "Create Invoice",
    },
  ];
  return (
    <main>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <CreateForm customers={customers} />
    </main>
  );
}

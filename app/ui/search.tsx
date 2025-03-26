"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useDebouncedCallback } from "use-debounce";
export default function Search({ placeholder }: { placeholder: string }) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const handleSearch = useDebouncedCallback(function (term: string) {
    const newSearchParams = new URLSearchParams(searchParams);

    if (term !== "") {
      newSearchParams.set("query", term);
    } else {
      newSearchParams.delete("query");
    }

    newSearchParams.delete("page");
    replace(`${pathname}?${newSearchParams.toString()}`);
  }, 300);
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] \
pl-10 text-sm outline-2 placeholder:text-gray-500"
        defaultValue={searchParams.get("query")?.toString()}
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
      <MagnifyingGlassIcon
        className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 \
peer-focus:text-gray-900"
      />
    </div>
  );
}

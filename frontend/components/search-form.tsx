"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

type SearchFormProps = {
  placeholder: string;
};

export function SearchForm({ placeholder }: SearchFormProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("search") || "");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const next = new URLSearchParams(params.toString());
    if (search.trim()) next.set("search", search.trim());
    else next.delete("search");
    router.push(`?${next.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="mb-4 flex gap-2">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border px-3 py-2 text-sm"
        style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--foreground)" }}
      />
      <button
        type="submit"
        className="rounded-md border px-4 py-2 text-sm"
        style={{ borderColor: "var(--border)", background: "var(--surface-strong)", color: "var(--foreground)" }}
      >
        Search
      </button>
    </form>
  );
}

"use client";
import { useEffect, useState } from "react";
import CustomerModal from "@/components/CustomerModal";

type CardRow = {
  id: string;
  createdAt: string;
  customer: {
    id: string;
    firstName: string;
    surname: string | null;
    phone: string | null;
    email: string | null;
  };
};

const PAGE_SIZE = 30;

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export default function CustomersPage() {
  const [cards, setCards] = useState<CardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchCards = async () => {
    setPage(1);
    setLoading(true);
    try {
      const res = await fetch("/api/cards?templateId=965363&page=1&itemsPerPage=100");
      const data = await res.json();
      setCards(data.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const paged = cards.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(cards.length / PAGE_SIZE);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Customers
        </h1>
        <button
          onClick={fetchCards}
          className="py-2 px-4 rounded-xl bg-lime-500 text-white font-bold text-base"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-xl text-gray-500">
          Loading...
        </div>
      ) : (
        <>
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-base min-w-[600px]">
              <thead>
                <tr className="text-left text-gray-500 border-b dark:border-gray-700">
                  <th className="pb-2 pr-4 font-medium">Name</th>
                  <th className="pb-2 pr-4 font-medium">Phone</th>
                  <th className="pb-2 pr-4 font-medium">Serial Card #</th>
                  <th className="pb-2 pr-4 font-medium">Email</th>
                  <th className="pb-2 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((c) => (
                  <tr key={c.id} className="border-b dark:border-gray-800">
                    <td className="py-3 pr-4 text-gray-900 dark:text-white font-medium">
                      {c.customer.firstName} {c.customer.surname || ""}
                    </td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                      {c.customer.phone || "—"}
                    </td>
                    <td className="py-3 pr-4">
                      <button
                        onClick={() => setSelected(c.id)}
                        className="text-lime-600 font-mono underline text-base"
                      >
                        {c.id}
                      </button>
                    </td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                      {c.customer.email || "—"}
                    </td>
                    <td className="py-3 text-gray-600 dark:text-gray-300">
                      {formatDate(c.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="py-2 px-5 rounded-xl bg-gray-200 dark:bg-gray-700 dark:text-white font-bold disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="py-2 px-4 text-gray-600 dark:text-gray-300">
                {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="py-2 px-5 rounded-xl bg-gray-200 dark:bg-gray-700 dark:text-white font-bold disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {selected && (
        <CustomerModal
          serialNumber={selected}
          onClose={() => {
            setSelected(null);
            fetchCards();
          }}
        />
      )}
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import CustomerModal from "@/components/CustomerModal";

type CardRow = {
  id: string;
  createdAt: string;
  customer: {
    firstName: string;
    surname: string | null;
    phone: string | null;
  };
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export default function CardsPage() {
  const [cards, setCards] = useState<CardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  const fetchCards = () => {
    setLoading(true);
    fetch("/api/cards?templateId=965363&page=1&itemsPerPage=100")
      .then((r) => r.json())
      .then((d) => setCards(d.data ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Cards
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
        <div className="space-y-3">
          {cards.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c.id)}
              className="w-full text-left p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 active:scale-95 transition-transform"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {c.customer.firstName} {c.customer.surname || ""}
                  </div>
                  <div className="text-base text-gray-500 mt-0.5">
                    {c.customer.phone || "No phone"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-lime-600 text-base font-medium">
                    {c.id}
                  </div>
                  <div className="text-sm text-gray-400 mt-0.5">
                    {formatDate(c.createdAt)}
                  </div>
                </div>
              </div>
            </button>
          ))}
          {cards.length === 0 && (
            <div className="text-center py-12 text-gray-500 text-lg">
              No cards found.
            </div>
          )}
        </div>
      )}

      {selected && (
        <CustomerModal
          serialNumber={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

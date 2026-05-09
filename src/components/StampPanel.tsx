"use client";
import { useState } from "react";
import Toast, { useToast } from "@/components/Toast";
import { addLogEntry } from "@/lib/activityLog";

interface StampPanelProps {
  cardId: string;
  onSuccess: () => void;
}

export default function StampPanel({ cardId, onSuccess }: StampPanelProps) {
  const [stamps, setStamps] = useState(1);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const handleAction = async (action: "add-stamp" | "subtract-stamp") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cards/${cardId}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: cardId,
          stamps,
          comment,
          purchaseSum: 0.1,
        }),
      });
      if (!res.ok) throw new Error();
      addLogEntry({ cardNumber: cardId, action, count: stamps, comment });
      showToast(
        `${action === "add-stamp" ? "Added" : "Subtracted"} ${stamps} stamp${stamps !== 1 ? "s" : ""}`,
        "success"
      );
      setComment("");
      onSuccess();
    } catch {
      showToast("Action failed. Check card number.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
      <input
        type="number"
        min={1}
        value={stamps}
        onChange={(e) =>
          setStamps(Math.max(1, parseInt(e.target.value) || 1))
        }
        className="w-full text-xl p-3 rounded-xl border-2 border-gray-300 focus:border-lime-500 focus:outline-none dark:bg-gray-800 dark:text-white dark:border-gray-600"
      />
      <input
        type="text"
        placeholder="Comment (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full text-lg p-3 rounded-xl border-2 border-gray-300 focus:border-lime-500 focus:outline-none dark:bg-gray-800 dark:text-white dark:border-gray-600"
      />
      <div className="flex gap-3">
        <button
          onClick={() => handleAction("add-stamp")}
          disabled={loading}
          className="flex-1 py-4 text-xl font-bold rounded-2xl bg-lime-500 text-white disabled:opacity-50 active:scale-95 transition-transform"
        >
          {loading ? "..." : "+ Add"}
        </button>
        <button
          onClick={() => handleAction("subtract-stamp")}
          disabled={loading}
          className="flex-1 py-4 text-xl font-bold rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 active:scale-95 transition-transform"
        >
          {loading ? "..." : "− Subtract"}
        </button>
      </div>
    </div>
  );
}

type SortByStockProps = {
  sortByStock: "none" | "in" | "out";
  setSortByStock: (value: "none" | "in" | "out") => void;
};

export function SortByStock({ sortByStock, setSortByStock }: SortByStockProps) {
  return (
    <div className="flex gap-2 mb-4">
      <button
        className={`px-3 py-1 rounded ${sortByStock === "none" ? "bg-indigo-400 text-white" : "bg-zinc-700 text-zinc-100"}`}
        onClick={() => setSortByStock("none")}
      >
        No Sort
      </button>
      <button
        className={`px-3 py-1 rounded ${sortByStock === "in" ? "bg-indigo-400 text-white" : "bg-zinc-700 text-zinc-100"}`}
        onClick={() => setSortByStock("in")}
      >
        In Stock First
      </button>
      <button
        className={`px-3 py-1 rounded ${sortByStock === "out" ? "bg-indigo-400 text-white" : "bg-zinc-700 text-zinc-100"}`}
        onClick={() => setSortByStock("out")}
      >
        Out of Stock First
      </button>
    </div>
  );
}
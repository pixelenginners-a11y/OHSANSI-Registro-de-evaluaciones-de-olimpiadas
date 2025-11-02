type Props = {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ page, pages, onPageChange }: Props) {
  return (
    <div className="flex items-center justify-center gap-2 p-3">
      <button
        onClick={() => onPageChange(1)}
        disabled={page === 1}
        className="rounded-lg border border-neutral-300 bg-white px-3 py-1 text-sm hover:bg-neutral-100 disabled:opacity-50"
      >
        ≪
      </button>
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-lg border border-neutral-300 bg-white px-3 py-1 text-sm hover:bg-neutral-100 disabled:opacity-50"
      >
        {"<"}
      </button>
      <span className="rounded-md border border-neutral-300 px-2 py-1 text-sm">
        {page} / {pages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(pages, page + 1))}
        disabled={page === pages}
        className="rounded-lg border border-neutral-300 bg-white px-3 py-1 text-sm hover:bg-neutral-100 disabled:opacity-50"
      >
        {">"}
      </button>
      <button
        onClick={() => onPageChange(pages)}
        disabled={page === pages}
        className="rounded-lg border border-neutral-300 bg-white px-3 py-1 text-sm hover:bg-neutral-100 disabled:opacity-50"
      >
        ≫
      </button>
    </div>
  );
}

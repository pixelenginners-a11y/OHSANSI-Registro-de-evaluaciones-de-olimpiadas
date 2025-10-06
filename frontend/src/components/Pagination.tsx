import Icon from "./Icon";

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationProps {
  links: PaginationLink[];
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  total?: number;
}

export function Pagination({ links, currentPage, lastPage, onPageChange, total }: PaginationProps) {
  const pageLinks = links.filter(
    (link) => !link.label.includes("Previous") && !link.label.includes("Next")
  );

  const handlePageClick = (link: PaginationLink) => {
    if (!link.url) return;
    const pageMatch = link.url.match(/page=(\d+)/);
    const page = pageMatch ? parseInt(pageMatch[1], 10) : 1;
    onPageChange(page);
  };

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= lastPage;

  return (
    <div className="flex items-center justify-between mt-4 px-4">
      {total !== undefined && (
        <div className="text-sm text-gray-600">
          Total: <span className="font-semibold">{total}</span> registros
        </div>
      )}

      <div className="flex items-center gap-1">
        <button
          onClick={() => !prevDisabled && onPageChange(currentPage - 1)}
          disabled={prevDisabled}
          className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium border transition
            ${prevDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
            }`}
        >
          <Icon name="chevron-left" />
        </button>

        {pageLinks.map((link, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(link)}
            disabled={!link.url}
            className={`min-w-[2rem] px-2 py-1 rounded-md text-sm font-medium border transition
              ${link.active
                ? "bg-primary-dark text-white border-primary-dark"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            dangerouslySetInnerHTML={{ __html: link.label }}
          />
        ))}

        <button
          onClick={() => !nextDisabled && onPageChange(currentPage + 1)}
          disabled={nextDisabled}
          className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium border transition
            ${nextDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
            }`}
        >
          <Icon name="chevron-right" />
        </button>
      </div>
    </div>
  );
}

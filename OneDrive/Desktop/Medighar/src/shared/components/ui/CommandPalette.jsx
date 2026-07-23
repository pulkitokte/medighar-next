import { useEffect, useRef } from "react";
import {
  X,
  Search,
  History,
  ArrowUp,
  ArrowDown,
  CornerDownLeft,
} from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import { useGlobalSearch } from "@/hooks/useGlobalSearch.js";
import SearchResultItem from "@/shared/components/ui/SearchResultItem.jsx";

const LISTBOX_ID = "global-search-listbox";

function optionId(index) {
  return `global-search-option-${index}`;
}

/**
 * Global Command Palette. Fully self-contained — owns its own
 * useGlobalSearch() instance, listens for its own keyboard shortcuts, and
 * requires no shared state with any other component. Mounted once in
 * MainLayout so it's available from every page.
 */
function CommandPalette() {
  const {
    isOpen,
    close,
    query,
    setQuery,
    hasQuery,
    groups,
    visibleResults,
    activeIndex,
    setActiveIndex,
    moveActiveIndex,
    selectResult,
    recentSearches,
    selectRecentSearch,
    clearRecent,
  } = useGlobalSearch();

  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActiveIndex(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActiveIndex(-1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      selectResult(visibleResults[activeIndex]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "Tab") {
      // Minimal focus trap: the palette has only one focusable element
      // (this input), so keep focus here rather than letting Tab escape
      // to the page behind the overlay.
      event.preventDefault();
    }
  };

  const activeId =
    visibleResults.length > 0 ? optionId(activeIndex) : undefined;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center bg-slate-900/40 px-4 pt-24 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Global search"
        className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-slate-200 px-4">
          <Search
            className="h-5 w-5 shrink-0 text-slate-400"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={LISTBOX_ID}
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            aria-label="Search Medighar"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search doctors, medicines, appointments, and more..."
            className="h-14 w-full min-w-0 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={close}
            aria-label="Close search"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-3">
          {!hasQuery && recentSearches.length > 0 && (
            <div className="mb-3 flex flex-col gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between px-1">
                <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                  <History className="h-3.5 w-3.5" aria-hidden="true" />
                  Recent Searches
                </span>
                <button
                  type="button"
                  onClick={clearRecent}
                  className="text-xs font-medium text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2 px-1">
                {recentSearches.map((recentQuery) => (
                  <button
                    key={recentQuery}
                    type="button"
                    onClick={() => selectRecentSearch(recentQuery)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    {recentQuery}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!hasQuery && (
            <p className="px-1 pb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              Quick Actions
            </p>
          )}

          {hasQuery && visibleResults.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-slate-500">
              No results for &ldquo;{query.trim()}&rdquo;
            </p>
          ) : (
            <ul
              id={LISTBOX_ID}
              role="listbox"
              aria-label="Search results"
              className="flex flex-col gap-4"
            >
              {hasQuery
                ? Object.entries(groups).map(([category, results]) => (
                    <li key={category}>
                      <p className="mb-1 px-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                        {category}
                      </p>
                      <ul role="presentation" className="flex flex-col gap-0.5">
                        {results.map((result) => {
                          const flatIndex = visibleResults.indexOf(result);
                          return (
                            <SearchResultItem
                              key={result.id}
                              result={result}
                              id={optionId(flatIndex)}
                              isActive={flatIndex === activeIndex}
                              onSelect={selectResult}
                              onHover={() => setActiveIndex(flatIndex)}
                            />
                          );
                        })}
                      </ul>
                    </li>
                  ))
                : visibleResults.map((result, index) => (
                    <SearchResultItem
                      key={result.id}
                      result={result}
                      id={optionId(index)}
                      isActive={index === activeIndex}
                      onSelect={selectResult}
                      onHover={() => setActiveIndex(index)}
                    />
                  ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <ArrowUp className="h-3 w-3" aria-hidden="true" />
              <ArrowDown className="h-3 w-3" aria-hidden="true" />
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <CornerDownLeft className="h-3 w-3" aria-hidden="true" />
              Select
            </span>
            <span>Esc to close</span>
          </div>
          <span>Ctrl/Cmd + K</span>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;

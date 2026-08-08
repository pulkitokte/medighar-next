import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/cn.js";

const VIEWPORT_MARGIN = 8;

/**
 * Normalizes a single option into a consistent { value, label } shape.
 * Accepts either a plain primitive (the existing, original API — every
 * pre-existing FilterSelect consumer passes a flat array like
 * ["All", ...RECORD_TYPES]) or an object with an explicit `value`/`label`
 * pair (for consumers that need a human-readable label distinct from the
 * underlying filter value, e.g. a member id vs. a member's full name).
 * A plain primitive normalizes to { value: option, label: option }, which
 * reproduces the exact previous behavior of this component with no
 * observable difference to any existing consumer.
 * @param {*} option
 * @returns {{ value: *, label: * }}
 */
function normalizeOption(option) {
  if (option && typeof option === "object" && "value" in option) {
    return { value: option.value, label: option.label ?? option.value };
  }
  return { value: option, label: option };
}

/**
 * Reusable labeled dropdown, shared by every module's filter panel.
 *
 * Note: this intentionally does NOT render a native <select>. A native
 * <select>'s open direction (up vs down) is decided entirely by the
 * browser/OS and cannot be controlled via CSS or JS, which is why two
 * identical <select> elements on the same page can open in different
 * directions depending on their position. This custom listbox gives us
 * real control: it always attempts to open downward, and only flips
 * upward when there is genuinely insufficient space below.
 *
 * `options` accepts either a flat array of primitive values (the
 * original API) or an array of { value, label } objects when the
 * filter's underlying value isn't itself human-readable (see
 * normalizeOption above). `value` and `onChange` always operate on the
 * raw `value`, never the `label` — the label is purely a display
 * concern.
 */
function FilterSelect({ label, value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const listRef = useRef(null);

  const baseId = useId();
  const labelId = `${baseId}-label`;
  const listboxId = `${baseId}-listbox`;

  const normalizedOptions = options.map(normalizeOption);
  const selectedOption = normalizedOptions.find(
    (option) => option.value === value,
  );

  const openDropdown = () => {
    const selectedIndex = normalizedOptions.findIndex(
      (option) => option.value === value,
    );
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpenUpward(false); // always attempt downward first
    setIsOpen(true);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const selectOption = (option) => {
    onChange(option.value);
    closeDropdown();
    triggerRef.current?.focus();
  };

  // Close on outside click / Escape.
  useEffect(() => {
    if (!isOpen) return undefined;

    function handlePointerDown(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        closeDropdown();
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closeDropdown();
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Viewport collision detection: measured synchronously before paint, so
  // there's no visible flicker between the default "downward" attempt and
  // the corrected direction.
  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current || !listRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const listRect = listRef.current.getBoundingClientRect();
    const spaceBelow =
      window.innerHeight - triggerRect.bottom - VIEWPORT_MARGIN;
    const spaceAbove = triggerRect.top - VIEWPORT_MARGIN;

    const needsUpward = listRect.height > spaceBelow && spaceAbove > spaceBelow;

    setOpenUpward((current) =>
      current === needsUpward ? current : needsUpward,
    );
  }, [isOpen]);

  const moveActiveIndex = (delta) => {
    setActiveIndex((previous) => {
      const next = previous + delta;
      return Math.min(Math.max(next, 0), normalizedOptions.length - 1);
    });
  };

  const handleTriggerKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      isOpen ? moveActiveIndex(1) : openDropdown();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      isOpen ? moveActiveIndex(-1) : openDropdown();
    } else if (event.key === "Home" && isOpen) {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End" && isOpen) {
      event.preventDefault();
      setActiveIndex(normalizedOptions.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!isOpen) {
        openDropdown();
      } else if (activeIndex >= 0) {
        selectOption(normalizedOptions[activeIndex]);
      }
    } else if (event.key === "Escape" && isOpen) {
      closeDropdown();
    }
  };

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1.5 text-sm">
      <span id={labelId} className="font-medium text-slate-700">
        {label}
      </span>

      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-labelledby={labelId}
        aria-activedescendant={
          isOpen && activeIndex >= 0
            ? `${listboxId}-option-${activeIndex}`
            : undefined
        }
        onClick={() => (isOpen ? closeDropdown() : openDropdown())}
        onKeyDown={handleTriggerKeyDown}
        className="transition-premium flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 hover:border-slate-300 focus:border-blue-400 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : value}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={labelId}
          className={cn(
            "absolute z-50 max-h-64 w-full min-w-[10rem] overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-900/10",
            openUpward ? "bottom-full mb-2" : "top-full mt-2",
          )}
        >
          {normalizedOptions.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;

            return (
              <li
                key={option.value}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectOption(option)}
                className={cn(
                  "cursor-pointer rounded-lg px-3 py-2 text-sm",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-50",
                  isSelected && !isActive && "font-medium text-slate-900",
                )}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default FilterSelect;

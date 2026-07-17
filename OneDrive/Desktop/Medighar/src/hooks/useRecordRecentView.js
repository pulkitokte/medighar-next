import { useEffect } from "react";
import { recordView } from "@/services/recent/recent.service.js";
import { isValidId } from "@/shared/lib/validation.js";

/**
 * Automatically records a view of the given entity as a side effect. Used
 * inside each module's *Details hook so visiting a Details page registers
 * it as recently viewed with no manual action required. Only records when
 * id is a genuinely valid id (e.g. skipped for not-found entities).
 * @param {"doctor"|"medicine"|"disease"|"pharmacy"} type
 * @param {string|null|undefined} id
 */
export function useRecordRecentView(type, id) {
  useEffect(() => {
    if (isValidId(id)) {
      recordView(type, id);
    }
  }, [type, id]);
}

import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

/** Catch-all for unknown paths. */
export function NotFoundPage() {
  useDocumentTitle("Page not found — Shunn Labs");

  return (
    <div className="grid min-h-svh place-items-center bg-paper px-5">
      <div className="max-w-md text-center">
        <p className="font-display text-6xl font-semibold text-leaf">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-fg-on-paper">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-fg-on-paper-muted">
          That URL doesn't exist. It may have moved, or the link may be out of
          date.
        </p>
        <Link
          to="/"
          className="mt-7 inline-block rounded-full bg-leaf px-5 py-2.5 text-sm font-semibold text-leaf-ink transition-colors hover:bg-leaf-strong"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

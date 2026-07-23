"use client";

import { bodyFont, displayFont } from "./fonts";
import "./globals.css";

const GlobalError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  console.error("Global error boundary", error);

  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <title>Something went wrong — Khryuchik</title>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "64px 24px",
            background: "linear-gradient(160deg, #fdf2ea 0%, #f9dde3 100%)",
            color: "#2b2a2e",
            fontFamily: "var(--font-body), Manrope, sans-serif",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 520 }}>
            <div
              aria-hidden
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 130,
                height: 130,
                margin: "0 auto 6px",
                borderRadius: "50%",
                background: "#f6d6bf",
                fontSize: 66,
              }}
            >
              🙈
            </div>
            <h1
              style={{
                margin: "14px 0 12px",
                fontFamily: "var(--font-display), serif",
                fontSize: 34,
                fontWeight: 700,
                lineHeight: 1.15,
                color: "#c2453f",
              }}
            >
              Something went wrong
            </h1>
            <p
              style={{
                margin: "0 auto 26px",
                maxWidth: 420,
                fontSize: 16,
                lineHeight: 1.6,
                color: "#8f8b93",
              }}
            >
              We&apos;ve hit an unexpected error. Please try refreshing the page
              in a couple of minutes.
            </p>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                border: "none",
                borderRadius: 999,
                padding: "14px 28px",
                fontSize: 15,
                fontWeight: 600,
                color: "#fff",
                background: "#e8637c",
                cursor: "pointer",
              }}
            >
              Refresh the page
            </button>
          </div>
        </main>
      </body>
    </html>
  );
};

export default GlobalError;

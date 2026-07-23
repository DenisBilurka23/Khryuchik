import Link from "next/link";

import styles from "./status-screen.module.css";
import type { StatusScreenAction, StatusScreenProps } from "./types";

const actionClassName = (variant: "primary" | "ghost") =>
  `${styles.btn} ${variant === "primary" ? styles.btnPrimary : styles.btnGhost}`;

const renderAction = (action: StatusScreenAction) => {
  const className = actionClassName(action.variant);

  if (action.kind === "link") {
    return (
      <Link key={action.label} href={action.href} className={className}>
        {action.label}
      </Link>
    );
  }

  return (
    <button
      key={action.label}
      type="button"
      onClick={action.onClick}
      className={className}
    >
      {action.label}
    </button>
  );
};

export const StatusScreen = ({
  emoji,
  blobTone = "pink",
  code,
  title,
  titleTone = "default",
  text,
  actions,
  showFloats = false,
  footer,
}: StatusScreenProps) => {
  const blobClassName = [
    styles.blob,
    blobTone === "warm" ? styles.blobWarm : styles.blobPink,
    code ? styles.blobOverlap : styles.blobStandalone,
  ].join(" ");

  return (
    <section className={styles.page}>
      {showFloats && (
        <>
          <span className={`${styles.float} ${styles.floatStar}`} aria-hidden>
            ⭐
          </span>
          <span className={`${styles.float} ${styles.floatBook}`} aria-hidden>
            📖
          </span>
          <span className={`${styles.float} ${styles.floatSparkle}`} aria-hidden>
            ✨
          </span>
        </>
      )}

      <div className={styles.content}>
        {code ? (
          <div className={styles.scene}>
            <span className={styles.code}>{code}</span>
            <span className={blobClassName} aria-hidden>
              {emoji}
            </span>
          </div>
        ) : (
          <span className={blobClassName} aria-hidden>
            {emoji}
          </span>
        )}

        <h1
          className={
            titleTone === "danger"
              ? `${styles.title} ${styles.titleDanger}`
              : styles.title
          }
        >
          {title}
        </h1>
        <p className={styles.text}>{text}</p>
        <div className={styles.cta}>{actions.map(renderAction)}</div>
        {footer ? <p className={styles.footer}>{footer}</p> : null}
      </div>
    </section>
  );
};

export type { StatusScreenAction, StatusScreenProps } from "./types";

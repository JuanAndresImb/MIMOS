import { getShippingEventDisplay, DELIVERED_EVENT_CODES } from "@/lib/bpost-events";

interface ShippingEventRow {
  event_code: string;
  occurred_at: string;
}

interface ShippingTimelineProps {
  events: ShippingEventRow[];
  trackingNumber: string;
}

export default function ShippingTimeline({ events, trackingNumber }: ShippingTimelineProps) {
  if (events.length === 0) return null;

  // Ordre chronologique (les plus anciens en premier)
  const sorted = [...events].sort(
    (a, b) => new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime()
  );

  return (
    <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--primary-100)" }}>
      <ol className="flex flex-col gap-2.5">
        {sorted.map((event, i) => {
          const display = getShippingEventDisplay(event.event_code);
          const isLast = i === sorted.length - 1;
          const isDelivered = DELIVERED_EVENT_CODES.has(event.event_code);
          const date = new Intl.DateTimeFormat("fr-BE", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(event.occurred_at));

          return (
            <li key={`${event.event_code}-${event.occurred_at}`} className="flex items-start gap-2.5">
              <span
                className="flex items-center justify-center rounded-full text-xs flex-shrink-0"
                style={{
                  width: "1.75rem",
                  height: "1.75rem",
                  backgroundColor: isLast && isDelivered ? "var(--success)" : isLast ? "var(--primary-500)" : "var(--primary-100)",
                  color: isLast ? "white" : "var(--text-secondary)",
                }}
                aria-hidden="true"
              >
                {display.emoji}
              </span>
              <div>
                <p
                  className="text-xs font-semibold"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: isLast ? "var(--text-primary)" : "var(--text-secondary)",
                  }}
                >
                  {display.label}
                </p>
                <p
                  className="text-[0.6875rem]"
                  style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)", opacity: 0.7 }}
                >
                  {date}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <a
        href={`https://track.bpost.cloud/btr/web/#/search?itemCode=${trackingNumber}&lang=fr`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-[0.6875rem] mt-2.5 transition-opacity hover:opacity-70"
        style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
      >
        Voir le détail sur bpost.cloud →
      </a>
    </div>
  );
}

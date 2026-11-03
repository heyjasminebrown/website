"use client";

import { useEffect, useState } from "react";

// Jasmine's CRM, which hosts the booking calendar.
const CRM_ORIGIN = "https://www.calljasminebrown.com";

export function BookingEmbed() {
  const [src, setSrc] = useState<string | null>(null);
  const [height, setHeight] = useState(900);

  useEffect(() => {
    // /meet -> main calendar; /meet/<calendar> -> that calendar.
    const calendar = window.location.pathname.replace(/^\/meet\/?/, "").split("/")[0];
    const params = new URLSearchParams({ embed: "1" });
    if (calendar) params.set("calendar", calendar.toLowerCase());
    setSrc(`${CRM_ORIGIN}/book?${params.toString()}`);

    // The booking page reports its height so the frame never scrolls inside.
    function onMessage(event: MessageEvent) {
      if (event.origin !== CRM_ORIGIN) return;
      const data = event.data as { type?: string; height?: number } | null;
      if (data?.type === "cjb-booking-height" && typeof data.height === "number" && data.height > 200) {
        setHeight(Math.ceil(data.height));
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!src) return <div style={{ height }} aria-busy="true" />;

  return (
    <iframe
      src={src}
      title="Book a call with Jasmine Brown"
      style={{ width: "100%", height, border: 0, display: "block" }}
      allow="clipboard-write"
    />
  );
}

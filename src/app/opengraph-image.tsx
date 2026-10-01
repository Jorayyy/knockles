import { ImageResponse } from "next/og";
import { getSettings } from "@/lib/content/access";
import { formatPhone } from "@/lib/utils";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Knock'ls Boxing Gym — Boxing & Muay Thai in Mactan, Cebu";
export const revalidate = 3600;

export default async function OpengraphImage() {
  const settings = await getSettings();
  const { business, trial } = settings;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#0a0a0c",
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0 2px, transparent 2px 28px)",
          color: "#efeae2",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              backgroundColor: "#e02b1d",
              transform: "rotate(45deg)",
            }}
          />
          <span
            style={{
              fontSize: 24,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#e8847b",
            }}
          >
            {[business.addressLine2, business.city].filter(Boolean).join(", ") ||
              "Mactan, Cebu"}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 108,
              fontWeight: 800,
              letterSpacing: -3,
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            {business.wordmark || "Knock'ls"}
            <span style={{ color: "#e02b1d" }}>.</span>
          </span>
          <span
            style={{
              marginTop: 20,
              fontSize: 34,
              color: "#9a958c",
              display: "flex",
            }}
          >
            {business.tagline || "Boxing Gym — Mactan, Cebu"}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 24,
            color: "#9a958c",
          }}
        >
          <span>{formatPhone(business.phoneDisplay || business.phone)}</span>
          <span
            style={{
              color: "#efeae2",
              border: "2px solid #e02b1d",
              padding: "12px 28px",
              textTransform: "uppercase",
              letterSpacing: 3,
              fontSize: 22,
            }}
          >
            {trial.label || "Book a trial session"}
          </span>
        </div>
      </div>
    ),
    size
  );
}

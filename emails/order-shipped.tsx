import { Link, Text, Hr } from "@react-email/components";
import { EmailLayout, styles } from "./_layout";

interface Props {
  name?: string;
  orderId?: string;
  carrier?: string;
  trackingNumber?: string;
  trackUrl?: string;
  estimatedDelivery?: string;
  items?: { name: string; quantity: number }[];
}

export default function OrderShippedEmail({
  name = "Ada",
  orderId = "VXE-A1B2C3",
  carrier = "GIG Logistics",
  trackingNumber = "GIG-9876543",
  trackUrl = "https://voxe.com/track-order?id=VXE-A1B2C3",
  estimatedDelivery = "Apr 10 – Apr 12, 2025",
  items = [
    { name: "Oversized Linen Shirt", quantity: 1 },
    { name: "Leather Chelsea Boots", quantity: 1 },
  ],
}: Props) {
  return (
    <EmailLayout preview={`Your VOXE order ${orderId} is on its way!`}>
      {/* Animated-feel progress bar */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ height: "3px", background: "linear-gradient(90deg, #C9A84C, #8B6914)", borderRadius: "2px", marginBottom: "16px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {["Order Placed", "Preparing", "Shipped", "Delivered"].map((step, i) => (
            <div key={step} style={{ textAlign: "center", flex: 1 }}>
              <div style={{
                width: "24px", height: "24px", borderRadius: "50%", margin: "0 auto 4px",
                backgroundColor: i <= 2 ? "#C9A84C" : "#1e1e1e",
                border: i <= 2 ? "none" : "1px solid #333",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {i <= 2 && <span style={{ color: "#0A0A0A", fontSize: "10px", fontWeight: "700" }}>✓</span>}
              </div>
              <Text style={{ ...styles.p, margin: 0, fontSize: "10px", color: i <= 2 ? "#C9A84C" : "#444", letterSpacing: "0.5px" }}>{step}</Text>
            </div>
          ))}
        </div>
      </div>

      <Text style={{ ...styles.p, color: "#C9A84C", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", margin: "0 0 8px" }}>
        On Its Way
      </Text>
      <Text style={styles.h1}>Your order{"\n"}has shipped, {name}.</Text>
      <Text style={styles.p}>
        Great news — <span style={{ color: "#F0E6D3" }}>{orderId}</span> has left our warehouse and is heading your way.
      </Text>

      <Link href={trackUrl} style={styles.btn}>Track Shipment</Link>

      <Hr style={styles.hr} />

      {/* Tracking details */}
      <div style={{ backgroundColor: "#111", border: "1px solid #1e1e1e", borderRadius: "6px", padding: "20px 24px", marginBottom: "24px" }}>
        {[
          { label: "Carrier",            value: carrier },
          { label: "Tracking Number",    value: trackingNumber },
          { label: "Estimated Delivery", value: estimatedDelivery },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
            <Text style={{ ...styles.p, margin: 0, fontSize: "12px", color: "#666" }}>{label}</Text>
            <Text style={{ ...styles.p, margin: 0, fontSize: "12px", color: "#F0E6D3", fontWeight: "600" }}>{value}</Text>
          </div>
        ))}
      </div>

      {/* Items in shipment */}
      <Text style={{ ...styles.p, color: "#666", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>
        Items in This Shipment
      </Text>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <span style={{ color: "#C9A84C", fontSize: "8px" }}>◆</span>
          <Text style={{ ...styles.p, margin: 0, fontSize: "13px", color: "#aaa" }}>
            {item.name} <span style={{ color: "#555" }}>× {item.quantity}</span>
          </Text>
        </div>
      ))}

      <Hr style={styles.hr} />

      <Text style={{ ...styles.p, fontSize: "12px", color: "#555" }}>
        If you have any issues with your delivery, reply to this email or contact us at{" "}
        <a href="mailto:hello@voxe.com" style={{ color: "#C9A84C", textDecoration: "none" }}>hello@voxe.com</a>.
      </Text>
    </EmailLayout>
  );
}

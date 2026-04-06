import { Link, Text, Hr, Row, Column, Section } from "@react-email/components";
import { EmailLayout, styles } from "./_layout";

interface OrderItem {
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

interface Props {
  name?: string;
  orderId?: string;
  items?: OrderItem[];
  subtotal?: number;
  shipping?: number;
  total?: number;
  address?: string;
  trackUrl?: string;
}

function formatNGN(n: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(n);
}

export default function OrderConfirmationEmail({
  name = "Ada",
  orderId = "VXE-A1B2C3",
  items = [
    { name: "Oversized Linen Shirt", size: "M", color: "Ivory", quantity: 1, price: 28500 },
    { name: "Leather Chelsea Boots", size: "42", color: "Black", quantity: 1, price: 65000 },
  ],
  subtotal = 93500,
  shipping = 3500,
  total = 97000,
  address = "14 Admiralty Way, Lekki Phase 1, Lagos",
  trackUrl = "https://voxe.com/track-order?id=VXE-A1B2C3",
}: Props) {
  return (
    <EmailLayout preview={`Order confirmed — ${orderId}. Thank you, ${name}!`}>
      <div style={{ height: "3px", background: "linear-gradient(90deg, #C9A84C, #8B6914)", borderRadius: "2px", marginBottom: "32px" }} />

      <Text style={{ ...styles.p, color: "#C9A84C", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", margin: "0 0 8px" }}>
        Order Confirmed
      </Text>
      <Text style={styles.h1}>Thank you,{"\n"}{name}.</Text>
      <Text style={styles.p}>
        Your order <span style={{ color: "#C9A84C", fontWeight: "600" }}>{orderId}</span> has been received and is being prepared. You'll get another email when it ships.
      </Text>

      <Link href={trackUrl} style={styles.btn}>Track Your Order</Link>

      <Hr style={styles.hr} />

      {/* Order items */}
      <Text style={{ ...styles.p, color: "#666", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>
        Your Items
      </Text>

      {items.map((item, i) => (
        <div key={i} style={{ ...styles.pill, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <Text style={{ ...styles.p, color: "#F0E6D3", margin: "0 0 2px", fontWeight: "600", fontSize: "13px" }}>{item.name}</Text>
            <Text style={{ ...styles.p, margin: 0, fontSize: "12px", color: "#666" }}>
              Size {item.size} · {item.color} · Qty {item.quantity}
            </Text>
          </div>
          <Text style={{ ...styles.p, margin: 0, color: "#C9A84C", fontWeight: "600", fontSize: "13px", whiteSpace: "nowrap" }}>
            {formatNGN(item.price * item.quantity)}
          </Text>
        </div>
      ))}

      <Hr style={styles.hr} />

      {/* Totals */}
      <div style={{ marginBottom: "8px" }}>
        {[
          { label: "Subtotal", value: formatNGN(subtotal) },
          { label: "Shipping", value: formatNGN(shipping) },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <Text style={{ ...styles.p, margin: 0, fontSize: "13px" }}>{label}</Text>
            <Text style={{ ...styles.p, margin: 0, fontSize: "13px", color: "#F0E6D3" }}>{value}</Text>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #1e1e1e" }}>
          <Text style={{ ...styles.p, margin: 0, fontWeight: "700", color: "#F0E6D3" }}>Total</Text>
          <Text style={{ ...styles.p, margin: 0, fontWeight: "700", color: "#C9A84C", fontSize: "18px" }}>{formatNGN(total)}</Text>
        </div>
      </div>

      <Hr style={styles.hr} />

      {/* Delivery address */}
      <Text style={{ ...styles.p, color: "#666", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>
        Delivering To
      </Text>
      <Text style={{ ...styles.p, color: "#F0E6D3", fontSize: "13px" }}>{address}</Text>

      <Text style={{ ...styles.p, fontSize: "12px", color: "#555", marginTop: "8px" }}>
        Estimated delivery: 3–5 business days within Lagos, 5–7 days nationwide.
      </Text>
    </EmailLayout>
  );
}

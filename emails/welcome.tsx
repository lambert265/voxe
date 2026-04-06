import { Link, Text, Hr } from "@react-email/components";
import { EmailLayout, styles } from "./_layout";

interface Props {
  name?: string;
  confirmUrl?: string;
}

export default function WelcomeEmail({ name = "Ada", confirmUrl = "https://voxe.com/auth/callback" }: Props) {
  return (
    <EmailLayout preview="Welcome to VOXE — confirm your email to get started">
      {/* Hero accent line */}
      <div style={{ height: "3px", background: `linear-gradient(90deg, #C9A84C, #8B6914)`, borderRadius: "2px", marginBottom: "32px" }} />

      <Text style={styles.h1}>Welcome to VOXE,{"\n"}{name}.</Text>
      <Text style={{ ...styles.p, marginBottom: "24px" }}>
        Your account has been created. Confirm your email address to unlock your full VOXE experience — wishlists, order tracking, and exclusive early access to drops.
      </Text>

      <Link href={confirmUrl} style={styles.btn}>Confirm Email Address</Link>

      <Hr style={styles.hr} />

      {/* What's next */}
      <Text style={{ ...styles.p, color: "#666", fontSize: "12px", marginBottom: "16px", letterSpacing: "2px", textTransform: "uppercase" }}>
        What's waiting for you
      </Text>

      {[
        { icon: "✦", title: "New Arrivals", desc: "Be first to shop the latest drops every week." },
        { icon: "◈", title: "Wishlist",     desc: "Save pieces and get notified when they go on sale." },
        { icon: "◉", title: "Order Tracking", desc: "Real-time updates on every order you place." },
      ].map(({ icon, title, desc }) => (
        <div key={title} style={{ display: "flex", gap: "14px", marginBottom: "16px", alignItems: "flex-start" }}>
          <span style={{ color: "#C9A84C", fontSize: "16px", lineHeight: "1.4", flexShrink: 0 }}>{icon}</span>
          <div>
            <Text style={{ ...styles.p, color: "#F0E6D3", margin: "0 0 2px", fontWeight: "600", fontSize: "13px" }}>{title}</Text>
            <Text style={{ ...styles.p, margin: 0, fontSize: "13px" }}>{desc}</Text>
          </div>
        </div>
      ))}

      <Hr style={styles.hr} />

      <Link href="https://voxe.com/shop" style={{ ...styles.btn, backgroundColor: "transparent", border: "1px solid #C9A84C", color: "#C9A84C" }}>
        Browse the Collection
      </Link>

      <Text style={{ ...styles.p, fontSize: "12px", color: "#555", marginTop: "24px" }}>
        This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
      </Text>
    </EmailLayout>
  );
}

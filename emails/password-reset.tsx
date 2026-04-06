import { Link, Text, Hr } from "@react-email/components";
import { EmailLayout, styles } from "./_layout";

interface Props {
  name?: string;
  resetUrl?: string;
}

export default function PasswordResetEmail({
  name = "Ada",
  resetUrl = "https://voxe.com/auth/reset?token=xxxx",
}: Props) {
  return (
    <EmailLayout preview="Reset your VOXE password — link expires in 1 hour">
      <div style={{ height: "3px", background: "linear-gradient(90deg, #C9A84C, #8B6914)", borderRadius: "2px", marginBottom: "32px" }} />

      {/* Lock icon */}
      <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
        <span style={{ fontSize: "20px" }}>🔑</span>
      </div>

      <Text style={styles.h1}>Password Reset</Text>
      <Text style={styles.p}>
        Hi {name}, we received a request to reset the password for your VOXE account. Click the button below to choose a new password.
      </Text>

      <Link href={resetUrl} style={styles.btn}>Reset My Password</Link>

      <Hr style={styles.hr} />

      <div style={{ backgroundColor: "#111", border: "1px solid #1e1e1e", borderRadius: "6px", padding: "16px 20px" }}>
        <Text style={{ ...styles.p, margin: "0 0 4px", fontSize: "12px", color: "#666", letterSpacing: "1px", textTransform: "uppercase" }}>
          Security Notice
        </Text>
        <Text style={{ ...styles.p, margin: 0, fontSize: "13px" }}>
          This link expires in <span style={{ color: "#F0E6D3" }}>1 hour</span>. If you didn't request a password reset, your account is safe — you can ignore this email.
        </Text>
      </div>

      <Hr style={styles.hr} />

      <Text style={{ ...styles.p, fontSize: "12px", color: "#555" }}>
        If the button doesn't work, copy and paste this link into your browser:
      </Text>
      <Text style={{ ...styles.p, fontSize: "11px", color: "#C9A84C", wordBreak: "break-all" }}>
        {resetUrl}
      </Text>

      <Text style={{ ...styles.p, fontSize: "12px", color: "#555", marginTop: "16px" }}>
        Need help? Contact us at{" "}
        <a href="mailto:hello@voxe.com" style={{ color: "#C9A84C", textDecoration: "none" }}>hello@voxe.com</a>
      </Text>
    </EmailLayout>
  );
}

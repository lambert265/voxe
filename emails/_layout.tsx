import {
  Body, Container, Head, Html, Img, Preview,
  Section, Text, Hr, Font,
} from "@react-email/components";
import { CSSProperties, ReactNode } from "react";

const GOLD = "#C9A84C";
const BLACK = "#0A0A0A";
const CREAM = "#F0E6D3";
const MUTED = "#888070";

export const styles = {
  body: { backgroundColor: "#111111", margin: 0, padding: 0, fontFamily: "'DM Sans', Helvetica, Arial, sans-serif" } as CSSProperties,
  container: { maxWidth: "560px", margin: "0 auto", backgroundColor: BLACK, borderRadius: "8px", overflow: "hidden", border: "1px solid #1e1e1e" } as CSSProperties,
  header: { backgroundColor: BLACK, padding: "32px 40px 24px", borderBottom: `1px solid #1e1e1e` } as CSSProperties,
  logo: { color: GOLD, fontSize: "28px", fontWeight: "700", letterSpacing: "-1px", fontFamily: "Georgia, serif", margin: 0 } as CSSProperties,
  tagline: { color: MUTED, fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase" as const, margin: "4px 0 0" },
  content: { padding: "36px 40px" } as CSSProperties,
  footer: { padding: "24px 40px", borderTop: "1px solid #1e1e1e", backgroundColor: "#0D0D0D" } as CSSProperties,
  footerText: { color: "#444", fontSize: "11px", margin: "0 0 4px", lineHeight: "1.6" } as CSSProperties,
  h1: { color: CREAM, fontSize: "26px", fontWeight: "700", margin: "0 0 8px", fontFamily: "Georgia, serif", lineHeight: "1.3" } as CSSProperties,
  p: { color: "#aaa", fontSize: "14px", lineHeight: "1.7", margin: "0 0 16px" } as CSSProperties,
  gold: { color: GOLD } as CSSProperties,
  cream: { color: CREAM } as CSSProperties,
  hr: { borderColor: "#1e1e1e", margin: "24px 0" } as CSSProperties,
  btn: { display: "inline-block", backgroundColor: GOLD, color: BLACK, padding: "14px 32px", borderRadius: "4px", fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase" as const, textDecoration: "none" } as CSSProperties,
  pill: { display: "inline-block", backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "4px", padding: "12px 16px", marginBottom: "8px", width: "100%" } as CSSProperties,
};

export function EmailLayout({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <Html>
      <Head>
        <Font fontFamily="DM Sans" fallbackFontFamily="Helvetica"
          webFont={{ url: "https://fonts.gstatic.com/s/dmsans/v15/rP2Hp2ywxg089UriCZOIHQ.woff2", format: "woff2" }}
          fontWeight={400} fontStyle="normal" />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={{ padding: "40px 16px" }}>
          <Container style={styles.container}>
            {/* Header */}
            <Section style={styles.header}>
              <Text style={styles.logo}>VOXE</Text>
              <Text style={styles.tagline}>Wear Your Story</Text>
            </Section>

            {/* Content */}
            <Section style={styles.content}>
              {children}
            </Section>

            {/* Footer */}
            <Section style={styles.footer}>
              <Text style={styles.footerText}>© {new Date().getFullYear()} VOXE. All rights reserved.</Text>
              <Text style={styles.footerText}>
                Questions? <a href="mailto:hello@voxe.com" style={{ color: GOLD, textDecoration: "none" }}>hello@voxe.com</a>
              </Text>
              <Text style={{ ...styles.footerText, marginTop: "12px" }}>
                <a href="#" style={{ color: "#444", textDecoration: "none", marginRight: "12px" }}>Unsubscribe</a>
                <a href="#" style={{ color: "#444", textDecoration: "none", marginRight: "12px" }}>Privacy Policy</a>
                <a href="#" style={{ color: "#444", textDecoration: "none" }}>Terms</a>
              </Text>
            </Section>
          </Container>
        </Container>
      </Body>
    </Html>
  );
}

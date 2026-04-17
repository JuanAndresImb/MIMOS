import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Hr,
  Section,
  Preview,
  Button,
} from "@react-email/components";

export interface ShippingNotificationProps {
  senderName: string;
  recipientPrenom: string;
  recipientVille: string;
  productName: string;
  orderId: string;
  trackingNumber: string;
  trackingUrl: string;
}

const primary = "#ff6b6b";
const dark    = "#1a1a1a";
const muted   = "#6c757d";
const bg      = "#f8f9fa";
const white   = "#ffffff";
const success = "#00b894";

export default function ShippingNotification({
  senderName,
  recipientPrenom,
  recipientVille,
  productName,
  orderId,
  trackingNumber,
  trackingUrl,
}: ShippingNotificationProps) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>
        Votre brownie box est en route vers {recipientPrenom} !
      </Preview>
      <Body style={{ backgroundColor: bg, fontFamily: "DM Sans, Helvetica, Arial, sans-serif", margin: 0, padding: "40px 0" }}>
        <Container style={{ maxWidth: "520px", margin: "0 auto", backgroundColor: white, borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>

          {/* Header */}
          <Section style={{ backgroundColor: success, padding: "28px 40px" }}>
            <Heading
              style={{ color: white, fontFamily: "Nunito, Helvetica, Arial, sans-serif", fontWeight: 900, fontSize: "22px", margin: 0 }}
            >
              La Brownie Box Belge
            </Heading>
          </Section>

          {/* Corps */}
          <Section style={{ padding: "36px 40px" }}>
            <Heading
              style={{ color: dark, fontFamily: "Nunito, Helvetica, Arial, sans-serif", fontWeight: 900, fontSize: "26px", marginTop: 0, marginBottom: "8px" }}
            >
              C&apos;est parti ! 🚀
            </Heading>
            <Text style={{ color: muted, fontSize: "15px", lineHeight: "1.6", marginTop: 0 }}>
              Bonjour {senderName}, votre brownie box pour{" "}
              <strong style={{ color: dark }}>{recipientPrenom}</strong> à {recipientVille}{" "}
              vient d&apos;être expédiée par bpost.
            </Text>

            {/* Produit */}
            <Section
              style={{ backgroundColor: "#f0faf7", borderRadius: "12px", padding: "20px 24px", marginTop: "20px", marginBottom: "24px" }}
            >
              <Text style={{ color: success, fontSize: "11px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "2px", margin: "0 0 8px 0" }}>
                Colis expédié
              </Text>
              <Text style={{ color: dark, fontSize: "15px", fontWeight: 700, margin: "0 0 4px 0" }}>
                {productName}
              </Text>
              <Text style={{ color: muted, fontSize: "13px", margin: 0 }}>
                Numéro de suivi :{" "}
                <span style={{ fontFamily: "monospace", color: dark, fontWeight: 600 }}>
                  {trackingNumber}
                </span>
              </Text>
            </Section>

            {/* CTA tracking */}
            <Section style={{ textAlign: "center" as const, marginBottom: "24px" }}>
              <Button
                href={trackingUrl}
                style={{
                  backgroundColor: success,
                  color: white,
                  fontFamily: "Nunito, Helvetica, Arial, sans-serif",
                  fontWeight: 700,
                  fontSize: "15px",
                  borderRadius: "999px",
                  padding: "14px 32px",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Suivre mon colis bpost
              </Button>
            </Section>

            <Text style={{ color: muted, fontSize: "13px", lineHeight: "1.6" }}>
              La livraison est généralement effectuée dans les 1 à 3 jours ouvrables.
              Une fois le colis reçu, le destinataire découvrira votre message personnalisé sur le sleeve.
            </Text>

            <Text style={{ color: muted, fontSize: "13px", lineHeight: "1.6", marginTop: "16px" }}>
              Réf. commande :{" "}
              <span style={{ fontFamily: "monospace", color: dark, fontWeight: 600 }}>
                {orderId.slice(0, 8).toUpperCase()}
              </span>
            </Text>
          </Section>

          {/* Footer */}
          <Hr style={{ borderColor: "#d4edda", margin: 0 }} />
          <Section style={{ padding: "20px 40px", textAlign: "center" as const }}>
            <Text style={{ color: muted, fontSize: "12px", margin: 0 }}>
              La Brownie Box Belge — Belgique 🇧🇪
            </Text>
            <Text style={{ color: muted, fontSize: "11px", margin: "4px 0 0 0" }}>
              Pour toute question : bonjour@brownieboxbelge.be
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

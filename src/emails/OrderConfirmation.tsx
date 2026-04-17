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
  Row,
  Column,
} from "@react-email/components";

export interface OrderConfirmationProps {
  senderName: string;
  recipientPrenom: string;
  recipientNom: string;
  recipientAdresse: string;
  recipientVille: string;
  occasionNom: string;
  productName: string;
  totalEuros: string;
  orderId: string;
  message: string;
}

const primary = "#ff6b6b";
const dark = "#1a1a1a";
const muted = "#6c757d";
const bg = "#f8f9fa";
const white = "#ffffff";

export default function OrderConfirmation({
  senderName,
  recipientPrenom,
  recipientNom,
  recipientAdresse,
  recipientVille,
  occasionNom,
  productName,
  totalEuros,
  orderId,
  message,
}: OrderConfirmationProps) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>
        Commande confirmée — votre brownie box est en route vers {recipientPrenom} !
      </Preview>
      <Body style={{ backgroundColor: bg, fontFamily: "DM Sans, Helvetica, Arial, sans-serif", margin: 0, padding: "40px 0" }}>
        <Container style={{ maxWidth: "520px", margin: "0 auto", backgroundColor: white, borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>

          {/* Header */}
          <Section style={{ backgroundColor: primary, padding: "28px 40px" }}>
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
              Commande confirmée !
            </Heading>
            <Text style={{ color: muted, fontSize: "15px", lineHeight: "1.6", marginTop: 0 }}>
              Bonjour {senderName}, votre brownie box est bien enregistrée.
              Elle sera préparée avec soin et expédiée dans les prochains jours ouvrables.
            </Text>

            {/* Récap commande */}
            <Section
              style={{ backgroundColor: "#fff5f5", borderRadius: "12px", padding: "20px 24px", marginTop: "24px", marginBottom: "24px" }}
            >
              <Text style={{ color: primary, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 12px 0" }}>
                {occasionNom}
              </Text>
              <Row style={{ marginBottom: "8px" }}>
                <Column>
                  <Text style={{ color: muted, fontSize: "13px", margin: 0 }}>Produit</Text>
                </Column>
                <Column style={{ textAlign: "right" as const }}>
                  <Text style={{ color: dark, fontSize: "13px", fontWeight: 600, margin: 0 }}>{productName}</Text>
                </Column>
              </Row>
              <Row style={{ marginBottom: "8px" }}>
                <Column>
                  <Text style={{ color: muted, fontSize: "13px", margin: 0 }}>Destinataire</Text>
                </Column>
                <Column style={{ textAlign: "right" as const }}>
                  <Text style={{ color: dark, fontSize: "13px", fontWeight: 600, margin: 0 }}>
                    {recipientPrenom} {recipientNom}
                  </Text>
                </Column>
              </Row>
              <Row style={{ marginBottom: "8px" }}>
                <Column>
                  <Text style={{ color: muted, fontSize: "13px", margin: 0 }}>Adresse</Text>
                </Column>
                <Column style={{ textAlign: "right" as const }}>
                  <Text style={{ color: dark, fontSize: "13px", fontWeight: 600, margin: 0 }}>
                    {recipientAdresse}, {recipientVille}
                  </Text>
                </Column>
              </Row>
              <Hr style={{ borderColor: "#ffe3e3", marginTop: "12px", marginBottom: "12px" }} />
              <Row>
                <Column>
                  <Text style={{ color: dark, fontSize: "15px", fontWeight: 700, margin: 0 }}>Total payé</Text>
                </Column>
                <Column style={{ textAlign: "right" as const }}>
                  <Text style={{ color: primary, fontSize: "18px", fontWeight: 900, margin: 0 }}>{totalEuros}</Text>
                </Column>
              </Row>
            </Section>

            {/* Message */}
            <Section
              style={{ borderLeft: `3px solid ${primary}`, paddingLeft: "16px", marginBottom: "24px" }}
            >
              <Text style={{ color: muted, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 6px 0" }}>
                Votre message sur le sleeve
              </Text>
              <Text style={{ color: dark, fontSize: "14px", fontStyle: "italic", lineHeight: "1.6", margin: 0 }}>
                &quot;{message}&quot;
              </Text>
            </Section>

            <Text style={{ color: muted, fontSize: "13px", lineHeight: "1.6" }}>
              Réf. commande :{" "}
              <span style={{ fontFamily: "monospace", color: dark, fontWeight: 600 }}>
                {orderId.slice(0, 8).toUpperCase()}
              </span>
            </Text>
          </Section>

          {/* Footer */}
          <Hr style={{ borderColor: "#ffe3e3", margin: 0 }} />
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

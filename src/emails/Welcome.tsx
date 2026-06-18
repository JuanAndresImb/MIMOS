import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Preview,
  Button,
} from "@react-email/components";

export interface WelcomeProps {
  firstName: string;
  accountUrl: string;
}

const primary = "#ff6b6b";
const dark = "#1a1a1a";
const muted = "#6c757d";
const bg = "#f8f9fa";
const white = "#ffffff";

export default function Welcome({ firstName, accountUrl }: WelcomeProps) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>Bienvenue dans la famille MIMOS — votre espace vous attend</Preview>
      <Body style={{ backgroundColor: bg, fontFamily: "DM Sans, Helvetica, Arial, sans-serif", margin: 0, padding: "40px 0" }}>
        <Container style={{ maxWidth: "520px", margin: "0 auto", backgroundColor: white, borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>

          {/* Header */}
          <Section style={{ backgroundColor: primary, padding: "28px 40px" }}>
            <Heading
              style={{ color: white, fontFamily: "Nunito, Helvetica, Arial, sans-serif", fontWeight: 900, fontSize: "22px", margin: 0 }}
            >
              MIMOS
            </Heading>
          </Section>

          {/* Corps */}
          <Section style={{ padding: "36px 40px" }}>
            <Heading
              style={{ color: dark, fontFamily: "Nunito, Helvetica, Arial, sans-serif", fontWeight: 900, fontSize: "26px", marginTop: 0, marginBottom: "8px" }}
            >
              Bienvenue, {firstName} !
            </Heading>
            <Text style={{ color: muted, fontSize: "15px", lineHeight: "1.7", marginTop: 0 }}>
              Votre compte MIMOS est prêt. À partir de maintenant, vous pouvez
              suivre vos commandes, retrouver vos adresses et préparer votre
              prochain geste d&apos;attention en quelques clics — partout où
              il y a quelqu&apos;un à qui penser.
            </Text>

            <Section
              style={{ backgroundColor: "#fff5f5", borderRadius: "12px", padding: "20px 24px", marginTop: "24px", marginBottom: "28px" }}
            >
              <Text style={{ color: primary, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 8px 0" }}>
                Dans votre espace
              </Text>
              <Text style={{ color: dark, fontSize: "14px", lineHeight: "1.8", margin: 0 }}>
                📦 Le suivi de vos commandes en un coup d&apos;œil<br />
                🏠 Vos adresses de livraison enregistrées<br />
                🤍 Un accès rapide pour renvoyer un MIMOS
              </Text>
            </Section>

            <Button
              href={accountUrl}
              style={{
                backgroundColor: primary,
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
              Accéder à mon compte
            </Button>

            <Text style={{ color: muted, fontSize: "13px", lineHeight: "1.6", marginTop: "32px" }}>
              MIMOS, c&apos;est l&apos;attention manifestée — 3 clics pour dire
              &laquo;&nbsp;je pense à toi&nbsp;&raquo;. Merci de faire partie de l&apos;aventure.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

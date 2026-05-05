import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export interface InvoiceData {
  invoiceNumber: string;
  issuedAt: Date;
  orderId: string;
  orderCreatedAt: Date;
  companyName: string | null;
  vatNumber: string | null;
  customerEmail: string | null;
  deliveryAddress: {
    prenom?: string;
    nom?: string;
    adresse?: string;
    codePostal?: string;
    ville?: string;
  } | null;
  items: Array<{
    name: string;
    quantity: number;
    unitPriceCents: number;
  }>;
  totalCents: number;
  discountCents: number;
}

const CORAL   = rgb(0.72, 0.53, 0.29); /* Cantaloupe accent #B8874A */
const DARK    = rgb(0.1,  0.1,  0.1);
const MED     = rgb(0.25, 0.25, 0.25);
const MUTED   = rgb(0.45, 0.45, 0.45);
const LIGHT   = rgb(0.85, 0.85, 0.85);
const BG_ROW  = rgb(0.97, 0.95, 0.93);
const VAT_RATE = 0.21;

function fmtDate(d: Date) {
  return d.toLocaleDateString("fr-BE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function fmtEur(cents: number) {
  return `${(cents / 100).toFixed(2)} €`;
}

export async function generateInvoicePdf(data: InvoiceData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4
  const font     = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = page.getSize();
  const L = 50;  // left margin
  const R = width - 50; // right edge
  let y = height - 50;

  const text  = (t: string, x: number, yy: number, size: number, color = DARK, f = font) =>
    page.drawText(t, { x, y: yy, font: f, size, color });
  const rtext = (t: string, rightX: number, yy: number, size: number, color = DARK, f = font) => {
    const w = f.widthOfTextAtSize(t, size);
    page.drawText(t, { x: rightX - w, y: yy, font: f, size, color });
  };
  const line  = (x1: number, yy: number, x2: number, color = LIGHT, thickness = 0.5) =>
    page.drawLine({ start: { x: x1, y: yy }, end: { x: x2, y: yy }, thickness, color });

  // ── Vendeur ──────────────────────────────────────────────────
  text("MIMOS", L, y, 18, CORAL, fontBold);
  y -= 18;
  text("Belgique  ·  www.mimos.be", L, y, 8, MUTED);

  // ── FACTURE titre + méta ─────────────────────────────────────
  y -= 38;
  text("FACTURE", L, y, 26, DARK, fontBold);
  text(`N° ${data.invoiceNumber}`,          R - 180, y,      11, DARK, fontBold);
  text(`Date d'émission : ${fmtDate(data.issuedAt)}`,    R - 180, y - 16, 8, MUTED);
  text(`Date de commande : ${fmtDate(data.orderCreatedAt)}`, R - 180, y - 28, 8, MUTED);

  y -= 24;
  line(L, y, R);

  // ── Destinataire ─────────────────────────────────────────────
  y -= 20;
  text("FACTURÉ À", L, y, 8, MUTED, fontBold);
  y -= 16;
  if (data.companyName) { text(data.companyName, L, y, 11, DARK, fontBold); y -= 14; }
  if (data.vatNumber)   { text(`TVA : ${data.vatNumber}`, L, y, 9, MED); y -= 12; }
  if (data.customerEmail) { text(data.customerEmail, L, y, 9, MED); y -= 12; }
  if (data.deliveryAddress?.adresse) {
    text(data.deliveryAddress.adresse, L, y, 9, MED); y -= 12;
    const cp = `${data.deliveryAddress.codePostal ?? ""} ${data.deliveryAddress.ville ?? ""}`.trim();
    if (cp) { text(cp, L, y, 9, MED); y -= 12; }
  }

  // ── Tableau articles ─────────────────────────────────────────
  y -= 22;
  const cDesc = L;
  const cQty  = R - 230;
  const cHtva = R - 170;
  const cTva  = R - 85;
  const cTotl = R;

  page.drawRectangle({ x: L, y: y - 5, width: R - L, height: 20, color: BG_ROW });
  text("Description",  cDesc + 4, y, 8, DARK, fontBold);
  text("Qté",          cQty,      y, 8, DARK, fontBold);
  text("P.U. HTVA",    cHtva,     y, 8, DARK, fontBold);
  text("TVA 21%",      cTva,      y, 8, DARK, fontBold);
  rtext("Total TVAC",  cTotl,     y, 8, DARK, fontBold);
  y -= 24;

  let subtotalHtva = 0;
  let subtotalTva  = 0;

  for (const item of data.items) {
    const lineCents = item.quantity * item.unitPriceCents;
    const htva = lineCents / (1 + VAT_RATE);
    const tva  = lineCents - htva;
    subtotalHtva += htva;
    subtotalTva  += tva;

    text(item.name,                          cDesc + 4, y, 9, DARK);
    text(String(item.quantity),              cQty,      y, 9, DARK);
    text(fmtEur(htva / item.quantity),       cHtva,     y, 9, DARK);
    text(fmtEur(tva),                        cTva,      y, 9, DARK);
    rtext(fmtEur(lineCents),                 cTotl,     y, 9, DARK);
    y -= 20;
  }

  // ── Totaux ────────────────────────────────────────────────────
  y -= 6;
  line(cHtva, y, R);
  y -= 14;

  text("Sous-total HTVA :", cHtva, y, 9, MUTED);
  rtext(fmtEur(subtotalHtva), cTotl, y, 9, MED);
  y -= 13;

  text("TVA 21% :", cHtva, y, 9, MUTED);
  rtext(fmtEur(subtotalTva), cTotl, y, 9, MED);
  y -= 13;

  if (data.discountCents > 0) {
    text("Remise :", cHtva, y, 9, MUTED);
    rtext(`-${fmtEur(data.discountCents)}`, cTotl, y, 9, CORAL);
    y -= 13;
  }

  line(cHtva, y, R, CORAL, 1);
  y -= 15;

  text("TOTAL TVAC :", cHtva, y, 11, DARK, fontBold);
  rtext(fmtEur(data.totalCents), cTotl, y, 11, CORAL, fontBold);

  // ── Footer ────────────────────────────────────────────────────
  line(L, 55, R);
  text("Merci pour votre confiance — MIMOS", L, 42, 8, MUTED);
  rtext(data.invoiceNumber, R, 42, 8, MUTED);

  return doc.save();
}

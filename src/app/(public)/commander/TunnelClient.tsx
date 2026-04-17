"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod";
import type { Product } from "@/lib/services/products";
import type { Occasion } from "@/data/occasions";
import { formatPriceCents } from "@/lib/utils";
import { createOrder, validatePromoCode } from "@/actions/orders";

// ─── Schémas ─────────────────────────────────────────────────────────────────

const messageSchema = z.object({
  recipientMessage: z
    .string()
    .min(1, "Requis")
    .max(200, "Maximum 200 caractères"),
  senderName: z.string().min(1, "Requis").max(100, "Maximum 100 caractères"),
});

const livraisonSchema = z.object({
  email: z.string().min(1, "Requis").email("Email invalide"),
  prenom: z.string().min(1, "Requis").max(100),
  nom: z.string().min(1, "Requis").max(100),
  adresse: z.string().min(1, "Requis").max(255),
  complementAdresse: z.string().max(255).optional(),
  codePostal: z
    .string()
    .regex(/^\d{4}$/, "Code postal belge à 4 chiffres"),
  ville: z.string().min(1, "Requis").max(100),
});

type MessageData = z.infer<typeof messageSchema>;
type LivraisonData = z.infer<typeof livraisonSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  product: Product;
  occasion: Occasion;
  initialPromoCode?: string;
}

type Step = 1 | 2 | 3;

// ─── Sous-composants ──────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: Step }) {
  const steps = [
    { num: 1 as Step, label: "Message" },
    { num: 2 as Step, label: "Livraison" },
    { num: 3 as Step, label: "Paiement" },
  ];

  return (
    <nav
      aria-label="Étapes de commande"
      className="flex items-start justify-center gap-0 mb-10"
    >
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-start">
          <div className="flex flex-col items-center gap-1 w-16">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
              style={{
                backgroundColor:
                  current === step.num
                    ? "var(--primary-500)"
                    : current > step.num
                    ? "var(--success)"
                    : "var(--primary-100)",
                color:
                  current >= step.num ? "white" : "var(--text-secondary)",
              }}
              aria-current={current === step.num ? "step" : undefined}
            >
              {current > step.num ? "✓" : step.num}
            </div>
            <span
              className="text-xs text-center"
              style={{
                fontFamily: "var(--font-label)",
                color:
                  current === step.num
                    ? "var(--primary-700)"
                    : "var(--text-secondary)",
              }}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className="h-0.5 w-8 sm:w-12 mx-1 mt-4"
              style={{
                backgroundColor:
                  current > step.num
                    ? "var(--primary-500)"
                    : "var(--primary-100)",
              }}
            />
          )}
        </div>
      ))}
    </nav>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      className="text-sm mt-1"
      style={{ color: "var(--error)", fontFamily: "var(--font-body)" }}
      role="alert"
    >
      {message}
    </p>
  );
}

function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium mb-1"
      style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
    >
      {children}
      {required && (
        <span className="ml-0.5" style={{ color: "var(--error)" }} aria-hidden>
          *
        </span>
      )}
    </label>
  );
}

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent";
const inputStyle = {
  fontFamily: "var(--font-body)",
  borderColor: "var(--primary-100)",
  backgroundColor: "white",
  color: "var(--text-primary)",
};

// ─── Étape 1 : Message ────────────────────────────────────────────────────────

function StepMessage({
  occasion,
  defaultValues,
  onNext,
}: {
  occasion: Occasion;
  defaultValues?: Partial<MessageData>;
  onNext: (data: MessageData) => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<MessageData>({
    resolver: standardSchemaResolver(messageSchema),
    defaultValues,
  });

  const message = watch("recipientMessage", defaultValues?.recipientMessage ?? "");

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <h2
        className="text-2xl font-black mb-6"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        Votre message personnalisé
      </h2>

      {/* Preview sleeve */}
      <div
        className="rounded-2xl p-6 mb-6 min-h-[120px] relative"
        style={{ backgroundColor: occasion.sleeveTokens.bg }}
        aria-label="Aperçu du sleeve"
      >
        <span
          className="block text-xs uppercase tracking-widest mb-3"
          style={{
            fontFamily: "var(--font-label)",
            color: occasion.sleeveTokens.accent,
          }}
        >
          Aperçu du sleeve — {occasion.sleeve}
        </span>
        <p
          className="text-base leading-relaxed italic"
          style={{
            fontFamily: "var(--font-body)",
            color: occasion.sleeveTokens.dark,
            minHeight: "3rem",
          }}
        >
          {message || (
            <span style={{ opacity: 0.4 }}>{occasion.messageExemple}</span>
          )}
        </p>
      </div>

      {/* Textarea message */}
      <div className="mb-4">
        <Label htmlFor="recipientMessage" required>
          Message pour le destinataire
        </Label>
        <textarea
          id="recipientMessage"
          rows={4}
          placeholder={occasion.messageExemple}
          className={inputClass}
          style={inputStyle}
          {...register("recipientMessage")}
        />
        <div className="flex justify-between items-center mt-1">
          <FieldError message={errors.recipientMessage?.message} />
          <span
            className="text-xs ml-auto"
            style={{
              fontFamily: "var(--font-label)",
              color: message.length > 180 ? "var(--warning)" : "var(--text-secondary)",
            }}
          >
            {message.length}/200
          </span>
        </div>
      </div>

      {/* Nom expéditeur */}
      <div className="mb-8">
        <Label htmlFor="senderName" required>
          Votre prénom (de la part de…)
        </Label>
        <input
          id="senderName"
          type="text"
          placeholder="Marie"
          className={inputClass}
          style={inputStyle}
          {...register("senderName")}
        />
        <FieldError message={errors.senderName?.message} />
      </div>

      <button
        type="submit"
        className="w-full py-4 rounded-full text-white font-semibold text-base transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2"
        style={{
          backgroundColor: occasion.sleeveTokens.accent,
          fontFamily: "var(--font-body)",
        }}
      >
        Suivant — Adresse de livraison
      </button>
    </form>
  );
}

// ─── Étape 2 : Livraison ──────────────────────────────────────────────────────

function StepLivraison({
  occasion,
  defaultValues,
  onNext,
  onBack,
}: {
  occasion: Occasion;
  defaultValues?: Partial<LivraisonData>;
  onNext: (data: LivraisonData) => void;
  onBack: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LivraisonData>({
    resolver: standardSchemaResolver(livraisonSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <h2
        className="text-2xl font-black mb-6"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        Adresse de livraison
      </h2>

      {/* Email */}
      <div className="mb-4">
        <Label htmlFor="email" required>
          Votre email (confirmation de commande)
        </Label>
        <input
          id="email"
          type="email"
          placeholder="vous@exemple.be"
          className={inputClass}
          style={inputStyle}
          {...register("email")}
        />
        <FieldError message={errors.email?.message} />
      </div>

      {/* Prénom + Nom destinataire */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="prenom" required>
            Prénom destinataire
          </Label>
          <input
            id="prenom"
            type="text"
            placeholder="Julie"
            className={inputClass}
            style={inputStyle}
            {...register("prenom")}
          />
          <FieldError message={errors.prenom?.message} />
        </div>
        <div>
          <Label htmlFor="nom" required>
            Nom destinataire
          </Label>
          <input
            id="nom"
            type="text"
            placeholder="Dupont"
            className={inputClass}
            style={inputStyle}
            {...register("nom")}
          />
          <FieldError message={errors.nom?.message} />
        </div>
      </div>

      {/* Adresse */}
      <div className="mb-4">
        <Label htmlFor="adresse" required>
          Adresse
        </Label>
        <input
          id="adresse"
          type="text"
          placeholder="Rue de la Loi 16"
          className={inputClass}
          style={inputStyle}
          {...register("adresse")}
        />
        <FieldError message={errors.adresse?.message} />
      </div>

      {/* Complément */}
      <div className="mb-4">
        <Label htmlFor="complementAdresse">
          Complément d&apos;adresse
        </Label>
        <input
          id="complementAdresse"
          type="text"
          placeholder="Boîte 3, appartement 2B…"
          className={inputClass}
          style={inputStyle}
          {...register("complementAdresse")}
        />
      </div>

      {/* Code postal + Ville */}
      <div className="grid grid-cols-[140px_1fr] gap-4 mb-4">
        <div>
          <Label htmlFor="codePostal" required>
            Code postal
          </Label>
          <input
            id="codePostal"
            type="text"
            placeholder="1000"
            maxLength={4}
            className={inputClass}
            style={inputStyle}
            {...register("codePostal")}
          />
          <FieldError message={errors.codePostal?.message} />
        </div>
        <div>
          <Label htmlFor="ville" required>
            Ville
          </Label>
          <input
            id="ville"
            type="text"
            placeholder="Bruxelles"
            className={inputClass}
            style={inputStyle}
            {...register("ville")}
          />
          <FieldError message={errors.ville?.message} />
        </div>
      </div>

      {/* Pays — fixed Belgique */}
      <div className="mb-8">
        <Label htmlFor="pays">Pays</Label>
        <input
          id="pays"
          type="text"
          value="Belgique"
          readOnly
          className={inputClass}
          style={{
            ...inputStyle,
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-secondary)",
            cursor: "default",
          }}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-4 rounded-full font-semibold text-base transition-colors hover:bg-[var(--primary-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2"
          style={{
            color: "var(--text-primary)",
            border: "2px solid var(--primary-100)",
            fontFamily: "var(--font-body)",
          }}
        >
          Retour
        </button>
        <button
          type="submit"
          className="flex-[2] py-4 rounded-full text-white font-semibold text-base transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2"
          style={{
            backgroundColor: occasion.sleeveTokens.accent,
            fontFamily: "var(--font-body)",
          }}
        >
          Suivant — Résumé & paiement
        </button>
      </div>
    </form>
  );
}

// ─── Étape 3 : Résumé + Paiement ─────────────────────────────────────────────

function StepPaiement({
  product,
  occasion,
  messageData,
  livraisonData,
  onBack,
  initialPromoCode,
  idempotencyKey,
}: {
  product: Product;
  occasion: Occasion;
  messageData: MessageData;
  livraisonData: LivraisonData;
  onBack: () => void;
  initialPromoCode?: string;
  idempotencyKey: string;
}) {
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoCodeId, setPromoCodeId] = useState<string | null>(null);
  const [promoApplied, setPromoApplied] = useState("");
  const [isValidating, startValidation] = useTransition();

  // Auto-appliquer le code promo passé depuis la page destinataire
  useEffect(() => {
    if (!initialPromoCode || promoApplied) return;
    startValidation(async () => {
      const result = await validatePromoCode(initialPromoCode.trim());
      if (result.valid) {
        setPromoDiscount(result.discountCents);
        setPromoCodeId(result.promoCodeId);
        setPromoApplied(initialPromoCode.trim().toUpperCase());
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPromoCode]);
  const [isSubmitting, startSubmit] = useTransition();
  const [submitError, setSubmitError] = useState("");

  const totalCents = Math.max(0, product.price_cents - promoDiscount);

  function handleApplyPromo() {
    if (!promoInput.trim()) return;
    setPromoError("");
    startValidation(async () => {
      const result = await validatePromoCode(promoInput.trim());
      if (result.valid) {
        setPromoDiscount(result.discountCents);
        setPromoCodeId(result.promoCodeId);
        setPromoApplied(promoInput.trim().toUpperCase());
        setPromoInput("");
      } else {
        setPromoError(result.error);
        setPromoDiscount(0);
        setPromoCodeId(null);
        setPromoApplied("");
      }
    });
  }

  function handleSubmit() {
    setSubmitError("");
    startSubmit(async () => {
      const result = await createOrder({
        idempotencyKey,
        productId: product.id,
        occasionSlug: occasion.slug,
        recipientMessage: messageData.recipientMessage,
        senderName: messageData.senderName,
        email: livraisonData.email,
        deliveryAddress: {
          prenom: livraisonData.prenom,
          nom: livraisonData.nom,
          adresse: livraisonData.adresse,
          complementAdresse: livraisonData.complementAdresse,
          codePostal: livraisonData.codePostal,
          ville: livraisonData.ville,
          pays: "Belgique",
        },
        promoCode: promoApplied || undefined,
      });
      if (!result.success) {
        setSubmitError(result.error);
      }
      // Si succès : redirect géré dans la Server Action
    });
  }

  const SummaryRow = ({
    label,
    value,
  }: {
    label: string;
    value: string;
  }) => (
    <div className="flex justify-between py-2 border-b" style={{ borderColor: "var(--primary-100)" }}>
      <span
        className="text-sm"
        style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
      >
        {label}
      </span>
      <span
        className="text-sm font-medium"
        style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
      >
        {value}
      </span>
    </div>
  );

  return (
    <div>
      <h2
        className="text-2xl font-black mb-6"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        Résumé & paiement
      </h2>

      {/* Résumé commande */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
      >
        <p
          className="text-xs uppercase tracking-widest mb-3"
          style={{ fontFamily: "var(--font-label)", color: "var(--primary-700)" }}
        >
          Votre commande
        </p>

        <SummaryRow label={product.name} value={formatPriceCents(product.price_cents)} />
        <SummaryRow
          label="Message"
          value={`"${messageData.recipientMessage.slice(0, 40)}${messageData.recipientMessage.length > 40 ? "…" : ""}"`}
        />
        <SummaryRow
          label="Livraison"
          value={`${livraisonData.prenom} ${livraisonData.nom}, ${livraisonData.codePostal} ${livraisonData.ville}`}
        />
        <SummaryRow label="Frais de livraison" value="Offerts" />

        {promoApplied && (
          <div className="flex justify-between py-2 border-b" style={{ borderColor: "var(--primary-100)" }}>
            <span
              className="text-sm"
              style={{ fontFamily: "var(--font-body)", color: "var(--success)" }}
            >
              Code promo {promoApplied}
            </span>
            <span
              className="text-sm font-medium"
              style={{ fontFamily: "var(--font-body)", color: "var(--success)" }}
            >
              −{formatPriceCents(promoDiscount)}
            </span>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between pt-3 mt-1">
          <span
            className="text-base font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Total TVA incluse
          </span>
          <span
            className="text-xl font-black"
            style={{ fontFamily: "var(--font-display)", color: occasion.sleeveTokens.accent }}
          >
            {formatPriceCents(totalCents)}
          </span>
        </div>
      </div>

      {/* Code promo */}
      {!promoApplied && (
        <div className="mb-6">
          <Label htmlFor="promoCode">Code promo</Label>
          <div className="flex gap-2">
            <input
              id="promoCode"
              type="text"
              placeholder="EX: BIENVENUE10"
              value={promoInput}
              onChange={(e) => {
                setPromoInput(e.target.value.toUpperCase());
                setPromoError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
              className={inputClass}
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              disabled={isValidating || !promoInput.trim()}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: "var(--primary-100)",
                color: "var(--primary-700)",
                fontFamily: "var(--font-body)",
              }}
            >
              {isValidating ? "…" : "Appliquer"}
            </button>
          </div>
          {promoError && (
            <p
              className="text-sm mt-1"
              style={{ color: "var(--error)", fontFamily: "var(--font-body)" }}
              role="alert"
            >
              {promoError}
            </p>
          )}
        </div>
      )}

      {/* Erreur submit */}
      {submitError && (
        <div
          className="rounded-xl px-4 py-3 mb-4 text-sm"
          style={{
            backgroundColor: "#fef2f2",
            color: "var(--error)",
            fontFamily: "var(--font-body)",
          }}
          role="alert"
        >
          {submitError}
        </div>
      )}

      {/* Note paiement */}
      <p
        className="text-xs text-center mb-4"
        style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
      >
        🔒 Paiement sécurisé via Mollie
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 py-4 rounded-full font-semibold text-base transition-colors hover:bg-[var(--primary-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2 disabled:opacity-50"
          style={{
            color: "var(--text-primary)",
            border: "2px solid var(--primary-100)",
            fontFamily: "var(--font-body)",
          }}
        >
          Retour
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-[2] py-4 rounded-full text-white font-semibold text-base transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2 disabled:opacity-50"
          style={{
            backgroundColor: isSubmitting ? "var(--text-secondary)" : occasion.sleeveTokens.accent,
            fontFamily: "var(--font-body)",
          }}
        >
          {isSubmitting ? "Traitement en cours…" : `Payer ${formatPriceCents(totalCents)}`}
        </button>
      </div>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function TunnelClient({ product, occasion, initialPromoCode }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [messageData, setMessageData] = useState<MessageData | null>(null);
  const [livraisonData, setLivraisonData] = useState<LivraisonData | null>(null);

  // Clé d'idempotence stable pour toute la durée de vie du composant.
  // Générée une seule fois au montage — plusieurs clics sur "Payer" utilisent la même clé,
  // ce qui empêche la création de doublons sans bloquer les vraies nouvelles commandes.
  const idempotencyKeyRef = useRef<string>(crypto.randomUUID());

  return (
    <div>
      {/* En-tête */}
      <div className="mb-8">
        <span
          className="inline-block text-xs uppercase tracking-widest px-3 py-1 rounded-full mb-3"
          style={{
            fontFamily: "var(--font-label)",
            backgroundColor: occasion.sleeveTokens.bg,
            color: occasion.sleeveTokens.accent,
          }}
        >
          {occasion.nom}
        </span>
        <h1
          className="text-3xl font-black"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          {product.name}
        </h1>
        <p
          className="text-lg mt-1"
          style={{ fontFamily: "var(--font-display)", color: occasion.sleeveTokens.accent }}
        >
          {formatPriceCents(product.price_cents)}
        </p>
      </div>

      <StepIndicator current={step} />

      {/* Carte formulaire */}
      <div
        className="rounded-3xl p-6 md:p-8"
        style={{ backgroundColor: "white", boxShadow: "0 2px 16px 0 rgba(0,0,0,0.06)" }}
      >
        {step === 1 && (
          <StepMessage
            occasion={occasion}
            defaultValues={messageData ?? undefined}
            onNext={(data) => {
              setMessageData(data);
              setStep(2);
            }}
          />
        )}
        {step === 2 && (
          <StepLivraison
            occasion={occasion}
            defaultValues={livraisonData ?? undefined}
            onNext={(data) => {
              setLivraisonData(data);
              setStep(3);
            }}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && messageData && livraisonData && (
          <StepPaiement
            product={product}
            occasion={occasion}
            messageData={messageData}
            livraisonData={livraisonData}
            onBack={() => setStep(2)}
            initialPromoCode={initialPromoCode}
            idempotencyKey={idempotencyKeyRef.current}
          />
        )}
      </div>
    </div>
  );
}

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

const b2bSchema = z.object({
  companyName: z.string().min(1, "Requis").max(200, "Maximum 200 caractères"),
  vatNumber: z
    .string()
    .regex(/^BE\d{10}$/, "Format attendu : BE suivi de 10 chiffres")
    .optional()
    .or(z.literal("")),
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
type B2bData = z.infer<typeof b2bSchema>;
type LivraisonData = z.infer<typeof livraisonSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  product: Product;
  occasion: Occasion;
  initialPromoCode?: string;
}

type Step = 1 | 2 | 3;

// ─── Sous-composants ──────────────────────────────────────────────────────────

function StepIndicator({ current, accent }: { current: Step; accent: string }) {
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
                    ? accent
                    : current > step.num
                    ? accent
                    : "rgba(255,255,255,0.55)",
                color:
                  current >= step.num ? "white" : "rgba(30,27,46,0.35)",
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
                    ? accent
                    : "rgba(30,27,46,0.45)",
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
                    ? accent
                    : "rgba(255,255,255,0.4)",
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
  defaultB2b,
  onNext,
}: {
  occasion: Occasion;
  defaultValues?: Partial<MessageData>;
  defaultB2b?: Partial<B2bData>;
  onNext: (data: MessageData, b2b?: B2bData) => void;
}) {
  const isB2b = occasion.slug === "entreprise";
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<MessageData>({
    resolver: standardSchemaResolver(messageSchema),
    defaultValues,
  });
  const {
    register: regB2b,
    handleSubmit: handleB2bSubmit,
    formState: { errors: errorsB2b },
  } = useForm<B2bData>({
    resolver: standardSchemaResolver(b2bSchema),
    defaultValues: defaultB2b,
  });

  const message = watch("recipientMessage", defaultValues?.recipientMessage ?? "");

  function handleFormSubmit(msgData: MessageData) {
    if (isB2b) {
      handleB2bSubmit((b2b) => onNext(msgData, b2b))();
    } else {
      onNext(msgData);
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <h2
        className="text-2xl font-black mb-6"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        Dis-leur ce que tu ressens.
      </h2>

      {/* Aperçu message */}
      <div
        className="rounded-2xl p-6 mb-6 min-h-[120px] relative"
        style={{ backgroundColor: "white", border: `1.5px solid ${occasion.sleeveTokens.accent}22` }}
        aria-label="Aperçu de ton message"
      >
        <span
          className="block text-xs uppercase tracking-widest mb-3"
          style={{
            fontFamily: "var(--font-label)",
            color: occasion.sleeveTokens.accent,
          }}
        >
          Aperçu de ton message
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
          Ton message
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
      <div className={isB2b ? "mb-4" : "mb-8"}>
        <Label htmlFor="senderName" required>
          {isB2b ? "Nom de l'expéditeur (de la part de…)" : "Ton prénom (de la part de…)"}
        </Label>
        <input
          id="senderName"
          type="text"
          placeholder={isB2b ? "Jean Dupont ou Acme SA" : "Marie"}
          className={inputClass}
          style={inputStyle}
          {...register("senderName")}
        />
        <FieldError message={errors.senderName?.message} />
      </div>

      {/* Champs B2B — visibles uniquement pour l'occasion entreprise */}
      {isB2b && (
        <div
          className="rounded-2xl p-4 mb-8"
          style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--primary-100)" }}
        >
          <p
            className="text-xs uppercase tracking-widest mb-3"
            style={{ fontFamily: "var(--font-label)", color: "var(--primary-500)" }}
          >
            Informations entreprise
          </p>
          <div className="mb-3">
            <Label htmlFor="companyName" required>
              Nom de l&apos;entreprise
            </Label>
            <input
              id="companyName"
              type="text"
              placeholder="Acme SA"
              className={inputClass}
              style={inputStyle}
              {...regB2b("companyName")}
            />
            <FieldError message={errorsB2b.companyName?.message} />
          </div>
          <div>
            <Label htmlFor="vatNumber">
              Numéro de TVA
              <span
                className="ml-1 font-normal text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                (optionnel — requis pour la facture)
              </span>
            </Label>
            <input
              id="vatNumber"
              type="text"
              placeholder="BE0123456789"
              className={inputClass}
              style={inputStyle}
              {...regB2b("vatNumber")}
            />
            <FieldError message={errorsB2b.vatNumber?.message} />
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full py-4 rounded-full text-white font-semibold text-base transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          backgroundColor: occasion.sleeveTokens.accent,
          fontFamily: "var(--font-body)",
        }}
      >
        Suivant — Où on l&apos;envoie ?
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
        Où on l&apos;envoie ?
      </h2>

      {/* Email */}
      <div className="mb-4">
        <Label htmlFor="email" required>
          Ton email (pour confirmer ta commande)
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
          className="flex-[2] py-4 rounded-full text-white font-semibold text-base transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            backgroundColor: occasion.sleeveTokens.accent,
            fontFamily: "var(--font-body)",
          }}
        >
          Vérifier ma commande
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
  b2bData,
  onBack,
  initialPromoCode,
  idempotencyKey,
}: {
  product: Product;
  occasion: Occasion;
  messageData: MessageData;
  livraisonData: LivraisonData;
  b2bData?: B2bData;
  onBack: () => void;
  initialPromoCode?: string;
  idempotencyKey: string;
}) {
  const isB2b = !!b2bData;
  const [paymentMethod, setPaymentMethod] = useState<"standard" | "banktransfer">("standard");
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
        isB2b: !!b2bData,
        companyName: b2bData?.companyName,
        vatNumber: b2bData?.vatNumber || undefined,
        paymentMethod,
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
        Tout est en ordre ?
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
          Ce que tu envoies
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

      {/* Sélecteur mode de paiement — B2B uniquement */}
      {isB2b && (
        <div className="mb-6">
          <p
            className="text-xs uppercase tracking-widest mb-3"
            style={{ fontFamily: "var(--font-label)", color: "var(--text-secondary)" }}
          >
            Mode de paiement
          </p>
          <div className="flex flex-col gap-2">
            {(
              [
                { value: "standard", label: "Carte bancaire / Bancontact", icon: "💳", note: "Paiement immédiat via Mollie" },
                { value: "banktransfer", label: "Virement SEPA", icon: "🏦", note: "Réservé aux entreprises — 2–3 jours ouvrables" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPaymentMethod(opt.value)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                style={{
                  border: `2px solid ${paymentMethod === opt.value ? "var(--primary-500)" : "var(--primary-100)"}`,
                  backgroundColor: paymentMethod === opt.value ? "var(--primary-50)" : "white",
                }}
              >
                <span className="text-xl">{opt.icon}</span>
                <div>
                  <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>
                    {opt.label}
                  </p>
                  <p className="text-xs" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
                    {opt.note}
                  </p>
                </div>
                {paymentMethod === opt.value && (
                  <span className="ml-auto text-sm font-bold" style={{ color: "var(--primary-500)" }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Note paiement */}
      <p
        className="text-xs text-center mb-4"
        style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
      >
        Paiement sécurisé · Mollie
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
          {isSubmitting
            ? "Traitement en cours…"
            : paymentMethod === "banktransfer"
            ? `Confirmer la commande — ${formatPriceCents(totalCents)}`
            : `Payer ${formatPriceCents(totalCents)}`}
        </button>
      </div>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function TunnelClient({ product, occasion, initialPromoCode }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [messageData, setMessageData] = useState<MessageData | null>(null);
  const [b2bData, setB2bData] = useState<B2bData | undefined>(undefined);
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

      <StepIndicator current={step} accent={occasion.sleeveTokens.accent} />

      {/* Carte formulaire */}
      <div
        className="rounded-3xl p-6 md:p-8"
        style={{ backgroundColor: "white", boxShadow: "0 2px 16px 0 rgba(0,0,0,0.06)" }}
      >
        {step === 1 && (
          <StepMessage
            occasion={occasion}
            defaultValues={messageData ?? undefined}
            defaultB2b={b2bData}
            onNext={(data, b2b) => {
              setMessageData(data);
              setB2bData(b2b);
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
            b2bData={b2bData}
            onBack={() => setStep(2)}
            initialPromoCode={initialPromoCode}
            idempotencyKey={idempotencyKeyRef.current}
          />
        )}
      </div>
    </div>
  );
}

# Design Spec — val4oss studio
## Sections pricing & "Pourquoi me choisir"

> Document destiné à Claude Code pour la génération des sections manquantes du site vitrine.
> Stack : **Next.js + Tailwind CSS**. Les sections Hero, About et Footer existent déjà.

---

## 1. Charte graphique

### Tokens CSS (à déclarer dans `tailwind.config.ts` ou `globals.css`)

```css
/* Fonds & surfaces */
--color-bg-page:    #1A1A1A;   /* bg global */
--color-bg-card:    #222222;   /* cartes, panneaux */
--color-bg-input:   #2A2A2A;   /* inputs, tableaux */
--color-border:     #383838;   /* bordures, dividers */

/* Textes */
--color-text-heading: #F0EBE0; /* H1, H2 */
--color-text-body:    #C4C4C4; /* corps */
--color-text-muted:   #7A7A7A; /* secondaire */

/* Or */
--color-gold:         #C9A84C; /* CTA, accents, prix */
--color-gold-light:   #E8C96A; /* hover */
--color-gold-dark:    #8B6F2E; /* actif / pressé */

/* Sémantiques */
--color-success: #1A6B3C;
--color-warning: #7A3A00;
--color-error:   #7A1A1A;
--color-info:    #1A3A6B;
```

### Typographie

| Rôle | Font | Poids | Taille indicative |
|---|---|---|---|
| Titres de section (H2) | Cormorant Garamond | 600 | 36–40px |
| Sous-titres de carte (H3) | Cormorant Garamond | 600 | 20px |
| Label de section (eyebrow) | DM Sans | 500 | 11px, letter-spacing 0.18em, UPPERCASE |
| Corps / features | DM Sans | 400 | 13–14px |
| Prix | Cormorant Garamond | 600 | 28–32px |
| Badges / notes | DM Sans | 500 | 10–11px |

Importer via Google Fonts :
```
Cormorant Garamond: 400, 600, 400italic
DM Sans: 300, 400, 500
```

### Espacements

- Padding section : `py-16` à `py-20` (64–80px vertical)
- Gap entre cartes : `gap-4` (16px)
- Padding interne carte : `p-6` (24px)
- Max-width contenu : `max-w-6xl mx-auto px-6`

---

## 2. Composants réutilisables

### `<SectionHeader>` — En-tête de section

Structure systématique pour chaque section :

```tsx
<div className="mb-10">
  <p className="section-label">/* eyebrow text */</p>
  <h2 className="section-title">/* titre */</h2>
  <p className="section-sub">/* sous-titre optionnel */</p>
</div>
```

CSS classes correspondantes :
```css
.section-label {
  font-family: 'DM Sans';
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #C9A84C;
  margin-bottom: 0.5rem;
}
.section-title {
  font-family: 'Cormorant Garamond';
  font-size: 36px;
  font-weight: 600;
  color: #F0EBE0;
  line-height: 1.15;
  margin-bottom: 0.4rem;
}
.section-sub {
  font-size: 13px;
  color: #7A7A7A;
}
```

### `<PlanCard>` — Carte de plan

```tsx
interface PlanCardProps {
  icon: string;            // Tabler icon name (ex: "browser", "rocket", "star")
  name: string;
  target: string;          // ex: "Artisans & indépendants"
  price: string;           // ex: "490 – 690 €"
  priceNote: string;       // ex: "tarif unique" ou "par mois"
  features: string[];
  delay?: string;          // ex: "1 à 2 semaines" — dev plans only
  featured?: boolean;      // bordure dorée + badge
  featuredLabel?: string;  // ex: "Le plus choisi"
  badge?: string;          // badge secondaire ex: "Accès SaaS inclus"
}
```

**Anatomy d'une carte :**

```
┌──────────────────────────────────┐  ← bg #222222, border #383838, radius 12px
│  [badge featured flottant]       │  ← position absolute, top: -11px, centré
│                                  │
│  🔵 [icône Tabler 20px, #C9A84C] │
│  Plan Name      ← Cormorant 20px #F0EBE0
│  target         ← DM Sans 11px italic #7A7A7A
│                                  │
│  490 – 690 €    ← Cormorant 28px #C9A84C
│  tarif unique   ← DM Sans 11px #7A7A7A
│                                  │
│  ─────────────── divider #383838 │
│                                  │
│  ✓ Feature 1                     │  ← check rond #1A6B3C, texte 12px #C4C4C4
│  ✓ Feature 2                     │
│  ◌ Option +200€                  │  ← check gold/dim pour options
│                                  │
│  ● 1 à 2 semaines                │  ← dot #8B6F2E, texte 11px #7A7A7A
└──────────────────────────────────┘
```

**État `featured: true` :**
- `border: 1.5px solid #C9A84C`
- Badge absolu centré en haut : bg `#C9A84C`, texte `#1A1A1A`, font 10px uppercase, padding `3px 12px`, border-radius 20px

**Badge secondaire (SaaS) :**
- Inline dans la carte, avant l'icône
- bg `rgba(201,168,76,0.12)`, border `1px solid rgba(201,168,76,0.3)`, texte `#C9A84C`
- font 10px, padding `3px 8px`, border-radius 20px

### `<FeatureItem>` — Ligne de feature

```tsx
// Feature normale
<li className="flex items-start gap-2 text-xs text-body">
  <span className="check-icon" />   {/* rond #1A6B3C avec ✓ blanc */}
  {text}
</li>

// Feature option (dimmed)
<li className="flex items-start gap-2 text-xs text-muted italic">
  <span className="check-icon-dim" /> {/* rond semi-transparent doré */}
  {text}
</li>
```

### `<WhyCard>` — Carte "Pourquoi me choisir"

```
┌──────────────────────────────────┐
│ ░ border-left: 2px solid #C9A84C │  ← accent latéral doré
│                                  │
│  🔵 [icône Tabler 18px, #C9A84C] │
│  Titre          ← DM Sans 13px 500 #F0EBE0
│  Description    ← DM Sans 11px #7A7A7A, line-height 1.5
└──────────────────────────────────┘
```

bg `#222222`, border `1px solid #383838`, border-radius 10px, padding `1.25rem`

---

## 3. Section — "Ce que tu ne trouveras pas ailleurs"

**Nom de fichier suggéré :** `components/sections/WhyUs.tsx`

**Structure de la section :**

```tsx
<section id="why-us" className="py-20 bg-[#1A1A1A]">
  <div className="max-w-6xl mx-auto px-6">
    
    <SectionHeader
      label="Pourquoi me choisir"
      title="Ce que tu ne trouveras pas ailleurs"
      sub="Activité secondaire, exigence principale."
    />

    <div className="grid grid-cols-2 gap-4">
      <WhyCard icon="code" title="Fait main, ligne par ligne"
        desc="Next.js + Tailwind CSS pur. Zéro WordPress, zéro no-code, zéro génération IA. Du code propre, sans dette technique." />
      
      <WhyCard icon="currency-euro" title="Prix honnêtes, qualité premium"
        desc="Activité secondaire = pas de frais d'agence. Tu paies le travail, pas la structure. Lighthouse ≥ 95 garanti." />
      
      <WhyCard icon="lock" title="Hébergement souverain EU"
        desc="VM hébergée en Europe. Conformité RGPD native. Cloudflare inclus. Tes données restent chez toi." />
      
      <WhyCard icon="layout-dashboard" title="Un suivi comme nulle part ailleurs"
        desc="Accès à un écosystème SaaS privé : whiteboard, notes de projet, forum, feedback. Tu suis l'avancée en direct." />
    </div>

  </div>
</section>
```

**Icônes Tabler à utiliser :** `ti-code`, `ti-currency-euro`, `ti-lock`, `ti-layout-dashboard`
Toutes en `font-size: 18px`, couleur `#C9A84C`.

---

## 4. Section — Pricing Développement

**Nom de fichier suggéré :** `components/sections/PricingDev.tsx`

**Données des plans :**

```ts
const devPlans = [
  {
    icon: "browser",
    name: "Essentiel",
    target: "Artisans & indépendants",
    price: "490 – 690 €",
    priceNote: "tarif unique",
    delay: "1 à 2 semaines",
    featured: false,
    features: [
      "One-page avec sections (Hero, Services, À propos, Contact)",
      "Nom de domaine géré + renouvellement annuel",
      "Certificat SSL automatique",
      "SEO de base : balises meta, sitemap, structure sémantique",
      "Indexation Google optimisée (Search Console, robots.txt)",
      "Design responsive mobile / tablette / desktop",
    ],
  },
  {
    icon: "rocket",
    name: "Présence",
    target: "TPE & petits commerces",
    price: "890 – 1 290 €",
    priceNote: "tarif unique",
    delay: "2 à 4 semaines",
    featured: true,
    featuredLabel: "Le plus choisi",
    features: [
      "Tout du Plan Essentiel",
      "1 à 3 pages distinctes",
      "Galerie dynamique synchronisée (Instagram ou autre source)",
      "SEO optimisé : audit, maillage interne, Schema.org",
      "Interface d'administration (textes, images)",
    ],
    options: [
      "i18n — site multilingue : +200 €",
      "Système de thèmes clair/sombre : +200 €",
    ],
  },
  {
    icon: "star",
    name: "Signature",
    target: "PME & projets ambitieux",
    price: "1 800 – 2 900 €",
    priceNote: "estimé après cadrage",
    delay: "4 à 7 semaines",
    featured: false,
    features: [
      "Tout du Plan Présence",
      "Pages illimitées",
      "Fonctionnalités sur mesure (agenda, espace membre, catalogue…)",
      "i18n + thèmes inclus si souhaités",
      "Animations & micro-interactions",
      "SEO avancé + Core Web Vitals",
      "Accès SaaS val4oss pour le suivi de projet",
    ],
  },
]
```

**Structure JSX :**

```tsx
<section id="pricing-dev" className="py-20 bg-[#1A1A1A]">
  <div className="max-w-6xl mx-auto px-6">
    
    <SectionHeader
      label="Développement"
      title="Création de site"
      sub="Prestation unique · Paiement 50 % commande / 50 % livraison"
    />

    <div className="grid grid-cols-3 gap-4">
      {devPlans.map(plan => <PlanCard key={plan.name} {...plan} />)}
    </div>

  </div>
</section>
```

---

## 5. Section — Pricing Abonnement

**Nom de fichier suggéré :** `components/sections/PricingMaintenance.tsx`

**Données des plans :**

```ts
const maintenancePlans = [
  {
    icon: "server",
    name: "Hébergement",
    target: "La base technique",
    price: "19 – 29 €",
    priceNote: "par mois",
    featured: false,
    features: [
      "VM hébergée en Europe (souveraineté, RGPD)",
      "Nom de domaine + renouvellement automatique",
      "HTTPS / SSL",
      "Cloudflare CDN + protection DDoS",
      "Sauvegardes hebdomadaires",
      "Maintien indexation Google (Search Console)",
    ],
  },
  {
    icon: "shield-check",
    name: "Sérénité",
    target: "Suivi & corrections",
    price: "45 – 65 €",
    priceNote: "par mois",
    featured: true,
    featuredLabel: "Le plus courant",
    features: [
      "Tout du Plan Hébergement",
      "Monitoring 24/7 (alerte si le site tombe)",
      "Suivi des performances (Core Web Vitals, temps de chargement)",
      "Debug mensuel (bugs constatés, hors nouvelles features)",
      "Gestion connexions services tiers (Instagram, Maps, Analytics…)",
      "Support par message — réponse sous 72h ouvrées",
    ],
  },
  {
    icon: "crown",
    name: "Premium",
    target: "Tranquillité totale",
    price: "89 – 119 €",
    priceNote: "par mois",
    featured: false,
    badge: "Accès SaaS inclus",
    features: [
      "Tout du Plan Sérénité",
      "Accès illimité au SaaS val4oss (whiteboard, forum, notes, feedback)",
      "1h de modifications/mois (textes, photos, petits ajouts)",
      "Rapport de performance mensuel détaillé",
      "Priorité de traitement sur les demandes",
    ],
  },
]
```

**Structure JSX :**

```tsx
<section id="pricing-maintenance" className="py-20 bg-[#1A1A1A]">
  <div className="max-w-6xl mx-auto px-6">
    
    <SectionHeader
      label="Maintenance"
      title="Abonnement mensuel"
      sub="Indépendant du développement · Résiliable à tout moment"
    />

    <div className="grid grid-cols-3 gap-4">
      {maintenancePlans.map(plan => <PlanCard key={plan.name} {...plan} />)}
    </div>

    {/* Note réactivité */}
    <p className="mt-5 text-center text-xs text-muted italic border border-[#383838] rounded-lg px-4 py-3 bg-[#2A2A2A]">
      <span className="text-gold">Activité secondaire assumée</span> — réponse sous 72h ouvrées, pas en urgence.
      Qualité de production premium, délais honnêtes.
    </p>

  </div>
</section>
```

---

## 6. Ordre des sections dans la page

```
Hero          ← existant
About         ← existant
WhyUs         ← à générer (section "Ce que tu ne trouveras pas ailleurs")
PricingDev    ← à générer (développement)
PricingMaintenance ← à générer (abonnement)
Footer        ← existant
```

Séparateur recommandé entre sections (optionnel) :
```tsx
<div className="max-w-6xl mx-auto px-6">
  <hr className="border-none h-px bg-gradient-to-r from-transparent via-[#383838] to-transparent" />
</div>
```

---

## 7. Comportements & interactions

- **Hover sur carte :** `border-color` passe de `#383838` à `#C9A84C` en `transition-colors duration-200`
- **Hover sur carte featured :** légère élévation simulée avec `scale-[1.01]` en `transition-transform duration-200`
- **CTA "Demander un devis" :** bouton plein or (`bg-[#C9A84C] text-[#1A1A1A]`), hover `bg-[#E8C96A]`, font DM Sans 500, à ajouter en bas de chaque carte si souhaité
- **Scroll reveal :** animation `fadeInUp` légère à l'entrée dans le viewport (optionnel, via Framer Motion)

---

## 8. Résumé visuel de la hiérarchie couleurs

```
#1A1A1A  fond de page (sections)
  └─ #222222  cartes (bg-card)
       ├─ #383838  bordures
       ├─ #C9A84C  or (prix, icônes, accents, featured border)
       ├─ #F0EBE0  titres
       ├─ #C4C4C4  texte corps
       └─ #7A7A7A  texte secondaire / notes
```

---

*Ce document couvre uniquement les sections manquantes. Les conventions globales (Hero, Footer, nav) sont déjà en place dans le projet.*

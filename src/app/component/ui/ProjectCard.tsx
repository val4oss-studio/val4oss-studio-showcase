'use client';
/*
 * ProjectCard — Carte projet avec mock browser frame et tilt 3D au hover.
 * Client Component requis pour :
 *  - onMouseMove  → tilt 3D (perspective du conteneur parent)
 *  - onMouseLeave → reset du tilt
 */

import { useRef, type JSX } from 'react';
import Image from 'next/image';

export interface ProjectCardProps {
  /** URL du site (lien externe) */
  url:        string;
  /** Chemin depuis /public */
  screenshot: string;
  /** Nom du projet (depuis i18n) */
  name:       string;
  /** Courte description (depuis i18n) */
  tagline:    string;
  /** Tags techniques (depuis config) */
  tags:       string[];
  /** Texte du CTA (depuis i18n) */
  cta:        string;
  /** Index 0-based pour stagger animation */
  index:      number;
  priority?:  boolean;
}

export function ProjectCard({
  url,
  screenshot,
  name,
  tagline,
  tags,
  cta,
  index,
  priority = false,
}: ProjectCardProps): JSX.Element {
  const cardRef = useRef<HTMLAnchorElement>(null);

  /*
   * Tilt 3D — calcule l'angle de rotation en fonction
   * de la position de la souris sur la carte.
   * Valeurs max : ±8deg en X et Y — subtil mais visible.
   */
  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const card = cardRef.current;
    if (!card) return;

    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2); // -1 → 1
    const dy     = (e.clientY - cy) / (rect.height / 2); // -1 → 1
    const rotY   =  dx * 8;  // +8deg → droite, -8deg → gauche
    const rotX   = -dy * 5;  // +5deg → haut, -5deg → bas

    card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    if (!card) return;
    // Reset fluide via transition déjà définie dans le CSS
    card.style.transform = '';
  }

  /* Extrait le hostname pour l'URL bar (ex: "theboweryst.fr") */
  const hostname = new URL(url).hostname;

  return (
    <a
      ref={cardRef}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card"
      style={{
        '--floating-delay': `${Math.max(index * 2333, 1700 + index * 150)}ms`,
        '--card-index':  index,
      } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label={`Voir le site ${name} — ${url}`}
    >
      {/* === Barre navigateur === */}
      <div className="project-card-browser-bar" aria-hidden="true">
        <div className="project-card-browser-dots">
          <span className="project-card-browser-dot" />
          <span className="project-card-browser-dot" />
          <span className="project-card-browser-dot" />
        </div>
        <span className="project-card-browser-url">{hostname}</span>
      </div>

      {/* === Screenshot === */}
      <div className="project-card-screenshot">
        <Image
          src={screenshot}
          alt={`Screenshot du site ${name}`}
          fill
          sizes="(min-width: 48rem) 22rem, 100vw"
          className="object-cover object-top"
          priority={priority}
        />

        {/* Overlay hover — CTA */}
        <div className="project-card-overlay" aria-hidden="true">
          <span className="t-badge t-link">{cta} ↗</span>
        </div>
      </div>

      {/* === Footer === */}
      <div className="project-card-footer">
        <p className="t-h4">{name}</p>
        <p className="t-caption">
          {tagline}
        </p>
        <div className="project-card-tags">
          {tags.map((tag) => (
            <span key={tag} className="project-card-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}

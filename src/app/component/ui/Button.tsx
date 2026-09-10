import Link from 'next/link';
import type { JSX, ReactNode } from 'react';
import { Icon } from './Icons';
import type { IconKey } from '@/config/icons';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md';

interface ButtonCommonProps {
  children: ReactNode;
  /** primary = action principale (or plein), une seule par écran */
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconKey;
  /** Place le pictogramme après le libellé (flèche de renvoi, lien sortant…) */
  iconAfter?: boolean;
  className?: string;
}

interface ButtonAsLinkProps extends ButtonCommonProps {
  /** Interne : rendu en <Link>. Externe (`external`) : <a target="_blank"> */
  href: string;
  external?: boolean;
  onClick?: never;
  type?: never;
  disabled?: never;
}

interface ButtonAsButtonProps extends ButtonCommonProps {
  href?: never;
  external?: never;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export type ButtonProps = ButtonAsLinkProps | ButtonAsButtonProps;

/*
 * Bouton du design system — la seule pastille d'action du site.
 *
 * La balise suit l'intention plutôt que l'apparence : une destination donne un
 * lien, une action donne un <button>. Le style vit dans `.btn` (globals.css),
 * il est donc identique dans les trois cas.
 *
 * Ce fichier ne porte pas `'use client'` : il n'a aucun état propre. Il est
 * donc utilisable tel quel dans un Server Component (avec `href`) comme dans
 * un Client Component (avec `onClick`, qui exige d'être déjà côté client).
 */
export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  iconAfter = false,
  className,
  ...rest
}: ButtonProps): JSX.Element {
  const classes = [`btn btn--${variant} btn--${size}`, className]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {icon && !iconAfter && <Icon name={icon} />}
      {children}
      {icon && iconAfter && <Icon name={icon} />}
    </>
  );

  if (rest.href !== undefined) {
    const { href, external } = rest;

    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  const { onClick, type = 'button', disabled } = rest;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {content}
    </button>
  );
}

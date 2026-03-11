import React from 'react';

const S = { stroke: "#333", strokeWidth: 1.5, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
const SY = { ...S, fill: "#ffc200" };
const Y = { fill: "#ffc200" };

export const IconForYou = () => (
  <svg width="64" height="64" viewBox="0 0 64 64">
    <rect x="22" y="26" width="20" height="20" rx="4" {...S} />
    <path d="M26 26C26 22.5 29 20 32 20C35 20 38 22.5 38 26" {...S} />
    <path d="M26 26C26 29.5 29 32 32 32C35 32 38 29.5 38 26H26Z" {...SY} />
  </svg>
);

export const IconFashion = () => (
  <svg width="64" height="64" viewBox="0 0 64 64">
    <path d="M26 20C26 20 28 23 32 23C36 23 38 20 38 20L42 24L40 30L38 28V42H26V28L24 30L22 24L26 20Z" {...S} />
    <path d="M26 40H38V42H26V40Z" {...SY} />
  </svg>
);

export const IconMobiles = () => (
  <svg width="64" height="64" viewBox="0 0 64 64">
    <rect x="26" y="18" width="12" height="26" rx="2" {...S} />
    <path d="M26 38H38V42C38 43.1046 37.1046 44 36 44H28C26.8954 44 26 43.1046 26 42V38Z" {...SY} />
  </svg>
);

export const IconBeauty = () => (
  <svg width="64" height="64" viewBox="0 0 64 64">
    <rect x="28" y="30" width="8" height="14" rx="2" {...S} />
    <path d="M30 24L34 24V30H30V24Z" {...SY} />
    <path d="M31 18H33L34 24H30L31 18Z" {...S} />
  </svg>
);

export const IconElectronics = () => (
  <svg width="64" height="64" viewBox="0 0 64 64">
    <rect x="22" y="24" width="20" height="14" rx="2" {...S} />
    <path d="M18 40H46V42C46 43.1046 45.1046 44 44 44H20C18.8954 44 18 43.1046 18 42V40Z" {...SY} />
  </svg>
);

export const IconHome = () => (
  <svg width="64" height="64" viewBox="0 0 64 64">
    <path d="M32 20L24 32H40L32 20Z" {...S} />
    <line x1="32" y1="32" x2="32" y2="44" {...S} />
    <path d="M28 44H36" {...S} />
    <line x1="26" y1="30" x2="38" y2="30" {...SY} />
  </svg>
);

export const IconAppliances = () => (
  <svg width="64" height="64" viewBox="0 0 64 64">
    <rect x="20" y="22" width="24" height="16" rx="2" {...S} />
    <path d="M26 44L38 44" {...S} />
    <path d="M32 38V44" {...S} />
    <path d="M20 34H44V36C44 37.1046 43.1046 38 42 38H22C20.8954 38 20 37.1046 20 36V34Z" {...SY} />
  </svg>
);

export const IconToys = () => (
  <svg width="64" height="64" viewBox="0 0 64 64">
    <circle cx="32" cy="34" r="7" {...S} />
    <circle cx="32" cy="24" r="5" {...S} />
    <circle cx="27" cy="20" r="3" {...S} />
    <circle cx="37" cy="20" r="3" {...S} />
    <circle cx="26" cy="30" r="3" {...S} />
    <circle cx="38" cy="30" r="3" {...S} />
    <circle cx="28" cy="40" r="3" {...S} />
    <circle cx="36" cy="40" r="3" {...S} />
    <circle cx="32" cy="34" r="3.5" {...SY} />
  </svg>
);

export const IconFood = () => (
  <svg width="64" height="64" viewBox="0 0 64 64">
    <rect x="25" y="24" width="14" height="20" rx="3" {...S} />
    <path d="M27 20H37V24H27V20Z" {...S} />
    <rect x="25" y="30" width="14" height="8" {...SY} />
  </svg>
);

export const IconAuto = () => (
  <svg width="64" height="64" viewBox="0 0 64 64">
    <path d="M24 36C24 29 28 24 34 24C40 24 44 29 44 36V42H24V36Z" {...S} />
    <path d="M34 24C38 24 42 26 44 30L34 33H28C27 29 30 24 34 24Z" {...SY} />
  </svg>
);

export const IconTwoWheeler = () => (
  <svg width="64" height="64" viewBox="0 0 64 64">
    <circle cx="26" cy="38" r="4" {...S} />
    <circle cx="40" cy="38" r="4" {...SY} />
    <path d="M26 38L30 30H38V38" {...S} />
    <path d="M38 30L42 30L40 24M30 30C30 26 34 24 36 24" {...S} />
  </svg>
);

export const IconSports = () => (
  <svg width="64" height="64" viewBox="0 0 64 64">
    <path d="M24 42L36 30L38 32L26 44L24 42Z" {...S} />
    <path d="M36 30L38 24L42 26L38 32" {...S} />
    <circle cx="26" cy="28" r="3" {...SY} />
  </svg>
);

export const IconBooks = () => (
  <svg width="64" height="64" viewBox="0 0 64 64">
    <rect x="26" y="22" width="14" height="20" rx="2" {...S} />
    <path d="M29 22V42" {...S} />
    <rect x="26" y="22" width="3" height="20" rx="1" {...SY} />
  </svg>
);

export const IconFurniture = () => (
  <svg width="64" height="64" viewBox="0 0 64 64">
    <path d="M22 32C22 28 26 26 32 26C38 26 42 28 42 32V38H22V32Z" {...S} />
    <path d="M18 32H22V42H18V32Z" {...S} />
    <path d="M42 32H46V42H42V32Z" {...S} />
    <path d="M24 42V46M40 42V46" {...S} />
    <path d="M22 38H42" {...S} />
    <path d="M26 38H38C38 36 36 34 32 34C28 34 26 36 26 38" {...SY} />
  </svg>
);

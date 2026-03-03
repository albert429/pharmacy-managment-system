# PharmacyManagmentSystem

## Color Pallete & Branding

## Color palette

**Brand**

| Token     |       Hex |
| --------- | --------: |
| Deep Teal | `#0DA5A6` |
| Teal      | `#0E6E87` |
| Soft Teal | `#1A9BB8` |
| Teal Mist | `#B8E6F0` |

**Neutrals**

| Token    |       Hex |
| -------- | --------: |
| Charcoal | `#1C2B33` |
| Pewter   | `#9FA8B4` |
| White    | `#FAFCFD` |

**Semantic**

| Token           |      Base |
| --------------- | --------: |
| Success (Sage)  | `#3D8B6E` |
| Info (Teal)     | `#0E6E87` |
| Warning (Amber) | `#D97706` |
| Error (Crimson) | `#C0392B` |

---

## CSS tokens

```css
:root {
  /* Brand */
  --brand-primary: #0da5a6; /* Deep Teal */
  --brand-primary-hover: #0e6e87; /* Teal */
  --brand-secondary: #1c2b33; /* Charcoal */
  --brand-accent: #1a9bb8; /* Soft Teal */
  --brand-tint: #b8e6f0; /* Teal Mist */

  /* Neutrals */
  --n-0: #fafcfd; /* White */
  --n-400: #9fa8b4; /* Pewter */
  --n-900: #1c2b33; /* Charcoal */

  /* Text + surfaces */
  --text: var(--n-900);
  --text-strong: var(--n-900);
  --text-inverse: var(--n-0);
  --text-muted: var(--n-400);
  --bg: var(--n-0);
  --surface: var(--n-0);
  --surface-muted: var(--brand-tint);
  --border: var(--n-400);

  /* Semantic */
  --success: #3d8b6e;
  --success-bg: rgba(61, 139, 110, 0.12);
  --success-border: rgba(61, 139, 110, 0.35);

  --info: #0e6e87;
  --info-bg: rgba(14, 110, 135, 0.12);
  --info-border: rgba(14, 110, 135, 0.35);

  --warning: #d97706;
  --warning-bg: rgba(217, 119, 6, 0.14);
  --warning-border: rgba(217, 119, 6, 0.4);

  --error: #c0392b;
  --error-bg: rgba(192, 57, 43, 0.12);
  --error-border: rgba(192, 57, 43, 0.35);

  /* Focus */
  --focus: #1a9bb8;
}
```

---

## UI rules (minimum)

- Don’t rely on color alone: always show status text (icon optional).
- Primary buttons use `--brand-primary` (hover `--brand-primary-hover`).
- Destructive actions use `--error`.
- Alerts use `*-bg` + `*-border`.

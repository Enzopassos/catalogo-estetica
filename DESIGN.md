---
name: Aura Mobile Red
colors:
  surface: '#fbf9f9'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e3e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#5e3f39'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#936e67'
  outline-variant: '#e8bdb4'
  surface-tint: '#ba1b00'
  primary: '#b61a00'
  on-primary: '#ffffff'
  primary-container: '#e32300'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb4a5'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#5b5c5b'
  on-tertiary: '#ffffff'
  tertiary-container: '#747573'
  on-tertiary-container: '#fdfcfa'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad3'
  primary-fixed-dim: '#ffb4a5'
  on-primary-fixed: '#3f0400'
  on-primary-fixed-variant: '#8f1200'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e3e2e0'
  tertiary-fixed-dim: '#c7c6c5'
  on-tertiary-fixed: '#1a1c1b'
  on-tertiary-fixed-variant: '#464746'
  background: '#fbf9f9'
  on-background: '#1b1c1c'
  surface-variant: '#e3e2e2'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  margin-mobile: 20px
  gutter-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-gap: 64px
---

## Brand & Style

This design system evolves an elegant, minimalist aesthetic into a bold, high-fashion mobile experience. It targets a sophisticated audience that values editorial quality and immediate, tactile responsiveness. By pairing the classical authority of serif typography with a searing, vibrant red, the UI evokes a sense of "Modern Couture"—expensive, curated, and intentionally striking.

The visual style is **High-Contrast Minimalism**. It relies on expansive white space to let the photography and typography breathe, using the primary red as a surgical tool for focus and action. While the roots are classical, the execution is purely digital, optimized for fluid mobile interactions and high-density displays.

## Colors

The palette is anchored by a vibrant, high-saturation red (#F22B07) derived from the brand mark. This color is used exclusively for primary calls to action, active states, and critical branding moments to maintain its impact.

- **Primary Red:** Used for buttons, active navigation markers, and highlights.
- **Deep Onyx:** Used for headlines and primary body text to ensure maximum legibility and a premium feel.
- **Alabaster:** A soft, off-white background shade that reduces eye strain compared to pure white while maintaining a clean, gallery-like feel.
- **Stone Gray:** Used for secondary information and borders to provide structure without competing with the primary red.

## Typography

The typography strategy employs a sophisticated contrast between the high-fashion serif **Playfair Display** and the technical, modern sans-serif **Manrope**.

- **Display Text:** Large headlines use Playfair Display with tight letter-spacing for an editorial appearance.
- **Body & Utility:** Manrope is used for all functional text, body copy, and UI labels. Its geometric clarity ensures readability on mobile devices at smaller scales.
- **Hierarchy:** Use uppercase Manrope for labels and small headings to create a clear distinction from the fluid, organic curves of the Playfair headlines.

## Layout & Spacing

The layout follows a **fluid grid** model optimized for mobile-first consumption. 

- **Mobile Rhythm:** A 4-column grid for mobile devices with generous 20px outer margins to frame content like a magazine page.
- **Verticality:** Spacing is generous. Content "stacks" use multiples of 8px, but major sections are separated by large gaps (64px+) to maintain the minimalist, airy aesthetic.
- **Touch Targets:** All interactive elements maintain a minimum 44px height/width, regardless of their visual size, to ensure ease of use on touch screens.

## Elevation & Depth

To maintain a "Stone"-like solidity, this design system avoids traditional drop shadows. Depth is instead communicated through **Tonal Layering** and **High-Contrast Outlines**.

- **Surface Tiers:** Backgrounds use the Alabaster tint, while elevated cards or floating menus use pure white to subtly lift them off the page.
- **Ghost Borders:** Use 1px solid borders in a very light gray (#E0E0E0) to define sections without adding visual weight.
- **Active Elevation:** When an item is pressed, it does not "glow"; instead, it may shift color (to Primary Red) or undergo a slight scale reduction (98%) to simulate tactile feedback.

## Shapes

The shape language is **Soft (0.25rem)**. This provides a subtle nod to modern hardware design (like the rounded corners of a smartphone) without leaning into the playfulness of fully rounded or pill-shaped elements.

- **Primary Containers:** 4px (Soft) corner radius.
- **Buttons & Inputs:** 4px corner radius to maintain a crisp, professional look.
- **Imagery:** Large editorial images should remain sharp (0px) or use the standard 4px radius to match the UI containers.

## Components

- **Buttons:** Primary buttons are solid Primary Red with white Manrope text in uppercase. Secondary buttons use a Stone Gray outline.
- **Inputs:** Underlined or lightly boxed with 1px Stone Gray. On focus, the border transitions to a 2px Primary Red stroke.
- **Chips:** Small, rectangular tags with 4px roundedness. Use Alabaster backgrounds with Stone Gray text for inactive states; Primary Red for active/selected states.
- **Cards:** White backgrounds with a subtle 1px border. No shadows. Use Playfair Display for card titles to maintain the premium feel.
- **Bottom Sheets:** For mobile interactions, use bottom-aligned sheets for filters and menus, featuring a "Stone Gray" handle at the top.
- **Navigation:** A minimal bottom bar with iconography. The active state is indicated by the Primary Red color, while inactive states remain Stone Gray.
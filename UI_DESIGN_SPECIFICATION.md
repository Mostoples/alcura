# ALCURA UI/UX Design Specification
## Neumorphic, Eco-Friendly Dashboard & Mobile App

**Project:** ALCURA 20L Spirulina Photobioreactor

**Date:** 2026-05-20

**Design Style:** Neumorphism (soft UI) with eco-conscious branding

**Color Palette:** Green + White + Grays

**Platforms:** Web Dashboard (React.js) + Mobile App (React Native)

---

## 1. DESIGN PHILOSOPHY

### Core Principles
1. **Neumorphic Design** - Soft, organic forms with subtle shadows
   - No hard edges or harsh contrasts
   - Lighting from one consistent direction (soft depth)
   - Feels tactile, inviting, trustworthy

2. **Eco-Friendly Brand** - Green speaks nature, growth, sustainability
   - Green = microalgae, photosynthesis, clean air
   - White = purity, clarity, light
   - Conveys: "Living technology in harmony with nature"

3. **Clean & Modern** - Minimalist, uncluttered, focused
   - Whitespace prioritized
   - Typography: Modern sans-serif (legible, friendly)
   - Icons: Organic, rounded shapes
   - No unnecessary decoration

4. **Trust & Transparency** - XAI integration
   - Every number has context
   - Explanations visible on hover
   - Decision rationale always accessible

---

## 2. COLOR PALETTE

### Primary Colors

| Use | Color | Hex | RGB | Purpose |
|-----|-------|-----|-----|---------|
| Primary/Active | Vibrant Green | #2ECC71 | 46, 204, 113 | Positive, growth, photosynthesis |
| Secondary | Soft Sage | #66BB6A | 102, 187, 106 | Subtle highlights, secondary actions |
| Neutral | Off-White | #F8F9FA | 248, 249, 250 | Background, clean base |
| Accent | Dark Green | #27AE60 | 39, 174, 96 | Hover, active states, borders |
| Text | Dark Gray | #2C3E50 | 44, 62, 80 | Primary text, high readability |
| Muted | Light Gray | #BDC3C7 | 189, 195, 199 | Secondary text, disabled states |

### Semantic Colors

| State | Color | Usage |
|-------|-------|-------|
| Healthy/Optimal | #2ECC71 (Green) | Good readings, positive alerts |
| Warning | #F39C12 (Orange) | Monitor needed, check soon |
| Critical | #E74C3C (Red) | Immediate action required |
| Positive Change | #2ECC71 (Green) | Upward trends, improvements |
| Information | #3498DB (Blue) | Explanations, help text |

### Neumorphic Shadows (Soft, Subtle)

```css
/* Light elements (raised) */
box-shadow: 
  8px 8px 20px rgba(0, 0, 0, 0.08),
  -8px -8px 20px rgba(255, 255, 255, 0.6);

/* Dark elements (inset/pressed) */
box-shadow: 
  inset 8px 8px 20px rgba(0, 0, 0, 0.08),
  inset -8px -8px 20px rgba(255, 255, 255, 0.6);

/* Active/Hover (subtle lift) */
box-shadow: 
  6px 6px 16px rgba(0, 0, 0, 0.06),
  -6px -6px 16px rgba(255, 255, 255, 0.8);
```

---

## 3. TYPOGRAPHY

### Font Family
- **Primary Font:** Inter, Segoe UI, or system sans-serif
  - Modern, clean, highly readable
  - Excellent for screens (web + mobile)
  - Supports multiple weights (300, 400, 500, 600, 700)

### Font Sizes & Hierarchy

| Level | Size (px) | Weight | Use |
|-------|-----------|--------|-----|
| **Page Title** | 32 | 700 (Bold) | Dashboard title, page heading |
| **Section Header** | 24 | 600 (Semi-Bold) | Card titles, major sections |
| **Subtitle** | 18 | 500 (Medium) | Sensor names, secondary headings |
| **Body Text** | 16 | 400 (Regular) | Explanations, descriptions, alerts |
| **Small Text** | 14 | 400 (Regular) | Metadata, timestamps, hints |
| **Tiny Text** | 12 | 400 (Regular) | Labels, units, technical info |

### Line Height
- Large text (>20px): 1.3
- Regular text (16-20px): 1.5
- Small text (<16px): 1.6

---

## 4. NEUMORPHIC COMPONENTS

### 4.1 Cards (Metric Display)

**Design:**
- Soft, rounded corners (16px radius)
- Subtle neumorphic shadow (raised look)
- Green accent border on left (3px, #2ECC71)
- White background (#F8F9FA)
- Padding: 20px
- Hover: Lift effect (box-shadow increases slightly)

**Example Layout:**
```
┌─────────────────────────────────┐
│▌ Dissolved Oxygen               │
│                                 │
│  Current: 10.5 mg/L  ✓ OPTIMAL  │
│  Target:  8-15 mg/L             │
│                                 │
│  [?] Why is this important?     │ (XAI tooltip)
└─────────────────────────────────┘
```

### 4.2 Buttons (Primary & Secondary)

**Primary Button (CTA - Call to Action):**
- Background: #2ECC71 (Vibrant Green)
- Text: White (#FFFFFF)
- Padding: 12px 24px
- Border radius: 12px
- Shadow: Soft neumorphic
- Hover: Lifted (deeper shadow), 5% darker green
- Active: Pressed (inset shadow), 10% darker green

**Secondary Button:**
- Background: #F8F9FA (Off-White)
- Text: #2C3E50 (Dark Gray)
- Border: 1px solid #BDC3C7 (Light Gray)
- Padding: 10px 20px
- Border radius: 12px
- Hover: Light green tint, lifted
- Active: Pressed, green text

### 4.3 Sliders (LED Intensity, Aeration Rate)

**Design:**
- Track: Light gray (#E8E8E8)
- Thumb: Vibrant green (#2ECC71) with neumorphic shadow
- Smooth, large touch target (40px height for mobile)
- Value label above/beside slider
- Range indicators at ends (min/max)

```
Aeration Level: 60%
├─ 0%  ━━━●━━━━━━━━━━━━  100%
└─ Optimal range: 50-70% [?]
```

### 4.4 Gauges (Circular Progress)

**Design for CO2, O2, etc.:**
- Circular progress ring (SVG)
- Center: Large number + unit
- Ring color: Green gradient (#2ECC71 → #27AE60)
- Background ring: Light gray (#E8E8E8)
- Labels: "Current", "Target" with subtle text
- Status emoji: ✓ (optimal), ⚠️ (warning), ⚠️ (critical)

```
         CO2 LEVEL: 450 ppm
           
         ╭───────────╮
        /   ●━━━━    \    ✓ GOOD
       |              |  (Target: 400-600 ppm)
        \  Progress   /
         ╰───────────╯
         
         [?] Why this level?
```

---

## 5. LAYOUT STRUCTURE

### 5.1 Web Dashboard (Desktop, 1920×1080+)

**Header (Fixed, Top):**
- Left: ALCURA logo + text "Dashboard"
- Center: Culture age countdown ("Day 25 of ~30 until harvest")
- Right: User name, settings icon, notifications bell

**Sidebar (Left, Collapsible):**
- Navigation: Dashboard, Culture Health, Air Quality, Settings, Support
- Current culture info: Temperature, age, estimated biomass
- Quick actions: Harvest Info, Maintenance Alerts

**Main Content Area:**
- 3-column grid layout on desktop
- Responsive: 2 columns on tablet, 1 column on mobile

**Content Cards (3 columns):**

**Row 1 (Top Priority):**
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Harvest Status | Culture Health | Air Quality |

**Row 2 (Monitoring):**
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| DO Level | Temperature | CO2 Level |

**Row 3 (System):**
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| pH Level | PM Sensors | LED Status |

**Row 4 (Charts & Trends):**
| Full Width | 24-hour trend chart |
|------------|---------------------|
| Or: 7-day chart, monthly summary (user selectable) |

---

### 5.2 Mobile App (375×812 iPhone 12)

**Header (Sticky):**
- Back/menu icon
- "ALCURA" title center
- Settings/notifications right

**Content (Full Width, Scrollable):**
- Hero card: Harvest countdown + status (large, prominent)
- Quick metrics: 3 key cards (DO, CO2, Temp)
- Expandable sections: "Culture Health", "Air Quality", "System Status"
- Bottom navigation: Dashboard | Trends | Alerts | Settings

**Bottom Navigation (Always visible):**
```
┌──────────────────────────────────────┐
│ 🏠 Dashboard  📊 Trends  🔔 Alerts   │
│ ⚙️ Settings                          │
└──────────────────────────────────────┘
```

---

## 6. INTERACTION PATTERNS

### 6.1 Hover Tooltips (Desktop)

**Trigger:** Hover on [?] icon or metric number
**Behavior:**
- Tooltip appears with 200ms delay
- 250px wide max
- Neumorphic shadow
- Green accent line top
- White text on off-white background
- Dismisses on mouse-out or click

**Content:**
```
[?] Why is Dissolved Oxygen Important?

Microalgae need oxygen to photosynthesize efficiently.
10-15 mg/L is optimal for Spirulina.

Too low (<8): Culture struggles
Too high (>18): Risk of phytotoxicity

Current: 10.5 mg/L ✓ Perfect
[Learn more →]
```

### 6.2 Tap Interactions (Mobile)

**Trigger:** Tap on metric card
**Behavior:**
- Slight scale animation (1.02x)
- Expands to show more details
- XAI explanation appears
- Tap outside to collapse

### 6.3 Alerts

**Design:** Subtle, non-intrusive
- Toast notification (bottom right, mobile: bottom center)
- Icon + text + action button
- Auto-dismiss after 5 seconds (or user taps)
- Neumorphic shadow, green accent

**Example:**
```
🌱 SYSTEM UPDATE
Culture nutrients replenished successfully
[Dismiss] [Details]
```

---

## 7. ICONS & ILLUSTRATIONS

### Icon Style
- Organic, rounded shapes (avoid sharp angles)
- Thin line weight (1.5-2px)
- Consistent sizing (24px, 32px, 48px)
- Green color for active states, gray for inactive
- Source: Custom + Ionicons or similar eco-friendly set

### Key Icons
| Icon | Meaning | Usage |
|------|---------|-------|
| 🌱 | Growth/Health | Primary icon, positive state |
| 💧 | Water/Hydration | Temperature, humidity, DO |
| 🌞 | Light/Energy | LED, lux, UV sensors |
| 🌬️ | Air | CO2, aeration, air quality |
| ⚠️ | Warning | Alerts, caution states |
| ✓ | Confirmed | Optimal readings, success |
| 🔄 | Cycle/Processing | Loading, syncing, updating |
| ⚙️ | Settings | Configuration, adjustments |

### Illustrations (Hand-drawn, Organic Style)

**Microalgae organism (Spirulina):**
- Stylized, friendly, not too scientific
- Green color (#2ECC71)
- Used as accent illustration in onboarding
- Subtle animation: gentle spiral rotation

**Growth curve chart:**
- Smooth, flowing line
- Green gradient background
- No harsh grid lines
- Minimal labels

---

## 8. LIGHT & DARK MODE

**Light Mode (Default):**
- Background: #F8F9FA (off-white)
- Cards: #FFFFFF (pure white)
- Text: #2C3E50 (dark gray)
- Accents: #2ECC71 (vibrant green)

**Dark Mode (Optional, for evening use):**
- Background: #1A1A1A (near black)
- Cards: #2D2D2D (dark gray)
- Text: #F0F0F0 (light gray)
- Accents: #4CAF50 (softer green, easier on eyes)
- Neumorphic shadows: Lighter (white light source)

---

## 9. RESPONSIVE DESIGN BREAKPOINTS

| Device | Width | Layout | Notes |
|--------|-------|--------|-------|
| Mobile | 320-480px | 1 column | Portrait, thumb-friendly |
| Tablet | 481-768px | 2 columns | Landscape/portrait flexible |
| Desktop | 769-1920px | 3 columns | Full dashboard |
| Large | 1921px+ | 4 columns | Big monitors, wide view |

**Touch Targets:**
- Minimum 48px × 48px for mobile buttons
- Desktop minimum 32px × 32px
- Padding between interactive elements: 8px min

---

## 10. MICRO-INTERACTIONS & ANIMATIONS

### 10.1 Metric Card Animation

**On Load:**
- Fade in from 0% opacity over 300ms
- Subtle scale animation (0.95 → 1.0) 
- Staggered animation (100ms delay between cards)

**On Value Change:**
- Number "blinks" with 200ms highlight (light green background)
- Smooth tween of numeric value (200ms duration)
- Icon rotation (if trend: up/down arrow spins 90°)

### 10.2 Button Press Feedback

**On Click:**
- Instant: Box-shadow changes (pressed inset effect)
- 150ms: Scale down slightly (0.98x)
- Release: Snap back with spring physics (ease-out cubic)

### 10.3 Alert Slide-in

**On Alert:**
- Slide in from right (mobile: bottom) over 200ms
- Ease-out quad
- Auto-dismiss: Slide out over 200ms after 5s
- Or: Manual dismiss (swipe/tap) → immediate exit

### 10.4 Page Transitions

**Between Views:**
- Fade: 200ms (desktop, same page level)
- Slide: 300ms (mobile, navigation to new section)
- Scale: 250ms (modal dialogs appear/disappear)

---

## 11. ACCESSIBILITY CONSIDERATIONS

### Color Contrast
- Minimum WCAG AA: 4.5:1 for text
- Green text (#2ECC71) on white: 4.2:1 ratio ✓ (passes)
- Use color + icon/text labels (not color alone)

### Keyboard Navigation
- Tab order follows visual hierarchy
- Focus states: Clear 3px green outline
- All buttons/links keyboard accessible

### Screen Reader Support
- Alt text for all icons
- Semantic HTML (buttons, links, headings)
- ARIA labels for charts ("Harvets readiness: 85%")

### Text Sizing
- Responsive font sizes (clamp() CSS function)
- Support browser zoom up to 200%
- Line length: 50-75 characters (optimal reading)

---

## 12. DESIGN TOKENS (CSS Variables)

```css
/* Colors */
:root {
  --color-primary: #2ECC71;
  --color-primary-dark: #27AE60;
  --color-secondary: #66BB6A;
  --color-background: #F8F9FA;
  --color-surface: #FFFFFF;
  --color-text: #2C3E50;
  --color-text-secondary: #BDC3C7;
  --color-warning: #F39C12;
  --color-critical: #E74C3C;
}

/* Spacing */
:root {
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}

/* Border Radius */
:root {
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;
}

/* Shadows (Neumorphic) */
:root {
  --shadow-sm: 2px 2px 8px rgba(0,0,0,0.04);
  --shadow-md: 4px 4px 12px rgba(0,0,0,0.06);
  --shadow-lg: 8px 8px 20px rgba(0,0,0,0.08);
}

/* Typography */
:root {
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, sans-serif;
  --font-size-sm: 12px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
  --font-size-2xl: 32px;
}
```

---

## 13. SCREEN EXAMPLES & FLOWS

### 13.1 Dashboard Home (Desktop)

```
┌──────────────────────────────────────────────────────────────┐
│  🌱 ALCURA Dashboard    │ Day 25 of ~30 until harvest    ⚙️ │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Sidebar          │  HARVEST STATUS               │ CULTURE │
│  ━━━━━━━━━━━     │  ┌──────────────────────────┐ │ HEALTH  │
│  🏠 Dashboard    │  │ 📊 Ready in 5 days       │ │ ┌─────┐ │
│  📊 Trends       │  │ 85% probability          │ │ │ Temp│ │
│  🔔 Alerts       │  │ Est. yield: 280g         │ │ │26.5 │ │
│  ⚙️ Settings     │  └──────────────────────────┘ │ └─────┘ │
│                  │                                │         │
│  Temperature     │  AIR QUALITY          │ SYSTEM STATE    │
│  26.5°C          │  ┌──────────────────┐ │ ┌──────────────┐│
│  [?] Info        │  │ CO2: 450 ppm    │ │ │ DO: 10.5 ✓   ││
│                  │  │ O2: 18%         │ │ │ pH: 9.1 ✓    ││
│                  │  │ PM2.5: 8 μg/m³  │ │ │ LEDs: 85% ✓  ││
│                  │  └──────────────────┘ │ └──────────────┘│
│                  │                        │                 │
│                  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                  │  Trends (24-hour): [Harvest] [CO2] [Temp] │
│                  │  (Chart visualization)                    │
│                  │                                           │
└──────────────────────────────────────────────────────────────┘
```

### 13.2 Mobile Harvest Alert

```
┌─────────────────────────────┐
│  ← ALCURA      ⚙️  🔔       │
├─────────────────────────────┤
│                             │
│  🌱 HARVEST READY           │
│                             │
│  ┌───────────────────────┐  │
│  │ In 5 days             │  │
│  │ 85% probability       │  │
│  │                       │  │
│  │ Est. yield: 280g      │  │
│  │ [?] Why these numbers?│  │
│  │                       │  │
│  │ [ PLAN HARVEST ]      │  │
│  └───────────────────────┘  │
│                             │
│  CURRENT METRICS            │
│  ┌───┬───┬───────────────┐  │
│  │DO │Temp│ pH            │  │
│  │10.│26.5│ 9.1 ✓         │  │
│  │5  │°C  │              │  │
│  └───┴───┴───────────────┘  │
│                             │
│  [Scroll for more]          │
│                             │
├─────────────────────────────┤
│ 🏠 Dashboard  📊 Trends     │
│ 🔔 Alerts    ⚙️ Settings   │
└─────────────────────────────┘
```

---

## 14. DESIGN ASSETS CHECKLIST

- [ ] Figma/Adobe XD project with all screens
- [ ] Component library (cards, buttons, inputs, etc.)
- [ ] Icon set (24px, 32px, 48px variants)
- [ ] Color palette swatch file
- [ ] Typography CSS/SCSS
- [ ] Animation specs (Framer Motion or CSS)
- [ ] Responsive grid system
- [ ] Accessibility checklist
- [ ] Brand guidelines (logo, spacing, tone)

---

## 15. HANDOFF TO DEVELOPERS

### Figma Specs
- Each component: Padding, colors, shadows, font metrics specified
- Breakpoint files: Desktop, tablet, mobile (separate or linked)
- Component variants: Active, hover, disabled states
- Annotations: Interaction types, animation specs

### CSS Framework
- Tailwind CSS or custom utility classes recommended
- Design tokens exported as CSS variables
- Neumorphic component library (CSS + HTML)

### React/React Native Structure
```
src/
├── components/
│   ├── Card.jsx (neumorphic card)
│   ├── Button.jsx (primary/secondary variants)
│   ├── Gauge.jsx (circular progress)
│   ├── Chart.jsx (trend visualization)
│   └── MetricsList.jsx (dashboard grid)
├── styles/
│   ├── tokens.css (design tokens)
│   ├── globals.css (global styles)
│   └── neumorphism.css (shadow utilities)
├── pages/
│   ├── Dashboard.jsx
│   ├── Trends.jsx
│   ├── Alerts.jsx
│   └── Settings.jsx
└── utils/
    ├── formatters.js (format numbers, dates)
    └── colors.js (color utilities)
```

---

## CLAUDE DESIGN PROMPT

**For generating UI mockups with Claude Design / AI design tools:**

---

### 🎨 UI DESIGN PROMPT (Use with Claude Design or similar)

```
You are an expert UI/UX designer specializing in consumer IoT products.

DESIGN BRIEF:
Create a dashboard UI for ALCURA - a 20L home microalgae photobioreactor system that monitors 9 sensors and recommends actions.

DESIGN SYSTEM:
- **Design Style:** Neumorphism (soft, rounded, subtle depth with soft shadows)
- **Color Palette:**
  - Primary: #2ECC71 (vibrant green for growth/positivity)
  - Secondary: #66BB6A (soft sage)
  - Background: #F8F9FA (off-white)
  - Text: #2C3E50 (dark gray)
  - Accents: Transparent green overlays (10-20% opacity)

- **Typography:**
  - Font: Inter, Segoe UI, or modern sans-serif
  - Hierarchy: 32px titles, 24px headers, 16px body
  - Weight: 700 bold for titles, 500 medium for sections, 400 regular for text

- **Components:**
  - Cards: White background (#FFFFFF), rounded 16px, neumorphic shadow, green left border accent
  - Buttons: Rounded 12px, soft shadow, hover=lift effect, active=inset shadow
  - Metrics: Circular gauge rings (SVG), green gradient progress
  - Sliders: Large thumb target (40px), green circle, range indicators

LAYOUT:
Desktop (1920px): 3-column grid
- Column 1: Harvest status, DO level, pH level
- Column 2: Culture health, Temperature, PM sensors
- Column 3: Air quality, CO2 level, LED status
- Row 4: 24-hour trend chart (full width)

Mobile (375px): Single column, scrollable, bottom navigation

PLATFORMS:
- Web dashboard (React.js, desktop-first responsive)
- Mobile app (React Native, iOS/Android optimized)

KEY SCREENS TO DESIGN:
1. Dashboard home (default view)
2. Harvest readiness modal
3. Alert notification (toast style)
4. Settings panel (light/dark mode option)
5. Sensor detail view (with XAI explanation)

TONE & STYLE:
- Clean, modern, minimalist (maximum whitespace)
- Eco-friendly (organic shapes, natural green colors)
- Friendly & trustworthy (rounded, soft, non-aggressive)
- Transparent/explainable (XAI indicators like [?] icons, tooltips)
- Not corporate/sterile (add subtle animations, organic illustrations)

INTERACTIONS:
- Smooth animations (200-300ms)
- Hover tooltips on metrics
- Card press/tap feedback (scale + shadow)
- Auto-dismiss alerts after 5 seconds
- Smooth value changes (tweened numbers)

ACCESSIBILITY:
- WCAG AA contrast ratio for all text (minimum 4.5:1)
- Touch targets minimum 48px × 48px
- Keyboard navigation support
- Screen reader friendly (semantic HTML)

DELIVERABLES:
Please create:
1. Dashboard home screen (desktop view) showing all 9 metrics
2. Mobile home screen (single column layout)
3. Harvest alert modal with explanation
4. Component library preview (card, button, gauge, slider styles)
5. Light & dark mode variants

USE THIS FOR:
- Landing page mockups
- Development handoff
- Investor presentations
- User testing prototypes
```

---

## DESIGN TOKENS JSON (For Developers)

```json
{
  "colors": {
    "primary": "#2ECC71",
    "primaryDark": "#27AE60",
    "secondary": "#66BB6A",
    "background": "#F8F9FA",
    "surface": "#FFFFFF",
    "text": "#2C3E50",
    "textSecondary": "#BDC3C7",
    "warning": "#F39C12",
    "critical": "#E74C3C",
    "info": "#3498DB"
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px"
  },
  "borderRadius": {
    "sm": "8px",
    "md": "12px",
    "lg": "16px",
    "full": "9999px"
  },
  "shadows": {
    "sm": "2px 2px 8px rgba(0, 0, 0, 0.04)",
    "md": "4px 4px 12px rgba(0, 0, 0, 0.06)",
    "lg": "8px 8px 20px rgba(0, 0, 0, 0.08)"
  },
  "typography": {
    "fontFamily": "Inter, Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif",
    "fontSize": {
      "sm": "12px",
      "base": "16px",
      "lg": "18px",
      "xl": "24px",
      "2xl": "32px"
    }
  }
}
```

---

**Document Status:** ✅ COMPLETE - Ready for Design Implementation

**Next Steps:**
1. Use the prompt above with Claude Design or Figma AI
2. Create component library
3. Develop React dashboard + React Native app
4. Integrate XAI explanations into UI


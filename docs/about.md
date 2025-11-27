# About Page Implementation Plan

## Overview
Implement presentation-style about page for STORY with 5 full-height scroll-snapping sections, scroll animations using Motion, and transparent backgrounds over PixelBlast.

## User Preferences
- **Styling:** Tailwind CSS utility classes
- **Animations:** Yes, scroll animations (slower, dramatic 1.2s)
- **Architecture:** Separate section components colocated in about.tsx (TheReality, TheProblem, TheIdea, TheExperience, TheOutro)
- **Polish:** Basic functional MVP with dramatic experience
- **Layout:** Keep RootLayout (PixelBlast + header)
- **Backgrounds:** Transparent/minimal
- **Navigation:** Scroll only (browser default snap, no UI controls)
- **Typography:** Consistent heading size, lower body text
- **Viewport:** h-dvh (dynamic viewport height)
- **Section 5:** Just "So. What's your story" (no CTA)
- **Sohac:** Briefly explain the world
- **Typewriter:** Delete and retype different use cases (loop)
- **Font:** Consistent Geist Sans throughout

## Existing Implementation
User already started implementation at `/workspaces/story/src/pages/about.tsx`:
- Container with `ref` + dimension tracking via useLayoutEffect
- Sections receive `dimension` prop for sizing
- Structure: TheReality, TheProblem, TheIdea (3/5 sections started)
- Container: `flex-1 overflow-y-auto` with ring border for debugging

**Build on this pattern:** Keep dimension tracking, add scroll-snap + Motion animations + content

## Technical Context
- **Framework:** Next.js 15 Pages Router, React 19, TypeScript
- **Styling:** Tailwind v4 with OKLCH colors, dark mode default
- **Animation:** Motion library (v12.23.24) already installed
- **Existing components:** ShinyText (CSS shine), TextType (GSAP typewriter with startOnVisible support)
- **Layout:** RootLayout with max-w-4xl container, PixelBlast background, STORY header link

## Implementation Strategy

### Challenge: RootLayout Container Constraints (SOLVED)
RootLayout applies `max-w-4xl` container which limits full-viewport design.

**User's Solution (Already Implemented):**
- Use `flex-1` on container to fill available height
- Track container dimensions with useLayoutEffect
- Pass dimensions to each section component
- Sections use inline styles: `style={{ width: dimension.width, height: dimension.height }}`

**Visual Example of Current Approach:**
```
┌─────────────────────────────────────────┐
│ RootLayout (max-w-4xl)                  │
│ ┌─────────────────────────────────────┐ │
│ │ AboutPage Container (flex-1)        │ │
│ │ overflow-y-auto                     │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ TheReality                      │ │ │ ← Uses dimension.width/height
│ │ │ (fills container)               │ │ │
│ │ └─────────────────────────────────┘ │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ TheProblem                      │ │ │
│ │ │ (fills container)               │ │ │
│ │ └─────────────────────────────────┘ │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

This approach respects RootLayout constraints while achieving full-container sections.

### Component Structure
All colocated in `/workspaces/story/src/pages/about.tsx`:

```
AboutPage (main export)
├─ containerRef + dimension tracking (useLayoutEffect)
├─ scroll container (flex-1, overflow-y-auto, snap-y, snap-mandatory, scroll-smooth)
├─ TheReality - world "sohac" intro (receives dimension prop)
├─ TheProblem - anxiety, insecurity, uncertainty (receives dimension prop)
├─ TheIdea - STORY as AI journal/mentor (uses ShinyText, receives dimension prop)
├─ TheExperience - use cases (uses TextType with loop, receives dimension prop)
└─ TheOutro - "So. What's your story" (receives dimension prop)
```

**Already implemented:** TheReality, TheProblem, TheIdea (3/5)
**To add:** TheExperience, TheOutro (2/5)

### Scroll-Snap Implementation
**Container:** Add to existing `flex-1 overflow-y-auto`:
```
snap-y snap-mandatory scroll-smooth
```

**Section:** Add to each section div:
```
snap-start snap-always flex items-center justify-center
```

**Note:** Sections already use inline `style={{ width, height }}` - keep this, add classes above

Browser support: Excellent (CSS scroll-snap native, browser default behavior)

### Animation Strategy
**Library:** Motion (already in bundle, best for scroll triggers)

**Timing:** Slower, dramatic 1.2s duration (user preference)

**Pattern per section:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 1.2, ease: "easeOut" }}
  viewport={{ once: true, amount: 0.5 }}
>
```

**Specific animations:**
1. **TheReality:** Fade up + blur → clear
2. **TheProblem:** Staggered list items
3. **TheIdea:** Scale + rotate for "STORY" text with ShinyText
4. **TheExperience:** TextType component with `startOnVisible={true}` + `loop={true}` (delete/retype)
5. **TheOutro:** Simple fade + scale

### Content Sections

#### Section 1 - TheReality
- **Heading:** "The Reality" (consistent size, e.g., text-4xl)
- **Content:** Brief intro to world "sohac" (imaginary world experiencing turbulent period)
- **Bullets:** Power shifts between superpowers, emerging disruptive tech, faster-paced life
- **Typography:** Lower body text size (e.g., text-sm or text-base)
- **Animation:** Fade up with blur → clear

#### Section 2 - TheProblem
- **Heading:** "The Problem"
- **Content:** Challenges people in sohac face
- **Bullets:** Social anxiety, job insecurity, fake stats on feeling unsafe, uncertainty about future, held back by intensity
- **Typography:** Lower body text
- **Animation:** Staggered list items

#### Section 3 - TheIdea
- **Heading:** "The Idea"
- **"STORY" text:** Use ShinyText component for branding
- **Description:** AI-powered digital journal/mentor (explicitly NOT teacher/instructor/supervisor), a friend and reflection
- **Typography:** Lower body text
- **Animation:** Scale + rotate entrance for dramatic effect

#### Section 4 - TheExperience
- **Heading:** "The Experience"
- **Use TextType:** `startOnVisible={true}`, `loop={true}` (delete and retype different use cases)
- **Content examples:**
  - "By providing your bibliography..."
  - "Ask questions about yourself to find your inner voice"
  - Multiple use case sentences that cycle
- **Animation:** Typewriter effect triggered on visibility

#### Section 5 - TheOutro
- **Content:** "So. What's your story" (no CTA button, just tagline)
- **Typography:** Large text, centered
- **Animation:** Fade + scale for dramatic finish

## Implementation Stages

### Stage 1: Scroll-Snap + Remaining Sections ✓
**Testable outcome:** All 5 sections present, scroll-snap works

**Already done:**
- ✓ Container with dimension tracking
- ✓ TheReality, TheProblem, TheIdea components

**To do:**
1. Add `snap-y snap-mandatory scroll-smooth` to container
2. Add `snap-start snap-always flex items-center justify-center` to all section divs
3. Create TheExperience component (placeholder text)
4. Create TheOutro component (placeholder text)
5. Test scroll-snap behavior (should snap one section at a time)

**Files modified:**
- `/workspaces/story/src/pages/about.tsx` (update existing)

### Stage 2: Content Population
**Testable outcome:** All 5 sections display correct text content

1. TheReality: Add heading + sohac intro + bullets (power shifts, tech, pace)
2. TheProblem: Add heading + bullets (anxiety, insecurity, stats, uncertainty, intensity)
3. TheIdea: Add heading + ShinyText("STORY") + description (journal/mentor, NOT teacher)
4. TheExperience: Add heading + TextType with multiple use case sentences (loop=true, startOnVisible=true)
5. TheOutro: Add "So. What's your story" in large text

**Components to import:**
- `ShinyText` from `@/components/shiny-text`
- `TextType` from `@/components/text-type`
- `motion` from `motion/react` (for Stage 3)

### Stage 3: Motion Integration
**Testable outcome:** Animations trigger when scrolling to each section

1. Import `motion` from "motion/react"
2. Wrap TheReality content with motion.div: fade-up + blur (initial: `opacity: 0, y: 50, filter: "blur(10px)"`)
3. Wrap TheProblem list with motion.ul + staggerChildren (0.2s between items)
4. Wrap TheIdea content with motion.div: scale + rotate (initial: `scale: 0.8, rotate: -5`)
5. TheExperience: TextType already handles animation with `startOnVisible={true}`
6. Wrap TheOutro content with motion.div: fade + scale (initial: `opacity: 0, scale: 0.9`)
7. Test viewport triggers (animations fire at 50% visible, once only)

**Animation config (all sections):**
- `viewport={{ once: true, amount: 0.5 }}`
- `transition={{ duration: 1.2, ease: "easeOut" }}` (dramatic, slower)

### Stage 4: Polish
**Testable outcome:** Visual consistency, responsive, dark mode works

1. Typography: Consistent heading size (text-4xl), lower body text (text-sm or text-base)
2. Blue accents: Add `text-blue-500` to "STORY", "sohac", and key phrases
3. Spacing: No max-width constraints, content can span wider within sections
4. Hide scrollbar: Add `scrollbar-hide` or custom CSS to container
5. Dark mode: Use text-foreground, text-muted-foreground from Tailwind
6. Mobile: Test on mobile browsers, sections should snap smoothly
7. Remove debug borders (ring-1) from container/sections
8. Performance: Verify smooth scroll, no jank, animations performant

## Technical Considerations

### 1. Dimension Tracking (Already Solved)
**User's approach:** Track container dimensions with useLayoutEffect, pass to sections via props
**Benefit:** Sections fill available space within RootLayout's max-w-4xl constraint
**Note:** Keep this pattern, works elegantly with existing layout

### 2. Mobile Viewport Height
**User preference:** Use h-dvh (dynamic viewport height)
**Implementation:** Sections should use `style={{ width: dimension.width, height: dimension.height }}`
**Note:** Since container uses `flex-1`, it adapts to viewport automatically - h-dvh handled by container

### 3. TextType with Loop
**User preference:** Delete and retype different use cases

**Usage:**
```tsx
<TextType
  text={["By providing your bibliography...", "Ask questions about yourself...", "Find your inner voice..."]}
  startOnVisible={true}
  loop={true}
  pauseDuration={2000}
  deletingSpeed={30}
  typingSpeed={50}
/>
```

**Note:** Pass array of strings, component will cycle through them

### 4. Motion Performance
**Optimizations:**
- Use `viewport={{ once: true }}` - animate only once
- Animate transform/opacity only (GPU accelerated)
- Motion library handles will-change automatically
- Slower animations (1.2s) still performant

### 5. Scroll-Snap Browser Default
**User preference:** Browser default snap (no custom JS)
**Implementation:** `snap-y snap-mandatory scroll-smooth` on container
**Testing:** Should work well on modern browsers, test on iOS Safari for mobile

### 6. Hide Scrollbar
**User preference:** Hide scrollbar on all about page elements
**Implementation options:**
- Use Tailwind plugin class `scrollbar-hide` (if installed)
- Or add custom CSS: `[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`
- Apply to container div

**Code:**
```tsx
className="flex-1 overflow-y-auto snap-y snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
```

## Critical Files

### Files to Modify
- `/workspaces/story/src/pages/about.tsx` - Full implementation

### Files to Reference (No Changes)
- `/workspaces/story/src/components/shiny-text.tsx` - Import for Section 3
- `/workspaces/story/src/components/text-type.tsx` - Import for Section 4
- `/workspaces/story/src/pages/_app.tsx` - RootLayout wrapper (no changes needed)
- `/workspaces/story/src/components/layout/root-layout.tsx` - Layout constraints to work around

### Content Reference
- `/workspaces/story/docs/about.md` - Section content source

## Dependencies
**Already installed, no new packages needed:**
- motion (v12.23.24) ✓
- Tailwind v4 ✓
- ShinyText component ✓
- TextType component ✓

## Testing Checklist
- [ ] Sections scroll-snap correctly (one visible at a time)
- [ ] Each section triggers animation at ~50% viewport
- [ ] Animations only play once (viewport.once works)
- [ ] TextType starts typing when section visible
- [ ] Mobile: Touch scroll works, snap not aggressive
- [ ] Performance: Smooth scroll, no jank
- [ ] Dark mode: Text colors readable on PixelBlast
- [ ] Typography: Consistent scale across sections
- [ ] Responsive: Works on mobile/tablet/desktop

## Code Structure Example

```tsx
// about.tsx structure (building on existing code)
import React, { useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ShinyText } from "@/components/shiny-text";
import { TextType } from "@/components/text-type";

type Dimension = { width: number; height: number };

export default function AboutPage() {
  const containerRef = useRef<React.ComponentRef<"div">>(null);
  const [sectionDimension, setSectionDimension] = useState<Dimension>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const updateSectionDimension = () => {
      setSectionDimension({ width: container.offsetWidth, height: container.offsetHeight });
    };
    updateSectionDimension();
  }, []);

  return (
    <div
      id="scrolling-container"
      ref={containerRef}
      className="flex-1 overflow-y-auto snap-y snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      <TheReality dimension={sectionDimension} />
      <TheProblem dimension={sectionDimension} />
      <TheIdea dimension={sectionDimension} />
      <TheExperience dimension={sectionDimension} />
      <TheOutro dimension={sectionDimension} />
    </div>
  );
}

function TheReality({ dimension }: { dimension: Dimension }) {
  return (
    <div
      className="snap-start snap-always flex items-center justify-center px-8"
      style={{ width: dimension.width, height: dimension.height }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.5 }}
        className="text-center"
      >
        <h2 className="text-4xl mb-6">The Reality</h2>
        <p className="text-base text-muted-foreground mb-4">
          In a world called <strong className="text-blue-500">sohac</strong>, we find ourselves experiencing a turbulent period...
        </p>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>• Power shifts between global superpowers</li>
          <li>• Emerging and disruptive technologies</li>
          <li>• An increasingly faster-paced life</li>
        </ul>
      </motion.div>
    </div>
  );
}

// ... other sections follow similar pattern
```

## Success Criteria
1. All 5 sections render with correct content
2. Scroll-snap works smoothly (one section per viewport)
3. Animations trigger on scroll, play once
4. TextType typewriter works in Section 4
5. Transparent backgrounds show PixelBlast
6. Mobile responsive and performant
7. Consistent with dark mode design system

---

## User Answers Summary ✓

**Typography & Content:**
- ✓ All sections use same heading size (text-4xl)
- ✓ No CTA/tagline in Section 5, just "So. What's your story"
- ✓ Briefly explain sohac in Section 1

**Visual Design:**
- ✓ Consistent font (Geist Sans) throughout
- ✓ Lower body text size

**Interaction & Behavior:**
- ✓ Browser default scroll-snap (smooth interpolation)
- ✓ Typewriter loops, deleting and retyping different use cases
- ✓ Slower animations (1.2s) for dramatic effect

**Mobile:**
- ✓ Use h-dvh (dynamic viewport height)
- ✓ One lower text size

**Additional Preferences:**
- ✓ Blue accent color for key text ("STORY", important phrases)
- ✓ No section spacing constraints (content can span wider)
- ✓ Hide scrollbar on all about page elements

All questions answered - ready for implementation! Meow 😸

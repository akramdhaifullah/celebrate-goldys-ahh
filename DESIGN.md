# Digital Scrapbook Birthday

## Product Overview

**The Pitch:** An elegant, digital keepsake celebrating a milestone birthday. It transforms digital memories into a tactile, editorial-style scrapbook experience filled with shared history and heartfelt wishes.

**For:** Friends, family, and the birthday honoree who value nostalgia, high-end design, and deeply personal storytelling.

**Device:** desktop

**Design Direction:** A warm, nostalgic scrapbook merging editorial elegance with tactile intimacy. Heavy reliance on asymmetrical photo layouts, realistic paper textures, delicate gold accents, and high-contrast serif typography.

**Inspired by:** Artifact Uprising, Vogue Editorial, Kinfolk Magazine

---

## Screens

The primary experience is a continuous, single-page scroll homepage with smooth transitions between stacked sections, accompanied by a dedicated contribution page:

**Homepage:**
- **Hero / Cover:** Grand introduction with a hero portrait and elegant dedication.
- **Our Story:** Interactive photo gallery displaying memories one-by-one in a large, central Polaroid frame with delicate gold navigation.
- **Friends' Wishes:** Interactive carousel of personal messages displayed one at a time on textured, torn-edge paper cards.

**Secondary Pages:**
- **Add a Memory:** A dedicated contribution page featuring an elegant form for guests to write wishes and upload photos.

---

## Key Flows

**Leaving a Birthday Wish:** Guest adds a message and photo to the digital scrapbook.

1. User scrolls to the Friends' Wishes section on the homepage -> sees the current active wish card and a gold "Add a Memory" button
2. User clicks "Add a Memory" -> navigates to the dedicated 'Add a Memory' page
3. User fills out the textured paper form with a written message and uploads a photo
4. User submits the form -> redirects back to the homepage where their note instantly renders, becoming the newly active card in the presentation

---

<details>
<summary>Design System</summary>

## Color Palette

- **Primary:** `#D4AF37` - Gold (Buttons, links, delicate dividers)
- **Background:** `#F9F6F0` - Warm Cream (Main page background)
- **Surface:** `#F2EFE9` - Soft Paper (Cards, photo frames, forms)
- **Text:** `#2C2C2C` - Deep Charcoal (Headings, primary body text)
- **Muted:** `#8B7D6B` - Sepia Tone (Secondary text, dates, subtle borders)
- **Accent:** `#E6DFD3` - Darker Cream (Hover states, structural backgrounds)

## Typography

- **Headings:** Playfair Display, 600/700, 36-72px
- **Body:** Lora, 400, 18px
- **Small text:** Lora, 400, 14px (Italicized for captions)
- **Buttons:** Playfair Display, 600, 16px, uppercase, wide tracking (2px)
- **Handwritten Accents:** Caveat, 400, 24px (For signatures and brief notes)

**Style notes:** Extensive use of CSS drop shadows (`shadow-xl` with a warm dark brown tint) to simulate physical photos layered on top of each other. Borders are often off-white (`#FFFFFF`) at 12px width to mimic polaroids. Background features a subtle CSS grain filter. Elements use slight rotations (`rotate-1`, `-rotate-2`) to break strict grid rigidity. Smooth scroll transitions are applied globally on the homepage, with sections and elements elegantly fading in and sliding up slightly as they enter the viewport.

## Design Tokens

```css
:root {
  --color-primary: #D4AF37;
  --color-background: #F9F6F0;
  --color-surface: #F2EFE9;
  --color-text: #2C2C2C;
  --color-muted: #8B7D6B;
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Lora', serif;
  --font-accent: 'Caveat', cursive;
  --radius-photo: 2px;
  --radius-card: 4px;
  --spacing-section: 120px;
}
```

</details>

---

<details>
<summary>Screen Specifications</summary>

### Hero / Cover

**Purpose:** Set the elegant, emotional tone immediately upon arrival.

**Layout:** Centered, editorial single-column. Massive hero image, typography overlay, soft scroll indicator.

**Key Elements:**
- **Hero Image:** 800px max-width, portrait orientation, 16px white border, `shadow-2xl`. Slight `-rotate-1`.
- **Title:** "Celebrating Thirty Years of Eleanor", 72px Playfair Display, `#2C2C2C`, centered above/overlapping the top edge of the photo.
- **Gold Divider:** 1px solid `#D4AF37`, 120px width, centered below image.

**States:**
- **Loading:** Fade-in sequence (Title -> Divider -> Image).

**Components:**
- **Scroll Prompt:** "Turn the page", 14px Lora italic, `#8B7D6B`, floating bottom center, pulsing opacity.

**Interactions:**
- **Scroll down:** Hero image translates upward at 0.5x scroll speed (parallax) as the user transitions to the next section.

**Responsive:**
- **Desktop:** 1200px max container width, massive typography.
- **Tablet:** 48px title, image scales to 90% width.
- **Mobile:** 36px title, zero rotation on image to save screen space.

### Our Story

**Purpose:** Display chronological or thematic memories in an interactive, focused presentation.

**Layout:** Centered single-item presentation. A large central Polaroid-style frame displays photos one-by-one, flanked by navigation arrows. Vertically stacked directly below the Hero section.

**Key Elements:**
- **Section Header:** "A Life in Frames", 48px Playfair Display, centered.
- **Active Photo:** Large image with 16px white padding, bottom padding 64px to look like a Polaroid. `shadow-xl`, slight rotation.
- **Navigation Arrows:** Delicate gold (`#D4AF37`) 'Next' and 'Back' icons placed to the left and right of the central frame.
- **Progress Indicator:** Minimalist text (e.g., "3 of 12"), 14px Lora italic, `#8B7D6B`, centered below the photo frame.
- **Captions:** 24px Caveat, `#2C2C2C`, handwritten inside the bottom padding of the photo.
- **Washi Tape Elements:** Small translucent rectangles `#E6DFD3` overlaid on corners of the active photo.

**States:**
- **Hover:** Navigation arrows increase opacity and scale slightly (`scale-110`).

**Components:**
- **Central Frame:** Max width 600px. Randomized slight rotation per photo between -2deg and +2deg to feel organic.

**Interactions:**
- **Click Arrows:** Transitions to next/previous photo with a smooth, soft crossfade.
- **Scroll Reveal:** The entire presentation block subtly fades in and translates upward as it enters the viewport.

**Responsive:**
- **Desktop:** Arrows positioned outside the central frame on the left and right sides.
- **Tablet:** Arrows moved to flank the progress indicator below the image.
- **Mobile:** Max width adjusts to screen size, arrows positioned below the image, zero rotation on the photo.

### Friends' Wishes

**Purpose:** A digital guestbook of notes and love presented intimately.

**Layout:** Centered single-card presentation. Displays individual wish cards one at a time with navigation. Vertically stacked below Our Story, acting as the end of the homepage.

**Key Elements:**
- **Header:** "Words of Love", 48px Playfair Display, centered.
- **Active Wish Card:** Large `#F2EFE9` background card, rough/torn edge CSS effect, `shadow-xl`. Max width 500px.
- **Navigation Arrows:** Delicate gold (`#D4AF37`) 'Next' and 'Back' icons flanking the active card.
- **CTA Button:** "Add a Memory", `#D4AF37` background, `#FFFFFF` text, 2px border `#D4AF37`, centered below the presentation.
- **Signatures:** Right-aligned, Caveat font, `#D4AF37`.

**States:**
- **Empty:** Single card that says "Be the first to leave a memory." Arrows hidden until multiple cards exist.

**Interactions:**
- **Click Arrows:** Note card transitions with a delicate sliding fade effect to reveal the next message.
- **Click CTA:** Navigates the user to the dedicated 'Add a Memory' page.
- **Scroll Reveal:** The presentation block fades in smoothly as the user scrolls into view.

**Responsive:**
- **Desktop:** Arrows on the sides of the wish card.
- **Tablet:** Arrows below the wish card, above the CTA button.
- **Mobile:** Full width card scaling, touch swipe enabled for next/previous navigation.

### Add a Memory

**Purpose:** A dedicated, elegant space for guests to contribute their personal notes and photos to the scrapbook.

**Layout:** Centered, single-column form layout. Minimalist editorial styling matching the rest of the site, preventing distractions.

**Key Elements:**
- **Header:** "Share a Memory", 48px Playfair Display, centered.
- **Back Link:** Minimalist text link ("Return to Scrapbook") in the top left, `#8B7D6B`.
- **Message Input:** Large `#F2EFE9` text area simulating paper, with border-bottom only (`#8B7D6B`), no focus rings, large Caveat placeholder text.
- **Photo Upload Area:** A delicate dashed gold (`#D4AF37`) bordered dropzone with an icon encouraging users to attach a photo.
- **Submit Button:** "Add to Scrapbook", `#D4AF37` background, `#FFFFFF` text, matching the global button style.

**States:**
- **Active/Focus:** Bottom borders on inputs turn solid `#D4AF37`.
- **Uploading:** Photo upload area shows a subtle loading spinner and image preview.
- **Validation:** Missing required fields prompt a soft `#8B7D6B` italicized error message.

**Interactions:**
- **Submit:** On successful submission, smoothly navigates the user back to the Homepage, automatically scrolling to the 'Friends' Wishes' section to display their new note.

**Responsive:**
- **Desktop:** Form container constrained to 600px width.
- **Tablet / Mobile:** Form container spans 90% width, touch-friendly tap targets for the photo upload.

</details>

---

<details>
<summary>Build Guide</summary>

**Stack:** HTML + Tailwind CSS v3

**Build Order:**
1. **Global Styles & Base Setup:** Establish the two-page architecture (Homepage and Add a Memory page), `#F9F6F0` background, Playfair/Lora font imports, default text colors, and Intersection Observer logic for scroll animations.
2. **Hero / Cover:** Build the initial impact. Master the polaroid shadow effect and slight rotation here, as it sets the component standard for the rest of the site.
3. **Our Story:** Implement the central interactive gallery. Crucial to get the large Polaroid padding, delicate gold arrow navigation, and smooth crossfade transitions right for the presentation.
4. **Friends' Wishes:** Build the single-card carousel display, torn-edge styling, and ensure the "Add a Memory" CTA correctly links to the secondary page.
5. **Add a Memory Page:** Build the standalone form, styled to look like editorial paper, integrating both text input and photo upload dropzone, with routing logic to return to the homepage upon submission.

</details>
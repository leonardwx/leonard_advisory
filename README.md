# Wei Xi website · continuous backgrounds and readable details v8.1

Prepared for local preview and review. This folder does not publish or change the live website.

## Design

A continuous light daytime Marina Bay photograph fills the viewport behind the page. Jewel blends across the full viewport width behind the existing “Why clients choose me” section with soft upper and lower fades. Ivory washes keep headings and cards readable. Hero support text is now20–25px with16–18px supporting copy. The advice subtitle is19–24px and remains visible on mobile on its own ivory panel. The phone number is20–24px in a prominent tap-to-call panel. There is no standalone landmark section, place caption, motion toolbar, video download or background animation.

The larger centred “Your goals. Your pace.” heading, clean portrait frame, removed overlapping badge, illustrated planning panels and persistent mobile shortcut bar are retained. Original section content, nine services, 18 testimonials, links, claims figures and disclaimer remain intact. The SVG planning artwork is conceptual illustration, not photographs or investment-performance evidence.

## Installation

1. Back up the current website files.
2. Copy `index.html`, `style.css`, `light.css`, `enhancement.css`, `scenery.css`, `script.js` and `enhancements.js` into the existing site folder. `scenery.css` loads last. The old `scenery.js` and `media` folder from v6 are no longer referenced.
3. Merge this package’s `images` contents into the existing `images` folder. Replace `marina-bay.jpg` with the supplied daylight version. Keep all existing original portraits, logos, consultation and testimonial photographs.
4. Keep the existing `certificates` folder and files at their original paths. Retain `MEDIA-CREDITS.md` and the website’s photo credits.
5. Preview on desktop and phone before publishing. Serve this folder with any static web server for a local preview.

## Original media

The original adviser portraits, consultation and testimonial photographs, WhatsApp icon, favicon and certificates were not supplied in this package. Their paths and fallbacks are preserved; see `assets-needed.txt`. No screenshot portraits or invented documents are bundled. Missing certificate links require their real original files.

Both adviser photo faces use `object-fit: contain` with safe spacing. This avoids cropping a complete source portrait but cannot restore pixels missing from an original. Check actual portrait framing after restoring originals.

## Navigation and accessibility

On phones and tablets up to 900px, the persistent bottom shortcuts provide Home, Planning, Reviews and Contact. The sticky top menu keeps all sections and scrolls internally on short screens. Touch targets, safe-area padding, keyboard photo flip, Escape handling, carousel controls, skip link and native anchors are retained.

The new scenery consists only of local still images. It needs no JavaScript, external image service, video controls or tracking. Existing reduced-motion handling remains in the original design layers. The original `script.js` is unchanged; `enhancements.js` continues handling mobile shortcut focus and current-section state.

## Content and review

Existing factual claims, including the January 2026 claims date, are carried over without independent factual verification. No metrics, credentials, client quotes or outcomes have been added.

The new daylight background layout still needs its final browser and visual pass. `images/marina-bay.jpg` is the supplied daylight photograph credited to Medtd1; Jewel remains the kallerna still photograph. The previous v6 folder remains unchanged for comparison or rollback.

## Readability refinement · v8.1

Biography text now sits on an opaque ivory reading surface with darker text and generous line spacing. The continuous scenery is softened behind other text. The phone number is reduced to20–24px while retaining the visible tap-to-call panel. Replace scenery.css from this package, or use the complete package while preserving original media folders.

## Selected About style · v8.2

About uses the member-selected plain ivory section background and open text layout, with no biography card or scenery behind the paragraphs. The smaller v8.1 phone number remains. Replace scenery.css from this package.

Version 8.3: enlarged credential pictures, stacked mobile cards and removed decorative 01/02/03 behind the pictures. From v8.2 replace index.html and scenery.css. Preserve original media/certificates.

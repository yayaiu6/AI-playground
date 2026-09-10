# Design Contract — Yahya Mahroof Portfolio

## Purpose

This document defines the non-negotiable quality rules for all 50 portfolio style experiences. Every style file under `styles/` must independently satisfy these requirements. No exception is made for visual novelty or technical ambition.

---

## Content Integrity

- Never invent projects, achievements, metrics, clients, technologies, or experience.
- All data must match the Content Contract exactly (see below).
- Never fabricate testimonials, reviews, or social proof.
- Never misrepresent skills, experience duration, or project scope.
- Every project link must point to a real, working URL.

### Content Contract

**About:**
- Name: Yahya Mahroof
- Title: ML/MLOps Engineer
- Bio: Results-driven ML Operations Engineer with experience designing, deploying, and improving AI systems and web applications. Skilled in building AI agents and integrating AI into real-world solutions.
- Skills: Python, Flask, Django, FastAPI, TensorFlow, PyTorch, Docker, Ubuntu, CI/CD, GPU Deployment, React, TypeScript, Git, Firebase
- Stats: 14+ AI Projects Deployed, 3+ Years Experience, 100% Client Satisfaction

**Projects:**

| Project | Description | URL |
|---------|-------------|-----|
| AI English Tutor | Interactive AI English teacher that chats, corrects mistakes, explains lessons in real-time | `https://english-tutor.yahya-mahroof.site/` |
| Handwriting OCR | Turn handwritten text into digital data instantly with high accuracy | `https://yahya-mahroof.site/OCR-Demo` |
| Quran Recitation AI | Test memorization using AI voice recognition to detect and correct reading mistakes | `https://quran-tracker.yahya-mahroof.site` |
| AI ATS System | Automatically compare applicant CVs against job descriptions to screen candidates | `https://ats.yahya-mahroof.site/admin` |

**Open Source:**
- Quran Recitation Tracker: 134 stars, 15 forks (github.com/yayaiu6)
- Handwriting OCR: 9 stars, 1 fork
- Messenger Bot: 5 stars

**Contact:**
- Email: yahyamahroof35@gmail.com
- GitHub: github.com/yayaiu6
- LinkedIn: linkedin.com/in/yahya-mahrouf
- WhatsApp: +20 100 186 6276

---

## Professional Hierarchy

- Name and title must be discoverable within the first viewport.
- Projects must be accessible within 2 interactions from any point.
- Contact information must be accessible from every page.
- Navigation must be clear and functional on all viewports.

---

## Quality Standard

Each style must independently meet:

- Professional UI/UX quality: intentional, polished, cohesive.
- Responsive design: mobile and desktop minimum.
- Keyboard accessibility: all interactive elements reachable via Tab.
- `prefers-reduced-motion` respect: no essential information conveyed only through animation.
- Readable text: minimum 16px body, sufficient contrast ratios (WCAG AA minimum).
- Clear interaction feedback: hover, focus, and active states on all interactive elements.
- Reasonable loading performance: no unnecessary dependencies.
- Graceful degradation: content visible and functional even if JavaScript fails.

---

## Dependency Discipline

- Never hardcode CDN URLs directly in style files.
- Always reference `shared/deps.js` for external libraries via `window.getDeps()`.
- Only load libraries the specific style actually needs.
- No decorative dependencies that harm performance without delivering meaningful UX value.

---

## Accessibility

- All images must have meaningful `alt` text or be marked `role="presentation"` / `alt=""`.
- All interactive elements must have accessible names (aria-label, aria-labelledby, or visible text).
- Color must not be the sole means of conveying information.
- Focus order must be logical and visible.
- A skip-navigation link is required for pages with persistent navigation.
- Language attribute (`lang="en"`) must be set on `<html>`.

---

## Usability

- Navigation must indicate current location (active state).
- Links must have clear hover, focus, and active states.
- Content must be readable without horizontal scrolling.
- Touch targets must be minimum 44x44px on mobile.
- No content should require specific hardware (e.g., only works with mouse).
- A method to return to the style selector (router) must be available.

---

## Performance

- Total page weight under 500KB excluding vendored libraries.
- No layout shift from lazy-loaded content (CLS < 0.1).
- Critical CSS inline or in `<head>`.
- Scripts loaded with appropriate `async` / `defer` attributes.
- No more than 3 external network requests on the critical path.

---

## Evaluation Criteria

A style is successful only when:

1. Its visual concept, information architecture, interaction model, and UX all work together.
2. A visitor can find Yahya's name, role, projects, and contact information without confusion.
3. The experience communicates professional credibility appropriate for an ML/MLOps engineer.
4. It would pass a design review by a senior UI/UX designer with 25+ years of experience.
5. It is distinguishable from every other style in the collection by structure, not just color.

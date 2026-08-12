# InternTrack

A responsive internship task-management dashboard built as Project 1 of the DecodeLabs Full Stack Development Internship.

## Live Demo
[TO BE ADDED AFTER DEPLOYMENT]

## GitHub Repository
[CURRENT REPOSITORY]

---

## Overview

InternTrack is a clean, accessible, and responsive internship task-management dashboard created to help developers and students organize tasks, track deadlines, monitor internship progress, and manage task statuses across multiple internships. It is designed to demonstrate core frontend development fundamentals using pure native web platform technologies.

---

## Features

- **Responsive Mobile-First Dashboard**: Optimized and tested seamlessly across mobile (320px–430px), tablet (768px), and desktop (1024px–1440px) viewports.
- **Add Task Functionality**: Accessible HTML5 modal dialog (`<dialog>`) with input validation for adding new tasks.
- **Task Status Management**: Quick action menus to transition tasks between *To Do*, *In Progress*, and *Completed* states, as well as task deletion with safety confirmation.
- **Task Filtering**: Dynamic filtering by status (*All*, *To Do*, *In Progress*, *Completed*) without page reloads.
- **Dynamic Task Statistics**: Real-time calculation of active tasks, completed tasks, and overall progress percentage.
- **Internship Progress Tracking**: Program timeline tracking (`Week 8 of 12` = `67%`) visually rendered via native `<progress>` elements.
- **localStorage Persistence**: Automatic client-side saving and loading of tasks (`interntrack_tasks`) so state survives browser refreshes.
- **Accessible Navigation & Controls**: Keyboard navigation support (`:focus-visible`), skip-to-main-content link, ARIA landmarks, `aria-expanded` attributes, and screen-reader accessible form labels.
- **Responsive Mobile Menu**: Touch-friendly hamburger drawer for mobile devices.

---

## Technologies

- **HTML5**: Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`), `<time>`, `<progress>`, and `<dialog>`.
- **CSS3**: Vanilla CSS with custom property design tokens (`:root`), Flexbox, CSS Grid, `clamp()` fluid typography, and `@media (prefers-reduced-motion: reduce)`.
- **Vanilla JavaScript**: ES6+ event delegation, DOM manipulation (`document.createElement()`, `textContent`), state management, and date formatting.
- **localStorage**: Client-side data persistence.

---

## UI/UX Design Process

1. **Requirement Analysis**: Defined core user goals and internship submission constraints.
2. **UX Planning & Wireframing**: Established content hierarchy (Welcome banner, Statistics grid, Program Progress, Task filters, Task cards grid, Footer).
3. **Design Exploration**: UI/UX planning and visual design exploration were performed using **Google Stitch** to establish the warm mocha color palette, typography scale, and card layout hierarchy.
4. **Responsive Implementation**: Built mobile-first layout foundation and scaled upward for tablet and desktop breakpoints.
5. **Accessibility Audit**: Ensured WCAG AA contrast compliance, keyboard focus rings, and explicit status text beyond color.

---

## Responsive Strategy

- **Mobile Base (320px–480px)**: 1-column layouts, full-width call-to-action buttons, horizontally scrollable filter chips container (`overflow-x: auto`), and compact hamburger menu navigation.
- **Tablet Enhancement (min-width: 768px)**: 3-column statistics grid, 2-column task grid, visible top header navigation links, and desktop CTA buttons.
- **Desktop Enhancement (min-width: 1024px)**: Centered maximum container width (`1200px`), balanced header actions, and aligned filter headers.

---

## Accessibility

- **Semantic HTML**: Heading hierarchy (`<h1>` -> `<h2>` -> `<h3>`) and landmark navigation regions (`aria-label`).
- **Keyboard Navigation**: Full keyboard accessibility (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>, <kbd>Esc</kbd>) with explicit focus rings (`outline: 2px solid var(--color-primary)`).
- **Form Labels**: Every input field in the Add Task dialog uses explicit `<label>` bindings and an `aria-live="polite"` error container.
- **Status Communication**: Task statuses are communicated through clear visible text badges (*To Do*, *In Progress*, *Completed*, *Overdue*), never by color alone.

---

## Project Structure

```text
interntrack/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── assets/
│   ├── icons/
│   └── images/
│       └── interntrack-logo.png
└── README.md
```

---

## Running Locally

InternTrack is built entirely with native web platform technologies and requires no build tools, npm packages, or bundlers. It is suitable for static GitHub Pages hosting.

1. Clone or download this repository.
2. Open `index.html` directly in any modern web browser.
3. Alternatively, serve the project root using any static HTTP server:
   ```bash
   npx http-server interntrack -p 8085
   ```
4. Access the application at `http://localhost:8085`.

---

## Screenshots

### Desktop View
*[Desktop Dashboard Screenshot Placeholder]*

### Mobile View
*[Mobile Dashboard Screenshot Placeholder]*

---

## What I Learned

- Designing robust mobile-first responsive interfaces using vanilla CSS custom properties, Flexbox, and CSS Grid.
- Implementing state management, event delegation, and DOM rendering in pure Vanilla JavaScript.
- Managing client-side data persistence safely with `localStorage`.
- Building accessible dialogs and interactive components following WCAG accessibility guidelines.
- Structuring clean, maintainable web applications without relying on external frameworks or libraries.

---

## Author

**Nayab Usama**

---

## Internship

**DecodeLabs — Full Stack Development Internship, Project 1**

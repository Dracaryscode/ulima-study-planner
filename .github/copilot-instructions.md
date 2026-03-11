**Overview**
- **Project type:**: React app scaffolded with Vite and TailwindCSS. Main entry is `src/main.jsx` and root component is `src/App.jsx`.
- **Purpose:**: Visual curriculum planner. Courses live in `src/data/courses.js` and UI is componentized under `src/components/`.

**How to run**
- **Dev:**: `npm run dev` (starts Vite with HMR).
- **Build:**: `npm run build`.
- **Preview:**: `npm run preview` (serves the built app).
- **Lint:**: `npm run lint` (ESLint configured in project root).

**High-level architecture / important files**
- **`src/data/courses.js`**: Single source of truth for course objects. Each course is an object: `{ id, name, level, credits, reqs }`. Update here to add/remove curriculum items.
- **`src/utils/helpers.js`**: Small pure helpers used across the app. Example exports: `getCourseStatus(course, completedSet, plannedSet)` and `getLevelCourses(level)`.
- **`src/App.jsx`**: Orchestrates state: `completed` and `planned` (both `Set`s), computes `plannedCredits`, and draws SVG dependency lines using DOM IDs. Key behaviors (refer directly to file for details):
  - Uses `containerRef` and DOM elements with ids `course-<id>` to compute SVG paths between courses.
  - Credit limit: max planned credits 27 (user alert triggered in `toggleCourse`).
  - Rerenders SVG lines on window `resize` and when `completed`, `planned`, or `hoveredCourse` change.
- **`src/components/CourseCard.jsx`**: Presentational component that accepts props `{ course, status, isHovered, onToggle, onMouseEnter, onMouseLeave }`.
  - Status values used across the app: `'completed'`, `'planned'`, `'available'`, `'locked'`.
  - The component uses DOM id `id={`course-${course.id}`}` — keep this pattern if you change the markup so line drawing continues to work.
- **`src/components/Icons.jsx`**: Small icon components used by `CourseCard` (imported as named exports like `Check`, `Lock`, `Unlock`).

**Conventions and patterns to follow**
- **State shape:**: `completed` and `planned` are JavaScript `Set` objects (not arrays). Tests and components expect `.has()`, `.add()`, and `.delete()` semantics.
- **DOM id pattern for courses:**: `course-<id>` is relied upon by `App.jsx` to compute positions for SVG curves — do not change without updating line-calculation logic.
- **Course prerequisites:**: `reqs` is an array of `id` strings. The app assumes IDs are unique and uses them to find dependents (e.g., `COURSES.filter(c => c.reqs.includes(curr))`).
- **Styling:**: Tailwind utility classes are used everywhere (no CSS-in-JS). Global styles live in `src/index.css` and `src/App.css`.

**Tooling & config gotchas**
- **Tailwind:**: `tailwind.config.js` currently has `content: []`. This means Tailwind's purge/scan won't pick up classes unless the content array is populated. Recommended content globs to add when editing components: `./index.html`, `./src/**/*.{js,jsx,ts,tsx}`.
- **Vite plugins:**: `vite.config.js` loads `@vitejs/plugin-react` and `@tailwindcss/vite`. Keep plugin list in sync if you change build tooling.
- **ESLint:**: Run `npm run lint`. Project uses `@eslint/js` and `eslint-plugin-react-hooks`.

**Integration points and mutable data**
- **Data source:**: `src/data/courses.js` is in-repo JSON-like data — there's no external API. Any persistent changes should be implemented separately; for prototyping update the file directly.
- **SVG lines:**: All edge rendering is computed client-side in `App.jsx` from DOM metrics. Component refactor or virtualization must preserve an API to provide element positions for line drawing.

**Small code examples**
- Determine course status: see `src/utils/helpers.js` — returns one of `completed|planned|available|locked`.
- CourseCard usage (from `src/App.jsx`):
  ```jsx
  <CourseCard
    key={course.id}
    course={course}
    status={getCourseStatus(course, completed, planned)}
    isHovered={hoveredCourse === course.id}
    onToggle={toggleCourse}
  />
  ```

**Where to look when changing behavior**
- If changing click/hover semantics, update `toggleCourse` in `src/App.jsx` and preserve credit-limit logic.
- If changing visuals or adding new classes, update `tailwind.config.js` `content` globs so classes are included in the build.
- If you change the course id format (e.g. numeric -> uuid), update `COURSES` entries and any logic that builds DOM ids (`course-<id>` usage in `CourseCard.jsx` and `App.jsx`).

**Files of interest (quick list)**
- `package.json`, `vite.config.js`, `postcss.config.js`, `tailwind.config.js`
- `src/main.jsx`, `src/App.jsx`, `src/index.css`, `src/App.css`
- `src/components/CourseCard.jsx`, `src/components/Icons.jsx`
- `src/data/courses.js`, `src/utils/helpers.js`

If anything here is unclear or you want me to include automated tests, CI suggestions, or expand examples (e.g. how to add a new course programmatically), tell me which area to expand and I'll update this file.

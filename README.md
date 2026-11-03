# Ecommerce

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Estructura del Proyecto (por ahora)

src/
├── app/
│ ├── core/ # Core singleton services
│ │ ├── auth.service.ts # Login/logout state & token
│ │ ├── cart.service.ts # Cart state (add/remove/quantity)
│ │ └── http.service.ts # HTTP client for external API
│ │
│ ├── shared/ # Atoms & Molecules (reusable UI)
│ │ ├── atoms/ # Basic UI elements
│ │ │ ├── button.component.ts
│ │ │ ├── input.component.ts
│ │ │ ├── loader.component.ts
│ │ │ └── image-preview.component.ts
│ │ │
│ │ ├── molecules/ # Small groups of atoms
│ │ │ ├── product-card.component.ts
│ │ │ ├── search-bar.component.ts
│ │ │ └── filter-chip.component.ts
│ │ │
│ │ └── organisms/ # Complex UI sections
│ │ ├── product-grid.component.ts
│ │ └── category-nav.component.ts
│ │
│ ├── features/ # Feature-based organization
│ │ ├── home/ # Home page template
│ │ │ └── home.component.ts
│ │ │
│ │ ├── products/ # Products feature
│ │ │ ├── components/ # Product organisms
│ │ │ │ ├── product-list.component.ts
│ │ │ │ └── infinite-scroll.component.ts
│ │ │ │
│ │ │ ├── containers/ # Page-level components
│ │ │ │ ├── product-list.component.ts
│ │ │ │ └── product-detail.component.ts
│ │ │ │
│ │ │ └── product.routes.ts
│ │ │
│ │ ├── cart/ # Cart feature
│ │ │ ├── cart-summary.component.ts
│ │ │ ├── cart-item.component.ts
│ │ │ └── checkout-form.component.ts
│ │ │
│ │ └── auth/ # Auth feature
│ │ ├── login.component.ts
│ │ └── register.component.ts
│ │
│ ├── layouts/ # Templates/Layouts
│ │ ├── home/ # Home page layout
│ │ │ └── home-layout.component.ts
│ │ │
│ │ └── product/ # Product category layout
│ │ └── product-layout.component.ts
│ │
│ ├── app.config.ts # Angular config with providers
│ ├── app.routes.ts # Feature routing
│ └── main.ts
│
└── environments/ # Environment configs (dev/prod)

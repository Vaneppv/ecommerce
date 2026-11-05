# Guía de contribución

Este documento explica cómo está organizado el proyecto, qué convenciones seguir,
cómo probar los cambios y qué tareas quedan pendientes.

> `main` es la fuente de verdad. Si cambias la arquitectura, las convenciones o
> los comandos, actualiza este archivo en el mismo pull request.

## 1. Requisitos previos

- **Node.js** `^22.22.3`, `^24.15.0` o `>=26.0.0`.
- **npm** 8 o superior.
- **Git** para el control de versiones.
- Un editor con soporte para TypeScript y Angular. Se recomienda la extensión _Angular Language Service_ y Prettier.

No es necesario instalar Angular CLI globalmente: todos los comandos se ejecutan
a través de los scripts de `package.json` o con `npx`.

### Gestor de paquetes

El proyecto usa **npm o pnpm**. Aunque se haya configurado en `angular.json`
npm, sientete libre de usar el que gustes.

## 2. Puesta en marcha

```bash
git clone <url-del-repositorio>
cd ecomVane
npm install
npm start
```

Abre `http://localhost:4200/`. El servidor recarga automáticamente al modificar archivos.

## 3. Stack y herramientas

| Herramienta             | Uso en el proyecto                                              |
| ----------------------- | --------------------------------------------------------------- |
| Angular 22.2            | Framework principal, componentes standalone, routing y signals. |
| TypeScript 6            | Tipado estático y modelos del dominio.                          |
| RxJS 7.8                | Peticiones HTTP y composición de flujos asíncronos.             |
| `@tabler/icons-angular` | Iconografía de la interfaz.                                     |
| Vitest 5 + jsdom        | Tests unitarios.                                                |
| Prettier 3              | Formato uniforme de TypeScript, HTML, CSS, JSON y Markdown.     |

No hay librería de estado global (NgRx, Akita, etc.) ni backend propio.
El estado del carrito vive en un servicio con signals y se persiste por usuario
en `localStorage`. La sesión activa también vive en `localStorage`.

## 4. Arquitectura

### 4.1 Visión general

Ecommerce es una SPA de Angular con componentes standalone:

- `src/main.ts` arranca la aplicación con `bootstrapApplication`.
- `src/app/app.config.ts` registra los providers globales: router, `HttpClient`,
  manejo global de errores e iconos de Tabler.
- `src/app/app.ts` es el shell: barra superior con acceso al carrito y
  `<router-outlet />`.
- `src/app/app.routes.ts` define las rutas y carga las páginas de forma
  perezosa con `loadComponent`.
- Las páginas de `features/` orquestan componentes reutilizables de `components/`
  y servicios de `core/`.

### 4.2 Estructura de carpetas

```text
src/
├── app/
│   ├── components/
│   │   ├── atoms/                 # Piezas de UI
│   │   │   ├── alert/
│   │   │   ├── button/
│   │   │   ├── cart-badge/
│   │   │   ├── category-chip/
│   │   │   ├── image/
│   │   │   └── input/
│   │   ├── molecules/             # Combinaciones de átomos
│   │   │   ├── category-filter/
│   │   │   ├── confirm-dialog/
│   │   │   ├── product-card/
│   │   │   └── search-form/
│   │   └── organisms/             # Secciones complejas
│   │       └── product-grid/
│   ├── core/
│   │   ├── data/
│   │   │   └── products.mock.ts   # Datos de respaldo
│   │   ├── models/
│   │   │   ├── cart.model.ts
│   │   │   ├── product-page.model.ts
│   │   │   └── product.model.ts
│   │   ├── auth.guard.ts
│   │   ├── auth.service.ts
│   │   ├── cart-access.service.ts
│   │   ├── cart.service.ts
│   │   └── product-service.ts
│   ├── directives/
│   │   └── infinite-scroll.ts
│   ├── features/
│   │   ├── auth/
│   │   │   └── login/             # Página de inicio de sesión
│   │   ├── cart/                  # Página del carrito
│   │   ├── not-found/             # Página 404 para rutas inexistentes
│   │   └── products/
│   │       ├── catalog/           # Página del catálogo
│   │       └── detail/            # Página de detalle
│   ├── app.config.ts
│   ├── app.routes.ts
│   ├── app.ts
│   ├── app.html
│   ├── app.css
│   └── app.spec.ts
├── index.html
├── main.ts
└── styles.css
```

Cada componente vive en su propia carpeta con archivos `.ts`, `.html`, `.css` y,
cuando existe, `.spec.ts`. No todos los componentes tienen test todavía; revisa
la sección de [testing](#6-testing).

### 4.3 Responsabilidades por capa

| Ubicación               | Responsabilidad                                                            |
| ----------------------- | -------------------------------------------------------------------------- |
| `core/`                 | Servicios singleton, modelos y datos de respaldo. No contiene componentes. |
| `components/atoms/`     | UI mínima reutilizable. Sin lógica de negocio ni llamadas HTTP.            |
| `components/molecules/` | Agrupan átomos para cumplir una función concreta.                          |
| `components/organisms/` | Secciones complejas que combinan moléculas.                                |
| `features/`             | Páginas y lógica de cada funcionalidad. Orquestan servicios y componentes. |
| `directives/`           | Comportamiento reutilizable sobre el DOM.                                  |
| `app.config.ts`         | Providers globales de la aplicación.                                       |
| `app.routes.ts`         | Definición y carga perezosa de rutas.                                      |

Reglas prácticas:

- Un átomo no debe inyectar `ProductService` ni `CartService`.
- Un componente reutilizable no debe importar nada de `features/`.
- La lógica de negocio y el acceso a datos van en servicios de `core/`.
- Las páginas de `features/` no deben contener lógica de UI que pueda extraerse
  a un componente reutilizable.

### 4.4 Rutas actuales

| Ruta            | Componente      | Descripción                                    |
| --------------- | --------------- | ---------------------------------------------- |
| `/`             | `Home`          | Página de inicio con productos populares.      |
| `/products`     | `Catalog`       | Catálogo con búsqueda y filtros.               |
| `/products/:id` | `ProductDetail` | Detalle de un producto.                        |
| `/cart`         | `Cart`          | Carrito y resumen del pedido. Requiere sesión. |
| `/login`        | `Login`         | Inicio de sesión y creación de cuentas.        |
| `/not-found`    | `NotFound`      | Página de error 404 explícita.                 |
| `**`            | `NotFound`      | Página de error para rutas inexistentes.       |

Todas las páginas se cargan de forma perezosa. Si agregas una ruta nueva, sigue
el mismo patrón de `loadComponent`. La ruta `/cart` usa `authGuard`: si no hay
sesión, redirige a `/login` con `returnUrl` y `reason=cart`.

### 4.5 Flujo de datos

**Catálogo**

1. `Catalog` carga las categorías y la primera página al crearse.
2. `loadMore()` calcula el `skip` según los productos ya cargados y llama a `ProductService.getPage()`.
3. El servicio consulta DummyJSON o devuelve datos locales si hay error.
4. `Catalog` agrega los productos y actualiza el total.
5. `ProductGrid` renderiza las tarjetas y, mediante `InfiniteScroll`, emite `onLoadMore` cuando el centinela entra en pantalla.
6. Al buscar o cambiar de categoría, `Catalog` cancela la petición en curso, limpia la lista y vuelve a cargar desde `skip = 0`.

**Detalle**

1. `ProductDetail` escucha `paramMap` y obtiene el `id`.
2. Llama a `ProductService.getProductById()`.
3. Gestiona los estados `loading`, `error` y `product`.
4. Permite ajustar la cantidad dentro del stock y agrega al carrito.

**Carrito**

1. `CartService` mantiene un mapa de carritos por correo de usuario y lo persiste en `localStorage` con la clave `ecommerce_carts`.
2. `owner` se deriva del usuario activo (`AuthService`); sin sesión vale `null` y el carrito visible queda vacío.
3. `items` es un `computed` del carrito del propietario actual. `totalCount`, `subtotal`, `shipping` y `total` también son `computed`.
4. `addItem`, `removeItem`, `updateQuantity` y `clearCart` solo modifican el carrito del usuario activo; sin sesión no hacen nada.
5. `Home`, `Catalog` y `ProductDetail` usan `CartAccessService.add()`: si no hay sesión, redirigen a `/login?returnUrl=...&reason=cart`; si la hay, agregan el producto.
6. El carrito antiguo con la clave `ecommerce_cart` se migra automáticamente al primer usuario autenticado.

### 4.6 Modelos

| Modelo        | Archivo                             | Uso                                                           |
| ------------- | ----------------------------------- | ------------------------------------------------------------- |
| `Product`     | `core/models/product.model.ts`      | Producto completo, alineado con la respuesta de DummyJSON.    |
| `ProductPage` | `core/models/product-page.model.ts` | Página de productos: `products`, `total`, `skip`, `limit`.    |
| `CartItem`    | `core/models/cart.model.ts`         | Producto + cantidad dentro del carrito.                       |
| `CartSummary` | `core/models/cart.model.ts`         | Resumen tipado de totales (no se usa todavía en componentes). |

`Product` extiende `BaseProduct` e incluye campos como `stock`, `brand`, `sku`,
`dimensions`, `reviews`, `images` y `meta`. Si la API cambia, actualiza el
modelo y los mocks en el mismo cambio.

### 4.7 Servicios

#### `ProductService`

Archivo: `src/app/core/product-service.ts`.

- URL base: `https://dummyjson.com/products`.
- Latencia simulada: 300 ms para que los estados de carga sean visibles.
- `getPage(skip, limit, category, search)`:
  - sin búsqueda ni categoría → `/products?skip=&limit=`;
  - solo búsqueda → `/products/search?q=&skip=&limit=`;
  - solo categoría → `/products/category/{categoria}?skip=&limit=`;
  - búsqueda + categoría → descarga la categoría con `limit=0` y filtra/pagina en el cliente,
    porque DummyJSON no ofrece un endpoint combinado.
- `getProductById(id)` → `/products/{id}`.
- `getCategories()` → `/products/category-list`.
- Todos los métodos usan `catchError` y caen en los datos de `products.mock.ts`
  cuando la API falla.

#### `CartService`

Archivo: `src/app/core/cart.service.ts`.

- `owner`: `computed` con el correo normalizado del usuario activo o `null`.
- `items`: `computed` con el carrito del propietario actual. Sin sesión devuelve `[]`.
- `addItem(product, quantity = 1)`: agrega o incrementa en el carrito del usuario
  activo; ignora cantidades menores o iguales a cero y no hace nada sin sesión.
- `removeItem(productId)`: elimina el producto del carrito activo.
- `updateQuantity(productId, quantity)`: actualiza; si la cantidad es cero o menor,
  elimina.
- `clearCart()`: vacía el carrito del usuario activo.
- Regla de envío: gratis desde $50 de subtotal; en caso contrario $5.99; carrito
  vacío = $0.
- Persistencia tolerante a errores de `localStorage` bajo la clave
  `ecommerce_carts`, con la forma `{ "correo@ejemplo.com": [CartItem, ...] }`.
- Migra el antiguo `ecommerce_cart` al primer usuario autenticado.

La validación de stock se hace en la UI del detalle y del carrito. Si se
centraliza en el servicio, hay que actualizar los tests y revisar los componentes
que ya limitan la cantidad.

#### `CartAccessService`

Archivo: `src/app/core/cart-access.service.ts`.

- `add(product, quantity = 1)`: si hay sesión, delega en `CartService.addItem()` y
  devuelve `true`; si no, navega a `/login` con `returnUrl` y `reason=cart`, y
  devuelve `false`.
- Centraliza la regla de negocio para que `Home`, `Catalog` y `ProductDetail` no
  dupliquen la comprobación de sesión.

#### `AuthService`

Archivo: `src/app/core/auth.service.ts`.

- `user`: signal con el usuario activo o `null`.
- `isLoggedIn`: `computed` que verifica si `user() !== null`.
- `getAccounts()`: devuelve la lista combinada de cuentas predeterminadas (`demo@tienda.com`) y las cuentas registradas en `localStorage` con la clave `ecommerce_accounts`.
- `register(name, email, password)`: valida unicidad de correo, persiste la nueva cuenta en `localStorage` e inicia sesión automáticamente.
- `login(email, password)`: valida credenciales contra las cuentas disponibles y persiste la sesión activa en `localStorage` con la clave `ecommerce_user`.
- `logout()`: limpia la sesión activa en memoria y en `localStorage`, preservando las cuentas registradas.

### 4.8 Estado y reactividad

- Usa `signal()` para estado local mutable y `computed()` para valores derivados.
- No dupliques estado derivado: si se puede calcular con `computed`, no lo guardes en otro signal.
- Usa RxJS para HTTP y composición de flujos; no lo uses para estado local simple.
- Las suscripciones en componentes deben liberarse. `Catalog` cancela manualmente la petición al reiniciar la lista; en código nuevo se recomienda `takeUntilDestroyed` o el pipe `async`.
- No agregues una librería de estado global sin discutirlo primero.

## 5. Convenciones de código

### 5.1 Archivos y nombres

- Componentes: una carpeta por componente con `nombre.ts`, `nombre.html`, `nombre.css` y `nombre.spec.ts`.
- Clases de componentes sin sufijo `Component`: `Catalog`, `ProductDetail`, `Cart`, `Button`.
- Selectores con prefijo `app-`: `app-product-card`, `app-search-form`.
- Servicios: `nombre.service.ts` (ejemplo: `cart.service.ts`). Nota: el servicio de productos actualmente se llama `product-service.ts`; si se renombra, hazlo en un cambio dedicado.
- Modelos: `nombre.model.ts` dentro de `core/models/`.
- Directivas: `nombre.ts` dentro de `directives/`, clase en PascalCase (`InfiniteScroll`).
- Datos de respaldo: `nombre.mock.ts` dentro de `core/data/`.
- Tests: junto al archivo probado, con sufijo `.spec.ts`.

### 5.2 Componentes Angular

- Todos los componentes son **standalone**; no se usan NgModules.
- Declara explícitamente los imports que usa cada componente.
- Usa las APIs modernas de Angular:
  - `input()` y `input.required()` para entradas;
  - `output()` para eventos;
  - `signal()` y `computed()` para estado;
  - `inject()` para dependencias.
- Expón al template solo lo necesario, normalmente con `protected readonly`.
- Usa el control de flujo integrado: `@if`, `@for` con `track` y `@let`. No agregues `*ngIf` ni `*ngFor` en código nuevo.
- Mantén el HTML en `templateUrl` y los estilos en `styleUrl`; evita templates o estilos inline extensos.
- No accedas al DOM directamente salvo en directivas justificadas. Para el foco se puede usar `ElementRef` o APIs del navegador desde el componente cuando sea necesario.

### 5.3 TypeScript

- Tipa modelos, parámetros y retornos. Evita `any`; si es inevitable, acota el alcance y coméntalo.
- El proyecto tiene activas comprobaciones como `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noPropertyAccessFromIndexSignature`, `strictInjectionParameters` y `strictInputAccessModifiers`.
- Maneja `null` y `undefined` de forma explícita.
- No dejes `console.log` en el código entregado.
- Prefiere funciones pequeñas y nombres descriptivos en inglés para el código.

### 5.4 Estilos

- Cada componente tiene su propio CSS.
- Los tokens globales (colores, tipografías) están en `src/styles.css` como variables CSS.
  Reutilízalos en lugar de repetir valores.
- Mantén el diseño responsive; ya existen media queries en el shell, catálogo, detalle, carrito y filtros.
- Usa clases descriptivas y evita estilos inline.
- No reformatees CSS ajeno sin motivo: Prettier se encarga del formato.

### 5.5 Accesibilidad

- Usa HTML semántico (`header`, `main`, `nav`, `section`, `article`, `button`).
- Todo control interactivo debe ser accesible por teclado.
- Usa `aria-label`, `aria-describedby`, `aria-invalid`, `role="status"` y `role="alert"` cuando corresponda.
- Las imágenes deben tener un `alt` significativo; si son decorativas, usa `alt=""`.
- No elimines etiquetas, roles ni mensajes de error existentes al refactorizar.

### 5.6 Imágenes

Usa siempre el átomo `app-image` en lugar de `<img>` directo:

```html
<app-image [src]="product.thumbnail" [alt]="product.title" [loading]="true" />
```

- `loading = true` (por defecto) usa carga diferida y muestra un skeleton.
- `loading = false` usa carga inmediata; se usa en el detalle, que está sobre el pliegue.
- El átomo maneja errores y muestra una imagen de respaldo automáticamente.

### 5.7 Iconos

Los iconos se registran globalmente en `src/app/app.config.ts` con `provideTablerIcons`. Para usar uno:

```html
<tabler-icon icon="shopping-cart" [size]="18" />
```

Si el icono no aparece, revisa que esté importado y registrado en `app.config.ts`. No importes iconos sueltos dentro de cada componente salvo que exista una razón concreta.

### 5.9 Formato

El proyecto usa Prettier con esta configuración principal:

- ancho de línea: 100;
- indentación: 2 espacios;
- comillas simples en TypeScript;
- comas finales;
- saltos de línea `LF`;
- parser de Angular para HTML.

Antes de entregar cambios:

```bash
npm run format
npm run format:check
```

No ajustes manualmente el formato para que coincida con Prettier: ejecuta la herramienta.

## 6. Testing

Los tests usan **Vitest** con **jsdom** y se ejecutan con el builder de Angular:

```bash
npm test
npm test -- --watch=false
npm test -- --filter=Cart
```

### Convenciones

- Cada test vive junto al archivo que prueba (`*.spec.ts`).
- Los tests usan las funciones globales `describe`, `it`, `expect` y `vi` (configuradas en `tsconfig.spec.json`).
- Usa `TestBed` para configurar el entorno.
- Para componentes que usan iconos, registra los iconos necesarios con `provideTablerIcons`; de lo contrario el test puede fallar al renderizar.
- Para componentes con rutas, provee `provideRouter([])`.
- Limpia `localStorage` en `beforeEach` cuando el test use `CartService`.
- Usa mocks de servicios con `vi.fn()` y `of()`/`throwError()` para aislar el componente.
- Para `ProductService`, usa `provideHttpClient()` + `provideHttpClientTesting()` y verifica las peticiones con `HttpTestingController`.

Ejemplo de configuración:

```ts
TestBed.configureTestingModule({
  imports: [Catalog],
  providers: [provideRouter([]), provideTablerIcons({ IconShoppingCart })],
});
```

### Qué probar

- Lógica de servicios: cálculos, persistencia, fallback y manejo de errores.
- Componentes: renderizado de estados de carga, error, vacío y datos.
- Acciones principales: buscar, filtrar, agregar al carrito, cambiar cantidades y vaciar.
- Formularios: campos obligatorios, formatos inválidos y envío exitoso (cuando se implemente checkout).

### Commits

Sigue el formato `tipo(scope): descripción`, por ejemplo:

```text
feat(cart): agregar persistencia en localStorage
fix(catalog): cancelar petición al cambiar de filtro
docs: documentar arquitectura y convenciones
```

Tipos habituales: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `style`.

## 7. Solución de problemas

### `EBADENGINE` o errores al instalar

Verifica la versión de Node:

```bash
node --version
```

Debe cumplir `^22.22.3`, `^24.15.0` o `>=26.0.0`. Si usas nvm, cambia a una versión compatible y vuelve a ejecutar `npm install` (o `npm ci`).

### `ng: command not found`

No instales Angular CLI global. Usa los scripts:

```bash
npm start
npm run build
npx ng <comando>
```

### El puerto 4200 está ocupado

```bash
npm start -- --port 4300
```

### La API no responde

Es el comportamiento esperado: `ProductService` usa los datos de `products.mock.ts`. Si necesitas probar el fallback manualmente, bloquea las peticiones a `dummyjson.com` desde las DevTools o desconéctate de la red.

### Un icono no aparece

Agrega el icono en `provideTablerIcons` dentro de `app.config.ts` y revisa que el nombre coincida con el que usas en el template.

### Una imagen no carga

`app-image` muestra una imagen de respaldo automáticamente. Revisa que la URL sea válida y que el `alt` describa el contenido.

### Los tests fallan por `localStorage`

Limpia el almacenamiento antes de cada test:

```ts
beforeEach(() => {
  localStorage.clear();
});
```

### Los tests quedan en modo watch

Ejecuta:

```bash
npm test -- --watch=false
```

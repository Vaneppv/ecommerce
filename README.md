# Ecommerce

Aplicación frontend de comercio electrónico desarrollada con Angular 22. Permite
explorar un catálogo de productos, buscar y filtrar por categoría, ver el detalle
de cada producto y gestionar un carrito de compras por usuario.

El proyecto es únicamente frontend: consume la API pública de
[DummyJSON](https://dummyjson.com/) y utiliza datos locales como respaldo cuando
la API no está disponible.

## Funcionalidades

- Catálogo con scroll infinito y carga progresiva de imágenes.
- Búsqueda por nombre o descripción.
- Filtros por categoría.
- Vista de detalle de producto.
- Registro e inicio de sesión de usuarios.
- Carrito con agregar, quitar, cambiar cantidades y vaciar.
- Cálculo automático de subtotal, envío y total.
- Carrito independiente por usuario, persistido en `localStorage`.
- Acceso al carrito y a la acción de agregar protegidos por sesión.
- Interfaz responsive y componentes reutilizables.

## Stack

- Angular 22
- TypeScript
- RxJS
- Tabler Icons
- Vitest + jsdom
- Prettier

## Requisitos

- Node.js `^22.22.3`, `^24.15.0` o `>=26.0.0`
- npm 8 o superior
- Navegador moderno

No es necesario instalar Angular CLI globalmente: los scripts usan la versión local del proyecto.

## Instalación y ejecución

En un directorio de tu preferencia, clona el repositorio:

```bash
git clone git@github.com:Vaneppv/ecommerce.git
cd ecommerce
npm install
npm start
```

Por defecto, la aplicación estará disponible en `http://localhost:4200/`.

Para una instalación reproducible en CI o en una máquina limpia:

```bash
npm ci
```

## Scripts

| Comando                | Descripción                                 |
| ---------------------- | ------------------------------------------- |
| `npm start`            | Inicia el servidor de desarrollo.           |
| `npm run build`        | Genera el build de producción en `dist/`.   |
| `npm test`             | Ejecuta los tests con Vitest.               |
| `npm run format`       | Formatea el código con Prettier.            |
| `npm run format:check` | Verifica el formato sin modificar archivos. |

## Datos

La aplicación consume los endpoints de `https://dummyjson.com/products`. Si la
API falla o no hay conexión, `ProductService` usa automáticamente los productos
de `src/app/core/data/products.mock.ts`, por lo que la tienda sigue siendo
navegable.

Las cuentas y los carritos se guardan en el `localStorage` del navegador con las
claves `ecommerce_accounts`, `ecommerce_user` y `ecommerce_carts`. Cada usuario
tiene su propio carrito, pero no se sincroniza entre dispositivos ni entre
navegadores. Las contraseñas también viven en `localStorage`, así que este
mecanismo es solo para desarrollo y no debe usarse en producción.

## Documentación para colaboradores

La arquitectura, estructura de carpetas, convenciones de código, estrategia de
testing, flujo de Git y tareas pendientes están documentados en
[CONTRIBUTING.md](./CONTRIBUTING.md).

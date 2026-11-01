import { Product } from '../models/product';

const CATALOG: Record<string, string[]> = {
  electrónica: [
    'Auriculares inalámbricos', 'Teclado mecánico', 'Ratón ergonómico', 'Cargador rápido USB-C',
    'Altavoz portátil', 'Cámara web HD', 'Monitor de 24 pulgadas', 'Disco SSD de 1 TB',
    'Batería externa', 'Smartwatch deportivo', 'Tableta gráfica', 'Lámpara LED de escritorio',
  ],
  hogar: [
    'Cafetera de goteo', 'Juego de sábanas', 'Sartén antiadherente', 'Aspiradora compacta',
    'Set de toallas', 'Olla a presión', 'Difusor de aromas', 'Organizador de cocina',
    'Cojín decorativo', 'Hervidor eléctrico', 'Reloj de pared', 'Alfombra suave',
  ],
  ropa: [
    'Camiseta de algodón', 'Sudadera con capucha', 'Jeans clásicos', 'Chaqueta ligera',
    'Zapatillas urbanas', 'Gorra deportiva', 'Bufanda de lana', 'Calcetines térmicos',
    'Vestido de verano', 'Camisa de lino', 'Mochila urbana', 'Cinturón de cuero',
  ],
  deportes: [
    'Balón de fútbol', 'Colchoneta de yoga', 'Pesas ajustables', 'Cuerda de saltar',
    'Botella térmica', 'Bicicleta estática', 'Guantes de entrenamiento', 'Banda elástica',
    'Raqueta de tenis', 'Casco de ciclismo', 'Reloj de running', 'Bolsa deportiva',
  ],
};

function buildProducts(): Product[] {
  const categories = Object.keys(CATALOG);
  const products: Product[] = [];
  const perCategory = CATALOG[categories[0]].length;
  let id = 1;

  for (let i = 0; i < perCategory; i++) {
    for (const category of categories) {
      const title = CATALOG[category][i];
      products.push({
        id,
        title,
        description: `${title}. Producto de la categoría ${category}.`,
        category,
        price: 10 + ((id * 37) % 90) + 0.99,
        rating: Math.round((3.5 + (id % 15) / 10) * 10) / 10,
        thumbnail: `https://picsum.photos/seed/tienda-${id}/300/300`,
      });
      id++;
    }
  }
  return products;
}

export const PRODUCTS: Product[] = buildProducts();

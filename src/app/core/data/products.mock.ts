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
        discountPercentage: 0,
        rating: Math.round((3.5 + (id % 15) / 10) * 10) / 10,
        stock: 5 + (id % 50),
        tags: [category],
        brand: 'Brand ' + category,
        sku: 'SKU-'.concat(id.toString()),
        weight: 2,
        dimensions: {
          width: 23.17,
          height: 14.43,
          depth: 28.01,
        },
        warrantyInformation: '1 month warranty',
        shippingInformation: 'Ships in 1 month',
        availabilityStatus: 'In Stock',
        reviews: [
          {
            rating: 5,
            comment: 'Very satisfied!',
            date: '2024-05-23T08:56:21.618Z',
            reviewerName: 'John Doe',
            reviewerEmail: 'john.doe@x.dummyjson.com',
          },
        ],
        returnPolicy: '30 days return policy',
        minimumOrderQuantity: 1,
        meta: {
          createdAt: '2024-05-23T08:56:21.618Z',
          updatedAt: '2024-05-23T08:56:21.618Z',
          barcode: '9164035109868',
          qrCode: '...',
        },
        thumbnail: 'https://picsum.photos/seed/tienda-' + id + '/300/300',
        images: [
          'https://picsum.photos/seed/tienda-' + id + '/600/600',
          'https://picsum.photos/seed/tienda-' + id + '/800/400',
          'https://picsum.photos/seed/tienda-' + id + '/1000/500',
        ],
      });
      id++;
    }
  }
  return products;
}

export const PRODUCTS: Product[] = buildProducts();
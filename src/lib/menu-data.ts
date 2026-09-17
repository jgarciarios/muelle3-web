// Contenido real extraído de "Carta 2026.pdf" (entregada por el cliente el
// 16/09/2026). Por decisión ya tomada con Juani, la carta NO muestra precios
// en la web — se omiten a propósito, aunque el PDF original sí los tiene.
//
// Chef ejecutivo: Javier Carballo.

export type MenuItem = {
  nombre: string;
  descripcion?: string;
};

export type MenuCategoria = {
  id: string;
  titulo: string;
  items: MenuItem[];
  nota?: string;
};

export const MENU: MenuCategoria[] = [
  {
    id: "entradas",
    titulo: "Entradas",
    items: [
      {
        nombre: "Rabas del club",
        descripcion: "Aros de calamar rebozados, servidos con salsa tártara y limón.",
      },
      {
        nombre: "Fish and chips",
        descripcion: "Filetes de pescado local rebozados, acompañados de papas fritas y alioli casero.",
      },
      {
        nombre: "Tartar de atún rojo",
        descripcion:
          "Con cremoso de palta, mango, cebolla colorada, cilantro, mostaza, aceite de oliva y salsa inglesa.",
      },
      {
        nombre: "Provoleta al Josper",
        descripcion: "Fundida en horno Josper, servida con mermelada artesanal de pimientos confitados.",
      },
      {
        nombre: "Tortilla del Nene",
        descripcion: "Con huevos de campo y chutney de tomate y cayena.",
      },
      {
        nombre: "Mejillones a la provenzal",
        descripcion: "En su punto con un toque de aceite de oliva, ajo, perejil y Sauvignon blanc.",
      },
      {
        nombre: "Empanadas de cordero esteño",
        descripcion:
          "Artesanales fritas, de cordero esteño braseado por 8 horas en Tannat y hierbas aromáticas con un toque de chipotle.",
      },
      {
        nombre: "Buñuelos de espinaca fresca y queso parmesano",
        descripcion: "Servidos con dip de alioli casero y limón.",
      },
    ],
  },
  {
    id: "pizzas",
    titulo: "Pizzas",
    items: [
      { nombre: "Pizza margarita", descripcion: "Mozzarella, tomate fresco y albahaca." },
      {
        nombre: "Pizza la loca",
        descripcion: "Mozzarella, jamón serrano importado, champiñones y rúcula.",
      },
    ],
  },
  {
    id: "sandwiches",
    titulo: "Sandwiches",
    items: [
      {
        nombre: "Chivito de lomo",
        descripcion:
          "Lechuga, tomate, mayonesa, panceta crocante, jamón, queso y huevo al hierro. Servido con papas fritas.",
      },
      {
        nombre: "Burger 7",
        descripcion:
          "Dos hamburguesas de 100 g tipo smash, queso cheddar, panceta crispy, tomate, lechuga, pepinillos y salsa de la casa. Servida con papas fritas.",
      },
    ],
  },
  {
    id: "ensaladas",
    titulo: "Ensaladas",
    items: [
      {
        nombre: "Ensalada Muelle 3",
        descripcion:
          "Mix de verdes orgánicos, zanahoria, remolacha cocida, láminas de palta, naranja fresca, maní tostado, pera confitada y tomates cherry. Opción con huevo mollet.",
      },
      {
        nombre: "Caesar New Style",
        descripcion:
          "Crujiente mix de verdes, pollo grillado, panceta crocante, croutons de pan brioche, palta, queso parmesano y aderezo Caesar casero. Opción con langostinos grillados en lugar de pollo.",
      },
      {
        nombre: "Ensalada La Pastora",
        descripcion:
          "Verdes orgánicos seleccionados, queso brie, calabaza asada, remolacha, almendras fileteadas, semillas de calabaza, cebolla encurtida y vinagreta de aceto balsámico.",
      },
    ],
  },
  {
    id: "principales",
    titulo: "Principales",
    items: [
      {
        nombre: "Pesca Sol y Ríos",
        descripcion:
          "Pesca pacto oceánico del este. Consultar variedad del día. Acompañamiento a elección. Opción con salsa roquefort.",
      },
      {
        nombre: "Salmón Thai",
        descripcion:
          "Salmón del Pacífico a la plancha, servido sobre arroz basmati estilo oriental, mix de pimientos, soja y salsa sweet chilli.",
      },
      {
        nombre: "Fettuccine Gorriti",
        descripcion: "Crema de coco, curry, langostinos al hierro y pulpa de mejillones.",
      },
      {
        nombre: "Raviolones del Nono",
        descripcion:
          "Relleno caprese (albahaca, tomate y mozzarella vegana) y masa negra. Con salsa de tomate, tomates cherry confitados y almendras fileteadas. Apto para veganos.",
      },
      {
        nombre: "Risotto de hongos",
        descripcion:
          "Arroz cremoso con mix de champiñones y shiitake, infusionado en fondo de hongos secos.",
      },
      { nombre: "Pasta del día", descripcion: "Con crema trufada de hongos silvestres." },
      {
        nombre: "Costillar angus braseado",
        descripcion: "Braseado 6 horas, con puré de papas al aceite de trufas.",
      },
      {
        nombre: "Mila del Muelle",
        descripcion:
          "Milanesa de nalga empanada en panko. Servida con acompañamiento a elección. Opción napolitana.",
      },
      {
        nombre: "Bife ancho Carlos Páez Vilaró",
        descripcion: "Acompañamiento a elección. Opción con salsa de pimienta negra.",
      },
    ],
    nota: "Acompañamientos a elección: verduras asadas, puré de papas, puré de zanahoria con cebolla, papas fritas, ensalada Caesar o fettuccine en salsa Alfredo.",
  },
  {
    id: "postres",
    titulo: "Postres",
    items: [
      { nombre: "Volcán de dulce de leche", descripcion: "Con helado de crema americana." },
      {
        nombre: "Profiteroles rellenos",
        descripcion: "Con helado de crema americana y ganache de chocolate caliente.",
      },
      {
        nombre: "Mousse de chocolate belga",
        descripcion: "Con crumble de cacao, escamas de sal y aceite de oliva extra virgen Colinas de Garzón.",
      },
      { nombre: "Pavlova", descripcion: "Con crema de maracuyá y frutas frescas de estación." },
      {
        nombre: "Flan de dulce de leche",
        descripcion: "El clásico flan casero de dulce de leche, con crema batida y caramel pop.",
      },
      {
        nombre: "Helado artesanal — 2 bochas",
        descripcion: "Elaborado artesanalmente. Consultar sabores según temporada.",
      },
    ],
  },
  {
    id: "desayuno-tarde",
    titulo: "Desayuno & Tarde",
    items: [
      {
        nombre: "Avocado toast",
        descripcion: "Palta, tomates cherry, aceite de oliva. Opción con huevo mollet.",
      },
      { nombre: "Huevos revueltos", descripcion: "Con panceta, palta y tostada." },
      { nombre: "Tostado de jamón y queso" },
      { nombre: "Medialunas", descripcion: "Dulces y saladas." },
      { nombre: "Medialunas rellenas", descripcion: "De jamón y queso." },
      { nombre: "Carrot cake" },
      { nombre: "Brownie con helado de crema americana" },
    ],
  },
  {
    id: "cafeteria",
    titulo: "Cafetería",
    items: [
      { nombre: "Espresso" },
      { nombre: "Doble espresso" },
      { nombre: "Cortado" },
      { nombre: "Americano" },
      { nombre: "Cappuccino" },
      { nombre: "Latte" },
      { nombre: "Flat White" },
      { nombre: "Hot Chocolate" },
      { nombre: "Té" },
    ],
  },
  {
    id: "bebidas",
    titulo: "Bebidas & Cervezas",
    items: [
      { nombre: "Agua Salus 500ml", descripcion: "Con y sin gas." },
      { nombre: "Gaseosa 350ml", descripcion: "Línea Coca-Cola." },
      { nombre: "Red Bull" },
      { nombre: "Corona" },
      { nombre: "Patricia" },
      { nombre: "Stella Artois" },
      { nombre: "Cerveza sin alcohol" },
    ],
  },
  {
    id: "limonadas-detox",
    titulo: "Limonadas & Detox",
    items: [
      { nombre: "Limonada tradicional", descripcion: "Limón, agua y azúcar." },
      {
        nombre: "Limonada con sabores",
        descripcion: "Frutos rojos, menta y jengibre, maracuyá y menta, o pomelada.",
      },
      { nombre: "Lemon Bull", descripcion: "Limón, agua y Red Bull." },
      { nombre: "Detox #1", descripcion: "Pepino, manzana verde y espirulina." },
      { nombre: "Detox #2", descripcion: "Naranja, zanahoria, jengibre y cúrcuma." },
    ],
  },
  {
    id: "ponches",
    titulo: "Ponches",
    items: [
      { nombre: "Clericot", descripcion: "Vino blanco y frutas." },
      { nombre: "Clericot Rosé", descripcion: "Vino rosé y frutas." },
      { nombre: "Clericot Royal", descripcion: "Espumante y frutas." },
      { nombre: "Sangría", descripcion: "Vino tinto y frutas." },
      {
        nombre: "Tinto de verano",
        descripcion: "Vino tinto, refresco de limón, jugo de limón y jugo de naranja.",
      },
    ],
  },
  {
    id: "classic-cocktails",
    titulo: "Classic Cocktails",
    items: [
      { nombre: "Gin Tonic", descripcion: "Gin Beefeater, tónica, limón y pepino (opcional)." },
      { nombre: "Mojito", descripcion: "Ron blanco, jugo de limón, menta, syrup simple y soda." },
      { nombre: "Mojito Bull", descripcion: "Ron, Red Bull, lima, menta, azúcar y soda." },
      { nombre: "Negroni", descripcion: "Gin, Vermouth Rosso y Campari." },
      { nombre: "Aperol Spritz", descripcion: "Aperol, espumante y soda." },
      { nombre: "Ramazzotti Spritz", descripcion: "Ramazzotti, espumante, soda y naranja." },
      { nombre: "Pisco Sour", descripcion: "Pisco, lima, syrup simple y albúmina." },
      { nombre: "Caipiroska", descripcion: "Vodka Absolut, lima y azúcar." },
      { nombre: "Caipiroska saborizada", descripcion: "Maracuyá o frutos rojos." },
      {
        nombre: "Bloody Mary",
        descripcion: "Vodka, lima, jugo de tomate, sal, pimienta, tabasco y salsa inglesa.",
      },
      {
        nombre: "Tinto de Verano",
        descripcion: "Vino tinto, refresco de limón, jugo de limón y jugo de naranja.",
      },
      { nombre: "Fitzgerald", descripcion: "Gin Beefeater, syrup simple, jugo de limón y bitter angostura." },
      { nombre: "Clover Club", descripcion: "Gin Beefeater, jugo de limón, syrup de frambuesa y albúmina." },
      { nombre: "Moscow Mule", descripcion: "Vodka Absolut, syrup simple, jugo de limón, menta y espuma de jengibre." },
      { nombre: "Penicillin", descripcion: "Whisky infusionado en miel y jengibre, limón, miel y jengibre." },
      { nombre: "Maracujack", descripcion: "Jack Daniels, maracuyá, syrup simple y refresco citrus." },
      { nombre: "Carajillo", descripcion: "Licor 43 y café espresso." },
    ],
  },
  {
    id: "cocktails-de-autor",
    titulo: "Cocktails de Autor",
    items: [
      {
        nombre: "Muelle 3",
        descripcion:
          "Gin Beefeater, jugo de limón, syrup simple, albahaca, jugo de pomelo, vino blanco y romero.",
      },
      {
        nombre: "Isla Cocodrilo",
        descripcion:
          "Gin Beefeater, jugo de limón, syrup simple, jugo de manzana verde, soda y angostura.",
      },
      {
        nombre: "Mr. Chippy",
        descripcion: "Malibu, Cointreau, pulpa de mango, jugo de limón y albúmina.",
      },
      { nombre: "Nipa", descripcion: "Aperol, syrup de frambuesas, jugo de naranja y espumante." },
      {
        nombre: "Guara",
        descripcion: "Whisky Bourbon, Licor 43, Cointreau, maracuyá y espuma de jengibre.",
      },
      {
        nombre: "Monarca (sin alcohol)",
        descripcion: "Cerveza sin alcohol, jugo de limón, syrup de frambuesa, mango y espuma de jengibre.",
      },
      {
        nombre: "Adonaylo (sin alcohol)",
        descripcion:
          "Jugo de manzana verde, infusión cítrica y hierbabuena, enebro y soda.",
      },
    ],
  },
];

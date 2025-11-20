/* KOU COFE — script.js
   Implementa catálogo, carrito y historial con localStorage
*/
(function(){
  'use strict';

  const STORE_KEYS = { PRODUCTS: 'products', CART: 'cart', ORDERS: 'orders', DEFAULT_ADDR: 'default_address' };

  /* ---------- Utilities ---------- */
  function $(sel, root=document) { return root.querySelector(sel); }
  function $all(sel, root=document) { return Array.from(root.querySelectorAll(sel)); }

  function showToast(msg, time=2500){
    const t = document.getElementById('toast');
    if(!t) return alert(msg);
    t.textContent = msg; t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'), time);
  }

  function uid(prefix='id'){ return prefix + '-' + Math.random().toString(36).slice(2,9); }

  /* ---------- Initialize Products (if not present) ---------- */
  function initProducts() {
    if(localStorage.getItem(STORE_KEYS.PRODUCTS)) return;
    localStorage.removeItem(STORE_KEYS.PRODUCTS);
    const images = [
      'https://images.unsplash.com/photo-1614350292382-c448d0110dfa?w=400&h=300&q=80',
      'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=400&h=300&q=80',
      'https://images.unsplash.com/photo-1587932775991-708aaddc3e15?w=400&h=300&q=80'
    ];
    const sample = [
      // CAFÉ EN GRANO
      { 
        id: 'cafe-01',
        name: 'Café Etiopía Yirgacheffe',
        category: 'Café en Grano',
        price: 14.99,
        img: 'https://images.unsplash.com/photo-1614350292382-c448d0110dfa?w=400&h=300&q=80',
        description: 'Café floral con notas a jazmín y cítricos, tueste medio. 250g.',
        stock: 25
      },
      { 
        id: 'cafe-02',
        name: 'Café Colombia Supremo',
        category: 'Café en Grano',
        price: 12.50,
        img: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=400&h=300&q=80',
        description: 'Suave, equilibrado y con cuerpo cremoso. Cultivo de altura. 250g.',
        stock: 30
      },
      { 
        id: 'cafe-03',
        name: 'Café Espresso Blend',
        category: 'Café en Grano',
        price: 13.75,
        img: 'https://images.unsplash.com/photo-1587932775991-708aaddc3e15?w=400&h=300&q=80',
        description: 'Mezcla intensa con notas de cacao y almendra tostada. 250g.',
        stock: 20
      },

      // MÉTODOS DE DESTILADO
      {
        id: 'metodo-01',
        name: 'Chemex 6 Tazas',
        category: 'Métodos',
        price: 45.00,
        img: 'https://images.unsplash.com/photo-1519082274554-1ca37fb8fe60?w=400&h=300&q=80',
        description: 'Método elegante para preparar café filtrado de sabor limpio.',
        stock: 10
      },
      {
        id: 'metodo-02',
        name: 'V60 Cerámico',
        category: 'Métodos',
        price: 32.00,
        img: 'https://images.unsplash.com/photo-1544755899-4f86e5718666?w=400&h=300&q=80',
        description: 'Diseño cónico japonés, realza sabores frutales y ácidos.',
        stock: 15
      },
      {
        id: 'metodo-03',
        name: 'AeroPress Go',
        category: 'Métodos',
        price: 38.00,
        img: 'https://images.unsplash.com/photo-1595864278839-7494c68802c5?w=400&h=300&q=80',
        description: 'Método versátil para espresso y cold brew en un solo sistema.',
        stock: 12
      },

      // MOLINOS
      {
        id: 'molino-01',
        name: 'Molino Timemore Chestnut C2',
        category: 'Molinos',
        price: 58.00,
        img: 'https://images.unsplash.com/photo-1632729042002-66a5cf256355?w=400&h=300&q=80',
        description: 'Precisión y durabilidad en acero inoxidable.',
        stock: 8
      },
      {
        id: 'molino-02',
        name: 'Molino Hario Skerton Pro',
        category: 'Molinos',
        price: 44.00,
        img: 'https://images.unsplash.com/photo-1622623211364-5e5767891897?w=400&h=300&q=80',
        description: 'Ideal para espresso o prensa francesa.',
        stock: 15
      },

      // JUGUETES BARISTA
      {
        id: 'barista-01',
        name: 'Pitcher Motta 500ml',
        category: 'Barista',
        price: 29.00,
        img: 'https://images.unsplash.com/photo-1577590835286-1cf56b8ed1c0?w=400&h=300&q=80',
        description: 'Jarra de acero para arte latte profesional.',
        stock: 20
      },
      {
        id: 'barista-02',
        name: 'Aguja Distribuidora WDT',
        category: 'Barista',
        price: 12.00,
        img: 'https://images.unsplash.com/photo-1516224498413-64e1987e6c4c?w=400&h=300&q=80',
        description: 'Mejora la extracción uniforme del café.',
        stock: 25
      },

      // TAZAS Y VASOS
      {
        id: 'taza-01',
        name: 'Taza de Cerámica Vintage',
        category: 'Tazas',
        price: 9.50,
        img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&q=80',
        description: 'Hecha a mano, ideal para espresso o cappuccino.',
        stock: 30
      },
      {
        id: 'taza-02',
        name: 'Vaso de Cristal Doble Pared',
        category: 'Tazas',
        price: 11.00,
        img: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=400&h=300&q=80',
        description: 'Mantiene la temperatura sin quemar tus manos.',
        stock: 25
      },

      // BALANZAS Y ACCESORIOS
      {
        id: 'acc-01',
        name: 'Balanza Digital Barista Pro',
        category: 'Accesorios',
        price: 39.00,
        img: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=400&h=300&q=80',
        description: 'Precisión milimétrica con temporizador.',
        stock: 10
      },
      {
        id: 'acc-02',
        name: 'Termómetro de Café',
        category: 'Accesorios',
        price: 15.00,
        img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&q=80',
        description: 'Ideal para controlar la temperatura del vaporizador.',
        stock: 18
      }
    ];

    localStorage.setItem(STORE_KEYS.PRODUCTS, JSON.stringify(sample));
  }
      // CATEGORÍA: CAFÉ EN GRANO PREMIUM
      { id:'cg1', name:'Blend Signature Reserve', category:'Café Premium', price:24.50, 
        img:images[0],
        description:'Mezcla exclusiva 100% arábica de Colombia y Etiopía. Notas de chocolate negro, cítricos y caramelo.', stock:15 },
      { id:'cg2', name:'Colombia Altura 1800m', category:'Café Premium', price:22.00, 
        img:images[1],
        description:'Cultivado en las alturas de Huila. Notas brillantes de mandarina, caña de azúcar y manzana roja.', stock:20 },
      { id:'cg3', name:'Ethiopia Yirgacheffe Natural', category:'Café Premium', price:26.50, 
        img:images[2],
        description:'Proceso natural que resalta notas de arándanos, jazmín y miel de abeja. Premiado 2024.', stock:12 },

      // CATEGORÍA: CAFÉ ESPECIALIDAD
      { id:'ce1', name:'Guatemala Antigua', category:'Café Especialidad', price:19.50, 
        img:images[0],
        description:'Cultivado bajo sombra. Notas de chocolate con leche, naranja y caramelo.', stock:25 },
      { id:'ce2', name:'Costa Rica Tarrazu', category:'Café Especialidad', price:18.50, 
        img:images[1],
        description:'Proceso honey. Dulzura intensa con notas de miel, manzana roja y caña.', stock:18 },
      { id:'ce3', name:'Brasil Yellow Bourbon', category:'Café Especialidad', price:17.00, 
        img:images[2],
        description:'Variedad única. Notas de chocolate, nueces y caramelo suave.', stock:30 },

      // CATEGORÍA: MÉTODOS DE PREPARACIÓN
      { id:'mp1', name:'V60 Craftsman Kit', category:'Métodos', price:45.00, 
        img:images[0],
        description:'Kit completo V60 cerámico. Incluye server 600ml, 50 filtros y cuchara medidora.', stock:10 },
      { id:'mp2', name:'Chemex Classic 6 tazas', category:'Métodos', price:52.00, 
        img:images[1],
        description:'Clásico diseño con collar de madera. Incluye 50 filtros originales.', stock:8 },
      { id:'mp3', name:'AeroPress Kit Pro', category:'Métodos', price:39.00, 
        img:images[2],
        description:'Nueva versión 2024. Incluye bolsa de viaje, 350 filtros y embudo.', stock:15 },

      // CATEGORÍA: MOLINOS
      { id:'mo1', name:'Molino Manual Titanium', category:'Molinos', price:89.00, 
        img:images[0],
        description:'Muelas de titanio. 35 niveles de ajuste. Capacidad 35g. Ideal para viaje.', stock:12 },
      { id:'mo2', name:'Molino Eléctrico Pro', category:'Molinos', price:249.00, 
        img:images[1],
        description:'Muelas planas 58mm. 45 ajustes. Display digital. Tolva 250g.', stock:6 },
      { id:'mo3', name:'Molino Premium KOU', category:'Molinos', price:159.00, 
        img:images[2],
        description:'Muelas cónicas de acero. 38 ajustes. Sistema antiestático. Capacidad 60g.', stock:10 },

      // CATEGORÍA: ACCESORIOS BARISTA
      { id:'ab1', name:'Kit Barista Profesional', category:'Accesorios', price:129.00, 
        img:images[0],
        description:'Kit completo: tamper calibrado, pitcher 350ml y 600ml, termómetro, mat y cepillos.', stock:8 },
      { id:'ab2', name:'Balanza Digital 0.1g', category:'Accesorios', price:49.00, 
        img:images[1],
        description:'Precisión 0.1g. Timer integrado. Recargable USB. Resistente al agua.', stock:20 },
      { id:'ab3', name:'Set Pitchers Latte Art', category:'Accesorios', price:65.00, 
        img:images[2],
        description:'Set 3 pitchers (350ml, 500ml, 700ml). Acero inoxidable premium.', stock:15 },

      // CATEGORÍA: SETS Y KITS
      { id:'sk1', name:'Kit Home Barista', category:'Kits', price:299.00, 
        img:images[0],
        description:'Kit completo: V60, molino manual, balanza, server, kettle y 250g café premium.', stock:5 },
      { id:'sk2', name:'Kit Espresso Pro', category:'Kits', price:399.00, 
        img:images[1],
        description:'Kit barista: molino eléctrico, tamper, pitchers, mat y accesorios profesionales.', stock:3 },
      { id:'sk3', name:'Kit Café Viaje', category:'Kits', price:159.00, 
        img:images[2],
        description:'Kit portátil: AeroPress Go, molino manual, balanza mini y estuche premium.', stock:8 },
    ];
      { id:'cg6', name:'Costa Rica Tarrazu', category:'Café en grano', price:18.50, 
        img:'https://via.placeholder.com/400x300?text=Costa+Rica',
        description:'Honey process. Notas de miel, manzana y caña.', stock:22 },
      { id:'cg7', name:'Kenya AA', category:'Café en grano', price:20.00, 
        img:'https://via.placeholder.com/400x300?text=Kenya+AA',
        description:'Doble lavado. Notas de grosella negra y azúcar moreno.', stock:15 },
      { id:'cg8', name:'Honduras SHG', category:'Café en grano', price:16.50, 
        img:'https://via.placeholder.com/400x300?text=Honduras+SHG',
        description:'Estrictamente duro. Notas de chocolate y naranja.', stock:25 },
      { id:'cg9', name:'Peru Organic', category:'Café en grano', price:17.00, 
        img:'https://via.placeholder.com/400x300?text=Peru+Organic',
        description:'Certificado orgánico. Notas de vainilla y almendras.', stock:20 },
      { id:'cg10', name:'Indian Malabar', category:'Café en grano', price:19.00, 
        img:'https://via.placeholder.com/400x300?text=Indian+Malabar',
        description:'Monzoned. Notas especiadas y chocolate amargo.', stock:12 },

      // CATEGORÍA: MÉTODOS DE EXTRACCIÓN
      { id:'me1', name:'V60 Hario Cerámica', category:'Métodos', price:28.00, 
        img:'https://images.unsplash.com/photo-1544755899-4f86e5718666?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
        description:'Dripper cerámico blanco. Incluye 40 filtros originales.', stock:30 },
      { id:'me2', name:'Chemex Classic 6 tazas', category:'Métodos', price:42.00, 
        img:'https://via.placeholder.com/400x300?text=Chemex+6',
        description:'Vidrio borosilicato. Collar de madera y cuero.', stock:15 },
      { id:'me3', name:'AeroPress Kit Completo', category:'Métodos', price:35.00, 
        img:'https://images.unsplash.com/photo-1595864278839-7494c68802c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
        description:'Incluye 350 filtros y bolsa de viaje.', stock:40 },
      { id:'me4', name:'Clever Dripper Large', category:'Métodos', price:25.00, 
        img:'https://via.placeholder.com/400x300?text=Clever',
        description:'Sistema de inmersión y filtrado. 500ml.', stock:25 },
      { id:'me5', name:'Kalita Wave 185', category:'Métodos', price:30.00, 
        img:'https://via.placeholder.com/400x300?text=Kalita',
        description:'Acero inoxidable. Diseño de fondo plano.', stock:20 },
      { id:'me6', name:'Syphon Hario 3 tazas', category:'Métodos', price:85.00, 
        img:'https://via.placeholder.com/400x300?text=Syphon',
        description:'Set completo con quemador de alcohol.', stock:10 },
      { id:'me7', name:'French Press KOU', category:'Métodos', price:32.00, 
        img:'https://via.placeholder.com/400x300?text=French+Press',
        description:'1L. Doble filtro y vidrio resistente.', stock:35 },
      { id:'me8', name:'Moka Pot Bialetti', category:'Métodos', price:29.00, 
        img:'https://via.placeholder.com/400x300?text=Moka+Pot',
        description:'6 tazas. Aluminio. Made in Italy.', stock:28 },
      { id:'me9', name:'Cold Brew Maker', category:'Métodos', price:38.00, 
        img:'https://via.placeholder.com/400x300?text=Cold+Brew',
        description:'1.2L. Sistema de filtrado fino.', stock:15 },
      { id:'me10', name:'Vietnamese Dripper', category:'Métodos', price:15.00, 
        img:'https://via.placeholder.com/400x300?text=Vietnamese',
        description:'Tradicional. Acero inoxidable.', stock:40 },

      // CATEGORÍA: MOLINOS
      { id:'mo1', name:'Molino Manual Premium', category:'Molinos', price:65.00, 
        img:'https://via.placeholder.com/400x300?text=Molino+Premium',
        description:'Muelas cónicas de acero. 35 ajustes.', stock:20 },
      { id:'mo2', name:'Molino Eléctrico Pro', category:'Molinos', price:199.00, 
        img:'https://via.placeholder.com/400x300?text=Molino+Eléctrico',
        description:'40 ajustes. Temporizador digital.', stock:15 },
      { id:'mo3', name:'Molino Viaje KOU', category:'Molinos', price:45.00, 
        img:'https://via.placeholder.com/400x300?text=Molino+Viaje',
        description:'Plegable. Ideal para camping.', stock:30 },
      { id:'mo4', name:'Molino Profesional', category:'Molinos', price:299.00, 
        img:'https://via.placeholder.com/400x300?text=Molino+Pro',
        description:'Muelas planas 58mm. Display digital.', stock:8 },
      { id:'mo5', name:'Mini Molino USB', category:'Molinos', price:89.00, 
        img:'https://via.placeholder.com/400x300?text=Molino+USB',
        description:'Recargable. 12 ajustes.', stock:25 },
      { id:'mo6', name:'Molino Manual Classic', category:'Molinos', price:55.00, 
        img:'https://via.placeholder.com/400x300?text=Molino+Classic',
        description:'Diseño vintage. Acero inoxidable.', stock:18 },
      { id:'mo7', name:'Molino Alta Precisión', category:'Molinos', price:159.00, 
        img:'https://via.placeholder.com/400x300?text=Molino+Precisión',
        description:'50 ajustes. Recipiente antistático.', stock:12 },
      { id:'mo8', name:'Molino Espresso', category:'Molinos', price:249.00, 
        img:'https://via.placeholder.com/400x300?text=Molino+Espresso',
        description:'Especializado para espresso.', stock:10 },
      { id:'mo9', name:'Molino Comercial', category:'Molinos', price:399.00, 
        img:'https://via.placeholder.com/400x300?text=Molino+Comercial',
        description:'Alto rendimiento. Uso intensivo.', stock:5 },
      { id:'mo10', name:'Molino Manual Pro', category:'Molinos', price:75.00, 
        img:'https://via.placeholder.com/400x300?text=Molino+Manual+Pro',
        description:'Estructura reforzada. 38 ajustes.', stock:22 },

      // CATEGORÍA: ACCESORIOS
      { id:'ac1', name:'Tamper Calibrado', category:'Accesorios', price:89.00, 
        img:'https://via.placeholder.com/400x300?text=Tamper+Pro',
        description:'58mm. Presión ajustable.', stock:25 },
      { id:'ac2', name:'Kit Barista Pro', category:'Accesorios', price:149.00, 
        img:'https://via.placeholder.com/400x300?text=Kit+Barista',
        description:'Tamper, pitcher, termómetro y más.', stock:15 },
      { id:'ac3', name:'Balanza Digital 0.1g', category:'Accesorios', price:45.00, 
        img:'https://via.placeholder.com/400x300?text=Balanza',
        description:'Timer integrado. Recargable USB.', stock:30 },
      { id:'ac4', name:'Termómetro Digital', category:'Accesorios', price:25.00, 
        img:'https://via.placeholder.com/400x300?text=Termómetro',
        description:'Lectura en 3 segundos. Waterproof.', stock:40 },
      { id:'ac5', name:'Set Filtros V60', category:'Accesorios', price:8.50, 
        img:'https://via.placeholder.com/400x300?text=Filtros',
        description:'100 unidades. Blanqueados.', stock:100 },
      { id:'ac6', name:'Pitcher Latte Art', category:'Accesorios', price:28.00, 
        img:'https://images.unsplash.com/photo-1577590835286-1cf56b8ed1c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
        description:'350ml. Acero inoxidable.', stock:35 },
      { id:'ac7', name:'Cepillo Grupo', category:'Accesorios', price:12.00, 
        img:'https://via.placeholder.com/400x300?text=Cepillo',
        description:'Cerdas profesionales.', stock:50 },
      { id:'ac8', name:'Knock Box Deluxe', category:'Accesorios', price:35.00, 
        img:'https://via.placeholder.com/400x300?text=Knock+Box',
        description:'Base antideslizante. Barra silicona.', stock:20 },
      { id:'ac9', name:'Mat Tamper Silicona', category:'Accesorios', price:15.00, 
        img:'https://via.placeholder.com/400x300?text=Tamper+Mat',
        description:'Esquina de calibración.', stock:45 },
      { id:'ac10', name:'Jarra Servidor', category:'Accesorios', price:32.00, 
        img:'https://via.placeholder.com/400x300?text=Jarra',
        description:'600ml. Escala medidora.', stock:25 },

      // CATEGORÍA: TAZAS Y VASOS
      { id:'tz1', name:'Set Espresso KOU', category:'Tazas', price:42.00, 
        img:'https://via.placeholder.com/400x300?text=Set+Espresso',
        description:'2 tazas 60ml con platos.', stock:30 },
      { id:'tz2', name:'Taza Cappuccino', category:'Tazas', price:18.00, 
        img:'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
        description:'180ml. Porcelana premium.', stock:40 },
      { id:'tz3', name:'Vaso Doble Pared', category:'Tazas', price:22.00, 
        img:'https://via.placeholder.com/400x300?text=Vaso+Doble',
        description:'250ml. Borosilicato.', stock:35 },
      { id:'tz4', name:'Set Degustación', category:'Tazas', price:55.00, 
        img:'https://via.placeholder.com/400x300?text=Set+Cata',
        description:'6 tazas cupping pro.', stock:15 },
      { id:'tz5', name:'Taza Flat White', category:'Tazas', price:16.00, 
        img:'https://via.placeholder.com/400x300?text=Flat+White',
        description:'150ml. Diseño barista.', stock:45 },
      { id:'tz6', name:'Mug Térmico', category:'Tazas', price:25.00, 
        img:'https://via.placeholder.com/400x300?text=Mug+Térmico',
        description:'350ml. Mantiene temperatura 4h.', stock:30 },
      { id:'tz7', name:'Set Latte Art', category:'Tazas', price:48.00, 
        img:'https://via.placeholder.com/400x300?text=Set+Latte',
        description:'4 tazas 220ml competition.', stock:20 },
      { id:'tz8', name:'Taza Cold Brew', category:'Tazas', price:20.00, 
        img:'https://via.placeholder.com/400x300?text=Cold+Brew',
        description:'450ml. Con pajita cristal.', stock:25 },
      { id:'tz9', name:'Set Americano', category:'Tazas', price:38.00, 
        img:'https://via.placeholder.com/400x300?text=Set+Americano',
        description:'2 tazas 300ml con platos.', stock:28 },
      { id:'tz10', name:'Taza Viaje KOU', category:'Tazas', price:28.00, 
        img:'https://via.placeholder.com/400x300?text=Taza+Viaje',
        description:'400ml. Tapa antigoteo.', stock:35 },
      { id:'p2', name:'Colombia Supremo', category:'Café en grano', price:16.00, 
        img:'https://via.placeholder.com/400x300?text=Colombia+Supremo',
        description:'Acidez brillante y aroma floral. Cultivado en altitud, tueste medio.', stock:12 },
      { id:'p3', name:'Etiopía Sidamo', category:'Café en grano', price:17.00, 
        img:'https://via.placeholder.com/400x300?text=Etiopía+Sidamo',
        description:'Notas de frutas rojas y caramelo. Tueste ligero que realza su complejidad.', stock:18 },
      { id:'p4', name:'Brasil Santos', category:'Café en grano', price:13.50, 
        img:'https://via.placeholder.com/400x300?text=Brasil+Santos',
        description:'Suave y dulce con notas a nuez. Perfecto para espresso y filtrado.', stock:25 },

      // Métodos de extracción
      { id:'p5', name:'V60 Hario Cerámica', category:'Métodos', price:28.00, 
        img:'https://via.placeholder.com/400x300?text=V60+Hario',
        description:'El clásico método japonés. Incluye 20 filtros de papel.', stock:10 },
      { id:'p6', name:'Chemex Classic 6 tazas', category:'Métodos', price:45.00, 
        img:'https://via.placeholder.com/400x300?text=Chemex',
        description:'Diseño icónico, prepara café limpio y brillante. Con collar de madera.', stock:6 },
      { id:'p7', name:'AeroPress Go', category:'Métodos', price:35.00, 
        img:'https://via.placeholder.com/400x300?text=AeroPress',
        description:'Kit completo para viaje. Incluye filtros y estuche compacto.', stock:22 },
      { id:'p8', name:'Prensa Francesa KOU', category:'Métodos', price:32.00, 
        img:'https://via.placeholder.com/400x300?text=Prensa+Francesa',
        description:'800ml. Vidrio borosilicato y acero inoxidable.', stock:15 },
      { id:'p9', name:'Sifón KOU Glass', category:'Métodos', price:89.00, 
        img:'https://via.placeholder.com/400x300?text=Sifón',
        description:'Método tradicional japonés. Incluye quemador de alcohol.', stock:4 },

      // Molinos
      { id:'p10', name:'KOU Classic Grinder', category:'Molinos', price:65.00, 
        img:'https://via.placeholder.com/400x300?text=Molino+Classic',
        description:'Molino manual con muelas cónicas de acero. 35 ajustes de molienda.', stock:8 },
      { id:'p11', name:'Molino Pro Steel', category:'Molinos', price:120.00, 
        img:'https://via.placeholder.com/400x300?text=Molino+Pro',
        description:'Todo en acero inoxidable. Ideal para espresso y métodos de filtrado.', stock:6 },

      // Pitchers y arte latte
      { id:'p12', name:'Pitcher KOU Pro 600ml', category:'Pitchers', price:24.00, 
        img:'https://via.placeholder.com/400x300?text=Pitcher+Pro',
        description:'Acero inoxidable con punta precisa para latte art.', stock:30 },
      { id:'p13', name:'Pitcher Rose Gold 350ml', category:'Pitchers', price:28.00, 
        img:'https://via.placeholder.com/400x300?text=Pitcher+Gold',
        description:'Edición especial en acabado rose gold.', stock:15 },

      // Tazas
      { id:'p14', name:'Set Tazas KOU Craft', category:'Tazas', price:32.00, 
        img:'https://via.placeholder.com/400x300?text=Tazas+Craft',
        description:'Set de 2 tazas artesanales. Cerámica de alta temperatura.', stock:40 },
      { id:'p15', name:'Taza Cristal Doble', category:'Tazas', price:18.00, 
        img:'https://via.placeholder.com/400x300?text=Taza+Cristal',
        description:'250ml. Cristal de borosilicato, doble pared.', stock:25 },

      // Accesorios
      { id:'p16', name:'Balanza Digital KOU', category:'Balanzas', price:45.00, 
        img:'https://via.placeholder.com/400x300?text=Balanza',
        description:'Precisión 0.1g. Timer integrado. Ideal para pour over.', stock:12 },
      { id:'p17', name:'Kit Limpieza Barista', category:'Accesorios', price:25.00, 
        img:'https://via.placeholder.com/400x300?text=Kit+Limpieza',
        description:'Cepillos, paños y limpiador para grupo. Esencial para mantenimiento.', stock:45 },
      { id:'p18', name:'Filtros V60 Blancos', category:'Accesorios', price:8.50, 
        img:'https://via.placeholder.com/400x300?text=Filtros',
        description:'Pack 100 unidades. Papel japones premium.', stock:80 },
      { id:'p19', name:'Tamper Pro 58mm', category:'Accesorios', price:29.00, 
        img:'https://via.placeholder.com/400x300?text=Tamper',
        description:'Acero inoxidable, mango ergonómico. Peso calibrado.', stock:20 },
      { id:'p20', name:'KOU Starter Pack', category:'Juguetes', price:150.00, 
        img:'https://via.placeholder.com/400x300?text=Starter+Pack',
        description:'Kit completo: V60, molino, balanza, filtros y 250g de café.', stock:8 }
    ];
    localStorage.setItem(STORE_KEYS.PRODUCTS, JSON.stringify(sample));
  }

  /* ---------- Product helpers ---------- */
  function getProducts(){
    initProducts();
    return JSON.parse(localStorage.getItem(STORE_KEYS.PRODUCTS) || '[]');
  }

  function getProductById(id){
    return getProducts().find(p=>p.id===id);
  }

  /* ---------- Cart API ---------- */
  function getCart(){
    return JSON.parse(localStorage.getItem(STORE_KEYS.CART) || '[]');
  }
  function saveCart(cart){ localStorage.setItem(STORE_KEYS.CART, JSON.stringify(cart)); updateCartCount(); }

  function addToCart(productId, qty=1){
    const product = getProductById(productId);
    if(!product) return showToast('Producto no encontrado');
    let cart = getCart();
    const item = cart.find(i=>i.productId===productId);
    if(item){ item.qty += qty; }
    else{ cart.push({ productId, qty }); }
    saveCart(cart);
    showToast('Agregado al carrito');
  }

  function updateCart(productId, qty){
    let cart = getCart();
    const idx = cart.findIndex(i=>i.productId===productId);
    if(idx === -1) return;
    if(qty <= 0) { cart.splice(idx,1); }
    else { cart[idx].qty = qty; }
    saveCart(cart);
  }

  function removeFromCart(productId){
    let cart = getCart();
    cart = cart.filter(i=>i.productId!==productId);
    saveCart(cart);
  }

  function clearCart(){ localStorage.removeItem(STORE_KEYS.CART); updateCartCount(); }

  function cartSummary(){
    const cart = getCart();
    const items = cart.map(i=>{
      const p = getProductById(i.productId);
      return { ...p, qty: i.qty, lineTotal: +(p.price * i.qty).toFixed(2) };
    });
    const subtotal = items.reduce((s,it)=>s+it.lineTotal,0);
    const taxes = +(subtotal * 0.12).toFixed(2);
    const total = +(subtotal + taxes).toFixed(2);
    return { items, subtotal: +subtotal.toFixed(2), taxes, total };
  }

  /* ---------- Orders API ---------- */
  function getOrders(){ return JSON.parse(localStorage.getItem(STORE_KEYS.ORDERS) || '[]'); }
  function saveOrder(order){
    const orders = getOrders(); orders.unshift(order); localStorage.setItem(STORE_KEYS.ORDERS, JSON.stringify(orders));
  }

  /* ---------- Checkout flow ---------- */
  function checkout(paymentData, shippingData){
    const summary = cartSummary();
    if(summary.items.length===0) throw new Error('Carrito vacío');
    const order = {
      orderId: uid('order'),
      date: new Date().toISOString(),
      items: summary.items.map(i=>({ productId:i.id, name:i.name, qty:i.qty, price:i.price })),
      shippingInfo: shippingData,
      paymentMethod: { cardName: paymentData.cardName, email: paymentData.email, masked: '**** **** **** ' + (paymentData.cardNumber.slice(-4)) },
      subtotal: summary.subtotal, taxes: summary.taxes, total: summary.total,
      status: 'Pendiente'
    };
    saveOrder(order);
    clearCart();
    return order;
  }

  /* ---------- Rendering helpers for pages ---------- */
  function renderProducts(filterText='', category='', priceRange='', sortBy='name-asc'){
    const grid = document.getElementById('products-grid');
    if(!grid) return;
    
    let products = getProducts().filter(p=>{
      // Filtro por categoría
      const inCat = !category || p.category===category;
      
      // Filtro por texto
      const t = filterText.trim().toLowerCase();
      const inText = !t || 
        p.name.toLowerCase().includes(t) || 
        p.description.toLowerCase().includes(t) || 
        p.category.toLowerCase().includes(t);
      
      // Filtro por rango de precio
      let inPrice = true;
      if(priceRange) {
        const [min, max] = priceRange.split('-').map(n => n === '+' ? Infinity : Number(n));
        inPrice = p.price >= min && p.price <= max;
      }
      
      return inCat && inText && inPrice;
    });

    // Ordenar productos
    products.sort((a, b) => {
      switch(sortBy) {
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        default: return 0;
      }
    });
    grid.innerHTML = '';
    products.forEach(p=>{
      const card = document.createElement('article');
      card.className = 'product-card';
      
      const stockClass = p.stock <= 5 ? 'low' : 
                        p.stock <= 10 ? 'medium' : 'in-stock';
      
      card.innerHTML = `
        <img src="${p.img}" alt="${p.name}" class="product-image" loading="lazy">
        <div class="product-info">
          <div class="product-category">${p.category}</div>
          <h3 class="product-title">${p.name}</h3>
          <p class="product-description">${p.description}</p>
          <div class="product-price">${p.price.toFixed(2)}</div>
          <div class="product-stock stock ${stockClass}">
            Stock: ${p.stock} unidades
          </div>
          <div class="product-actions">
            <button class="btn add" data-id="${p.id}"
              ${p.stock === 0 ? 'disabled' : ''}>
              ${p.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
            </button>
          </div>
        </div>`;
      grid.appendChild(card);
    });
    // attach listeners
    $all('.add', grid).forEach(btn=>btn.addEventListener('click', ()=>{ addToCart(btn.dataset.id); }));
  }

  function populateCategoryFilter(){
    const sel = document.getElementById('category-filter');
    if(!sel) return;
    const cats = Array.from(new Set(getProducts().map(p=>p.category)));
    sel.innerHTML = '<option value="">Todas las categorías</option>' + cats.map(c=>`<option value="${c}">${c}</option>`).join('');
    sel.addEventListener('change', ()=> renderProducts($('#search')? $('#search').value : '', sel.value));
  }

  function renderCartPage(){
    const container = document.getElementById('cart-contents');
    const subtotalEl = document.getElementById('cart-subtotal');
    const taxEl = document.getElementById('cart-tax');
    const totalEl = document.getElementById('cart-total');
    if(!container) return;
    
    const summary = cartSummary();
    container.innerHTML = '';
    
    if(summary.items.length===0){ 
      container.innerHTML = `
        <div class="empty-cart">
          <h2>Tu carrito está vacío ☕</h2>
          <p>Descubre nuestros granos y accesorios en la tienda.</p>
          <a href="tienda.html" class="btn btn-primary">Ir a la Tienda</a>
        </div>`; 
      if(subtotalEl) subtotalEl.innerHTML = '';
      if(taxEl) taxEl.innerHTML = '';
      if(totalEl) totalEl.innerHTML = '';
      return; 
    }
    
    summary.items.forEach(it=>{
      const el = document.createElement('div'); 
      el.className='cart-item';
      el.innerHTML = `
        <img src="${it.img}" alt="${it.name}">
        <div class="meta">
          <div class="name">${it.name}</div>
          <div class="price">$${it.price.toFixed(2)} × ${it.qty}</div>
        </div>
        <div class="qty-controls">
          <button class="btn small dec" data-id="${it.id}" aria-label="Reducir cantidad">−</button>
          <span class="qty">${it.qty}</span>
          <button class="btn small inc" data-id="${it.id}" aria-label="Aumentar cantidad">+</button>
        </div>
        <div class="line">$${it.lineTotal.toFixed(2)}</div>
      `;
      container.appendChild(el);
    });

    // Update summary card
    if(subtotalEl) subtotalEl.innerHTML = `<div class="summary-line"><span>Subtotal</span><span>$${summary.subtotal.toFixed(2)}</span></div>`;
    if(taxEl) taxEl.innerHTML = `<div class="summary-line"><span>Impuestos (12%)</span><span>$${summary.taxes.toFixed(2)}</span></div>`;
    if(totalEl) totalEl.innerHTML = `<div class="summary-line total"><span>Total</span><span>$${summary.total.toFixed(2)}</span></div>`;

    // Listeners
    $all('.inc').forEach(b=>b.addEventListener('click', ()=>{
      const id = b.dataset.id; const cart = getCart(); const item = cart.find(i=>i.productId===id); if(item){ item.qty++; saveCart(cart); renderCartPage(); }
    }));
    $all('.dec').forEach(b=>b.addEventListener('click', ()=>{
      const id = b.dataset.id; const cart = getCart(); const item = cart.find(i=>i.productId===id); if(item){ item.qty--; if(item.qty<=0) removeFromCart(id); else saveCart(cart); renderCartPage(); }
    }));
  }

  function renderOrdersPage(){
    const list = document.getElementById('orders-list');
    if(!list) return;
    const statusFilter = document.getElementById('status-filter');
    const dateFilter = document.getElementById('date-filter');
    const orders = getOrders();
    let filtered = orders.slice();
    if(statusFilter && statusFilter.value) filtered = filtered.filter(o=>o.status===statusFilter.value);
    if(dateFilter && dateFilter.value) filtered = filtered.filter(o=> o.date.slice(0,10) === dateFilter.value);
    list.innerHTML = '';
    if(filtered.length===0) { list.innerHTML = '<p>No hay pedidos.</p>'; return; }
    filtered.forEach(o=>{
      const card = document.createElement('div'); card.className='order-card';
      card.innerHTML = `
        <div class="order-meta"><div>ID: ${o.orderId}</div><div>${new Date(o.date).toLocaleString()}</div><div>Estado: <strong>${o.status}</strong></div></div>
        <div class="order-items">${o.items.map(it=>`<div>${it.qty} × ${it.name} — $${it.price.toFixed(2)}</div>`).join('')}</div>
        <div class="order-total">Total: $${o.total.toFixed(2)}</div>
        <div class="order-ship">Envío: ${o.shippingInfo.addr1}, ${o.shippingInfo.city}</div>
        <div class="order-actions">${o.status !== 'Entregado' ? `<button class="btn confirm" data-id="${o.orderId}">Confirmar recibido</button>` : ''}</div>
      `;
      list.appendChild(card);
    });
    $all('.confirm').forEach(b=>b.addEventListener('click', ()=>{
      const id = b.dataset.id; const orders = getOrders(); const idx = orders.findIndex(x=>x.orderId===id); if(idx!==-1){ orders[idx].status='Entregado'; localStorage.setItem(STORE_KEYS.ORDERS, JSON.stringify(orders)); renderOrdersPage(); showToast('Estado actualizado'); }
    }));
  }

  /* ---------- Simple validation helpers ---------- */
  function validCardNumber(num){
    const clean = num.replace(/\D/g,'');
    return clean.length >= 13 && clean.length <= 19; // basic
  }

  /* ---------- Bind page interactions ---------- */
  function bindCommon(){
    // years
    $all('[id^=year]').forEach(el=>el.textContent = new Date().getFullYear());

    // nav toggle
    const navToggle = $('.nav-toggle'); const navList = $('.nav-list');
    if(navToggle){ navToggle.addEventListener('click', ()=>{ if(navList.style.display==='flex') navList.style.display='none'; else navList.style.display='flex'; }); }

    // cart count
    updateCartCount();
  }

  function updateCartCount(){
    const c = getCart().reduce((s,i)=>s+i.qty,0);
    $all('#cart-count').forEach(el=>el.textContent = c);
  }

  /* ---------- Page specific init ---------- */
  function updateActiveFilters(){
    const container = document.getElementById('active-filters');
    if(!container) return;
    
    const search = document.getElementById('search').value;
    const category = document.getElementById('category-filter').value;
    const price = document.getElementById('price-filter').value;
    const sort = document.getElementById('sort-filter').value;
    
    let html = '';
    
    if(search) {
      html += `<span class="filter-tag">
        Búsqueda: ${search}
        <button onclick="clearSearch()">×</button>
      </span>`;
    }
    
    if(category) {
      html += `<span class="filter-tag">
        Categoría: ${category}
        <button onclick="clearCategory()">×</button>
      </span>`;
    }
    
    if(price) {
      const label = document.querySelector(`#price-filter option[value="${price}"]`).textContent;
      html += `<span class="filter-tag">
        Precio: ${label}
        <button onclick="clearPrice()">×</button>
      </span>`;
    }
    
    container.innerHTML = html;
  }

  function clearSearch(){ 
    document.getElementById('search').value = ''; 
    refreshProducts(); 
  }
  
  function clearCategory(){ 
    document.getElementById('category-filter').value = ''; 
    refreshProducts(); 
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.cat-btn[data-category=""]').classList.add('active');
  }
  
  function clearPrice(){ 
    document.getElementById('price-filter').value = ''; 
    refreshProducts(); 
  }

  function refreshProducts(){
    const search = document.getElementById('search').value;
    const category = document.getElementById('category-filter').value;
    const price = document.getElementById('price-filter').value;
    const sort = document.getElementById('sort-filter').value;
    renderProducts(search, category, price, sort);
    updateActiveFilters();
  }

  function initStorePage(){
    populateCategoryFilter();
    
    // Event listeners para filtros
    const search = document.getElementById('search');
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    if(search) search.addEventListener('input', refreshProducts);
    if(categoryFilter) categoryFilter.addEventListener('change', refreshProducts);
    if(priceFilter) priceFilter.addEventListener('change', refreshProducts);
    if(sortFilter) sortFilter.addEventListener('change', refreshProducts);
    
    // Botones de categoría
    document.querySelectorAll('.cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        categoryFilter.value = btn.dataset.category;
        refreshProducts();
      });
    });
    
    renderProducts();
  }

  function initCartPage(){
    renderCartPage();
    const emptyBtn = document.getElementById('empty-cart');
    if(emptyBtn) emptyBtn.addEventListener('click', ()=>{ clearCart(); renderCartPage(); showToast('Carrito vaciado'); });

    // checkout modal
    const modal = document.getElementById('modal');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cancelBtn = document.getElementById('cancel-pay');
    const modalClose = document.getElementById('modal-close');
    const form = document.getElementById('checkout-form');
    const orderSummary = document.getElementById('order-summary');
    function openModal(){
      const s = cartSummary();
      orderSummary.innerHTML = `<p>Productos: ${s.items.length} — Total: $${s.total.toFixed(2)}</p>`;
      modal.setAttribute('aria-hidden','false'); modal.style.display='flex';
    }
    function closeModal(){ modal.setAttribute('aria-hidden','true'); modal.style.display='none'; document.getElementById('processing').hidden=true; document.getElementById('success').hidden=true; }
    if(checkoutBtn) checkoutBtn.addEventListener('click', ()=>{
      const cart = getCart(); if(cart.length===0){ showToast('El carrito está vacío'); return; } openModal();
    });
    if(cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if(modalClose) modalClose.addEventListener('click', closeModal);

    if(form) form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const fd = new FormData(form); const payment = { cardName: fd.get('cardName'), email: fd.get('email'), cardNumber: fd.get('cardNumber') || fd.get('cardNumber'), exp: fd.get('exp'), cvv: fd.get('cvv') };
      const shipping = { name: fd.get('shipName'), addr1: fd.get('addr1'), addr2: fd.get('addr2'), city: fd.get('city'), state: fd.get('state'), zip: fd.get('zip'), country: fd.get('country'), phone: fd.get('phone') };
      // Basic validation
      if(!payment.cardName || !payment.email || !payment.cardNumber) { showToast('Complete los datos de pago'); return; }
      if(!validCardNumber(payment.cardNumber)) { showToast('Número de tarjeta inválido'); return; }
      // simulate processing
      document.getElementById('processing').hidden=false;
      form.style.display='none';
      setTimeout(()=>{
        try{
          const order = checkout(payment, shipping);
          document.getElementById('processing').hidden=true;
          document.getElementById('success').hidden=false;
          showToast('Pedido guardado en Historial');
          setTimeout(()=>{ location.reload(); }, 1600);
        }catch(err){ showToast(err.message); form.style.display='block'; document.getElementById('processing').hidden=true; }
      }, 1800);
    });
  }

  function initOrdersPage(){
    const statusFilter = document.getElementById('status-filter');
    const dateFilter = document.getElementById('date-filter');
    if(statusFilter) statusFilter.addEventListener('change', renderOrdersPage);
    if(dateFilter) dateFilter.addEventListener('change', renderOrdersPage);
    renderOrdersPage();
  }

  function initContact(){
    const form = document.getElementById('contact-form'); if(!form) return;
    form.addEventListener('submit', (e)=>{ e.preventDefault(); showToast('Mensaje enviado — Gracias'); form.reset(); });
  }

  /* ---------- Navigation and UI Effects ---------- */
  function initNavigation(){
    // Header scroll hide/show
    let lastScroll = 0;
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', ()=>{
      const currentScroll = window.pageYOffset;
      if(currentScroll > lastScroll && currentScroll > 64){
        header.classList.add('hide');
      }else{
        header.classList.remove('hide');
      }
      lastScroll = currentScroll;
    });

    // Page transition effect
    document.querySelectorAll('a').forEach(link=>{
      if(link.href.includes(location.origin)){
        link.addEventListener('click', e=>{
          e.preventDefault();
          const transition = document.createElement('div');
          transition.className = 'page-transition';
          document.body.appendChild(transition);
          setTimeout(()=>{
            location.href = link.href;
          }, 300);
        });
      }
    });
  }

  /* ---------- On DOM ready ---------- */
  document.addEventListener('DOMContentLoaded', ()=>{
    initProducts(); 
    bindCommon();
    initNavigation();

    const path = location.pathname.split('/').pop();
    if(path === '' || path === 'index.html'){
      // Show welcome animation
      document.querySelectorAll('.fade-in').forEach((el, i)=>{
        el.style.animationDelay = `${i * 0.2}s`;
      });
    }
    if(path === 'tienda.html') initStorePage();
    if(path === 'carrito.html') initCartPage();
    if(path === 'historial.html') initOrdersPage();
    if(path === 'contacto.html') initContact();
  });

})();

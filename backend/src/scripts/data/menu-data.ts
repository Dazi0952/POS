// backend/src/scripts/data/menu-data.ts

const pizzaBaseIngredients = [
    { name: "Sos pomidorowy", price: 0, isDefault: true },
    { name: "Mozzarella", price: 0, isDefault: true }
];

const commonBurgerIngredients = [
    { name: "Wołowina", price: 0, isDefault: true },
    { name: "Bułka", price: 0, isDefault: true },
    { name: "Sałata", price: 0, isDefault: true },
    { name: "Pomidor", price: 0, isDefault: true },
    { name: "Ogórek konserwowy", price: 0, isDefault: true },
    { name: "Cebula", price: 0, isDefault: true },
    { name: "Sos różowy", price: 0, isDefault: true },
    { name: "Domowe BBQ", price: 0, isDefault: true }
];

export const menuData = [
  {
    categoryName: "Classic Burgers",
    description: "Classics",
    products: [
      {
        name: "Classic",
        description: "Klasyk z wołowiną, warzywami i sosem",
        hasVariants: true,
        variants: [
            { name: "180g", price: 36.99 },
            { name: "360g", price: 48.99 }
        ],
        ingredients: [
            ...commonBurgerIngredients
        ],
        price: 0
      },
      {
        name: "Bacon",
        description: "Klasyk z dodatkiem chrupiącego bekonu i BBQ",
        hasVariants: true,
        variants: [
            { name: "180g", price: 39.99 },
            { name: "360g", price: 51.99 }
        ],
        ingredients: [
            { name: "Bekon", price: 4, isDefault: true },
            ...commonBurgerIngredients
        ],
        price: 0
      },
      {
        name: "Cheese",
        description: "Klasyk z serem cheddar",
        hasVariants: true,
        variants: [
            { name: "180g", price: 39.99 },
            { name: "360g", price: 51.99 }
        ],
        ingredients: [
            { name: "Ser Cheddar", price: 4, isDefault: true },
            ...commonBurgerIngredients
        ],
        price: 0
      },
      {
        name: "Cheese & Bacon",
        description: "Ser Cheddar i Bekon - połączenie idealne",
        hasVariants: true,
        variants: [
            { name: "180g", price: 42.99 },
            { name: "360g", price: 54.99 }
        ],
        ingredients: [
            { name: "Ser Cheddar", price: 4, isDefault: true },
            { name: "Bekon", price: 4, isDefault: true },
            ...commonBurgerIngredients
        ],
        price: 0
      }
    ]
  },
  {
    categoryName: "Heart Attack Burgers",
    description: "Ogromne porcje mięsa i dodatków",
    products: [
        {
            name: "Triple Cheese",
            description: "3x Wołowina, 3x Cheddar, pomidor, cebula, domowe BBQ, majonez, musztarda",
            hasVariants: true,
            variants: [ {name: "540g"}],
            ingredients: [
                { name: "Wołowina", price: 0, isDefault: true },
                { name: "Ser Cheddar", price: 0, isDefault: true },
                { name: "Cebula", price: 0, isDefault: true },
                { name: "Ogórek konserwowy", price: 0, isDefault: true },
                { name: "Domowe BBQ", price: 0, isDefault: true },
                { name: "Majonez", price: 0, isDefault: true },
                { name: "Musztarda", price: 0, isDefault: true },
                { name: "Bułka", price: 0, isDefault: true }
            ],
            price: 63.99
        },
        {
            name: "Triple Bacon",
            description: "3x Wołowina, 3x Bekon, pomidor, cebula, domowe BBQ, majonez, musztarda",
            hasVariants: false,
            variants: [ {name: "540g"}],
            ingredients: [
                { name: "Wołowina", price: 0, isDefault: true },
                { name: "Bekon", price: 0, isDefault: true },
                { name: "Cebula", price: 0, isDefault: true },
                { name: "Ogórek konserwowy", price: 0, isDefault: true },
                { name: "Domowe BBQ", price: 0, isDefault: true },
                { name: "Majonez", price: 0, isDefault: true },
                { name: "Musztarda", price: 0, isDefault: true },
                { name: "Bułka", price: 0, isDefault: true }
            ],
            price: 63.99
        },
        {
            name: "Triple Cheese Bacon",
            description: "3x Wołowina, 3x Cheddar, 3x Bekon, pomidor, cebula, domowe BBQ, musztarda",
            hasVariants: false,
            variants: [ {name: "540g"}],
            ingredients: [
                { name: "Wołowina", price: 0, isDefault: true },
                { name: "Ser Cheddar", price: 0, isDefault: true },
                { name: "Bekon", price: 0, isDefault: true },
                { name: "Cebula", price: 0, isDefault: true },
                { name: "Ogórek konserwowy", price: 0, isDefault: true },
                { name: "Domowe BBQ", price: 0, isDefault: true },
                { name: "Majonez", price: 0, isDefault: true },
                { name: "Musztarda", price: 0, isDefault: true },
                { name: "Bułka", price: 0, isDefault: true }
            ],
            price: 66.99
        },
        {
            name: "King Jack",
            description: "3x Wołowina, 3x Cheddar, 3x Bekon, sałata, pomidor, ogórek, cebula, sos różowy, musztarda, BBQ",
            hasVariants: false,
            variants: [ {name: "260g"}],
            ingredients: [
                { name: "Wołowina", price: 0, isDefault: true },
                { name: "Ser Cheddar", price: 0, isDefault: true },
                { name: "Bekon", price: 0, isDefault: true },
                { name: "Sałata", price: 0, isDefault: true },
                { name: "Pomidor", price: 0, isDefault: true },
                { name: "Ogórek konserwowy", price: 0, isDefault: true },
                { name: "Cebula", price: 0, isDefault: true },
                { name: "Onion Rings", price: 0, isDefault: true },
                { name: "Sos różowy", price: 0, isDefault: true },
                { name: "Musztarda", price: 0, isDefault: true },
                { name: "Domowe BBQ", price: 0, isDefault: true },
                { name: "Bułka", price: 0, isDefault: true }
            ],
            price: 55.99
        }
    ]
  },

  // ============================================================
  // KATEGORIA: THE BEST OF KING BURGERS
  // ============================================================
  {
    categoryName: "The Best Of King Burgers",
    description: "Specjalne kompozycje smaków",
    products: [
        {
            name: "New York",
            description: "Klasyk z sałatą, pomidorem, ogórkiem, cebulą i sosem różowym",
            hasVariants: true,
            variants: [
                { name: "180g", price: 43.99 },
                { name: "360g", price: 55.99 }
            ],
            ingredients: [
                { name: "Wołowina", price: 0, isDefault: true },
                { name: "Ser Cheddar", price: 0, isDefault: true },
                { name: "Bekon", price: 0, isDefault: true },
                { name: "Sałata", price: 0, isDefault: true },
                { name: "Pomidor", price: 0, isDefault: true },
                { name: "Ogórek konserwowy", price: 0, isDefault: true },
                { name: "Cebula", price: 0, isDefault: true },
                { name: "Ketchup", price: 0, isDefault: true },
                { name: "Majonez", price: 0, isDefault: true },
                { name: "Musztarda", price: 0, isDefault: true },
                { name: "Bułka", price: 0, isDefault: true }
            ],
            price: 0
        },
        {
            name: "London Express",
            description: "Wołowina, cheddar, cebula grillowana, BBQ",
            hasVariants: true,
            variants: [
                { name: "180g", price: 43.99 },
                { name: "360g", price: 55.99 }
            ],
            ingredients: [
                { name: "Wołowina", price: 0, isDefault: true },
                { name: "Ser Cheddar", price: 0, isDefault: true },
                { name: "Bekon", price: 0, isDefault: true },
                { name: "Grillowana cebula", price: 0, isDefault: true },
                { name: "Jajko", price: 0, isDefault: true },
                { name: "Fasola Heinz", price: 0, isDefault: true },
                { name: "Sos BBQ", price: 0, isDefault: true },
                { name: "Bułka", price: 0, isDefault: true }
            ],
            price: 0
        },
        {
            name: "London",
            description: "Wołowina, cheddar, bacon, cebula",
            hasVariants: true,
            variants: [
                { name: "180g", price: 44.99 },
                { name: "360g", price: 56.99 }
            ],
            ingredients: [
                { name: "Wołowina", price: 0, isDefault: true },
                { name: "Ser Cheddar", price: 0, isDefault: true },
                { name: "Bekon", price: 0, isDefault: true },
                { name: "Grillowana cebula", price: 0, isDefault: true },
                { name: "Jajko", price: 0, isDefault: true },
                { name: "Sos BBQ", price: 0, isDefault: true },
                { name: "Bułka", price: 0, isDefault: true }
            ],
            price: 0
        },
        {
            name: "Mex",
            description: "Wołowina, jalapeño, nachos, cheddar, sos chili, sałata, pomidor",
            hasVariants: true,
            variants: [
                { name: "180g", price: 45.99 },
                { name: "360g", price: 57.99 }
            ],
            ingredients: [
                { name: "Wołowina", price: 0, isDefault: true },
                { name: "Ser Cheddar", price: 0, isDefault: true },
                { name: "Bekon", price: 0, isDefault: true },
                { name: "Sałata", price: 0, isDefault: true },
                { name: "Pomidor", price: 0, isDefault: true },
                { name: "Cebula", price: 0, isDefault: true },
                { name: "Ogórki konserwowe", price: 0, isDefault: true },
                { name: "Jalapeno", price: 0, isDefault: true },
                { name: "Nachos", price: 0, isDefault: true },
                { name: "Bułka", price: 0, isDefault: true }
            ],
            price: 0
        },
        {
            name: "Extra Cheese",
            description: "Wołowina, cheddar, BBQ",
            hasVariants: true,
            variants: [
                { name: "180g", price: 44.99 },
                { name: "360g", price: 56.99 }
            ],
            ingredients: [
                { name: "Wołowina", price: 0, isDefault: true },
                { name: "Ser Cheddar", price: 0, isDefault: true },
                { name: "Mimolette", price: 0, isDefault: true },
                { name: "Cebula", price: 0, isDefault: true },
                { name: "Ogórek konserwowy", price: 0, isDefault: true },
                { name: "Sos BBQ", price: 0, isDefault: true },
                { name: "Bułka", price: 0, isDefault: true }
            ],
            price: 0
        },
        {
            name: "Italian Style",
            description: "Wołowina, rukola, ",
            hasVariants: true,
            variants: [
                { name: "180g", price: 45.99 },
                { name: "360g", price: 57.99 }
            ],
            ingredients: [
                { name: "Wołowina", price: 0, isDefault: true },
                { name: "Mozzarella", price: 0, isDefault: true },
                { name: "Pomidor", price: 0, isDefault: true },
                { name: "Rukola", price: 0, isDefault: true },
                { name: "Cebula", price: 0, isDefault: true },
                { name: "Pesto", price: 0, isDefault: true },
                { name: "Bułka", price: 0, isDefault: true },
            ],
            price: 0
        },
        {
            name: "Spanish Style",
            description: "Wołowina, chilli",
            hasVariants: true,
            variants: [
                { name: "180g", price: 45.99 },
                { name: "360g", price: 57.99 }
            ],
            ingredients: [
                { name: "Wołowina", price: 0, isDefault: true },
                { name: "Ser Cheddar", price: 0, isDefault: true },
                { name: "Bekon", price: 0, isDefault: true },
                { name: "Chorizo", price: 0, isDefault: true },
                { name: "Chilli", price: 0, isDefault: true },
                { name: "Cebula", price: 0, isDefault: true },
                { name: "Domowe BBQ", price: 0, isDefault: true },
                { name: "Majonez", price: 0, isDefault: true },
                { name: "Musztarda", price: 0, isDefault: true },
                { name: "Bułka", price: 0, isDefault: true }
            ],
            price: 0
        },
        {
            name: "Surf'n'Turf",
            description: "Wołowina, krewetki, sałata, cebula",
            hasVariants: true,
            variants: [
                { name: "180g", price: 46.99 },
                { name: "360g", price: 58.99 }
            ],
            ingredients: [
                { name: "Wołowina", price: 0, isDefault: true },
                { name: "Ser Cheddar", price: 0, isDefault: true },
                { name: "Bekon", price: 0, isDefault: true },
                { name: "Krewetki", price: 0, isDefault: true },
                { name: "Sałata", price: 0, isDefault: true },               
                { name: "Cebula", price: 0, isDefault: true },
                { name: "Sos różowy", price: 0, isDefault: true },
                { name: "Bułka", price: 0, isDefault: true }
            ],
            price: 0
        }
    ]
  },

  // ============================================================
  // KATEGORIA: CHICKEN BURGERS
  // ============================================================
  {
    categoryName: "Chicken Burgers",
    description: "Soczysty kurczak w różnych odsłonach",
    products: [
        {
            name: "Hawaii Grilled Chicken",
            description: "Grillowana pierś, cheddar, ananas, sałata, cebula, pomidor, sos różowy",
            hasVariants: true,
            variants: [
                { name: "150g", price: 41.99 },
                { name: "300g", price: 53.99 }
            ],
            ingredients: [
                { name: "Kurczak grillowany", price: 0, isDefault: true },
                { name: "Ser Cheddar", price: 0, isDefault: true },
                { name: "Ananas", price: 0, isDefault: true },
                { name: "Bułka", price: 0, isDefault: true },
                { name: "Sałata", price: 0, isDefault: true },
                { name: "Cebula", price: 0, isDefault: true },
                { name: "Sos różowy", price: 0, isDefault: true }
            ],
            price: 0
        },
        {
            name: "Crispy Chicken",
            description: "Chrupiąca pierś z kurczaka, sałata, cebula, pomidor, ketchup, majonez",
            hasVariants: true,
            variants: [
                { name: "150g", price: 39.99 },
                { name: "300g", price: 51.99 }
            ],
            ingredients: [
                { name: "Kurczak panierowany", price: 0, isDefault: true },
                { name: "Bułka", price: 0, isDefault: true },
                { name: "Sałata", price: 0, isDefault: true },
                { name: "Cebula", price: 0, isDefault: true },
                { name: "Majonez", price: 0, isDefault: true },
                { name: "Ketchup", price: 0, isDefault: true }
            ],
            price: 0
        },
        {
            name: "Crispy Chicken C & B",
            description: "Grillowana pierś, sałata, ogórek, pomidor, cebula, sos różowy",
            hasVariants: true,
            variants: [
                { name: "Standard", price: 38.99 },
                { name: "Large", price: 48.99 }
            ],
            ingredients: [
                { name: "Kurczak panierowany", price: 0, isDefault: true },
                { name: "Ser Cheddar", price: 0, isDefault: true },
                { name: "Bekon", price: 0, isDefault: true },
                { name: "Bułka", price: 0, isDefault: true },
                { name: "Sałata", price: 0, isDefault: true },
                { name: "Cebula", price: 0, isDefault: true },
                { name: "Majonez", price: 0, isDefault: true },
                { name: "Ketchup", price: 0, isDefault: true }
            ],
            price: 0
        },
        {
            name: "Cheesy Chicken",
            description: "Kurczak panierowany, cheddar, cebula, pomidor, świeża bazylia, sos różowy",
            hasVariants: true,
            variants: [
                { name: "150g", price: 42.99 },
                { name: "300g", price: 54.99 }
            ],
            ingredients: [
                { name: "Kurczak panierowany", price: 0, isDefault: true },
                { name: "Ser Cheddar", price: 0, isDefault: true },
                { name: "Bułka", price: 0, isDefault: true },
                { name: "Sałata", price: 0, isDefault: true },
                { name: "Cebula", price: 0, isDefault: true },
                { name: "Majonez", price: 0, isDefault: true },
                { name: "Ketchup", price: 0, isDefault: true }
            ],
            price: 0
        },
        {
            name: "Texas Chicken",
            description: "Kurczak panierowany, cheddar, cebula, pomidor, świeża bazylia, sos różowy",
            hasVariants: true,
            variants: [
                { name: "150g", price: 42.99 },
                { name: "300g", price: 54.99 }
            ],
            ingredients: [
                { name: "Kurczak panierowany", price: 0, isDefault: true },
                { name: "Ser Cheddar", price: 0, isDefault: true },
                { name: "Bekon", price: 0, isDefault: true },
                { name: "Bułka", price: 0, isDefault: true },
                { name: "Sałata", price: 0, isDefault: true },
                { name: "Cebula", price: 0, isDefault: true },
                { name: "Pomidor", price: 0, isDefault: true },
                { name: "Onion Rings", price: 0, isDefault: true },
                { name: "Sos BBQ", price: 0, isDefault: true },
                { name: "Majonez", price: 0, isDefault: true },
                { name: "Ketchup", price: 0, isDefault: true }
            ],
            price: 0
        },
        {
            name: "Grilled Chicken",
            description: "Grillowana pierś, sałata, cebula, sos różowy",
            hasVariants: true,
            variants: [
                { name: "150g", price: 41.99 },
                { name: "300g", price: 53.99 }
            ],
            ingredients: [
                { name: "Kurczak grillowany", price: 0, isDefault: true },
                { name: "Ogórek", price: 0, isDefault: true },
                { name: "Bułka", price: 0, isDefault: true },
                { name: "Sałata", price: 0, isDefault: true },
                { name: "Cebula", price: 0, isDefault: true },
                { name: "Sos różowy", price: 0, isDefault: true }
            ],
            price: 0
        },
    ]
  },

  // ============================================================
  // KATEGORIA: PIZZA
  // ============================================================
  {
    categoryName: "Pizza",
    description: "Średnica 32cm, sos z pomidorów pelati",
    products: [
      {
        name: "Cheese",
        description: "Tylko sos i mozzarella",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 33.99 },
            { name: "43cm", price: 56.99 },
            { name: "50cm", price: 70.99 }
        ],
        ingredients: [
            { name: "Sos pomidorowy", price: 0, isDefault: true },
            { name: "Mozzarella", price: 0, isDefault: true }
        ],
        price: 0
      },
      {
        name: "Chicken Broccoli",
        description: "Grillowany kurczak, brokuły, żółta papryka",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 40.99 },
            { name: "43cm", price: 60.99 },
            { name: "50cm", price: 75.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Grillowany kurczak", price: 0, isDefault: true },
            { name: "Brokuły", price: 0, isDefault: true },
            { name: "Papryka", price: 0, isDefault: true }
        ],
        price: 0
      },
      {
        name: "Chicken Pepperoni",
        description: "Grillowany kurczak, kiełbasa pepperoni, czosnek",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 40.99 },
            { name: "43cm", price: 60.99 },
            { name: "50cm", price: 75.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Grillowany kurczak", price: 0, isDefault: true },
            { name: "Pepperoni", price: 0, isDefault: true },
            { name: "Czosnek", price: 0, isDefault: true }
        ],
        price: 0
      },
      {
        name: "Totonno Pero 1924",
        description: "Mozzarella polana sosem pomidorowym",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 41.99 },
            { name: "43cm", price: 61.99 },
            { name: "50cm", price: 76.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Bazylia", price: 0, isDefault: true },
            { name: "Parmezan", price: 0, isDefault: true },
        ],
        price: 0
      },
      {
        name: "Spicy Pig & Chicken",
        description: "Boczek, grillowany kurczak, mozzarella, cebula prażona, BBQ",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 42.99 },
            { name: "43cm", price: 62.99 },
            { name: "50cm", price: 78.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Boczek", price: 0, isDefault: true },
            { name: "Grillowany kurczak", price: 0, isDefault: true },
            { name: "Chilli", price: 0, isDefault: true },
            { name: "Jalapeno", price: 0, isDefault: true }
        ],
        price: 0
      },
      {
        name: "Farmer's Pizza",
        description: "Kiełbasa węgierska, szynka, boczek, papryka, pieczarki, ogórek, cebula, czosnek",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 42.99 },
            { name: "43cm", price: 62.99 },
            { name: "50cm", price: 80.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Kiełbasa wiejska", price: 0, isDefault: true },
            { name: "Szynka", price: 0, isDefault: true },
            { name: "Boczek", price: 0, isDefault: true },
            { name: "Papryka", price: 0, isDefault: true },
            { name: "Pieczarki", price: 0, isDefault: true },
            { name: "Ogórek konserwowy", price: 0, isDefault: true },
            { name: "Cebula", price: 0, isDefault: true },
            { name: "Czosnek", price: 0, isDefault: true }
        ],
        price: 0
      },
      {
        name: "Hawai",
        description: "Szynka, ananas",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 40.99 },
            { name: "43cm", price: 59.99 },
            { name: "50cm", price: 77.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Szynka", price: 0, isDefault: true },
            { name: "Ananas", price: 0, isDefault: true },
            { name: "Grillowany kurczak", price: 0, isDefault: true },
        ],
        price: 0
      },
      {
        name: "Tuna",
        description: "Tuńczyk, cebula, oliwki zielone, czerwona cebula",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 40.99 },
            { name: "43cm", price: 59.99 },
            { name: "50cm", price: 77.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Tuńczyk", price: 0, isDefault: true },
            { name: "Cebula", price: 0, isDefault: true },
            { name: "Oliwki zielone", price: 0, isDefault: true },
            { name: "Czosnek", price: 0, isDefault: true },
        ],
        price: 0
      },
      {
        name: "Vege",
        description: "Kukurydza, pieczarki, cebula, papryka, oliwki",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 40.99 },
            { name: "43cm", price: 60.99 },
            { name: "50cm", price: 79.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Pomidorki cherry", price: 0, isDefault: true },
            { name: "Pieczarki", price: 0, isDefault: true },
            { name: "Cebula", price: 0, isDefault: true },
            { name: "Papryka", price: 0, isDefault: true },
            { name: "Oliwki czarne", price: 0, isDefault: true },
            { name: "Brokuł", price: 0, isDefault: true },
            { name: "Czosnek", price: 0, isDefault: true },
        ],
        price: 0
      },
      {
        name: "Italian Cheese",
        description: "Mozzarella, cheddar, parmezan",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 40.99 },
            { name: "43cm", price: 59.99 },
            { name: "50cm", price: 77.99 }
        ],
        ingredients: [
            { name: "Sos pomidorowy", price: 0, isDefault: true },
            { name: "Mozzarella", price: 0, isDefault: true },
            { name: "Gorgonzola", price: 0, isDefault: true },
            { name: "Parmezan", price: 0, isDefault: true }
        ],
        price: 0
      },
      {
        name: "Spinachi",
        description: "Kurczak grillowany, młody szpinak, czosnek",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 41.99 },
            { name: "43cm", price: 60.99 },
            { name: "50cm", price: 76.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Kurczak grillowany", price: 0, isDefault: true },
            { name: "Szpinak", price: 0, isDefault: true },
            { name: "Czosnek", price: 0, isDefault: true },
            { name: "Gorgonzola", price: 0, isDefault: true },
        ],
        price: 0
      },
      {
        name: "BBQ",
        description: "Kurczak grillowany",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 41.99 },
            { name: "43cm", price: 60.99 },
            { name: "50cm", price: 76.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Kurczak grillowany", price: 0, isDefault: true },
            { name: "Wołowina", price: 0, isDefault: true },
            { name: "Boczek", price: 0, isDefault: true },
            { name: "Papryka", price: 0, isDefault: true },
            { name: "Cebula", price: 0, isDefault: true },
            { name: "Sos BBQ", price: 0, isDefault: true },
        ],
        price: 0
      },
      {
        name: "Yummy Beef & Cheese",
        description: "wołowina",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 41.99 },
            { name: "43cm", price: 60.99 },
            { name: "50cm", price: 76.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Wołowina", price: 0, isDefault: true },
            { name: "Papryka", price: 0, isDefault: true },
            { name: "Oliwki czarne", price: 0, isDefault: true },
        ],
        price: 0
      },
      {
        name: "Extra Hot",
        description: "Hot",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 41.99 },
            { name: "43cm", price: 60.99 },
            { name: "50cm", price: 76.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Cebula", price: 0, isDefault: true },
            { name: "Peperoni", price: 0, isDefault: true },
            { name: "Oliwki zielone", price: 0, isDefault: true },
            { name: "Kabanos", price: 0, isDefault: true },
            { name: "Chilli", price: 0, isDefault: true },
            { name: "Jalapeno", price: 0, isDefault: true },
            { name: "Tabasco", price: 0, isDefault: true },
            { name: "Boczek", price: 0, isDefault: true },
        ],
        price: 0
      },
      {
        name: "Fat King",
        description: "fat",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 41.99 },
            { name: "43cm", price: 60.99 },
            { name: "50cm", price: 76.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Cebula", price: 0, isDefault: true },
            { name: "Peperoni", price: 0, isDefault: true },
            { name: "Szynka", price: 0, isDefault: true },
            { name: "Papryka", price: 0, isDefault: true },
            { name: "Fasola czerwona", price: 0, isDefault: true },
            { name: "Jalapeno", price: 0, isDefault: true },
            { name: "Boczek", price: 0, isDefault: true },
        ],
        price: 0
      },
      {
        name: "Seafood",
        description: "owoce morza",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 41.99 },
            { name: "43cm", price: 60.99 },
            { name: "50cm", price: 76.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Cebula", price: 0, isDefault: true },
            { name: "Owoce morze", price: 0, isDefault: true },
            { name: "Czosnek", price: 0, isDefault: true },
            { name: "Krewetki", price: 0, isDefault: true },
        ],
        price: 0
      },
      {
        name: "Shrimp & Chilli",
        description: "krewetki",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 41.99 },
            { name: "43cm", price: 60.99 },
            { name: "50cm", price: 76.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Cebula", price: 0, isDefault: true },
            { name: "Chilli", price: 0, isDefault: true },
            { name: "Krewetki", price: 0, isDefault: true },
        ],
        price: 0
      },
      {
        name: "Spicy Harlem",
        description: "dobra",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 41.99 },
            { name: "43cm", price: 60.99 },
            { name: "50cm", price: 76.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Cebula", price: 0, isDefault: true },
            { name: "Pieczarki", price: 0, isDefault: true },
            { name: "Tabasco", price: 0, isDefault: true },
            { name: "Szynka", price: 0, isDefault: true },
            { name: "Boczek", price: 0, isDefault: true },
            { name: "Oliwki zielone", price: 0, isDefault: true },
            { name: "Peperoni", price: 0, isDefault: true },

        ],
        price: 0
      },
      {
        name: "Classic",
        description: "klasyczna pizza",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 41.99 },
            { name: "43cm", price: 60.99 },
            { name: "50cm", price: 76.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Szynka", price: 0, isDefault: true },
            { name: "Pieczarki", price: 0, isDefault: true },

        ],
        price: 0
      },
      {
        name: "New York",
        description: "dobra",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 41.99 },
            { name: "43cm", price: 60.99 },
            { name: "50cm", price: 76.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Peperoni", price: 0, isDefault: true },
            { name: "Papryka", price: 0, isDefault: true },

        ],
        price: 0
      },
      {
        name: "Super supreme",
        description: "dobra",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 41.99 },
            { name: "43cm", price: 60.99 },
            { name: "50cm", price: 76.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Wołowina", price: 0, isDefault: true },
            { name: "Cebula", price: 0, isDefault: true },
            { name: "Papryka", price: 0, isDefault: true },
            { name: "Szynka", price: 0, isDefault: true },
            { name: "Peperoni", price: 0, isDefault: true },
            { name: "Ogórek konserwowy", price: 0, isDefault: true },
            { name: "Pomidor", price: 0, isDefault: true },
            { name: "Oliwki czarne", price: 0, isDefault: true },
        ],
        price: 0
      },
      {
        name: "Rucola & Crudo",
        description: "rukola",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 41.99 },
            { name: "43cm", price: 60.99 },
            { name: "50cm", price: 76.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Rukola", price: 0, isDefault: true },
            { name: "Pomidorki cherry", price: 0, isDefault: true },
            { name: "Crudo", price: 0, isDefault: true },
            { name: "Parmezan", price: 0, isDefault: true },
        ],
        price: 0
      }
    ]
  },

  // ============================================================
  // KATEGORIA: STARTERS / LOADED FRIES / WINGS
  // ============================================================
  {
    categoryName: "Starters & Fries",
    description: "Przystawki, frytki i skrzydełka",
    products: [
        {
            name: "Onion Rings (10 szt)",
            description: "Domowej roboty krążki cebulowe, sos BBQ",
            hasVariants: false,
            variants: [],
            ingredients: [{ name: "Sos BBQ", price: 0, isDefault: true }],
            price: 18.99
        },
        {
            name: "Fries",
            description: "Frytki",
            hasVariants: false,
            variants: [],
            ingredients: [],
            price: 12.99
        },
        {
            name: "Coleslaw",
            description: "Surówka z białej kapusty",
            hasVariants: false,
            variants: [],
            ingredients: [],
            price: 12.99
        },
        {
            name: "Chicken Tenders",
            description: "Polędwiczki z kurczaka w chrupiącej panierce",
            hasVariants: true,
            variants: [
                { name: "3 szt.", price: 27.99 },
                { name: "6 szt.", price: 42.99 },
                { name: "9 szt.", price: 54.99 }
            ],
            ingredients: [
                { name: "Kurczak panierowany", price: 0, isDefault: true },
                { name: "Sos różowy", price: 0, isDefault: true }
            ],
            price: 0
        },
        {
            name: "Hot Pepperoni Pizza Fries",
            description: "Frytki zapiekane z sosem pomidorowym, mozzarellą, pepperoni, cebulą i jalapeno",
            hasVariants: false,
            variants: [],
            ingredients: [
                { name: "Frytki", price: 0, isDefault: true },
                { name: "Sos pomidorowy", price: 0, isDefault: true },
                { name: "Mozzarella", price: 0, isDefault: true },
                { name: "Pepperoni", price: 4, isDefault: true },
                { name: "Jalapeno", price: 3, isDefault: true }
            ],
            price: 31.99
        },
        {
            name: "Spicy Buffalo Wings",
            description: "10 szt. skrzydełek w sosie Buffalo",
            hasVariants: true,
            variants: [
                { name: "10 szt.", price: 51.99 },
                { name: "15 szt.", price: 65.99 }
            ],
            ingredients: [],
            price: 0
        },
        {
            name: "Chinatown Wings",
            description: "10 szt. skrzydełek w sosie",
            hasVariants: true,
            variants: [
                { name: "10 szt.", price: 51.99 },
                { name: "15 szt.", price: 65.99 }
            ],
            ingredients: [],
            price: 0
        },
        {
            name: "BBQ Wings",
            description: "10 szt. skrzydełek w sosie",
            hasVariants: true,
            variants: [
                { name: "10 szt.", price: 51.99 },
                { name: "15 szt.", price: 65.99 }
            ],
            ingredients: [],
            price: 0
        }
    ]
  },

  // ============================================================
  // KATEGORIA: SAŁATKI
  // ============================================================
  {
    categoryName: "Sałatki",
    description: "Świeże i chrupiące",
    products: [
        {
            name: "Chicken Caesar Salad",
            description: "Grillowany kurczak, mix sałat, boczek, pomidorki, grzanki, parmezan",
            hasVariants: false,
            variants: [],
            ingredients: [
                { name: "Kurczak grillowany", price: 0, isDefault: true },
                { name: "Sałata rzymska", price: 0, isDefault: true },
                { name: "Bekon", price: 0, isDefault: true },
                { name: "Pomidorki cherry", price: 0, isDefault: true },
                { name: "Grzanki", price: 0, isDefault: true },
                { name: "Parmezan", price: 0, isDefault: true },
                { name: "Sos caesar", price: 0, isDefault: true }
            ],
            price: 39.99
        },
        {
            name: "Hawaii Grilled Chicken Salad",
            description: "Grillowany kurczak, mix sałat, rukola, pomidor, ogórek, oliwki czarne, mozzarella",
            hasVariants: false,
            variants: [],
            ingredients: [
                { name: "Kurczak grillowany", price: 0, isDefault: true },
                { name: "Mix sałat", price: 0, isDefault: true },
                { name: "Ananas", price: 0, isDefault: true },
                { name: "Sos musztardowo-miodowy", price: 0, isDefault: true },
                { name: "Cebula", price: 0, isDefault: true }
            ],
            price: 37.99
        },
        {
            name: "Premium Chicken Salad",
            description: "Grillowany kurczak, mix sałat, rukola, pomidor, ogórek, oliwki czarne, mozzarella",
            hasVariants: false,
            variants: [],
            ingredients: [
                { name: "Kurczak grillowany", price: 0, isDefault: true },
                { name: "Mix sałat", price: 0, isDefault: true },
                { name: "Ogórek", price: 0, isDefault: true },
                { name: "Pomidor", price: 0, isDefault: true },
                { name: "Sos różowy", price: 0, isDefault: true },
                { name: "Cebula", price: 0, isDefault: true }
            ],
            price: 37.99
        }
    ]
  },

  // ============================================================
  // KATEGORIA: NAPOJE
  // ============================================================
  {
    categoryName: "Napoje",
    description: "Zimne i gorące",
    products: [
      { name: "Lemoniada", hasVariants: false, variants: [], ingredients: [], price: 18.00 },
      { name: "Cola 250ml", hasVariants: false, variants: [], ingredients: [], price: 10.00 },
      { name: "Cola Zero 250ml", hasVariants: false, variants: [], ingredients: [], price: 10.00 },
      { name: "Fanta 250ml", hasVariants: false, variants: [], ingredients: [], price: 10.00 },
      { name: "Sprite 250ml", hasVariants: false, variants: [], ingredients: [], price: 10.00 },
      { name: "Kinley Tonik 250ml", hasVariants: false, variants: [], ingredients: [], price: 10.00 },
      { name: "Cappy Pomarańcza", hasVariants: false, variants: [], ingredients: [], price: 10.00 },
      { name: "Woda Niekierowana 300ml", hasVariants: false, variants: [], ingredients: [], price: 6.00 },
      { name: "Red Bull", hasVariants: false, variants: [], ingredients: [], price: 15.00 },
      { name: "Americano", hasVariants: false, variants: [], ingredients: [], price: 10.00 },
      { name: "Espresso", hasVariants: false, variants: [], ingredients: [], price: 10.00 },
      { name: "Cappuccino", hasVariants: false, variants: [], ingredients: [], price: 12.00 },
      { name: "Latte", hasVariants: false, variants: [], ingredients: [], price: 18.00 },
      { name: "Herbata", hasVariants: false, variants: [], ingredients: [], price: 10.00 }
    ]
  }
];
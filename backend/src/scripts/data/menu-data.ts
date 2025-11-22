// backend/src/scripts/data/menu-data.ts

// --- POMOCNICZE LISTY SKŁADNIKÓW ---

const pizzaBaseIngredients = [
    { name: "Sos pomidorowy", price: 0, isDefault: true },
    { name: "Mozzarella", price: 0, isDefault: true }
];

const commonBurgerIngredients = [
    { name: "Bułka wypiekana", price: 0, isDefault: true },
    { name: "Sałata", price: 0, isDefault: true },
    { name: "Pomidor", price: 0, isDefault: true },
    { name: "Pikle", price: 0, isDefault: true },
    { name: "Cebula", price: 0, isDefault: true },
    { name: "Domowe BBQ", price: 0, isDefault: true },
    { name: "Sos różowy", price: 0, isDefault: true }
];

export const menuData = [
  // ============================================================
  // KATEGORIA: PIZZE
  // ============================================================
  {
    categoryName: "Pizze",
    description: "Rozmiary: 32cm / 43cm / 50cm",
    products: [
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
        ]
      },
      {
        name: "Chicken Broccoli",
        description: "Zielona papryka, grillowany kurczak, brokuły",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 40.99 },
            { name: "43cm", price: 60.99 },
            { name: "50cm", price: 75.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Grillowany kurczak", price: 0, isDefault: true },
            { name: "Zielona papryka", price: 0, isDefault: true },
            { name: "Brokuły", price: 0, isDefault: true }
        ]
      },
      {
        name: "Totonno Pero 1924",
        description: "Klasyka: Mozzarella polana sosem, świeża bazylia, parmezan",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 38.99 },
            { name: "43cm", price: 56.99 },
            { name: "50cm", price: 75.99 }
        ],
        ingredients: [
            { name: "Mozzarella", price: 0, isDefault: true },
            { name: "Sos pomidorowy", price: 0, isDefault: true },
            { name: "Świeża bazylia", price: 0, isDefault: true },
            { name: "Parmezan", price: 0, isDefault: true }
        ]
      },
      {
        name: "Spicy Pig & Chicken",
        description: "Boczek, jalapeno, świeża chilli, grillowany kurczak",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 41.99 },
            { name: "43cm", price: 61.99 },
            { name: "50cm", price: 76.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Boczek", price: 0, isDefault: true },
            { name: "Jalapeno", price: 0, isDefault: true },
            { name: "Świeża chilli", price: 0, isDefault: true },
            { name: "Grillowany kurczak", price: 0, isDefault: true }
        ]
      },
      {
        name: "Shrimp & Chilli",
        description: "Krewetki, świeża chilli, cebula, natka pietruszki, świeże oregano",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 42.99 },
            { name: "43cm", price: 62.99 },
            { name: "50cm", price: 80.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Krewetki", price: 0, isDefault: true },
            { name: "Świeża chilli", price: 0, isDefault: true },
            { name: "Cebula", price: 0, isDefault: true },
            { name: "Natka pietruszki", price: 0, isDefault: true },
            { name: "Świeże oregano", price: 0, isDefault: true }
        ]
      },
      {
        name: "Fat King",
        description: "Kiełbasa pepperoni, szynka, zielona papryka, jalapeno, cebula, fasola, boczek",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 42.99 },
            { name: "43cm", price: 62.99 },
            { name: "50cm", price: 80.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Pepperoni", price: 0, isDefault: true },
            { name: "Szynka", price: 0, isDefault: true },
            { name: "Zielona papryka", price: 0, isDefault: true },
            { name: "Jalapeno", price: 0, isDefault: true },
            { name: "Cebula", price: 0, isDefault: true },
            { name: "Fasola", price: 0, isDefault: true },
            { name: "Boczek", price: 0, isDefault: true }
        ]
      },
      {
        name: "Seafood",
        description: "Anchois, cebula, czosnek, owoce morza",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 42.99 },
            { name: "43cm", price: 62.99 },
            { name: "50cm", price: 80.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Anchois", price: 0, isDefault: true },
            { name: "Cebula", price: 0, isDefault: true },
            { name: "Czosnek", price: 0, isDefault: true },
            { name: "Owoce morza", price: 0, isDefault: true }
        ]
      },
      {
        name: "Cheesy",
        description: "Dodatkowa Mozzarella",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 33.99 },
            { name: "43cm", price: 56.99 },
            { name: "50cm", price: 70.99 }
        ],
        ingredients: [
            { name: "Sos pomidorowy", price: 0, isDefault: true },
            { name: "Mozzarella (Double)", price: 0, isDefault: true }
        ]
      },
      {
        name: "Spicy Harlem",
        description: "Kiełbasa pepperoni, szynka, boczek, pieczarki, oliwki zielone, cebula, tabasco",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 42.99 },
            { name: "43cm", price: 62.99 },
            { name: "50cm", price: 80.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Pepperoni", price: 0, isDefault: true },
            { name: "Szynka", price: 0, isDefault: true },
            { name: "Boczek", price: 0, isDefault: true },
            { name: "Pieczarki", price: 0, isDefault: true },
            { name: "Oliwki zielone", price: 0, isDefault: true },
            { name: "Cebula", price: 0, isDefault: true },
            { name: "Tabasco", price: 0, isDefault: true }
        ]
      },
      {
        name: "Classic",
        description: "Szynka, pieczarki",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 40.99 },
            { name: "43cm", price: 60.99 },
            { name: "50cm", price: 76.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Szynka", price: 0, isDefault: true },
            { name: "Pieczarki", price: 0, isDefault: true }
        ]
      },
      {
        name: "Super Supreme",
        description: "Ogórek, pepperoni, szynka, wołowina, papryka, cebula, oliwki, pomidor",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 42.99 },
            { name: "43cm", price: 62.99 },
            { name: "50cm", price: 80.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Ogórek konserwowy", price: 0, isDefault: true },
            { name: "Pepperoni", price: 0, isDefault: true },
            { name: "Szynka", price: 0, isDefault: true },
            { name: "Wołowina", price: 0, isDefault: true },
            { name: "Papryka", price: 0, isDefault: true },
            { name: "Cebula", price: 0, isDefault: true },
            { name: "Oliwki czarne", price: 0, isDefault: true },
            { name: "Pomidor", price: 0, isDefault: true }
        ]
      },
      {
        name: "New York",
        description: "Kiełbasa pepperoni, papryka",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 41.99 },
            { name: "43cm", price: 60.99 },
            { name: "50cm", price: 80.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Pepperoni", price: 0, isDefault: true },
            { name: "Papryka", price: 0, isDefault: true }
        ]
      },
      {
        name: "Vege",
        description: "Brokuły, pieczarki, papryka, oliwki, pomidorki, cebula, czosnek",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 40.99 },
            { name: "43cm", price: 60.99 },
            { name: "50cm", price: 79.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Brokuły", price: 0, isDefault: true },
            { name: "Pieczarki", price: 0, isDefault: true },
            { name: "Papryka", price: 0, isDefault: true },
            { name: "Oliwki czarne", price: 0, isDefault: true },
            { name: "Pomidorki cherry", price: 0, isDefault: true },
            { name: "Cebula", price: 0, isDefault: true },
            { name: "Czosnek", price: 0, isDefault: true }
        ]
      },
      {
        name: "Spinachi",
        description: "Młody szpinak, gorgonzola, czosnek, grillowany kurczak",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 41.99 },
            { name: "43cm", price: 60.99 },
            { name: "50cm", price: 76.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Szpinak", price: 0, isDefault: true },
            { name: "Gorgonzola", price: 0, isDefault: true },
            { name: "Czosnek", price: 0, isDefault: true },
            { name: "Grillowany kurczak", price: 0, isDefault: true }
        ]
      },
      {
        name: "Rucola & Crudo",
        description: "Rukola, pomidorki cherry, parmezan, Prosciutto crudo",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 42.99 },
            { name: "43cm", price: 62.99 },
            { name: "50cm", price: 80.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Rukola", price: 0, isDefault: true },
            { name: "Pomidorki cherry", price: 0, isDefault: true },
            { name: "Parmezan", price: 0, isDefault: true },
            { name: "Prosciutto crudo", price: 0, isDefault: true }
        ]
      },
      {
        name: "Yummy Beef & Cheese",
        description: "Wołowina, oliwki czarne, papryka",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 40.99 },
            { name: "43cm", price: 60.99 },
            { name: "50cm", price: 79.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Wołowina", price: 0, isDefault: true },
            { name: "Oliwki czarne", price: 0, isDefault: true },
            { name: "Papryka", price: 0, isDefault: true }
        ]
      },
      {
        name: "Hawaii",
        description: "Grillowany kurczak, szynka, ananas",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 40.99 },
            { name: "43cm", price: 59.99 },
            { name: "50cm", price: 77.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Grillowany kurczak", price: 0, isDefault: true },
            { name: "Szynka", price: 0, isDefault: true },
            { name: "Ananas", price: 0, isDefault: true }
        ]
      },
      {
        name: "BBQ",
        description: "Wołowina, boczek, papryka, cebula, sos BBQ, grillowany kurczak",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 42.99 },
            { name: "43cm", price: 62.99 },
            { name: "50cm", price: 80.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Wołowina", price: 0, isDefault: true },
            { name: "Boczek", price: 0, isDefault: true },
            { name: "Papryka", price: 0, isDefault: true },
            { name: "Cebula", price: 0, isDefault: true },
            { name: "Sos BBQ", price: 0, isDefault: true },
            { name: "Grillowany kurczak", price: 0, isDefault: true }
        ]
      },
      {
        name: "Farmer's Pizza",
        description: "Kiełbasa wiejska, szynka, boczek, papryka, pieczarki, ogórek, cebula, czosnek",
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
        ]
      },
      {
        name: "Tuna",
        description: "Tuńczyk, cebula, oliwki zielone, czosnek",
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
            { name: "Czosnek", price: 0, isDefault: true }
        ]
      },
      {
        name: "Extra Hot",
        description: "Kabanos, pepperoni, boczek, oliwki, cebula, jalapeno, chilli, tabasco",
        hasVariants: true,
        variants: [
            { name: "32cm", price: 42.99 },
            { name: "43cm", price: 62.99 },
            { name: "50cm", price: 80.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients,
            { name: "Kabanos", price: 0, isDefault: true },
            { name: "Pepperoni", price: 0, isDefault: true },
            { name: "Boczek", price: 0, isDefault: true },
            { name: "Oliwki zielone", price: 0, isDefault: true },
            { name: "Cebula", price: 0, isDefault: true },
            { name: "Jalapeno", price: 0, isDefault: true },
            { name: "Świeża chilli", price: 0, isDefault: true },
            { name: "Tabasco", price: 0, isDefault: true }
        ]
      },
      {
        name: "Italian Cheese",
        description: "Mozzarella, gorgonzola, parmezan",
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
        ]
      },
      {
        name: "50/50 Pizza",
        description: "Pół na pół (wybór u obsługi)",
        hasVariants: true,
        variants: [
            { name: "43cm", price: 62.99 },
            { name: "50cm", price: 80.99 }
        ],
        ingredients: [
            ...pizzaBaseIngredients
        ]
      }
    ]
  },

  // ============================================================
  // KATEGORIA: CLASSIC BURGERS
  // ============================================================
  {
    categoryName: "Classic Burgers",
    description: "Wołowina 100%, bułka własnego wypieku",
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
            { name: "Wołowina", price: 0, isDefault: true },
            ...commonBurgerIngredients
        ],
        price: 0
      },
      {
        name: "Bacon",
        description: "Klasyk z dodatkiem chrupiącego bekonu",
        hasVariants: true,
        variants: [
            { name: "180g", price: 39.99 },
            { name: "360g", price: 51.99 }
        ],
        ingredients: [
            { name: "Wołowina", price: 0, isDefault: true },
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
            { name: "Wołowina", price: 0, isDefault: true },
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
            { name: "Wołowina", price: 0, isDefault: true },
            { name: "Ser Cheddar", price: 4, isDefault: true },
            { name: "Bekon", price: 4, isDefault: true },
            ...commonBurgerIngredients
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
            name: "Crispy Chicken",
            description: "Chrupiąca pierś z kurczaka, sałata, cebula, majonez, ketchup Heinz",
            hasVariants: true,
            variants: [
                { name: "150g", price: 39.99 },
                { name: "300g", price: 51.99 }
            ],
            ingredients: [
                { name: "Pierś z kurczaka (panierka)", price: 0, isDefault: true },
                { name: "Bułka", price: 0, isDefault: true },
                { name: "Sałata", price: 0, isDefault: true },
                { name: "Cebula", price: 0, isDefault: true },
                { name: "Majonez", price: 0, isDefault: true },
                { name: "Ketchup Heinz", price: 0, isDefault: true }
            ],
            price: 0
        },
        {
            name: "Hawaii Grilled Chicken",
            description: "Grillowana pierś, 2x cheddar, ananas, sałata, cebula, sos różowy",
            hasVariants: true,
            variants: [
                { name: "150g", price: 41.99 },
                { name: "300g", price: 53.99 }
            ],
            ingredients: [
                { name: "Grillowana pierś", price: 0, isDefault: true },
                { name: "Ser Cheddar", price: 4, isDefault: true },
                { name: "Ananas", price: 3, isDefault: true },
                { name: "Bułka", price: 0, isDefault: true },
                { name: "Sałata", price: 0, isDefault: true },
                { name: "Cebula", price: 0, isDefault: true },
                { name: "Sos różowy", price: 0, isDefault: true }
            ],
            price: 0
        },
        {
            name: "Cheesy Chicken",
            description: "Chrupiąca pierś, 3x Cheddar, sałata, cebula, majonez, ketchup",
            hasVariants: true,
            variants: [
                { name: "150g", price: 42.99 },
                { name: "300g", price: 54.99 }
            ],
            ingredients: [
                { name: "Chrupiąca pierś", price: 0, isDefault: true },
                { name: "Ser Cheddar (3x)", price: 6, isDefault: true },
                { name: "Sałata", price: 0, isDefault: true },
                { name: "Cebula", price: 0, isDefault: true },
                { name: "Majonez", price: 0, isDefault: true },
                { name: "Ketchup", price: 0, isDefault: true }
            ],
            price: 0
        }
    ]
  },

  // ============================================================
  // KATEGORIA: THE BEST OF KING BURGERS
  // ============================================================
  {
    categoryName: "King Burgers",
    description: "Specjalne kompozycje smaków",
    products: [
        {
            name: "New York",
            description: "Wołowina, 3x Bacon, 2x Cheddar, sałata, pomidor, pikle, cebula, majonez, musztarda, ketchup",
            hasVariants: true,
            variants: [
                { name: "180g", price: 43.99 },
                { name: "360g", price: 55.99 }
            ],
            ingredients: [
                { name: "Wołowina", price: 0, isDefault: true },
                { name: "Bekon (3x)", price: 0, isDefault: true },
                { name: "Ser Cheddar (2x)", price: 0, isDefault: true },
                { name: "Sałata", price: 0, isDefault: true },
                { name: "Pomidor", price: 0, isDefault: true },
                { name: "Majonez", price: 0, isDefault: true },
                { name: "Musztarda", price: 0, isDefault: true }
            ],
            price: 0
        },
        {
            name: "London",
            description: "Wołowina, ser Mimolette, grillowana cebula, jajko, domowe BBQ",
            hasVariants: true,
            variants: [
                { name: "180g", price: 42.99 },
                { name: "360g", price: 54.99 }
            ],
            ingredients: [
                { name: "Wołowina", price: 0, isDefault: true },
                { name: "Ser Mimolette", price: 0, isDefault: true },
                { name: "Grillowana cebula", price: 0, isDefault: true },
                { name: "Jajko sadzone", price: 0, isDefault: true },
                { name: "Domowe BBQ", price: 0, isDefault: true }
            ],
            price: 0
        }
    ]
  },

  // ============================================================
  // KATEGORIA: SKRZYDEŁKA (WINGS)
  // ============================================================
  {
    categoryName: "Fried Wings",
    description: "Amerykańskie skrzydełka w całości",
    products: [
        {
            name: "Spicy Buffalo Wings",
            description: "Soczyste, ostre skrzydełka w sosie Buffalo",
            hasVariants: true,
            variants: [
                { name: "10 szt.", price: 51.99 },
                { name: "15 szt.", price: 65.99 }
            ],
            ingredients: [
                { name: "Frytki", price: 0, isDefault: true },
                { name: "Sos Buffalo", price: 0, isDefault: true }
            ],
            price: 0
        },
        {
            name: "BBQ Wings",
            description: "Soczyste skrzydełka w sosie Barbecue",
            hasVariants: true,
            variants: [
                { name: "10 szt.", price: 51.99 },
                { name: "15 szt.", price: 65.99 }
            ],
            ingredients: [
                { name: "Frytki", price: 0, isDefault: true },
                { name: "Sos BBQ", price: 0, isDefault: true }
            ],
            price: 0
        },
        {
            name: "Chinatown Style Wings",
            description: "Słodko-ostre, glazura miodowo-sojowa i chilli",
            hasVariants: true,
            variants: [
                { name: "10 szt.", price: 51.99 },
                { name: "15 szt.", price: 65.99 }
            ],
            ingredients: [
                { name: "Frytki", price: 0, isDefault: true },
                { name: "Glazura miodowo-sojowa", price: 0, isDefault: true },
                { name: "Chilli", price: 0, isDefault: true }
            ],
            price: 0
        }
    ]
  },

  // ============================================================
  // KATEGORIA: STARTERS & FRIES
  // ============================================================
  {
    categoryName: "Starters & Fries",
    description: "Przystawki i frytki",
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
            name: "Chicken Tenders",
            description: "Polędwiczki z kurczaka w chrupiącej panierce, frytki, sos różowy",
            hasVariants: true,
            variants: [
                { name: "3 szt.", price: 27.99 },
                { name: "6 szt.", price: 42.99 },
                { name: "9 szt.", price: 54.99 }
            ],
            ingredients: [
                { name: "Frytki", price: 0, isDefault: true },
                { name: "Sos różowy", price: 0, isDefault: true }
            ],
            price: 0
        },
        {
            name: "Hot Pepperoni Pizza Fries",
            description: "Frytki zapiekane z sosem pomidorowym, mozzarellą i kiełbasą pepperoni",
            hasVariants: false,
            variants: [],
            ingredients: [
                { name: "Frytki", price: 0, isDefault: true },
                { name: "Mozzarella", price: 0, isDefault: true },
                { name: "Pepperoni", price: 4, isDefault: true }
            ],
            price: 31.99
        },
        {
            name: "Chicken BBQ Fries",
            description: "Frytki zapiekane z serem, grillowany kurczak, kukurydza, fasola, sos różowy",
            hasVariants: false,
            variants: [],
            ingredients: [],
            price: 38.99
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
      { name: "Cola 250ml", hasVariants: false, variants: [], ingredients: [], price: 10.00 },
      { name: "Cola Zero 250ml", hasVariants: false, variants: [], ingredients: [], price: 10.00 },
      { name: "Fanta 250ml", hasVariants: false, variants: [], ingredients: [], price: 10.00 },
      { name: "Sprite 250ml", hasVariants: false, variants: [], ingredients: [], price: 10.00 },
      { name: "Woda Niekierowana 300ml", hasVariants: false, variants: [], ingredients: [], price: 6.00 },
      { name: "Red Bull", hasVariants: false, variants: [], ingredients: [], price: 15.00 },
      { name: "Lemoniada", hasVariants: false, variants: [], ingredients: [], price: 18.00 },
      { name: "Americano", hasVariants: false, variants: [], ingredients: [], price: 10.00 },
      { name: "Espresso", hasVariants: false, variants: [], ingredients: [], price: 10.00 },
      { name: "Cappuccino", hasVariants: false, variants: [], ingredients: [], price: 12.00 },
      { name: "Latte", hasVariants: false, variants: [], ingredients: [], price: 18.00 }
    ]
  }
];
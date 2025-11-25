import { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  Typography, RadioGroup, Box, 
  IconButton, TextField, Divider, Chip 
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
// --- BAZA WIEDZY O CENACH ---
// Index 0 = 32cm, Index 1 = 43cm, Index 2 = 50cm
const PRICING_RULES = {
    VEG:   [2, 3, 4],   // Warzywa
    MEAT:  [6, 8, 10],  // Mięsne
    CHEESE:[6, 9, 12],  // Sery
    SAUCE: [2, 2, 2],   // Sosy
    OTHER: [3, 4, 5]    // Inne
};

// --- GLOBALNA LISTA WSZYSTKICH MOŻLIWYCH DODATKÓW ---
const ALL_INGREDIENTS_DB = [
    // VEG
    { name: "Cebula", type: 'VEG' },
    { name: "Czosnek", type: 'VEG' },
    { name: "Pieczarki", type: 'VEG' },
    { name: "Papryka", type: 'VEG' },
    { name: "Zielona papryka", type: 'VEG' },
    { name: "Jalapeno", type: 'VEG' },
    { name: "Świeża chilli", type: 'VEG' },
    { name: "Brokuły", type: 'VEG' },
    { name: "Szpinak", type: 'VEG' },
    { name: "Rukola", type: 'VEG' },
    { name: "Kukurydza", type: 'VEG' },
    { name: "Fasola", type: 'VEG' },
    { name: "Oliwki", type: 'VEG' },
    { name: "Oliwki czarne", type: 'VEG' },
    { name: "Oliwki zielone", type: 'VEG' },
    { name: "Pomidor", type: 'VEG' },
    { name: "Pomidorki cherry", type: 'VEG' },
    { name: "Ogórek konserwowy", type: 'VEG' },
    { name: "Ananas", type: 'VEG' },
    { name: "Świeża bazylia", type: 'VEG' },
    { name: "Świeże oregano", type: 'VEG' },
    { name: "Natka pietruszki", type: 'VEG' },
    { name: "Frytki", type: 'VEG' },

    // MEAT
    { name: "Szynka", type: 'MEAT' },
    { name: "Boczek", type: 'MEAT' },
    { name: "Salami", type: 'MEAT' },
    { name: "Pepperoni", type: 'MEAT' },
    { name: "Kiełbasa pepperoni", type: 'MEAT' },
    { name: "Kiełbasa wiejska", type: 'MEAT' },
    { name: "Kabanos", type: 'MEAT' },
    { name: "Kurczak", type: 'MEAT' },
    { name: "Grillowany kurczak", type: 'MEAT' },
    { name: "Wołowina", type: 'MEAT' },
    { name: "Prosciutto crudo", type: 'MEAT' },
    { name: "Tuńczyk", type: 'MEAT' },
    { name: "Anchois", type: 'MEAT' },
    { name: "Krewetki", type: 'MEAT' },
    { name: "Owoce morza", type: 'MEAT' },

    // CHEESE
    { name: "Mozzarella", type: 'CHEESE' },
    { name: "Mozzarella (Double)", type: 'CHEESE' },
    { name: "Ser Cheddar", type: 'CHEESE' },
    { name: "Parmezan", type: 'CHEESE' },
    { name: "Gorgonzola", type: 'CHEESE' },
    { name: "Ser Mimolette", type: 'CHEESE' },

    // SAUCE
    { name: "Sos pomidorowy", type: 'SAUCE' },
    { name: "Sos BBQ", type: 'SAUCE' },
    { name: "Sos Czosnkowy", type: 'SAUCE' },
    { name: "Tabasco", type: 'SAUCE' }
];

interface Variant {
  name: string;
  price: number;
}
interface Ingredient {
  name: string;
  price: number;
  isDefault: boolean;
}
export interface Product {
  _id: string;
  name: string;
  price: number;
  hasVariants: boolean;
  variants: Variant[];
  ingredients: Ingredient[];
  categoryId: string;
}

export interface CartItemPayload {
  product: Product;
  selectedVariant?: Variant;
  selectedIngredients: { name: string; price: number; quantity: number; isBase: boolean }[]; 
  comment: string;
  finalPrice: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (item: CartItemPayload) => void;
  initialValues?: {
    variantName?: string;
    ingredients: { name: string; quantity: number }[];
    comment: string;
  };
}

export default function ProductModal({ open, onClose, product, onAddToCart, initialValues }: Props) {
  const [variantIndex, setVariantIndex] = useState(0);
  const [ingredientsMap, setIngredientsMap] = useState<Record<string, number>>({}); 
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (product && open) {
      // 1. Wariant
      let initVarIdx = 0;
      if (initialValues?.variantName && product.hasVariants) {
        const idx = product.variants.findIndex(v => v.name === initialValues.variantName);
        if (idx >= 0) initVarIdx = idx;
      }
      setVariantIndex(initVarIdx);

      // 2. Składniki
      const initialMap: Record<string, number> = {};
      
      // Najpierw ładujemy domyślne z produktu
      product.ingredients.forEach(ing => {
        initialMap[ing.name] = ing.isDefault ? 1 : 0;
      });

      // Jeśli EDYTUJEMY, nadpisujemy ilościami z koszyka
      if (initialValues?.ingredients) {
          // Resetujemy mapę do zera przed nałożeniem edycji? 
          // Nie, bo initialValues zawierają WSZYSTKIE składniki (bazowe i dodatkowe) jakie miał item
          // Więc najlepiej wyzerować mapę i wgrać to co w initialValues
          Object.keys(initialMap).forEach(k => initialMap[k] = 0); // Reset
          
          initialValues.ingredients.forEach(ing => {
              initialMap[ing.name] = ing.quantity;
          });
      }

      setIngredientsMap(initialMap);

      // 3. Komentarz
      setComment(initialValues?.comment || '');
    }
  }, [product, open, initialValues]);

  if (!product) return null;

  // --- LOGIKA CENOWA ---
  const getIngredientPrice = (name: string): number => {
    const ingDef = ALL_INGREDIENTS_DB.find(i => i.name === name);
    const type = ingDef ? ingDef.type : 'OTHER';
    // @ts-ignore
    const prices = PRICING_RULES[type] || PRICING_RULES.OTHER;
    // Zabezpieczenie: jeśli variantIndex wykracza poza tablicę, bierzemy ostatnią cenę
    return prices[Math.min(variantIndex, prices.length - 1)];
  };

  const isDefaultIngredient = (name: string): boolean => {
    return product.ingredients.some(i => i.name === name && i.isDefault);
  };

  // --- PRZYGOTOWANIE LIST ---
  // 1. Składniki bazowe (te co są w pizzy)
  const baseIngredients = product.ingredients;

  // 2. Dodatki (Wszystko z bazy MINUS to co jest w pizzy)
  const possibleExtras = ALL_INGREDIENTS_DB.filter(extra => 
    !baseIngredients.some(base => base.name === extra.name)
  ).sort((a, b) => a.type.localeCompare(b.type)); // Sortowanie typami

  // --- KALKULACJA SUMY ---
  const basePrice = product.hasVariants && product.variants.length > 0
    ? product.variants[variantIndex].price
    : product.price;

  const ingredientsTotal = Object.entries(ingredientsMap).reduce((sum, [name, qty]) => {
    if (qty === 0) return sum;
    const price = getIngredientPrice(name);
    const isDefault = isDefaultIngredient(name);
    const chargeableQty = isDefault ? Math.max(0, qty - 1) : qty;
    return sum + (chargeableQty * price);
  }, 0);

  const finalPrice = basePrice + ingredientsTotal;

  // --- HANDLERY ---
  const handleIngredientChange = (name: string, delta: number) => {
    setIngredientsMap(prev => ({
      ...prev,
      [name]: Math.max(0, (prev[name] || 0) + delta)
    }));
  };

  const handleConfirm = () => {
    const selectedIngs = Object.entries(ingredientsMap)
      .filter(([_, qty]) => qty > 0)
      .map(([name, qty]) => {
        const isBase = product.ingredients.some(i => i.name === name && i.isDefault);
        
        return {
          name,
          price: getIngredientPrice(name),
          quantity: qty,
          isBase: isBase
        };
      });

    onAddToCart({
      product,
      selectedVariant: product.hasVariants ? product.variants[variantIndex] : undefined,
      selectedIngredients: selectedIngs,
      comment,
      finalPrice
    });
    onClose();
  };

  const renderIngredientRow = (name: string, isDefault: boolean) => {
    const qty = ingredientsMap[name] || 0;
    const currentPrice = getIngredientPrice(name);

    return (
      <Box key={name} display="flex" justifyContent="space-between" alignItems="center" mb={1} 
           sx={{ opacity: (isDefault && qty === 0) ? 0.5 : 1 }}>
        <Box>
          <Typography variant="body1" fontWeight={isDefault ? "bold" : "normal"}>
            {name} {isDefault && <Chip label="W cenie" size="small" color="primary" variant="outlined" sx={{ ml: 1, height: 20, fontSize: '0.6rem' }} />}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {isDefault ? `Dodatek: +${currentPrice} zł` : `Cena: +${currentPrice} zł`}
          </Typography>
        </Box>
        
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => handleIngredientChange(name, -1)} color={qty === 0 ? "default" : "error"} size="small">
            <RemoveCircleOutlineIcon />
          </IconButton>
          <Typography variant="h6" sx={{ mx: 2, width: 20, textAlign: 'center' }}>
            {qty}
          </Typography>
          <IconButton onClick={() => handleIngredientChange(name, 1)} color="success" size="small">
            <AddCircleOutlineIcon />
          </IconButton>
        </Box>
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper">
      <DialogTitle sx={{ bgcolor: '#1a2027', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
            <Typography variant="h6">{product.name}</Typography>
            {product.hasVariants && <Typography variant="caption" sx={{ opacity: 0.8 }}>Rozmiar wpływa na cenę dodatków</Typography>}
        </Box>
        <Typography variant="h5" fontWeight="bold">{finalPrice.toFixed(2)} zł</Typography>
      </DialogTitle>
      
      <DialogContent dividers>
        {/* WYBÓR ROZMIARU (Bez Grida, czysty Flexbox) */}
        {product.hasVariants && (
          <Box mb={3}>
            <RadioGroup row value={variantIndex} onChange={(e) => setVariantIndex(Number(e.target.value))}>
              <Box display="flex" flexWrap="wrap" gap={2}>
                  {product.variants.map((variant, idx) => (
                    <Box 
                        key={idx}
                        onClick={() => setVariantIndex(idx)}
                        sx={{ 
                            border: variantIndex === idx ? '2px solid #1976d2' : '1px solid #e0e0e0',
                            borderRadius: 2,
                            p: 1.5,
                            cursor: 'pointer',
                            bgcolor: variantIndex === idx ? '#e3f2fd' : 'white',
                            textAlign: 'center',
                            minWidth: 80,
                            boxShadow: variantIndex === idx ? 3 : 0
                        }}
                    >
                        <Typography fontWeight="bold">{variant.name}</Typography>
                        <Typography variant="body2">{variant.price} zł</Typography>
                    </Box>
                  ))}
              </Box>
            </RadioGroup>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* SKŁADNIKI BAZOWE */}
        <Box mb={3}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>SKŁADNIKI W PIZZY</Typography>
          {baseIngredients.map(ing => renderIngredientRow(ing.name, true))}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* DODATKI PŁATNE */}
        <Box mb={3}>
           <Typography variant="subtitle2" color="text.secondary" gutterBottom>DODATKI PŁATNE</Typography>
           {possibleExtras.map(extra => renderIngredientRow(extra.name, false))}
        </Box>

        <Divider sx={{ my: 2 }} />
        
        <TextField
          fullWidth
          label="Komentarz"
          multiline
          rows={2}
          variant="outlined"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: '#f5f5f5' }}>
        <Button onClick={onClose} color="inherit" size="large">Anuluj</Button>
        <Button onClick={handleConfirm} variant="contained" size="large" color="success" sx={{ px: 4 }}>
          ZATWIERDŹ
        </Button>
      </DialogActions>
    </Dialog>
  );
}
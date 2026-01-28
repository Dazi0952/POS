import { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  Typography, RadioGroup, Box, 
  IconButton, TextField, Divider, Chip 
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';




const PRICING_RULES = {
    VEG:   [2, 3, 4],
    MEAT:  [6, 8, 10],
    CHEESE:[6, 9, 12],
    SAUCE: [2, 2, 2],
    OTHER: [3, 4, 5]
};





const ALL_INGREDIENTS_DB = [
    
    { name: "Boczek", type: 'MEAT', scope: ['ALL'] },
    { name: "Bekon", type: 'MEAT', scope: ['ALL'] },
    { name: "Cebula", type: 'VEG', scope: ['ALL'] },
    { name: "Cebula czerwona", type: 'VEG', scope: ['ALL'] },
    { name: "Jalapeno", type: 'VEG', scope: ['ALL'] },
    { name: "Świeża chilli", type: 'VEG', scope: ['ALL'] },
    { name: "Pomidor", type: 'VEG', scope: ['ALL'] },
    { name: "Pieczarki", type: 'VEG', scope: ['ALL'] },
    { name: "Kurczak", type: 'MEAT', scope: ['ALL'] },
    { name: "Grillowany kurczak", type: 'MEAT', scope: ['ALL'] },
    { name: "Wołowina", type: 'MEAT', scope: ['ALL'] },
    { name: "Sos BBQ", type: 'SAUCE', scope: ['ALL'] },
    { name: "Sos Czosnkowy", type: 'SAUCE', scope: ['ALL'] },
    { name: "Rukola", type: 'VEG', scope: ['ALL'] },

    
    { name: "Ser Cheddar", type: 'CHEESE', scope: ['BURGER'] },
    { name: "Ser Mimolette", type: 'CHEESE', scope: ['BURGER'] },
    { name: "Pikle", type: 'VEG', scope: ['BURGER'] },
    { name: "Ogórek", type: 'VEG', scope: ['BURGER'] },
    { name: "Ogórek konserwowy", type: 'VEG', scope: ['BURGER'] },
    { name: "Cebula prażona", type: 'VEG', scope: ['BURGER'] },
    { name: "Jajko sadzone", type: 'OTHER', scope: ['BURGER'] },
    { name: "Majonez", type: 'SAUCE', scope: ['BURGER'] },
    { name: "Ketchup", type: 'SAUCE', scope: ['BURGER'] },
    { name: "Musztarda", type: 'SAUCE', scope: ['BURGER'] },
    { name: "Sos różowy", type: 'SAUCE', scope: ['BURGER'] },
    { name: "Sos Chimichurri", type: 'SAUCE', scope: ['BURGER'] },
    { name: "Nachos", type: 'OTHER', scope: ['BURGER'] },
    { name: "Sałata", type: 'VEG', scope: ['BURGER'] },
    { name: "Bułka wypiekana", type: 'OTHER', scope: ['BURGER'] },

    
    { name: "Mozzarella", type: 'CHEESE', scope: ['PIZZA'] },
    { name: "Mozzarella (Double)", type: 'CHEESE', scope: ['PIZZA'] },
    { name: "Parmezan", type: 'CHEESE', scope: ['PIZZA'] },
    { name: "Gorgonzola", type: 'CHEESE', scope: ['PIZZA'] },
    { name: "Kukurydza", type: 'VEG', scope: ['PIZZA'] },
    { name: "Brokuły", type: 'VEG', scope: ['PIZZA'] },
    { name: "Szpinak", type: 'VEG', scope: ['PIZZA'] },
    { name: "Ananas", type: 'VEG', scope: ['PIZZA'] },
    { name: "Oliwki", type: 'VEG', scope: ['PIZZA'] },
    { name: "Oliwki czarne", type: 'VEG', scope: ['PIZZA'] },
    { name: "Oliwki zielone", type: 'VEG', scope: ['PIZZA'] },
    { name: "Krewetki", type: 'MEAT', scope: ['PIZZA'] },
    { name: "Anchois", type: 'MEAT', scope: ['PIZZA'] },
    { name: "Tabasco", type: 'SAUCE', scope: ['PIZZA'] },
    { name: "Sos pomidorowy", type: 'SAUCE', scope: ['PIZZA'] },
    { name: "Świeża bazylia", type: 'VEG', scope: ['PIZZA'] },
    { name: "Świeże oregano", type: 'VEG', scope: ['PIZZA'] },
    { name: "Pepperoni", type: 'MEAT', scope: ['PIZZA'] },
    { name: "Salami", type: 'MEAT', scope: ['PIZZA'] },
    { name: "Kiełbasa wiejska", type: 'MEAT', scope: ['PIZZA'] },
    { name: "Szynka", type: 'MEAT', scope: ['PIZZA'] }
];

interface Variant { name: string; price: number; }
interface Ingredient { name: string; price: number; isDefault: boolean; }
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

  
  const getProductType = (): 'PIZZA' | 'BURGER' | 'OTHER' => {
      if (!product) return 'OTHER';
      
      
      const variantNames = product.variants.map(v => v.name.toLowerCase()).join(' ');
      
      if (variantNames.includes('cm')) return 'PIZZA';
      if (variantNames.includes('180g') || variantNames.includes('360g') || variantNames.includes('150g') || variantNames.includes('300g') || variantNames.includes('540g')|| variantNames.includes('260g')) return 'BURGER';
      
      
      const name = product.name.toLowerCase();
      if (name.includes('pizza')) return 'PIZZA';
      if (name.includes('burger')) return 'BURGER';
      
      return 'OTHER';
  };

  useEffect(() => {
    if (product && open) {
      
      let initVarIdx = 0;
      if (initialValues?.variantName && product.hasVariants) {
        const idx = product.variants.findIndex(v => v.name === initialValues.variantName);
        if (idx >= 0) initVarIdx = idx;
      }
      setVariantIndex(initVarIdx);

      
      const initialMap: Record<string, number> = {};
      
      
      product.ingredients.forEach(ing => {
        initialMap[ing.name] = ing.isDefault ? 1 : 0;
      });

      
      if (initialValues?.ingredients) {
          Object.keys(initialMap).forEach(k => initialMap[k] = 0); 
          initialValues.ingredients.forEach(ing => {
              initialMap[ing.name] = ing.quantity;
          });
      }

      setIngredientsMap(initialMap);
      setComment(initialValues?.comment || '');
    }
  }, [product, open, initialValues]);

  if (!product) return null;

  
  const getIngredientPrice = (name: string): number => {
    const ingDef = ALL_INGREDIENTS_DB.find(i => i.name === name);
    const type = ingDef ? ingDef.type : 'OTHER';
    // @ts-ignore
    const prices = PRICING_RULES[type] || PRICING_RULES.OTHER;
    return prices[Math.min(variantIndex, prices.length - 1)];
  };

  const isDefaultIngredient = (name: string): boolean => {
    return product.ingredients.some(i => i.name === name && i.isDefault);
  };

  
  const currentProductType = getProductType();
  const baseIngredients = product.ingredients;

  
  
  
  const possibleExtras = ALL_INGREDIENTS_DB.filter(extra => {
    const isAlreadyInBase = baseIngredients.some(base => base.name === extra.name);
    if (isAlreadyInBase) return false;

    
    if (extra.scope.includes('ALL')) return true;
    if (extra.scope.includes(currentProductType)) return true;
    
    return false;
  }).sort((a, b) => a.type.localeCompare(b.type));

  
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

  
  const handleIngredientChange = (name: string, delta: number) => {
    setIngredientsMap(prev => ({
      ...prev,
      [name]: Math.max(0, (prev[name] || 0) + delta)
    }));
  };

  const handleConfirm = () => {
    const selectedIngs = Object.entries(ingredientsMap)
      .filter(([name, qty]) => {
        const isBase = isDefaultIngredient(name);
        
        return qty > 0 || isBase;
      })
      .map(([name, qty]) => ({
        name,
        price: getIngredientPrice(name),
        quantity: qty,
        isBase: isDefaultIngredient(name)
      }));

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
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Typ: {currentProductType === 'PIZZA' ? 'Pizza' : currentProductType === 'BURGER' ? 'Burger' : 'Inne'}
            </Typography>
        </Box>
        <Typography variant="h5" fontWeight="bold">{finalPrice.toFixed(2)} zł</Typography>
      </DialogTitle>
      
      <DialogContent dividers>
        
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

        
        <Box mb={3}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>SKŁADNIKI BAZOWE</Typography>
          {baseIngredients.map(ing => renderIngredientRow(ing.name, true))}
        </Box>

        <Divider sx={{ my: 2 }} />

        
        <Box mb={3}>
           <Typography variant="subtitle2" color="text.secondary" gutterBottom>DODATKI PŁATNE (Dopasowane)</Typography>
           {possibleExtras.map(extra => renderIngredientRow(extra.name, false))}
           {possibleExtras.length === 0 && <Typography variant="caption" fontStyle="italic">Brak dodatków dla tej kategorii.</Typography>}
        </Box>

        <Divider sx={{ my: 2 }} />
        
        <TextField
          fullWidth
          label="Komentarz / Instrukcje"
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
          {initialValues ? 'ZAPISZ ZMIANY' : 'DODAJ'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
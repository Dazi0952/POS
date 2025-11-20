import { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  Typography, RadioGroup, FormControlLabel, Radio, Box, 
  IconButton, TextField, Divider, Chip 
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

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
  selectedIngredients: { name: string; price: number; quantity: number }[];
  comment: string;
  finalPrice: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (item: CartItemPayload) => void;
}

export default function ProductModal({ open, onClose, product, onAddToCart }: Props) {
  const [variantIndex, setVariantIndex] = useState(0);
  const [ingredientsMap, setIngredientsMap] = useState<Record<string, number>>({}); // "Ser": 1
  const [comment, setComment] = useState('');
  useEffect(() => {
    if (product) {
      setVariantIndex(0);
      const initialMap: Record<string, number> = {};
      product.ingredients.forEach(ing => {
        initialMap[ing.name] = ing.isDefault ? 1 : 0;
      });
      setIngredientsMap(initialMap);
      setComment('');
    }
  }, [product]);

  if (!product) return null;
  const basePrice = product.hasVariants && product.variants.length > 0
    ? product.variants[variantIndex].price
    : product.price;

  const ingredientsPrice = product.ingredients.reduce((sum, ing) => {
    const qty = ingredientsMap[ing.name] || 0;
    const extraQty = Math.max(0, qty - (ing.isDefault ? 1 : 0));
    return sum + (extraQty * ing.price);
  }, 0);

  const finalPrice = basePrice + ingredientsPrice;

  const handleIngredientChange = (name: string, delta: number) => {
    setIngredientsMap(prev => ({
      ...prev,
      [name]: Math.max(0, (prev[name] || 0) + delta)
    }));
  };

  const handleConfirm = () => {
    const selectedIngs = product.ingredients
      .filter(ing => ingredientsMap[ing.name] > 0)
      .map(ing => ({
        name: ing.name,
        price: ing.price,
        quantity: ingredientsMap[ing.name]
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
        <Box>{product.name}</Box>
        <Box>{finalPrice.toFixed(2)} zł</Box>
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2 }}>
        {product.hasVariants && (
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight="bold">Rozmiar:</Typography>
            <RadioGroup row value={variantIndex} onChange={(e) => setVariantIndex(Number(e.target.value))}>
              {product.variants.map((variant, idx) => (
                <FormControlLabel 
                  key={idx} 
                  value={idx} 
                  control={<Radio />} 
                  label={`${variant.name} (${variant.price} zł)`} 
                />
              ))}
            </RadioGroup>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Składniki:</Typography>
          {product.ingredients.map((ing) => {
            const qty = ingredientsMap[ing.name] || 0;
            return (
              <Box key={ing.name} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Box>
                  <Typography variant="body1">
                    {ing.name} {ing.isDefault && <Chip label="Std" size="small" color="default" sx={{ ml: 1, height: 20 }} />}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Dodatkowa porcja: +{ing.price} zł
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center">
                  <IconButton onClick={() => handleIngredientChange(ing.name, -1)} color="error">
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                  <Typography variant="h6" sx={{ mx: 2, width: 20, textAlign: 'center' }}>
                    {qty}
                  </Typography>
                  <IconButton onClick={() => handleIngredientChange(ing.name, 1)} color="success">
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Box>
              </Box>
            );
          })}
        </Box>

        <Divider sx={{ my: 2 }} />
        <TextField
          fullWidth
          label="Komentarz do pozycji (np. mocno wypieczona)"
          multiline
          rows={2}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">Anuluj</Button>
        <Button onClick={handleConfirm} variant="contained" size="large" color="success">
          DODAJ DO KOSZYKA ({finalPrice.toFixed(2)} zł)
        </Button>
      </DialogActions>
    </Dialog>
  );
}
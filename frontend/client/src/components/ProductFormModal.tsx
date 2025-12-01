import { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  TextField, Box, Grid, IconButton, Typography, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl, Autocomplete 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import api from '../api/axios';

// Typy danych
export interface ProductData {
  _id?: string;
  name: string;
  price: number;
  categoryId: string;
  hasVariants: boolean;
  variants: { name: string; price: number }[];
  ingredients: { name: string; price: number; isDefault: boolean }[];
  isAvailable: boolean;
}

interface Category { _id: string; name: string; }

// Interfejs składnika z bazy (do podpowiedzi)
interface IngredientOption {
    name: string;
    category: string;
    price: number;
    validCategories?: string[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: ProductData) => void;
  initialData?: ProductData | null;
  categories: Category[];
}

export default function ProductFormModal({ open, onClose, onSave, initialData, categories }: Props) {
  // Stan formularza
  const [formData, setFormData] = useState<ProductData>({
    name: '',
    price: 0,
    categoryId: '',
    hasVariants: false,
    variants: [],
    ingredients: [],
    isAvailable: true
  });

  // Lista składników z bazy (do autouzupełniania)
  const [availableIngredients, setAvailableIngredients] = useState<IngredientOption[]>([]);

  // 1. ŁADOWANIE DANYCH I SKŁADNIKÓW
  useEffect(() => {
    if (open) {
        // Pobierz listę składników z bazy do podpowiedzi
        api.get('/ingredients').then(res => setAvailableIngredients(res.data));

        if (initialData) {
            // TRYB EDYCJI: Ładujemy dane istniejącego produktu
            setFormData({
                ...initialData,
                // Zabezpieczenie: jeśli tablice są undefined, zamień na puste []
                variants: initialData.variants || [],
                ingredients: initialData.ingredients || [] 
            });
        } else {
            // TRYB DODAWANIA: Reset formularza
            setFormData({
                name: '',
                price: 0,
                categoryId: categories.length > 0 ? categories[0]._id : '',
                hasVariants: false,
                variants: [],
                ingredients: [], // Pusta lista na start
                isAvailable: true
            });
        }
    }
  }, [open, initialData, categories]);

  // Handlery pól prostych
  const handleChange = (field: keyof ProductData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- LOGIKA WARIANTÓW ---
  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { name: '', price: 0 }]
    }));
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const updateVariant = (index: number, field: 'name' | 'price', value: any) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  // --- LOGIKA SKŁADNIKÓW ---
  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', price: 0, isDefault: true }]
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index: number, field: string, value: any) => {
    const newIngs = [...formData.ingredients];
    // @ts-ignore
    newIngs[index] = { ...newIngs[index], [field]: value };
    setFormData(prev => ({ ...prev, ingredients: newIngs }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.categoryId) {
        alert("Uzupełnij nazwę i kategorię!");
        return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{initialData ? 'Edytuj Produkt' : 'Nowy Produkt'}</DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={2}>
            {/* NAZWA I KATEGORIA */}
            <Grid size={{ xs: 12}}>
                <TextField 
                    fullWidth label="Nazwa Produktu" 
                    value={formData.name} onChange={e => handleChange('name', e.target.value)} 
                />
            </Grid>
            <Grid size={{ xs: 12}}>
                <FormControl fullWidth>
                    <InputLabel>Kategoria</InputLabel>
                    <Select 
                        value={formData.categoryId} 
                        label="Kategoria"
                        onChange={e => handleChange('categoryId', e.target.value)}
                    >
                        {categories.map(cat => (
                            <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            {/* CENA BAZOWA (JEŚLI BRAK WARIANTÓW) */}
            <Grid size={{ xs: 12}}>
                <FormControlLabel 
                    control={<Checkbox checked={formData.hasVariants} onChange={e => handleChange('hasVariants', e.target.checked)} />} 
                    label="Produkt ma warianty (np. rozmiary)" 
                />
                {!formData.hasVariants && (
                    <TextField 
                        label="Cena (zł)" type="number" 
                        value={formData.price} onChange={e => handleChange('price', parseFloat(e.target.value))} 
                        sx={{ ml: 2, width: 150 }}
                    />
                )}
            </Grid>

            {/* LISTA WARIANTÓW */}
            {formData.hasVariants && (
                <Grid size={{ xs: 12}}>
                    <Box bgcolor="#e3f2fd" p={2} borderRadius={2}>
                        <Typography variant="subtitle2" fontWeight="bold">WARIANTY</Typography>
                        {formData.variants.map((variant, idx) => (
                            <Box key={idx} display="flex" gap={1} mt={1} alignItems="center">
                                <TextField 
                                    placeholder="Nazwa (np. 32cm)" size="small" 
                                    value={variant.name} onChange={e => updateVariant(idx, 'name', e.target.value)}
                                />
                                <TextField 
                                    placeholder="Cena" type="number" size="small" sx={{ width: 100 }}
                                    value={variant.price} onChange={e => updateVariant(idx, 'price', parseFloat(e.target.value))}
                                />
                                <IconButton color="error" onClick={() => removeVariant(idx)}><DeleteIcon /></IconButton>
                            </Box>
                        ))}
                        <Button startIcon={<AddCircleIcon />} onClick={addVariant} sx={{ mt: 1 }}>Dodaj Wariant</Button>
                    </Box>
                </Grid>
            )}

            {/* LISTA SKŁADNIKÓW Z PODPOWIEDZIAMI */}
            <Grid size={{ xs: 12}}>
                <Box bgcolor="#f5f5f5" p={2} borderRadius={2}>
                    <Typography variant="subtitle2" fontWeight="bold">SKŁADNIKI (W cenie)</Typography>
                    <Typography variant="caption" color="text.secondary">Zdefiniuj co wchodzi w skład tego dania.</Typography>
                    
                    {formData.ingredients.map((ing, idx) => (
                        <Box key={idx} display="flex" gap={1} mt={1} alignItems="center">
                            
                            {/* AUTOCOMPLETE Z FILTROWANIEM KATEGORII */}
                            <Autocomplete
                                freeSolo
                                options={availableIngredients
                                    .filter(dbIng => {
                                        // Jeśli składnik nie ma ograniczeń kategorii -> pokaż
                                        if (!dbIng.validCategories || dbIng.validCategories.length === 0) return true;
                                        // Jeśli ma ograniczenia -> sprawdź czy pasuje do kategorii tego produktu
                                        return dbIng.validCategories.includes(formData.categoryId);
                                    })
                                    .map(i => i.name)
                                }
                                value={ing.name}
                                onChange={(_event, newValue) => {
                                    // Wybrano z listy
                                    updateIngredient(idx, 'name', newValue);
                                    
                                    // (Opcjonalnie: tu można by pobierać cenę, ale w edytorze 
                                    // definiujemy składniki bazowe, które zazwyczaj mają cenę 0 w ramach pizzy,
                                    // więc nie nadpisujemy ceny automatycznie na płatną)
                                }}
                                onInputChange={(_event, newInputValue) => {
                                    // Wpisano ręcznie
                                    updateIngredient(idx, 'name', newInputValue);
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Składnik" size="small" fullWidth />
                                )}
                                sx={{ flex: 1 }}
                            />

                            <FormControlLabel 
                                control={
                                    <Checkbox 
                                        checked={ing.isDefault} 
                                        onChange={e => updateIngredient(idx, 'isDefault', e.target.checked)} 
                                        size="small"
                                    />
                                }
                                label="Domyślny"
                            />
                            <IconButton color="error" onClick={() => removeIngredient(idx)}><DeleteIcon /></IconButton>
                        </Box>
                    ))}
                    <Button startIcon={<AddCircleIcon />} onClick={addIngredient} sx={{ mt: 1 }}>Dodaj Składnik</Button>
                </Box>
            </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">Anuluj</Button>
        <Button onClick={handleSubmit} variant="contained" color="success">ZAPISZ</Button>
      </DialogActions>
    </Dialog>
  );
}
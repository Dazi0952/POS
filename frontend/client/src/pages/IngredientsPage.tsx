import { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
  Container, Typography, Box, Paper, Table, TableBody, TableCell, 
  TableHead, TableRow, Button, TextField, Select, MenuItem, IconButton, Chip, FormControl, InputLabel, OutlinedInput 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from 'react-router-dom';

interface Ingredient {
  _id: string;
  name: string;
  category: string;
  price: number;
  validCategories: string[]; // ID kategorii
}

interface Category { _id: string; name: string; }

export const IngredientsPage = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // Lista kategorii z menu
  
  // Stan formularza (Dodawanie / Edycja)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formType, setFormType] = useState('VEG');
  const [formCats, setFormCats] = useState<string[]>([]); // Wybrane kategorie

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [resIng, resCat] = await Promise.all([
          api.get('/ingredients'),
          api.get('/menu') // Pobieramy kategorie z menu
      ]);
      setIngredients(resIng.data);
      setCategories(resCat.data.categories);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleEdit = (ing: Ingredient) => {
      setEditingId(ing._id);
      setFormName(ing.name);
      setFormPrice(ing.price.toString());
      setFormType(ing.category);
      setFormCats(ing.validCategories || []);
  };

  const handleCancelEdit = () => {
      setEditingId(null);
      setFormName(''); setFormPrice(''); setFormType('VEG'); setFormCats([]);
  };

  const handleSave = async () => {
    if (!formName) return;
    const payload = {
        name: formName,
        price: parseFloat(formPrice) || 0,
        category: formType,
        validCategories: formCats
    };

    if (editingId) {
        await api.put(`/ingredients/${editingId}`, payload);
    } else {
        await api.post('/ingredients', payload);
    }
    handleCancelEdit();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm("Usunąć?")) return;
    await api.delete(`/ingredients/${id}`);
    fetchData();
  };

  // Helper do wyświetlania nazw kategorii w tabeli
  const getCatNames = (ids: string[]) => {
      if (!ids || ids.length === 0) return <Chip label="Wszystkie" size="small" variant="outlined" />;
      return ids.map(id => {
          const cat = categories.find(c => c._id === id);
          return cat ? <Chip key={id} label={cat.name} size="small" sx={{ mr: 0.5 }} /> : null;
      });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 10 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/menu')} sx={{ mb: 2 }}>
        Wróć do Menu
      </Button>

      <Typography variant="h4" fontWeight="bold" mb={3}>Baza Składników</Typography>
      
      {/* FORMULARZ */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: editingId ? '#e3f2fd' : 'white', border: editingId ? '1px solid #2196f3' : 'none' }}>
        <Typography variant="h6" gutterBottom>{editingId ? 'Edytuj Składnik' : 'Nowy Składnik'}</Typography>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
            <TextField label="Nazwa" value={formName} onChange={e => setFormName(e.target.value)} size="small" sx={{ minWidth: 200 }} />
            <TextField label="Cena" type="number" value={formPrice} onChange={e => setFormPrice(e.target.value)} size="small" sx={{ width: 100 }} />
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Typ</InputLabel>
                <Select value={formType} label="Typ" onChange={e => setFormType(e.target.value)}>
                    <MenuItem value="VEG">Warzywa</MenuItem>
                    <MenuItem value="MEAT">Mięso</MenuItem>
                    <MenuItem value="CHEESE">Ser</MenuItem>
                    <MenuItem value="SAUCE">Sos</MenuItem>
                    <MenuItem value="OTHER">Inne</MenuItem>
                </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 200, maxWidth: 300 }}>
                <InputLabel>Pasuje do kategorii</InputLabel>
                <Select
                    multiple
                    value={formCats}
                    onChange={(e) => setFormCats(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                    input={<OutlinedInput label="Pasuje do kategorii" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => {
                                const cat = categories.find(c => c._id === value);
                                return <Chip key={value} label={cat?.name || '???'} size="small" />;
                            })}
                        </Box>
                    )}
                >
                    {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Button variant="contained" startIcon={editingId ? <SaveIcon /> : <AddIcon />} onClick={handleSave} color={editingId ? "warning" : "primary"}>
                {editingId ? 'ZAPISZ' : 'DODAJ'}
            </Button>
            {editingId && <Button onClick={handleCancelEdit}>Anuluj</Button>}
        </Box>
        <Typography variant="caption" color="text.secondary" mt={1}>
            * Jeśli nie wybierzesz żadnej kategorii, składnik będzie dostępny dla wszystkich dań.
        </Typography>
      </Paper>

      {/* LISTA */}
      <Paper>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Nazwa</TableCell>
                    <TableCell>Typ</TableCell>
                    <TableCell>Cena</TableCell>
                    <TableCell>Pasuje do</TableCell>
                    <TableCell>Akcja</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {ingredients.map(ing => (
                    <TableRow key={ing._id} hover onClick={() => handleEdit(ing)} sx={{ cursor: 'pointer' }}>
                        <TableCell sx={{ fontWeight: "bold" }}>{ing.name}</TableCell>
                        <TableCell>
                            <Chip label={ing.category} size="small" color={ing.category === 'MEAT' ? 'error' : ing.category === 'VEG' ? 'success' : 'default'} />
                        </TableCell>
                        <TableCell>{ing.price.toFixed(2)} zł</TableCell>
                        <TableCell>{getCatNames(ing.validCategories)}</TableCell>
                        <TableCell>
                            <IconButton color="error" onClick={(e) => { e.stopPropagation(); handleDelete(ing._id); }}><DeleteIcon /></IconButton>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};
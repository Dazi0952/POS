import { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableHead, TableRow, Button, TextField, Select, MenuItem, IconButton, Chip 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

interface Ingredient {
  _id: string;
  name: string;
  category: string;
  price: number;
}

export const IngredientsPage = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('OTHER');
  const navigate = useNavigate();

  const fetchIngredients = async () => {
    try {
      const res = await api.get('/ingredients');
      setIngredients(res.data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchIngredients(); }, []);

  const handleAdd = async () => {
    if (!newName) return;
    await api.post('/ingredients', {
        name: newName,
        price: parseFloat(newPrice) || 0,
        category: newCategory
    });
    setNewName(''); setNewPrice(''); fetchIngredients();
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm("Usunąć składnik z bazy?")) return;
    await api.delete(`/ingredients/${id}`);
    fetchIngredients();
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/menu')} sx={{ mb: 2 }}>
        Wróć do Menu
      </Button>

      <Typography variant="h4" fontWeight="bold" mb={3}>Baza Składników</Typography>
      
      {/* FORMULARZ */}
      <Paper sx={{ p: 2, mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField label="Nazwa (np. Boczek)" value={newName} onChange={e => setNewName(e.target.value)} size="small" fullWidth />
        <TextField label="Cena (np. 6)" type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} size="small" sx={{ width: 120 }} />
        <Select value={newCategory} onChange={e => setNewCategory(e.target.value)} size="small">
            <MenuItem value="VEG">Warzywa (VEG)</MenuItem>
            <MenuItem value="MEAT">Mięso (MEAT)</MenuItem>
            <MenuItem value="CHEESE">Ser (CHEESE)</MenuItem>
            <MenuItem value="SAUCE">Sos (SAUCE)</MenuItem>
            <MenuItem value="OTHER">Inne</MenuItem>
        </Select>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>DODAJ</Button>
      </Paper>

      {/* LISTA */}
      <Paper>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Nazwa</TableCell>
                    <TableCell>Kategoria</TableCell>
                    <TableCell>Cena Bazowa</TableCell>
                    <TableCell>Akcja</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {ingredients.map(ing => (
                    <TableRow key={ing._id}>
                        <TableCell sx={{ fontWeight: "bold" }}>{ing.name}</TableCell>
                        <TableCell>
                            <Chip label={ing.category} size="small" color={ing.category === 'MEAT' ? 'error' : ing.category === 'VEG' ? 'success' : 'default'} />
                        </TableCell>
                        <TableCell>{ing.price.toFixed(2)} zł</TableCell>
                        <TableCell>
                            <IconButton color="error" onClick={() => handleDelete(ing._id)}><DeleteIcon /></IconButton>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};
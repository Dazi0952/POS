import { useState } from 'react';
import { Container, Typography, TextField, Button, Paper } from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import { useNavigate } from 'react-router-dom';

export const SetupPage = () => {
  const [tenantId, setTenantId] = useState('');
  const navigate = useNavigate();

  const handleSave = () => {
    if (!tenantId) return alert('Wpisz ID!');
    
    // Zapisujemy ID restauracji "na zawsze" w tym urządzeniu
    localStorage.setItem('pos_tenant_id', tenantId);
    
    // Przekieruj do PIN Pada
    navigate('/login');
    window.location.reload(); // Wymuś odświeżenie konfiguracji axios
  };

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ p: 5, textAlign: 'center', width: '100%' }}>
        <StoreIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Konfiguracja POS
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Wpisz identyfikator restauracji, aby sparować urządzenie.
        </Typography>

        <TextField 
          fullWidth 
          label="ID Restauracji (np. pizzeria-mario)" 
          variant="outlined" 
          value={tenantId}
          onChange={(e) => setTenantId(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Button variant="contained" size="large" fullWidth onClick={handleSave} sx={{ height: 50 }}>
          POŁĄCZ URZĄDZENIE
        </Button>
      </Paper>
    </Container>
  );
};
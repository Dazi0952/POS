import { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  TextField, Box, Typography, ToggleButton, ToggleButtonGroup, InputAdornment, Stack 
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

export interface OrderSettings {
  type: 'takeout' | 'delivery';
  address?: string;
  phone?: string;
  timeType: 'delta' | 'fixed'; // 'delta' = za ile minut, 'fixed' = na godzinę
  timeValue: string; // np. "30" (minut) lub "14:30" (godzina)
}

interface Props {
  open: boolean;
  mode: 'takeout' | 'delivery';
  onClose: () => void;
  onSave: (settings: OrderSettings) => void;
  currentSettings?: OrderSettings;
}

export default function OrderSettingsModal({ open, mode, onClose, onSave, currentSettings }: Props) {
  // Stany formularza
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  
  // Czas
  const [timeType, setTimeType] = useState<'delta' | 'fixed'>('delta');
  const [deltaMinutes, setDeltaMinutes] = useState('30'); // Domyślnie za 30 min
  const [fixedTime, setFixedTime] = useState('');

  // Inicjalizacja przy otwarciu
  useEffect(() => {
    if (open && currentSettings) {
      // Jeśli edytujemy istniejące ustawienia
      setAddress(currentSettings.address || '');
      setPhone(currentSettings.phone || '');
      setTimeType(currentSettings.timeType);
      if (currentSettings.timeType === 'delta') setDeltaMinutes(currentSettings.timeValue);
      else setFixedTime(currentSettings.timeValue);
    } else if (open) {
      // Reset do domyślnych przy nowym otwarciu
      setDeltaMinutes('30');
      
      // Ustawiamy domyślną godzinę na "za godzinę"
      const now = new Date();
      now.setHours(now.getHours() + 1);
      const timeString = now.toTimeString().slice(0, 5); // "14:30"
      setFixedTime(timeString);

      // Jeśli przełączamy tryb, czyścimy dane adresowe
      if (mode === 'takeout') {
        setAddress('');
        setPhone('');
      }
    }
  }, [open, currentSettings, mode]);

  const handleSave = () => {
    // Walidacja dla dostawy
    if (mode === 'delivery' && (!address || !phone)) {
      alert('Podaj adres i numer telefonu dla kierowcy!');
      return;
    }
    // Walidacja czasu na godzinę
    if (timeType === 'fixed' && !fixedTime) {
      alert('Podaj godzinę realizacji!');
      return;
    }
    // Walidacja czasu "za ile"
    if (timeType === 'delta' && !deltaMinutes) {
      alert('Podaj za ile minut ma być gotowe!');
      return;
    }

    onSave({
      type: mode,
      address: mode === 'delivery' ? address : undefined,
      phone: mode === 'delivery' ? phone : undefined,
      timeType,
      timeValue: timeType === 'delta' ? deltaMinutes : fixedTime
    });
    onClose();
  };

  const quickTimes = [30, 45, 60, 90];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: mode === 'delivery' ? '#ed6c02' : '#1976d2', color: 'white' }}>
        {mode === 'delivery' ? <LocalShippingIcon /> : <ShoppingBagIcon />}
        <Typography variant="h6" component="span" fontWeight="bold">
            {mode === 'delivery' ? 'Ustawienia Dostawy' : 'Na Wynos (Odbiór Osobisty)'}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        
        {/* SEKCJA 1: DANE KLIENTA (Tylko dla dostawy) */}
        {mode === 'delivery' && (
          <Box mb={4} mt={1}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight="bold">
                DANE ADRESOWE
            </Typography>
            <Stack spacing={2}>
                <TextField 
                  fullWidth 
                  label="Adres dostawy (Ulica, numer)" 
                  variant="outlined" 
                  value={address} 
                  onChange={e => setAddress(e.target.value)}
                  placeholder="np. Kwiatowa 5/12"
                />
                <TextField 
                  fullWidth 
                  label="Numer telefonu" 
                  variant="outlined" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)}
                  placeholder="np. 500 100 100"
                  type="tel"
                />
            </Stack>
          </Box>
        )}

        {/* SEKCJA 2: CZAS REALIZACJI */}
        <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight="bold" mt={2}>
            CZAS REALIZACJI
        </Typography>
        
        {/* Przełącznik: Za ile vs Na godzinę */}
        <Stack direction="row" spacing={2} mb={3}>
            <Button 
                variant={timeType === 'delta' ? 'contained' : 'outlined'} 
                onClick={() => setTimeType('delta')}
                fullWidth
                color={mode === 'delivery' ? 'warning' : 'primary'}
                startIcon={<AccessTimeIcon />}
            >
                Za ile minut
            </Button>
            <Button 
                variant={timeType === 'fixed' ? 'contained' : 'outlined'} 
                onClick={() => setTimeType('fixed')}
                fullWidth
                color={mode === 'delivery' ? 'warning' : 'primary'}
            >
                Na godzinę
            </Button>
        </Stack>

        {/* LOGIKA "ZA ILE" */}
        {timeType === 'delta' && (
            <Box p={2} bgcolor="#f5f5f5" borderRadius={2}>
                <Typography variant="caption" color="text.secondary" mb={1} display="block">Szybki wybór:</Typography>
                <ToggleButtonGroup 
                    exclusive 
                    value={parseInt(deltaMinutes)} 
                    onChange={(_, val) => val && setDeltaMinutes(val.toString())}
                    fullWidth 
                    sx={{ mb: 2, bgcolor: 'white' }}
                    color={mode === 'delivery' ? 'warning' : 'primary'}
                >
                    {quickTimes.map(t => (
                        <ToggleButton key={t} value={t} sx={{ fontWeight: 'bold' }}>{t} min</ToggleButton>
                    ))}
                </ToggleButtonGroup>
                
                <TextField 
                    label="Wpisz ręcznie (minuty)" 
                    type="number" 
                    fullWidth
                    value={deltaMinutes} 
                    onChange={e => setDeltaMinutes(e.target.value)}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">min</InputAdornment>,
                    }}
                    sx={{ bgcolor: 'white' }}
                />
            </Box>
        )}

        {/* LOGIKA "NA GODZINĘ" */}
        {timeType === 'fixed' && (
            <Box p={2} bgcolor="#f5f5f5" borderRadius={2}>
                <TextField 
                    type="time" 
                    fullWidth
                    label="Godzina realizacji"
                    value={fixedTime} 
                    onChange={e => setFixedTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 300 }} // Skok co 5 min
                    sx={{ bgcolor: 'white' }}
                />
                <Typography variant="caption" color="text.secondary" mt={1} display="block">
                    Wybierz konkretną godzinę, na którą zamówienie ma być gotowe.
                </Typography>
            </Box>
        )}

      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: '#fafafa' }}>
        <Button onClick={onClose} color="inherit" size="large">Anuluj</Button>
        <Button 
            onClick={handleSave} 
            variant="contained" 
            size="large"
            color={mode === 'delivery' ? 'warning' : 'primary'}
            sx={{ px: 4, fontWeight: 'bold' }}
        >
            ZAPISZ
        </Button>
      </DialogActions>
    </Dialog>
  );
}
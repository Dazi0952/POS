import { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  TextField, Box, Typography, ToggleButton, ToggleButtonGroup, InputAdornment, Stack, 
  Divider
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export interface OrderSettings {
  type: 'takeout' | 'delivery';
  name?: string;
  address?: string;
  phone?: string;
  timeType: 'delta' | 'fixed'; 
  timeValue: string; 
}

interface Props {
  open: boolean;
  mode: 'takeout' | 'delivery';
  onClose: () => void;
  onSave: (settings: OrderSettings) => void;
  currentSettings?: OrderSettings;
}

export default function OrderSettingsModal({ open, mode, onClose, onSave, currentSettings }: Props) {
  
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  
  
  const [timeType, setTimeType] = useState<'delta' | 'fixed'>('delta');
  const [deltaMinutes, setDeltaMinutes] = useState('30'); 
  const [fixedTime, setFixedTime] = useState('');

  
  useEffect(() => {
    if (open && currentSettings) {
      
      setName(currentSettings.name || '');
      setAddress(currentSettings.address || '');
      setPhone(currentSettings.phone || '');
      setTimeType(currentSettings.timeType);
      if (currentSettings.timeType === 'delta') setDeltaMinutes(currentSettings.timeValue);
      else setFixedTime(currentSettings.timeValue);
    } else if (open) {
      
      setDeltaMinutes('30');
      
      
      const now = new Date();
      now.setHours(now.getHours() + 1);
      const timeString = now.toTimeString().slice(0, 5); 
      setFixedTime(timeString);

      
      if (mode === 'takeout') {
        setAddress('');
        setName('');
        setPhone('');
      }
    }
  }, [open, currentSettings, mode]);

  const handleSave = () => {
    
    if (!name) {
        alert('Podaj imię klienta!');
        return;
    }
    if (!phone) {
        alert('Podaj numer telefonu!');
        return;
    }
    if (mode === 'delivery' && !address) {
      alert('Podaj adres dostawy!');
      return;
    }
    
    if (timeType === 'fixed' && !fixedTime) { alert('Podaj godzinę!'); return; }
    if (timeType === 'delta' && !deltaMinutes) { alert('Podaj czas!'); return; }

    onSave({
      type: mode,
      name,
      address: mode === 'delivery' ? address : undefined,
      phone,
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
            {mode === 'delivery' ? 'Ustawienia Dostawy' : 'Na Wynos'}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        
        
        <Box mb={3} mt={1}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight="bold">
                DANE KLIENTA
            </Typography>
            <Stack spacing={2}>
                <TextField 
                  fullWidth label="Imię i Nazwisko / Nazwa" variant="outlined" 
                  value={name} onChange={e => setName(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment> }}
                />
                <TextField 
                  fullWidth label="Numer telefonu" variant="outlined" 
                  value={phone} onChange={e => setPhone(e.target.value)}
                  type="tel"
                  InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon /></InputAdornment> }}
                />
                
                
                {mode === 'delivery' && (
                    <TextField 
                      fullWidth label="Adres dostawy" variant="outlined" 
                      value={address} onChange={e => setAddress(e.target.value)}
                      placeholder="Ulica, numer domu/lokalu"
                      InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnIcon /></InputAdornment> }}
                    />
                )}
            </Stack>
        </Box>

        <Divider sx={{ mb: 3 }} />

        
        <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight="bold">
            CZAS REALIZACJI
        </Typography>
        
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

        {timeType === 'delta' && (
            <Box p={2} bgcolor="#f5f5f5" borderRadius={2}>
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
                    label="Wpisz czas (minuty)" type="number" fullWidth
                    value={deltaMinutes} onChange={e => setDeltaMinutes(e.target.value)}
                    InputProps={{ endAdornment: <InputAdornment position="end">min</InputAdornment> }}
                    sx={{ bgcolor: 'white' }}
                />
            </Box>
        )}

        {timeType === 'fixed' && (
            <Box p={2} bgcolor="#f5f5f5" borderRadius={2}>
                <TextField 
                    type="time" fullWidth
                    value={fixedTime} onChange={e => setFixedTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 300 }}
                    sx={{ bgcolor: 'white' }}
                />
            </Box>
        )}

      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: '#fafafa' }}>
        <Button onClick={onClose} color="inherit" size="large">Anuluj</Button>
        <Button 
            onClick={handleSave} 
            variant="contained" size="large"
            color={mode === 'delivery' ? 'warning' : 'primary'}
            sx={{ px: 4, fontWeight: 'bold' }}
        >
            ZAPISZ
        </Button>
      </DialogActions>
    </Dialog>
  );
}
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserSchema from '../models/local/UserSchema';

dotenv.config();

// Adres bazy Twojej pizzerii
const TARGET_DB_URI = 'mongodb+srv://admin:haslo123@cluster0.5ifydrn.mongodb.net/tenant_pizzeria_mario_1?appName=Cluster0'; 
// LUB ATLAS (skopiuj z .env i zmień nazwę bazy na tenant_pizzeria_mario_1)

const seedUsers = async () => {
  try {
    console.log('Łączenie z bazą...');
    const conn = await mongoose.connect(TARGET_DB_URI);
    
    const User = conn.model('User', UserSchema);

    // Czyścimy starych userów
    await User.deleteMany({});

    // Dodajemy nowych
    const users = [
      {
        username: "Janek", // To wyświetli się na kafelku
        pin: "1234",       // PIN do logowania
        role: "waiter",
        name: "Jan Kowalski",
        isActive: true
      },
      {
        username: "Szef",
        pin: "5555",
        role: "manager",
        name: "Anna Nowak",
        isActive: true
      },
      {
        username: "Kuchnia",
        pin: "0000",
        role: "kitchen",
        name: "Kucharz",
        isActive: true
      }
    ];

    // UserSchema ma middleware 'pre save', który sam zahashuje PINy!
    for (const u of users) {
        await User.create(u);
    }

    console.log('✅ Dodano 3 pracowników (Janek: 1234, Szef: 5555, Kuchnia: 0000)');
    process.exit(0);

  } catch (error) {
    console.error('Błąd:', error);
    process.exit(1);
  }
};

seedUsers();
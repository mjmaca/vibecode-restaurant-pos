const admin = require('firebase-admin');

// Load service account
const serviceAccount = require('../firebase-serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

/**
 * Seed initial data for testing
 */
async function seedData() {
  try {
    console.log('🌱 Starting data seeding...\n');

    // Create suppliers
    console.log('Creating suppliers...');
    const supplier1 = await db.collection('suppliers').add({
      name: 'Fresh Produce Co.',
      contact: 'John Smith',
      email: 'john@freshproduce.com',
      phone: '+1-555-0101',
      address: '123 Market Street, Farmville, CA 90210',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log('✓ Created: Fresh Produce Co.');

    const supplier2 = await db.collection('suppliers').add({
      name: 'Ocean Fresh Seafood',
      contact: 'Sarah Johnson',
      email: 'sarah@oceanfresh.com',
      phone: '+1-555-0102',
      address: '456 Harbor Drive, Seaside, CA 90211',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log('✓ Created: Ocean Fresh Seafood');

    const supplier3 = await db.collection('suppliers').add({
      name: 'Prime Meats & Poultry',
      contact: 'Mike Davis',
      email: 'mike@primemeats.com',
      phone: '+1-555-0103',
      address: '789 Ranch Road, Meatville, CA 90212',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log('✓ Created: Prime Meats & Poultry\n');

    // Create ingredients
    console.log('Creating ingredients...');
    
    const ingredients = [
      {
        name: 'Tomatoes',
        category: 'VEGETABLES',
        unit: 'KG',
        stock: 50,
        lowStockThreshold: 15,
        costPerUnit: 2.50,
        supplierId: supplier1.id,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        archived: false,
      },
      {
        name: 'Lettuce',
        category: 'VEGETABLES',
        unit: 'KG',
        stock: 30,
        lowStockThreshold: 10,
        costPerUnit: 1.80,
        supplierId: supplier1.id,
        expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days
        archived: false,
      },
      {
        name: 'Onions',
        category: 'VEGETABLES',
        unit: 'KG',
        stock: 40,
        lowStockThreshold: 20,
        costPerUnit: 1.50,
        supplierId: supplier1.id,
        archived: false,
      },
      {
        name: 'Chicken Breast',
        category: 'MEAT',
        unit: 'KG',
        stock: 25,
        lowStockThreshold: 10,
        costPerUnit: 8.50,
        supplierId: supplier3.id,
        expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
        archived: false,
      },
      {
        name: 'Ground Beef',
        category: 'MEAT',
        unit: 'KG',
        stock: 20,
        lowStockThreshold: 8,
        costPerUnit: 9.00,
        supplierId: supplier3.id,
        expiryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days
        archived: false,
      },
      {
        name: 'Salmon Fillet',
        category: 'SEAFOOD',
        unit: 'KG',
        stock: 15,
        lowStockThreshold: 5,
        costPerUnit: 15.00,
        supplierId: supplier2.id,
        expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days
        archived: false,
      },
      {
        name: 'Shrimp',
        category: 'SEAFOOD',
        unit: 'KG',
        stock: 8,
        lowStockThreshold: 5,
        costPerUnit: 18.00,
        supplierId: supplier2.id,
        expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days
        archived: false,
      },
      {
        name: 'Milk',
        category: 'DAIRY',
        unit: 'LITERS',
        stock: 60,
        lowStockThreshold: 20,
        costPerUnit: 1.20,
        expiryDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days
        archived: false,
      },
      {
        name: 'Cheese',
        category: 'DAIRY',
        unit: 'KG',
        stock: 12,
        lowStockThreshold: 5,
        costPerUnit: 12.00,
        expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
        archived: false,
      },
      {
        name: 'Rice',
        category: 'GRAINS',
        unit: 'KG',
        stock: 100,
        lowStockThreshold: 30,
        costPerUnit: 1.50,
        archived: false,
      },
      {
        name: 'Pasta',
        category: 'GRAINS',
        unit: 'KG',
        stock: 45,
        lowStockThreshold: 15,
        costPerUnit: 2.00,
        archived: false,
      },
      {
        name: 'Olive Oil',
        category: 'CONDIMENTS',
        unit: 'LITERS',
        stock: 25,
        lowStockThreshold: 10,
        costPerUnit: 8.00,
        archived: false,
      },
      {
        name: 'Salt',
        category: 'SPICES',
        unit: 'KG',
        stock: 20,
        lowStockThreshold: 5,
        costPerUnit: 0.80,
        archived: false,
      },
      {
        name: 'Black Pepper',
        category: 'SPICES',
        unit: 'KG',
        stock: 5,
        lowStockThreshold: 2,
        costPerUnit: 15.00,
        archived: false,
      },
      {
        name: 'Orange Juice',
        category: 'BEVERAGES',
        unit: 'LITERS',
        stock: 40,
        lowStockThreshold: 15,
        costPerUnit: 3.50,
        expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days
        archived: false,
      },
    ];

    const ingredientIds = [];
    for (const ingredient of ingredients) {
      const now = new Date().toISOString();
      const doc = await db.collection('ingredients').add({
        ...ingredient,
        createdAt: now,
        updatedAt: now,
      });
      ingredientIds.push({ id: doc.id, name: ingredient.name });
      console.log(`✓ Created: ${ingredient.name}`);
    }

    console.log('\n✅ Data seeding completed successfully!');
    console.log(`\nCreated:`);
    console.log(`- 3 suppliers`);
    console.log(`- ${ingredients.length} ingredients`);
    console.log(`\nYou can now:`);
    console.log(`1. Login to the app`);
    console.log(`2. View the dashboard`);
    console.log(`3. Manage inventory`);
    console.log(`4. Record stock movements`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    process.exit(0);
  }
}

/**
 * Clear all data (use with caution!)
 */
async function clearData() {
  try {
    console.log('🗑️  Clearing all data...\n');

    const collections = ['ingredients', 'stockMovements', 'suppliers'];

    for (const collectionName of collections) {
      const snapshot = await db.collection(collectionName).get();
      const batch = db.batch();
      
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(`✓ Cleared: ${collectionName} (${snapshot.size} documents)`);
    }

    console.log('\n✅ All data cleared successfully!');

  } catch (error) {
    console.error('❌ Error clearing data:', error);
  } finally {
    process.exit(0);
  }
}

// Parse command line arguments
const command = process.argv[2];

if (!command || command === 'seed') {
  seedData();
} else if (command === 'clear') {
  console.log('⚠️  WARNING: This will delete ALL data!');
  console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');
  
  setTimeout(() => {
    clearData();
  }, 5000);
} else {
  console.log(`
Usage:
  node seed-data.js           - Seed initial data
  node seed-data.js seed      - Seed initial data
  node seed-data.js clear     - Clear all data (WARNING!)

Examples:
  node seed-data.js
  node seed-data.js clear
  `);
  process.exit(0);
}

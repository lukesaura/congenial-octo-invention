// scripts/seed.js
// Usage: node scripts/seed.js
// Requires: serviceAccountKey.json in project root

const admin = require('firebase-admin');
const path = require('path');

const keyPath = path.join(__dirname, '..', 'serviceAccountKey.json');
try {
  admin.initializeApp({
    credential: admin.credential.cert(require(keyPath)),
  });
} catch (err) {
  console.error('Failed to initialize admin SDK. Make sure serviceAccountKey.json exists at project root.');
  console.error(err);
  process.exit(1);
}

const db = admin.firestore();

async function seed() {
  console.log('Seeding Firestore...');

  const usersRef = db.collection('users');
  const parkingRef = db.collection('parkingViolations');
  const waterRef = db.collection('waterIssues');

  // USERS (demo)
  const users = [
    { email: 'admin@municipal.gov', name: 'Admin User', password: 'admin123' },
    { email: 'inspector@municipal.gov', name: 'Inspector', password: 'inspect' },
    { email: 'test', name: 'test', password: '123' } // matches your console screenshot
  ];

  // PARKING VIOLATIONS
  const parking = [
    {
      licensePlate: 'ABC-1234',
      vehicleOwner: 'John Anderson',
      spotOwner: 'Sarah Mitchell',
      plotNumber: 'A-45',
      dateTime: '2025-11-22 09:15 AM',
      approved: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      imageUrl: '/mnt/data/e080a70e-6b98-49df-a8fe-41c614e8950b.png'
    },
    {
      licensePlate: 'XYZ-7890',
      vehicleOwner: 'Michael Rodriguez',
      spotOwner: 'David Chen',
      plotNumber: 'B-12',
      dateTime: '2025-11-22 10:30 AM',
      approved: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      licensePlate: 'GHI-9012',
      vehicleOwner: 'Robert Johnson',
      spotOwner: 'Lisa Brown',
      plotNumber: 'A-23',
      dateTime: '2025-11-21 11:20 AM',
      approved: true,
      approvedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ];

  // WATER ISSUES
  const water = [
    {
      location: 'Main Street & 5th Avenue Intersection',
      dateTime: '2025-11-22 08:45 AM',
      approved: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      location: 'Central Park East Gate',
      dateTime: '2025-11-22 07:20 AM',
      approved: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      location: 'Washington Boulevard near Metro Station',
      dateTime: '2025-11-21 04:30 PM',
      approved: true,
      approvedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ];

  try {
    // seed users
    for (const u of users) {
      // use email (or name) as doc id for easy querying if you like; here we add auto-id
      await usersRef.add(u);
      console.log('Added user', u.email);
    }

    for (const p of parking) {
      await parkingRef.add(p);
      console.log('Added parking', p.licensePlate);
    }

    for (const w of water) {
      await waterRef.add(w);
      console.log('Added water issue', w.location);
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed', err);
    process.exit(1);
  }
}

seed();

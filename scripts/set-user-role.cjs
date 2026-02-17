const admin = require('firebase-admin');

// Load service account from file
// Make sure to download your service account JSON from Firebase Console
const serviceAccount = require('../firebase-serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

/**
 * Set admin role for a user
 * Usage: node scripts/set-admin-role.js admin@restaurant.com
 */
async function setAdminRole(email) {
  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    
    // Set custom claims
    await admin.auth().setCustomUserClaims(user.uid, { 
      role: 'ADMIN' 
    });
    
    console.log(`✓ Successfully set ADMIN role for ${email}`);
    console.log(`User ID: ${user.uid}`);
    
  } catch (error) {
    console.error('Error setting admin role:', error.message);
  } finally {
    process.exit(0);
  }
}

/**
 * Set staff role for a user
 * Usage: node scripts/set-staff-role.js staff@restaurant.com
 */
async function setStaffRole(email) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    
    await admin.auth().setCustomUserClaims(user.uid, { 
      role: 'STAFF' 
    });
    
    console.log(`✓ Successfully set STAFF role for ${email}`);
    console.log(`User ID: ${user.uid}`);
    
  } catch (error) {
    console.error('Error setting staff role:', error.message);
  } finally {
    process.exit(0);
  }
}

/**
 * List all users with their roles
 */
async function listUsers() {
  try {
    const listUsersResult = await admin.auth().listUsers();
    
    console.log('\n=== All Users ===\n');
    
    for (const userRecord of listUsersResult.users) {
      const role = userRecord.customClaims?.role || 'No role set';
      console.log(`Email: ${userRecord.email}`);
      console.log(`UID: ${userRecord.uid}`);
      console.log(`Role: ${role}`);
      console.log('---');
    }
    
  } catch (error) {
    console.error('Error listing users:', error.message);
  } finally {
    process.exit(0);
  }
}

// Parse command line arguments
const command = process.argv[2];
const email = process.argv[3];

if (!command) {
  console.log(`
Usage:
  node set-user-role.js admin <email>   - Set admin role
  node set-user-role.js staff <email>   - Set staff role
  node set-user-role.js list            - List all users

Examples:
  node set-user-role.js admin admin@restaurant.com
  node set-user-role.js staff staff@restaurant.com
  node set-user-role.js list
  `);
  process.exit(0);
}

switch (command) {
  case 'admin':
    if (!email) {
      console.error('Error: Please provide an email address');
      process.exit(1);
    }
    setAdminRole(email);
    break;
    
  case 'staff':
    if (!email) {
      console.error('Error: Please provide an email address');
      process.exit(1);
    }
    setStaffRole(email);
    break;
    
  case 'list':
    listUsers();
    break;
    
  default:
    console.error('Error: Invalid command. Use "admin", "staff", or "list"');
    process.exit(1);
}

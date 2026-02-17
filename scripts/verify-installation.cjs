const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Restaurant POS Installation...\n');

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0
};

// Helper functions
function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description}`);
    checks.passed++;
    return true;
  } else {
    console.log(`❌ ${description}`);
    checks.failed++;
    return false;
  }
}

function checkDirectory(dirPath, description) {
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    console.log(`✅ ${description}`);
    checks.passed++;
    return true;
  } else {
    console.log(`❌ ${description}`);
    checks.failed++;
    return false;
  }
}

function warnFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`⚠️  ${description} (exists - should be created by user)`);
    checks.warnings++;
  } else {
    console.log(`✅ ${description} (not exists - good)`);
    checks.passed++;
  }
}

console.log('📦 Configuration Files:');
console.log('─────────────────────────────────────');
checkFile('package.json', 'package.json');
checkFile('tsconfig.json', 'tsconfig.json');
checkFile('vite.config.ts', 'vite.config.ts');
checkFile('vercel.json', 'vercel.json');
checkFile('.env.example', '.env.example');
checkFile('.gitignore', '.gitignore');
checkFile('tailwind.config.js', 'tailwind.config.js');
checkFile('postcss.config.js', 'postcss.config.js');

console.log('\n🔥 Firebase Configuration:');
console.log('─────────────────────────────────────');
checkFile('firestore.rules', 'firestore.rules');
checkFile('firestore.rules.json', 'firestore.rules.json');
warnFile('.env', '.env (user should create from .env.example)');
warnFile('serviceAccount.json', 'serviceAccount.json (user should download from Firebase)');

console.log('\n🔧 API Backend:');
console.log('─────────────────────────────────────');
checkDirectory('api', 'api/ directory');
checkFile('api/graphql.ts', 'api/graphql.ts');
checkDirectory('api/graphql', 'api/graphql/ directory');
checkFile('api/graphql/typeDefs.ts', 'api/graphql/typeDefs.ts');
checkDirectory('api/graphql/resolvers', 'api/graphql/resolvers/ directory');
checkFile('api/graphql/resolvers/index.ts', 'api/graphql/resolvers/index.ts');
checkFile('api/graphql/resolvers/ingredient.resolvers.ts', 'api/graphql/resolvers/ingredient.resolvers.ts');
checkFile('api/graphql/resolvers/stockMovement.resolvers.ts', 'api/graphql/resolvers/stockMovement.resolvers.ts');
checkFile('api/graphql/resolvers/supplier.resolvers.ts', 'api/graphql/resolvers/supplier.resolvers.ts');
checkFile('api/graphql/resolvers/dashboard.resolvers.ts', 'api/graphql/resolvers/dashboard.resolvers.ts');
checkDirectory('api/lib', 'api/lib/ directory');
checkFile('api/lib/auth.ts', 'api/lib/auth.ts');
checkFile('api/lib/firebase-admin.ts', 'api/lib/firebase-admin.ts');

console.log('\n⚛️  React Frontend:');
console.log('─────────────────────────────────────');
checkDirectory('src', 'src/ directory');
checkFile('src/main.tsx', 'src/main.tsx');
checkFile('src/App.tsx', 'src/App.tsx');
checkFile('src/index.css', 'src/index.css');
checkFile('index.html', 'index.html');

console.log('\n📄 Pages:');
console.log('─────────────────────────────────────');
checkDirectory('src/pages', 'src/pages/ directory');
checkFile('src/pages/LoginPage.tsx', 'src/pages/LoginPage.tsx');
checkFile('src/pages/DashboardPage.tsx', 'src/pages/DashboardPage.tsx');
checkFile('src/pages/InventoryPage.tsx', 'src/pages/InventoryPage.tsx');
checkFile('src/pages/StockMovementsPage.tsx', 'src/pages/StockMovementsPage.tsx');
checkFile('src/pages/SuppliersPage.tsx', 'src/pages/SuppliersPage.tsx');

console.log('\n🧩 Components:');
console.log('─────────────────────────────────────');
checkDirectory('src/components', 'src/components/ directory');
checkDirectory('src/components/layout', 'src/components/layout/ directory');
checkFile('src/components/layout/DashboardLayout.tsx', 'src/components/layout/DashboardLayout.tsx');
checkDirectory('src/components/inventory', 'src/components/inventory/ directory');
checkFile('src/components/inventory/IngredientModal.tsx', 'src/components/inventory/IngredientModal.tsx');
checkFile('src/components/inventory/StockMovementModal.tsx', 'src/components/inventory/StockMovementModal.tsx');
checkDirectory('src/components/suppliers', 'src/components/suppliers/ directory');
checkFile('src/components/suppliers/SupplierModal.tsx', 'src/components/suppliers/SupplierModal.tsx');

console.log('\n🔌 Services & Utilities:');
console.log('─────────────────────────────────────');
checkDirectory('src/services', 'src/services/ directory');
checkFile('src/services/firebase.ts', 'src/services/firebase.ts');
checkFile('src/services/apollo.ts', 'src/services/apollo.ts');
checkDirectory('src/contexts', 'src/contexts/ directory');
checkFile('src/contexts/AuthContext.tsx', 'src/contexts/AuthContext.tsx');
checkDirectory('src/graphql', 'src/graphql/ directory');
checkFile('src/graphql/queries.ts', 'src/graphql/queries.ts');
checkDirectory('src/types', 'src/types/ directory');
checkFile('src/types/index.ts', 'src/types/index.ts');

console.log('\n🔧 Scripts:');
console.log('─────────────────────────────────────');
checkDirectory('scripts', 'scripts/ directory');
checkFile('scripts/set-user-role.cjs', 'scripts/set-user-role.cjs');
checkFile('scripts/seed-data.cjs', 'scripts/seed-data.cjs');

console.log('\n📚 Documentation:');
console.log('─────────────────────────────────────');
checkFile('START_HERE.md', 'START_HERE.md');
checkFile('README.md', 'README.md');
checkFile('QUICKSTART.md', 'QUICKSTART.md');
checkFile('DEPLOYMENT.md', 'DEPLOYMENT.md');
checkFile('API.md', 'API.md');
checkFile('FIRESTORE_INDEXES.md', 'FIRESTORE_INDEXES.md');
checkFile('PROJECT_SUMMARY.md', 'PROJECT_SUMMARY.md');
checkFile('PROJECT_STATS.md', 'PROJECT_STATS.md');
checkFile('CHANGELOG.md', 'CHANGELOG.md');
checkFile('LICENSE', 'LICENSE');

console.log('\n📊 Summary:');
console.log('═════════════════════════════════════');
console.log(`✅ Passed:   ${checks.passed}`);
console.log(`❌ Failed:   ${checks.failed}`);
console.log(`⚠️  Warnings: ${checks.warnings}`);
console.log('═════════════════════════════════════');

if (checks.failed === 0) {
  console.log('\n🎉 SUCCESS! All files are in place.');
  console.log('\n📋 Next Steps:');
  console.log('   1. Read START_HERE.md for complete guide');
  console.log('   2. Read QUICKSTART.md for quick setup');
  console.log('   3. Run: npm install');
  console.log('   4. Set up Firebase (see QUICKSTART.md)');
  console.log('   5. Create .env file from .env.example');
  console.log('   6. Run: npm run dev');
  console.log('\n✨ Your restaurant inventory system is ready to configure!\n');
  process.exit(0);
} else {
  console.log('\n❌ FAILED! Some files are missing.');
  console.log('   Please check the output above for details.\n');
  process.exit(1);
}

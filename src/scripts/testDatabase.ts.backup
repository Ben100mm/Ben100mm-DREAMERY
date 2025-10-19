import { databaseService } from '../services/DatabaseService';

async function testDatabase() {
  console.log('🧪 Testing Database Service...');

  try {
    // Test database health
    console.log('1. Testing database health...');
    const isHealthy = await databaseService.healthCheck();
    console.log(`   Database health: ${isHealthy ? '✅ Healthy' : '❌ Unhealthy'}`);

    if (!isHealthy) {
      console.log('❌ Database is not healthy. Please check your connection.');
      return;
    }

    // Test finding roles
    console.log('2. Testing role retrieval...');
    const roles = await databaseService.findRoles({}, { page: 1, limit: 5 });
    console.log(`   Found ${roles.data.length} roles (${roles.pagination.total} total)`);
    
    if (roles.data.length > 0) {
      console.log(`   First role: ${roles.data[0].name}`);
    }

    // Test finding roles by category
    console.log('3. Testing role retrieval by category...');
    const acquisitionRoles = await databaseService.findRolesByCategory('acquisition-disposition');
    console.log(`   Found ${acquisitionRoles.length} acquisition roles`);
    
    if (acquisitionRoles.length > 0) {
      console.log(`   Roles: ${acquisitionRoles.map(r => r.name).join(', ')}`);
    }

    // Test finding workflows
    console.log('4. Testing workflow retrieval...');
    const workflows = await databaseService.findWorkflows({}, { page: 1, limit: 5 });
    console.log(`   Found ${workflows.data.length} workflows (${workflows.pagination.total} total)`);

    // Test finding document templates
    console.log('5. Testing document template retrieval...');
    const templates = await databaseService.findDocumentTemplates({}, { page: 1, limit: 5 });
    console.log(`   Found ${templates.data.length} document templates (${templates.pagination.total} total)`);

    // Test finding compliance requirements
    console.log('6. Testing compliance requirement retrieval...');
    const compliance = await databaseService.findComplianceRecords({}, { page: 1, limit: 5 });
    console.log(`   Found ${compliance.data.length} compliance records (${compliance.pagination.total} total)`);

    console.log('✅ All database tests completed successfully!');

  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await databaseService.disconnect();
  }
}

// Run the test
if (require.main === module) {
  testDatabase()
    .then(() => {
      console.log('🎉 Database testing completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database testing failed:', error);
      process.exit(1);
    });
}

export { testDatabase };

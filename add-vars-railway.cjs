#!/usr/bin/env node
/**
 * Add UAE7Guard Variables to Railway
 */

const https = require('https');

const TOKEN = '9e9ac086-5219-47b1-a5ac-189354c07519';
const PROJECT_ID = 'fe927025-c2de-4077-a97a-2680682a3a45';
const SERVICE_ID = '45d7d3fd-6a7d-432c-ac93-fe459065696f'; // web service
const ENVIRONMENT_ID = 'production'; // Will get actual ID

const VARIABLES = {
  DATABASE_URL: 'postgresql://postgres:TNIPYYeVqAIVCWnhISZYUBgzIKIbcuCT@turntable.proxy.rlwy.net:15072/railway',
  SESSION_SECRET: 'uae7guard_production_2026_secure_key',
  SMTP_HOST: 'smtp.gmail.com',
  SMTP_PORT: '587',
  SMTP_SECURE: 'false',
  SMTP_USER: 'admin@uae7guard.com',
  SMTP_PASSWORD: 'NEED_APP_PASSWORD_HERE',
  EMAIL_FROM: 'admin@uae7guard.com',
  EMAIL_SUPPORT: 'admin@uae7guard.com',
  EMAIL_ADMIN: 'admin@uae7guard.com',
  EMAIL_ENABLED: 'true',
  EMAIL_PROVIDER: 'gmail',
  NODE_ENV: 'production',
};

function graphqlRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query, variables });
    
    const options = {
      hostname: 'backboard.railway.app',
      path: '/graphql/v2',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };
    
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.errors) {
            reject(new Error(JSON.stringify(json.errors)));
          } else {
            resolve(json.data);
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function getEnvironmentId() {
  console.log('🔍 Getting environment ID...');
  
  const query = `
    query project($id: String!) {
      project(id: $id) {
        environments {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  `;
  
  const data = await graphqlRequest(query, { id: PROJECT_ID });
  const env = data.project.environments.edges[0]?.node;
  
  if (!env) {
    throw new Error('No environment found');
  }
  
  console.log(`✅ Environment: ${env.name} (${env.id})`);
  return env.id;
}

async function setVariable(envId, name, value) {
  const query = `
    mutation variableUpsert($input: VariableUpsertInput!) {
      variableUpsert(input: $input)
    }
  `;
  
  const input = {
    projectId: PROJECT_ID,
    environmentId: envId,
    serviceId: SERVICE_ID,
    name,
    value,
  };
  
  try {
    await graphqlRequest(query, { input });
    console.log(`✅ ${name}`);
    return true;
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚂 Adding UAE7Guard Variables to Railway');
  console.log('==========================================\n');
  
  try {
    // Get environment ID
    const envId = await getEnvironmentId();
    
    console.log('\n📝 Adding variables...\n');
    
    // Add each variable
    let success = 0;
    let failed = 0;
    
    for (const [name, value] of Object.entries(VARIABLES)) {
      const result = await setVariable(envId, name, value);
      if (result) {
        success++;
      } else {
        failed++;
      }
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n==========================================');
    console.log(`✅ Success: ${success}`);
    console.log(`❌ Failed: ${failed}`);
    console.log('\n⚠️  IMPORTANT: Update SMTP_PASSWORD with App Password!');
    console.log('Get it from: https://myaccount.google.com/apppasswords');
    console.log('\n🚀 Service will redeploy automatically!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();

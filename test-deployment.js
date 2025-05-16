// Test script to verify deployment success
const https = require('https');

// URLs to test
const urls = [
  'https://gauravsah.com.np/',
  'https://gauravsah.com.np/api/health'
];

// Function to make HTTP request
function testUrl(url) {
  return new Promise((resolve, reject) => {
    console.log(`Testing URL: ${url}`);
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`Status for ${url}: ${res.statusCode}`);
        resolve({
          url,
          status: res.statusCode,
          success: res.statusCode >= 200 && res.statusCode < 400,
          data: data.substring(0, 100) + (data.length > 100 ? '...' : '') // Show just the first 100 chars
        });
      });
    }).on('error', (err) => {
      console.error(`Error testing ${url}: ${err.message}`);
      reject({
        url,
        success: false,
        error: err.message
      });
    });
  });
}

// Test all URLs
async function runTests() {
  try {
    const results = await Promise.all(urls.map(url => testUrl(url).catch(err => err)));
    
    console.log('\n--- Test Results ---');
    results.forEach(result => {
      if (result.success) {
        console.log(`✅ ${result.url} - Status: ${result.status}`);
        if (result.data) {
          console.log(`   Response: ${result.data}`);
        }
      } else {
        console.log(`❌ ${result.url} - ${result.error || 'Status: ' + result.status}`);
      }
    });
    
    const successCount = results.filter(r => r.success).length;
    console.log(`\n${successCount}/${urls.length} tests passed.`);
    
  } catch (error) {
    console.error('Error running tests:', error);
  }
}

// Run the tests
runTests();

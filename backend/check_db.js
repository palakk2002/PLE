const axios = require('axios');

async function check() {
  try {
    const res = await axios.get('http://localhost:5000/api/settings/landingPageCms');
    console.log(JSON.stringify(res.data.data.comparison, null, 2));
  } catch (e) {
    console.error(e.message);
  }
}
check();

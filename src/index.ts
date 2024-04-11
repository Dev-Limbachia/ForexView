const { uploadForexData } = require('./services/UploadForexData');
const { uploadNewsData } = require('./services/uploadNewsData');

async function run() {
     await uploadForexData();
    // await uploadNewsData();

}

// Run the script
run().catch(error => console.error(error));

const express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Replace with your Google Sheets credentials
const creds = {
  client_email: 'id-roy@t-osprey-411304.iam.gserviceaccount.com',
  private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDC3JVfAl5OWey4\n2Q0+5bzEyrYp8i+f7q4rI3y+zX7aZ1NWbnDL3yQBgx8w6ZXjWahr6BH9xjvjeo4E\nuS9UrHqK+7/TopClrMiCM7NcvrEfvFtf+7Ip3Lgzi/B/0HQy41D87uI5+3IZQ6TT\nqwlSF6Xq//iMpxczgOQv+0+rjlAoGHAwHuMU+tma/nuUVAQzHn9/X1qG/W777IEV\nFlKCWEL4wKBoAXkUidThAMqxMyoHAntNsXxgXt/NAumWlsjnLbnzZ85g186rmVow\nDlbEFueUti+04C3Swdr2+W3IJINZt0Y4GTQHQxDqsDyOf9aQ6lCTab0siPddLT1r\nWIy986wjAgMBAAECggEAIxkxTII0M1+uLGNoJ96goD+1DRwi6OdIdtu3AfUotrUq\nxSQya/5e0WjpStmgFmnVVM5hwzicG+68uuwSMum4TuVmmXusGzNikFU4pulwJPu7\n56+B2Vl40kwP/y2waGQad9ydYf1BAXz2KOwjSyaYS5pcjhUgsDW0pFHbeVayaG4h\nvVI7YXuUNVoEvJ8u6qLyRIwh8tU9Q9pY3wuKOhD33E6974RcW87h0LvCeFypmz7G\nNR9ICogjD5NxIOWAcvoaZIgYJLZ+DAOtGluC3dXL9kSVFvPYwUPJ6sLAY4ik+Hqe\nY1PKEh0MliQFDAxLgA5n7vuRL8MN2IFDritbyLgTWQKBgQDxpVLVEbcDgCM/aOC9\ndNI0UA3KQj6HmX6SYjnQlwPn3jGUzbTgYX5YL1r956zLpdwp33FSkdQbhDNSEhZ9\n0KSR/fU4wJmV0HBnF3T+AMs5/mop0LoHRhqbRxhkN64opOp5TUmPCp4oIN5KJl1o\nuNBt5l3JKTBl4X6MIWyIDcmd+QKBgQDOb9HMHPx46HZpcspN0/SCGz0q10GxodPx\nCEawtLUcx/wR1P+fV7pgWNQQYcBcBISMLpm/Tsg8Sy9/Imuj36VO5OwzCuqt8/by\n0D0yAFcJEiByYL18gITI5bksj3QDFutWkEP5ToI3mrbjhHXutZxMXkUayuErjfvI\n14YoOxpR+wKBgGuf632Uj0OS3aAPURFwp3K/OPUdfgYc+j+uWfuqVwX9c23IFMhf\nA8u5A7jUZ6SoMZ/AshNJegPrZIQoJDZTKAkR6BcnyP/tvzJbQzMiHWGuC5CmM0Ss\nF4uTJaz1E69sjDYMkzePThOnV/oEjlPnBIX+NUU0ACdQQHGfLVyHb4XZAoGBAIoT\nutT2klxgyErxr6Ts3z9i7r/H6LXiUvuGGJo61GUi0lQvDqdKq2ukHnuyllI1515I\nESgnjsDdXTCBGlQq08v4TJA7fgrKAmQYqsXV+mEj0bYPRM6Qu8AP/5JxhRxH6TMm\nHYEUZP7CKg/12lfG+3sNFtW7224hcsa8eYxRM+KfAoGAU2lYDC/o+Bz8un1mgC98\nzplCGjqOCnaWT014SDsRjmia8jh9+Op13BdOvdXvjRZmWdNxuQgrQNByVsOhIBKe\nKRoUAgUk6rBaRcUtpbXnlm9aEhJNT6eOn+WmXh7X/aqafAVr/j2HZocdOWHcMjMq\nN8TuJuKFRVKT95/LLmQ2vuw=\n-----END PRIVATE KEY-----\n',
};

const spreadsheetId = '1tb4vt0Aui4BySXg7Lu7ytp6iGV_D9G2j7V71HjvmBPQ';

app.use(express.json());

// Handle POST requests to submit orders
app.post('/submitOrder', async (req, res) => {
  try {
    console.log('Order submission started.');

    const { orderDetails } = req.body;

    console.log('Order details:', orderDetails);

    const doc = new GoogleSpreadsheet(spreadsheetId);
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0]; // Assuming the first sheet

    for (const order of orderDetails) {
      const { productName, quantity, price } = order;
      await sheet.addRow({ 'Món ăn': productName, 'Số Lượng': quantity, 'Giá': price });
    }

    console.log('Order processing completed successfully.');
    res.status(200).send('Order received successfully.');
  } catch (error) {
    console.error('Error processing order:', error.message);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

// Handle GET requests to the root path
app.get('/', (req, res) => {
  res.send('Hello, your server is running!');
});

// Handle POST requests to submit orders to CSV
app.post('/submitOrderToCSV', async (req, res) => {
  try {
    console.log('Order submission to CSV started.');

    const { orderDetails } = req.body;

    console.log('Order details:', orderDetails);

    // Define CSV writer
    const csvWriter = createCsvWriter({
      path: 'orders.csv',
      header: [
        { id: 'timestamp', title: 'Timestamp' },
        { id: 'quantity', title: 'Quantity' },
        { id: 'price', title: 'Price' },
      ],
      append: true, // Append to the existing file
    });

    // Prepare records
    const records = orderDetails.map((order) => {
      return {
        timestamp: new Date().toISOString(),
        quantity: order.quantity,
        price: order.price,
      };
    });

    // Write to CSV
    await csvWriter.writeRecords(records);

    console.log('Order processing to CSV completed successfully.');
    res.status(200).send('Order received and saved to CSV successfully.');
  } catch (error) {
    console.error('Error processing order to CSV:', error.message);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

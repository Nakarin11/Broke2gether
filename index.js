require('dotenv').config();
const express = require('express');
const app = express();
const QRCode = require('qrcode');
const generatePP = require('promptpay-qr');
const bodyParser = require('body-parser');
const _ = require('lodash');
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
const MOBILE_NUMBER = process.env.MOBILE_NUMBER || '0629574879';

app.post('/generateQR', (req, res) => {
  const amount = parseFloat(_.get(req, ["body", "amount"]));
  const payload = generatePP(MOBILE_NUMBER, { amount });

  const option = {
    color: {
      dark: '#000',
      light: '#fff'
    }
  }

  QRCode.toDataURL(payload, option, (error, url) => {
    if (error) {
      console.log('Fail', error);
      return res.status(400).json({
        RespCode: 400,
        RespMessage: 'Generating Fail: ' + error
      });
    }

    return res.status(200).json({
      RespCode: 200,
      RespMessage: 'Generating Success',
      RespTotal: amount,
      Result: url
    });
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;

const express = require('express');

require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;

console.log(PORT);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
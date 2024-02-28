const express = require('express');
const mainController = require('./controllers/mainController');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', mainController.getIndex);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
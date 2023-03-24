require('dotenv').config()
const express = require('express');
const sequelizer = require('./db');
const models = require('./models/models');
const cors = require('cors');
const router = require('./routes/index')
const errorHandler = require('./milddleware/ErrorHandlingMiddleware');

const PORT = process.env.PORT

const app = express();
app.use(cors());
app.use(express.json())
app.use('/api', router);

app.use(errorHandler);



const start = async () => {
    try {
        await sequelizer.authenticate(); 
        await sequelizer.sync(); 
        app.listen(PORT, () => console.log(`Порт успешно изменен на ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start() 
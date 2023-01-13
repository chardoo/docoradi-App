const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const documentRoutes = require('./routes/documentsRoutes');
const documentTypesRoutes = require('./routes/documentsTypes');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());
app.use(cors());
const maxRequestBodySize = '50mb';
app.use(express.json({ limit: maxRequestBodySize }));
app.use(express.urlencoded({ limit: maxRequestBodySize }));
// Routes
app.use('/', (req, res, next) => {
  console.log(
    `Request ${req.method} :: ${req.headers.host} :: ${req.originalUrl}`
  );
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'up' });
});

app.use('/service/user', userRoutes);
app.use('/service/documents/', documentRoutes);
app.use('/service/documentsTypes/', documentTypesRoutes);

module.exports = app;

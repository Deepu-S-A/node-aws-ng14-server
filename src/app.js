import express from 'express';
import cors from 'cors';
import multer from 'multer';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';

import cars from './data.js';
import awsRouter from './routes/aws.routes.js';

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();

app.listen(3200, () => {
    console.log("The server started on port 3200 !");
});

app.use('/api/aws', awsRouter);

console.log(process.env.REGION);

app.get('/filter-cars', (req, res, next) => {
  const searchText = req.query.filter.toLowerCase();
  const filtered = cars.filter(car => car.modelName.toLowerCase().includes(searchText));
  res.send(filtered)
});

app.get('/filter-cars/:id', (req, res, next) => {
  const searchText = req.params.filter.toLowerCase();
  const filtered = cars.find(car => car.modelName.toLowerCase().includes(searchText));
  res.send(filtered)
});

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
      callBack(null, 'uploads')
  },
  filename: (req, file, callBack) => {
      callBack(null, `Deepu_${file.originalname}`)
  }
});

const upload = multer({ storage: storage })
app.post('/upload-file', upload.single('file'), (req, res, next) => {
  const file = req.file;
  console.log(file.filename);
  if (!file) {
    const error = new Error('No File')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send(file);
});



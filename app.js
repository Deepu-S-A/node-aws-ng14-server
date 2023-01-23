import express from 'express';
import cors from 'cors';
import multer from 'multer';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import cars from './data.js';
import {createTable, addItem, getItem, deleteItem, getAllItems} from './aws.action.js';

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3200, () => {
    console.log("The server started on port 3200 !");
});

console.log(process.env.REGION);


app.post('/create-dynamodb-table', (req, res, next) => {
  createTable(req.body.params.table).then(()=>res.send('Table created successfully in aws !')).catch(err=>res.send(err))
})

app.post('/save-to-dynamodb', (req, res, next) => {
  const user = req.body.params.user;
  addItem(user).then((msg)=>res.send(msg)).catch(err=>res.send(err))
})
app.get('/get-all-users', (req, res, next) => {
  getAllItems().then((data)=>res.send(data)).catch(err=>res.send(err))
})

app.get('/get-from-dynamodb', (req, res, next) => {
  const user = req.body.user;
  getItem().then((data)=>res.send(data)).catch(err=>res.send('failed'))
})
app.delete('/delete-from-dynamodb', (req, res, next) => {
  const user = req.body.user;
  deleteItem().then((data)=>res.send(data)).catch(err=>res.send('failed'))
});

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
})
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
})



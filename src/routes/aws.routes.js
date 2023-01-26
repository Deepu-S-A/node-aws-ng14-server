import express from 'express';
import {createTable, addItem, getItem, deleteItem, getAllItems} from '../aws.action.js';

const router=express.Router();

router.post('/create-dynamodb-table', (req, res, next) => {
  createTable(req.body.params.table).then(()=>res.send('Table created successfully in aws !')).catch(err=>res.send(err))
})

router.post('/save-to-dynamodb', (req, res, next) => {
  const user = req.body.params.user;
  addItem(user).then((msg)=>res.send(msg)).catch(err=>res.send(err))
})
router.get('/get-all-users', (req, res, next) => {
  getAllItems().then((data)=>res.send(data)).catch(err=>res.send(err))
})

router.get('/get-from-dynamodb', (req, res, next) => {
  const user = req.body.user;
  getItem().then((data)=>res.send(data)).catch(err=>res.send('failed'))
})
router.delete('/delete-from-dynamodb', (req, res, next) => {
  const user = req.body.user;
  deleteItem().then((data)=>res.send(data)).catch(err=>res.send('failed'))
});

export default router;
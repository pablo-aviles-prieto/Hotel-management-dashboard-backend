import express from 'express';
import { authController } from '../controllers';
import { db } from '../data/database';

const router = express.Router();

router.post('/login', authController.loginUser);
router.post('/register', authController.createNewUser);
router.get('/test', async (req, res) => {
  const query = `SELECT * FROM bookings`;
  // mysql2 promise returns an array of 2 positions, the 1st is the DB records
  // the 2nd element of the array is the metadata from that records.
  const [data] = await db.query<any[]>(query);
  console.log('order date', new Date(data[0].orderDate).toISOString().substring(0, 10));

  res.json({ data });
});

export const authRoute = { path: '', router };

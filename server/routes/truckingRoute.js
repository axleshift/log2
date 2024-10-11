import express from 'express'
import { getRecords, createRecords, updateRecords, deleteRecords } from '../controller/truckingController.js'

const router = express.Router();


router.get('/', getRecords); // This will match GET /api/trucking status


router.post('/', createRecords); // This will match POST /api/trucking status


router.put('/:id', updateRecords); // This will match PUT /api/trucking status/:id


router.delete('/:id', deleteRecords); // This will match DELETE /api/trucking status/:id

export default router;

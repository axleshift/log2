import TruckingItem from '../models/truckingModel.js'; // Your Mongoose model
import { validationResult } from 'express-validator'; // For input validation

const getRecords = async (req, res) => {
  try {
    const records = await TruckingItem.find(); // Fetch all records from the database
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createRecords = async (req, res) => {
  const errors = validationResult(req); // Validate request
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Return validation errors
  }

  try {
    const newRecord = new TruckingItem(req.body); // Create a new document
    await newRecord.save(); // Save to the database
    res.status(201).json(newRecord);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message }); // Return specific error
  }
};

const updateRecords = async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req); // Validate request
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Return validation errors
  }

  try {
    const updatedRecord = await TruckingItem.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json(updatedRecord);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message }); // Return specific error
  }
};

const deleteRecords = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRecord = await TruckingItem.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { getRecords, createRecords, updateRecords, deleteRecords };

// controllers/itemController.js
const Item = require('../models/item');

// Get all items
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving items', error: err });
  }
};

// Create a new item
const createItem = async (req, res) => {
  const { name, description, price } = req.body;

  const newItem = new Item({ name, description, price });

  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: 'Error creating item', error: err });
  }
};

module.exports = {
  getAllItems,
  createItem,
};

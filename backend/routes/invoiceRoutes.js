const express = require('express');
const Invoice = require('../models/Invoice');
const Item = require('../models/Item');
const AppConfig = require('../models/AppConfig');
 const router = express.Router();

// Apply user authentication middleware to all routes in this file
router.use((req, res, next) => {
  req.userId = req.header('X-User-ID');  // ✅ frontend sends it
  next();
});// User authentication routes
router.post('/signup', async (req, res) => {
    try {
        const { userId, password } = req.body;
        if (!userId || !password) {
            return res.status(400).json({ message: 'User ID and password are required' });
        }

        const existingUser = await AppConfig.findOne({ userId });
        if (existingUser) {
            return res.status(409).json({ message: 'User ID already exists' });
        }

        // For simplicity, storing password directly. In a real app, hash this!
        const newUserConfig = new AppConfig({ userId, password, isConfigured: false });
        await newUserConfig.save();

        res.status(201).json({ message: 'User registered successfully', userId: newUserConfig.userId });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: 'Server error during signup' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { userId, password } = req.body;
        if (!userId || !password) {
            return res.status(400).json({ message: 'User ID and password are required' });
        }

        const userConfig = await AppConfig.findOne({ userId });
        if (!userConfig) {
            return res.status(401).json({ message: 'Invalid User ID or password' });
        }

        // For simplicity, direct password comparison. In a real app, compare with hashed password!
        if (userConfig.password !== password) {
            return res.status(401).json({ message: 'Invalid User ID or password' });
        }

        // In a real application, you would generate and return a JWT here
        res.status(200).json({ message: 'Login successful', userId: userConfig.userId });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'Server error during login' });
    }
});


router.post('/invoices', async (req, res) => {
    try {
        // Add the userId from the request to the new invoice data
        const newInvoice = new Invoice({ ...req.body, userId: req.userId });
        
        const savedInvoice = await newInvoice.save();
        res.status(201).json(savedInvoice);
    } catch (error) {
        console.error("Error creating invoice:", error);
        res.status(400).json({ message: error.message });
    }
});

// Get all invoices, sorted by newest first
router.get('/invoices', async (req, res) => {
    try {
        // Only find invoices belonging to the current user
        const invoices = await Invoice.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(invoices);
    } catch (error) {
        console.error("Error getting all invoices:", error);
        res.status(500).json({ message: error.message });
    }
});

// Get a single invoice by its custom ID
router.get('/invoices/:id', async (req, res) => {
    try {
        // Find the invoice by its ID and the current user's ID
        const invoice = await Invoice.findOne({ id: req.params.id, userId: req.userId });
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json(invoice);
    } catch (error) {
        console.error("Error getting single invoice:", error);
        res.status(500).json({ message: error.message });
    }
});

// Update an invoice by its custom ID
router.put('/invoices/:id', async (req, res) => {
    try {
        const updatedInvoice = await Invoice.findOneAndUpdate(
            { id: req.params.id, userId: req.userId }, // Filter by ID and user
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedInvoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json(updatedInvoice);
    } catch (error) {
        console.error("Error updating invoice:", error);
        res.status(400).json({ message: error.message });
    }
});

// Delete an invoice by its custom ID
router.delete('/invoices/:id', async (req, res) => {
    try {
        const deletedInvoice = await Invoice.findOneAndDelete(
            { id: req.params.id, userId: req.userId } // Filter by ID and user
        );
        if (!deletedInvoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        console.error("Error deleting invoice:", error);
        res.status(500).json({ message: error.message });
    }
});


// --- Item (Catalog) Routes ---

// Create an item
router.post('/items', async (req, res) => {
    try {
        const newItem = new Item({ ...req.body, userId: req.userId });
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        console.error("Error creating item:", error);
        res.status(400).json({ message: error.message });
    }
});

// Get all items
router.get('/items', async (req, res) => {
    try {
        const items = await Item.find({ userId: req.userId });
        res.json(items);
    } catch (error) {
        console.error("Error getting all items:", error);
        res.status(500).json({ message: error.message });
    }
});

// Get a single item by its MongoDB ID
router.get('/items/:id', async (req, res) => {
    try {
        const item = await Item.findOne({ _id: req.params.id, userId: req.userId });
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (error) {
        console.error("Error getting single item:", error);
        res.status(500).json({ message: error.message });
    }
});

// Update an item by its MongoDB ID
router.put('/items/:id', async (req, res) => {
    try {
        const updatedItem = await Item.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
        res.json(updatedItem);
    } catch (error) {
        console.error("Error updating item:", error);
        res.status(400).json({ message: error.message });
    }
});

// Delete an item by its MongoDB ID
router.delete('/items/:id', async (req, res) => {
    try {
        const deletedItem = await Item.findOneAndDelete(
            { _id: req.params.id, userId: req.userId }
        );
        if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ message: error.message });
    }
});


// --- AppConfig Routes ---

// Get app configuration (finds the first one)
router.get('/config', async (req, res) => {
    try {
        const config = await AppConfig.findOne({ userId: req.userId });
        res.json(config || {}); // Return config or empty object if not found
    } catch (error) {
        console.error("Error getting app config:", error);
        res.status(500).json({ message: error.message });
    }
});

// Create or update app configuration (upsert)
router.post('/config', async (req, res) => {
    try {
        // Find config by user and update, or create if it doesn't exist
        const updatedConfig = await AppConfig.findOneAndUpdate({ userId: req.userId },
            { ...req.body, userId: req.userId },
            {
            new: true,
            upsert: true, // Creates a new doc if no match is found
            runValidators: true,
            setDefaultsOnInsert: true
        });
        res.status(200).json(updatedConfig);
    } catch (error) {
        console.error("Error creating/updating app config:", error);
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
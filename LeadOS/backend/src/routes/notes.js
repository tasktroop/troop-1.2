const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');

router.get('/leads/:id/notes', notesController.getNotes);
router.post('/leads/:id/notes', notesController.addNote);

module.exports = router;

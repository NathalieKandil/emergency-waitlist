const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// Get all patients
router.get('/', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(
            'SELECT * FROM PATIENTS ORDER BY priority_id, arrival_time'
        );
        res.json(result.rows);
        client.release();
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add new patient
router.post('/', async (req, res) => {
    const { name, card_number, medical_issue } = req.body;
    try {
        const client = await pool.connect();
        const result = await client.query(
            'INSERT INTO PATIENTS (name, card_number, medical_issue, arrival_time) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *',
            [name, card_number, medical_issue]
        );
        res.status(201).json(result.rows[0]);
        client.release();
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update patient status
router.put('/:id', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(
            'UPDATE PATIENTS SET medical_issue = $1 WHERE patient_id = $2 RETURNING *',
            [req.body.medical_issue, req.params.id]
        );
        res.json(result.rows[0]);
        client.release();
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete patient
router.delete('/:id', async (req, res) => {
    try {
        const client = await pool.connect();
        await client.query('DELETE FROM PATIENTS WHERE patient_id = $1', [req.params.id]);
        res.status(204).send();
        client.release();
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
const express = require('express');
const pool = require('../db');
const router = express.Router();

// Registrar una nueva tarea
router.post('/', async (req, res) => {
    try {
        const { titulo, descripcion } = req.body;
        const query = `
            INSERT INTO tarea (titulo, descripcion)
            VALUES ($1, $2) RETURNING *;
        `;
        const values = [nombre, descripcion, precio, stock];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear la tarea' });
    }
});

// Obtener todas las tareas
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tarea');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
});

// Actualizar una tarea
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion } = req.body;
        const query = `
            UPDATE tarea
            SET titulo = $1, descripcion = $2
            WHERE id_tarea = $3 RETURNING *;
        `;
        const values = [titulo, descripcion, id];
        const result = await pool.query(query, values);
        if (result.rowCount > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Tarea no encontrado' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar la tarea' });
    }
});

// Eliminar una tarea
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `DELETE FROM tarea WHERE id_tarea = $1 RETURNING *;`;
        const result = await pool.query(query, [id]);
        if (result.rowCount > 0) {
            res.json({ message: 'Tarea eliminada' });
        } else {
            res.status(404).json({ error: 'Tarea no encontrada' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
});

// MArcar tarea como completada
router.put('/completa/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { estado_tarea_completa } = req.body;
        const query = `
            UPDATE tarea
            SET estado_tarea_completa = $1
            WHERE id_tarea = $2 RETURNING *;
        `;
        const values = [estado_tarea_completa, id];
        const result = await pool.query(query, values);
        if (result.rowCount > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Tarea no encontrado' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar la tarea' });
    }
});

module.exports = router;

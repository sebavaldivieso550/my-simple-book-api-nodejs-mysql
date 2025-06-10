// Imports
const express = require('express');
const mysql = require('mysql2');

//
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Configuracion de conexion a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'seba23071998N',
    database: 'my_book_api'
});

// Conexion a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// RUTAS //
// GET /books - obtener libros
app.get('/books', (req, res) => {
    const sql = 'SELECT * FROM books'; // consulta SQL para obtener todos los registros
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener libros:', err);
            return res.status(500).send('Error del servidor al obtener libros');
        }
        res.json(results);
    });
});

// GET /books/:id - obtener un libro por ID
app.get('/books/:id', (req, res) => {
    const { id } = req.params; // obtiene el ID del libro de la URL
    const sql = 'SELECT * FROM books WHERE id = ?'; // el '?' es un placeholder para evitar inyeccion sql
    db.query(sql, [id], (err, results) => { // pasamos el ID como un array al query 
        if (err) {
            console.error('Error al obtener libro por ID:', err);
            return res.status(500).send('Error interno del servidor al obtener libro por ID');
        }
        if (results.length === 0) {
            return res.status(404).send('Libro no encontrado'); // 404 not found
        }
        res.json(results[0]); // retorna el primer (y unico) resultado encontrado
    });
});

// POST /books - crear un libro nuevo
app.post('/books', (req, res) => {
    const { title, author, published_year, isbn } = req.body; // obtiene los datos del cuerpo de la peticion (JSON)

    // validacion basica
    if (!title || !author) {
        return res.status(400).send('Título y autor son campos obligatorios.'); // 400: bad request
    }

    const sql = 'INSERT INTO books (title, author, published_year, isbn) VALUES (?, ?, ?, ?)';
    db.query(sql, [title, author, published_year, isbn], (err, result) => {
        if (err) {
            console.error('Error al crear el libro:', err);
            
            // manejo de error para isbn duplicado, si esta definido como UNIQUE
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).send('El ISBN proporcionado ya existe.'); // 409 conflict
            }
            return res.status(500).send('Error del servidor al crear libro');
        }
        // devuelve el ID generado por la base de datos y los datos del libro creado
        res.status(201).json({ id: result.insertId, title, author, published_year, isbn }); // 201 created
    });
});

// PUT /books/:id - actualizar un libro existente
app.put('/books/:id', (req, res) => {
    const { id } = req.params; // ID del libro a actualizar
    const { title, author, published_year, isbn } = req.body; // datos a actualizar

    // validacion basica
    if (!title && !author && !published_year && !isbn) {
        return res.status(400).send('Se debe proporcionar al menos un campo para actualizar el libro.');
    }

    // consulta SQL dinamica para actualizar solo los campos provistos
    const fields = [];
    const values = [];

    if (title) { fields.push('title = ?'); values.push(title); }
    if (author) { fields.push('author = ?'); values.push(author); }
    if (published_year) { fields.push('published_year = ?'); values.push(published_year); }
    if (isbn) { fields.push('isbn = ?'); values.push(isbn); }

    const sql = `UPDATE books SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id); // añade el ID al final de los valores

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al actualizar libro:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).send('El ISBN proporcionado ya existe para otro libro.');
            }
            return res.status(500).send('Error del servidor al actualizar libro');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Libro no encontrado para actualizar'); // 404 not found
        }
        res.json({ message: 'Libro actualizado correctamente.'}); // 200 ok
    });
});

// DELETE /books/:id - eliminar un libro
app.delete('/books/:id', (req, res) => {
    const { id } = req.params; // ID del libro a eliminar
    const sql = 'DELETE FROM books WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar libro:', err);
            return res.status(500).send('Error del servidor al eliminar libro.');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Libro no encontrado para eliminar'); // 404 not found
        }
        res.status(204).send(); // No content (exito, no hay contenido que devolver)
    });
});
//---------------------------------------------------------------------------

// Iniciar el servidor
app.listen(port, () => {
    console.log(`API de libros escuchando en http://localhost:${port}`);
});
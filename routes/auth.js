const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../db'); // Conexión a PostgreSQL

// Ruta de registro
router.post('/registrar', async (req, res) => {
    const {razon_social, nip, celular, correo, direccion, usuario, clave} = req.body;

    // Verificar si la pesona ya se encuentra registrada
    const personaRegistrado = await pool.query('SELECT * FROM persona WHERE nip = $1 ', [nip]);
    if (personaRegistrado.rows.length > 0) {
        return res.status(400).json({ message: 'La persona ya se enceuntra registrada' });
    }

    // Verificar si la pesona ya tiene usuario registrado
    const usuarioRegistrado = await pool.query('SELECT * FROM usuario u INNER JOIN persona p ON u.id_usuario = p.id_persona WHERE p.nip = $1 ', [nip]);
    if (usuarioRegistrado.rows.length > 0) {
        return res.status(400).json({ message: 'La persona ya tiene un usuario registrado' });
    }
    
    // Verificar si el usuario ya existe
    const usuarioExistente = await pool.query('SELECT * FROM usuario WHERE usuario = $1', [usuario]);
    if (usuarioExistente.rows.length > 0) {
        return res.status(400).json({ message: 'El usuario ya está registrado, ingrese uno diferente' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedClave = await bcrypt.hash(clave, salt);

    // Insertar nuevo usuario
    const nuevaPersona = await pool.query(
        'INSERT INTO persona (razon_social, nip, celular, correo, direccion) VALUES ($1, $2, $3, $4, $5) RETURNING id_persona',
        [razon_social, nip, celular, correo, direccion]
    );

    // Extraer el id_persona del resultado
    const id_persona = nuevaPersona.rows[0].id_persona;

    // Insertar nuevo usuario
    const nuevoUsuario = await pool.query(
        'INSERT INTO usuario (id_usuario, usuario, clave) VALUES ($1, $2, $3) RETURNING *',
        [id_persona, usuario, hashedClave]
    );

    // Crear y asignar token
    const token = jwt.sign({ id: nuevoUsuario.rows[0].id }, 'secreto', { expiresIn: '1h' });
    res.json({ token });
});

// Hashing de la contraseña
async function hashPassword(password) {
     // Encriptar contraseña
     const salt = await bcrypt.genSalt(12); // Se recomienda usar al menos 12
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

// Generar clave
router.post('/generate_key', verificarToken, async (req, res) => {
    const { id_persona, usuario, password } = req.body;

    //Se envia a encriptar la clave
    const hashedPassword = await hashPassword(password);

    // Insertar nuevo usuario
    const usuarioexiste = await pool.query('SELECT u.* FROM usuario u inner join persona p on u.id_usuario = p.id_persona where p.id_persona = $1', [id_persona]);
    
    if (usuarioexiste.rows.length > 0) {
        res.status(200).json(
            {
                status: 201,
                ok: false,
                data:'',
                message: "El usuario ya tiene clave generada",
                error: null
            }
        );
    }else {
        const nuevoUsuario = await pool.query(
            'INSERT INTO usuario (id_usuario, usuario, clave) VALUES ($1, $2, $3) RETURNING *',
            [id_persona, usuario, hashedPassword]
        );
    
        res.status(200).json(
            {
                status: 200,
                ok: true,
                data:nuevoUsuario.rows[0],
                message: "Clave generada correctamente",
                error: null
            }
        );
    }
    
});

// Ruta de login
router.post('/login', async (req, res) => {
    const { usuario, clave } = req.body;

    // Verificar si el usuario existe
    const usuarioExistente = await pool.query('SELECT * FROM usuario WHERE usuario = $1', [usuario]);
    if (usuarioExistente.rows.length === 0) {
        return res.status(400).json(
            {
                status: 400,
                ok: false,
                data:usuarioExistente,
                token:token,
                message: "El usuario no existe o esta incorrecto",
                error: ''
            }
        );
    }

    // Comparar contraseñas
    const validClave = await bcrypt.compare(clave, usuarioExistente.rows[0].clave);
    if (!validClave) {
        return res.status(400).json(
            {
                status: 400,
                ok: false,
                data:usuarioExistente.rows[0],
                token:token,
                message: "Clave incorrecta",
                error: validClave
            }
        );
    }

    // Crear y asignar token
    const token = jwt.sign({ id: usuarioExistente.rows[0].id_usuario }, 'secreto', { expiresIn: '1h' });
    res.status(200).json(
        {
            status: 200,
            ok: true,
            data:usuarioExistente.rows[0],
            token:token,
            message: "Inicio exitoso",
            error: null
        }
    );
});



// Ruta protegida para pruebas (requiere token)
router.get('/perfil', verificarToken, async (req, res) => {
    const { persona_id } = req.body;
    const usuario = await pool.query('SELECT u.* FROM usuario u inner join persona p on u.id_usuario = p.id_persona where p.id_persona = $1', [persona_id]);
    
    if (usuario.rows.length > 0) {
        res.status(200).json(
            {
                status: 200,
                ok: true,
                data:usuario.rows[0],
                message: "Busqueda exitosa",
                error: null
            }
        );
    }else {
        res.status(201).json(
            {
                status: 201,
                ok: false,
                data:"",
                message: "Usuario no tiene clave generada",
                error: null
            }
        );
    }

    
});

router.get('/person', verificarToken, async (req, res) => {
    const usuario = await pool.query('SELECT * FROM persona');
    res.status(200).json(
        {
            status: 200,
            ok: true,
            data:usuario.rows,
            message: "Carga exitosa",
            error: null
        }
    );
});

// Middleware para verificar el token
function verificarToken(req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(401).json({ message: 'Acceso denegado' });

    try {
        const verificado = jwt.verify(token, 'secreto');
        req.usuario_id = verificado.id_usuario;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Token no es válido' });
    }
}

module.exports = router;

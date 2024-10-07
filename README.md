# Tienda Inventario API

Esta es una API REST desarrollada con Node.js, Express y PostgreSQL para gestionar el inventario de una tienda de productos electrónicos. La API permite a los usuarios realizar operaciones CRUD sobre los productos de la tienda, como agregar, actualizar, eliminar y consultar productos.

## Características

- **Insertar** un nuevo producto en el inventario.
- **Consultar** la lista de productos disponibles.
- **Actualizar** la información de un producto.
- **Eliminar** productos del inventario.
- **Conexión a la base de datos** PostgreSQL para almacenamiento y gestión de datos.

## Requisitos Previos

Asegúrate de tener instalados los siguientes programas antes de comenzar:

- [Node.js](https://nodejs.org/) v14+ o superior
- [PostgreSQL](https://www.postgresql.org/) v12+ o superior
- [npm](https://www.npmjs.com/)

## Instalación

1. Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/tu-usuario/tienda-inventario.git
   cd tienda-inventario
Instala las dependencias del proyecto:
npm install
Configura las variables de entorno creando un archivo .env en la raíz del proyecto con el siguiente contenido (ajusta los valores según tu configuración de PostgreSQL):
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=tienda_inventario
DB_PORT=5432
Crea la base de datos y las tablas necesarias en PostgreSQL ejecutando las siguientes consultas SQL:
CREATE DATABASE tienda_inventario;

\c tienda_inventario;

CREATE TABLE producto (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0
);

Inicia la aplicación:
El servidor estará corriendo en http://localhost:3006.

Realiza operaciones CRUD a través de las siguientes rutas:

Agregar un producto: POST /api/productos
Obtener todos los productos: GET /api/productos
Actualizar un producto: PUT /api/productos/:id
Eliminar un producto: DELETE /api/productos/:id

Ejemplos de Uso
Insertar un nuevo producto (POST)
URL: /api/productos
Método: POST
Cuerpo:

{
  "nombre": "Laptop Dell",
  "descripcion": "Laptop de 15 pulgadas",
  "precio": 750.00,
  "stock": 20
}

Consultar productos (GET)
URL: /api/productos
Método: GET

Actualizar un producto (PUT)
URL: /api/productos/:id
Método: PUT
Cuerpo:

{
  "nombre": "Laptop Dell Actualizada",
  "descripcion": "Laptop de 15 pulgadas con más memoria",
  "precio": 800.00,
  "stock": 15
}

Eliminar un producto (DELETE)
URL: /api/productos/:id
Método: DELETE

Dependencias
Express - Framework web para Node.js
pg - Cliente para PostgreSQL
dotenv - Módulo para cargar variables de entorno desde un archivo .env
body-parser - Middleware para procesar cuerpos de solicitud

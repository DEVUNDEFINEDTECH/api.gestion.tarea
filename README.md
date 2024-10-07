# Gestion de tareas API

Esta es una API REST desarrollada con Node.js, Express y PostgreSQL para gestionar el inventario de una tienda de productos electrónicos. La API permite a los usuarios realizar operaciones CRUD sobre la  gestion de tareas, como agregar, actualizar, eliminar y consultar.

## Características

- **Insertar** una nueva tarea o una n ueva persona con usuario.
- **Consultar** la lista de tareas.
- **Actualizar** la información de una tarea.
- **Eliminar** una tarea.
- **Conexión a la base de datos** PostgreSQL para almacenamiento y gestión de datos.

## Requisitos Previos

Asegúrate de tener instalados los siguientes programas antes de comenzar:

- [Node.js](https://nodejs.org/) v14+ o superior
- [PostgreSQL](https://www.postgresql.org/) v12+ o superior
- [npm](https://www.npmjs.com/)

## Instalación

1. Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/DEVUNDEFINEDTECH/api.gestion.tarea.git
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
CREATE DATABASE bd_gestion_tareas;

\c bd_gestion_tareas;

CREATE TABLE "persona" (
  "id_persona" int2 NOT NULL DEFAULT nextval('persona_id_persona_seq'::regclass),
  "razon_social" text COLLATE "pg_catalog"."default",
  "nip" varchar(25) COLLATE "pg_catalog"."default",
  "celular" varchar(15) COLLATE "pg_catalog"."default",
  "correo" varchar(50) COLLATE "pg_catalog"."default",
  "direccion" text COLLATE "pg_catalog"."default",
  "estado_persona" bool DEFAULT true,
  "fecha_registro_persona" timestamptz(6) DEFAULT now()
)
;
ALTER TABLE "persona" OWNER TO "postgres";
CREATE TABLE "tarea" (
  "id_tarea" int2 NOT NULL DEFAULT nextval('tarea_id_tarea_seq'::regclass),
  "titulo" text COLLATE "pg_catalog"."default",
  "descripcion" text COLLATE "pg_catalog"."default",
  "estado_tarea_completa" bool DEFAULT false,
  "fecha_registro_tarea" timestamptz(6) DEFAULT now(),
  "estado_tarea" bool DEFAULT true
)
;
ALTER TABLE "tarea" OWNER TO "postgres";
CREATE TABLE "usuario" (
  "id_usuario" int2 NOT NULL,
  "usuario" varchar(255) COLLATE "pg_catalog"."default",
  "clave" varchar(255) COLLATE "pg_catalog"."default",
  "estado_usuario" varchar(255) COLLATE "pg_catalog"."default" DEFAULT true,
  "fecha_registro_usuario" timestamptz(6) DEFAULT now()
)
;
ALTER TABLE "usuario" OWNER TO "postgres";
BEGIN;

Inicia la aplicación:
El servidor estará corriendo en http://localhost:3006.

Realiza operaciones CRUD a través de las siguientes rutas:


Dependencias
Express - Framework web para Node.js
pg - Cliente para PostgreSQL
dotenv - Módulo para cargar variables de entorno desde un archivo .env
body-parser - Middleware para procesar cuerpos de solicitud

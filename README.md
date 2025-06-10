# Simple Book API (Node.js, Express & MySQL)

API RESTful básica para la gestión de una colección de libros. Permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar). Este proyecto sirve como demostración de la integración de backend con base de datos utilizando tecnologías modernas.

## Caracteristicas

* **Gestión de Libros:** CRUD completo para la entidad 'Book'.
* **API RESTful:** Endpoints bien definidos siguiendo principios REST.
* **Validación Básica:** Manejo de campos obligatorios y duplicados (ISBN).
* **Manejo de Errores:** Respuestas HTTP semánticas para diferentes escenarios (ej. 400 Bad Request, 404 Not Found, 500 Internal Server Error).

## Tecnologías Utilizadas

* **Backend:** Node.js, Express.js
* **Base de Datos:** MySQL (ejecutado en Docker)
* **Conector DB:** `mysql2`
* **Contenedorización:** Docker
* **Testing de API:** Postman

## Configuración del Entorno de Desarrollo (Local)

### 1. Prerequisitos

Asegúrate de tener instalados:
* [Node.js](https://nodejs.org/) (incluye npm)
* [Docker Desktop](https://www.docker.com/products/docker-desktop)
* Un cliente de base de datos como [DBeaver](https://dbeaver.io/) (opcional, pero recomendado para gestión visual de DB)
* Un cliente de API como [Postman](https://www.postman.com/) o Insomnia

### 2. Configurar la Base de Datos con Docker

1. **Levantar el Contenedor MySQL:**
    Abre tu terminal y ejecuta el siguiente comando para iniciar el servidor MySQL en Docker. Asegurate de reemplazar `tu_contraseña_segura` con una contraseña fuerte.

    ```bash
    docker run --name tu-nombre-container \
    -e MYSQL_ROOT_PASSWORD=tu_contraseña_segura \
    -e MYSQL_DATABASE=tu_database_nombre \
    -e MYSQL_ROOT_HOST=% \
    -p port:port \
    -d mysql:8.0 \
    --default-authentication-plugin=mysql_native_password
    ```

    * Espera unos segundos a que el contenedor inicie completamente. Puedes verificar su estado con `docker ps`

2. **Crear la Tabla `books`:**
    Conéctate a la base de datos `tu_database_nombre` en `localhost:port` usando DBeaver (usuario: `root`, contraseña: `tu_contraseña_segura`).

    Una vez conectado, ejecuta el siguiente script SQL en tu database:

    ```sql
    CREATE TABLE books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        published_year INT,
        isbn VARCHAR(20) UNIQUE
    );
    ```

### 3. Configurar y Ejecutar la API (Node.js)

1.  **Clonar el Repositorio:**
    ```bash
    git clone [https://github.com/TU_USUARIO/my-simple-book-api-nodejs-mysql.git](https://github.com/TU_USUARIO/my-simple-book-api-nodejs-mysql.git)
    cd my-simple-book-api-nodejs-mysql
    ```
    *(Recuerda reemplazar `TU_USUARIO` con tu nombre de usuario de GitHub.)*

2.  **Instalar Dependencias:**
    ```bash
    npm install
    ```

3.  **Ejecutar la Aplicación:**
    ```bash
    node app.js
    ```
    La API estará escuchando en `http://localhost:3000`.

## Endpoints de la API (Ejemplos con Postman)

La API expone los siguientes endpoints para la gestión de libros:

### 1. `POST /books` - Crear un nuevo libro

* **Descripción:** Añade un nuevo libro a la base de datos.
* **Método:** `POST`
* **URL:** `http://localhost:3000/books`
* **Headers:** `Content-Type: application/json`
* **Body (raw JSON):**
    ```json
    {
        "title": "Don Quijote de la Mancha",
        "author": "Miguel de Cervantes",
        "published_year": 1605,
        "isbn": "978-0307474278"
    }
    ```
* **Respuestas:** `201 Created` (Éxito), `400 Bad Request` (Datos incompletos), `409 Conflict` (ISBN duplicado).

### 2. `GET /books` - Obtener todos los libros

* **Descripción:** Recupera una lista de todos los libros en la base de datos.
* **Método:** `GET`
* **URL:** `http://localhost:3000/books`
* **Respuestas:** `200 OK` (Éxito).

### 3. `GET /books/:id` - Obtener un libro por ID

* **Descripción:** Recupera los detalles de un libro específico por su ID.
* **Método:** `GET`
* **URL:** `http://localhost:3000/books/1` (Reemplaza `1` con el ID del libro).
* **Respuestas:** `200 OK` (Éxito), `404 Not Found` (Libro no encontrado).

### 4. `PUT /books/:id` - Actualizar un libro existente

* **Descripción:** Actualiza los datos de un libro existente por su ID.
* **Método:** `PUT`
* **URL:** `http://localhost:3000/books/1` (Reemplaza `1` con el ID del libro).
* **Headers:** `Content-Type: application/json`
* **Body (raw JSON):**
    ```json
    {
        "title": "Don Quijote de la Mancha (Edición Revisada)",
        "published_year": 2005
    }
    ```
* **Respuestas:** `200 OK` (Éxito), `400 Bad Request` (Sin campos para actualizar), `404 Not Found` (Libro no encontrado), `409 Conflict` (ISBN duplicado).

### 5. `DELETE /books/:id` - Eliminar un libro

* **Descripción:** Elimina un libro de la base de datos por su ID.
* **Método:** `DELETE`
* **URL:** `http://localhost:3000/books/1` (Reemplaza `1` con el ID del libro).
* **Respuestas:** `204 No Content` (Éxito), `404 Not Found` (Libro no encontrado).
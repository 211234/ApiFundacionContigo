# Proyecto Integrador

Este proyecto es una aplicación que consta de varios servicios, incluyendo `gateway`, `Notificaciones`, `Payments` y `Users`. Cada servicio tiene su propio conjunto de funcionalidades y dependencias.

## Requisitos

- Node.js (versión 14 o superior)
- npm (versión 6 o superior)
- Docker (opcional, para ejecutar RabbitMQ y MongoDB)

## Instalación

1. Clona el repositorio:

    ```sh
    git clone https://github.com/tu-usuario/proyecto-integrador.git
    cd proyecto-integrador
    ```

2. Instala las dependencias para cada servicio:

    ```sh
    cd gateway
    npm install
    cd ../Notificaciones
    npm install
    cd ../Payments
    npm install
    cd ../Users
    npm install
    ```

## Configuración

1. Crea un archivo `.env` en cada servicio (`gateway`, `Notificaciones`, `Payments`, `Users`) con las siguientes variables de entorno:

    ```plaintext
    PORT=3000
    DB_HOST=localhost
    DB_USER=usuario
    DB_PASSWORD=contraseña
    DB_PORT=3306
    DB_NAME=nombre_base_datos
    RABBITMQ_URL=amqp://localhost
    MONGODB_URI=mongodb://localhost:27017/nombre_base_datos
    PAYPAL_CLIENT_ID=tu_paypal_client_id
    PAYPAL_CLIENT_SECRET=tu_paypal_client_secret
    PAYPAL_MODE=sandbox
    ```

2. Asegúrate de que RabbitMQ y MongoDB estén en funcionamiento. Puedes usar Docker para esto:

    ```sh
    docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
    docker run -d --name mongodb -p 27017:27017 mongo
    ```

## Ejecución

1. Inicia cada servicio:

    ```sh
    cd gateway
    npm run dev
    cd ../Notificaciones
    npm run dev
    cd ../Payments
    npm run dev
    cd ../Users
    npm run dev
    ```

2. La aplicación debería estar corriendo en `http://localhost:3000`.

## Pruebas

Para ejecutar las pruebas, puedes usar el siguiente comando en cada servicio:

```sh
npm test

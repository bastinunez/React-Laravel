# Gestor de Documentos - Proyecto Práctica 1

## 🛠️ Funcionalidades del proyecto
- `Funcionalidad 1`: Visualizar, descargar y gestionar documentos PDF.
- `Funcionalidad 2`: Gestión de roles y permisos.

## Instalación sin Docker
### Windows
#### Requisitos:
    - Laragon (APACHE)
    - PHP >=8.1
    - Git GUI Client* (Sirve para copiar el repositorio más cómodamente, de lo contrario debe descargar toda la carpeta y ubicarla donde le sea más cómodo para Laragon)
#### Instalación:
    - Descargar aplicación de Laragon e instalar
    - Habilitar el servicio de APACHE (puertos 80 y 443)
    - Configurar carpeta "Root" según donde se encuentre el proyecto. Ejemplo: /ruta/a/proyecto/**laravel-react/public/**
#### Manual de uso
    - Crear un archivo .env con los mismos parámetros del archivo .env.example.
    - En el archivo .env editar las credenciales de la base de datos que tendrá.
    - En la terminal de Laragon ubicarse en la carpeta laravel-react y utilizar lo siguientes comandos:
        ```
        php artisan key:generate
        npm install
        npm run build
        composer install
        ```
    - Iniciar el servicio de apache
    - Reemplazar el archivo auto.build.test.conf en sites-enabled de Laragon por el **contenido** (de la línea 3 en adelante) que se encuentra en la carpeta raíz de este proyecto también llamado auto.build.test.conf. **En la primera línea mantener la ruta donde tienes tu proyecto, esta ruta debe terminar en .../public**
    - Reiniciar el servicio y entrar a la página build.test

## Instalación usando Docker
### Instalacion:
#### Windows (no es la mejor opción con Docker):
    - Requisitos:
        - WSL versión 1.1.3.0 o posterior.

        - Windows 11 de 64 bits: Home o Pro versión 21H2 o superior, o Enterprise o Education versión 21H2 o superior.

        - Windows 10 de 64 bits:

            Recomendamos Home o Pro 22H2 (build 19045) o superior, o Enterprise o Education 22H2 (build 19045) o superior.
            El mínimo requerido es Home o Pro 21H2 (build 19044) o superior, o Enterprise o Education 21H2 (build 19044) o superior.
            Active la función WSL 2 en Windows. Para obtener instrucciones detalladas, consulte el Documentación de microsoft.

        - Se requieren los siguientes requisitos previos de hardware para ejecutarse con éxito WSL 2 en Windows 10 o Windows 11:

            Procesador de 64 bits con Traducción de Direcciones de Segundo Nivel (SLAT)
            RAM del sistema de 4GB
            Habilite la virtualización de hardware en el BIOS. Para obtener más información, consulte
            Para instalar en Windows es necesario descargar
    - Instalación:
        Desde https://docs.docker.com/desktop/install/windows-install/ descargar el archivo ".exe" y seguir los pasos.
    - ¿Cómo usar?:
        https://www.youtube.com/watch?v=vuV9JoHiYaU
#### Linux (Ubuntu):
    - Para otras distribuciones: https://docs.docker.com/engine/install/
    - Add Docker's official GPG key:
        ```
        sudo apt-get update
        sudo apt-get install ca-certificates curl gnupg
        sudo install -m 0755 -d /etc/apt/keyrings
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
        sudo chmod a+r /etc/apt/keyrings/docker.gpg
        ```

    - Add the repository to Apt sources:
        ```
        echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
        $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
        sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        sudo apt-get update
        ```
    - ```sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin```
    - (Para verificar la instalación) sudo docker run hello-world
### Manual de uso:
    - Ubicarse en la carpeta raiz (donde se encuentra el archivo docker-compose.yml) y abrir terminal: 
        ```
        docker-compose up -d --build
        ```
    - En el navegador ingresar el localhost:80 (Esto hay que modificar para dar nombre dominio y SSL certificado)



## Cambiar seeders (Sólo antes de iniciar la aplicación):
    - Para cambiar los datos por defecto de la aplicación de las distintas tablas dirigirse a la carpeta /database/seeders y modificar los archivos según requiera.
    - Esto es necesario para crear las credenciales de los administradores desde un principio.
    - Después de modificar los archivos, en una terminal ubicada en la carpeta raíz laravel-react:
        php artisan migrate:refresh --seed
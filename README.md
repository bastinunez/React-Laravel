# Proyecto-practica-1

- ## Usando Docker
    - ### Instalacion:
        - #### Windows (no es la mejor opción con Docker):
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
        - #### Linux (Ubuntu):
            - Para otras distribuciones: https://docs.docker.com/engine/install/
            - Add Docker's official GPG key:

                sudo apt-get update
                sudo apt-get install ca-certificates curl gnupg
                sudo install -m 0755 -d /etc/apt/keyrings
                curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
                sudo chmod a+r /etc/apt/keyrings/docker.gpg

            - Add the repository to Apt sources:
            
                echo \
                "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
                $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
                sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
                sudo apt-get update
            - sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
            - (Para verificar la instalación) sudo docker run hello-world
    - ### Manual de uso:
        - Ubicarse en la carpeta raiz (donde se encuentra el archivo docker-compose.yml) y abrir terminal: 
            - docker-compose up -d --build
        - En el navegador ingresar el localhost:80 (Esto hay que modificar para dar nombre dominio y SSL certificado)

- ## Sin Docker
    - ### Windows
        - #### Requisitos:
            - Laragon (NGINX)
            - PHP >=8.1
        - #### Instalación:
            - Descargar aplicación de Laragon e instalar
            - Habilitar el servicio de NGINX (puertos 8080 y 443)
            - Configurar carpeta "Root" según donde se encuentre el proyecto. Ejemplo: /ruta/a/proyecto/**laravel-vue/public**
        - #### Manual de uso

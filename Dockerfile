# Etapa 1: Construcción de la aplicación Laravel
FROM composer:2 as build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de la aplicación
COPY . .

# Instalar las dependencias de Composer
RUN composer install --no-dev --optimize-autoloader

# Etapa 2: Imagen final con Nginx y PHP-FPM
FROM php:8.1-fpm

# Instalar las extensiones necesarias y otras dependencias según tus necesidades
RUN apt-get update && apt-get install -y \
    nginx \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl

# Instalar Node.js y npm
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Agregar y habilitar las extensiones de PHP-PDO
RUN docker-php-ext-install pdo pdo_mysql
RUN docker-php-ext-enable pdo_mysql

# Crear usuario y grupo
RUN groupadd -g 1000 www
RUN useradd -u 1000 -ms /bin/bash -g www www

# Configurar el usuario y el directorio de trabajo
WORKDIR /var/www/html

# Copiar archivos de la aplicación desde la etapa de construcción
COPY --from=build /app /var/www/html

# Copiar configuración de Nginx
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Asignar permisos a los directorios de almacenamiento y cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Exponer el puerto 8080 para Cloud Run
EXPOSE 8080

# Comando de inicio para PHP-FPM y Nginx
CMD ["sh", "-c", "php-fpm -D && nginx -g 'daemon off;'"]
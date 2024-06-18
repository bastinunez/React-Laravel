# Etapa 1: Construcción de la aplicación Laravel
FROM php:8.1-fpm as build

# Instala las extensiones necesarias y otras dependencias
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl \
    && apt-get install -y procps \
    && apt-get clean

# Configura el idioma
RUN echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && locale-gen

# Añade un usuario y un grupo para evitar problemas de permisos
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN groupadd -g 1000 www \
    && useradd -u 1000 -ms /bin/bash -g www www

# Instala y habilita las extensiones de PHP
RUN docker-php-ext-install pdo pdo_mysql

# Instala Node.js y npm
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Configura el usuario y el directorio de trabajo
WORKDIR /var/www/html
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copia los archivos de la aplicación
COPY --chown=www:www . /var/www/html

# Instala las dependencias de Composer
USER root
RUN composer install --no-interaction --no-scripts --no-suggest --prefer-dist
USER www

# Instala y compila las dependencias de Node.js
# RUN npm install
# RUN npm run build

# Expone el puerto 9000 para la comunicación entre Nginx y PHP-FPM
EXPOSE 9000

USER www

# Comando de inicio para PHP-FPM
CMD ["php-fpm"]

# Etapa 2: Configuración de Nginx
FROM nginx:1.24

# Configura Nginx
RUN echo "daemon off;" >> /etc/nginx/nginx.conf

# Copia la configuración de Nginx
COPY default.conf /etc/nginx/conf.d/default.conf

# Configura los logs para que se redirijan a stdout y stderr
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

# Copia los archivos del build de Laravel a la imagen de Nginx
COPY --from=build /var/www/html /var/www/html

# Expone el puerto 80
EXPOSE 80

# Comando de inicio para Nginx
CMD ["nginx", "-g", "daemon off;"]

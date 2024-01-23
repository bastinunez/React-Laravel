FROM php:8.1-fpm


# Instala las extensiones necesarias y otras dependencias según tus necesidades
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
    curl
RUN apt-get update && apt-get install -y procps

# Añade un usuario y un grupo para evitar problemas de permisos
ENV COMPOSER_ALLOW_SUPERUSER=1

RUN groupadd -g 1000 www
RUN useradd -u 1000 -ms /bin/bash -g www www

# Agrega y habilita las extensiones de PHP-PDO
RUN docker-php-ext-install pdo pdo_mysql
RUN docker-php-ext-enable pdo_mysql

# Instala Node.js y npm
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Configura el usuario y el directorio de trabajo
WORKDIR /var/www/html
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copia los archivos de la aplicación
COPY --chown=www:www . /var/www/html

# # Instala las dependencias de Composer
USER root
RUN composer install --no-interaction --no-scripts --no-suggest --prefer-dist
USER www

# # Instala y configura Jetstream e Inertia
#RUN composer require laravel/jetstream
#RUN php artisan jetstream:install inertia
#COPY --chown=www:www . /var/www/html

# Instala las dependencias de Node.js

# RUN npm install
# RUN npm run build

# Expone el puerto 9000 para la comunicación entre Nginx y PHP-FPM
EXPOSE 9000

USER www

CMD ["php-fpm"]


# RUN groupadd -g 1000 www
# RUN useradd -u 1000 -ms /bin/bash -g www www

# # Add and Enable PHP-PDO Extenstions
# RUN docker-php-ext-install pdo pdo_mysql
# RUN docker-php-ext-enable pdo_mysql

# RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
# RUN apt-get install -y nodejs

# # Configura el usuario y el directorio de trabajo
# WORKDIR /var/www/html
# RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# # Copia los archivos de la aplicación
# COPY --chown=www:www . /var/www/html

# RUN composer install
# RUN composer require laravel/jetstream
# RUN php artisan jetstream:install inertia
# COPY --chown=www:www . /var/www/html
# RUN npm install
# RUN npm run build
# # RUN php artisan migrate:fresh
# # RUN php artisan db:seed --class=RolSeeder
# # RUN php artisan db:seed --class=TipoDocumentoSeeder

# RUN docker-php-ext-install pdo pdo_mysql \
#     && apk --no-cache add nodejs npm

# USER www

# EXPOSE 3000
# CMD ["php-fpm"]
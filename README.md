Aquí tienes una versión profesional, directa y sin emojis del archivo `README.md`.

-----

# QREST - Sistema de Gestión de Menús Digitales

QREST es una aplicación web full-stack diseñada para la administración y visualización de menús de restaurantes mediante códigos QR. El sistema permite actualizaciones en tiempo real y acceso público a los menús sin necesidad de autenticación por parte del cliente final.

## Tabla de Contenidos

  - [Descripción General](https://www.google.com/search?q=%23descripci%C3%B3n-general)
  - [Arquitectura y Tecnologías](https://www.google.com/search?q=%23arquitectura-y-tecnolog%C3%ADas)
  - [Requisitos del Sistema](https://www.google.com/search?q=%23requisitos-del-sistema)
  - [Instalación y Despliegue](https://www.google.com/search?q=%23instalaci%C3%B3n-y-despliegue)
  - [Estructura del Proyecto](https://www.google.com/search?q=%23estructura-del-proyecto)
  - [API y Endpoints](https://www.google.com/search?q=%23api-y-endpoints)
  - [Credenciales Predeterminadas](https://www.google.com/search?q=%23credenciales-predeterminadas)
  - [Solución de Problemas Comunes](https://www.google.com/search?q=%23soluci%C3%B3n-de-problemas-comunes)

-----

## Descripción General

El sistema proporciona una plataforma centralizada para que los administradores de restaurantes gestionen su catálogo de productos y generen puntos de acceso digitales (QR).

**Funcionalidades Principales:**

  - Gestión completa (CRUD) de platillos, categorías y menús.
  - Generación automática de códigos QR únicos por menú (integración ZXing).
  - Vista pública responsive para clientes sin requerir inicio de sesión.
  - Control de inventario mediante estados de disponibilidad.
  - Gestión de metadatos de platillos (precios, descripciones, alérgenos).

-----

## Arquitectura y Tecnologías

El proyecto sigue una arquitectura de tres capas, contenerizada para facilitar su despliegue.

### Stack Tecnológico

**Backend**

  - **Framework:** Spring Boot 3.5.6 (Java 21)
  - **Base de Datos:** PostgreSQL 15
  - **Seguridad:** Spring Security con autenticación HTTP Basic
  - **ORM:** Spring Data JPA
  - **Utilidades:** Google ZXing (Generación QR), Maven 3.9+

**Frontend**

  - **Framework:** Angular 20.3.0 (TypeScript 5.9.2)
  - **Estilos:** Tailwind CSS 3.4.13
  - **Estado y Flujos:** RxJS 7.8.0
  - **Servidor Web:** Nginx (Alpine) para producción

**Infraestructura**

  - Docker y Docker Compose para orquestación de contenedores.
  - Multi-stage builds para optimización de imágenes.

-----

## Requisitos del Sistema

Para ejecutar el entorno completo, se requiere:

  - **Docker Engine** 20.10+
  - **Docker Compose** 2.0+
  - **Git**

Para desarrollo local sin contenedores:

  - JDK 21
  - Node.js 20+
  - Servidor PostgreSQL 15 local

-----

## Instalación y Despliegue

### Despliegue Rápido (Docker Compose)

Este método levanta la pila completa (Base de datos, Backend, Frontend) automáticamente.

1.  **Clonar el repositorio:**

    ```bash
    git clone https://github.com/srnjdev/QREST.git
    cd QREST
    ```

2.  **Iniciar servicios:**

    ```bash
    docker compose up -d --build
    ```

    *Nota: El primer inicio puede tardar varios minutos mientras se compilan las imágenes e inicializan los datos de demostración.*

3.  **Validar despliegue:**

    ```bash
    docker compose ps
    ```

    Se deben observar tres contenedores activos: `qrest-db-1`, `qrest-backend-1`, y `qrest-frontend-1`.

### Acceso a la Aplicación

| Servicio | URL Local | Descripción |
|----------|-----------|-------------|
| Frontend | `http://localhost:4200` | Panel administrativo y vistas públicas |
| Backend API | `http://localhost:8080/api` | Endpoints REST |
| Health Check | `http://localhost:8080/actuator/health` | Estado del sistema |

-----

## Estructura del Proyecto

```
QREST/
├── qrest-backend/       # Código fuente Spring Boot
│   ├── src/main/java/   # Controladores, Servicios, Entidades, Repositorios
│   └── Dockerfile
├── qrest-frontend/      # Código fuente Angular
│   ├── src/app/         # Componentes, Servicios, Modelos
│   ├── nginx.conf       # Configuración de servidor web
│   └── Dockerfile
├── docker-compose.yml   # Orquestación para desarrollo
└── .env                 # Variables de entorno (configuración DB)
```

-----

## API y Endpoints

La API REST está protegida mediante autenticación básica, a excepción de los endpoints de acceso público para visualización de menús.

### Recursos Principales

**Público:**

  - `GET /api/menus/qr/{code}`: Obtiene los detalles de un menú específico mediante su código QR.

**Privado (Requiere Autenticación):**

| Recurso | Métodos Soportados | Descripción |
|---------|-------------------|-------------|
| `/api/dishes` | GET, POST, PUT, DELETE | Gestión de platillos individuales |
| `/api/menus` | GET, POST, PUT, DELETE | Gestión de menús y generación de QR |
| `/api/categories` | GET, POST, PUT, DELETE | Gestión de categorías de platillos |

-----

## Credenciales Predeterminadas

El sistema se inicializa con los siguientes usuarios para propósitos de desarrollo y pruebas:

| Rol | Usuario | Contraseña |
|-----|---------|------------|
| Administrador | `admin` | `admin123` |
| Usuario Estándar | `user` | `user123` |

*Advertencia: Se recomienda cambiar estas credenciales en entornos productivos.*

-----

## Solución de Problemas Comunes

**Conflicto de Puertos**
Si los puertos 8080 (Backend), 4200 (Frontend) o 5432 (PostgreSQL) están ocupados, modifique el archivo `docker-compose.yml` o detenga los servicios conflictivos.

```bash
lsof -i :8080  # Identificar proceso ocupando el puerto
```

**Errores de Conexión a Base de Datos**
Si el backend falla al iniciar por conexión rechazada, asegúrese de que el contenedor de base de datos esté saludable antes de que inicie el backend, o reinicie el stack:

```bash
docker compose restart backend
```

**Reinicio Completo del Entorno**
Para limpiar volúmenes y reconstruir desde cero:

```bash
docker compose down -v
docker compose up -d --build
```
# 🍽️ QREST - Sistema de Gestión de Menús con QR

Sistema completo para la gestión y visualización de menús digitales mediante códigos QR, desarrollado con Spring Boot y Angular.

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#️-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Ejecución](#-instalación-y-ejecución)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Arquitectura](#-arquitectura)
- [API Endpoints](#-api-endpoints)
- [Credenciales de Acceso](#-credenciales-de-acceso)
- [Solución de Problemas](#-solución-de-problemas)

---

## 📖 Descripción

QREST es una aplicación web full-stack que permite a restaurantes crear, gestionar y compartir sus menús de forma digital mediante códigos QR. Los clientes pueden escanear el código y visualizar el menú actualizado en tiempo real sin necesidad de autenticación.

**Funcionalidades principales:**
- ✅ Gestión completa de platillos (CRUD)
- ✅ Gestión de menús con múltiples platillos
- ✅ Generación automática de códigos QR
- ✅ Vista pública de menú sin autenticación
- ✅ Organización por categorías
- ✅ Gestión de alergenos
- ✅ Control de disponibilidad de platillos

---

## ⚡ Características

### Panel de Administración
- Dashboard con estadísticas en tiempo real
- Creación y edición de platillos
- Asignación de platillos a menús
- Gestión de categorías (Entradas, Platos Principales, Postres, Bebidas)
- Control de precios y disponibilidad

### Vista Pública
- Acceso mediante código QR
- Visualización de menús por categoría
- Información detallada de cada platillo
- Indicadores de alergenos
- Interfaz responsive y moderna

---

## 🛠️ Tecnologías

### Backend
- **Spring Boot** 3.5.6
- **Java** 21
- **PostgreSQL** 15
- **Spring Data JPA**
- **Spring Security** (HTTP Basic)
- **Google ZXing** (Generación de QR)
- **Maven** 3.9+

### Frontend
- **Angular** 20.3.0
- **TypeScript** 5.9.2
- **Tailwind CSS** 3.4.13
- **RxJS** 7.8.0
- **Client-Side Rendering**

### DevOps
- **Docker** & **Docker Compose**
- **Nginx** (Alpine)
- **Multi-stage builds**

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Docker Desktop** 4.0+ ([Descargar](https://www.docker.com/products/docker-desktop))
- **Docker Compose** 2.0+ (incluido con Docker Desktop)
- **Git** (para clonar el repositorio)

**Verificar instalación:**
```bash
docker --version
docker-compose --version
```

---

## 🚀 Instalación y Ejecución

### 1. Clonar el Repositorio

```bash
git clone https://github.com/srnjdev/QREST.git
cd QREST
```

### 2. Levantar el Proyecto con Docker

```bash
docker compose up -d
```

Este comando:
- ✅ Construye las imágenes Docker para backend y frontend
- ✅ Levanta PostgreSQL con datos iniciales
- ✅ Inicia el backend en el puerto 8080
- ✅ Inicia el frontend en el puerto 4200

**Tiempo estimado:** 2-3 minutos en el primer arranque

### 3. Verificar que los Contenedores Estén Corriendo

```bash
docker compose ps
```

Deberías ver 3 contenedores activos:
- `qrest-db-1` - PostgreSQL (puerto 5432)
- `qrest-backend-1` - Spring Boot (puerto 8080)
- `qrest-frontend-1` - Nginx + Angular (puerto 4200)

### 4. Acceder a la Aplicación

- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:8080/api
- **Health Check:** http://localhost:8080/actuator/health

---

## 📁 Estructura del Proyecto

```
QREST/
├── qrest-backend/              # Backend Spring Boot
│   ├── src/main/java/
│   │   └── dev/srnj/qrest/
│   │       ├── config/         # Configuración (CORS, Security)
│   │       ├── controller/     # REST Controllers
│   │       ├── entity/         # Entidades JPA
│   │       ├── repository/     # Repositorios
│   │       ├── service/        # Lógica de negocio
│   │       └── init/           # Inicialización de datos
│   ├── Dockerfile
│   └── pom.xml
│
├── qrest-frontend/             # Frontend Angular
│   ├── src/app/
│   │   ├── core/services/      # Servicios HTTP
│   │   ├── models/             # Interfaces TypeScript
│   │   ├── pages/              # Componentes de páginas
│   │   │   ├── dashboard/      # Panel principal
│   │   │   ├── dishes/         # Gestión de platillos
│   │   │   ├── menus/          # Gestión de menús
│   │   │   └── public-menu/    # Vista pública (QR)
│   │   └── shared/             # Componentes compartidos
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml          # Orquestación de contenedores
└── README.md                   # Este archivo
```

---

## 🏗️ Arquitectura

### Arquitectura de 3 Capas

```
┌─────────────────────────────────────────────┐
│           Frontend (Angular)                 │
│  - Componentes UI con Tailwind CSS          │
│  - Servicios HTTP con RxJS                  │
│  - Client-Side Rendering                    │
│  Puerto: 4200 (Nginx)                       │
└─────────────────┬───────────────────────────┘
                  │ HTTP/REST
                  │
┌─────────────────▼───────────────────────────┐
│           Backend (Spring Boot)              │
│  - REST API Controllers                      │
│  - Business Logic (Services)                 │
│  - Spring Security (HTTP Basic)             │
│  - QR Code Generation (ZXing)               │
│  Puerto: 8080                                │
└─────────────────┬───────────────────────────┘
                  │ JPA/Hibernate
                  │
┌─────────────────▼───────────────────────────┐
│         Base de Datos (PostgreSQL)           │
│  - Tablas: restaurants, categories,         │
│    dishes, menus, menu_dishes               │
│  - Datos iniciales precargados              │
│  Puerto: 5432                                │
└─────────────────────────────────────────────┘
```

### Flujo de Datos

1. **Usuario accede al Dashboard** → Angular carga datos desde API
2. **Administrador crea platillo** → POST a `/api/dishes` → Se guarda en PostgreSQL
3. **Administrador crea menú** → POST a `/api/menus` → Backend genera QR con ZXing
4. **Cliente escanea QR** → Accede a `/public-menu/{qrCode}` → Vista sin autenticación

---

## 🔌 API Endpoints

### Platillos (Dishes)
```
GET    /api/dishes              - Listar todos los platillos
GET    /api/dishes/{id}         - Obtener un platillo
POST   /api/dishes              - Crear platillo
PUT    /api/dishes/{id}         - Actualizar platillo
DELETE /api/dishes/{id}         - Eliminar platillo
GET    /api/dishes/category/{id} - Platillos por categoría
```

### Menús
```
GET    /api/menus               - Listar todos los menús
GET    /api/menus/{id}          - Obtener un menú
POST   /api/menus               - Crear menú (genera QR)
PUT    /api/menus/{id}          - Actualizar menú
DELETE /api/menus/{id}          - Eliminar menú
GET    /api/menus/qr/{code}     - Obtener menú por QR (público)
```

### Categorías
```
GET    /api/categories          - Listar categorías
GET    /api/categories/{id}     - Obtener categoría
POST   /api/categories          - Crear categoría
PUT    /api/categories/{id}     - Actualizar categoría
DELETE /api/categories/{id}     - Eliminar categoría
```

**Autenticación:** Todos los endpoints excepto `/api/menus/qr/{code}` requieren HTTP Basic Auth.

---

## 🔐 Credenciales de Acceso

### Usuarios Precargados

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| `admin` | `admin123` | ADMIN |
| `user`  | `user123`  | USER |

### Datos de Ejemplo

El sistema incluye datos iniciales:
- **1 Restaurante:** "Restaurante Demo"
- **4 Categorías:** Entradas, Platos Principales, Postres, Bebidas
- **14 Platillos:** Variedad de platos en todas las categorías
- **1 Menú:** "Menú Principal" con todos los platillos
- **1 Código QR:** Generado automáticamente

**Acceso al menú público:**
```
http://localhost:4200/public-menu/71FF262C
```
*(El código QR puede variar, verifica en el dashboard)*

---

## 🐛 Solución de Problemas

### El frontend no carga datos

**Síntoma:** Dashboard muestra "Cargando datos..." infinitamente

**Solución:**
```bash
# Reiniciar contenedores
docker compose restart

# Verificar logs del backend
docker compose logs backend --tail=50

# Verificar que el backend responda
curl -u admin:admin123 http://localhost:8080/api/dishes
```

### Error de conexión a la base de datos

**Síntoma:** Backend falla al iniciar con error de conexión

**Solución:**
```bash
# Detener y eliminar contenedores
docker compose down

# Eliminar volúmenes de la base de datos
docker volume rm qrest_postgres_data

# Reiniciar desde cero
docker compose up -d
```

### Puerto ya en uso

**Síntoma:** Error "port is already allocated"

**Solución:**
```bash
# Verificar qué está usando el puerto
lsof -i :4200  # o :8080 o :5432

# Cambiar puertos en docker-compose.yml si es necesario
```

### Rebuild completo del proyecto

Si algo no funciona correctamente:
```bash
# Detener todo
docker compose down

# Eliminar contenedores, imágenes y volúmenes
docker compose down --volumes --rmi all

# Reconstruir desde cero
docker compose up -d --build
```

### Ver logs en tiempo real

```bash
# Todos los servicios
docker compose logs -f

# Solo backend
docker compose logs -f backend

# Solo frontend
docker compose logs -f frontend

# Solo base de datos
docker compose logs -f db
```

---

## 📝 Comandos Útiles

```bash
# Detener todos los contenedores
docker compose stop

# Iniciar contenedores detenidos
docker compose start

# Ver estado de los contenedores
docker compose ps

# Reconstruir solo el frontend
docker compose up -d --build frontend

# Reconstruir solo el backend
docker compose up -d --build backend

# Acceder a la consola de PostgreSQL
docker compose exec db psql -U postgres -d qrest

# Acceder a la terminal del backend
docker compose exec backend bash

# Acceder a la terminal del frontend
docker compose exec frontend sh
```

---

## 🤝 Contribución

Si deseas contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 👨‍💻 Autor

**SRNJ Dev**
- GitHub: [@srnjdev](https://github.com/srnjdev)
- Repository: [QREST](https://github.com/srnjdev/QREST)

---

## 🎯 Roadmap Futuro

- [ ] Autenticación con JWT
- [ ] Soporte multi-restaurante
- [ ] Temas personalizables
- [ ] Exportación de menús a PDF
- [ ] Estadísticas de acceso por QR
- [ ] Integración con sistemas de pedidos
- [ ] Soporte multiidioma
- [ ] Progressive Web App (PWA)

---

**¿Preguntas o problemas?** Abre un [issue](https://github.com/srnjdev/QREST/issues) en GitHub.
│   │   │   └── shared/    # Componentes compartidos
│   │   └── styles.css
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml      # Configuración desarrollo
├── docker-compose-prod.yml # Configuración producción
├── .env                    # Variables de entorno (desarrollo)
└── .env.prod              # Variables de entorno (producción)
```

## 🚀 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Docker** (versión 20.10 o superior)
- **Docker Compose** (versión 2.0 o superior)

### Para desarrollo sin Docker (opcional):
- **Java JDK** 21
- **Node.js** 20+
- **Maven** (o usar el wrapper incluido `./mvnw`)
- **PostgreSQL** 15

## ⚙️ Configuración Inicial

### 1. Clonar el Repositorio

```bash
git clone https://github.com/srnjdev/QREST.git
cd QREST
```

### 2. Configurar Variables de Entorno

El proyecto ya incluye archivos `.env` configurados:

**`.env` (Desarrollo):**
```env
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/qrestdb
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
```

**`.env.prod` (Producción):**
```env
SPRING_DATASOURCE_URL=jdbc:postgresql://<DB_HOST>:5432/qrestdb
SPRING_DATASOURCE_USERNAME=<DB_USER>
SPRING_DATASOURCE_PASSWORD=<DB_PASS>
```

> ⚠️ **Importante:** Para producción, edita `.env.prod` con tus credenciales reales de base de datos.

## 🏃‍♂️ Ejecución en Desarrollo Local

### Opción 1: Con Docker Compose (Recomendado)

Este es el método más rápido para levantar todo el proyecto con una sola línea de comando.

```bash
docker compose up -d --build
```

Este comando:
- ✅ Levanta PostgreSQL en el puerto 5432
- ✅ Construye y ejecuta el backend en el puerto 8080
- ✅ Construye y ejecuta el frontend en el puerto 4200
- ✅ Configura la red entre servicios
- ✅ Crea automáticamente datos de demostración

**⏱️ Tiempo de inicio:** ~3-5 minutos la primera vez (descarga de imágenes y build)

**Verificar que todo está funcionando:**
```bash
# Ver estado de los servicios
docker compose ps

# Ver logs en tiempo real
docker compose logs -f

# Verificar backend
curl http://localhost:8080/actuator/health

# El frontend estará disponible en http://localhost:4200
```

**Ver logs de los servicios:**
```bash
# Todos los servicios
docker compose logs -f

# Solo backend
docker compose logs -f backend

# Solo frontend
docker compose logs -f frontend

# Solo base de datos
docker compose logs -f db
```

**Detener los servicios:**
```bash
docker compose down
```

**Detener y eliminar volúmenes (limpieza completa):**
```bash
docker compose down -v
```

### Opción 2: Sin Docker (Desarrollo Manual)

#### 2.1. Base de Datos

```bash
# Instalar y ejecutar PostgreSQL
# macOS (Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Crear base de datos
createdb qrestdb
```

#### 2.2. Backend

```bash
cd qrest-backend

# Configurar variables de entorno
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/qrestdb
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=postgres

# Ejecutar con Maven Wrapper
./mvnw spring-boot:run

# O compilar y ejecutar
./mvnw clean package -DskipTests
java -jar target/qrest-api-0.0.1-SNAPSHOT.jar
```

#### 2.3. Frontend

```bash
cd qrest-frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# La aplicación estará disponible en http://localhost:4200
```

## 🚀 Ejecución en Producción

### 1. Configurar Variables de Entorno

Edita el archivo `.env.prod` con las credenciales de tu base de datos de producción:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://tu-host-db:5432/qrestdb
SPRING_DATASOURCE_USERNAME=tu_usuario
SPRING_DATASOURCE_PASSWORD=tu_password_seguro
```

### 2. Levantar en Producción

```bash
docker compose -f docker-compose-prod.yml up -d --build
```

> 📝 **Nota:** En producción, el frontend usa Nginx y corre en el puerto 80.

## 🌐 URLs y Accesos

### Desarrollo Local
- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:8080
- **Backend Health Check:** http://localhost:8080/actuator/health
- **Menú Público (QR):** http://localhost:4200/public-menu/[QR_CODE]
- **Base de Datos:** localhost:5432
  - Database: `qrestdb`
  - Usuario: `postgres`
  - Password: `postgres`

### Credenciales de Autenticación

El sistema incluye autenticación básica HTTP para los endpoints administrativos:

**Usuario Administrador:**
- Username: `admin`
- Password: `admin123`

**Usuario Normal:**
- Username: `user`
- Password: `user123`

### Datos de Demostración

Al iniciar por primera vez, el sistema crea automáticamente:
- ✅ 1 Restaurante de demostración
- ✅ 4 Categorías (Entradas, Platos Principales, Postres, Bebidas)
- ✅ 15+ Platos de ejemplo con precios y descripciones
- ✅ 1 Menú completo con código QR generado

**El código QR se muestra en los logs del backend al iniciar:**
```bash
# Ver el código QR generado
docker compose logs backend | grep "QR Code"
```

### Producción
- **Frontend:** http://localhost (puerto 80)
- **Backend API:** http://localhost:8080
- **Base de Datos:** Según configuración en `.env.prod`

## 🔧 Comandos Útiles

### Docker Compose

```bash
# Iniciar servicios
docker compose up -d

# Iniciar servicios con reconstrucción
docker compose up -d --build

# Ver estado de servicios
docker compose ps

# Detener servicios
docker compose stop

# Reiniciar un servicio específico
docker compose restart backend
docker compose restart frontend

# Ejecutar comandos dentro de un contenedor
docker compose exec backend bash
docker compose exec frontend sh
```

### Backend (Maven)

```bash
cd qrest-backend

# Compilar
./mvnw clean compile

# Ejecutar tests
./mvnw test

# Empaquetar (genera JAR)
./mvnw clean package

# Ejecutar sin tests
./mvnw clean package -DskipTests

# Limpiar build
./mvnw clean
```

### Frontend (NPM)

```bash
cd qrest-frontend

# Instalar dependencias
npm install

# Desarrollo
npm start

# Build para producción
npm run build

# Ejecutar tests
npm test

# Ejecutar tests en watch mode
npm run watch

# Server-Side Rendering (SSR)
npm run serve:ssr:GeneradorDeMenus
```

## 🗄️ Base de Datos

### Credenciales por Defecto (Desarrollo)

- **Host:** localhost (o `db` dentro de Docker)
- **Puerto:** 5432
- **Base de datos:** qrestdb
- **Usuario:** postgres
- **Password:** postgres

### Estructura de Tablas

El sistema crea automáticamente las siguientes tablas:

- **restaurants** - Información de restaurantes
- **categories** - Categorías de platos
- **dishes** - Platos del menú
- **menus** - Menús con códigos QR
- **menu_dishes** - Relación muchos a muchos entre menús y platos
- **dish_allergens** - Alérgenos de cada plato

### Configuración

La aplicación usa **Spring JPA** con `ddl-auto=update`, lo que significa que:
- Las tablas se crean automáticamente al iniciar
- Los cambios en las entidades se aplican automáticamente
- No se eliminan datos existentes

### Conectarse a la Base de Datos

```bash
# Desde Docker
docker compose exec db psql -U postgres -d qrestdb

# Desde local
psql -h localhost -U postgres -d qrestdb
```

## 📡 API Endpoints

### Endpoints Públicos (Sin Autenticación)

```bash
# Obtener menú por código QR
GET /api/menus/qr/{qrCode}

# Health Check
GET /actuator/health
```

### Endpoints Protegidos (Requieren Autenticación)

Todos los endpoints requieren autenticación HTTP Basic:
```bash
Authorization: Basic YWRtaW46YWRtaW4xMjM=  # admin:admin123
```

#### Categorías
```bash
GET    /api/categories           # Listar todas las categorías
GET    /api/categories/{id}      # Obtener categoría por ID
POST   /api/categories           # Crear nueva categoría
PUT    /api/categories/{id}      # Actualizar categoría
DELETE /api/categories/{id}      # Eliminar categoría (soft delete)
```

#### Platos
```bash
GET    /api/dishes                    # Listar todos los platos
GET    /api/dishes/{id}               # Obtener plato por ID
GET    /api/dishes/category/{catId}  # Listar platos por categoría
POST   /api/dishes                    # Crear nuevo plato
PUT    /api/dishes/{id}               # Actualizar plato
DELETE /api/dishes/{id}               # Eliminar plato (soft delete)
```

#### Menús
```bash
GET    /api/menus                      # Listar todos los menús
GET    /api/menus/{id}                 # Obtener menú por ID
POST   /api/menus                      # Crear nuevo menú (genera QR automáticamente)
PUT    /api/menus/{id}                 # Actualizar menú
DELETE /api/menus/{id}                 # Eliminar menú (soft delete)
POST   /api/menus/{menuId}/dishes/{dishId}   # Agregar plato a menú
DELETE /api/menus/{menuId}/dishes/{dishId}   # Quitar plato de menú
```

### Ejemplos de Uso con cURL

```bash
# Listar categorías
curl -u admin:admin123 http://localhost:8080/api/categories

# Crear un plato
curl -u admin:admin123 -X POST http://localhost:8080/api/dishes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pasta Alfredo",
    "description": "Pasta cremosa con salsa alfredo",
    "price": 13.50,
    "categoryId": 2,
    "available": true,
    "active": true,
    "allergens": ["Gluten", "Lácteos"]
  }'

# Crear un menú (genera QR automáticamente)
curl -u admin:admin123 -X POST http://localhost:8080/api/menus \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Menú del Día",
    "description": "Nuestro menú especial",
    "restaurantId": 1
  }'

# Obtener menú por código QR (público, sin autenticación)
curl http://localhost:8080/api/menus/qr/ABC12345
```

## 🧪 Testing

### Backend Tests

```bash
cd qrest-backend
./mvnw test
```

### Frontend Tests

```bash
cd qrest-frontend
npm test
```

## 📦 Build para Producción

### Backend

```bash
cd qrest-backend
./mvnw clean package -DskipTests
# JAR generado en: target/qrest-api-0.0.1-SNAPSHOT.jar
```

### Frontend

```bash
cd qrest-frontend
npm run build
# Build generado en: dist/GeneradorDeMenus/
```

## 🐛 Troubleshooting

### Problema: Puerto 8080 ya en uso

```bash
# Encontrar proceso usando el puerto
lsof -i :8080

# Matar el proceso
kill -9 <PID>
```

### Problema: Puerto 4200 ya en uso

```bash
# Encontrar proceso usando el puerto
lsof -i :4200

# Matar el proceso
kill -9 <PID>
```

### Problema: Error de conexión a la base de datos

1. Verifica que PostgreSQL esté corriendo:
```bash
docker compose ps db
```

2. Revisa los logs de la base de datos:
```bash
docker compose logs db
```

3. Verifica las credenciales en `.env`

### Problema: Docker Compose no inicia

```bash
# Limpiar contenedores y volúmenes
docker compose down -v

# Limpiar imágenes (opcional)
docker system prune -a

# Reintentar
docker compose up -d --build
```

### Problema: Frontend no se conecta al backend

1. Verifica que el backend esté corriendo:
```bash
curl http://localhost:8080/actuator/health
```

2. Revisa la configuración de proxy/API endpoints en el frontend

### Problema: Errores al construir el backend

```bash
# Limpiar cache de Maven
cd qrest-backend
./mvnw clean

# Volver a descargar dependencias
./mvnw dependency:purge-local-repository
```

## 📚 Documentación Adicional

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Angular Documentation](https://angular.dev/)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 👥 Contribución

Si deseas contribuir al proyecto:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y propiedad del team QREST.

## 📧 Contacto

**Repositorio:** [https://github.com/srnjdev/QREST](https://github.com/srnjdev/QREST)

---

⭐ Si te gusta este proyecto, no olvides darle una estrella en GitHub!

# CryptoInvestment - Full Stack SPA

## Descripción del Proyecto
Este repositorio contiene la solución completa para el reto técnico de CryptoInvestment. El proyecto está estructurado en un monorepo con dos directorios principales: un cliente web (Frontend) y una API de servidor (Backend).

## Arquitectura Frontend (Directorio: frontend)
* Estructura: Orientada a características (Feature-based).
* Estado Global: Implementado 100% con la Context API nativa de React, prescindiendo de Redux.
* Gráficos: Renderizado de series temporales utilizando Recharts.
* Dinamismo: Refresco pasivo cada 30 segundos sin recargas de página (Polling asíncrono).

## Arquitectura Backend (Directorio: crypto-backend)
* Estructura: Diseño estricto MVC por capas (Rutas, Controladores, Modelos).
* Mitigación de API: El servidor actúa como un escudo de caché pasivo (60 segundos) para mitigar las limitaciones de la capa gratuita de la API de CoinMarketCap.
* Persistencia: Construcción autónoma de historiales de precios en base de datos relacional para alimentar los gráficos del cliente.

## Modelo Entidad-Relación (MER)

```mermaid
erDiagram
    USERS ||--o{ USER_WATCHLIST : "tiene"
    CRYPTOCURRENCIES ||--o{ USER_WATCHLIST : "monitoreada_en"
    CRYPTOCURRENCIES ||--o{ PRICE_HISTORY : "registra"

    USERS {
        int user_id PK
        varchar username
        timestamp created_at
    }
    CRYPTOCURRENCIES {
        int cmc_id PK
        varchar symbol
        varchar name
        timestamp last_synced
    }
    USER_WATCHLIST {
        int watchlist_id PK
        int user_id FK
        int cmc_id FK
        timestamp added_at
    }
    PRICE_HISTORY {
        bigint history_id PK
        int cmc_id FK
        decimal price_usd
        decimal volume_24h
        decimal percent_change_24h
        timestamp recorded_at
    }
Instalación y Uso
1. Configuración de Base de Datos
Importar el archivo modelo_bd.sql en MySQL o MariaDB.

2. Despliegue del Backend
Navegar al directorio del servidor: cd crypto-backend

Instalar dependencias: npm install

Configurar el archivo .env con las credenciales de la base de datos y la clave de CoinMarketCap.

Iniciar el servidor: node server.js

3. Despliegue del Frontend
Abrir una nueva terminal y navegar al directorio del cliente: cd frontend

Instalar dependencias: npm install

Iniciar el entorno de desarrollo: npm run dev

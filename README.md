# PRO/CONT

## Esta es una app web que te permite crear y comprar temas por sus pros y contras, para asi mejorar la toma de decisiones y hacerlo mucho mas facil y rapido para el cliente

# Caracteristicas Principales

- Autentificación de usurios con clerk
- Modo claro y oscuro para los amantes de la luz o personas que prefieren la oscuridad
- Sistema de guardado de tablas para que puedas volver a ver tus tablas cuando quieras
- Sugerencias por IA para que te apoyes de la inteligencia artificial (actualmente sin implementar)
- Lading Page para mostrar una presentación de la app

# Tecnologias Utilizadas

- Astro
- React
- Typescript
- TailwindCSS
- MongoDB
- Mongoose
- Clerk
- Vercel
- Zustand
- Shadcn/ui
- Lucide-react

# Estructura del proyecto

- src
  - assets
  - components
    - auth
    - common
    - lading
    - ui
    - writerboard
  - lib
  - models
  - pages
    - api
    - board
    - dashboard
    - pricing (no implementada)
    - profile
    - writerboard
    - index.astro
  - service
  - styles
- .env
- .gitignore
- README.md
- package.json
- tsconfig.json
- components.json
- tsconfig.json
- astro.config.ts

# Instalación

git clone https://github.com/jahdiel/PRO-CONT.git
npm install
npm run dev

# Configuración del Entorno

crea un archivo .env en la raiz del proyecto y agrega las siguientes variables:

PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
IA_TOKEN
MONGO_URI
API_URI

# Autor

Jahdiel Arciniegas, https://jahdiel-arciniegas.vercel.app/, https://www.linkedin.com/in/jahdiel-arciniegas-55714125b/

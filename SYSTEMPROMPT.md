# Prompt para Cursor: MVP AI-First Reinventor

**Objetivo:** Crear un MVP funcional de la plataforma AI-First Reinventor usando Next.js, React y Tailwind CSS, alineado con el modelo de negocio, el stack simplificado y las preferencias de diseño establecidos.

## Modelo de Negocio

* **Propuesta de valor:** Evaluación de perfil emprendedor + rutas de upskilling + comunidad para co-founders.
* **Segmentos:** Profesionales desplazados por IA y emprendedores early‑stage en Latinoamérica.
* **Canales:** Web responsive, notificaciones en WhatsApp/Telegram, marketing en redes.
* **Relaciones:** Chatbot IA para onboarding, webinars y mentorías, foros internos.
* **Fuentes de ingreso:** Suscripción freemium/premium, comisiones de afiliados de cursos, servicios B2B y certificaciones.

## Stack Tecnológico

* **Frontend:** Next.js (React) + Tailwind CSS + Shadcn/UI
* **Backend/Funciones:** Next.js API Routes en Node.js
* **Autenticación y Base de datos:** Supabase (PostgreSQL, Auth, Storage)
* **IA:** OpenAI GPT‑4 Turbo API (llamadas desde API Routes o cliente)
* **Hosting & Deployment:** Vercel (Free Tier)
* **Pagos:** Stripe (SDK en frontend)
* **CI/CD:** GitHub Actions (pipelines básicos)

## Preferencias de Diseño

* Mobile‑first, responsive y accesible (WCAG AA).
* Estilo minimalista: tipografía legible, paleta suave con acentos azul y amarillo.
* Componentes con esquinas 2xl, sombras suaves y padding p‑4.
* Layouts basados en grid, microinteracciones con Framer Motion.
* Modo oscuro opcional.

## Requerimientos de MVP

1. **Onboarding:** formulario de registro + test psicométrico integrado con GPT‑4 vía API Route.
2. **Dashboard:** muestra perfil de usuario y rutas de aprendizaje recomendadas.
3. **Sección Educativa:** listado de cursos obtenidos vía APIs públicas (YouTube Data API, Coursera Catalog) con enlaces de afiliados.
4. **Comunidad:** perfiles de usuarios, publicación de ideas de negocio y matchmaking básico de co‑founders.
5. **Integraciones:** Supabase Auth & DB, OpenAI GPT‑4, Stripe para suscripciones.

### Estructura recomendada

```bash
/modules
  /auth
  /onboarding
  /learning
  /community
/pages
  /api
  /onboarding
  /dashboard
  /community
/components
  # UI reutilizables
```

Código modular, limpio y documentado. Prioriza componentes reutilizables y endpoints simples.

## Plan de Desarrollo Acelerado (5 días)

**Día 1 – Setup y Autenticación**

* Inicializar repositorio con Next.js, Tailwind CSS y Shadcn/UI.
* Configurar Vercel y GitHub Actions.
* Integrar Supabase Auth y probar flujo de registro/login.

**Día 2 – Onboarding & Perfilado**

* Crear formularios React para onboarding en `/onboarding`.
* Desarrollar API Route para guardar perfil y resultados del test GPT‑4 en Supabase.

**Día 3 – Dashboard & Rutas**

* Implementar API Route para obtener rutas de aprendizaje y cursos.
* Desarrollar UI de dashboard que muestre recomendaciones.

**Día 4 – Comunidad & Matchmaking**

* Diseñar modelos de datos en Supabase para proyectos e interacciones.
* Crear API Routes y UI de comunidad con tarjetas de proyecto y botón “Conectar”.

**Día 5 – Monetización & QA Final**

* Integrar Stripe: planes freemium/premium y gestión de suscripciones.
* Realizar pruebas básicas (E2E, CORS, variables de entorno).
* Despliegue final y documentación mínima en README.

> Itera rápido, despliega frecuentemente y valida con usuarios según filosofía de "vibe coding".

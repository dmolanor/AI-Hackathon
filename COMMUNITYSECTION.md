
¡Excelente! Vamos a planificar el desarrollo de la sección "Comunidad & Matchmaking". El objetivo es crear un espacio donde los usuarios puedan ver sus conexiones existentes, descubrir otros miembros y proyectos, obtener recomendaciones personalizadas y filtrar según sus intereses.

Aquí tienes un plan de desarrollo detallado, diseñado para integrarse con tu plataforma Next.js/Supabase existente:

**Plan de Desarrollo: Comunidad & Matchmaking**

**Fase 1: Bases de Datos y APIs**

1.  **Diseño del Modelo de Datos (Supabase):**
    *   **Tabla `projects`:**
        *   `id` (uuid, primary key, default: `uuid_generate_v4()`)
        *   `user_id` (uuid, foreign key references `auth.users.id`, `on delete cascade`)
        *   `title` (text, not null)
        *   `description` (text)
        *   `industry` (text) - *Podría coincidir con intereses del test*
        *   `required_skills` (text[]) - *Array de texto para habilidades buscadas*
        *   `status` (text, e.g., 'idea', 'developing', 'launched', default: 'idea')
        *   `created_at` (timestamp with time zone, default: `now()`)
        *   `updated_at` (timestamp with time zone, default: `now()`)
    *   **Tabla `user_connections`:** (Para manejar conexiones entre usuarios)
        *   `id` (bigint, primary key, generated always as identity)
        *   `user_id_1` (uuid, foreign key references `auth.users.id`, `on delete cascade`)
        *   `user_id_2` (uuid, foreign key references `auth.users.id`, `on delete cascade`)
        *   `status` (text, e.g., 'pending', 'connected', 'blocked', default: 'pending')
        *   `requested_at` (timestamp with time zone, default: `now()`)
        *   `accepted_at` (timestamp with time zone, nullable)
        *   *Constraint:* Asegurar que `user_id_1` < `user_id_2` para evitar duplicados inversos, o manejar la lógica de solicitud/aceptación de forma diferente. O usar un constraint `UNIQUE(least(user_id_1, user_id_2), greatest(user_id_1, user_id_2))`.
    *   **RLS Policies:** Habilitar RLS en `projects` y `user_connections`. Definir políticas iniciales (ej: los usuarios autenticados pueden ver todos los proyectos, solo los usuarios involucrados pueden ver sus conexiones 'pending'/'connected', el creador puede modificar su proyecto).

2.  **Creación de Endpoints de API (Next.js API Routes):**
    *   `POST /api/projects`: Para crear un nuevo proyecto (requiere autenticación).
    *   `GET /api/projects`: Para obtener proyectos (con filtros/búsqueda/paginación). Debe poder devolver todos o los de un usuario específico.
    *   `PUT /api/projects/[projectId]`: Para actualizar un proyecto (solo el creador).
    *   `DELETE /api/projects/[projectId]`: Para eliminar un proyecto (solo el creador).
    *   `GET /api/community/catalog`: Endpoint unificado para obtener usuarios (`user_profiles`) y proyectos (`projects`), con parámetros para filtrar, buscar y paginar.
    *   `GET /api/community/connections`: Obtener las conexiones del usuario actual (estado 'connected').
    *   `GET /api/community/requests`: Obtener las solicitudes de conexión pendientes *para* el usuario actual.
    *   `POST /api/community/connect`: Enviar una solicitud de conexión a otro usuario.
    *   `PUT /api/community/connect/respond`: Aceptar o rechazar una solicitud de conexión.
    *   `GET /api/community/recommendations`: **(Placeholder Inicial)** Endpoint para obtener recomendaciones personalizadas. Inicialmente puede devolver datos aleatorios o basados en reglas simples. La lógica de matchmaking real se implementará aquí más adelante.

**Fase 2: Interfaz de Usuario (UI)**

3.  **Estructura de la Página de Comunidad (`/community`):**
    *   Crear `src/app/community/page.tsx`. Probablemente será un Client Component para manejar estado (pestañas, filtros, datos).
    *   Diseñar una disposición con pestañas o secciones claras: "Descubrir", "Mis Conexiones", "Mis Proyectos".

4.  **Componentes Reutilizables:**
    *   `UserCard.tsx`: Componente para mostrar la información resumida de un usuario (nombre, avatar, titular/rol, skills clave, botón "Conectar"/"Ver Perfil").
    *   `ProjectCard.tsx`: Componente para mostrar información resumida de un proyecto (título, descripción breve, industria, skills buscadas, creador, botón "Ver Más"/"Interesado").

5.  **Vista "Descubrir":**
    *   Implementar la vista principal que muestra el catálogo mixto de usuarios y proyectos.
    *   Integrar `SearchBar.tsx` y `FilterSidebar.tsx` (o controles de filtro similares).
    *   Llamar a `GET /api/community/catalog` con los filtros/búsqueda aplicados.
    *   Mostrar los resultados usando `UserCard` y `ProjectCard`.
    *   Implementar paginación si el catálogo es grande.
    *   **Sección de Recomendaciones:** Mostrar un carrusel o sección destacada con los resultados de `GET /api/community/recommendations`.

6.  **Vista "Mis Conexiones":**
    *   Llamar a `GET /api/community/connections` para obtener los usuarios conectados.
    *   Mostrar una lista o cuadrícula usando `UserCard`.
    *   **Opcional:** Mostrar solicitudes pendientes (llamando a `GET /api/community/requests`) con botones para aceptar/rechazar (que llamen a `PUT /api/community/connect/respond`).

7.  **Vista "Mis Proyectos":**
    *   Llamar a `GET /api/projects?userId=currentUser` para obtener los proyectos del usuario actual.
    *   Mostrar una lista usando `ProjectCard` con botones adicionales para "Editar"/"Eliminar".
    *   Añadir un botón "Crear Nuevo Proyecto" que lleve a un formulario (o modal) para llamar a `POST /api/projects`.

8.  **Integración de Botón "Conectar":**
    *   Añadir lógica al botón "Conectar" en `UserCard` para llamar a `POST /api/community/connect`.
    *   Manejar estados visuales (ej. cambiar a "Solicitud Enviada", deshabilitar).

**Fase 3: Lógica de Matchmaking y Refinamiento**

9.  **Implementación Básica de Recomendaciones:**
    *   En el backend (`GET /api/community/recommendations`), implementar una lógica inicial. Ejemplo: encontrar usuarios con `interest_areas` o `skills` similares a los del usuario actual (obtenidos del perfil o de la tabla de tests), excluyendo conexiones existentes. Usar queries de Supabase con filtros y quizás `ORDER BY` aleatorio (`random()`) o algún criterio simple.

10. **Implementación de Filtros y Búsqueda:**
    *   **Backend:** Asegurar que `GET /api/community/catalog` y `GET /api/projects` acepten parámetros de query (`?skill=react&industry=saas&search=designer`) y modifiquen las consultas Supabase correspondientes (usando `.ilike()` para búsqueda textual, `.eq()`/`.in()`/`.contains()` para filtros exactos o de arrays).
    *   **Frontend:** Conectar los componentes de UI (`SearchBar`, `FilterSidebar`) para actualizar el estado de los filtros/búsqueda y volver a llamar a la API con los parámetros correctos.

11. **(Futuro/Avanzado) Matchmaking Basado en IA:**
    *   Una vez que la estructura básica funcione, se puede mejorar `GET /api/community/recommendations`.
    *   Podría implicar:
        *   Crear un endpoint API adicional (ej. `POST /api/matchmaking/calculate`) que se ejecute periódicamente o bajo demanda.
        *   Este endpoint obtendría datos relevantes de los tests y perfiles.
        *   Podría usar librerías de cálculo de similitud (ej. coseno en vectores de embeddings de skills/intereses) o llamar a un servicio externo (como OpenAI vía API) pasando perfiles anonimizados y pidiendo clasificaciones de compatibilidad.
        *   Los resultados se almacenarían (ej. en una tabla `recommendation_scores`) para ser consultados rápidamente por `GET /api/community/recommendations`.

12. **Estilos, Pruebas y Refinamiento:**
    *   Aplicar estilos consistentes con Tailwind/Shadcn.
    *   Asegurar responsividad.
    *   Añadir estados de carga y manejo de errores en la UI.
    *   Realizar pruebas funcionales.

**Integración:**

*   Este plan se basa en componentes y APIs modulares.
*   Las nuevas tablas de Supabase se integran con el esquema existente (usando `user_id` como clave foránea).
*   Las nuevas rutas API siguen el patrón de las existentes.
*   Los componentes de UI se pueden desarrollar de forma independiente y luego integrarse en la página `/community`.
*   La lógica de matchmaking empieza simple y puede evolucionar sin romper la estructura principal.

¿Quieres empezar con el Paso 1 (Diseño del Modelo de Datos)? Puedo ayudarte a definir las columnas y tipos exactos para las tablas `projects` y `user_connections`.

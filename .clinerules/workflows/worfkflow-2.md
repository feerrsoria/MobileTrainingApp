1. Workflow del Agente: Estrategia Local-First & Sync
Fase 1: Infraestructura de Persistencia Híbrida (Local-First)
El objetivo es que la app funcione 100% offline y sincronice en background.

Tarea 1.1: Definir ISyncService e IRepository en el dominio.

Tarea 1.2: Implementar SQLiteRepository (o WatermelonDB) en /infrastructure.

Tarea 1.3: Crear un SyncManager que detecte cambios locales no sincronizados y los suba a Firestore al recuperar conexión (usando NetInfo).

Fase 2: Dominio de Perfil Dual (Usuario/Entrenador)
Tarea 2.1: Extender UserEntity para incluir isCoach: boolean, bio, displayName, y coachStats.

Tarea 2.2: Crear CoachService para la lógica de validación de introducción y creación de entrenamientos.

Fase 3: Pagos y Subscripciones (Desacoplado)
Tarea 3.1: Definir IPaymentProvider en /domain con métodos createPaymentQR() y processCard().

Tarea 3.2: Implementar MercadoPagoProvider en /infrastructure (Mock para tests).

Tarea 3.3: Lógica de SubscriptionManager para verificar acceso a rutinas de alumnos.

Fase 4: Presentación y Navegación (Material UI)
Tarea 4.1: Añadir pestaña "Coaches" a la Bottom Bar.

Tarea 4.2: Pantalla de Onboarding de Entrenador (Stepper).

Tarea 4.3: Vista de Alumnos y chat/comentarios con soporte multimedia.wwww
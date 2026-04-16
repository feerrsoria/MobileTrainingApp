# PROMPTS
"Genera los archivos de la Phase 1: Domain Entities basándote en los tipos de datos de las tablas de RPE y Progresión, y escribe el primer test en Jest para asegurar que el cálculo de tonelaje sea correcto ($peso \times reps \times series$)."
"Crea las entidades base en src/domain/entities y el servicio RoutineGenerator. Escribe un test que verifique que una rutina de 'Hipertrofia' para un usuario 'Intermedio' incluya la fase de descarga en la cuarta sesión del microciclo, tal como indican mis tablas."
"Implementa el RoutineGeneratorService. Este servicio debe recibir el UserConfig y generar un Mesociclo estructurado en bloques:

Si es Fuerza: 50-75% del volumen en movimientos principales (Squat, Bench, Deadlift).

Si es Hipertrofia: 1-2 compuestos + 1-3 aislamiento por grupo, rango 6-12 reps, 10-20 series semanales.

Bloques: Debe estructurar el plan en: Acumulación (6 sem), Intensificación (4 sem) y Realización/Tapering (2 sem).

El generador debe devolver un objeto Routine con los ejercicios categorizados por patrones de movimiento (Sentadilla, Tirón Vertical, etc.). Escribe un test que verifique que un usuario de 4 días/semana reciba una distribución de volumen equilibrada."
Prompt 4.1: "Configura la capa de Infrastructure.

Crea una interfaz IRepository para guardar y recuperar el UserConfig y la Routine.

Implementa esta interfaz usando AsyncStorage (o SQLite si prefieres).

Crea un useRoutine custom hook que sirva como puente entre la UI y el repositorio, manejando los estados de carga y error."
Prompt 6.1: "Crea la WorkoutScreen.Debe mostrar la lista de ejercicios del día actual según la rutina generada.Cada ejercicio debe permitir registrar: Peso, Reps y RPE.Al completar una serie, debe mostrar dinámicamente el Tonelaje ($Peso \times Reps$).Integra el ProgressionEngine para que, al terminar el entrenamiento, la app le diga al usuario qué pesos usar la próxima vez.Usa componentes Paper de MaterialUI para un look limpio y profesional."
Prompt 7.1: "Finaliza la app configurando React Navigation (Bottom Bar):

Iconos: Routine (Home), History, Settings, Profile.

Asegura que si no hay una rutina generada, la app siempre redirija al Onboarding.

Refactoriza archivos para asegurar que ninguno supere las 150 líneas, separando componentes pequeños y hooks lógicos. Verifica que todos los tests de la suite pasen (npm test)."
Prompt 1: El Sistema de Logs Centralizado (Base)
"Actúa como un Desarrollador Senior. Necesito implementar un sistema de logs centralizado siguiendo mi regla de logs: éxito, warning, error. Crea una interfaz ILogger en src/domain/interfaces y una implementación AppLogger en src/infrastructure/services que emita logs a la consola y prepare el espacio para una base de datos externa. Aplica esta función a todas las funciones existentes del proyecto. Recuerda: máximo 150 líneas por archivo y TDD obligatorio."

Prompt 2: Local-First con Firestore Sync
"Configura el enfoque Local-First. Implementa una base de datos local usando SQLite en src/infrastructure/database. Crea un SyncService que utilice onSnapshot de Firebase para traer cambios cuando hay red, y una cola de cambios local (Outbox Pattern) para subir datos de entrenamientos y rutinas cuando el usuario recupere conexión. La sincronización debe ocurrir esté o no autenticado para datos públicos, pero solo para datos privados si hay un uid activo."

Prompt 3: Lógica de Entrenador y Mercado Pago
"Crea el dominio para el perfil de 'Entrenador'. Define la interfaz IPaymentGateway en src/domain. Implementa la lógica de 'Convertirse en Entrenador' donde el usuario ingresa su bio y nombre. Para Mercado Pago, crea una implementación en src/infrastructure/payments que gestione el flujo de cobro por QR. Usa la paleta Rojo #FF0000 y Negro #000000 con componentes de Material UI (Paper)."

3. Arquitectura del Flujo de Datos
4. Estructura de Archivos sugerida para el Agente
Para mantener la concisión de < 150 líneas:

Plaintext
src/
 ├── domain/
 │    ├── entities/
 │    │    ├── Coach.ts
 │    │    └── Payment.ts
 │    ├── interfaces/
 │    │    ├── IRepository.ts (Sync-enabled)
 │    │    └── IPaymentProvider.ts
 │    └── services/
 │         ├── SyncManager.ts
 │         └── Logger.ts
 ├── infrastructure/
 │    ├── database/
 │    │    ├── SQLiteClient.ts
 │    │    └── SyncWorker.ts
 │    ├── payments/
 │    │    └── MercadoPagoAdapter.ts
 │    └── repositories/
 │         └── FirestoreSyncRepo.ts
 └── presentation/
      ├── screens/
      │    ├── CoachOnboarding/
      │    └── StudentManagement/
      └── components/
           └── PaymentQR.tsx
5. Nota sobre Mercado Pago y el Agente
El agente puede escribir toda la lógica de integración de la API de Mercado Pago (generación de preference_id o qr_code mediante fetch), pero te recomiendo que para el Checkout Pro (WebView) o Card Tokenization, le pidas específicamente que cree un "Bridge" o "Hook" para separar la lógica de la UI, ya que Mercado Pago en React Native suele requerir manejo de estados de carga complejos y redirecciones de deep linking.

¿Quieres que profundicemos en el prompt específico para el SyncManager que maneja los conflictos de datos entre Local y Firebase? solo dímelo.
Fase 1: Entidades del Dominio y Lógica de Entrenamiento (Pura)
El objetivo es codificar las tablas de RPE, Progresión y Selección de Ejercicios en lógica de TypeScript.

Tarea 1.1: Definir Types/Interfaces para UserConfig, Routine, Microcycle, Exercise y TrainingObjective.

Tarea 1.2: Implementar RoutineGeneratorService.

Test: Debe generar una estructura de entrenamiento basada en el objetivo (Fuerza/Hipertrofia) y nivel (Principiante/Intermedio).

Lógica: Aplicar las reglas de volumen (10-20 series/semana) e intensidad (RPE/RM) descritas en los datos.

Tarea 1.3: Implementar calculadores de Progresión.

Principiante: Lógica de 5x5 con incrementos de carga fijos.

Intermedio: Lógica ondulante (olas) con reducción de reps e incremento de carga.

Fase 2: Infraestructura y Estado
Tarea 2.1: Configurar el almacenamiento local (AsyncStorage o SQLite) mediante una interfaz IRepository para persistir la rutina generada y el historial.

Tarea 2.2: Crear un Store (Context API o Zustand) que maneje el estado global de la configuración del usuario y la sesión actual.

Fase 3: Presentación - Navegación y Tema
Tarea 3.1: Configurar React Navigation (Bottom Bar) con los iconos solicitados (Routine, History, Settings, Profile).

Tarea 3.2: Implementar el ThemeProvider de MaterialUI con la paleta Rojo/Negro/Gris.

Fase 4: Workflow de Onboarding (La Guía Paso a Paso)
Tarea 4.1: Crear la pantalla de "Nueva Rutina" usando un componente tipo Slider o Stepper.

Paso 1: Selector de Objetivo (Cards con iconos).

Paso 2: Selector de Días (1 a 6).

Paso 3: Selector de Mesociclo (1, 3, 6 meses).

Paso 4: Selector de Nivel (Beginner/Intermediate/Advanced).

Paso 5: Inputs opcionales para 1RM (Squat, Bench, Deadlift).

Tarea 4.2: Integrar el Onboarding con el RoutineGeneratorService para disparar la generación al finalizar el paso 5.

Fase 5: Pantalla de Rutina y Ejecución
Tarea 5.1: Implementar la pantalla principal de "Routine" que muestra el Microciclo actual.

Tarea 5.2: Implementar el selector de ejercicios por categoría.

Lógica: Si el objetivo es Hipertrofia, mostrar categorías como "Sentadilla", "Bisagra de cadera", etc. Si es Fuerza, agrupar por "Empujes/Tirones Tren Superior e Inferior".

Tarea 5.3: Crear el componente de "Registro de Serie" que valide el RPE ingresado basado en la tabla de Repeticiones en Reserva.
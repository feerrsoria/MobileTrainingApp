TDD Obligatorio: No se escribe código de producción sin un test previo (Jest/React Native Testing Library). Cada tarea se considera "Hecha" solo si el test pasa.

Arquitectura Domain-First: * src/domain: Entidades, interfaces de servicios y lógica pura (ej. calculador de volumen). No depende de React ni de librerías externas.

src/infrastructure: Implementaciones de interfaces (repositorios, almacenamiento local).

src/presentation: Componentes de React Native, hooks y temas de MaterialUI.

UI/UX:

Paleta: Rojo (#FF0000), Negro (#000000) y escala de grises.

Componentes: MaterialUI (Paper) para React Native.

Concisión: Archivos de máximo 150 líneas. Si crece más, separar en sub-componentes o hooks.

Logs: Cada funcion debe tener su funcion de log para tener unos logs centralizados emitidos por la app a una base a conectar con una interfaz desacoplada y a la consola de ejecucion.Debe incluir los niveles exito, warning, error.Si una funcion en el proyecto no la tiene se debe agregar.

Documentacion: Conserva por separado todos los prompts al agente, las respuestas de tipo plan, los mensajes de exito despues de ejecutar una tarea con act en archivos en la raiz del proyecto llamados prompts.md acts.md y plans.md
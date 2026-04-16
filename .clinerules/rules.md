TDD Obligatorio: No se escribe código de producción sin un test previo (Jest/React Native Testing Library). Cada tarea se considera "Hecha" solo si el test pasa.

Arquitectura Domain-First: * src/domain: Entidades, interfaces de servicios y lógica pura (ej. calculador de volumen). No depende de React ni de librerías externas.

src/infrastructure: Implementaciones de interfaces (repositorios, almacenamiento local).

src/presentation: Componentes de React Native, hooks y temas de MaterialUI.

UI/UX:

Paleta: Rojo (#FF0000), Negro (#000000) y escala de grises.

Componentes: MaterialUI (Paper) para React Native.

Concisión: Archivos de máximo 150 líneas. Si crece más, separar en sub-componentes o hooks.
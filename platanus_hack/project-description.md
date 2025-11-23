# Bananandamos - Project Description
## Resumen
**Bananandamos** es un motor de juegos de aventura impulsado por IA, creado para el Platanus Hack 2025. Permite a los usuarios crear, jugar y compartir aventuras de texto inmersivas mejoradas con panoramas visuales de 360° y superposiciones interactivas. La innovación principal es el **Editor de Aventuras**, que utiliza la API Gemini de Google para generar mundos de juego completos —incluyendo narrativa, lógica y activos visuales— a partir de una simple descripción de texto.

### Objetivos
1.  **Democratizar la Creación de Juegos**: Permitir que cualquier persona construya juegos de aventura complejos sin programar, utilizando instrucciones en lenguaje natural.
2.  **Experiencia Híbrida**: Fusionar la profundidad de las aventuras de texto clásicas con la inmersión de las tecnologías web visuales modernas de 360°.
3.  **Integración de IA**: Demostrar el poder de la IA Generativa (Gemini) tanto para la escritura creativa (narrativa, diálogo) como para la generación de activos (panoramas, imágenes de objetos).

### Tecnologías
*   **Núcleo**: HTML5, CSS3, JavaScript Vanilla (ES6+).
*   **Framework UI**: Bootstrap 5 (personalizado con una estética "hacker" oscura y neón).
*   **Motor Visual**: [Pannellum](https://pannellum.org/) para el renderizado de panoramas equirectangulares de 360°.
*   **Backend IA**: Google Gemini API (vía REST) para generar gráficos de juego (JSON) e imágenes.
*   **Persistencia de Datos**: LocalStorage para guardado automático; exportación/importación de JSON/ZIP para compartir juegos.

### Estructura de Datos y Arquitectura
El motor del juego está basado en datos, impulsado por una estructura de gráfico JSON estrictamente tipada.
*   **Gráfico del Juego**: Un objeto JSON que contiene una lista de `Escenas` (Scenes) y un puntero de `Inicio` (Start).
*   **Escenas**: Las unidades fundamentales del juego. Pueden ser `base` (habitaciones 360°) o `overlay` (primeros planos 2D).
*   **Acciones**: Definen la interactividad (Mover, Mirar, Interactuar) y la lógica (requisitos, entrega de objetos).
*   **Estado**: Rastrea la ubicación actual del jugador, el inventario y la superposición activa.

Para especificaciones técnicas detalladas, consulte la siguiente documentación:
*   [**Agents.MD**](Agents.MD): Instrucciones para agentes de IA sobre cómo generar gráficos de juego válidos.
*   [**Scenes.MD**](Scenes.MD): Esquema detallado para objetos de Escena, incluyendo alineación de brújula y nomenclatura de activos.
*   [**State.MD**](State.MD): Definición del modelo de estado en tiempo de ejecución (inventario, escena actual, superposiciones).

## 🇬🇧 English

### Overview
**Bananandamos** is an AI-powered adventure game engine built for the Platanus Hack 2025. It allows users to create, play, and share immersive text-based adventures enhanced with 360° visual panoramas and interactive overlays. The core innovation is the **Agent Builder**, which uses Google's Gemini API to generate complete game worlds—including narrative, logic, and visual assets—from a simple text prompt.

### Goals
1.  **Democratize Game Creation**: Enable anyone to build complex adventure games without coding, using natural language prompts.
2.  **Hybrid Experience**: Merge the depth of classic text adventures with the immersion of modern 360° visual web technologies.
3.  **AI Integration**: Showcase the power of Generative AI (Gemini) for both creative writing (narrative, dialogue) and asset generation (panoramas, item images).

### Technology Stack
*   **Core**: HTML5, CSS3, Vanilla JavaScript (ES6+).
*   **UI Framework**: Bootstrap 5 (customized with a dark, neon "hacker" aesthetic).
*   **Visual Engine**: [Pannellum](https://pannellum.org/) for 360° equirectangular panorama rendering.
*   **AI Backend**: Google Gemini API (via REST) for generating game graphs (JSON) and images.
*   **Data Persistence**: LocalStorage for auto-saving state; JSON/ZIP export/import for sharing games.

### Data Structure & Architecture
The game engine is data-driven, powered by a strictly typed JSON graph structure.
*   **Game Graph**: A JSON object containing a list of `Scenes` and a `Start` pointer.
*   **Scenes**: The fundamental units of the game. Can be `base` (360° rooms) or `overlay` (2D close-ups).
*   **Actions**: Define interactivity (Move, Look, Interact) and logic (requirements, item giving).
*   **State**: Tracks the player's current location, inventory, and active overlay.

For detailed technical specifications, please refer to the following documentation:
*   [**Agents.MD**](Agents.MD): Instructions for AI agents on how to generate valid game graphs.
*   [**Scenes.MD**](Scenes.MD): Detailed schema for Scene objects, including compass alignment and asset naming.
*   [**State.MD**](State.MD): Definition of the runtime state model (inventory, current scene, overlays).

---

## 🇪🇸 Español

#
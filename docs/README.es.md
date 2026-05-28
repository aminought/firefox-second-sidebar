[English](../README.md) | **Español**

Un script userChrome.js de Firefox que aporta una segunda barra lateral con paneles web como en Vivaldi/Edge/Floorp pero mejor.

<img width="2200" height="2131" alt="promo-rounded" src="https://github.com/user-attachments/assets/020ee8cf-1f3d-4184-98fe-889be89d6145" />

## Motivación

He probado varios navegadores, como Vivaldi, Edge, Floorp y Zen, y todos tienen algo en común sin lo cual no puedo imaginar usar un navegador — la barra lateral. Lamentablemente, Firefox, que más se ajusta a mis necesidades, tiene una barra lateral bastante insatisfactoria. ¡Así que decidí crear otra yo mismo, con blackjack y acompañantes!

## Demo

https://github.com/user-attachments/assets/cd79d644-ca2c-4a30-ae8e-c265f41768b6

## Características

### Barra lateral

- Acciones: `Mostrar` • `Ocultar`
- Personalizar vía [Personalizar barra de herramientas...](https://support.mozilla.org/es/kb/customize-firefox-controls-buttons-and-toolbars)
- Configuración:
  - General: `Posición (Izquierda / Derecha)` • `Ancho`
  - Visibilidad: `Ocultar automáticamente la barra lateral` • `Comportamiento de ocultación automática (En línea / Superposición)` • `Ocultar panel web cuando la barra lateral está oculta` • `Atajo para ocultar/mostrar la barra lateral`
  - Panel web: `Desplazamiento predeterminado del panel flotante` • `Posición del nuevo panel (Antes del botón más / Después del botón más)` • `Mostrar indicador de geometría`
  - Botón del panel web: `Indicador de contenedor (Desactivado / Izquierda / Derecha / Arriba / Abajo / Alrededor)` • `Información sobre herramienta (Desactivado / Título / URL / Título y URL)` • `Mostrar URL completa en la información`
  - Barra de herramientas del panel web: `Ocultar automáticamente el botón adelante` • `Ocultar automáticamente el botón atrás`
  - Animaciones: `Animar barra lateral` • `Animar barra de herramientas del panel web`

### Paneles web

- Acciones: `Crear` • `Eliminar` • `Editar` • `Cambiar posición y tamaño` • `Restablecer posición y tamaño` • `Descargar` • `Silenciar` • `Activar sonido` • `Fijar` • `Desfijar` • `Cambiar zoom` • `Atrás` • `Adelante` • `Recargar` • `Inicio`
- Soporte de extensiones
- Soporte de notificaciones emergentes (permisos de micrófono/cámara/ubicación, etc.)
- Configuración:
  - General: `URL` • `Contenedor multi-cuenta` • `Temporal` • `Vista móvil` • `Zoom`
  - Título: `Dinámico` • `Establecer título estático`
  - Favicon: `Dinámico` • `Establecer favicon estático`
  - Posición y tamaño: `Modo (Flotante / Fijado)` • `Siempre encima` • `Ancla de posición` • `Desplazamiento horizontal` • `Desplazamiento vertical` • `Ancho` • `Alto`
  - Carga: `Cargar en memoria al inicio` • `Restaurar la última página abierta` • `Descargar de la memoria al cerrar` • `Recarga periódica`
  - Atajo de teclado: `Atajo para ocultar/mostrar el panel web`
  - Selector CSS: `Activar` • `Establecer selector CSS`
  - Ocultar elementos: `Ocultar barra de herramientas` • `Ocultar icono de sonido` • `Ocultar insignia de notificación`

### Widgets

- `Segunda barra lateral` para mostrar / ocultar la barra lateral

## Instalación

### Instalación con un clic (Windows, recomendado)

Abrir PowerShell como **administrador** y ejecutar:

```powershell
irm https://raw.githubusercontent.com/aminought/firefox-second-sidebar/master/install.ps1 | iex
```

El script realizará automáticamente:

1. Descargar fx-autoconfig y Second Sidebar desde GitHub
2. Detectar el directorio de instalación de Firefox y la carpeta de perfil
3. Instalar los archivos de programa y perfil de fx-autoconfig
4. Instalar el script Second Sidebar
5. Verificar la instalación

> **Privilegios de administrador**: El `config.js` de fx-autoconfig debe copiarse a `C:\Program Files\Mozilla Firefox\`, lo que requiere privilegios de administrador.

**Desinstalación:**

```powershell
irm https://raw.githubusercontent.com/aminought/firefox-second-sidebar/master/uninstall.ps1 | iex
```

### Instalación manual

1. Instalar [fx-autoconfig](https://github.com/MrOtherGuy/fx-autoconfig).
2. Copiar el contenido del directorio `src/` (`second_sidebar/` y `second_sidebar.uc.mjs`) en `chrome/JS/`.
3. Habilitar `toolkit.legacyUserProfileCustomizations.stylesheets` y `dom.allow_scripts_to_close_windows` en `about:config`.
4. [Limpiar](https://github.com/MrOtherGuy/fx-autoconfig?tab=readme-ov-file#deleting-startup-cache) la caché de inicio.
5. ¡Disfrutar!

## Localización

El script soporta múltiples idiomas y muestra automáticamente la interfaz en el idioma de Firefox.

### Añadir un nuevo idioma

1. Copiar `en-US.mjs` a un nuevo archivo (ej: `it.mjs`)
2. Reemplazar los valores en inglés con traducciones (no cambiar las claves)
3. Importar y registrar el nuevo idioma en `index.mjs`
4. Enviar un PR

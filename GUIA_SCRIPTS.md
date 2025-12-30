# 📜 Guía de Uso - scripts.js

## Descripción

El archivo [`scripts.js`](file:///c:/Users/Usuario/Desktop/sitio%20web/scripts.js) centraliza todo el código JavaScript del sitio web BURGUERTOP, mejorando la organización, mantenibilidad y rendimiento.

---

## ✨ Funciones Incluidas

### 1. **Menú de Navegación Responsive**

```javascript
myFunction()
```

**Qué hace:** Alterna entre el menú normal y responsive en dispositivos móviles.

**Mejora adicional:** Cierra automáticamente el menú al hacer clic en un enlace (mejora UX).

---

### 2. **Validación de Formulario de Contacto**

```javascript
validarFormulario(event)
```

**Qué hace:**
- Valida que los campos no estén vacíos
- Verifica formato de email correcto
- Muestra mensajes de error específicos
- Previene envío si hay errores

**Uso automático:** Se activa cuando el formulario en `contacto.html` se envía.

---

### 3. **Scroll Suave**

**Qué hace:** Añade animación suave al hacer clic en enlaces internos (ej: `<a href="#seccion">`).

**Uso automático:** Funciona con cualquier enlace que empiece con `#`.

---

### 4. **Efectos Hover Mejorados**

**Qué hace:** Añade efecto de escala (zoom) a las imágenes del equipo al pasar el mouse.

**Uso automático:** Se aplica a `.imgenequipo1`, `.imgenequipo2`, `.imgenequipo3`.

---

### 5. **Lazy Loading de Imágenes** (Opcional)

**Qué hace:** Carga imágenes solo cuando están a punto de aparecer en pantalla (mejora rendimiento).

**Cómo usar:**
```html
<!-- En lugar de: -->
<img src="imagen.jpg" alt="...">

<!-- Usar: -->
<img data-src="imagen.jpg" alt="...">
```

---

### 6. **Tracking de Eventos** (Preparado para Google Analytics)

```javascript
trackEvent(category, action, label)
```

**Qué hace:** Prepara el sitio para rastrear eventos con Google Analytics.

**Uso automático:** Trackea clics en enlaces externos automáticamente.

---

### 7. **Utilidades Generales**

**getCurrentYear()** - Obtiene el año actual
- Útil para actualizar el footer automáticamente

**debug(message)** - Función de depuración
- Activar/desactivar con la constante `DEBUG`

---

## 🔧 Cómo Usar en HTML

### Agregar el Script

Ya está agregado en todas las páginas:

```html
<head>
    ...
    <script src="scripts.js" defer></script>
</head>
```

**Nota:** El atributo `defer` asegura que el script se ejecute después de que el HTML esté completamente cargado.

---

## 📝 Ejemplos de Uso

### Ejemplo 1: Validar Formulario Personalizado

```javascript
// El formulario ya está vinculado automáticamente
// Pero puedes personalizarlo editando la función en scripts.js
```

### Ejemplo 2: Agregar Tracking Personalizado

```javascript
// En scripts.js o en tu HTML
button.addEventListener('click', function() {
    trackEvent('Button', 'Click', 'Comprar Hamburguesa');
});
```

### Ejemplo 3: Activar Modo Debug

```javascript
// En scripts.js, cambiar:
const DEBUG = false; // a
const DEBUG = true;

// Ahora verás mensajes de depuración en la consola del navegador
```

---

## 🎯 Ventajas de Centralizar JavaScript

✅ **Mantenimiento más fácil** - Un solo archivo para editar  
✅ **Mejor rendimiento** - El navegador cachea el archivo  
✅ **Código reutilizable** - Mismas funciones en todas las páginas  
✅ **Más limpio** - HTML sin scripts inline  
✅ **Mejor debugging** - Fácil encontrar y corregir errores  

---

## 🛠️ Personalización

### Agregar Nuevas Funciones

1. Abre [`scripts.js`](file:///c:/Users/Usuario/Desktop/sitio%20web/scripts.js)
2. Agrega tu función al final o en la sección correspondiente
3. Documenta con comentarios

**Ejemplo:**
```javascript
// ===========================
// MI NUEVA FUNCIÓN
// ===========================

/**
 * Descripción de lo que hace
 */
function miNuevaFuncion() {
    // Tu código aquí
    console.log('¡Hola BURGUERTOP!');
}

// Llamar la función cuando se cargue la página
document.addEventListener('DOMContentLoaded', miNuevaFuncion);
```

### Modificar Funciones Existentes

1. Busca la función en [`scripts.js`](file:///c:/Users/Usuario/Desktop/sitio%20web/scripts.js)
2. Modifica según necesites
3. Guarda y recarga la página

---

## 🐛 Debugging

### Ver Errores de JavaScript

1. Abre el navegador (Chrome/Firefox/Edge)
2. Presiona `F12` para abrir DevTools
3. Ve a la pestaña "Console"
4. Busca mensajes de error o warnings

### Activar Modo Debug

En [`scripts.js`](file:///c:/Users/Usuario/Desktop/sitio%20web/scripts.js):
```javascript
const DEBUG = true; // Cambiar a true
```

Esto mostrará información útil en la consola.

---

## 📦 Estructura del Archivo

```
scripts.js
├── Menú Responsive
├── Validación de Formularios
├── Animaciones Scroll
├── Efectos Hover
├── Lazy Loading
├── Analytics/Tracking
└── Utilidades Generales
```

---

## ✅ Checklist de Integración

- [x] Archivo `scripts.js` creado
- [ ] Referencia a `scripts.js` en `index.html`
- [ ] Referencia a `scripts.js` en `tema.html`
- [ ] Referencia a `scripts.js` en `equipo.html`
- [ ] Referencia a `scripts.js` en `contacto.html`
- [ ] Eliminar scripts inline de todas las páginas
- [ ] Probar menú responsive
- [ ] Probar validación de formulario
- [ ] Verificar en navegador

---

## 🚀 Próximos Pasos

1. **Agregar referencia en todos los HTML** - Reemplazar scripts inline
2. **Probar en navegador** - Verificar que todo funcione
3. **Optimizar según necesidad** - Agregar/quitar funciones
4. **Integrar Google Analytics** - Si decides usar tracking

---

## 💡 Consejos

- Siempre usa `defer` en el script tag
- Mantén el código organizado con comentarios
- Prueba cambios en un navegador antes de publicar
- Usa la consola del navegador para debugging
- Comenta código que no uses en lugar de borrarlo

---

**Archivo creado para:** BURGUERTOP  
**Última actualización:** 2024

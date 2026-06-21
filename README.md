# Césped Gramma

Web comercial estática, rápida y responsive para venta de césped natural.

## Personalización antes de publicar

1. Editar `js/config.js` con el teléfono y WhatsApp reales.
2. Sustituir los campos entre corchetes de `aviso-legal.html`.
3. Confirmar dominio y cambiar `https://www.cespedgramma.es/` en `index.html`, `robots.txt` y `sitemap.xml` si fuera diferente.
4. Ajustar el área de servicio y horario en los datos estructurados de `index.html`.

## Desarrollo

No requiere compilación ni dependencias. Puede abrirse directamente o servirse con cualquier servidor estático:

```powershell
python -m http.server 8000
```

La configuración de contacto está centralizada en `js/config.js`. El formulario no almacena datos: construye un mensaje y abre WhatsApp.

La calculadora de superficie permite introducir largo y ancho, aplicar un margen de recorte y enviar el resultado orientativo por WhatsApp. No calcula precios ni sustituye la revisión final del pedido.

El catálogo comercial usa categorías de proyecto provisionales y está conectado a la calculadora. Antes de publicar con datos definitivos deben sustituirse por las variedades, fotografías, fichas técnicas y condiciones reales facilitadas por el cliente.

## Visor 3D

La sección `#visor-3d` incluye una maqueta interactiva ligera creada con CSS 3D y JavaScript, sin librerías externas. Cuando el cliente facilite fotografías, medidas y variedades concretas, puede sustituirse por un modelo GLB/GLTF fotorealista manteniendo la misma sección y sus textos comerciales.

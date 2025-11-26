# Demo API — CodeFarm

Página simple (estática) para probar los endpoints del backend desde una UI mínima que mantiene el estilo del frontend.

Archivos creados:
- `api-demo.html` — interfaz HTML.
- `api-demo.js` — lógica JS que hace fetch a los endpoints.

Instrucciones rápidas:

1) Ajusta la `Base API URL` en la parte superior de la página. Debe apuntar a la ruta donde está desplegada la función Firebase (ej: `https://us-central1-<project>.cloudfunctions.net/api`).

2) Sirve la carpeta `demo/` con un servidor estático para evitar problemas de CORS/archivo local. Desde PowerShell en Windows puedes usar:

```powershell
# con Python instalado
python -m http.server 8000

# o con http-server (npm)
npx http-server -p 8000
```

3) Abre en el navegador `http://localhost:8000/api-demo.html` y prueba los endpoints.

Notas:
- La demo es una herramienta de exposición/demo.
- Soporte de Authorization: ahora la UI incluye un campo "Authorization" donde puedes pegar el token (por ejemplo "Bearer <token>").
- Guardado automático: pulsa "Guardar" para persistir el token en el navegador (localStorage). Pulsa "Limpiar" para quitarlo.
- Extraer token desde respuesta: si tu endpoint de login devuelve un token en campos comunes (token, accessToken, idToken...), tras recibir la respuesta puedes ejecutar la función desde la consola del navegador:

```js
window.__apiDemo.saveTokenFromLastResponse()
```

Esto intentará extraer el primer campo de token válido de la última respuesta y lo guardará en localStorage.
- Reemplaza los placeholders en los paths (ej. `{userId}`) cuando pulses "Enviar" — la demo te pedirá el valor.

Próximo paso sugerido:
- Integrar login automático: detectar la respuesta de `POST /auth/login`, extraer token y guardarlo automáticamente.

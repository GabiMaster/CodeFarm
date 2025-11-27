document.addEventListener('DOMContentLoaded', () => {
    // Elementos de la UI
    const baseUrlInput = document.getElementById('baseUrl');
    const authTokenInput = document.getElementById('authToken');
    const saveTokenBtn = document.getElementById('saveToken');
    const clearTokenBtn = document.getElementById('clearToken');
    const pathInput = document.getElementById('path');
    const methodInput = document.getElementById('method');
    const bodyTextarea = document.getElementById('body');
    const sendBtn = document.getElementById('sendBtn');
    const previewBtn = document.getElementById('previewBtn');
    const responsePre = document.getElementById('response');
    const logPre = document.getElementById('log');
    const outgoingPre = document.getElementById('outgoing');
    const copyPayloadBtn = document.getElementById('copyPayload');
    const endpoints = document.querySelectorAll('.endpoint');

    const log = (message) => {
        const timestamp = new Date().toLocaleTimeString();
        logPre.textContent = `[${timestamp}] ${message}\n` + logPre.textContent;
    };

    // Cargar token guardado
    const loadSavedToken = () => {
        const savedToken = localStorage.getItem('authToken');
        if (savedToken) {
            authTokenInput.value = savedToken;
            log('Token de autorización cargado desde localStorage.');
        }
    };

    // Guardar token
    saveTokenBtn.addEventListener('click', () => {
        const token = authTokenInput.value;
        if (token) {
            localStorage.setItem('authToken', token);
            log('Token de autorización guardado en localStorage.');
            alert('Token guardado.');
        } else {
            log('Intento de guardar un token vacío.');
            alert('El campo del token está vacío.');
        }
    });

    // Limpiar token
    clearTokenBtn.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        authTokenInput.value = '';
        log('Token de autorización eliminado de localStorage y del campo.');
        alert('Token limpiado.');
    });

    // Plantillas de body para cada endpoint
    const defaultBodies = {
        'POST /auth/register': { email: 'user@example.com', password: 'your-password', displayName: 'New User' },
        'POST /auth/login': { email: 'user@example.com', password: 'your-password' },
        'POST /auth/change-password': { oldPassword: 'current-password', newPassword: 'new-strong-password' },
        'POST /projects': { name: 'My New Project', language: 'python' },
        'PUT /projects/{projectId}': { name: 'Updated Project Name', language: 'javascript' },
        'POST /files': { projectId: 'your-project-id', name: 'main.py', content: "print('Hello, World!')" },
        'PUT /files/{fileId}': { name: 'new-filename.js', content: "console.log('Hello from updated file!');" },
        'POST /executions': { projectId: 'your-project-id', fileId: 'your-file-id' },
        'POST /projects/{projectId}/collaborators': { userId: 'collaborator-user-id', role: 'editor' },
        'POST /comments': { fileId: 'your-file-id', content: 'This is a great comment!', line: 10 },
        'PUT /comments/{commentId}': { content: 'This is an updated comment!' },
        'PUT /users/{userId}': { displayName: 'Updated User Name', profilePictureUrl: 'https://example.com/new-pic.png' },
        'POST /notifications/{notificationId}/read': {},
        'POST /files/{fileId}/versions/{versionId}/revert': {}
    };

    const getFormattedJson = (data) => {
        if (!data) return '';
        return JSON.stringify(data, null, 2);
    };

    const setBodyForEndpoint = (method, path) => {
        const key = `${method} ${path}`;
        const defaultBody = defaultBodies[key];

        if (defaultBody) {
            bodyTextarea.value = getFormattedJson(defaultBody);
            bodyTextarea.placeholder = 'Edita el JSON body para tu petición.';
        } else {
            bodyTextarea.value = '';
            if (['POST', 'PUT', 'PATCH'].includes(method)) {
                bodyTextarea.placeholder = '{\n  "key": "value"\n}';
            } else {
                bodyTextarea.placeholder = 'No se requiere body para este método.';
            }
        }
    };

    // Rellenar campos al hacer clic en un endpoint
    endpoints.forEach(endpoint => {
        endpoint.addEventListener('click', () => {
            const path = endpoint.getAttribute('data-path');
            const method = endpoint.getAttribute('data-method');

            pathInput.value = path;
            methodInput.value = method;

            log(`Endpoint seleccionado: ${method} ${path}`);
            
            responsePre.textContent = 'Esperando acción...';
            outgoingPre.textContent = 'Sin payload aún';
            setBodyForEndpoint(method, path);
        });
    });

    const buildRequest = () => {
        // CORRECCIÓN: Eliminar la URL de desarrollo por defecto para seguridad.
        // El usuario debe introducirla manualmente.
        const baseUrl = baseUrlInput.value.trim().replace(/\/$/, '');
        const path = pathInput.value.trim();
        const method = methodInput.value.trim().toUpperCase();

        // CORRECCIÓN CLAVE: Validar que no queden parámetros sin reemplazar en la URL.
        // Si el path todavía contiene llaves, significa que el usuario no ha introducido un ID real.
        if (path.includes('{') || path.includes('}')) {
            alert(`Error: Por favor, reemplaza los parámetros en el Path (ej: {projectId}) con un valor real antes de enviar la petición.`);
            log(`Error: Intento de enviar una petición con parámetros sin reemplazar en el path: ${path}`);
            return null;
        }

        const url = `${baseUrl}${path}`; // Ahora la URL se construye con el path ya corregido por el usuario.
        const token = authTokenInput.value.trim();

        const headers = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = token;
        }

        const requestOptions = {
            method: method,
            headers: headers,
        };

        let body = null;
        if (['POST', 'PUT', 'PATCH'].includes(method)) {
            try {
                body = bodyTextarea.value.trim();
                if (body) {
                    // CORRECCIÓN: Asegurarse de que el body es un JSON válido antes de continuar.
                    JSON.parse(body);
                    requestOptions.body = body;
                }
            } catch (e) {
                log(`Error: El body no es un JSON válido. ${e.message}`);
                alert('Error: El JSON en el body no es válido.');
                return null;
            }
        }

        const outgoingPayload = {
            URL: url,
            Method: method,
            // CORRECCIÓN: No mostrar el token completo en el payload para mayor seguridad visual.
            Headers: { ...headers, Authorization: headers.Authorization ? 'Bearer ...' : 'N/A' },
            Body: body ? JSON.parse(body) : 'N/A',
        };

        outgoingPre.textContent = JSON.stringify(outgoingPayload, null, 2);
        log('Payload de la petición generado.');

        return { url, options: requestOptions };
    };

    // Previsualizar la petición
    previewBtn.addEventListener('click', () => {
        log('Previsualizando la petición...');
        buildRequest(); // Esto generará y mostrará el payload
    });

    // Enviar la petición
    sendBtn.addEventListener('click', async () => { // Línea 158
        log('Botón "Enviar" presionado.');
        const request = buildRequest();

        if (!request) {
            responsePre.textContent = 'Error al construir la petición. Revisa el log y el body.';
            return;
        }

        const { url, options } = request;

        responsePre.textContent = 'Enviando petición...';
        log(`Enviando ${options.method} a ${url}`);

        try {
            const startTime = Date.now();
            const response = await fetch(url, options);
            const endTime = Date.now();

            const duration = endTime - startTime;
            const status = response.status;
            const statusText = response.statusText;

            const responseData = await response.json();

            const formattedResponse = {
                status: `${status} ${statusText}`,
                duration: `${duration}ms`,
                headers: Object.fromEntries(response.headers.entries()),
                body: responseData,
            };

            responsePre.textContent = JSON.stringify(formattedResponse, null, 2);
            log(`Respuesta recibida: ${status}. Duración: ${duration}ms.`);

        } catch (error) {
            responsePre.textContent = `Error en la petición:\n\n${error.message}\n\nRevisa la consola del navegador y la URL base de la API.`;
            log(`Error en fetch: ${error.message}`);
        }
    });

    // Copiar payload
    copyPayloadBtn.addEventListener('click', () => {
        const payloadText = outgoingPre.textContent;
        if (payloadText && payloadText !== 'Sin payload aún') {
            navigator.clipboard.writeText(payloadText).then(() => {
                log('Payload copiado al portapapeles.');
                alert('Payload copiado al portapapeles.');
            }).catch(err => {
                log(`Error al copiar: ${err}`);
                alert('No se pudo copiar el payload.');
            });
        } else {
            log('Intento de copiar un payload vacío.');
        }
    });

    // Copiar token al hacer clic en la respuesta
    responsePre.addEventListener('click', () => {
        try {
            const responseText = responsePre.textContent;
            const responseJson = JSON.parse(responseText);

            // Busca el token en el cuerpo de la respuesta
            if (responseJson && responseJson.body && responseJson.body.token) {
                const token = responseJson.body.token;
                // CORRECCIÓN: Autocompletar el campo de autorización y guardarlo.
                const bearerToken = `Bearer ${token}`;
                authTokenInput.value = bearerToken;
                localStorage.setItem('authToken', bearerToken);
                log('Token autocompletado y guardado en localStorage.');

                navigator.clipboard.writeText(bearerToken).then(() => {
                    log('Token copiado al portapapeles.');
                    alert('¡Token copiado al portapapeles!');
                }).catch(err => {
                    log(`Error al copiar el token: ${err}`);
                });
            }
        } catch (_e) {
            // No hacer nada si el contenido no es un JSON válido o no hay token.
        }
    });

    // Inicialización
    log('Demo de API inicializada.');
    loadSavedToken();
});

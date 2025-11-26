# CodeFarm 🌱

Plataforma colaborativa de desarrollo de código en tiempo real con ejecución de código integrada.

## 📱 Stack Tecnológico

### Frontend
- **Expo** - Framework para React Native
- **React Native** - Desarrollo móvil multiplataforma
- **File-based routing** - Sistema de navegación basado en archivos

### Backend
- **Node.js 24** - Runtime de JavaScript
- **Firebase Cloud Functions (2nd Gen)** - Serverless functions
- **Firebase Realtime Database** - Base de datos en tiempo real
- **Firebase Authentication** - Autenticación de usuarios
- **Firebase Storage** - Almacenamiento de archivos
- **Joi** - Validación de esquemas

---

## 🚀 API REST - Endpoints Disponibles

**Base URL (Producción):**
```
https://us-central1-codefarm-9eab9.cloudfunctions.net/api
```

### 🔐 Auth (3 endpoints)
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Login
- `POST /auth/change-password` - Cambiar contraseña

### 📁 Projects (5 endpoints)
- `POST /projects` - Crear proyecto
- `GET /projects/:id` - Obtener proyecto por ID
- `GET /projects/user/:userId` - Proyectos por usuario
- `PUT /projects/:id` - Actualizar proyecto
- `DELETE /projects/:id` - Eliminar proyecto

### 📄 Files (4 endpoints)
- `POST /files` - Crear archivo
- `GET /files/project/:projectId` - Archivos por proyecto
- `PUT /files/:id` - Actualizar archivo
- `DELETE /files/:id` - Eliminar archivo

### 👤 Users (2 endpoints)
- `GET /users/:id` - Obtener usuario
- `PUT /users/:id` - Actualizar usuario

### 🔔 Notifications (1 endpoint)
- `GET /notifications/:userId` - Notificaciones de usuario

### 👥 Collaborators (5 endpoints)
- `POST /collaborators` - Agregar colaborador
- `GET /collaborators/project/:projectId` - Colaboradores por proyecto
- `GET /collaborators/user/:userId` - Colaboraciones por usuario
- `PUT /collaborators/:id` - Actualizar rol
- `DELETE /collaborators/:id` - Eliminar colaborador

### ▶️ Executions (3 endpoints)
- `POST /executions` - Ejecutar código
- `GET /executions/:id` - Obtener ejecución
- `GET /executions/project/:projectId` - Ejecuciones por proyecto

### 💬 Comments (4 endpoints)
- `POST /comments` - Crear comentario
- `GET /comments/file/:fileId` - Comentarios por archivo
- `PUT /comments/:id` - Actualizar comentario
- `DELETE /comments/:id` - Eliminar comentario

### 📌 Versions (3 endpoints)
- `POST /versions` - Crear versión
- `GET /versions/file/:fileId` - Versiones por archivo
- `POST /versions/:id/restore` - Restaurar versión

**Total: 30 endpoints funcionales** ✅

---

## 🛠️ Configuración del Proyecto

### Frontend (Expo)

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Iniciar la app**
   ```bash
   npx expo start
   ```

3. **Opciones de ejecución:**
   - [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
   - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
   - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
   - [Expo Go](https://expo.dev/go)

### Backend (Firebase Functions)

1. **Navegar a la carpeta functions**
   ```bash
   cd functions
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear archivo `functions/.env.dev`:
   ```env
   NODE_ENV=dev
   URL_APP=http://127.0.0.1:5001/codefarm-9eab9/us-central1
   CREDENTIALS_FILE_NAME=codefarm-9eab9-firebase-adminsdk-fbsvc-7c4ccc82f7.json
   RTDB_FIREBASE_DATABASE_URL=https://codefarm-9eab9-default-rtdb.firebaseio.com
   DB_BUCKET_NAME=codefarm-9eab9.firebasestorage.app
   CREDENTIALS_PATH_FILE_NAME=permissions/codefarm-9eab9-firebase-adminsdk-fbsvc-7c4ccc82f7.json
   ```

4. **Deploy a producción**
   ```bash
   firebase deploy --only functions
   ```

5. **Ejecutar localmente (emuladores)**
   ```bash
   firebase emulators:start
   ```

---

## 📂 Estructura del Proyecto

```
CodeFarm/
├── app/                          # Frontend React Native (Expo)
│   └── (routes)/                 # File-based routing
├── functions/                    # Backend Firebase Functions
│   ├── src/
│   │   ├── config/              # Configuración (Firebase, env)
│   │   ├── modules/             # Módulos de rutas
│   │   ├── repositories/        # Acceso a datos
│   │   ├── services/            # Lógica de negocio
│   │   └── utils/               # Utilidades
│   ├── permissions/             # Credenciales Firebase
│   ├── .env.dev                 # Variables de entorno desarrollo
│   ├── index.js                 # Entry point Functions
│   └── package.json
├── .firebaserc                   # Configuración Firebase CLI
├── firebase.json                 # Configuración Firebase
└── README.md
```

---

## 🔥 Firebase Configuration

### Services utilizados:
- ✅ **Cloud Functions (2nd Gen)** - API REST serverless
- ✅ **Realtime Database** - Base de datos NoSQL en tiempo real
- ✅ **Authentication** - Gestión de usuarios
- ✅ **Storage** - Almacenamiento de archivos
- ✅ **App Engine** - Infraestructura base

### Region: `us-central1`

---

## 📝 Ejemplo de uso de la API

### Registro de usuario
```bash
curl -X POST https://us-central1-codefarm-9eab9.cloudfunctions.net/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@codefarm.com",
    "password": "John1234",
    "displayName": "John Doe"
  }'
```

### Crear proyecto
```bash
curl -X POST https://us-central1-codefarm-9eab9.cloudfunctions.net/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "abc123",
    "name": "Mi Proyecto",
    "description": "Descripción del proyecto",
    "language": "javascript"
  }'
```

---

## 👥 Equipo de Desarrollo

Proyecto desarrollado como TPI (Trabajo Práctico Integrador) para:
- **Materia:** Programación III
- **Institución:** T.U.P - Tecnicatura Universitaria en Programación
- **Año:** 2° Año - 1° Cuatrimestre

---

## 📖 Recursos de Aprendizaje

### Expo
- [Documentación de Expo](https://docs.expo.dev/)
- [Tutorial de Expo](https://docs.expo.dev/tutorial/introduction/)

### Firebase
- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloud Functions Guide](https://firebase.google.com/docs/functions)

### React Native
- [React Native Documentation](https://reactnative.dev/)

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

---

## 📄 Licencia

Este proyecto es parte de un trabajo académico para la Tecnicatura Universitaria en Programación.

---

## 🌐 Links Útiles

- **Firebase Console:** https://console.firebase.google.com/project/codefarm-9eab9
- **Google Cloud Console:** https://console.cloud.google.com/home/dashboard?project=codefarm-9eab9
- **API Base URL:** https://us-central1-codefarm-9eab9.cloudfunctions.net/api

---

## 📞 Soporte

Para dudas o problemas, crear un issue en el repositorio de GitHub.

---

**Hecho con ❤️ por el equipo de CodeFarm**
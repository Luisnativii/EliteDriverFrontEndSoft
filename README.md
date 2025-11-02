# EliteDrive — Frontend

## Equipo: Asesuisa

Este es el repositorio del frontend de **EliteDrive**, una aplicación web para la reserva y gestión de vehículos. El sistema permite a los usuarios alquilar autos disponibles y a los administradores gestionar el inventario, mantenimiento y reservas de manera centralizada.

## Demo

_(Agrega aquí el enlace a la versión desplegada si ya lo has subido a Vercel, Netlify, etc.)_

---

## 🛠️ Tecnologías utilizadas

| Capa             | Tecnología usada     |
|------------------|----------------------|
| **Frontend**     | React.js             |
| **Backend**      | Spring Boot (Java)   |
| **Base de datos**| PostgreSQL           |

📌 Aunque en la propuesta inicial se consideraron Go y MongoDB, en la versión final del proyecto se optó por **Spring Boot** como backend y **PostgreSQL** para persistencia.

---

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/PNC-012025/pnc-proyecto-final-frontend-grupo-04-s01.git
cd pnc-proyecto-final-frontend-grupo-04-s01
cd elite-drive-client
code .
```

2. Instala las dependencias:

```bash
npm install
npm install react-big-calendar date-fns
npm install react-toastify
```

3. Inicia la aplicación:

```bash
npm run dev
# o
npm start
```

---

## Usuarios de prueba

### Administrador

- **Email:** `admin@example.com`  
- **Contraseña:** `adminadmin`  

El administrador puede:

- Gestionar vehículos (CRUD)
- Ver todas las reservas
- Administrar mantenimientos
- Consultar alertas de mantenimiento

###  Cliente (Usuario)

Para acceder como cliente, **debes registrarte** mediante el formulario de registro disponible en la web.

Los usuarios pueden:

- Visualizar vehículos disponibles
- Filtrar por características (marca, modelo, capacidad, etc.)
- Realizar reservas indicando fecha de inicio y fin
- Ver el precio total calculado automáticamente

---

##  Funcionalidades principales

- Visualización y filtrado de vehículos
- Registro y login de usuarios con JWT
- Sistema de reservas con calendario interactivo
- Gestión de mantenimientos
- Gestión de reservas
- Gestión de vehículos
- Visualización de alertas de mantenimiento
- Interfaz intuitiva y responsiva

---

##  Estructura del repositorio

```
elite-drive-frontend/
├── src/
│   ├── components/
│   ├── config/
│   ├── context/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── App.jsx
├── public/
└── package.json
```


##  Notas adicionales

- El calendario de reservas utiliza [`react-big-calendar`](https://github.com/jquense/react-big-calendar) y está integrado con `date-fns` para localización en español.
- Las notificaciones están integradas mediante [`react-toastify`](https://fkhadra.github.io/react-toastify/).

---

## 📜 Licencia

Este proyecto es parte del curso **Programación N Capas - Ciclo 01-25** y se encuentra bajo fines académicos.

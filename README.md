CalorIA Frontend

CalorIA es una aplicación móvil de coaching nutricional impulsada por inteligencia artificial. Permite a los usuarios registrar sus comidas, calcular automáticamente los macronutrientes y recibir recomendaciones personalizadas. Esta aplicación está desarrollada con React Native utilizando Expo SDK 53 y se integra con un backend construido en Spring Boot.

🚀 Características Principales
	•	Registro de comidas con análisis automático de macronutrientes.
	•	Recomendaciones personalizadas basadas en objetivos nutricionales.
	•	Interfaz intuitiva y fácil de usar.
	•	Integración con servicios de IA para análisis de alimentos.
	•	Sincronización en tiempo real con el backend para almacenar y recuperar datos del usuario. ￼

📱 Tecnologías Utilizadas
	•	React Native (Expo SDK 53): Framework para el desarrollo de aplicaciones móviles multiplataforma.
	•	JavaScript: Lenguaje de programación principal.
	•	Expo: Plataforma para facilitar el desarrollo y prueba de aplicaciones React Native.
	•	Axios: Cliente HTTP para realizar solicitudes al backend.
	•	React Navigation: Biblioteca para la navegación entre pantallas.
	•	Context API: Manejo del estado global de la aplicación.

 ⚙️ Instalación y Ejecución
	1.	Clona el repositorio:

     git clone https://github.com/briansittmann/CalorIA_SDK53.git
      cd CalorIA_SDK53


  2.	Instala las dependencias:
     npm install

	4.	Prueba en tu dispositivo:
	•	Escanea el código QR con la aplicación Expo Go en tu dispositivo móvil.
	•	También puedes utilizar un emulador de Android o iOS.


 🔗 Integración con el Backend

  La aplicación se comunica con un backend desarrollado en Spring Boot, el cual maneja la autenticación, almacenamiento de datos y lógica de negocio. Asegúrate de que el backend esté en funcionamiento y accesible desde la aplicación móvil.


  📂 Estructura del Proyecto

  CalorIA_SDK53/
├── assets/             # Recursos estáticos como imágenes y fuentes
├── src/                # Código fuente de la aplicación
│   ├── components/     # Componentes reutilizables
│   ├── screens/        # Pantallas de la aplicación
│   ├── navigation/     # Configuración de la navegación
│   ├── context/        # Contextos para el manejo de estado global
│   └── services/       # Servicios para la comunicación con el backend
├── App.js              # Punto de entrada de la aplicación
├── app.json            # Configuración de Expo
├── package.json        # Dependencias y scripts del proyecto
└── README.md           # Documentación del proyecto


🧪 Pruebas

Para realizar pruebas, puedes utilizar la aplicación Expo Go en tu dispositivo móvil o emuladores de Android/iOS. Asegúrate de que el backend esté corriendo y accesible para que la aplicación funcione correctamente.


👤 Autor

Brian Sittmann – @briansittmann

📄 Licencia

Este proyecto está licenciado bajo la MIT License.

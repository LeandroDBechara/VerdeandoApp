# Guía para Build de Desarrollo

## Cambios realizados en la rama `pruebasLogin`

### 1. Google Maps (mapa en blanco en dev build)

**Problema:** El mapa funciona en Expo Go pero no en el build de desarrollo.

**Solución:**
- Se creó `app.config.js` para inyectar la API key desde variables de entorno.
- **Para EAS Build:** Define el secret:
  ```bash
  eas secret:create --name GOOGLE_MAPS_API_KEY --value "TU_API_KEY_DE_GOOGLE_MAPS"
  ```
- **Para desarrollo local:** Crea un archivo `.env` con:
  ```
  EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
  ```
- En Google Cloud Console, habilita "Maps SDK for Android" y "Maps SDK for iOS".
- Para Android en producción: añade el SHA-1 del certificado de Play Store en las restricciones de la API key.

### 2. Login con Google y Facebook

**Problema:** Google no autoriza correctamente; Facebook muestra error de redirección.

**Solución:**
- Se cambió el scheme de la app a `verdeandoapp` (antes era el ID de Facebook).
- Se configuró `useProxy: false` para usar redirección nativa directa.
- **Debes registrar el Redirect URI** en ambas consolas:

  Al iniciar la app en modo desarrollo, verás en consola:
  ```
  [OAuth] Redirect URI a registrar: verdeandoapp://redirect
  ```
  (Puede variar según plataforma, ej. `verdeandoapp:///redirect` en iOS)

  **Google Cloud Console:**
  1. APIs & Services → Credentials → Tu OAuth 2.0 Client ID
  2. En "Authorized redirect URIs" añade: `verdeandoapp://redirect`

  **Facebook Developer Console:**
  1. Tu app → Facebook Login → Settings
  2. En "Valid OAuth Redirect URIs" añade: `verdeandoapp://redirect`

- Variables de entorno necesarias en `.env`:
  ```
  EXPO_PUBLIC_WEB_CLIENT=...
  EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT=...
  EXPO_PUBLIC_GOOGLE_IOS_CLIENT=...
  EXPO_PUBLIC_FACEBOOK_ANDROID_CLIENT=...
  EXPO_PUBLIC_FACEBOOK_IOS_CLIENT=...
  ```

### 3. Warning setLayoutAnimationEnabledExperimental

**Problema:** Warning en consola sobre New Architecture.

**Solución:** Se añadió `LogBox.ignoreLogs` para suprimir este warning (es un no-op en New Architecture).

### 4. Otros ajustes

- **NewsletterContext:** Corregida la mutación directa del array en `calcularRelevancia` para evitar posibles bucles.

## Crear nueva build de desarrollo

```bash
# Asegúrate de estar en la rama pruebasLogin
git checkout pruebasLogin

# Configura los secrets de EAS (si no lo has hecho)
eas secret:create --name GOOGLE_MAPS_API_KEY --value "tu_api_key"

# Build para Android
eas build --profile development --platform android

# Build para iOS
eas build --profile development --platform ios
```

Para desarrollo local con `expo run:android` o `expo run:ios`, crea `.env` con las variables necesarias.

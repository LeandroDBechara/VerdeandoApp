# Guía de Configuración: Google y Facebook Authentication

## 🚀 Resumen Rápido

Esta guía te ayudará a configurar los redirect URIs necesarios para que la autenticación de Google y Facebook funcione correctamente en tu app.

**Tiempo estimado:** 10-15 minutos

**Lo que necesitas:**
- Acceso a Google Cloud Console (con el proyecto donde está tu OAuth Client ID)
- Acceso a Facebook Developers (con tu app configurada)
- Los valores de tu `.env` y `app.json` (ya los tienes)

---

## 📋 Información de tu App

- **Scheme**: `fb674819048296621`
- **Package Android**: `com.verdeando.app`
- **Bundle ID iOS**: `com.verdeando.app`
- **Google Web Client ID**: `28107125236-a44i9skkavnk850o5tob3s06i9ho7du4.apps.googleusercontent.com`
- **Facebook App ID**: `674819048296621`

---

## 🔵 PARTE 1: Configurar Google Cloud Console

### Paso 1: Acceder a Google Cloud Console

1. Ve a: **https://console.cloud.google.com/**
2. Inicia sesión con tu cuenta de Google
3. Selecciona el proyecto donde tienes configurado tu OAuth 2.0 Client ID

### Paso 2: Navegar a Credentials (Credenciales)

**Ruta exacta:**
1. En el menú lateral izquierdo (☰), busca y haz clic en **"APIs & Services"**
2. En el submenú que aparece, haz clic en **"Credentials"** (Credenciales)
3. Verás una lista de todas tus credenciales OAuth 2.0

### Paso 3: Editar el Web Client ID

1. En la lista de credenciales, busca el que tiene el ID: **`28107125236-a44i9skkavnk850o5tob3s06i9ho7du4.apps.googleusercontent.com`**
2. Haz clic en el **nombre** o en el **ícono de lápiz (✏️)** para editarlo
3. Se abrirá una página de edición

### Paso 4: Agregar Authorized Redirect URIs

En la página de edición, busca la sección **"Authorized redirect URIs"** (URI de redirección autorizados)

**Ubicación:** 
- Está en la parte inferior de la página, después de "Authorized JavaScript origins"
- Verás un campo de texto con un botón **"+ ADD URI"** o una lista de URIs existentes

**Cómo se ve:**
```
┌─────────────────────────────────────────────────┐
│ OAuth 2.0 Client IDs                            │
├─────────────────────────────────────────────────┤
│ Name: [Tu nombre de cliente]                    │
│ Client ID: 28107125236-...                      │
│                                                 │
│ Authorized JavaScript origins                  │
│ [Campo de texto]                                │
│                                                 │
│ Authorized redirect URIs  ← AQUÍ                │
│ ┌─────────────────────────────────────────┐    │
│ │ https://example.com/callback            │    │
│ │                                         │    │
│ │ [+ ADD URI] ← Haz clic aquí             │    │
│ └─────────────────────────────────────────┘    │
│                                                 │
│ [SAVE] [CANCEL]                                 │
└─────────────────────────────────────────────────┘
```

**Agrega estos URIs (uno por uno, haciendo clic en "+ ADD URI" para cada uno):**

```
fb674819048296621://
exp://localhost:8081
exp://127.0.0.1:8081
```

**Nota:** Si estás usando una IP específica en desarrollo (como viste en los logs: `192.168.100.89`), también agrega:
```
exp://192.168.100.89:8081
```

**⚠️ IMPORTANTE:** Copia y pega estos URIs exactamente como están escritos, sin espacios adicionales.

### Paso 5: Guardar los Cambios

1. Desplázate hacia abajo en la página
2. Haz clic en el botón **"SAVE"** (Guardar) en la parte inferior
3. Espera a que aparezca el mensaje de confirmación

---

## 🔵 PARTE 2: Configurar Facebook Developers

### Paso 1: Acceder a Facebook Developers

1. Ve a: **https://developers.facebook.com/**
2. Inicia sesión con tu cuenta de Facebook
3. Si no tienes una cuenta de desarrollador, créala (es gratis)

### Paso 2: Seleccionar tu App

1. En la parte superior derecha, haz clic en **"My Apps"** (Mis Apps)
2. Selecciona tu app con el ID: **`674819048296621`**
3. Si no ves tu app, haz clic en **"Create App"** y crea una nueva

### Paso 3: Ir a Settings (Configuración)

**Ruta exacta:**
1. En el menú lateral izquierdo, busca y haz clic en **"Settings"** (Configuración)
2. Luego haz clic en **"Basic"** (Básico)
3. Verás la información básica de tu app

### Paso 4: Configurar App Domains (Opcional pero recomendado)

1. En la sección **"App Domains"** (Dominios de la app)
2. Si tienes un dominio web, agrégalo aquí
3. Si no tienes dominio, puedes dejarlo vacío

### Paso 5: Habilitar Facebook Login (si no está habilitado)

**Si no ves la opción "Valid OAuth Redirect URIs", primero debes habilitar Facebook Login:**

1. En el menú lateral izquierdo, busca **"Products"** (Productos) o **"Add Product"** (Agregar producto)
2. Si ves "Add Product", haz clic ahí
3. Busca **"Facebook Login"** en la lista de productos
4. Haz clic en **"Set Up"** (Configurar) o en el botón de configuración
5. Esto habilitará Facebook Login para tu app

### Paso 6: Configurar Valid OAuth Redirect URIs

**Ubicación (puede estar en dos lugares):**

**Opción A - En Settings → Basic:**
1. En el menú lateral izquierdo, haz clic en **"Settings"** → **"Basic"**
2. Desplázate hacia abajo hasta encontrar la sección **"Valid OAuth Redirect URIs"** (URI de redirección OAuth válidos)
3. Verás un campo de texto grande donde puedes agregar múltiples URIs

**Opción B - En Facebook Login Settings:**
1. En el menú lateral izquierdo, haz clic en **"Products"** → **"Facebook Login"** → **"Settings"**
2. Desplázate hasta la sección **"Valid OAuth Redirect URIs"**
3. Verás un campo de texto grande donde puedes agregar múltiples URIs

**Agrega estos URIs (uno por línea, presionando Enter después de cada uno):**

```
fb674819048296621://authorize
exp://localhost:8081
exp://127.0.0.1:8081
```

**Nota:** Si estás usando una IP específica en desarrollo (como viste en los logs: `192.168.100.89`), también agrega:
```
exp://192.168.100.89:8081
```

**⚠️ IMPORTANTE:** 
- Cada URI debe estar en una línea separada
- No agregues espacios al inicio o final
- Copia y pega exactamente como están escritos

### Paso 7: Configurar Platform Settings (Android e iOS)

#### Para Android:

1. En el menú lateral izquierdo, haz clic en **"Settings"** → **"Basic"**
2. Desplázate hasta la sección **"Add Platform"** (Agregar plataforma)
3. Haz clic en **"+ Add Platform"** y selecciona **"Android"**
4. Se agregará una sección de Android. Completa:
   - **Package Name**: `com.verdeando.app`
   - **Class Name**: `MainActivity` (o déjalo vacío)
   - **Key Hashes**: Agrega tu SHA-1 (puedes obtenerlo con el comando que está más abajo)

#### Para iOS:

1. En la misma sección **"Add Platform"**
2. Haz clic en **"+ Add Platform"** y selecciona **"iOS"**
3. Se agregará una sección de iOS. Completa:
   - **Bundle ID**: `com.verdeando.app`

### Paso 8: Guardar los Cambios

1. Desplázate hacia abajo en la página
2. Haz clic en el botón **"Save Changes"** (Guardar cambios)
3. Espera a que aparezca el mensaje de confirmación

---

## 🔧 Obtener Key Hash para Facebook (Android)

Si necesitas agregar el Key Hash a Facebook para Android, ejecuta este comando en tu terminal:

**Para Windows (PowerShell):**
```powershell
keytool -exportcert -alias androiddebugkey -keystore %USERPROFILE%\.android\debug.keystore | openssl sha1 -binary | openssl base64
```

**Si no tienes openssl instalado, usa este método alternativo:**

1. Obtén tu SHA-1 (ya lo tienes en tu .env: `60:EE:45:A2:FA:43:40:90:E5:57:A2:47:A1:94:86:1F:6C:E5:DD:99`)
2. Convierte el SHA-1 a Base64 usando una herramienta online como: https://base64.guru/converter/encode/hex
3. Copia el resultado y pégalo en el campo "Key Hashes" de Facebook

---

## ✅ Verificación Final

### Para Google:
1. Ve a Google Cloud Console → APIs & Services → Credentials
2. Verifica que tu Web Client ID tenga los redirect URIs configurados
3. Asegúrate de que el estado sea **"Published"** (Publicado)

### Para Facebook:
1. Ve a Facebook Developers → Tu App → Settings → Basic
2. Verifica que los OAuth Redirect URIs estén guardados
3. Verifica que las plataformas Android e iOS estén configuradas correctamente

---

## 🚀 Próximos Pasos

Después de completar estas configuraciones:

1. **Reinicia tu servidor de Expo:**
   ```bash
   # Detén el servidor (Ctrl+C) y reinicia
   npx expo start --clear
   ```

2. **Prueba la autenticación:**
   - Abre tu app
   - Intenta iniciar sesión con Google
   - Intenta iniciar sesión con Facebook
   - Revisa la consola para ver los logs

3. **Si encuentras errores:**
   - Revisa la consola de Expo para ver mensajes de error específicos
   - Verifica que los redirect URIs coincidan exactamente (sin espacios, mayúsculas/minúsculas correctas)
   - Asegúrate de que hayas guardado los cambios en ambas plataformas

---

## 📝 Notas Importantes

- Los cambios en Google Cloud Console pueden tardar unos minutos en aplicarse
- Los cambios en Facebook Developers se aplican inmediatamente
- Si cambias el scheme en `app.json`, recuerda actualizar los redirect URIs en ambas plataformas
- Para producción, necesitarás agregar los redirect URIs de producción también

---

## 🆘 Solución de Problemas Comunes

### Error: "redirect_uri_mismatch"
- **Causa**: El redirect URI no está configurado o no coincide exactamente
- **Solución**: Verifica que el URI en tu código coincida exactamente con el configurado en la consola (sin espacios, mismo formato)

### Error: "Client Id property must be defined"
- **Causa**: Las variables de entorno no están cargadas
- **Solución**: Reinicia el servidor con `npx expo start --clear`

### Error: "App not configured for Facebook Login"
- **Causa**: Facebook Login no está habilitado en tu app de Facebook
- **Solución**: Ve a Facebook Developers → Tu App → Add Product → Facebook Login → Set Up

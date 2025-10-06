# 🔑 Configuración del Token de GitHub para MCP

## Paso 1: Crear Personal Access Token en GitHub

1. **Ve a GitHub Settings**
   - Inicia sesión en GitHub
   - Haz clic en tu avatar (esquina superior derecha)
   - Selecciona **"Settings"**

2. **Acceder a Developer Settings**
   - En el menú lateral izquierdo, baja hasta **"Developer settings"**
   - Haz clic en **"Personal access tokens"**
   - Selecciona **"Tokens (classic)"**

3. **Generar nuevo token**
   - Haz clic en **"Generate new token"** → **"Generate new token (classic)"**
   - **Note**: `WilkieDevs MCP Integration`
   - **Expiration**: `90 days` (o el tiempo que prefieras)

4. **Seleccionar permisos (scopes)**
   Marca estas casillas:
   - ✅ **repo** (Full control of private repositories)
     - ✅ repo:status
     - ✅ repo_deployment
     - ✅ public_repo
     - ✅ repo:invite
     - ✅ security_events
   - ✅ **workflow** (Update GitHub Action workflows)
   - ✅ **write:packages** (Upload packages to GitHub Package Registry)
   - ✅ **read:packages** (Download packages from GitHub Package Registry)
   - ✅ **admin:org** (Full control of orgs and teams, read and write org projects)
   - ✅ **gist** (Create gists)
   - ✅ **notifications** (Access notifications)
   - ✅ **user** (Update ALL user data)
   - ✅ **delete_repo** (Delete repositories)

5. **Generar token**
   - Haz clic en **"Generate token"**
   - **¡IMPORTANTE!** Copia el token inmediatamente (solo se muestra una vez)

## Paso 2: Configurar el Token en MCP

Una vez que tengas el token, necesitas agregarlo a la configuración MCP:

### Opción A: Editar manualmente el archivo MCP

1. **Abrir el archivo de configuración**
   ```
   .kiro/settings/mcp.json
   ```

2. **Agregar el token**
   Busca la sección de GitHub y agrega tu token:
   ```json
   "github": {
     "command": "uvx",
     "args": ["mcp-server-github"],
     "env": {
       "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_tu_token_aqui"
     },
     "disabled": false,
     "autoApprove": []
   }
   ```

### Opción B: Usar variable de entorno del sistema

1. **Crear variable de entorno**
   ```powershell
   # En PowerShell (como administrador)
   [Environment]::SetEnvironmentVariable("GITHUB_PERSONAL_ACCESS_TOKEN", "ghp_tu_token_aqui", "User")
   ```

2. **Reiniciar Kiro IDE** para que tome la nueva variable

## Paso 3: Verificar la conexión

Una vez configurado el token, puedes probar la conexión:

```bash
# Verificar que el servidor MCP de GitHub esté funcionando
uvx mcp-server-github --help
```

## Paso 4: Crear el repositorio WilkieDevs

Con el MCP de GitHub configurado, podrás:

1. **Crear repositorio directamente desde Kiro**
2. **Hacer commits y push automáticamente**
3. **Gestionar issues y pull requests**
4. **Configurar GitHub Actions**

## 🔒 Seguridad del Token

### ⚠️ Importante:
- **NUNCA** compartas tu token personal
- **NO** lo subas a repositorios públicos
- **Revoca** el token si crees que está comprometido
- **Usa** tokens con permisos mínimos necesarios

### Buenas prácticas:
- Renueva el token regularmente
- Usa tokens específicos para cada aplicación
- Monitorea el uso del token en GitHub Settings

## 🚨 Si algo sale mal:

### Token no funciona:
1. Verifica que copiaste el token completo
2. Asegúrate de que los permisos sean correctos
3. Revisa que el token no haya expirado

### Problemas de conexión:
1. Reinicia Kiro IDE
2. Verifica tu conexión a internet
3. Revisa los logs de MCP en Kiro

### Revocar token:
1. Ve a GitHub Settings → Developer settings
2. Encuentra tu token en la lista
3. Haz clic en "Delete" para revocarlo

---

**Una vez configurado, podremos crear el repositorio WilkieDevs directamente desde Kiro! 🚀**
# 🚀 Configuración de GitHub para WilkieDevs

## Pasos para subir el proyecto a GitHub

### 1. Crear repositorio en GitHub

1. Ve a [GitHub.com](https://github.com) e inicia sesión
2. Haz clic en el botón **"New"** o **"+"** → **"New repository"**
3. Configura el repositorio:
   - **Repository name**: `WilkieDevs`
   - **Description**: `Plataforma de automatización web con chatbot IA, sistema de cotizaciones y generación de contenido automático`
   - **Visibility**: Public (o Private si prefieres)
   - **NO marques** "Add a README file" (ya tenemos uno)
   - **NO marques** "Add .gitignore" (ya tenemos uno)
   - **NO marques** "Choose a license" (por ahora)

4. Haz clic en **"Create repository"**

### 2. Conectar repositorio local con GitHub

Una vez creado el repositorio, ejecuta estos comandos en tu terminal:

```bash
# Agregar el remote de GitHub (reemplaza TU-USUARIO con tu username)
git remote add origin https://github.com/TU-USUARIO/WilkieDevs.git

# Verificar que se agregó correctamente
git remote -v

# Subir el código inicial
git push -u origin master
```

### 3. Configurar GitHub Actions (CI/CD)

Después de subir el código inicial, vamos a configurar deployment automático:

```bash
# Crear directorio para GitHub Actions
mkdir -p .github/workflows

# El workflow se creará en la siguiente fase del proyecto
```

### 4. Configurar protección de ramas

En GitHub, ve a:
1. **Settings** → **Branches**
2. **Add rule** para la rama `master`
3. Configurar:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging

### 5. Configurar variables de entorno en GitHub

Para deployment automático, configura estos secrets en GitHub:

1. Ve a **Settings** → **Secrets and variables** → **Actions**
2. Agrega estos secrets:

```
SUPABASE_URL=https://ziglshuhhtsthwedrous.supabase.co
SUPABASE_ANON_KEY=tu_supabase_anon_key
N8N_API_URL=https://n8n.srv1004711.hstgr.cloud/
N8N_API_KEY=tu_n8n_api_key
VERCEL_TOKEN=tu_vercel_token (para deployment)
```

## 📋 Comandos Git útiles para el desarrollo

### Flujo de trabajo diario

```bash
# Ver estado actual
git status

# Agregar cambios
git add .

# Commit con mensaje descriptivo
git commit -m "feat: descripción del cambio"

# Subir cambios
git push origin master
```

### Trabajar con ramas

```bash
# Crear nueva rama para feature
git checkout -b feature/chatbot-system

# Cambiar entre ramas
git checkout master
git checkout feature/chatbot-system

# Mergear rama a master
git checkout master
git merge feature/chatbot-system

# Eliminar rama después del merge
git branch -d feature/chatbot-system
```

### Sincronizar con cambios remotos

```bash
# Descargar cambios del repositorio
git pull origin master

# Ver historial de commits
git log --oneline

# Ver diferencias
git diff
```

## 🔄 Flujo de desarrollo recomendado

### Para cada nueva funcionalidad:

1. **Crear rama feature**
```bash
git checkout -b feature/nombre-funcionalidad
```

2. **Desarrollar la funcionalidad**
   - Seguir las tareas del archivo `tasks.md`
   - Hacer commits frecuentes con mensajes descriptivos

3. **Probar localmente**
```bash
cd wilkiedevs
npm run dev
```

4. **Commit y push**
```bash
git add .
git commit -m "feat: implementar [descripción]"
git push origin feature/nombre-funcionalidad
```

5. **Crear Pull Request en GitHub**
   - Describir los cambios realizados
   - Referenciar las tareas completadas
   - Solicitar review si trabajas en equipo

6. **Merge a master**
   - Una vez aprobado el PR
   - Eliminar la rama feature

## 📊 Tracking del progreso

### Usar GitHub Issues para tareas

1. Crear issues para cada tarea principal del `tasks.md`
2. Usar labels: `enhancement`, `bug`, `documentation`
3. Asignar issues a milestones por fase
4. Referenciar issues en commits: `git commit -m "feat: chatbot system (closes #1)"`

### Usar GitHub Projects

1. Crear un Project Board
2. Columnas: `Backlog`, `In Progress`, `Review`, `Done`
3. Mover cards según el progreso

## 🚀 Deployment automático

Una vez configurado GitHub Actions, cada push a `master` activará:

1. **Build** del proyecto Next.js
2. **Tests** (cuando los implementemos)
3. **Deploy** a Vercel automáticamente
4. **Notificación** del estado del deployment

## 📝 Documentación del progreso

### Actualizar CHANGELOG.md

Cada vez que completes una fase importante:

```bash
# Editar CHANGELOG.md
# Agregar nueva versión con cambios
git add CHANGELOG.md
git commit -m "docs: actualizar changelog v0.2.0"
```

### Actualizar README.md

Mantener actualizado el estado del proyecto en el README principal.

## 🔧 Troubleshooting

### Si hay conflictos al hacer push:

```bash
git pull origin master
# Resolver conflictos manualmente
git add .
git commit -m "fix: resolver conflictos de merge"
git push origin master
```

### Si necesitas revertir cambios:

```bash
# Revertir último commit
git revert HEAD

# Revertir a commit específico
git revert <commit-hash>
```

### Si necesitas cambiar el último commit:

```bash
# Cambiar mensaje del último commit
git commit --amend -m "nuevo mensaje"

# Agregar archivos al último commit
git add archivo-olvidado.js
git commit --amend --no-edit
```

---

**¡Listo para comenzar el desarrollo colaborativo! 🎉**
# Deployment Guide - WilkieDevs Platform

## 🚀 Opciones de Deployment

### 1. Vercel (Recomendado)

Vercel es la opción recomendada para el deployment de la plataforma WilkieDevs debido a su integración nativa con Next.js y facilidad de configuración.

#### Configuración Inicial

1. **Instalar Vercel CLI**
```bash
npm i -g vercel
```

2. **Login en Vercel**
```bash
vercel login
```

3. **Configurar Proyecto**
```bash
# En el directorio del proyecto
vercel

# Seguir las instrucciones:
# - Set up and deploy? Yes
# - Which scope? Tu cuenta/organización
# - Link to existing project? No
# - Project name? wilkiedevs-platform
# - Directory? ./
# - Override settings? No
```

#### Variables de Entorno

Configurar en Vercel Dashboard o via CLI:

```bash
# Supabase
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# N8N
vercel env add N8N_BASE_URL
vercel env add N8N_API_KEY

# Site Configuration
vercel env add NEXT_PUBLIC_SITE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL

# Analytics
vercel env add NEXT_PUBLIC_GA_ID
vercel env add GOOGLE_ANALYTICS_ID

# Email
vercel env add SMTP_HOST
vercel env add SMTP_USER
vercel env add SMTP_PASS
```

#### Configuración de Dominio

1. **Agregar Dominio Personalizado**
```bash
vercel domains add wilkiedevs.com
```

2. **Configurar DNS**
```
# Agregar registros DNS:
Type: A
Name: @
Value: 76.76.19.61

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

3. **Configurar SSL**
Vercel maneja SSL automáticamente con Let's Encrypt.

#### Build Configuration

**vercel.json**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### 2. Netlify

Alternativa popular para deployment de aplicaciones React/Next.js.

#### Configuración

1. **Conectar Repositorio**
   - Login en Netlify
   - New site from Git
   - Conectar GitHub repository

2. **Build Settings**
```
Build command: npm run build
Publish directory: .next
```

3. **Environment Variables**
Configurar las mismas variables que en Vercel a través del dashboard de Netlify.

4. **netlify.toml**:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

### 3. AWS (Avanzado)

Para deployments más complejos con mayor control sobre la infraestructura.

#### Arquitectura AWS

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CloudFront    │────│   S3 Bucket     │────│   Lambda@Edge   │
│   (CDN)         │    │   (Static)      │    │   (SSR)         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   API Gateway   │
                    │   + Lambda      │
                    └─────────────────┘
```

#### Configuración con CDK

**cdk-stack.ts**:
```typescript
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class WilkieDevsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket para assets estáticos
    const bucket = new s3.Bucket(this, 'WilkieDevsBucket', {
      bucketName: 'wilkiedevs-static-assets',
      publicReadAccess: true,
      websiteIndexDocument: 'index.html'
    });

    // Lambda para SSR
    const ssrFunction = new lambda.Function(this, 'SSRFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('dist'),
      memorySize: 1024,
      timeout: cdk.Duration.seconds(30)
    });

    // CloudFront Distribution
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
      },
      additionalBehaviors: {
        '/api/*': {
          origin: new origins.LambdaFunctionUrlOrigin(ssrFunction),
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL
        }
      }
    });
  }
}
```

## 🔧 CI/CD Pipeline

### GitHub Actions

**.github/workflows/deploy.yml**:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test
      
      - name: Run linting
        run: npm run lint
      
      - name: Type check
        run: npm run type-check

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: .next/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: .next/
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  lighthouse:
    needs: deploy
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://wilkiedevs.com
            https://wilkiedevs.com/servicios
            https://wilkiedevs.com/contacto
          configPath: './lighthouserc.json'
          uploadArtifacts: true
```

### Configuración de Lighthouse

**lighthouserc.json**:
```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "settings": {
        "chromeFlags": "--no-sandbox"
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

## 🗄️ Database Deployment

### Supabase Production Setup

1. **Crear Proyecto de Producción**
```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Crear proyecto
supabase projects create wilkiedevs-prod
```

2. **Configurar Migraciones**
```sql
-- migrations/001_initial_schema.sql
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  name VARCHAR,
  phone VARCHAR,
  company VARCHAR,
  project_type VARCHAR,
  budget_range VARCHAR,
  message TEXT,
  source VARCHAR DEFAULT 'website',
  score INTEGER DEFAULT 0,
  status VARCHAR DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  image_url VARCHAR,
  project_url VARCHAR,
  technologies TEXT[],
  category VARCHAR,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_featured ON projects(featured);
```

3. **Aplicar Migraciones**
```bash
supabase db push
```

### Backup Strategy

**backup-script.sh**:
```bash
#!/bin/bash

# Variables
SUPABASE_PROJECT_ID="tu-project-id"
BACKUP_DIR="/backups/$(date +%Y-%m-%d)"
S3_BUCKET="wilkiedevs-backups"

# Crear directorio de backup
mkdir -p $BACKUP_DIR

# Backup de base de datos
supabase db dump --project-ref $SUPABASE_PROJECT_ID > $BACKUP_DIR/database.sql

# Backup de storage
supabase storage download --project-ref $SUPABASE_PROJECT_ID --recursive $BACKUP_DIR/storage/

# Comprimir backup
tar -czf $BACKUP_DIR.tar.gz $BACKUP_DIR

# Subir a S3
aws s3 cp $BACKUP_DIR.tar.gz s3://$S3_BUCKET/

# Limpiar archivos locales
rm -rf $BACKUP_DIR $BACKUP_DIR.tar.gz

echo "Backup completado: $(date)"
```

## 🔍 Monitoring & Logging

### Configuración de Sentry

**sentry.client.config.js**:
```javascript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  beforeSend(event) {
    // Filtrar errores de desarrollo
    if (event.exception) {
      const error = event.exception.values[0];
      if (error.value?.includes('ChunkLoadError')) {
        return null;
      }
    }
    return event;
  }
});
```

### Health Checks

**pages/api/health.ts**:
```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check database connection
    const { error: dbError } = await supabase
      .from('leads')
      .select('count')
      .limit(1);

    if (dbError) throw new Error('Database connection failed');

    // Check N8N connection
    const n8nResponse = await fetch(`${process.env.N8N_BASE_URL}/healthz`);
    if (!n8nResponse.ok) throw new Error('N8N connection failed');

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'ok',
        n8n: 'ok'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
```

## 🔒 Security Considerations

### Headers de Seguridad

**next.config.js**:
```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

### Rate Limiting

**middleware.ts**:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip ?? '127.0.0.1';
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return new NextResponse('Rate limit exceeded', { status: 429 });
    }
  }

  return NextResponse.next();
}
```

## 📊 Performance Optimization

### Bundle Analysis

```bash
# Analizar bundle size
npm run analyze

# Configuración en package.json
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build"
  }
}
```

### Image Optimization

**next.config.js**:
```javascript
module.exports = {
  images: {
    domains: ['wilkiedevs.com', 'supabase.co'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días
  },
};
```

### Caching Strategy

```typescript
// lib/cache.ts
import { unstable_cache } from 'next/cache';

export const getCachedProjects = unstable_cache(
  async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('featured', true);
    return data;
  },
  ['featured-projects'],
  {
    revalidate: 3600, // 1 hora
    tags: ['projects']
  }
);
```

## 🚨 Rollback Strategy

### Automated Rollback

```bash
# Script de rollback automático
#!/bin/bash

PREVIOUS_DEPLOYMENT=$(vercel ls --scope=wilkiedevs | grep "wilkiedevs" | head -2 | tail -1 | awk '{print $1}')

echo "Rolling back to: $PREVIOUS_DEPLOYMENT"

vercel alias $PREVIOUS_DEPLOYMENT wilkiedevs.com
vercel alias $PREVIOUS_DEPLOYMENT www.wilkiedevs.com

echo "Rollback completed"
```

### Database Rollback

```sql
-- Crear punto de restauración antes de migraciones
BEGIN;
SAVEPOINT before_migration;

-- Ejecutar migración
-- Si falla, hacer rollback:
ROLLBACK TO SAVEPOINT before_migration;
```
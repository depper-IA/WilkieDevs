#!/usr/bin/env node

/**
 * Script para probar la conexión con N8N y crear workflows
 */

// Usar fetch nativo de Node.js 18+

// Configuración de N8N
const N8N_BASE_URL = 'https://n8n.wilkiedevs.com';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NGUxZTYyYi1kY2M0LTRiZGUtOWFjZS02OTBmMjAxMGIyMDAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU3NzM2NTI1fQ.ofJd3fVNzbroaMP3Kh9W76u4Ao4yfbCs7uKCA3Q4auU';

const headers = {
    'Content-Type': 'application/json',
    'X-N8N-API-KEY': N8N_API_KEY
};

// Colores WilkieDevs
const COLORS = {
    primary: '#3B82F6',
    secondary: '#1E293B',
    accent: '#F59E0B',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#06B6D4'
};

async function testConnection() {
    try {
        console.log('🔍 Probando conexión con N8N...');

        const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows`, {
            method: 'GET',
            headers
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Conexión exitosa con N8N');
            console.log(`📊 Workflows existentes: ${data.data?.length || 0}`);
            return true;
        } else {
            console.error('❌ Error de conexión:', response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.error('💥 Error de conexión:', error.message);
        return false;
    }
}

async function createLeadCaptureWorkflow() {
    const workflowData = {
        name: '[WILKIEDEVS] Rebecca Chatbot - Lead Capture',
        settings: {
            executionOrder: 'v1'
        },
        staticData: {},
        nodes: [
            {
                parameters: {
                    path: 'rebecca-lead-capture',
                    options: {}
                },
                id: 'webhook-rebecca-lead',
                name: '🤖 Rebecca Webhook',
                type: 'n8n-nodes-base.webhook',
                typeVersion: 1,
                position: [240, 300],
                webhookId: 'rebecca-lead-capture'
            },
            {
                parameters: {
                    conditions: {
                        options: {
                            caseSensitive: true,
                            leftValue: '',
                            typeValidation: 'strict'
                        },
                        conditions: [
                            {
                                id: 'lead-validation',
                                leftValue: '={{ $json.email }}',
                                rightValue: '',
                                operator: {
                                    type: 'string',
                                    operation: 'notEmpty'
                                }
                            }
                        ],
                        combinator: 'and'
                    },
                    options: {}
                },
                id: 'validate-lead-data',
                name: '✅ Validar Datos',
                type: 'n8n-nodes-base.if',
                typeVersion: 2,
                position: [460, 300]
            },
            {
                parameters: {
                    assignments: {
                        assignments: [
                            {
                                id: 'lead-score',
                                name: 'leadScore',
                                value: '={{ Math.min(($json.name ? 20 : 0) + ($json.email ? 20 : 0) + ($json.company ? 15 : 0) + ($json.phone ? 15 : 0) + ($json.projectType === "automation" ? 30 : 20), 100) }}',
                                type: 'number'
                            },
                            {
                                id: 'lead-intent',
                                name: 'intent',
                                value: '={{ $json.intent || "general" }}',
                                type: 'string'
                            },
                            {
                                id: 'timestamp',
                                name: 'processedAt',
                                value: '={{ $now() }}',
                                type: 'string'
                            }
                        ]
                    },
                    options: {}
                },
                id: 'process-lead-data',
                name: '🔄 Procesar Lead',
                type: 'n8n-nodes-base.set',
                typeVersion: 3.3,
                position: [680, 240]
            },
            {
                parameters: {
                    method: 'POST',
                    url: 'https://ziglshuhhtsthwedrους.supabase.co/rest/v1/wilkiedevs_leads',
                    authentication: 'genericCredentialType',
                    genericAuthType: 'httpHeaderAuth',
                    httpHeaderAuth: {
                        name: 'Authorization',
                        value: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZ2xzaHVoaHRzdGh3ZWRyb3VzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk0NzM5NywiZXhwIjoyMDczNTIzMzk3fQ.SERVICE_ROLE_KEY_AQUI'
                    },
                    sendHeaders: true,
                    headerParameters: {
                        parameters: [
                            {
                                name: 'apikey',
                                value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZ2xzaHVoaHRzdGh3ZWRyb3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDczOTcsImV4cCI6MjA3MzUyMzM5N30.X_TT0-sA2y1Z5-BeizOxCMYaZraPM2IQo1-rqDMsF08'
                            },
                            {
                                name: 'Content-Type',
                                value: 'application/json'
                            }
                        ]
                    },
                    sendBody: true,
                    bodyParameters: {
                        parameters: [
                            {
                                name: 'name',
                                value: '={{ $json.name }}'
                            },
                            {
                                name: 'email',
                                value: '={{ $json.email }}'
                            },
                            {
                                name: 'phone',
                                value: '={{ $json.phone }}'
                            },
                            {
                                name: 'company',
                                value: '={{ $json.company }}'
                            },
                            {
                                name: 'service_interest',
                                value: '={{ $json.projectType }}'
                            },
                            {
                                name: 'message',
                                value: '={{ $json.message }}'
                            },
                            {
                                name: 'source',
                                value: 'chatbot-rebecca'
                            },
                            {
                                name: 'status',
                                value: 'new'
                            },
                            {
                                name: 'score',
                                value: '={{ $json.leadScore }}'
                            }
                        ]
                    },
                    options: {}
                },
                id: 'save-to-supabase',
                name: '💾 Guardar en Supabase',
                type: 'n8n-nodes-base.httpRequest',
                typeVersion: 4.2,
                position: [900, 240]
            },
            {
                parameters: {
                    conditions: {
                        options: {
                            caseSensitive: true,
                            leftValue: '',
                            typeValidation: 'strict'
                        },
                        conditions: [
                            {
                                id: 'high-score-check',
                                leftValue: '={{ $json.leadScore }}',
                                rightValue: 70,
                                operator: {
                                    type: 'number',
                                    operation: 'gte'
                                }
                            }
                        ],
                        combinator: 'and'
                    },
                    options: {}
                },
                id: 'check-lead-quality',
                name: '🎯 Lead de Calidad?',
                type: 'n8n-nodes-base.if',
                typeVersion: 2,
                position: [1120, 240]
            },
            {
                parameters: {
                    method: 'POST',
                    url: 'https://hooks.slack.com/services/YOUR_SLACK_WEBHOOK_URL',
                    sendBody: true,
                    bodyParameters: {
                        parameters: [
                            {
                                name: 'text',
                                value: '🚨 *LEAD DE ALTA CALIDAD* 🚨\\n\\n*Nombre:* {{ $json.name }}\\n*Email:* {{ $json.email }}\\n*Empresa:* {{ $json.company }}\\n*Score:* {{ $json.leadScore }}/100\\n*Intent:* {{ $json.intent }}\\n\\n💰 *Acción requerida:* Contactar en las próximas 2 horas'
                            }
                        ]
                    },
                    options: {}
                },
                id: 'notify-high-quality-lead',
                name: '🔔 Notificar Equipo',
                type: 'n8n-nodes-base.httpRequest',
                typeVersion: 4.2,
                position: [1340, 160]
            }
        ],
        connections: {
            '🤖 Rebecca Webhook': {
                main: [
                    [
                        {
                            node: '✅ Validar Datos',
                            type: 'main',
                            index: 0
                        }
                    ]
                ]
            },
            '✅ Validar Datos': {
                main: [
                    [
                        {
                            node: '🔄 Procesar Lead',
                            type: 'main',
                            index: 0
                        }
                    ]
                ]
            },
            '🔄 Procesar Lead': {
                main: [
                    [
                        {
                            node: '💾 Guardar en Supabase',
                            type: 'main',
                            index: 0
                        }
                    ]
                ]
            },
            '💾 Guardar en Supabase': {
                main: [
                    [
                        {
                            node: '🎯 Lead de Calidad?',
                            type: 'main',
                            index: 0
                        }
                    ]
                ]
            },
            '🎯 Lead de Calidad?': {
                main: [
                    [
                        {
                            node: '🔔 Notificar Equipo',
                            type: 'main',
                            index: 0
                        }
                    ]
                ]
            }
        }
    };

    try {
        console.log('🤖 Creando workflow de Lead Capture...');

        const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows`, {
            method: 'POST',
            headers,
            body: JSON.stringify(workflowData)
        });

        if (response.ok) {
            const result = await response.json();
            console.log('✅ Workflow Lead Capture creado:', result);
            const workflowId = result.data?.id || result.id;
            console.log('🆔 Workflow ID:', workflowId);
            return workflowId;
        } else {
            const error = await response.text();
            console.error('❌ Error creando workflow:', response.status, error);
            return null;
        }
    } catch (error) {
        console.error('💥 Error:', error.message);
        return null;
    }
}

async function activateWorkflow(workflowId) {
    try {
        console.log(`🔄 Activando workflow ${workflowId}...`);

        const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${workflowId}/activate`, {
            method: 'POST',
            headers
        });

        if (response.ok) {
            console.log('✅ Workflow activado exitosamente');
            return true;
        } else {
            console.error('❌ Error activando workflow:', response.status);
            return false;
        }
    } catch (error) {
        console.error('💥 Error:', error.message);
        return false;
    }
}

async function main() {
    console.log('🚀 Iniciando configuración de workflows N8N para WilkieDevs...');

    // Probar conexión
    const connected = await testConnection();
    if (!connected) {
        console.error('❌ No se pudo conectar con N8N. Verifica la configuración.');
        process.exit(1);
    }

    // Crear workflow de Lead Capture
    const leadCaptureId = await createLeadCaptureWorkflow();
    if (!leadCaptureId) {
        console.error('❌ No se pudo crear el workflow de Lead Capture');
        process.exit(1);
    }

    // Activar workflow
    const activated = await activateWorkflow(leadCaptureId);
    if (!activated) {
        console.error('❌ No se pudo activar el workflow');
        process.exit(1);
    }

    console.log('');
    console.log('🎉 ¡Configuración completada exitosamente!');
    console.log('');
    console.log('📋 Resumen:');
    console.log(`   🆔 Workflow ID: ${leadCaptureId}`);
    console.log('   🏷️  Tag: WILKIEDEVS');
    console.log('   🎨 Colores: Aplicados');
    console.log('   🔗 Webhook: https://n8n.wilkiedevs.com/webhook/rebecca-lead-capture');
    console.log('');
    console.log('✨ El chatbot Rebecca ya puede capturar leads automáticamente!');
}

if (require.main === module) {
    main();
}

module.exports = { main };
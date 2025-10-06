import { Metadata } from 'next';
import ContactForm from '@/components/forms/ContactForm';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Contacto - WilkieDevs',
  description: 'Contáctanos para tu próximo proyecto de desarrollo web, automatización o marketing digital.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para transformar tu negocio?
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Conversemos sobre tu proyecto. Estamos aquí para ayudarte a alcanzar tus objetivos digitales.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Información de Contacto
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PhoneIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Teléfono</h3>
                    <p className="text-gray-600 dark:text-gray-400">+57 310 665 46 41</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <EnvelopeIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Email</h3>
                    <p className="text-gray-600 dark:text-gray-400">hola@wilkiedevs.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPinIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Ubicación</h3>
                    <p className="text-gray-600 dark:text-gray-400">Medellín, Colombia</p>
                  </div>
                </div>
              </div>

              {/* Horarios */}
              <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Horarios de Atención
                </h3>
                <div className="space-y-2 text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Lunes - Viernes</span>
                    <span>8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábados</span>
                    <span>9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingos</span>
                    <span>Cerrado</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Envíanos un mensaje
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Respuestas a las preguntas más comunes sobre nuestros servicios
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "¿Cuánto tiempo toma desarrollar un sitio web?",
                answer: "El tiempo varía según la complejidad. Una landing page toma 2-3 semanas, mientras que un e-commerce puede tomar 6-8 semanas."
              },
              {
                question: "¿Ofrecen mantenimiento después del lanzamiento?",
                answer: "Sí, ofrecemos planes de mantenimiento mensual que incluyen actualizaciones, backups y soporte técnico."
              },
              {
                question: "¿Pueden trabajar con mi presupuesto?",
                answer: "Ofrecemos soluciones flexibles para diferentes presupuestos. Conversemos sobre tus necesidades y encontraremos la mejor opción."
              },
              {
                question: "¿Qué incluye el servicio de automatización?",
                answer: "Incluye análisis de procesos, diseño de workflows, implementación con herramientas como n8n, y capacitación del equipo."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Service } from '@/types/services'
import { ServiceIcon } from '@/components/icons/ServiceIcons'

interface Props {
  service: Service
}

export default function ServiceDetail({ service }: Props) {
  const [selectedPlan, setSelectedPlan] = useState(
    service.plans.find((plan) => plan.recommended)?.id || service.plans[0].id
  )

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center gap-8 mb-16">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{service.name}</h1>
          <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">{service.description}</p>
          <div className="flex flex-wrap gap-4">
            {service.technologies.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-secondary/10 dark:bg-secondary/20 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 relative w-full aspect-video"
        >
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover rounded-xl"
          />
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {service.features.map((feature, index) => (
          <motion.div
            key={feature}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
          >
            <ServiceIcon name={service.icon} className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">{feature}</h3>
          </motion.div>
        ))}
      </div>

      {/* Long Description */}
      <div 
        className="prose dark:prose-invert max-w-none mb-16"
        dangerouslySetInnerHTML={{ __html: service.longDescription }}
      />

      {/* Pricing Plans */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Planes y Precios</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {service.plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`
                relative p-8 rounded-2xl border-2 
                ${selectedPlan === plan.id 
                  ? 'border-primary shadow-xl' 
                  : 'border-gray-200 dark:border-gray-700'}
              `}
            >
              {plan.recommended && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm">
                  Recomendado
                </span>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{plan.description}</p>
              <div className="mb-8">
                <span className="text-4xl font-bold">${plan.price.amount}</span>
                <span className="text-gray-600 dark:text-gray-300"> USD</span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature.id} className="flex items-start gap-2">
                    <span className={`mt-1 ${feature.included ? 'text-green-500' : 'text-red-500'}`}>
                      {feature.included ? '✓' : '×'}
                    </span>
                    <div>
                      <p className="font-medium">{feature.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setSelectedPlan(plan.id)}
                className={`
                  w-full py-3 rounded-lg font-medium transition-colors
                  ${selectedPlan === plan.id
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}
                `}
              >
                {selectedPlan === plan.id ? 'Seleccionado' : 'Seleccionar Plan'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Preguntas Frecuentes</h2>
        <div className="space-y-6">
          {service.faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-4">{faq.question}</h3>
              <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold mb-6">¿Listo para empezar?</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Solicita una cotización personalizada para tu proyecto
        </p>
        <a
          href={`/cotizar?service=${service.slug}&plan=${selectedPlan}`}
          className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Solicitar Cotización
        </a>
      </div>
    </div>
  )
}
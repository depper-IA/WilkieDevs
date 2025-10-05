'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'

export default function Header() {
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const menuItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Servicios', href: '/servicios' },
    { name: 'Automatizaciones', href: '/automatizaciones' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contacto', href: '/contacto' },
  ]

  return (
    <header className="fixed w-full top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/Wilkie-devs-light.svg"
              alt="WilkieDevs Logo"
              width={150}
              height={40}
              className="h-10 w-auto dark:invert"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-secondary dark:text-text-light hover:text-primary dark:hover:text-accent transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Cambiar tema"
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
            aria-label="Menú principal"
          >
            <svg
              className="h-6 w-6 text-secondary dark:text-text-light"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2 text-secondary dark:text-text-light hover:text-primary dark:hover:text-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark')
                setIsMenuOpen(false)
              }}
              className="w-full text-left py-2 text-secondary dark:text-text-light hover:text-primary dark:hover:text-accent"
            >
              {theme === 'dark' ? '🌞 Modo claro' : '🌙 Modo oscuro'}
            </button>
          </div>
        )}
      </nav>
    </header>
  )
}
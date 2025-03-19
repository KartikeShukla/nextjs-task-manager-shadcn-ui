"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-blue-700">Arbitration Institute</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="/" 
            className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors"
          >
            Home
          </Link>
          <Link 
            href="/leads" 
            className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors"
          >
            Contact Us
          </Link>
          <Link 
            href="#" 
            className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors"
          >
            About
          </Link>
          <Link 
            href="#" 
            className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors"
          >
            Services
          </Link>
          <Button size="sm" className="ml-4">
            Client Portal
          </Button>
        </nav>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 py-3 border-t border-gray-200 bg-white">
            <Link 
              href="/" 
              className="block py-2 text-base font-medium text-gray-700 hover:text-blue-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/leads" 
              className="block py-2 text-base font-medium text-gray-700 hover:text-blue-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </Link>
            <Link 
              href="#" 
              className="block py-2 text-base font-medium text-gray-700 hover:text-blue-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="#" 
              className="block py-2 text-base font-medium text-gray-700 hover:text-blue-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Button className="w-full mt-4" onClick={() => setMobileMenuOpen(false)}>
              Client Portal
            </Button>
          </div>
        </div>
      )}
    </header>
  )
} 
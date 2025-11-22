import Link from 'next/link'
import { Mail, Phone, Instagram, Facebook, Twitter } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-background-secondary border-t border-text-secondary/20 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-2xl font-outfit font-bold mb-4">
                            Sublimación<span className="text-accent-primary">Store</span>
                        </h3>
                        <p className="text-text-secondary mb-4">
                            Productos gaming sublimados de alta calidad. Diseños exclusivos para gamers apasionados.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="text-text-secondary hover:text-accent-primary transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="text-text-secondary hover:text-accent-primary transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="text-text-secondary hover:text-accent-primary transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-outfit font-semibold mb-4">Enlaces Rápidos</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/catalogo"
                                    className="text-text-secondary hover:text-accent-primary transition-colors"
                                >
                                    Catálogo
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/catalogo?category=tazas"
                                    className="text-text-secondary hover:text-accent-primary transition-colors"
                                >
                                    Tazas
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/catalogo?category=remeras"
                                    className="text-text-secondary hover:text-accent-primary transition-colors"
                                >
                                    Remeras
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/catalogo?category=gorras"
                                    className="text-text-secondary hover:text-accent-primary transition-colors"
                                >
                                    Gorras
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-outfit font-semibold mb-4">Contacto</h4>
                        <ul className="space-y-2">
                            <li className="flex items-center space-x-2 text-text-secondary">
                                <Mail className="w-4 h-4" />
                                <span>info@sublimacionstore.com</span>
                            </li>
                            <li className="flex items-center space-x-2 text-text-secondary">
                                <Phone className="w-4 h-4" />
                                <span>+58 424-XXX-XXXX</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-text-secondary/20 mt-8 pt-8 text-center text-text-secondary text-sm">
                    <p>&copy; {new Date().getFullYear()} Sublimación Store. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    )
}

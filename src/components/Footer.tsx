import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-8 border-t border-border bg-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h3 className="text-base font-semibold mb-3 text-foreground">AI-First Reinventor</h3>
            <p className="text-muted-foreground">
              Transformando carreras y creando oportunidades para emprendedores en la era de la IA.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-3 text-foreground">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  Acerca de
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Términos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-3 text-foreground">Contacto</h3>
            <p className="text-muted-foreground">
              ¿Preguntas o sugerencias? <br />
              <a 
                href="mailto:info@ai-reinventor.com" 
                className="text-primary hover:underline"
              >
                info@ai-reinventor.com
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} AI-First Reinventor. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}

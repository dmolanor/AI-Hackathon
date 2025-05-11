import { Facebook, Github, Twitter } from 'lucide-react'; // Social icons
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-12 bg-headerGrayBlack text-stone-300"> {/* Dark background, light text */}
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Column 1: Brand and MTP */}
          <div>
            <div className="flex items-center mb-3">
              <Image src="/Logo-Flor.png" alt="SkillBloom Flor Logo" width={32} height={32} className="mr-2" />
              <h3 className="text-xl font-montserrat font-black text-white">SkillBloom</h3>
            </div>
            <p className="text-sm mb-3 font-montserrat font-light">
              Empoderando a las personas para el futuro del trabajo con IA.
            </p>
            <p className="text-xs font-montserrat font-light text-stone-400">
              &quot;Empoderamos a las personas desplazadas por la Al con ingreso inmediato a través de tareas significativas, mientras fomentamos habilidades e impulsamos el emprendimiento para un futuro donde humanos y IA colaboran productivamente.&quot; - Nuestro MTP
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-montserrat font-black text-white mb-3">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-headerOrange transition-colors font-montserrat font-light">Sobre Nosotros</Link></li>
              <li><Link href="/blog" className="hover:text-headerOrange transition-colors font-montserrat font-light">Blog (Próximamente)</Link></li>
              <li><Link href="/#faq" className="hover:text-headerOrange transition-colors font-montserrat font-light">Preguntas Frecuentes (FAQ)</Link></li>
              <li><Link href="/contact" className="hover:text-headerOrange transition-colors font-montserrat font-light">Contacto</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal and Social */}
          <div>
            <h4 className="text-lg font-montserrat font-black text-white mb-3">Legal</h4>
            <ul className="space-y-2 text-sm mb-4">
              <li><Link href="/privacy" className="hover:text-headerOrange transition-colors font-montserrat font-light">Política de Privacidad</Link></li>
              <li><Link href="/terms" className="hover:text-headerOrange transition-colors font-montserrat font-light">Términos de Servicio</Link></li>
            </ul>
            <div className="flex space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-white">
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-stone-700 text-center text-xs font-montserrat font-light">
          <p>&copy; {new Date().getFullYear()} SkillBloom. Todos los derechos reservados. Hecho con <span className="text-headerOrange">&hearts;</span> para el futuro de LATAM.</p>
        </div>
      </div>
    </footer>
  );
}

"use client"; // Required for useEffect and event listeners

import { createClient } from '@/utils/supabase/client'; // Import Supabase client
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLandingNav, setShowLandingNav] = useState(true); // Default to true, hide if user is logged in

  useEffect(() => {
    const supabase = createClient();
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setShowLandingNav(false); // User is logged in, hide landing page nav
      } else {
        setShowLandingNav(true); // No user, show landing page nav
      }
    };
    checkSession();

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (this: HTMLAnchorElement, e: Event) {
        e.preventDefault();
        const anchorElement = e.currentTarget as HTMLAnchorElement;
        const targetId = anchorElement.getAttribute('href');
        if (targetId && targetId.length > 1) {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            const navbar = document.querySelector('nav');
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
            });
            setMobileMenuOpen(false);
          }
        } else if (targetId === "#") {
           window.scrollTo({ top: 0, behavior: "smooth" });
           setMobileMenuOpen(false);
        }
      });
    });
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const inlineStyles = `
    body {
        font-family: 'Montserrat', sans-serif;
    }
    .hero-bg {
        background-color: #ffdfcd;
    }
    .cta-button {
        background-color: #ff8e2e;
        transition: background-color 0.3s ease;
    }
    .cta-button:hover {
        background-color: #e67e22;
    }
    .section-title {
        font-size: 2.25rem;
        font-weight: 900;
        margin-bottom: 1.5rem;
        color: #262626;
        font-family: 'Montserrat', sans-serif;
    }
    .section-subtitle {
        font-size: 1.125rem;
        color: #515151;
        margin-bottom: 2.5rem;
        max-width: 700px;
        margin-left: auto;
        margin-right: auto;
        font-weight: 300;
        font-family: 'Montserrat', sans-serif;
    }
    .benefit-card {
        background-color: white;
        border-radius: 0.75rem;
        padding: 2rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        transition: transform 0.3s ease;
    }
    .benefit-card:hover {
        transform: translateY(-5px);
    }
    .testimonial-card {
        background-color: #FFF7F0;
    }
    .navbar-sticky {
        position: sticky;
        top: 0;
        z-index: 50;
        background-color: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
    }
    .font-montserrat {
        font-family: 'Montserrat', sans-serif;
    }
  `;

  return (
    <>
      <Head>
        <title>SkillBloom - Transforma tu Futuro Profesional con IA</title>
        <meta name="description" content="Descubre tu perfil emprendedor, accede a rutas de upskilling personalizadas y conecta con co-fundadores. SkillBloom te impulsa en la era de la IA." />
      </Head>
      {/* Using a style tag directly in JSX. Next.js will handle this. */}
      <style dangerouslySetInnerHTML={{ __html: inlineStyles }} />

      <div className="bg-gray-50 text-descriptionText font-montserrat"> {/* Added font-montserrat here for global application within this page */}
        {showLandingNav && (
          <nav className="navbar-sticky shadow-md">
              <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                  <Link href="#" className="text-2xl font-extrabold text-headerOrange">
                      SkillBloom
                  </Link>
                  <div className="hidden md:flex space-x-6 items-center">
                      <Link href="#desafio" className="text-gray-600 hover:text-headerOrange font-medium">El Desafío</Link>
                      <Link href="#solucion" className="text-gray-600 hover:text-headerOrange font-medium">Nuestra Solución</Link>
                      <Link href="#beneficios" className="text-gray-600 hover:text-headerOrange font-medium">Beneficios</Link>
                      <Link href="#testimonios" className="text-gray-600 hover:text-headerOrange font-medium">Testimonios</Link>
                      <Link href="/auth?mode=signup" className="cta-button text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg">
                          Prueba Gratis
                      </Link>
                  </div>
                  <div className="md:hidden">
                      <button id="mobile-menu-button" onClick={toggleMobileMenu} className="text-gray-600 focus:outline-none">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                      </button>
                  </div>
              </div>
              <div id="mobile-menu" className={`md:hidden ${mobileMenuOpen ? '' : 'hidden'} px-6 pb-4 space-y-2`}>
                  <Link href="#desafio" className="block text-gray-600 hover:text-headerOrange font-medium">El Desafío</Link>
                  <Link href="#solucion" className="block text-gray-600 hover:text-headerOrange font-medium">Nuestra Solución</Link>
                  <Link href="#beneficios" className="block text-gray-600 hover:text-headerOrange font-medium">Beneficios</Link>
                  <Link href="#testimonios" className="block text-gray-600 hover:text-headerOrange font-medium">Testimonios</Link>
                  <Link href="/auth?mode=signup" className="block w-full text-center cta-button text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg mt-2">
                      Prueba Gratis
                  </Link>
              </div>
          </nav>
        )}

        <header className="hero-bg pt-16 pb-24 md:pt-24 md:pb-32 text-center">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-headerGrayBlack mb-6 leading-tight">
                    Define tu Rumbo, Desarrolla tu Potencial.
                    <span className="block sm:inline text-headerOrange"> Con SkillBloom, Emprende en la Era de la IA.</span>
                </h1>
                <p className="text-lg md:text-xl text-descriptionText mb-10 max-w-2xl mx-auto font-light">
                    Descubre tu perfil emprendedor, accede a rutas de upskilling personalizadas y conecta con co-fundadores. Tu futuro, impulsado por IA.
                </p>
                <Link href="/auth?mode=signup" className="cta-button text-white font-bold py-4 px-10 text-lg rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105">
                    Comienza Tu Evaluación Gratuita
                </Link>
                <img src="https://placehold.co/800x400/ffdfcd/ff8e2e?text=Humanos+Colaborando+con+IA&font=montserrat" alt="Colaboración Humano-IA para el emprendimiento" className="mx-auto mt-12 rounded-lg shadow-2xl" style={{maxWidth: '100%', height: 'auto'}} />
            </div>
        </header>

        <main>
            <section id="desafio" className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="section-title">¿Te Preocupa el Impacto de la IA en tu Futuro Laboral y Emprendedor?</h2>
                    <p className="section-subtitle">
                        No estás solo. La rápida evolución de la Inteligencia Artificial está transformando el mercado, generando la urgente necesidad de adaptación y nuevas habilidades.
                    </p>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
                        <div className="p-6 bg-red-50 rounded-lg shadow">
                            <h3 className="text-xl font-semibold text-red-700 mb-2">El Desafío del Desplazamiento</h3>
                            <p className="text-descriptionText">En América Latina, se estima que entre el <strong className="text-red-600">26% y 38% de los empleos</strong> podrían ser afectados significativamente por la IA generativa. Millones sienten la amenaza del desplazamiento.</p>
                            <p className="text-sm text-gray-500 mt-2">(Fuente: OIT y Banco Mundial, 2024)</p>
                        </div>
                        <div className="p-6 bg-yellow-50 rounded-lg shadow">
                            <h3 className="text-xl font-semibold text-yellow-700 mb-2">La Brecha de Habilidades Emprendedoras</h3>
                            <p className="text-descriptionText">Para el <strong className="text-yellow-600">81% de las personas</strong>, el principal desafío es adquirir las nuevas habilidades y la mentalidad necesarias para emprender y prosperar en la era de la IA.</p>
                             <p className="text-sm text-gray-500 mt-2">(Fuente: Estudios regionales sobre adopción de IA)</p>
                        </div>
                    </div>
                    <p className="mt-12 text-xl text-descriptionText font-medium">
                        Pero, ¿y si pudieras convertir este desafío en tu mayor <span className="text-headerOrange">oportunidad de crecimiento y creación</span>?
                    </p>
                </div>
            </section>

            <section id="solucion" className="py-16 md:py-24" style={{backgroundColor: '#FFF7F0'}}>
                <div className="container mx-auto px-6 text-center">
                    <h2 className="section-title">SkillBloom: Tu Plataforma para el Éxito Emprendedor en la Era IA</h2>
                    <p className="section-subtitle">
                        SkillBloom es tu aliado estratégico. Te evaluamos, te preparamos y te conectamos para que lances y escales tus ideas de negocio.
                    </p>
                    <div className="grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
                        <div className="text-left">
                            <h3 className="text-2xl font-bold text-headerGrayBlack mb-4">Evalúa. Aprende. Conecta. Emprende.</h3>
                            <p className="text-descriptionText mb-3 font-light">
                                Con SkillBloom, accedes a un ecosistema integral para:
                            </p>
                            <ul className="space-y-3 text-descriptionText">
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-headerOrange mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                    <span><strong className="font-medium">Descubrir tu perfil emprendedor</strong> con nuestra evaluación basada en IA, identificando tus fortalezas y áreas de oportunidad.</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-headerOrange mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                    <span><strong className="font-medium">Desarrollar habilidades de alta demanda</strong> y mentalidad emprendedora a través de rutas de upskilling adaptativas y personalizadas.</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-headerOrange mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                    <span><strong className="font-medium">Conectar con una comunidad vibrante</strong> de emprendedores, mentores y potenciales co-fundadores para colaborar y crecer.</span>
                                </li>
                                 <li className="flex items-start">
                                    <svg className="w-6 h-6 text-headerOrange mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                    <span>(Opcional) <strong className="font-medium">Generar ingresos de apoyo</strong> aplicando tus nuevas habilidades en proyectos y tareas mientras tu emprendimiento toma forma.</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <img src="https://placehold.co/600x450/FFEFD5/ff8e2e?text=Ciclo+Emprendedor+IA&font=montserrat" alt="Ciclo Emprendedor en SkillBloom" className="rounded-lg shadow-xl mx-auto" style={{maxWidth: '100%', height: 'auto'}} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24 bg-headerOrange text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Con SkillBloom, Tu Visión Emprendedora Toma Impulso.</h2>
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto font-light">
                        &ldquo;Te brindamos la evaluación, el conocimiento y las conexiones para que transformes tus ideas en realidades exitosas en el nuevo paradigma de la IA.&rdquo;
                    </p>
                </div>
            </section>

            <section id="beneficios" className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="section-title text-center">Descubre Todo lo que SkillBloom Puede Hacer por Ti</h2>
                    <p className="section-subtitle text-center">
                        Te ofrecemos las herramientas y el apoyo que necesitas para innovar y prosperar.
                    </p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="benefit-card">
                            <div className="flex items-center justify-center w-12 h-12 bg-headerOrange/20 text-headerOrange rounded-full mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 00-4-4H3V9a4 4 0 014-4h0M9 17v2a4 4 0 01-4 4H3v-2m6-14h0a4 4 0 014 4v2m0 0V5m11 13v-2a4 4 0 00-4-4h-2m4 4v2a4 4 0 01-4 4h-2m-6-4h.01M9 3h6l-3 4-3-4z"></path></svg>
                            </div>
                            <h3 className="text-xl font-semibold text-headerGrayBlack mb-2">Perfil Emprendedor IA</h3>
                            <p className="text-descriptionText font-light">Identifica tus fortalezas, pasiones y el tipo de emprendimiento ideal para ti con nuestra evaluación inteligente.</p>
                        </div>
                        <div className="benefit-card">
                            <div className="flex items-center justify-center w-12 h-12 bg-headerOrange/20 text-headerOrange rounded-full mb-4">
                               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            </div>
                            <h3 className="text-xl font-semibold text-headerGrayBlack mb-2">Habilidades del Futuro</h3>
                            <p className="text-descriptionText font-light">Adquiere competencias en IA, negocios digitales y liderazgo, con micro-lecciones y rutas de aprendizaje adaptativas.</p>
                        </div>
                        <div className="benefit-card">
                            <div className="flex items-center justify-center w-12 h-12 bg-headerOrange/20 text-headerOrange rounded-full mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            </div>
                            <h3 className="text-xl font-semibold text-headerGrayBlack mb-2">Comunidad de Co-Founders</h3>
                            <p className="text-descriptionText font-light">Conecta con otros emprendedores, mentores y encuentra a tu co-founder ideal para impulsar tu proyecto.</p>
                        </div>
                        <div className="benefit-card">
                            <div className="flex items-center justify-center w-12 h-12 bg-headerOrange/20 text-headerOrange rounded-full mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h3 className="text-xl font-semibold text-headerGrayBlack mb-2">Flexibilidad para Crecer</h3>
                            <p className="text-descriptionText font-light">Aprende y desarrolla tu proyecto a tu ritmo. SkillBloom se adapta a tu vida.</p>
                        </div>
                        <div className="benefit-card">
                            <div className="flex items-center justify-center w-12 h-12 bg-headerOrange/20 text-headerOrange rounded-full mb-4">
                               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18a6 6 0 006-6H6a6 6 0 006 6z"></path></svg>
                            </div>
                            <h3 className="text-xl font-semibold text-headerGrayBlack mb-2">Soporte y Mentoría</h3>
                            <p className="text-descriptionText font-light">Accede a recursos, guías y la posibilidad de mentorías para no sentirte solo en tu camino emprendedor.</p>
                        </div>
                        <div className="benefit-card">
                             <div className="flex items-center justify-center w-12 h-12 bg-headerOrange/20 text-headerOrange rounded-full mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                            </div>
                            <h3 className="text-xl font-semibold text-headerGrayBlack mb-2">Validación y Crecimiento</h3>
                            <p className="text-descriptionText font-light">Aplica tus conocimientos en proyectos reales, valida tus ideas y construye un portafolio de emprendimiento sólido.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24" style={{backgroundColor: '#FFF7F0'}}>
                <div className="container mx-auto px-6 text-center">
                    <h2 className="section-title">Empezar tu Viaje Emprendedor es Fácil</h2>
                    <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
                        <div className="flex flex-col items-center p-6">
                            <div className="bg-headerOrange text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4">1</div>
                            <h3 className="text-xl font-semibold mb-2">Regístrate Gratis</h3>
                            <p className="text-descriptionText font-light">Completa tu evaluación de perfil emprendedor en SkillBloom. Es simple y revelador.</p>
                        </div>
                        <div className="flex flex-col items-center p-6">
                            <div className="bg-headerOrange text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4">2</div>
                            <h3 className="text-xl font-semibold mb-2">Explora tu Ruta</h3>
                            <p className="text-descriptionText font-light">Nuestra IA te sugerirá rutas de upskilling y conexiones valiosas basadas en tu perfil y metas.</p>
                        </div>
                        <div className="flex flex-col items-center p-6">
                            <div className="bg-headerOrange text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4">3</div>
                            <h3 className="text-xl font-semibold mb-2">Aprende y Conecta</h3>
                            <p className="text-descriptionText font-light">Desarrolla nuevas habilidades, únete a la comunidad y encuentra co-fundadores para tus ideas.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="testimonios" className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="section-title text-center">Lo que Nuestros Usuarios Dicen de SkillBloom</h2>
                    <p className="section-subtitle text-center">
                        Historias reales de personas que están impulsando su futuro con nosotros.
                    </p>
                    <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <article className="testimonial-card p-8 rounded-lg shadow-lg">
                            <img src="https://placehold.co/100x100/FFE4CC/D97706?text=MG" alt="Foto de Maria G." className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-md" />
                            <p className="text-descriptionText italic mb-4 font-light">&ldquo;Sentía que mi carrera estaba estancada. SkillBloom me ayudó a entender mis verdaderas pasiones y me dio las herramientas y la confianza para empezar mi propio proyecto. ¡La comunidad es increíble!&rdquo;</p>
                            <h4 className="font-semibold text-headerGrayBlack">Maria G.</h4>
                            <p className="text-sm text-headerOrange">Ex-administrativa, ahora Fundadora de [Su Emprendimiento]</p>
                        </article>
                        <article className="testimonial-card p-8 rounded-lg shadow-lg">
                            <img src="https://placehold.co/100x100/FFE4CC/D97706?text=CP" alt="Foto de Carlos P." className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-md" />
                            <p className="text-descriptionText italic mb-4 font-light">&ldquo;Siempre tuve ideas, pero no sabía por dónde empezar. Las rutas de aprendizaje de SkillBloom son muy prácticas y conectar con otros emprendedores ha sido clave. Ya estamos desarrollando nuestro MVP.&rdquo;</p>
                            <h4 className="font-semibold text-headerGrayBlack">Carlos P.</h4>
                            <p className="text-sm text-headerOrange">Ingeniero y Co-fundador de [Startup Tecnológica]</p>
                        </article>
                        <article className="testimonial-card p-8 rounded-lg shadow-lg">
                            <img src="https://placehold.co/100x100/FFE4CC/D97706?text=AV" alt="Foto de Ana V." className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-md" />
                            <p className="text-descriptionText italic mb-4 font-light">&ldquo;SkillBloom me está dando las habilidades de negocio que no aprendí en la universidad. Las micro-lecciones y la comunidad son perfectas para complementar mi formación y pensar en mi futuro profesional de forma diferente.&rdquo;</p>
                            <h4 className="font-semibold text-headerGrayBlack">Ana V.</h4>
                            <p className="text-sm text-headerOrange">Estudiante Universitaria con Ideas de Emprender</p>
                        </article>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24" style={{backgroundColor: '#FFF7F0'}}>
                <div className="container mx-auto px-6 text-center">
                    <h2 className="section-title">Únete a la Nueva Generación de Emprendedores IA en LATAM</h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-8">
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <p className="text-3xl font-bold text-headerOrange mb-2">70%</p>
                            <p className="text-descriptionText font-light">De los nuevos roles requerirán habilidades digitales y de IA. <strong className="block mt-1 font-medium">¡Prepárate con SkillBloom!</strong></p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <p className="text-3xl font-bold text-headerOrange mb-2">8 de 10</p>
                            <p className="text-descriptionText font-light">Emprendedores buscan mentores y una comunidad sólida. <strong className="block mt-1 font-medium">¡Encuéntralos aquí!</strong></p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <p className="text-3xl font-bold text-headerOrange mb-2">3x</p>
                            <p className="text-descriptionText font-light">Más probabilidad de éxito para startups con co-fundadores complementarios. <strong className="block mt-1 font-medium">¡Conecta y crea!</strong></p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="cta-main" className="py-20 md:py-32 hero-bg">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-headerGrayBlack mb-6">¿Listo para Descubrir y Potenciar Tu Gen Emprendedor?</h2>
                    <p className="text-lg md:text-xl text-descriptionText mb-10 max-w-2xl mx-auto font-light">
                        No dejes que tus ideas se queden en el papel. Con SkillBloom, tienes el mapa, las herramientas y la comunidad para navegar el futuro y construir tu éxito.
                    </p>
                    <Link href="/auth?mode=signup" className="cta-button text-white font-bold py-4 px-10 text-lg rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105">
                        Regístrate Gratis y Comienza
                    </Link>
                    <p className="mt-6 text-sm text-gray-600 font-light">
                        Acceso limitado durante nuestra fase Beta. ¡Sé de los primeros en transformar tu carrera con IA!
                    </p>
                </div>
            </section>
        </main>

        <footer className="bg-headerGrayBlack text-gray-300 py-12">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">SkillBloom</h3>
                        <p className="text-sm font-light">Empoderando emprendedores para el futuro del trabajo con IA.</p>
                         <p className="text-xs mt-4 font-light">&ldquo;Empoderamos a las personas desplazadas por la IA con una ruta clara hacia el emprendimiento y la auto-realización, fomentando habilidades, conexiones y la creación de valor en un futuro donde humanos y IA colaboran productivamente.&rdquo; - Nuestro MTP</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Enlaces Rápidos</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="hover:text-headerOrange font-light">Sobre Nosotros</Link></li>
                            <li><Link href="/blog" className="hover:text-headerOrange font-light">Blog (Próximamente)</Link></li>
                            <li><Link href="#faq" className="hover:text-headerOrange font-light">Preguntas Frecuentes (FAQ)</Link></li>
                            <li><Link href="/contact" className="hover:text-headerOrange font-light">Contacto</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/privacy" className="hover:text-headerOrange font-light">Política de Privacidad</Link></li>
                            <li><Link href="/terms" className="hover:text-headerOrange font-light">Términos de Servicio</Link></li>
                        </ul>
                        <div className="mt-4 flex space-x-4">
                            <Link href="#" className="text-gray-400 hover:text-white"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg></Link>
                            <Link href="#" className="text-gray-400 hover:text-white"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg></Link>
                            <Link href="#" className="text-gray-400 hover:text-white"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.148 6.701 9.536.21.039.285-.092.285-.204v-1.747c-2.786.604-3.375-1.342-3.375-1.342-.191-.487-.467-.617-.467-.617-.382-.261.029-.256.029-.256.423.03.646.435.646.435.375.643.984.457 1.223.35.038-.272.147-.457.266-.562-1.892-.215-3.882-.946-3.882-4.205 0-.929.332-1.689.875-2.285-.088-.215-.379-1.08.083-2.252 0 0 .715-.229 2.344.874.679-.189 1.408-.283 2.132-.286.725.003 1.453.097 2.132.286 1.629-1.103 2.344-.874 2.344-.874.462 1.172.171 2.037.083 2.252.543.596.875 1.356.875 2.285 0 3.269-1.993 3.987-3.89 4.199.151.13.285.388.285.782v1.174c0 .114.072.246.288.202A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" /></svg></Link>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
                    <p className="font-light">&copy; 2025 SkillBloom. Todos los derechos reservados. Hecho con <span className="text-headerOrange">&hearts;</span> para el futuro de LATAM.</p>
                </div>
            </div>
        </footer>
      </div>
    </>
  );
}

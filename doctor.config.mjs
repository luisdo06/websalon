/**
 * Configuración de React Doctor.
 *
 * Sólo se desactivan reglas cuyos hallazgos NO son defectos de código, sino
 * patrones intencionales o límites del escáner. Cada una queda documentada
 * abajo con su motivo. El resto de reglas sigue activo.
 *
 * (Otros hallazgos intencionales se silencian de forma quirúrgica con
 *  `// react-doctor-disable-next-line ...` junto al código, para no apagar la
 *  regla en todo el proyecto: ver nextjs-no-img-element, prefer-use-effect-event
 *  y no-giant-component en app/components/*.)
 */
const config = {
  rules: {
    // El mapa de Google Maps se embebe con el sandbox estándar
    // (`allow-scripts allow-same-origin ...`) que Maps necesita para funcionar.
    // La regla marca genéricamente esa combinación; es el único iframe del sitio
    // y apunta a un origen de confianza (google.com).
    "react-doctor/iframe-missing-sandbox": "off",

    // El Stepper de reservas anima la altura medida del contenido para el efecto
    // acordeón entre pasos. Animar `height` ES el objetivo; reemplazarlo por
    // transform perdería la transición. Patrón intencional.
    "react-doctor/no-layout-property-animation": "off",

    // Esta regla inspecciona el bundle compilado (.next/) y advierte que la
    // config pública de Supabase viaja al cliente: es inherente a cualquier app
    // con Supabase del lado del navegador. La mitigación real es tener RLS activo
    // en el backend, no un cambio de código. No es un archivo fuente editable.
    "react-doctor/artifact-baas-authority-surface": "off",
  },
};

export default config;

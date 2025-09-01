export const languages = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
};

export type LanguageCode = keyof typeof languages;

export const translations = {
  en: {
    // Header
    headerTitle: "Style Match AI",
    // App
    getInstantFeedback: "Get Instant Fashion Feedback",
    outfitDescription: "Upload a photo of your outfit, and our AI stylist will tell you if it's a perfect match!",
    pairDescription: "Get a personalized analysis and a virtual try-on of your selected pair!",
    sareeDescription: "Get a virtual try-on and personalized styling for your chosen saree.",
    analyzeOutfit: "Analyze Outfit",
    matchAPair: "Match a Pair",
    matchASaree: "Match a Saree",
    errorTitle: "Error",
    errorPrompt: "Please provide all the required images.",
    reset: "Reset",
    close: "Close",
    matchPair: "Match Pair",
    matchSaree: "Match Saree",
    poweredBy: "Powered by Gemini AI",
    // Image Uploader
    uploaderPlaceholderDefault: "Click to upload or drag and drop",
    uploaderPlaceholderFace: "Your Face (for color matching)",
    uploaderPlaceholderItem1: "Item 1 (e.g., Top)",
    uploaderPlaceholderItem2: "Item 2 (e.g., Bottom)",
    uploaderPlaceholderSaree: "Saree Image",
    fileTypes: "PNG, JPG, or WEBP",
    or: "OR",
    useCamera: "Use Camera",
    // Loader
    loaderMessage: "Our AI stylist is creating your virtual try-on...",
    loaderSubMessage: "This might take a moment, the magic is happening!",
    // Result Card
    virtualTryOn: "Virtual Try-On",
    compatibility: "Compatibility:",
    colorSuggestions: "Personalized Color Suggestions",
    stylistSuggestion: "Stylist's Suggestion",
    downloadImage: "Download Image",
  },
  es: {
    // Header
    headerTitle: "Style Match AI",
    // App
    getInstantFeedback: "Obtén Comentarios de Moda al Instante",
    outfitDescription: "¡Sube una foto de tu atuendo y nuestro estilista de IA te dirá si es la combinación perfecta!",
    pairDescription: "¡Obtén un análisis personalizado y una prueba virtual de tu par seleccionado!",
    sareeDescription: "Obtén una prueba virtual y un estilismo personalizado para el sari que elijas.",
    analyzeOutfit: "Analizar Atuendo",
    matchAPair: "Combinar un Par",
    matchASaree: "Combinar un Sari",
    errorTitle: "Error",
    errorPrompt: "Por favor, proporciona todas las imágenes requeridas.",
    reset: "Reiniciar",
    close: "Cerrar",
    matchPair: "Combinar Par",
    matchSaree: "Combinar Sari",
    poweredBy: "Con tecnología de Gemini AI",
    // Image Uploader
    uploaderPlaceholderDefault: "Haz clic para subir o arrastra y suelta",
    uploaderPlaceholderFace: "Tu Rostro (para combinar colores)",
    uploaderPlaceholderItem1: "Artículo 1 (ej. Top)",
    uploaderPlaceholderItem2: "Artículo 2 (ej. Pantalón)",
    uploaderPlaceholderSaree: "Imagen del Sari",
    fileTypes: "PNG, JPG, o WEBP",
    or: "O",
    useCamera: "Usar Cámara",
    // Loader
    loaderMessage: "Nuestro estilista de IA está creando tu prueba virtual...",
    loaderSubMessage: "Esto podría tomar un momento, ¡la magia está sucediendo!",
    // Result Card
    virtualTryOn: "Prueba Virtual",
    compatibility: "Compatibilidad:",
    colorSuggestions: "Sugerencias de Color Personalizadas",
    stylistSuggestion: "Sugerencia del Estilista",
    downloadImage: "Descargar Imagen",
  },
  fr: {
    // Header
    headerTitle: "Style Match AI",
    // App
    getInstantFeedback: "Obtenez un Avis de Mode Instantané",
    outfitDescription: "Téléchargez une photo de votre tenue, et notre styliste IA vous dira si c'est une combinaison parfaite !",
    pairDescription: "Obtenez une analyse personnalisée et un essai virtuel de votre paire sélectionnée !",
    sareeDescription: "Obtenez un essayage virtuel et des conseils de style personnalisés pour le sari de votre choix.",
    analyzeOutfit: "Analyser la Tenue",
    matchAPair: "Assortir une Paire",
    matchASaree: "Assortir un Sari",
    errorTitle: "Erreur",
    errorPrompt: "Veuillez fournir toutes les images requises.",
    reset: "Réinitialiser",
    close: "Fermer",
    matchPair: "Assortir la Paire",
    matchSaree: "Assortir le Sari",
    poweredBy: "Propulsé par Gemini AI",
    // Image Uploader
    uploaderPlaceholderDefault: "Cliquez pour télécharger ou glissez-déposez",
    uploaderPlaceholderFace: "Votre Visage (pour l'harmonie des couleurs)",
    uploaderPlaceholderItem1: "Article 1 (ex: Haut)",
    uploaderPlaceholderItem2: "Article 2 (ex: Bas)",
    uploaderPlaceholderSaree: "Image du Sari",
    fileTypes: "PNG, JPG, ou WEBP",
    or: "OU",
    useCamera: "Utiliser la Caméra",
    // Loader
    loaderMessage: "Notre styliste IA crée votre essai virtuel...",
    loaderSubMessage: "Cela peut prendre un moment, la magie opère !",
    // Result Card
    virtualTryOn: "Essai Virtuel",
    compatibility: "Compatibilité :",
    colorSuggestions: "Suggestions de Couleurs Personnalisées",
    stylistSuggestion: "Suggestion du Styliste",
    downloadImage: "Télécharger l'image",
  },
};
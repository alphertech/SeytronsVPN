// ============================================
// SEYTRONS VPN - Complete Internationalization
// ============================================

const i18n = {
    currentLanguage: 'en',
    translations: {},
    listeners: [],

    languages: {
        en: { name: 'English', flag: '🇺🇸', dir: 'ltr' },
        es: { name: 'Español', flag: '🇪🇸', dir: 'ltr' },
        fr: { name: 'Français', flag: '🇫🇷', dir: 'ltr' },
        de: { name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
        it: { name: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
        pt: { name: 'Português', flag: '🇵🇹', dir: 'ltr' },
        ru: { name: 'Русский', flag: '🇷🇺', dir: 'ltr' },
        ja: { name: '日本語', flag: '🇯🇵', dir: 'ltr' },
        ko: { name: '한국어', flag: '🇰🇷', dir: 'ltr' },
        zh: { name: '中文', flag: '🇨🇳', dir: 'ltr' },
        ar: { name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
        hi: { name: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
        tr: { name: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
        nl: { name: 'Nederlands', flag: '🇳🇱', dir: 'ltr' },
        pl: { name: 'Polski', flag: '🇵🇱', dir: 'ltr' },
        sv: { name: 'Svenska', flag: '🇸🇪', dir: 'ltr' },
        da: { name: 'Dansk', flag: '🇩🇰', dir: 'ltr' },
        fi: { name: 'Suomi', flag: '🇫🇮', dir: 'ltr' },
        no: { name: 'Norsk', flag: '🇳🇴', dir: 'ltr' },
        cs: { name: 'Čeština', flag: '🇨🇿', dir: 'ltr' },
        hu: { name: 'Magyar', flag: '🇭🇺', dir: 'ltr' },
        ro: { name: 'Română', flag: '🇷🇴', dir: 'ltr' },
        bg: { name: 'Български', flag: '🇧🇬', dir: 'ltr' },
        el: { name: 'Ελληνικά', flag: '🇬🇷', dir: 'ltr' },
        he: { name: 'עברית', flag: '🇮🇱', dir: 'rtl' },
        th: { name: 'ไทย', flag: '🇹🇭', dir: 'ltr' },
        vi: { name: 'Tiếng Việt', flag: '🇻🇳', dir: 'ltr' },
        id: { name: 'Bahasa Indonesia', flag: '🇮🇩', dir: 'ltr' },
        ms: { name: 'Bahasa Melayu', flag: '🇲🇾', dir: 'ltr' }
    },

    async init() {
        // Load saved language
        this.currentLanguage = localStorage.getItem('seytron_language') || 'en';
        
        // Load translations for current language
        await this.loadTranslations(this.currentLanguage);
        
        // Apply RTL if needed
        this.applyTextDirection();
        
        // Translate UI
        this.translateUI();
        
        // Setup language selector
        this.setupLanguageSelector();
    },

    applyTextDirection() {
        const lang = this.languages[this.currentLanguage];
        if (lang) {
            document.documentElement.dir = lang.dir;
            document.documentElement.style.direction = lang.dir;
            
            // Add RTL specific class for CSS adjustments
            if (lang.dir === 'rtl') {
                document.documentElement.classList.add('rtl');
            } else {
                document.documentElement.classList.remove('rtl');
            }
        }
    },

    async loadTranslations(lang) {
        // Complete translations for all languages
        const translations = {
            en: {
                app: {
                    name: 'SEYTRONS VPN',
                    version: 'Version 2.4.1'
                },
                common: {
                    connect: 'Connect',
                    disconnect: 'Disconnect',
                    cancel: 'Cancel',
                    save: 'Save',
                    delete: 'Delete',
                    edit: 'Edit',
                    close: 'Close',
                    back: 'Back',
                    next: 'Next',
                    skip: 'Skip',
                    done: 'Done',
                    loading: 'Loading...',
                    error: 'Error',
                    success: 'Success',
                    warning: 'Warning',
                    info: 'Info',
                    confirm: 'Confirm',
                    yes: 'Yes',
                    no: 'No',
                    search: 'Search',
                    filter: 'Filter',
                    clear: 'Clear',
                    apply: 'Apply',
                    upgrade: 'Upgrade',
                    learn_more: 'Learn More'
                },
                splash: {
                    initializing: 'Initializing...',
                    loading_servers: 'Loading servers...',
                    almost_ready: 'Almost ready...'
                },
                onboarding: {
                    privacy_title: 'Complete Privacy',
                    privacy_desc: 'Hide your IP address and browse anonymously. No one can track your online activities.',
                    security_title: 'Military-Grade Security',
                    security_desc: 'AES-256 encryption with strict no-logs policy. Your data stays yours.',
                    speed_title: 'Lightning Fast',
                    speed_desc: '24 servers worldwide with unlimited bandwidth. No speed caps.',
                    ready_title: 'Ready to Go?',
                    ready_desc: 'Join millions who trust SEYTRONS for their online privacy.'
                },
                auth: {
                    title: 'Sign In',
                    email: 'Email',
                    password: 'Password',
                    login: 'Log In',
                    register: 'Register',
                    forgot: 'Forgot password?'
                },
                dashboard: {
                    disconnected: 'Disconnected',
                    at_risk: 'Your data is at risk',
                    connected: 'Connected',
                    secure: 'Your data is secure',
                    connecting: 'Connecting...',
                    current_location: 'Current Location',
                    change: 'Change',
                    todays_usage: "Today's Usage",
                    details: 'Details',
                    download: 'Download',
                    upload: 'Upload',
                    top_speed: 'Top Speed',
                    popular_servers: 'Popular Servers',
                    view_all: 'View All',
                    data_usage: 'Data Usage',
                    used: 'used',
                    ping: 'ping',
                    location: 'Location'
                },
                servers: {
                    title: 'Servers',
                    search: 'Search servers...',
                    all: 'All',
                    recommended: 'Recommended',
                    fastest: 'Fastest',
                    favorites: 'Favorites',
                    europe: 'Europe',
                    asia: 'Asia',
                    americas: 'Americas',
                    africa: 'Africa',
                    oceania: 'Oceania',
                    connect: 'Connect',
                    ping: 'ms',
                    load: 'Load',
                    favorite: 'Favorite',
                    remove_favorite: 'Remove from favorites',
                    add_favorite: 'Add to favorites',
                    server_status: 'Server Status',
                    online: 'Online',
                    offline: 'Offline',
                    maintenance: 'Maintenance'
                },
                stats: {
                    title: 'Statistics',
                    total_download: 'Total Downloaded',
                    total_upload: 'Total Uploaded',
                    connection_time: 'Connection Time',
                    daily_usage: 'Daily Usage (Last 7 Days)',
                    recent_connections: 'Recent Connections',
                    data_saved: 'Data Saved',
                    best_performance: 'Best Performance',
                    average_speed: 'Average Speed',
                    today: 'Today',
                    this_week: 'This Week',
                    this_month: 'This Month',
                    export: 'Export Data'
                },
                profile: {
                    title: 'Profile',
                    member_since: 'Member since',
                    premium_member: 'Premium Member',
                    free_member: 'Free Member',
                    refer_earn: 'Refer & Earn',
                    refer_desc: 'Share SEYTRONS with friends and get 1 month free',
                    copy_code: 'Copy',
                    copied: 'Copied!',
                    account_settings: 'Account Settings',
                    payment_methods: 'Payment Methods',
                    notifications: 'Notifications',
                    privacy: 'Privacy',
                    logout: 'Logout',
                    delete_account: 'Delete Account'
                },
                subscription: {
                    title: 'Subscription',
                    current_plan: 'Current Plan',
                    expires: 'Expires',
                    devices_used: 'devices used',
                    upgrade_plan: 'Upgrade Plan',
                    monthly: 'Monthly',
                    yearly: 'Yearly',
                    lifetime: 'Lifetime',
                    per_month: '/mo',
                    per_year: '/yr',
                    save: 'Save',
                    best_value: 'Best Value',
                    select: 'Select',
                    current: 'Current',
                    payment_methods: 'Payment Methods',
                    promo_code: 'Promo code',
                    apply: 'Apply',
                    invalid_code: 'Invalid promo code',
                    valid_code: 'Promo code applied!',
                    card_number: 'Card Number',
                    expiry_date: 'Expiry Date',
                    cvv: 'CVV',
                    subscribe: 'Subscribe',
                    cancel_subscription: 'Cancel Subscription'
                },
                settings: {
                    title: 'Settings',
                    connection: 'Connection',
                    protocol: 'Protocol',
                    auto_wifi: 'Auto-connect on Wi-Fi',
                    auto_wifi_desc: 'Connect automatically on Wi-Fi networks',
                    auto_mobile: 'Auto-connect on Mobile',
                    auto_mobile_desc: 'Connect automatically on mobile data',
                    kill_switch: 'Kill Switch',
                    kill_switch_desc: 'Block internet if VPN connection drops',
                    security: 'Security & Privacy',
                    dns_leak: 'DNS Leak Protection',
                    dns_leak_desc: 'Prevent DNS leaks when connected',
                    ipv6_leak: 'IPv6 Leak Protection',
                    ipv6_leak_desc: 'Block IPv6 traffic to prevent leaks',
                    adblocker: 'Ad Blocker',
                    adblocker_desc: 'Block ads and trackers',
                    appearance: 'Appearance',
                    dark_mode: 'Dark Mode',
                    dark_mode_desc: 'Toggle dark/light theme',
                    language: 'Language',
                    language_desc: 'Select your preferred language',
                    notifications: 'Notifications',
                    notifications_desc: 'Receive important updates',
                    sounds: 'Sounds',
                    sounds_desc: 'Play sounds for events',
                    vibration: 'Vibration',
                    vibration_desc: 'Vibrate on connect/disconnect',
                    advanced: 'Advanced',
                    split_tunneling: 'Split Tunneling',
                    split_tunneling_desc: 'Choose which apps use VPN',
                    custom_dns: 'Custom DNS',
                    custom_dns_desc: 'Use custom DNS servers',
                    mtu: 'MTU Size',
                    mtu_desc: 'Maximum transmission unit size',
                    reset: 'Reset to Defaults',
                    reset_confirm: 'Are you sure? This will reset all settings.'
                },
                support: {
                    title: 'Help & Support',
                    search_faq: 'Search FAQs...',
                    faq: 'Frequently Asked Questions',
                    contact_us: 'Contact Us',
                    live_chat: 'Live Chat',
                    email_support: 'Email Support',
                    submit_ticket: 'Submit Ticket',
                    faq1_q: 'How do I connect to a server?',
                    faq1_a: 'Simply tap the power button on the home screen and select your preferred server from the list.',
                    faq2_q: 'Why is my connection slow?',
                    faq2_a: 'Try connecting to a server closer to your location or use the "Fastest" filter in the server list.',
                    faq3_q: 'How do I cancel my subscription?',
                    faq3_a: 'Go to Profile → Subscription and click "Manage Subscription" to cancel or change your plan.',
                    faq4_q: 'Is my data really private?',
                    faq4_a: 'Yes! We have a strict no-logs policy and use military-grade encryption to protect your data.',
                    faq5_q: 'Can I use it on multiple devices?',
                    faq5_a: 'Yes, depending on your plan you can connect up to 5-10 devices simultaneously.'
                },
                notifications: {
                    title: 'Notifications',
                    mark_all_read: 'Mark all as read',
                    no_notifications: 'No notifications',
                    connected: 'Connected to',
                    disconnected: 'Disconnected from',
                    speed_test: 'Speed Test Complete',
                    speed_test_result: 'Download: {download} Mbps • Upload: {upload} Mbps',
                    update_available: 'Update Available',
                    update_message: 'Version {version} is ready to install',
                    payment_success: 'Payment Successful',
                    payment_message: 'Thank you for your purchase!',
                    trial_ending: 'Trial Ending Soon',
                    trial_message: 'Your free trial ends in {days} days'
                },
                errors: {
                    connection_failed: 'Connection failed',
                    try_again: 'Please try again',
                    server_error: 'Server error',
                    network_error: 'Network error',
                    timeout: 'Connection timeout',
                    auth_failed: 'Authentication failed',
                    invalid_credentials: 'Invalid email or password',
                    no_internet: 'No internet connection',
                    server_full: 'Server is full',
                    maintenance_mode: 'Server is under maintenance',
                    payment_failed: 'Payment failed',
                    please_try_later: 'Please try again later'
                },
                time: {
                    just_now: 'Just now',
                    minutes_ago: '{minutes} minutes ago',
                    hours_ago: '{hours} hours ago',
                    yesterday: 'Yesterday',
                    days_ago: '{days} days ago',
                    weeks_ago: '{weeks} weeks ago',
                    months_ago: '{months} months ago'
                },
                server_names: {
                    kampala: 'Kampala',
                    new_york: 'New York',
                    frankfurt: 'Frankfurt',
                    tokyo: 'Tokyo',
                    singapore: 'Singapore',
                    london: 'London',
                    toronto: 'Toronto',
                    sydney: 'Sydney',
                    sao_paulo: 'Sao Paulo',
                    mumbai: 'Mumbai',
                    johannesburg: 'Johannesburg',
                    paris: 'Paris',
                    amsterdam: 'Amsterdam',
                    stockholm: 'Stockholm',
                    warsaw: 'Warsaw',
                    dubai: 'Dubai',
                    mexico_city: 'Mexico City',
                    los_angeles: 'Los Angeles',
                    chicago: 'Chicago',
                    miami: 'Miami',
                    seattle: 'Seattle',
                    dallas: 'Dallas',
                    atlanta: 'Atlanta',
                    denver: 'Denver'
                },
                countries: {
                    uganda: 'Uganda',
                    usa: 'United States',
                    germany: 'Germany',
                    japan: 'Japan',
                    singapore: 'Singapore',
                    uk: 'United Kingdom',
                    canada: 'Canada',
                    australia: 'Australia',
                    brazil: 'Brazil',
                    india: 'India',
                    south_africa: 'South Africa',
                    france: 'France',
                    netherlands: 'Netherlands',
                    sweden: 'Sweden',
                    poland: 'Poland',
                    uae: 'UAE',
                    mexico: 'Mexico'
                }
            },

            // SPANISH
            es: {
                app: {
                    name: 'SEYTRONS VPN',
                    version: 'Versión 2.4.1'
                },
                common: {
                    connect: 'Conectar',
                    disconnect: 'Desconectar',
                    cancel: 'Cancelar',
                    save: 'Guardar',
                    delete: 'Eliminar',
                    edit: 'Editar',
                    close: 'Cerrar',
                    back: 'Atrás',
                    next: 'Siguiente',
                    skip: 'Saltar',
                    done: 'Listo',
                    loading: 'Cargando...',
                    error: 'Error',
                    success: 'Éxito',
                    warning: 'Advertencia',
                    info: 'Información',
                    confirm: 'Confirmar',
                    yes: 'Sí',
                    no: 'No',
                    search: 'Buscar',
                    filter: 'Filtrar',
                    clear: 'Limpiar',
                    apply: 'Aplicar',
                    upgrade: 'Mejorar',
                    learn_more: 'Más información'
                },
                splash: {
                    initializing: 'Inicializando...',
                    loading_servers: 'Cargando servidores...',
                    almost_ready: 'Casi listo...'
                },
                onboarding: {
                    privacy_title: 'Privacidad Total',
                    privacy_desc: 'Oculta tu dirección IP y navega anónimamente. Nadie puede rastrear tus actividades en línea.',
                    security_title: 'Seguridad Militar',
                    security_desc: 'Cifrado AES-256 con política estricta de no registros. Tus datos permanecen tuyos.',
                    speed_title: 'Rápido como el Rayo',
                    speed_desc: '24 servidores mundiales con ancho de banda ilimitado. Sin límites de velocidad.',
                    ready_title: '¿Listo para Comenzar?',
                    ready_desc: 'Únete a millones que confían en SEYTRONS para su privacidad en línea.'
                },
                dashboard: {
                    disconnected: 'Desconectado',
                    at_risk: 'Tus datos están en riesgo',
                    connected: 'Conectado',
                    secure: 'Tus datos están seguros',
                    connecting: 'Conectando...',
                    current_location: 'Ubicación Actual',
                    change: 'Cambiar',
                    todays_usage: 'Uso de Hoy',
                    details: 'Detalles',
                    download: 'Descarga',
                    upload: 'Subida',
                    top_speed: 'Velocidad Máxima',
                    popular_servers: 'Servidores Populares',
                    view_all: 'Ver Todos',
                    data_usage: 'Uso de Datos',
                    used: 'usado',
                    ping: 'ping',
                    location: 'Ubicación'
                },
                servers: {
                    title: 'Servidores',
                    search: 'Buscar servidores...',
                    all: 'Todos',
                    recommended: 'Recomendados',
                    fastest: 'Más Rápidos',
                    favorites: 'Favoritos',
                    europe: 'Europa',
                    asia: 'Asia',
                    americas: 'Américas',
                    africa: 'África',
                    oceania: 'Oceanía',
                    connect: 'Conectar',
                    ping: 'ms',
                    load: 'Carga',
                    favorite: 'Favorito',
                    remove_favorite: 'Eliminar de favoritos',
                    add_favorite: 'Añadir a favoritos',
                    server_status: 'Estado del Servidor',
                    online: 'En línea',
                    offline: 'Fuera de línea',
                    maintenance: 'Mantenimiento'
                },
                stats: {
                    title: 'Estadísticas',
                    total_download: 'Total Descargado',
                    total_upload: 'Total Subido',
                    connection_time: 'Tiempo de Conexión',
                    daily_usage: 'Uso Diario (Últimos 7 Días)',
                    recent_connections: 'Conexiones Recientes',
                    data_saved: 'Datos Guardados',
                    best_performance: 'Mejor Rendimiento',
                    average_speed: 'Velocidad Promedio',
                    today: 'Hoy',
                    this_week: 'Esta Semana',
                    this_month: 'Este Mes',
                    export: 'Exportar Datos'
                },
                profile: {
                    title: 'Perfil',
                    member_since: 'Miembro desde',
                    premium_member: 'Miembro Premium',
                    free_member: 'Miembro Gratuito',
                    refer_earn: 'Recomienda y Gana',
                    refer_desc: 'Comparte SEYTRONS con amigos y obtén 1 mes gratis',
                    copy_code: 'Copiar',
                    copied: '¡Copiado!',
                    account_settings: 'Configuración de Cuenta',
                    payment_methods: 'Métodos de Pago',
                    notifications: 'Notificaciones',
                    privacy: 'Privacidad',
                    logout: 'Cerrar Sesión',
                    delete_account: 'Eliminar Cuenta'
                },
                subscription: {
                    title: 'Suscripción',
                    current_plan: 'Plan Actual',
                    expires: 'Expira',
                    devices_used: 'dispositivos usados',
                    upgrade_plan: 'Mejorar Plan',
                    monthly: 'Mensual',
                    yearly: 'Anual',
                    lifetime: 'De por Vida',
                    per_month: '/mes',
                    per_year: '/año',
                    save: 'Ahorra',
                    best_value: 'Mejor Valor',
                    select: 'Seleccionar',
                    current: 'Actual',
                    payment_methods: 'Métodos de Pago',
                    promo_code: 'Código promocional',
                    apply: 'Aplicar',
                    invalid_code: 'Código promocional inválido',
                    valid_code: '¡Código promocional aplicado!',
                    card_number: 'Número de Tarjeta',
                    expiry_date: 'Fecha de Vencimiento',
                    cvv: 'CVV',
                    subscribe: 'Suscribirse',
                    cancel_subscription: 'Cancelar Suscripción'
                },
                settings: {
                    title: 'Configuración',
                    connection: 'Conexión',
                    protocol: 'Protocolo',
                    auto_wifi: 'Conectar automáticamente en Wi-Fi',
                    auto_wifi_desc: 'Conectar automáticamente en redes Wi-Fi',
                    auto_mobile: 'Conectar automáticamente en Móvil',
                    auto_mobile_desc: 'Conectar automáticamente en datos móviles',
                    kill_switch: 'Interruptor de Seguridad',
                    kill_switch_desc: 'Bloquear internet si la conexión VPN falla',
                    security: 'Seguridad y Privacidad',
                    dns_leak: 'Protección contra Fugas DNS',
                    dns_leak_desc: 'Prevenir fugas DNS cuando estás conectado',
                    ipv6_leak: 'Protección contra Fugas IPv6',
                    ipv6_leak_desc: 'Bloquear tráfico IPv6 para prevenir fugas',
                    adblocker: 'Bloqueador de Anuncios',
                    adblocker_desc: 'Bloquear anuncios y rastreadores',
                    appearance: 'Apariencia',
                    dark_mode: 'Modo Oscuro',
                    dark_mode_desc: 'Alternar tema oscuro/claro',
                    language: 'Idioma',
                    language_desc: 'Selecciona tu idioma preferido',
                    notifications: 'Notificaciones',
                    notifications_desc: 'Recibir actualizaciones importantes',
                    sounds: 'Sonidos',
                    sounds_desc: 'Reproducir sonidos para eventos',
                    vibration: 'Vibración',
                    vibration_desc: 'Vibrar al conectar/desconectar',
                    advanced: 'Avanzado',
                    split_tunneling: 'Tunel Dividido',
                    split_tunneling_desc: 'Elige qué aplicaciones usan VPN',
                    custom_dns: 'DNS Personalizado',
                    custom_dns_desc: 'Usar servidores DNS personalizados',
                    mtu: 'Tamaño MTU',
                    mtu_desc: 'Tamaño máximo de unidad de transmisión',
                    reset: 'Restablecer Valores',
                    reset_confirm: '¿Estás seguro? Esto restablecerá toda la configuración.'
                },
                support: {
                    title: 'Ayuda y Soporte',
                    search_faq: 'Buscar en preguntas frecuentes...',
                    faq: 'Preguntas Frecuentes',
                    contact_us: 'Contáctanos',
                    live_chat: 'Chat en Vivo',
                    email_support: 'Soporte por Correo',
                    submit_ticket: 'Enviar Ticket',
                    faq1_q: '¿Cómo me conecto a un servidor?',
                    faq1_a: 'Simplemente toca el botón de encendido en la pantalla principal y selecciona tu servidor preferido de la lista.',
                    faq2_q: '¿Por qué mi conexión es lenta?',
                    faq2_a: 'Intenta conectarte a un servidor más cercano a tu ubicación o usa el filtro "Más Rápidos" en la lista de servidores.',
                    faq3_q: '¿Cómo cancelo mi suscripción?',
                    faq3_a: 'Ve a Perfil → Suscripción y haz clic en "Administrar Suscripción" para cancelar o cambiar tu plan.',
                    faq4_q: '¿Mis datos son realmente privados?',
                    faq4_a: '¡Sí! Tenemos una política estricta de no registros y usamos cifrado de grado militar para proteger tus datos.',
                    faq5_q: '¿Puedo usarlo en múltiples dispositivos?',
                    faq5_a: 'Sí, dependiendo de tu plan puedes conectar hasta 5-10 dispositivos simultáneamente.'
                },
                notifications: {
                    title: 'Notificaciones',
                    mark_all_read: 'Marcar todo como leído',
                    no_notifications: 'No hay notificaciones',
                    connected: 'Conectado a',
                    disconnected: 'Desconectado de',
                    speed_test: 'Prueba de Velocidad Completa',
                    speed_test_result: 'Descarga: {download} Mbps • Subida: {upload} Mbps',
                    update_available: 'Actualización Disponible',
                    update_message: 'La versión {version} está lista para instalar',
                    payment_success: 'Pago Exitoso',
                    payment_message: '¡Gracias por tu compra!',
                    trial_ending: 'Prueba Gratuita Próxima a Terminar',
                    trial_message: 'Tu prueba gratuita termina en {days} días'
                },
                errors: {
                    connection_failed: 'Conexión fallida',
                    try_again: 'Por favor, inténtalo de nuevo',
                    server_error: 'Error del servidor',
                    network_error: 'Error de red',
                    timeout: 'Tiempo de espera agotado',
                    auth_failed: 'Autenticación fallida',
                    invalid_credentials: 'Correo o contraseña inválidos',
                    no_internet: 'Sin conexión a internet',
                    server_full: 'El servidor está lleno',
                    maintenance_mode: 'El servidor está en mantenimiento',
                    payment_failed: 'Pago fallido',
                    please_try_later: 'Por favor, inténtalo de nuevo más tarde'
                },
                time: {
                    just_now: 'Ahora mismo',
                    minutes_ago: 'hace {minutes} minutos',
                    hours_ago: 'hace {hours} horas',
                    yesterday: 'Ayer',
                    days_ago: 'hace {days} días',
                    weeks_ago: 'hace {weeks} semanas',
                    months_ago: 'hace {months} meses'
                },
                server_names: {
                    kampala: 'Kampala',
                    new_york: 'Nueva York',
                    frankfurt: 'Fráncfort',
                    tokyo: 'Tokio',
                    singapore: 'Singapur',
                    london: 'Londres',
                    toronto: 'Toronto',
                    sydney: 'Sídney',
                    sao_paulo: 'São Paulo',
                    mumbai: 'Bombay',
                    johannesburg: 'Johannesburgo',
                    paris: 'París',
                    amsterdam: 'Ámsterdam',
                    stockholm: 'Estocolmo',
                    warsaw: 'Varsovia',
                    dubai: 'Dubái',
                    mexico_city: 'Ciudad de México',
                    los_angeles: 'Los Ángeles',
                    chicago: 'Chicago',
                    miami: 'Miami',
                    seattle: 'Seattle',
                    dallas: 'Dallas',
                    atlanta: 'Atlanta',
                    denver: 'Denver'
                },
                countries: {
                    uganda: 'Uganda',
                    usa: 'Estados Unidos',
                    germany: 'Alemania',
                    japan: 'Japón',
                    singapore: 'Singapur',
                    uk: 'Reino Unido',
                    canada: 'Canadá',
                    australia: 'Australia',
                    brazil: 'Brasil',
                    india: 'India',
                    south_africa: 'Sudáfrica',
                    france: 'Francia',
                    netherlands: 'Países Bajos',
                    sweden: 'Suecia',
                    poland: 'Polonia',
                    uae: 'EAU',
                    mexico: 'México'
                }
            },

            // FRENCH
            fr: {
                app: {
                    name: 'SEYTRONS VPN',
                    version: 'Version 2.4.1'
                },
                common: {
                    connect: 'Connecter',
                    disconnect: 'Déconnecter',
                    cancel: 'Annuler',
                    save: 'Enregistrer',
                    delete: 'Supprimer',
                    edit: 'Modifier',
                    close: 'Fermer',
                    back: 'Retour',
                    next: 'Suivant',
                    skip: 'Passer',
                    done: 'Terminé',
                    loading: 'Chargement...',
                    error: 'Erreur',
                    success: 'Succès',
                    warning: 'Avertissement',
                    info: 'Info',
                    confirm: 'Confirmer',
                    yes: 'Oui',
                    no: 'Non',
                    search: 'Rechercher',
                    filter: 'Filtrer',
                    clear: 'Effacer',
                    apply: 'Appliquer',
                    upgrade: 'Améliorer',
                    learn_more: 'En savoir plus'
                },
                splash: {
                    initializing: 'Initialisation...',
                    loading_servers: 'Chargement des serveurs...',
                    almost_ready: 'Presque prêt...'
                },
                dashboard: {
                    disconnected: 'Déconnecté',
                    at_risk: 'Vos données sont en danger',
                    connected: 'Connecté',
                    secure: 'Vos données sont sécurisées',
                    connecting: 'Connexion...',
                    current_location: 'Emplacement Actuel',
                    change: 'Changer',
                    todays_usage: "Utilisation d'Aujourd'hui",
                    details: 'Détails',
                    download: 'Téléchargement',
                    upload: 'Envoi',
                    top_speed: 'Vitesse Maximale',
                    popular_servers: 'Serveurs Populaires',
                    view_all: 'Voir Tout',
                    data_usage: 'Utilisation des Données',
                    used: 'utilisé',
                    ping: 'ping',
                    location: 'Emplacement'
                },
                servers: {
                    title: 'Serveurs',
                    search: 'Rechercher des serveurs...',
                    all: 'Tous',
                    recommended: 'Recommandés',
                    fastest: 'Plus Rapides',
                    favorites: 'Favoris',
                    europe: 'Europe',
                    asia: 'Asie',
                    americas: 'Amériques',
                    africa: 'Afrique',
                    oceania: 'Océanie',
                    connect: 'Connecter',
                    ping: 'ms',
                    load: 'Charge',
                    favorite: 'Favori',
                    remove_favorite: 'Retirer des favoris',
                    add_favorite: 'Ajouter aux favoris'
                },
                stats: {
                    title: 'Statistiques',
                    total_download: 'Total Téléchargé',
                    total_upload: 'Total Envoyé',
                    connection_time: 'Temps de Connexion',
                    daily_usage: 'Utilisation Quotidienne (7 derniers jours)',
                    recent_connections: 'Connexions Récentes'
                },
                profile: {
                    title: 'Profil',
                    member_since: 'Membre depuis',
                    premium_member: 'Membre Premium',
                    refer_earn: 'Parrainez et Gagnez',
                    refer_desc: 'Partagez SEYTRONS avec vos amis et obtenez 1 mois gratuit',
                    copy_code: 'Copier',
                    copied: 'Copié !'
                },
                subscription: {
                    title: 'Abonnement',
                    current_plan: 'Plan Actuel',
                    expires: 'Expire le',
                    devices_used: 'appareils utilisés',
                    upgrade_plan: 'Améliorer le Plan',
                    monthly: 'Mensuel',
                    yearly: 'Annuel',
                    lifetime: 'À Vie',
                    per_month: '/mois',
                    per_year: '/an',
                    save: 'Économisez',
                    best_value: 'Meilleur Rapport',
                    select: 'Sélectionner',
                    current: 'Actuel',
                    payment_methods: 'Moyens de Paiement',
                    promo_code: 'Code promo',
                    apply: 'Appliquer'
                },
                settings: {
                    title: 'Paramètres',
                    connection: 'Connexion',
                    protocol: 'Protocole',
                    auto_wifi: 'Connexion auto sur Wi-Fi',
                    auto_wifi_desc: 'Se connecter automatiquement sur Wi-Fi',
                    auto_mobile: 'Connexion auto sur Mobile',
                    auto_mobile_desc: 'Se connecter automatiquement sur données mobiles',
                    kill_switch: 'Coupe-circuit',
                    kill_switch_desc: 'Bloquer internet si la VPN se déconnecte',
                    security: 'Sécurité et Confidentialité',
                    dns_leak: 'Protection contre les fuites DNS',
                    dns_leak_desc: 'Empêcher les fuites DNS',
                    ipv6_leak: 'Protection contre les fuites IPv6',
                    ipv6_leak_desc: 'Bloquer le trafic IPv6',
                    adblocker: 'Bloqueur de pubs',
                    adblocker_desc: 'Bloquer les publicités et traqueurs',
                    appearance: 'Apparence',
                    dark_mode: 'Mode Sombre',
                    dark_mode_desc: 'Activer/désactiver le thème sombre',
                    language: 'Langue',
                    language_desc: 'Choisir votre langue'
                },
                support: {
                    title: 'Aide et Support',
                    search_faq: 'Rechercher dans la FAQ...',
                    faq: 'Questions Fréquentes',
                    contact_us: 'Contactez-nous',
                    live_chat: 'Chat en Direct',
                    email_support: 'Support par Email',
                    submit_ticket: 'Envoyer un Ticket'
                }
            },

            // GERMAN
            de: {
                app: {
                    name: 'SEYTRONS VPN',
                    version: 'Version 2.4.1'
                },
                common: {
                    connect: 'Verbinden',
                    disconnect: 'Trennen',
                    cancel: 'Abbrechen',
                    save: 'Speichern',
                    delete: 'Löschen',
                    edit: 'Bearbeiten',
                    close: 'Schließen',
                    back: 'Zurück',
                    next: 'Weiter',
                    skip: 'Überspringen',
                    done: 'Fertig',
                    loading: 'Laden...',
                    error: 'Fehler',
                    success: 'Erfolg',
                    warning: 'Warnung',
                    info: 'Info',
                    confirm: 'Bestätigen',
                    yes: 'Ja',
                    no: 'Nein',
                    search: 'Suchen',
                    filter: 'Filtern',
                    clear: 'Löschen',
                    apply: 'Anwenden',
                    upgrade: 'Upgraden',
                    learn_more: 'Mehr erfahren'
                },
                splash: {
                    initializing: 'Initialisiere...',
                    loading_servers: 'Lade Server...',
                    almost_ready: 'Fast bereit...'
                },
                dashboard: {
                    disconnected: 'Getrennt',
                    at_risk: 'Ihre Daten sind gefährdet',
                    connected: 'Verbunden',
                    secure: 'Ihre Daten sind sicher',
                    connecting: 'Verbinde...',
                    current_location: 'Aktueller Standort',
                    change: 'Ändern',
                    todays_usage: 'Heutige Nutzung',
                    details: 'Details',
                    download: 'Download',
                    upload: 'Upload',
                    top_speed: 'Höchstgeschwindigkeit',
                    popular_servers: 'Beliebte Server',
                    view_all: 'Alle anzeigen',
                    data_usage: 'Datennutzung',
                    used: 'genutzt',
                    ping: 'Ping',
                    location: 'Standort'
                },
                servers: {
                    title: 'Server',
                    search: 'Server suchen...',
                    all: 'Alle',
                    recommended: 'Empfohlen',
                    fastest: 'Schnellste',
                    favorites: 'Favoriten',
                    europe: 'Europa',
                    asia: 'Asien',
                    americas: 'Amerika',
                    africa: 'Afrika',
                    oceania: 'Ozeanien',
                    connect: 'Verbinden',
                    ping: 'ms',
                    load: 'Auslastung',
                    favorite: 'Favorit',
                    remove_favorite: 'Aus Favoriten entfernen',
                    add_favorite: 'Zu Favoriten hinzufügen'
                },
                stats: {
                    title: 'Statistiken',
                    total_download: 'Insgesamt heruntergeladen',
                    total_upload: 'Insgesamt hochgeladen',
                    connection_time: 'Verbindungszeit',
                    daily_usage: 'Tägliche Nutzung (letzte 7 Tage)',
                    recent_connections: 'Letzte Verbindungen'
                },
                profile: {
                    title: 'Profil',
                    member_since: 'Mitglied seit',
                    premium_member: 'Premium-Mitglied',
                    refer_earn: 'Empfehlen & Verdienen',
                    refer_desc: 'Teilen Sie SEYTRONS mit Freunden und erhalten Sie 1 Monat gratis',
                    copy_code: 'Kopieren',
                    copied: 'Kopiert!'
                },
                subscription: {
                    title: 'Abonnement',
                    current_plan: 'Aktueller Plan',
                    expires: 'Läuft ab',
                    devices_used: 'Geräte genutzt',
                    upgrade_plan: 'Plan upgraden',
                    monthly: 'Monatlich',
                    yearly: 'Jährlich',
                    lifetime: 'Lebenslang',
                    per_month: '/Monat',
                    per_year: '/Jahr',
                    save: 'Sparen',
                    best_value: 'Bestes Preis-Leistungs-Verhältnis',
                    select: 'Auswählen',
                    current: 'Aktuell',
                    payment_methods: 'Zahlungsmethoden',
                    promo_code: 'Promo-Code',
                    apply: 'Anwenden'
                },
                settings: {
                    title: 'Einstellungen',
                    connection: 'Verbindung',
                    protocol: 'Protokoll',
                    auto_wifi: 'Auto-verbinden bei Wi-Fi',
                    auto_wifi_desc: 'Automatisch bei Wi-Fi verbinden',
                    auto_mobile: 'Auto-verbinden bei Mobilfunk',
                    auto_mobile_desc: 'Automatisch bei mobilen Daten verbinden',
                    kill_switch: 'Kill Switch',
                    kill_switch_desc: 'Internet blockieren wenn VPN getrennt',
                    security: 'Sicherheit & Datenschutz',
                    dns_leak: 'DNS-Leak-Schutz',
                    dns_leak_desc: 'DNS-Leaks verhindern',
                    ipv6_leak: 'IPv6-Leak-Schutz',
                    ipv6_leak_desc: 'IPv6-Verkehr blockieren',
                    adblocker: 'Werbeblocker',
                    adblocker_desc: 'Werbung und Tracker blockieren',
                    appearance: 'Erscheinungsbild',
                    dark_mode: 'Dark Mode',
                    dark_mode_desc: 'Dunkles/Helles Thema',
                    language: 'Sprache',
                    language_desc: 'Sprache auswählen'
                },
                support: {
                    title: 'Hilfe & Support',
                    search_faq: 'FAQ durchsuchen...',
                    faq: 'Häufig gestellte Fragen',
                    contact_us: 'Kontaktieren Sie uns',
                    live_chat: 'Live-Chat',
                    email_support: 'E-Mail-Support',
                    submit_ticket: 'Ticket einreichen'
                }
            },

            // ARABIC (RTL)
            ar: {
                app: {
                    name: 'SEYTRONS في بي إن',
                    version: 'الإصدار 2.4.1'
                },
                common: {
                    connect: 'اتصال',
                    disconnect: 'قطع الاتصال',
                    cancel: 'إلغاء',
                    save: 'حفظ',
                    delete: 'حذف',
                    edit: 'تعديل',
                    close: 'إغلاق',
                    back: 'رجوع',
                    next: 'التالي',
                    skip: 'تخطي',
                    done: 'تم',
                    loading: 'جاري التحميل...',
                    error: 'خطأ',
                    success: 'نجاح',
                    warning: 'تحذير',
                    info: 'معلومات',
                    confirm: 'تأكيد',
                    yes: 'نعم',
                    no: 'لا',
                    search: 'بحث',
                    filter: 'تصفية',
                    clear: 'مسح',
                    apply: 'تطبيق',
                    upgrade: 'ترقية',
                    learn_more: 'معرفة المزيد'
                },
                splash: {
                    initializing: 'جاري التهيئة...',
                    loading_servers: 'جاري تحميل الخوادم...',
                    almost_ready: 'على وشك الانتهاء...'
                },
                dashboard: {
                    disconnected: 'غير متصل',
                    at_risk: 'بياناتك في خطر',
                    connected: 'متصل',
                    secure: 'بياناتك آمنة',
                    connecting: 'جاري الاتصال...',
                    current_location: 'الموقع الحالي',
                    change: 'تغيير',
                    todays_usage: 'استخدام اليوم',
                    details: 'التفاصيل',
                    download: 'تنزيل',
                    upload: 'رفع',
                    top_speed: 'أقصى سرعة',
                    popular_servers: 'الخوادم الشائعة',
                    view_all: 'عرض الكل',
                    data_usage: 'استخدام البيانات',
                    used: 'مستخدم',
                    ping: 'ping',
                    location: 'الموقع'
                },
                servers: {
                    title: 'الخوادم',
                    search: 'بحث في الخوادم...',
                    all: 'الكل',
                    recommended: 'موصى به',
                    fastest: 'الأسرع',
                    favorites: 'المفضلة',
                    europe: 'أوروبا',
                    asia: 'آسيا',
                    americas: 'الأمريكتين',
                    africa: 'أفريقيا',
                    oceania: 'أوقيانوسيا',
                    connect: 'اتصال',
                    ping: 'مللي ثانية',
                    load: 'الحمل',
                    favorite: 'مفضلة',
                    remove_favorite: 'إزالة من المفضلة',
                    add_favorite: 'إضافة إلى المفضلة',
                    server_status: 'حالة الخادم',
                    online: 'متصل',
                    offline: 'غير متصل',
                    maintenance: 'صيانة'
                },
                stats: {
                    title: 'الإحصائيات',
                    total_download: 'إجمالي التنزيل',
                    total_upload: 'إجمالي الرفع',
                    connection_time: 'وقت الاتصال',
                    daily_usage: 'الاستخدام اليومي (آخر 7 أيام)',
                    recent_connections: 'الاتصالات الأخيرة',
                    data_saved: 'البيانات المحفوظة',
                    best_performance: 'أفضل أداء',
                    average_speed: 'متوسط السرعة',
                    today: 'اليوم',
                    this_week: 'هذا الأسبوع',
                    this_month: 'هذا الشهر',
                    export: 'تصدير البيانات'
                },
                profile: {
                    title: 'الملف الشخصي',
                    member_since: 'عضو منذ',
                    premium_member: 'عضو بريميوم',
                    free_member: 'عضو مجاني',
                    refer_earn: 'دع الأصدقاء واكسب',
                    refer_desc: 'شارك SEYTRONS مع الأصدقاء واحصل على شهر مجاني',
                    copy_code: 'نسخ',
                    copied: 'تم النسخ!',
                    account_settings: 'إعدادات الحساب',
                    payment_methods: 'طرق الدفع',
                    notifications: 'الإشعارات',
                    privacy: 'الخصوصية',
                    logout: 'تسجيل الخروج',
                    delete_account: 'حذف الحساب'
                },
                subscription: {
                    title: 'الاشتراك',
                    current_plan: 'الخطة الحالية',
                    expires: 'تنتهي',
                    devices_used: 'الأجهزة المستخدمة',
                    upgrade_plan: 'ترقية الخطة',
                    monthly: 'شهري',
                    yearly: 'سنوي',
                    lifetime: 'مدى الحياة',
                    per_month: '/شهر',
                    per_year: '/سنة',
                    save: 'وفر',
                    best_value: 'أفضل قيمة',
                    select: 'اختيار',
                    current: 'الحالية',
                    payment_methods: 'طرق الدفع',
                    promo_code: 'رمز ترويجي',
                    apply: 'تطبيق',
                    invalid_code: 'رمز ترويجي غير صالح',
                    valid_code: 'تم تطبيق الرمز الترويجي!',
                    card_number: 'رقم البطاقة',
                    expiry_date: 'تاريخ الانتهاء',
                    cvv: 'CVV',
                    subscribe: 'اشترك',
                    cancel_subscription: 'إلغاء الاشتراك'
                },
                settings: {
                    title: 'الإعدادات',
                    connection: 'الاتصال',
                    protocol: 'البروتوكول',
                    auto_wifi: 'اتصال تلقائي على Wi-Fi',
                    auto_wifi_desc: 'الاتصال تلقائياً على شبكات Wi-Fi',
                    auto_mobile: 'اتصال تلقائي على المحمول',
                    auto_mobile_desc: 'الاتصال تلقائياً على بيانات الجوال',
                    kill_switch: 'مفتاح القطع',
                    kill_switch_desc: 'حظر الإنترنت إذا انقطع اتصال VPN',
                    security: 'الأمان والخصوصية',
                    dns_leak: 'حماية تسرب DNS',
                    dns_leak_desc: 'منع تسرب DNS عند الاتصال',
                    ipv6_leak: 'حماية تسرب IPv6',
                    ipv6_leak_desc: 'حظر حركة IPv6 لمنع التسرب',
                    adblocker: 'حظر الإعلانات',
                    adblocker_desc: 'حظر الإعلانات والمتتبعين',
                    appearance: 'المظهر',
                    dark_mode: 'الوضع الداكن',
                    dark_mode_desc: 'تبديل السمة الداكنة/الفاتحة',
                    language: 'اللغة',
                    language_desc: 'اختر لغتك المفضلة',
                    notifications: 'الإشعارات',
                    notifications_desc: 'تلقي التحديثات المهمة',
                    sounds: 'الأصوات',
                    sounds_desc: 'تشغيل الأصوات للأحداث',
                    vibration: 'الاهتزاز',
                    vibration_desc: 'الاهتزاز عند الاتصال/قطع الاتصال',
                    advanced: 'متقدم',
                    split_tunneling: 'تقسيم النفق',
                    split_tunneling_desc: 'اختر التطبيقات التي تستخدم VPN',
                    custom_dns: 'DNS مخصص',
                    custom_dns_desc: 'استخدام خوادم DNS مخصصة',
                    mtu: 'حجم MTU',
                    mtu_desc: 'الحد الأقصى لوحدة الإرسال',
                    reset: 'إعادة ضبط الإعدادات',
                    reset_confirm: 'هل أنت متأكد؟ سيتم إعادة ضبط جميع الإعدادات.'
                },
                support: {
                    title: 'المساعدة والدعم',
                    search_faq: 'بحث في الأسئلة الشائعة...',
                    faq: 'الأسئلة الشائعة',
                    contact_us: 'اتصل بنا',
                    live_chat: 'الدردشة المباشرة',
                    email_support: 'دعم البريد الإلكتروني',
                    submit_ticket: 'إرسال تذكرة',
                    faq1_q: 'كيف أتصل بخادم؟',
                    faq1_a: 'ما عليك سوى النقر على زر الطاقة في الشاشة الرئيسية واختيار الخادم المفضل لديك من القائمة.',
                    faq2_q: 'لماذا اتصالي بطيء؟',
                    faq2_a: 'حاول الاتصال بخادم أقرب إلى موقعك أو استخدم فلتر "الأسرع" في قائمة الخوادم.',
                    faq3_q: 'كيف ألغي اشتراكي؟',
                    faq3_a: 'انتقل إلى الملف الشخصي → الاشتراك وانقر على "إدارة الاشتراك" لإلغاء أو تغيير خطتك.',
                    faq4_q: 'هل بياناتي خاصة حقاً؟',
                    faq4_a: 'نعم! لدينا سياسة صارمة لعدم الاحتفاظ بالسجلات ونستخدم تشفير عسكري لحماية بياناتك.',
                    faq5_q: 'هل يمكنني استخدامه على أجهزة متعددة؟',
                    faq5_a: 'نعم، اعتماداً على خطتك يمكنك الاتصال بما يصل إلى 5-10 أجهزة في وقت واحد.'
                },
                notifications: {
                    title: 'الإشعارات',
                    mark_all_read: 'تحديد الكل كمقروء',
                    no_notifications: 'لا توجد إشعارات',
                    connected: 'متصل بـ',
                    disconnected: 'غير متصل من',
                    speed_test: 'اكتمال اختبار السرعة',
                    speed_test_result: 'تنزيل: {download} ميجابت/ثانية • رفع: {upload} ميجابت/ثانية',
                    update_available: 'تحديث متاح',
                    update_message: 'الإصدار {version} جاهز للتثبيت',
                    payment_success: 'تم الدفع بنجاح',
                    payment_message: 'شكراً لك على الشراء!',
                    trial_ending: 'الفترة التجريبية على وشك الانتهاء',
                    trial_message: 'تنتهي الفترة التجريبية المجانية بعد {days} أيام'
                },
                errors: {
                    connection_failed: 'فشل الاتصال',
                    try_again: 'يرجى المحاولة مرة أخرى',
                    server_error: 'خطأ في الخادم',
                    network_error: 'خطأ في الشبكة',
                    timeout: 'انتهت مهلة الاتصال',
                    auth_failed: 'فشل المصادقة',
                    invalid_credentials: 'بريد إلكتروني أو كلمة مرور غير صالحة',
                    no_internet: 'لا يوجد اتصال بالإنترنت',
                    server_full: 'الخادم ممتلئ',
                    maintenance_mode: 'الخادم قيد الصيانة',
                    payment_failed: 'فشل الدفع',
                    please_try_later: 'يرجى المحاولة مرة أخرى لاحقاً'
                },
                time: {
                    just_now: 'الآن',
                    minutes_ago: 'منذ {minutes} دقائق',
                    hours_ago: 'منذ {hours} ساعات',
                    yesterday: 'أمس',
                    days_ago: 'منذ {days} أيام',
                    weeks_ago: 'منذ {weeks} أسابيع',
                    months_ago: 'منذ {months} أشهر'
                },
                server_names: {
                    kampala: 'كامبالا',
                    new_york: 'نيويورك',
                    frankfurt: 'فرانكفورت',
                    tokyo: 'طوكيو',
                    singapore: 'سنغافورة',
                    london: 'لندن',
                    toronto: 'تورونتو',
                    sydney: 'سيدني',
                    sao_paulo: 'ساو باولو',
                    mumbai: 'مومباي',
                    johannesburg: 'جوهانسبرغ',
                    paris: 'باريس',
                    amsterdam: 'أمستردام',
                    stockholm: 'ستوكهولم',
                    warsaw: 'وارسو',
                    dubai: 'دبي',
                    mexico_city: 'مكسيكو سيتي',
                    los_angeles: 'لوس أنجلوس',
                    chicago: 'شيكاغو',
                    miami: 'ميامي',
                    seattle: 'سياتل',
                    dallas: 'دالاس',
                    atlanta: 'أتلانتا',
                    denver: 'دنفر'
                },
                countries: {
                    uganda: 'أوغندا',
                    usa: 'الولايات المتحدة',
                    germany: 'ألمانيا',
                    japan: 'اليابان',
                    singapore: 'سنغافورة',
                    uk: 'المملكة المتحدة',
                    canada: 'كندا',
                    australia: 'أستراليا',
                    brazil: 'البرازيل',
                    india: 'الهند',
                    south_africa: 'جنوب أفريقيا',
                    france: 'فرنسا',
                    netherlands: 'هولندا',
                    sweden: 'السويد',
                    poland: 'بولندا',
                    uae: 'الإمارات',
                    mexico: 'المكسيك'
                }
            },

            // JAPANESE
            ja: {
                app: {
                    name: 'SEYTRONS VPN',
                    version: 'バージョン 2.4.1'
                },
                common: {
                    connect: '接続',
                    disconnect: '切断',
                    cancel: 'キャンセル',
                    save: '保存',
                    delete: '削除',
                    edit: '編集',
                    close: '閉じる',
                    back: '戻る',
                    next: '次へ',
                    skip: 'スキップ',
                    done: '完了',
                    loading: '読み込み中...',
                    error: 'エラー',
                    success: '成功',
                    warning: '警告',
                    info: '情報',
                    confirm: '確認',
                    yes: 'はい',
                    no: 'いいえ',
                    search: '検索',
                    filter: 'フィルター',
                    clear: 'クリア',
                    apply: '適用',
                    upgrade: 'アップグレード',
                    learn_more: '詳細'
                },
                splash: {
                    initializing: '初期化中...',
                    loading_servers: 'サーバーを読み込み中...',
                    almost_ready: 'まもなく準備完了...'
                },
                dashboard: {
                    disconnected: '切断されました',
                    at_risk: 'データが危険にさらされています',
                    connected: '接続済み',
                    secure: 'データは保護されています',
                    connecting: '接続中...',
                    current_location: '現在地',
                    change: '変更',
                    todays_usage: '今日の使用量',
                    details: '詳細',
                    download: 'ダウンロード',
                    upload: 'アップロード',
                    top_speed: '最高速度',
                    popular_servers: '人気のサーバー',
                    view_all: 'すべて表示',
                    data_usage: 'データ使用量',
                    used: '使用済み',
                    ping: 'ping',
                    location: '場所'
                },
                servers: {
                    title: 'サーバー',
                    search: 'サーバーを検索...',
                    all: 'すべて',
                    recommended: 'おすすめ',
                    fastest: '最速',
                    favorites: 'お気に入り',
                    europe: 'ヨーロッパ',
                    asia: 'アジア',
                    americas: 'アメリカ大陸',
                    africa: 'アフリカ',
                    oceania: 'オセアニア',
                    connect: '接続',
                    ping: 'ms',
                    load: '負荷',
                    favorite: 'お気に入り',
                    remove_favorite: 'お気に入りから削除',
                    add_favorite: 'お気に入りに追加',
                    server_status: 'サーバーステータス',
                    online: 'オンライン',
                    offline: 'オフライン',
                    maintenance: 'メンテナンス'
                },
                stats: {
                    title: '統計',
                    total_download: '総ダウンロード',
                    total_upload: '総アップロード',
                    connection_time: '接続時間',
                    daily_usage: '日次使用量（過去7日間）',
                    recent_connections: '最近の接続',
                    data_saved: '保存されたデータ',
                    best_performance: '最高パフォーマンス',
                    average_speed: '平均速度',
                    today: '今日',
                    this_week: '今週',
                    this_month: '今月',
                    export: 'データをエクスポート'
                },
                profile: {
                    title: 'プロフィール',
                    member_since: '会員期間',
                    premium_member: 'プレミアム会員',
                    free_member: '無料会員',
                    refer_earn: '紹介して獲得',
                    refer_desc: '友達にSEYTRONSを紹介して1ヶ月無料を獲得',
                    copy_code: 'コピー',
                    copied: 'コピーしました！',
                    account_settings: 'アカウント設定',
                    payment_methods: '支払い方法',
                    notifications: '通知',
                    privacy: 'プライバシー',
                    logout: 'ログアウト',
                    delete_account: 'アカウント削除'
                },
                subscription: {
                    title: 'サブスクリプション',
                    current_plan: '現在のプラン',
                    expires: '有効期限',
                    devices_used: '使用デバイス数',
                    upgrade_plan: 'プランをアップグレード',
                    monthly: '月額',
                    yearly: '年額',
                    lifetime: '永久',
                    per_month: '/月',
                    per_year: '/年',
                    save: '節約',
                    best_value: 'ベストバリュー',
                    select: '選択',
                    current: '現在',
                    payment_methods: '支払い方法',
                    promo_code: 'プロモーションコード',
                    apply: '適用',
                    invalid_code: '無効なプロモーションコード',
                    valid_code: 'プロモーションコードを適用しました！',
                    card_number: 'カード番号',
                    expiry_date: '有効期限',
                    cvv: 'CVV',
                    subscribe: '購読する',
                    cancel_subscription: 'サブスクリプションをキャンセル'
                },
                settings: {
                    title: '設定',
                    connection: '接続',
                    protocol: 'プロトコル',
                    auto_wifi: 'Wi-Fiで自動接続',
                    auto_wifi_desc: 'Wi-Fiネットワークで自動的に接続',
                    auto_mobile: 'モバイルで自動接続',
                    auto_mobile_desc: 'モバイルデータで自動的に接続',
                    kill_switch: 'キルスイッチ',
                    kill_switch_desc: 'VPN切断時にインターネットをブロック',
                    security: 'セキュリティとプライバシー',
                    dns_leak: 'DNSリーク保護',
                    dns_leak_desc: '接続中のDNSリークを防止',
                    ipv6_leak: 'IPv6リーク保護',
                    ipv6_leak_desc: 'リークを防ぐためにIPv6トラフィックをブロック',
                    adblocker: '広告ブロッカー',
                    adblocker_desc: '広告とトラッカーをブロック',
                    appearance: '外観',
                    dark_mode: 'ダークモード',
                    dark_mode_desc: 'ダーク/ライトテーマを切り替え',
                    language: '言語',
                    language_desc: '言語を選択',
                    notifications: '通知',
                    notifications_desc: '重要なアップデートを受信',
                    sounds: 'サウンド',
                    sounds_desc: 'イベントのサウンドを再生',
                    vibration: 'バイブレーション',
                    vibration_desc: '接続/切断時にバイブレーション',
                    advanced: '詳細設定',
                    split_tunneling: 'スプリットトンネリング',
                    split_tunneling_desc: 'VPNを使用するアプリを選択',
                    custom_dns: 'カスタムDNS',
                    custom_dns_desc: 'カスタムDNSサーバーを使用',
                    mtu: 'MTUサイズ',
                    mtu_desc: '最大転送単位サイズ',
                    reset: 'デフォルトにリセット',
                    reset_confirm: '本当にリセットしますか？すべての設定がリセットされます。'
                },
                support: {
                    title: 'ヘルプとサポート',
                    search_faq: 'よくある質問を検索...',
                    faq: 'よくある質問',
                    contact_us: 'お問い合わせ',
                    live_chat: 'ライブチャット',
                    email_support: 'メールサポート',
                    submit_ticket: 'チケットを送信',
                    faq1_q: 'サーバーに接続するには？',
                    faq1_a: 'ホーム画面の電源ボタンをタップし、リストから希望のサーバーを選択するだけです。',
                    faq2_q: '接続が遅いのはなぜ？',
                    faq2_a: 'お住まいの地域に近いサーバーに接続するか、サーバーリストの「最速」フィルターを使用してみてください。',
                    faq3_q: 'サブスクリプションをキャンセルするには？',
                    faq3_a: 'プロフィール → サブスクリプションに進み、「サブスクリプションを管理」をクリックしてキャンセルまたはプランを変更します。',
                    faq4_q: 'データは本当にプライベートですか？',
                    faq4_a: 'はい！厳格なノーログポリシーと軍事レベルの暗号化を使用してデータを保護しています。',
                    faq5_q: '複数のデバイスで使用できますか？',
                    faq5_a: 'はい、プランに応じて5〜10台のデバイスを同時に接続できます。'
                },
                notifications: {
                    title: '通知',
                    mark_all_read: 'すべて既読にする',
                    no_notifications: '通知はありません',
                    connected: 'に接続しました',
                    disconnected: 'から切断しました',
                    speed_test: 'スピードテスト完了',
                    speed_test_result: 'ダウンロード: {download} Mbps • アップロード: {upload} Mbps',
                    update_available: 'アップデート利用可能',
                    update_message: 'バージョン {version} をインストールできます',
                    payment_success: '支払い成功',
                    payment_message: 'ご購入ありがとうございます！',
                    trial_ending: 'トライアル期間終了間近',
                    trial_message: '無料トライアルはあと {days} 日で終了します'
                },
                errors: {
                    connection_failed: '接続に失敗しました',
                    try_again: 'もう一度お試しください',
                    server_error: 'サーバーエラー',
                    network_error: 'ネットワークエラー',
                    timeout: 'タイムアウト',
                    auth_failed: '認証に失敗しました',
                    invalid_credentials: 'メールアドレスまたはパスワードが無効です',
                    no_internet: 'インターネット接続がありません',
                    server_full: 'サーバーが満員です',
                    maintenance_mode: 'サーバーはメンテナンス中です',
                    payment_failed: '支払いに失敗しました',
                    please_try_later: '後でもう一度お試しください'
                },
                time: {
                    just_now: 'たった今',
                    minutes_ago: '{minutes}分前',
                    hours_ago: '{hours}時間前',
                    yesterday: '昨日',
                    days_ago: '{days}日前',
                    weeks_ago: '{weeks}週間前',
                    months_ago: '{months}ヶ月前'
                },
                server_names: {
                    kampala: 'カンパラ',
                    new_york: 'ニューヨーク',
                    frankfurt: 'フランクフルト',
                    tokyo: '東京',
                    singapore: 'シンガポール',
                    london: 'ロンドン',
                    toronto: 'トロント',
                    sydney: 'シドニー',
                    sao_paulo: 'サンパウロ',
                    mumbai: 'ムンバイ',
                    johannesburg: 'ヨハネスブルグ',
                    paris: 'パリ',
                    amsterdam: 'アムステルダム',
                    stockholm: 'ストックホルム',
                    warsaw: 'ワルシャワ',
                    dubai: 'ドバイ',
                    mexico_city: 'メキシコシティ',
                    los_angeles: 'ロサンゼルス',
                    chicago: 'シカゴ',
                    miami: 'マイアミ',
                    seattle: 'シアトル',
                    dallas: 'ダラス',
                    atlanta: 'アトランタ',
                    denver: 'デンバー'
                },
                countries: {
                    uganda: 'ウガンダ',
                    usa: 'アメリカ合衆国',
                    germany: 'ドイツ',
                    japan: '日本',
                    singapore: 'シンガポール',
                    uk: 'イギリス',
                    canada: 'カナダ',
                    australia: 'オーストラリア',
                    brazil: 'ブラジル',
                    india: 'インド',
                    south_africa: '南アフリカ',
                    france: 'フランス',
                    netherlands: 'オランダ',
                    sweden: 'スウェーデン',
                    poland: 'ポーランド',
                    uae: 'アラブ首長国連邦',
                    mexico: 'メキシコ'
                }
            }
        };

        // Store translations
        this.translations = translations[lang] || translations.en;
        
        // Store all translations for later use
        this.allTranslations = translations;
    },

    translate(key, params = {}) {
        const keys = key.split('.');
        let value = this.translations;
        
        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                console.warn(`Translation missing for key: ${key} in language: ${this.currentLanguage}`);
                // Fallback to English
                let fallback = this.allTranslations.en;
                for (const fallbackKey of keys) {
                    if (fallback && fallback[fallbackKey] !== undefined) {
                        fallback = fallback[fallbackKey];
                    } else {
                        return key;
                    }
                }
                return this.replaceParams(fallback, params);
            }
        }
        
        return this.replaceParams(value, params);
    },

    replaceParams(text, params) {
        if (!text || typeof text !== 'string') return text;
        
        return text.replace(/{(\w+)}/g, (match, key) => {
            return params[key] !== undefined ? params[key] : match;
        });
    },

    translateUI() {
        // Translate all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            const translation = this.translate(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.placeholder !== undefined) {
                    element.placeholder = translation;
                } else if (element.value !== undefined) {
                    element.value = translation;
                }
            } else if (element.tagName === 'OPTION') {
                element.textContent = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Translate placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.dataset.i18nPlaceholder;
            element.placeholder = this.translate(key);
        });

        // Translate titles
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.dataset.i18nTitle;
            element.title = this.translate(key);
        });

        // Translate values
        document.querySelectorAll('[data-i18n-value]').forEach(element => {
            const key = element.dataset.i18nValue;
            element.value = this.translate(key);
        });

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;
        
        // Dispatch event for components that need to update
        window.dispatchEvent(new CustomEvent('language-changed', {
            detail: { language: this.currentLanguage, translations: this.translations }
        }));
    },

    changeLanguage(lang) {
        if (this.languages[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('seytron_language', lang);
            
            this.loadTranslations(lang).then(() => {
                this.applyTextDirection();
                this.translateUI();
                this.notifyListeners();
                
                // Show success message
                if (window.NotificationCenter) {
                    window.NotificationCenter.show({
                        title: this.translate('common.success'),
                        message: `${this.languages[lang].flag} ${this.languages[lang].name}`,
                        type: 'success',
                        duration: 2000
                    });
                }
            });
        }
    },

    setupLanguageSelector() {
        // Add language selector to settings if it exists
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            // Clear existing options
            languageSelect.innerHTML = '';

            // Populate language options only for languages that have translations
            const availableTranslations = this.allTranslations ? Object.keys(this.allTranslations) : [];

            // If no translations are loaded yet, fall back to keys in `languages`
            const languagesToShow = availableTranslations.length ? availableTranslations : Object.keys(this.languages);

            languagesToShow.forEach((code) => {
                const meta = this.languages[code];
                // skip if metadata for language doesn't exist
                if (!meta) return;

                const option = document.createElement('option');
                option.value = code;
                option.textContent = `${meta.flag} ${meta.name}`;
                option.selected = this.currentLanguage === code;
                languageSelect.appendChild(option);
            });

            // Remove existing listener and add new one
            languageSelect.removeEventListener('change', this.handleLanguageChange);
            languageSelect.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }
    },

    handleLanguageChange(e) {
        this.changeLanguage(e.target.value);
    },

    addListener(callback) {
        this.listeners.push(callback);
    },

    removeListener(callback) {
        const index = this.listeners.indexOf(callback);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    },

    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback(this.currentLanguage, this.translations);
            } catch (e) {
                console.error('Error in language change listener:', e);
            }
        });
    },

    getCurrentLanguage() {
        return {
            code: this.currentLanguage,
            ...this.languages[this.currentLanguage]
        };
    },

    getAllLanguages() {
        return this.languages;
    }
};

// Initialize i18n when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    window.i18n = i18n;
    await i18n.init();
});

// Export for use in other files
window.i18n = i18n;
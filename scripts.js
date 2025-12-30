/**
 * BURGUERTOP - Scripts del Sitio Web
 * Archivo centralizado para todas las funciones JavaScript
 */

// ===========================
// GUNDB INITIALIZATION (P2P)
// ===========================
const gun = Gun(['https://gun-manhattan.herokuapp.com/gun']);
const db = gun.get('rateflow_v1'); // App namespace

// ===========================
// MENÚ DE NAVEGACIÓN RESPONSIVE
// ===========================

/**
 * Función para toggle del menú responsive en dispositivos móviles
 */
function myFunction() {
    const nav = document.getElementById("myTopnav");
    if (nav.className === "topnav") {
        nav.className += " responsive";
    } else {
        nav.className = "topnav";
    }
}

// Cerrar menú al hacer clic en un enlace (mejora UX en móvil)
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.topnav a:not(.icon)');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            const nav = document.getElementById("myTopnav");
            if (nav.className.includes("responsive")) {
                nav.className = "topnav";
            }
        });
    });
});


// ===========================
// VALIDACIÓN DE FORMULARIO DE CONTACTO
// ===========================

/**
 * Validar formulario de contacto antes de enviar
 */
function validarFormulario(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    const btnEnviar = document.getElementById('btn-enviar');

    // Resetear animación del botón
    if (btnEnviar) {
        btnEnviar.classList.remove('btn-error');
        void btnEnviar.offsetWidth; // Force reflow
    }

    // Validar que los campos no estén vacíos
    let isValid = true;

    if (nombre === '') {
        showError('nombre');
        isValid = false;
    }

    if (email === '') {
        showError('email');
        isValid = false;
    }

    // Validar formato de email si no esta vacio
    if (email !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('email'); // Usar visual feedback consistente
            // alert('Por favor, ingresa un email válido.'); // Opcional, o solo visual
            isValid = false;
        }
    }

    if (!isValid) {
        // ERROR: Agitar botón
        if (btnEnviar) {
            btnEnviar.classList.add('btn-error');
            btnEnviar.addEventListener('animationend', () => {
                btnEnviar.classList.remove('btn-error');
            }, { once: true });
        }
        return false;
    }



    // Si todo está bien, mostrar mensaje de éxito y animar
    // Calcular posición para la explosión (centro del botón)
    const btn = document.getElementById('btn-enviar');
    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    ParticleEffect.createExplosion(x, y);

    setTimeout(() => {
        alert('¡Gracias por tu mensaje! Nos pondremos en contacto pronto.');
        // document.querySelector('form').submit(); 
    }, 500);

    return true;
}

/**
 * Mostrar error visual en input
 */
function showError(id) {
    const input = document.getElementById(id);
    if (!input) return;

    // Remover para reiniciar la animación si ya existe
    input.classList.remove('input-error');

    // Forzar reflow (re-painting) para reiniciar la animación
    void input.offsetWidth;

    input.classList.add('input-error');

    // Remover error al escribir
    input.addEventListener('input', function () {
        this.classList.remove('input-error');
    }, { once: true });
}

// Adjuntar validación al formulario cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', validarFormulario);
    }
});


// ===========================
// ANIMACIONES SUAVES AL SCROLL
// ===========================

/**
 * Añadir scroll suave a los enlaces internos
 */
document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});


// ===========================
// EFECTOS HOVER MEJORADOS PARA EQUIPO
// ===========================

/**
 * Mejorar interactividad de las imágenes del equipo
 */
document.addEventListener('DOMContentLoaded', function () {
    const imagenes = document.querySelectorAll('.imgenequipo1, .imgenequipo2, .imgenequipo3');

    imagenes.forEach(img => {
        img.addEventListener('mouseenter', function () {
            this.style.transition = 'transform 0.3s ease';
            this.style.transform = 'scale(1.05)';
        });

        img.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });
});


// ===========================
// LAZY LOADING DE IMÁGENES (OPCIONAL)
// ===========================

/**
 * Implementar lazy loading para mejorar rendimiento
 */
document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});


// ===========================
// ANALYTICS Y TRACKING (OPCIONAL)
// ===========================

/**
 * Función para trackear eventos (preparada para Google Analytics)
 */
function trackEvent(category, action, label) {
    // COOKIE CONSENT CHECK
    if (localStorage.getItem('rateflow_cookie_consent') !== 'accepted') {
        return; // Stop tracking if not accepted
    }

    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
}

// Trackear clics en enlaces externos
document.addEventListener('DOMContentLoaded', function () {
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function () {
            const href = this.getAttribute('href');
            trackEvent('External Link', 'Click', href);
        });
    });
});


// ===========================
// UTILIDADES GENERALES
// ===========================

/**
 * Función para obtener el año actual (para footer dinámico)
 */
function getCurrentYear() {
    return new Date().getFullYear();
}

/**
 * Actualizar año en el footer automáticamente
 */
document.addEventListener('DOMContentLoaded', function () {
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = getCurrentYear();
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });
});


// ===========================
// MODO DEBUG (SOLO DESARROLLO)
// ===========================

/**
 * Función de debug para desarrollo
 */
const DEBUG = false; // Cambiar a false en producción

function debug(message) {
    if (DEBUG) {
        console.log(`[BURGUERTOP DEBUG]: ${message}`);
    }
}

// Log cuando el sitio esté completamente cargado
window.addEventListener('load', function () {
    debug('Sitio web BURGUERTOP cargado completamente');
    debug(`Navegador: ${navigator.userAgent}`);
    debug(`Resolución: ${window.innerWidth}x${window.innerHeight}`);
});


// ===========================
// SISTEMA DE VOTACIÓN DE HAMBURGUESAS
// ===========================

/**
 * Sistema de votación con estrellas para las hamburgueserías
 */
// ===========================
// SISTEMA DE USUARIOS (AuthManager)
// ===========================

const AuthManager = {
    SESSION_KEY: 'burguertop_session_v2',
    currentUser: null,

    async init() {
        // Restore session from localStorage if exists (for fast UI load)
        const saved = localStorage.getItem(this.SESSION_KEY);
        if (saved) {
            this.currentUser = JSON.parse(saved);
        }

        // Listen to GunDB Auth State
        gun.on('auth', async (ack) => {
            const alias = ack.put.alias;
            const pub = ack.soul.replace('~', '');

            // Get detailed profile
            const profile = await this.fetchUserProfile(pub);

            this.currentUser = {
                id: pub,
                nombre: alias, // or profile.nombre
                username: alias,
                avatar: profile.avatar || null,
                role: 'user', // Default
                isLoggedIn: true,
                ...profile
            };

            this.saveSessionLocal(this.currentUser);
            this.updateNavigation();

            // If on login page, redirect
            if (window.location.pathname.includes('login.html')) {
                window.location.href = 'index.html';
            }
        });

        // Initialize user session if we have stored keys? 
        // Gun.js automatically tries to re-auth if keys are in sessionStorage (default behavior)
        // We just update UI based on that.
        this.updateNavigation();
    },

    saveSessionLocal(user) {
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
    },

    async fetchUserProfile(pub) {
        return new Promise((resolve) => {
            // Retrieve profile data from public node
            gun.user(pub).get('profile').once((data) => {
                resolve(data || {});
            });
        });
    },

    isLoggedIn() {
        return !!this.currentUser; // Synchronous check for UI
    },

    getCurrentUser() {
        return this.currentUser;
    },

    async login(email, password) {
        return new Promise((resolve, reject) => {
            // Gun uses Alias (username) not email usually, but we can treat email as alias
            gun.user().auth(email, password, (ack) => {
                if (ack.err) {
                    reject(ack.err);
                } else {
                    resolve(ack);
                }
            });
        });
    },

    async register(name, username, password, age) {
        return new Promise((resolve, reject) => {
            gun.user().create(username, password, (ack) => {
                if (ack.err) {
                    reject(ack.err);
                } else {
                    // Login immediately to set profile
                    gun.user().auth(username, password, () => {
                        // Save initial profile
                        gun.user().get('profile').put({
                            nombre: name,
                            username: username,
                            age: parseInt(age),
                            joined: new Date().toISOString(),
                            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
                        });
                        resolve(ack);
                    });
                }
            });
        });
    },

    logout() {
        gun.user().leave();
        this.currentUser = null;
        localStorage.removeItem(this.SESSION_KEY);
        window.location.href = 'index.html';
    },

    saveUser(user) {
        // UI calls this to update local state, but we should sync to Gun
        if (this.currentUser) {
            // Only update specific fields allowed
            gun.user().get('profile').put({
                avatar: user.avatar,
                // Add other fields you want to sync
            });
            this.saveSessionLocal(user);
            this.currentUser = user;
        }
    },

    /**
     * Obtener insignia según actividad
     */
    getCommunityBadge(votesCount) {
        const ranks = [
            { t: 10000, n: 'Génesis del Flow', i: '💎' },
            { t: 9200, n: 'Avatar de la Crítica', i: '⚛️' },
            { t: 8000, n: 'Constelación de Votos', i: '🌠' },
            { t: 6500, n: 'Mito Urbano', i: '⛩️' },
            { t: 5000, n: 'Entidad de la Reseña', i: '🧿' },
            { t: 3800, n: 'Maestro Supremo', i: '🌀' },
            { t: 2800, n: 'Arquitecto Social', i: '🏗️' },
            { t: 2000, n: 'Pionero Estelar', i: '✨' },
            { t: 1400, n: 'Guardián del Flow', i: '🛡️' },
            { t: 1000, n: 'Oráculo Sagrado', i: '🏮' },
            { t: 700, n: 'Leyenda Viviente', i: '🌌' },
            { t: 500, n: 'Visionario', i: '👁️' },
            { t: 350, n: 'Maestro de Sabores', i: '🎩' },
            { t: 250, n: 'Guía de Élite', i: '🥇' },
            { t: 180, n: 'Experto Regional', i: '🏛️' },
            { t: 125, n: 'Referente', i: '✅' },
            { t: 85, n: 'Voz de la Comunidad', i: '📢' },
            { t: 55, n: 'Crítico Local', i: '🕵️' },
            { t: 35, n: 'Colaborador Activo', i: '🤝' },
            { t: 20, n: 'Cazador de Joyas', i: '💎' },
            { t: 10, n: 'Aventurero', i: '⛺' },
            { t: 5, n: 'Explorador', i: '🧭' },
            { t: 2, n: 'Curioso', i: '🔍' },
            { t: 1, n: 'Visitante', i: '🚶' },
            { t: 0, n: 'Recién Llegado', i: '🌱' }
        ];

        for (let i = 0; i < ranks.length; i++) {
            if (votesCount >= ranks[i].t) {
                const nextThreshold = i === 0 ? null : ranks[i - 1].t;
                // Spectral Color Logic (HSL)
                // We map the 25 ranks across a color wheel
                const rankIndex = ranks.length - 1 - i;
                const hue = (rankIndex * 15) % 360;
                const color = `hsl(${hue}, 80%, 65%)`;

                return {
                    name: ranks[i].n,
                    icon: ranks[i].i,
                    color: i === 0 ? '#00ffd5' : color, // Special color for max level
                    next: nextThreshold,
                    threshold: ranks[i].t
                };
            }
        }
    },

    /**
     * Actualizar la barra de navegación según estado
     */
    updateNavigation() {
        const nav = document.querySelector('.main-nav');
        const userActions = document.querySelector('.user-actions');
        if (!nav || !userActions) return;

        // Limpiar botones de auth previos en nav (para móvil o links rápidos)
        const activeAuthLinks = nav.querySelectorAll('.auth-link');
        activeAuthLinks.forEach(link => link.remove());

        // Limpiar user actions
        userActions.innerHTML = '';

        const user = this.getCurrentUser();

        if (user) {
            // Check if we are in the redesigned header (perfil.html/local.html often have standard links)
            // But for index/ranking we might want to keep the links mostly static and only update the user icon area

            // Create user menu container
            const menuContainer = document.createElement('div');
            menuContainer.className = 'user-menu-container';

            // Notification Bell & Dropdown
            const notificationArea = document.createElement('div');
            notificationArea.className = 'notification-wrapper';
            notificationArea.style.position = 'relative';

            notificationArea.innerHTML = `
                <button class="icon-btn" id="notification-bell-btn">
                    <i class="fa-regular fa-bell"></i>
                    <span class="notify-badge"></span>
                </button>
                <div class="notification-dropdown" id="notification-dropdown">
                    <div class="dropdown-header">
                        <span>Cupones Cercanos</span>
                        <span class="mark-read">Ver todo</span>
                    </div>
                    <div class="notification-list" id="notification-list">
                        <!-- Injected via renderNotifications -->
                        <div style="padding:20px; text-align:center; color:#555;">Investigando tu ubicación...</div>
                    </div>
                </div>
            `;

            // Avatar trigger
            const avatarTrigger = document.createElement('div');
            avatarTrigger.className = 'user-avatar-trigger';
            avatarTrigger.id = 'user-dropdown-trigger';
            const avatarUrl = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nombre)}&background=333&color=fff`;
            avatarTrigger.innerHTML = `<img src="${avatarUrl}" alt="User">`;

            // Dropdown menu
            const dropdown = document.createElement('div');
            dropdown.className = 'user-dropdown';
            dropdown.id = 'user-dropdown-menu';
            dropdown.innerHTML = `
                <div class="dropdown-user-info">
                    <span class="dropdown-user-name">${user.nombre}</span>
                    <span class="dropdown-user-handle">@${user.nombre.toLowerCase().replace(/\s/g, '')}</span>
                </div>
                <a href="perfil.html" class="dropdown-item">
                    <i class="fa-regular fa-user"></i> Mi Perfil
                </a>
                <a href="#" class="dropdown-item" onclick="WalletSystem.open()">
                    <i class="fa-solid fa-wallet"></i> Mis Cupones
                </a>
                <a href="#" class="dropdown-item">
                    <i class="fa-solid fa-sliders"></i> Ajustes
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item logout-item" id="logout-menu-btn">
                    <i class="fa-solid fa-arrow-right-from-bracket"></i> Cerrar Sesión
                </a>
            `;

            menuContainer.appendChild(notificationArea);
            menuContainer.appendChild(avatarTrigger);
            menuContainer.appendChild(dropdown);

            userActions.appendChild(menuContainer);

            // Toggle logic
            avatarTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('active');
            });

            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!menuContainer.contains(e.target)) {
                    dropdown.classList.remove('active');
                }
            });

            // Logout logic
            const logoutBtn = dropdown.querySelector('#logout-menu-btn');
            logoutBtn.onclick = (e) => {
                e.preventDefault();
                this.logout();
            };

        } else {
            // Mostrar Registro en user-actions
            const registerBtn = document.createElement('a');
            registerBtn.href = 'registro.html';
            registerBtn.className = 'btn-outline pill small';
            registerBtn.style.padding = '8px 20px';
            registerBtn.textContent = 'Registrarse Gratis';
            userActions.appendChild(registerBtn);
        }
    }
};

// ===========================
// RANKING DATA (By Category)
// ===========================
const RankingData = {
    burgers: [
        { id: 'rudy', name: 'Rudy Burgers', type: 'Hamburguesería • Opción Veggie', price: '$$', desc: 'Relación precio/calidad increíble. Poca variación en el menú pero excelente ejecución.', img: 'img/rudy.png', rank: '#3', tagClass: 'tag-dark' },
        { id: 'garage', name: 'Garage Burger', type: 'Smash Burger • Personalizable', price: '$$$', desc: 'Perfeccionista en toppings y variedad. Carne smasheada con sabor original.', img: 'img/garaje burguer.png', rank: '#2', tagClass: 'tag-orange' },
        { id: 'tbv', name: 'The Burger Vilas', type: 'Smash Burger • Promociones', price: '$', desc: 'La ganadora indiscutible. Carne con sabor increíble, precios accesibles y muchas promociones.', img: 'img/tbv.png', rank: '#1 GANADOR', tagClass: 'tag-red' }
    ],
    pizzas: [
        { id: 'venecia', name: 'Pizzería Venecia', type: 'Italiana • Horno a Leña', price: '$$', desc: 'Masa madre con 48hs de fermentación. Ingredientes importados de Italia.', img: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', rank: '#3', tagClass: 'tag-dark' },
        { id: 'napoles', name: 'Napolis Street', type: 'Napolitana • Gourmet', price: '$$$', desc: 'La auténtica pizza napolitana en Montevideo. Bordes aireados y centro tierno.', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', rank: '#2', tagClass: 'tag-orange' },
        { id: 'pizzaiolo', name: 'Il Pizzaiolo', type: 'Fina • Tradicional', price: '$', desc: 'El secreto mejor guardado. Pizza a la pala con el crunch perfecto.', img: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', rank: '#1 GANADOR', tagClass: 'tag-red' }
    ],
    sushi: [
        { id: 'naru', name: 'Naru Sushi', type: 'Autor • Fusión', price: '$$$', desc: 'Combinaciones audaces y pescado fresco del día. Una explosión de sabor.', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', rank: '#3', tagClass: 'tag-dark' },
        { id: 'kyoto', name: 'Kyoto Home', type: 'Tradicional • Minimalista', price: '$$', desc: 'Respeto total por la tradición japonesa. Cortes perfectos y arroz impecable.', img: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', rank: '#2', tagClass: 'tag-orange' },
        { id: 'sumo', name: 'Sushi Sumo', type: 'Express • Popular', price: '$', desc: 'Rápido, fresco y accesible. La mejor opción para el delivery semanal.', img: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', rank: '#1 GANADOR', tagClass: 'tag-red' }
    ],
    bars: [
        { id: 'mandrake', name: 'Mandrake Bar', type: 'Coctelería • Speakeasy', price: '$$$', desc: 'Tragos de autor en un ambiente misterioso. Los mejores bartenders de la ciudad.', img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', rank: '#3', tagClass: 'tag-dark' },
        { id: 'tapioca', name: 'Tapioca Pub', type: 'Cervecería • Rock', price: '$', desc: 'Cerveza artesanal bien fría y la mejor selección de clásicos del rock.', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', rank: '#2', tagClass: 'tag-orange' },
        { id: 'negro', name: 'Negro & Plata', type: 'Lounge • Chill Out', price: '$$', desc: 'El lugar perfecto para el after office con vista a la ciudad.', img: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', rank: '#1 GANADOR', tagClass: 'tag-red' }
    ]
};

const RatingSystem = {
    STORAGE_KEY: 'rateflow_rankings_v3',
    currentCategory: 'burgers',
    ratings: {},

    init() {
        this.loadRatings();
        const urlParams = new URLSearchParams(window.location.search);
        const cat = urlParams.get('cat') || 'burgers';

        // If we are on tema.html, handle initial view
        if (document.getElementById('category-selection')) {
            // Check if a category was previously selected or passed in URL
            if (urlParams.get('cat')) {
                this.showRanking(urlParams.get('cat'));
            }
        }

        debug('Rating System Initialized');
    },

    getCategoryForItem(itemId) {
        for (const cat in RankingData) {
            if (RankingData[cat].some(item => item.id === itemId)) return cat;
        }
        return 'burgers'; // Fallback
    },

    loadRatings() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        this.ratings = data ? JSON.parse(data) : {};

        Object.keys(RankingData).forEach(cat => {
            if (!this.ratings[cat]) {
                this.ratings[cat] = {};
            }
            RankingData[cat].forEach(item => {
                if (!this.ratings[cat][item.id]) {
                    this.ratings[cat][item.id] = { totalStars: 0, totalVotes: 0 };
                }
            });
        });
    },

    saveRatingsData() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.ratings));
    },

    showRanking(category) {
        if (!RankingData[category]) return;
        this.currentCategory = category;

        const selectionView = document.getElementById('category-selection');
        const rankingView = document.getElementById('ranking-view');
        if (!selectionView || !rankingView) return;

        selectionView.style.display = 'none';
        rankingView.style.display = 'block';

        const titles = { burgers: 'Top Hamburguesas', pizzas: 'Top Pizzas', sushi: 'Top Sushi', bars: 'Top Bares' };
        document.getElementById('ranking-hero-title').textContent = titles[category] || 'Rankings del Mes';

        this.renderRankings(category);
        this.sortRankings(category);

        window.scrollTo({ top: 350, behavior: 'smooth' });
    },

    hideRanking() {
        const selectionView = document.getElementById('category-selection');
        const rankingView = document.getElementById('ranking-view');
        if (selectionView && rankingView) {
            selectionView.style.display = 'block';
            rankingView.style.display = 'none';
            document.getElementById('ranking-hero-title').textContent = 'Rankings del Mes';
        }
    },

    renderRankings(category) {
        const container = document.getElementById('burgers-container');
        if (!container) return;

        // Clone and sort items to avoid mutating original data and ensure "Best to Worst"
        const items = [...RankingData[category]].sort((a, b) => {
            return parseFloat(this.calculateAverage(category, b.id)) - parseFloat(this.calculateAverage(category, a.id));
        });

        container.innerHTML = '';

        items.forEach((item, index) => {
            const avg = this.calculateAverage(category, item.id);
            const votes = this.ratings[category][item.id].totalVotes;
            const colorClass = this.getRatingColorClass(avg);

            // Adjust rank display if it was hardcoded (logic for #1, #2, #3 based on sorted index)
            const displayRank = index === 0 ? '#1 GANADOR' : `#${index + 1}`;
            const displayTagClass = index === 0 ? 'tag-red' : (index === 1 ? 'tag-orange' : 'tag-dark');

            const article = document.createElement('article');
            article.className = `card premium-card ranking-item`;
            article.setAttribute('data-id', item.id);
            article.onclick = (e) => {
                // Prevent selection if clicking a link or a star
                if (e.target.closest('a') || e.target.closest('.stars')) return;
                this.selectVenue(item.id);
            };

            article.innerHTML = `
                <div class="card-image" style="background-image: url('${item.img}'); background-size: cover; background-position: center; background-color: #000;">
                    <div class="card-tags">
                        <span class="${displayTagClass}">${displayRank}</span>
                    </div>
                </div>
                <div class="card-info" style="flex: 1; display: flex; flex-direction: column;">
                    <div class="card-header-row">
                        <h3 class="venue-name"><a href="local.html?id=${item.id}" style="color: inherit; text-decoration: none;">${item.name}</a></h3>
                        <div class="rating-container">
                            <div class="stars" data-category="${category}" data-id="${item.id}">
                                <span class="star" data-value="1">☆</span>
                                <span class="star" data-value="2">☆</span>
                                <span class="star" data-value="3">☆</span>
                                <span class="star" data-value="4">☆</span>
                                <span class="star" data-value="5">☆</span>
                            </div>
                            <div class="rating-info" style="font-size: 0.8rem; color: #888;">
                                <span class="average-rating ${colorClass}">${avg}</span>
                                <span class="vote-count">(${votes} votos)</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-meta-row">
                        <span class="venue-type">${item.type}</span>
                        <span class="price">${item.price}</span>
                    </div>
                    <p class="burger-description">${item.desc}</p>
                    <div style="margin-top: auto; padding-top: 1rem;">
                        <a href="local.html?id=${item.id}" class="btn-search pill" style="text-decoration: none; display: block; text-align: center;">Ver Detalles</a>
                    </div>
                </div>
            `;
            container.appendChild(article);
        });

        this.setupStarListeners();
        this.updateReviewSelect(category);
        this.updateAllStars(category);

        // Contextual reviews prompt
        const communityList = document.getElementById('community-reviews-list');
        if (communityList) {
            communityList.innerHTML = `<div style="text-align:center; padding:3rem; color:#666; font-style:italic;">
                <i class="fa-solid fa-arrow-up" style="display:block; font-size:2rem; margin-bottom:1rem;"></i>
                Toca un local arriba para ver sus comentarios
            </div>`;
        }
    },

    selectVenue(venueId) {
        // Remove existing selection
        document.querySelectorAll('.ranking-item').forEach(item => item.classList.remove('selected'));

        // Highlight logic
        const selectedCard = document.querySelector(`.ranking-item[data-id="${venueId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }

        // Show reviews
        CommunitySystem.renderReviews(venueId);

        // Scroll to community section
        const communitySection = document.getElementById('community-section') || document.getElementById('burgers-community');
        if (communitySection) {
            communitySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },

    updateReviewSelect(category) {
        const select = document.getElementById('review-burger-select');
        if (!select) return;
        select.innerHTML = '';
        RankingData[category].forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.id;
            opt.textContent = item.name;
            select.appendChild(opt);
        });
    },

    setupStarListeners() {
        const starContainers = document.querySelectorAll('.stars');
        starContainers.forEach(container => {
            const cat = container.getAttribute('data-category');
            const id = container.getAttribute('data-id');
            const stars = container.querySelectorAll('.star');

            stars.forEach(star => {
                star.onmouseenter = () => this.highlightStars(container, star.dataset.value);
                star.onclick = () => {
                    if (!AuthManager.isLoggedIn()) { window.location.href = 'login.html'; return; }
                    this.addVote(cat, id, parseInt(star.dataset.value));
                };
            });
            container.onmouseleave = () => this.updateStarsDisplay(container, cat, id);
        });
    },

    highlightStars(container, value) {
        container.querySelectorAll('.star').forEach(s => {
            s.classList.toggle('hover', s.dataset.value <= value);
        });
    },

    addVote(category, itemId, value) {
        const user = AuthManager.getCurrentUser();
        if (user.votes && user.votes.some(v => v.itemId === itemId && v.category === category)) {
            alert('Ya has votado en esta categoría para este local.');
            return;
        }

        this.ratings[category][itemId].totalStars += value;
        this.ratings[category][itemId].totalVotes += 1;

        if (!user.votes) user.votes = [];
        user.votes.push({ category, itemId, value, date: new Date().toISOString() });
        AuthManager.saveUser(user);

        this.saveRatingsData();
        this.renderRankings(category);
        this.sortRankings(category);

        NotificationSystem.showToast({
            title: '¡Voto registrado!',
            message: `Calificaste este local con ${value} estrellas.`,
            icon: 'fa-star',
            type: 'success'
        });
    },

    calculateAverage(category, itemId) {
        if (!this.ratings[category] || !this.ratings[category][itemId]) return "0.0";
        const item = this.ratings[category][itemId];
        if (item.totalVotes === 0) return "0.0";
        return (item.totalStars / item.totalVotes).toFixed(1);
    },

    getRatingColorClass(avg) {
        const val = parseFloat(avg);
        if (val === 0) return '';
        if (val <= 2) return 'rating-low';
        if (val <= 4) return 'rating-medium';
        return 'rating-high';
    },

    updateStarsDisplay(container, category, itemId) {
        const avg = Math.round(parseFloat(this.calculateAverage(category, itemId)));
        container.querySelectorAll('.star').forEach(s => {
            s.classList.toggle('filled', s.dataset.value <= avg);
            s.classList.remove('hover');
        });
    },

    updateAllStars(category) {
        const starContainers = document.querySelectorAll('.stars');
        starContainers.forEach(container => {
            const id = container.getAttribute('data-id');
            if (id) this.updateStarsDisplay(container, category, id);
        });
    },

    sortRankings(category) {
        const container = document.getElementById('burgers-container');
        if (!container) return;

        const items = Array.from(container.querySelectorAll('.ranking-item'));
        items.sort((a, b) => {
            const idA = a.getAttribute('data-id');
            const idB = b.getAttribute('data-id');
            return parseFloat(this.calculateAverage(category, idB)) - parseFloat(this.calculateAverage(category, idA));
        });

        items.forEach(item => container.appendChild(item));
    }
};

// ===========================
// SISTEMA DE RECOMENDACIONES (PERSONALIZADO + GEOLOCALIZACIÓN)
// ===========================

const RecommendedData = [
    {
        name: "Café Negro",
        type: "Cafetería • $$",
        lat: -34.9123, lng: -56.1645, // Pocitos
        rating: 4.5,
        imgColor: "#333",
        isPro: true
    },
    {
        name: "Trattoria Roma",
        type: "Italiana • $$$",
        lat: -34.9012, lng: -56.1890, // Centro
        rating: 4.6,
        imgColor: "#444",
        isPro: true
    },
    {
        name: "Burger Joint",
        type: "Americana • $",
        lat: -34.9156, lng: -56.1587, // Punta Carretas
        rating: 4.2,
        imgColor: "#222",
        isPro: false
    },
    {
        name: "Taquería El Primo",
        type: "Mexicana • $",
        lat: -34.9088, lng: -56.1723, // Cordón
        rating: 4.4,
        imgColor: "#111",
        isPro: false
    }
];

const GeolocationManager = {
    // Coordenadas por defecto (Montevideo Centro)
    defaultCoords: { lat: -34.9056, lng: -56.1916 },
    userCoords: null,

    init() {
        this.getCurrentLocation().catch(() => debug('Geo-location silent check failed'));
    },

    getCurrentLocation() {
        if (this.userCoords) return Promise.resolve(this.userCoords);

        return new Promise((resolve) => {
            if (!("geolocation" in navigator)) {
                this.userCoords = this.defaultCoords;
                resolve(this.defaultCoords);
            } else {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.userCoords = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        resolve(this.userCoords);
                    },
                    (error) => {
                        console.warn('Geolocation failed:', error.message);
                        this.userCoords = this.defaultCoords;
                        resolve(this.defaultCoords);
                    },
                    { enableHighAccuracy: true, timeout: 5000 }
                );
            }
        });
    },

    calculateDistance(lat1, lon1, lat2, lon2) {
        if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
        const R = 6371; // Radio de la Tierra en km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    },

    formatDistance(km) {
        if (km < 1) return `${Math.round(km * 1000)}m`;
        return `${km.toFixed(1)}km`;
    }
};

const RecommendationSystem = {
    init() {
        const container = document.getElementById('recommendations-grid');
        if (!container) return;

        GeolocationManager.getCurrentLocation().then(coords => {
            this.render(container, coords);
        });
    },

    render(container, userCoords) {
        const user = AuthManager.getCurrentUser();
        const titleElement = document.getElementById('recommendation-title');

        if (user && titleElement) {
            titleElement.textContent = `Recomendados para ${user.nombre}`;
            titleElement.classList.add('highlight-text');
        } else if (titleElement) {
            titleElement.textContent = "Recomendados para ti";
        }

        container.innerHTML = '';

        // Calcular distancias y añadir propiedades de orden dinámico
        const venuesWithDistance = RecommendedData.map(item => {
            const distance = GeolocationManager.calculateDistance(
                userCoords.lat, userCoords.lng,
                item.lat, item.lng
            );
            return { ...item, distanceKm: distance };
        });

        // Ordenar por cercanía
        venuesWithDistance.sort((a, b) => a.distanceKm - b.distanceKm);

        venuesWithDistance.forEach(item => {
            const card = document.createElement('article');
            card.className = 'card local-card';

            card.innerHTML = `
              <div class="card-image small-img" style="background-color: ${item.imgColor};">
                ${item.isPro ? '<span class="micro-tag">PRO</span>' : ''}
              </div>
              <div class="card-mini-info">
                <div class="mini-header">
                  <h4>${item.name}</h4>
                  <span class="star-text"><i class="fa-solid fa-star ${item.rating >= 4.5 ? 'text-orange' : ''}"></i> ${item.rating}</span>
                </div>
                <p class="mini-type">${item.type}</p>
                <p class="mini-loc"><i class="fa-solid fa-location-arrow"></i> a ${GeolocationManager.formatDistance(item.distanceKm)}</p>
              </div>
            `;

            container.appendChild(card);
        });
    }
};

// ===========================
// SEARCH SYSTEM
// ===========================
const SearchSystem = {
    init() {
        const input = document.getElementById('global-search-input');
        const resultsContainer = document.getElementById('global-search-results');

        if (!input || !resultsContainer) return;

        // Event Listeners
        input.addEventListener('input', (e) => this.handleSearch(e.target.value));
        input.addEventListener('focus', (e) => this.handleSearch(e.target.value));

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !resultsContainer.contains(e.target)) {
                resultsContainer.classList.remove('active');
            }
        });
    },

    async handleSearch(query) {
        const resultsContainer = document.getElementById('global-search-results');
        const searchTerm = query.toLowerCase().trim();

        if (searchTerm.length < 2) {
            resultsContainer.classList.remove('active');
            return;
        }

        // Ensure we have location
        const userLoc = await GeolocationManager.getCurrentLocation();

        // Build results
        let results = [];

        // 1. Search in VenueData
        Object.keys(VenueData).forEach(key => {
            const venue = VenueData[key];
            const matchName = venue.name.toLowerCase().includes(searchTerm);
            const matchTag = venue.tags && venue.tags.some(t => t.toLowerCase().includes(searchTerm));
            const matchDesc = venue.style.toLowerCase().includes(searchTerm);

            if (matchName || matchTag || matchDesc) {
                const dist = GeolocationManager.calculateDistance(
                    userLoc.lat, userLoc.lng,
                    venue.coordinates.lat, venue.coordinates.lng
                );
                results.push({
                    type: 'venue',
                    data: venue,
                    id: key,
                    score: matchName ? 10 : (matchTag ? 5 : 1),
                    distance: dist
                });
            }
        });

        // Sort: Score DESC, then Distance ASC
        results.sort((a, b) => {
            if (a.score !== b.score) return b.score - a.score;
            return a.distance - b.distance;
        });

        this.renderResults(results, resultsContainer);
    },

    renderResults(results, container) {
        container.innerHTML = '';
        container.classList.add('active');

        if (results.length === 0) {
            container.innerHTML = '<div class="no-results">No encontramos nada con ese flow... 🍔</div>';
            return;
        }

        results.slice(0, 5).forEach(res => {
            const item = res.data;
            const el = document.createElement('div');
            el.className = 'search-result-item';
            el.onclick = () => window.location.href = `local.html?id=${res.id}`;

            el.innerHTML = `
                <img src="${item.logo}" class="search-result-thumb">
                <div class="search-result-info">
                    <span class="search-result-name">${item.name}</span>
                    <div class="search-result-meta">
                        <span>${item.style}</span>
                        <span class="distance-badge"><i class="fa-solid fa-location-dot"></i> ${GeolocationManager.formatDistance(res.distance)}</span>
                    </div>
                </div>
            `;
            container.appendChild(el);
        });

        if (results.length > 5) {
            const more = document.createElement('div');
            more.style.padding = '10px';
            more.style.textAlign = 'center';
            more.style.fontSize = '0.8rem';
            more.style.color = '#888';
            more.textContent = `Ver ${results.length - 5} resultados más...`;
            container.appendChild(more);
        }
    }
};


// Exponer función de reset en consola para debugging
window.resetBurgerVotes = () => RatingSystem.resetAllVotes();


// ===========================
// INTERACCIÓN SLIDER Y RESEÑAS
// ===========================

const SliderInteraction = {
    init() {
        const burgers = document.querySelectorAll('.burger-item');
        const reviewTitle = document.getElementById('review-title');
        const reviewContent = document.getElementById('review-content');

        if (!burgers.length || !reviewTitle || !reviewContent) return;

        burgers.forEach(burger => {
            burger.addEventListener('click', (e) => {
                // Evitar conflicto si se clickea en las estrellas de votación
                if (e.target.closest('.stars')) return;

                // Remover clase active de todos
                burgers.forEach(b => b.classList.remove('active'));

                // Agregar a este
                burger.classList.add('active');

                // Obtener datos
                const title = burger.querySelector('h3 a').innerText;
                const reviewText = burger.querySelector('p.just').innerText; // El texto oculto

                // Actualizar display con animación simple fade
                const displayArea = document.getElementById('review-display-area');
                displayArea.style.opacity = '0';

                setTimeout(() => {
                    reviewTitle.innerText = title;
                    reviewContent.innerText = reviewText;
                    displayArea.style.opacity = '1';
                }, 200);

                // Scroll suave hacia la reseña en móvil si es necesario
                if (window.innerWidth < 768) {
                    displayArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        });
    }
};

// ===========================
// EFECTO PARTÍCULAS (BUTTON EXPLOSION)
// ===========================

const ParticleEffect = {
    init() {
        // La inicialización ya no necesita un listener de click directo
        // porque la explosión se llama desde validarFormulario si es exitoso.
        const btn = document.getElementById('btn-enviar');
        if (!btn) return;
    },

    createExplosion(x, y) {
        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            this.createParticle(x, y);
        }
    },

    createParticle(x, y) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        document.body.appendChild(particle);

        // Color aleatorio (Solo rojo como solicitado)
        const colors = ['#E30613'];
        const color = colors[0];
        particle.style.background = color;

        // Tamaño aleatorio
        const size = Math.random() * 5 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Posición inicial
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        // Velocidad y Dirección aleatoria
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 100 + 50; // Distancia de viaje

        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        // Animación usando Web Animations API
        const animation = particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ], {
            duration: Math.random() * 600 + 400,
            easing: 'cubic-bezier(0, .9, .57, 1)',
        });

        animation.onfinish = () => {
            particle.remove();
        };
    }
};

// ===========================
// RESERVATION SYSTEM
// ===========================
const ReservationSystem = {
    currentStep: 1,
    modal: null,
    formData: {
        date: '',
        time: '',
        people: 4,
        notes: ''
    },

    init() {
        this.modal = document.getElementById('reservation-modal');
        if (!this.modal) return;

        // Close events
        const closeBtn = document.getElementById('close-reservation-btn');
        if (closeBtn) closeBtn.onclick = () => this.closeModal();

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        // Initialize date input min to today
        const dateInput = document.getElementById('res-date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }
    },

    openModal(venueId) {
        if (!this.modal) return;

        // Reset state
        this.currentStep = 1;
        this.showStep(1);

        // Load Venue Info
        const venue = VenueData[venueId] || VenueData['rudy'];
        const nameEl = document.getElementById('res-venue-name');
        if (nameEl) nameEl.textContent = venue.name;

        // Populate summary prematurely (placeholder)
        const venueSum = document.getElementById('conf-venue');
        if (venueSum) venueSum.textContent = venue.name;

        this.modal.classList.add('active');
    },

    closeModal() {
        if (!this.modal) return;
        this.modal.classList.remove('active');
    },

    setPeople(count) {
        this.formData.people = count;
        document.getElementById('res-people').value = count;

        // UI Update
        document.querySelectorAll('.people-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.textContent) === count || (count === 6 && btn.textContent === '6+')) {
                btn.classList.add('active');
            }
        });
    },

    nextStep() {
        if (this.currentStep === 1) {
            // Validate Step 1
            const date = document.getElementById('res-date').value;
            const time = document.getElementById('res-time').value;

            if (!date || !time) {
                alert('Por favor selecciona fecha y hora.');
                return;
            }

            this.formData.date = date;
            this.formData.time = time;

            // Update Summary
            document.getElementById('conf-date').textContent = date;
            document.getElementById('conf-time').textContent = time;
            document.getElementById('conf-people').textContent = this.formData.people + ' personas';
        }

        this.currentStep++;
        this.showStep(this.currentStep);
    },

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep(this.currentStep);
        }
    },

    showStep(step) {
        document.querySelectorAll('.res-step').forEach(el => el.classList.remove('active'));
        const target = document.getElementById(`res-step-${step}`);
        if (target) target.classList.add('active');
    },

    confirm() {
        const notes = document.getElementById('res-notes').value;
        this.formData.notes = notes;

        // Simulate API verification
        const btn = document.querySelector('#res-step-2 .btn-primary-gradient');
        const originalText = btn.textContent;
        btn.textContent = 'Confirmando...';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;

            // Success
            this.nextStep(); // Go to step 3 (Success)

            // Notification
            if (typeof NotificationSystem !== 'undefined') {
                NotificationSystem.showToast({
                    title: 'Reserva Confirmada',
                    message: '¡Tu mesa te espera! Revisa tu correo.',
                    icon: 'fa-calendar-check',
                    type: 'success'
                });
            }
        }, 1500);
    }
};

// ===========================
// PROFILE SYSTEM
// ===========================
const ProfileSystem = {
    init() {
        const grid = document.getElementById('profile-reviews-grid');
        if (!grid) return;

        const user = AuthManager.getCurrentUser();
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        this.renderStats(user);
        this.renderReviews();
        this.setupTabs();
        this.renderReviews();
        this.setupTabs();
        this.setupEditProfile();
        this.setupShare();

        debug('Profile System inicializado');
    },

    renderStats(user) {
        if (document.getElementById('prof-name')) document.getElementById('prof-name').textContent = user.nombre;
        if (document.getElementById('prof-handle')) document.getElementById('prof-handle').textContent = `@${user.nombre.toLowerCase().replace(/\s/g, '')}`;

        const avatarUrl = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nombre)}&background=111&color=fff&size=200`;
        if (document.getElementById('prof-avatar-img')) document.getElementById('prof-avatar-img').src = avatarUrl;

        const reviewCount = user.votes ? user.votes.length : 0;
        if (document.getElementById('prof-review-count')) document.getElementById('prof-review-count').textContent = reviewCount;

        // Social Stats
        const followingCount = user.following ? user.following.length : 0;
        // Mock followers count for demo + 1 if someone follows (not implemented fully bidirectional yet)
        const followersCount = Math.floor(reviewCount * 1.5) + (user.id === 'admin_root' ? 120 : 0);

        if (document.getElementById('prof-following-count')) document.getElementById('prof-following-count').textContent = followingCount;
        if (document.getElementById('prof-followers-count')) document.getElementById('prof-followers-count').textContent = followersCount;

        // Community Badge logic
        const badge = AuthManager.getCommunityBadge(reviewCount);
        const levelElem = document.getElementById('prof-level');
        if (levelElem) {
            levelElem.innerHTML = `<span style="color:${badge.color}">${badge.icon} ${badge.name}</span>`;
            levelElem.title = `Nivel basado en tus ${reviewCount} reseñas reales`;
        }

        // Progress bar and Hint
        const progressFill = document.getElementById('prof-progress-bar');
        const nextHint = document.querySelector('.evolution-next-hint');
        if (progressFill && nextHint) {
            // Apply rank color to progress bar background
            progressFill.style.background = `linear-gradient(90deg, ${badge.color}, #fff)`;
            progressFill.style.boxShadow = `0 0 15px ${badge.color}`;

            if (badge.next) {
                const prevThreshold = badge.threshold;
                const progress = ((reviewCount - prevThreshold) / (badge.next - prevThreshold)) * 100;
                progressFill.style.width = `${Math.max(5, progress)}%`;

                const remaining = badge.next - reviewCount;
                const nextBadge = AuthManager.getCommunityBadge(badge.next);
                nextHint.innerHTML = `Te faltan <span style="color:white;font-weight:700;">${remaining} reseñas</span> para alcanzar el rango <span style="color:${nextBadge.color}">${nextBadge.icon} <strong>${nextBadge.name}</strong></span>.`;
            } else {
                progressFill.style.width = '100%';
                nextHint.innerHTML = `¡Has alcanzado la <span style="color:var(--primary-red);font-weight:800;">Trascendencia Total</span>! Eres el origen del flow.`;
            }
        }
    },

    getLowerThreshold(count) {
        // Thresholds are now derived from the badge.threshold property returned by AuthManager.getCommunityBadge
        return 0;
    },

    setupEditProfile() {
        const editBtn = document.getElementById('edit-profile-btn');
        const modal = document.getElementById('edit-profile-modal');
        const closeBtn = document.getElementById('close-modal-btn');
        const form = document.getElementById('edit-profile-form');

        if (!editBtn || !modal) return;

        const user = AuthManager.getCurrentUser();

        editBtn.addEventListener('click', () => {
            document.getElementById('edit-name').value = user.nombre;
            // Clear file input on open
            document.getElementById('edit-avatar').value = '';
            modal.classList.add('active');
        });

        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const newName = document.getElementById('edit-name').value;
            const avatarFile = document.getElementById('edit-avatar').files[0];

            const saveProfile = (avatarData = null) => {
                user.nombre = newName;
                if (avatarData) {
                    user.avatar = avatarData;
                }

                AuthManager.saveUser(user);
                this.renderStats(user);
                AuthManager.updateNavigation();
                modal.classList.remove('active');

                if (typeof NotificationSystem !== 'undefined') {
                    NotificationSystem.showToast({
                        title: 'Perfil Actualizado',
                        message: 'Tus cambios han sido guardados con éxito.',
                        icon: 'fa-user-check',
                        type: 'success'
                    });
                }
            };

            if (avatarFile) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    saveProfile(event.target.result);
                };
                reader.readAsDataURL(avatarFile);
            } else {
                saveProfile(user.avatar); // Keep existing or default
            }
        });
    },

    setupShare() {
        const shareBtn = document.getElementById('share-profile-btn');
        if (!shareBtn) return;

        shareBtn.addEventListener('click', async () => {
            const user = AuthManager.getCurrentUser();
            const shareData = {
                title: `Perfil de ${user.nombre} en RateFlow`,
                text: `¡Mira el perfil gastronómico de ${user.nombre} en RateFlow!`,
                url: window.location.href
            };

            // Mobile / Native Share
            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    console.error('Error sharing', err);
                }
            } else {
                // Desktop Fallback Modal
                this.openShareModal(shareData);
            }
        });
    },

    openShareModal(data) {
        // Create modal if not exists
        let modal = document.getElementById('share-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'share-modal';
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-container premium-modal" style="max-width: 400px; text-align:center;">
                    <button class="close-modal-btn" id="close-share-modal"><i class="fa-solid fa-xmark"></i></button>
                    <div class="modal-header" style="justify-content:center;">
                        <h3>Compartir Perfil</h3>
                    </div>
                    <div class="modal-body" style="display:flex; justify-content:center; gap:1.5rem; margin:2rem 0;">
                        <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(data.text)}&url=${encodeURIComponent(data.url)}" target="_blank" class="social-share-btn twitter" style="width:50px; height:50px; background:#1DA1F2; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:1.2rem; transition:transform 0.2s;"><i class="fa-brands fa-twitter"></i></a>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}" target="_blank" class="social-share-btn facebook" style="width:50px; height:50px; background:#1877F2; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:1.2rem; transition:transform 0.2s;"><i class="fa-brands fa-facebook-f"></i></a>
                        <a href="https://wa.me/?text=${encodeURIComponent(data.text + ' ' + data.url)}" target="_blank" class="social-share-btn whatsapp" style="width:50px; height:50px; background:#25D366; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:1.2rem; transition:transform 0.2s;"><i class="fa-brands fa-whatsapp"></i></a>
                        <button id="copy-link-btn" style="width:50px; height:50px; background:#333; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:1.2rem; border:none; cursor:pointer;"><i class="fa-solid fa-link"></i></button>
                    </div>
                    <p style="font-size:0.8rem; color:#888;">Comparte tu perfil con tus amigos.</p>
                </div>
            `;
            document.body.appendChild(modal);

            // Close logic
            modal.querySelector('#close-share-modal').onclick = () => modal.classList.remove('active');
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('active');
            });

            // Copy Link logic
            modal.querySelector('#copy-link-btn').onclick = () => {
                navigator.clipboard.writeText(data.url);
                NotificationSystem.showToast({
                    title: 'Enlace Copiado',
                    message: 'El enlace al perfil ha sido copiado al portapapeles.',
                    icon: 'fa-link',
                    type: 'success'
                });
                modal.classList.remove('active');
            };
        }

        modal.classList.add('active');
    },



    renderReviews() {
        const grid = document.getElementById('profile-reviews-grid');
        if (!grid) return;

        const user = AuthManager.getCurrentUser();
        // Get all real reviews and filter for this user
        const allReviews = CommunitySystem.getReviews();
        const userReviews = allReviews.filter(r => r.userName === user.nombre);

        grid.innerHTML = '';

        if (userReviews.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align:center; padding:80px; background:rgba(255,255,255,0.02); border-radius:20px; border:1px dashed rgba(255,255,255,0.1);">
                    <div style="font-size:3rem; margin-bottom:1rem; opacity:0.3;">✍️</div>
                    <h3 style="color:white; margin-bottom:0.5rem;">Aún no has escrito reseñas</h3>
                    <p style="color:#888;">Tus opiniones aparecerán aquí para que otros vean tu recorrido gastronómico.</p>
                </div>
            `;
            return;
        }

        userReviews.forEach(r => {
            const venue = VenueData[r.burger] || { name: r.burger, logo: 'img/default-venue.png' };
            const card = document.createElement('article');
            card.className = 'rcp-card';
            card.innerHTML = `
                <div class="rcp-img-area" style="background-image: url('${venue.logo || venue.banner}')">
                    <div class="rcp-badge-rating">Real</div>
                    <div class="rcp-cat-tag">
                        <i class="fa-solid fa-star"></i> RESEÑA
                    </div>
                </div>
                <div class="rcp-body">
                    <div class="rcp-title-row">
                        <span class="rcp-name">${venue.name}</span>
                        <span class="rcp-meta">${r.date}</span>
                    </div>
                    <p class="rcp-desc">${r.text}</p>
                </div>
            `;
            grid.appendChild(card);
        });
    },

    setupTabs() {
        const tabs = document.querySelectorAll('.profile-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // UI Toggle
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Toggle Content
                const reviewsContent = document.getElementById('tab-reviews');
                const achievementsContent = document.getElementById('tab-achievements');

                // Hide all
                if (reviewsContent) reviewsContent.style.display = 'none';
                if (achievementsContent) achievementsContent.style.display = 'none';

                // Show selected
                if (tab.dataset.tab === 'reviews') {
                    if (reviewsContent) reviewsContent.style.display = 'block';
                    this.renderReviews();
                } else if (tab.dataset.tab === 'achievements') {
                    if (achievementsContent) achievementsContent.style.display = 'block';
                    if (typeof GamificationSystem !== 'undefined') {
                        const container = document.getElementById('badges-container');
                        if (container) GamificationSystem.renderBadges(container);
                    }
                } else {
                    // Fallback for demo tabs (Photos, Lists, Info) - Show message in Reviews container for now
                    if (reviewsContent) {
                        reviewsContent.style.display = 'block';
                        const grid = document.getElementById('profile-reviews-grid');
                        if (grid) grid.innerHTML = `<div style="text-align:center; padding:100px; color:#555;">La sección ${tab.textContent} estará disponible pronto.</div>`;
                    }
                }
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    SliderInteraction.init();
    ParticleEffect.init();
    AuthManager.init();
    GamificationSystem.init();
    CommunitySystem.init();
    B2BSystem.init();
    NotificationSystem.init();
    VenueDetailSystem.init();
    ProfileSystem.init();
    RatingSystem.init();
    GeolocationManager.init();
    SearchSystem.init();
    RecommendationSystem.init();
    ReservationSystem.init();
    CouponSystem.init();
    WalletSystem.init();
    SocialSystem.init();
    if (window.location.pathname.includes('admin.html')) {
        AdminSystem.init();
    }
});




// ===========================
// GAMIFICATION SYSTEM (Badges)
// (Implementation moved to end of file to support AchievementsData)
// ===========================

// ===========================
// COMMUNITY HUB SYSTEM
// ===========================
const CommunitySystem = {
    STORAGE_KEY: 'burguertop_reviews',
    VOTES_KEY: 'burguertop_helpful_votes',

    init() {
        const listContainer = document.getElementById('community-reviews-list');

        // Initial setup for interactive stars in review form
        this.setupInteractiveStars();

        if (!listContainer) return;

        // Check if we are on a venue page
        const initParams = new URLSearchParams(window.location.search);
        const venueId = initParams.get('id');

        this.renderReviews(venueId);
    },

    setupInteractiveStars() {
        const matrixItems = document.querySelectorAll('.matrix-item');
        matrixItems.forEach(item => {
            const stars = item.querySelectorAll('.fa-star');
            const metric = item.dataset.metric;

            stars.forEach(star => {
                star.addEventListener('click', () => {
                    const value = parseInt(star.dataset.value);
                    item.dataset.value = value; // Store current value on parent

                    // Update visual state
                    stars.forEach(s => {
                        const sVal = parseInt(s.dataset.value);
                        if (sVal <= value) {
                            s.classList.add('active');
                        } else {
                            s.classList.remove('active');
                        }
                    });
                });
            });
        });
    },


    listenForReviews(venueId, callback) {
        if (!venueId) return;

        // GunDB Subscription
        db.get('venues').get(venueId).get('reviews').map().on((review, id) => {
            if (review) {
                callback(review, id);
            }
        });
    },

    getReviews() {
        // Legacy/Fallback: Still need for synchronous calls elsewhere? 
        // Ideally we refactor everything, but for compatibility we return empty 
        // or cached list. For now, let's read from localStorage as a 'backup'
        // OR better: we can't synchronously return Gun data.
        // We will modify callers to expect async or we rely on UI updates only.
        return [];
    },

    postReview() {
        if (!AuthManager.isLoggedIn()) {
            alert('Debes iniciar sesión para publicar una reseña.');
            window.location.href = 'login.html';
            return;
        }

        const text = document.getElementById('community-review-input').value.trim();
        const user = AuthManager.getCurrentUser();

        // Get ratings from matrix
        const ratings = {};
        document.querySelectorAll('.matrix-item').forEach(item => {
            ratings[item.dataset.metric] = parseInt(item.dataset.value) || 5; // Default 5 if not clicked
        });

        // Calculate average for display
        const avg = Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length;

        // Get burger ID: from select or from URL params if on local page
        const reviewParams = new URLSearchParams(window.location.search);
        let burger = reviewParams.get('id') || 'rudy';

        if (!text) {
            alert('Por favor escribe algo en tu reseña.');
            return;
        }

        const newReview = {
            id: Date.now().toString(),
            userName: user.nombre,
            text: text,
            burger: burger,
            date: 'Recién publicado',
            helpful: 0,
            avgRating: avg.toFixed(1),
            subRatings: ratings,
            isVerified: (user.votes && user.votes.length >= 3)
        };

        // Publish to GunDB (P2P)
        const reviewNode = db.get('venues').get(burger).get('reviews').set(newReview);

        // Also save to global stream for Activity Feed
        db.get('global_feed').set({
            type: 'review',
            data: newReview,
            timestamp: Date.now()
        });

        // Backup to LocalStorage (Hybrid)
        const saved = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
        saved.unshift(newReview);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(saved));

        // Connect to RatingSystem and AuthManager
        const category = RatingSystem.getCategoryForItem(burger);
        RatingSystem.addVote(category, burger, Math.round(avg));

        if (!user.votes) user.votes = [];
        user.votes.push({ id: burger, rating: avg.toFixed(1) });
        AuthManager.saveUser(user);

        // Clear form
        document.getElementById('community-review-input').value = '';
        document.querySelectorAll('.matrix-stars .fa-star').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.matrix-item').forEach(i => i.dataset.value = '');

        // Update UI
        this.renderReviews(burger);
        if (typeof VenueDetailSystem !== 'undefined') VenueDetailSystem.renderLocal(burger);
        if (typeof ProfileSystem !== 'undefined') ProfileSystem.renderStats(user);
        if (typeof GamificationSystem !== 'undefined') GamificationSystem.checkAchievements(user);

        if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.showToast({
                title: 'Reseña publicada',
                message: '¡Gracias por compartir tu experiencia!',
                icon: 'fa-check-circle',
                type: 'success'
            });
        }
    },


    voteHelpful(reviewId) {
        const votes = JSON.parse(localStorage.getItem(this.VOTES_KEY) || '{}');

        if (votes[reviewId]) {
            alert('Ya votaste esta reseña como útil.');
            return;
        }

        // Update storage for helpful count if it's a non-default review
        const saved = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
        const reviewIndex = saved.findIndex(r => r.id === reviewId);

        if (reviewIndex !== -1) {
            saved[reviewIndex].helpful++;
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(saved));
        }

        // track user voted
        votes[reviewId] = true;
        localStorage.setItem(this.VOTES_KEY, JSON.stringify(votes));

        const voteParams = new URLSearchParams(window.location.search);
        const voteVenueId = voteParams.get('id');
        this.renderReviews(voteVenueId);
    },

    renderReviews(filterVenueId = null) {
        const container = document.getElementById('community-reviews-list');
        if (!container) return;

        if (!filterVenueId) {
            container.innerHTML = `<div style="text-align:center; padding:3rem; color:#666; font-style:italic;">
                Selecciona un local para ver sus comentarios (P2P Mesh Active <i class="fa-solid fa-circle-nodes" style="color:#4CAF50"></i>)
            </div>`;
            return;
        }

        // Clear container initially (or keep partial for skeleton)
        container.innerHTML = '';

        // GunDB Listener
        this.listenForReviews(filterVenueId, (review, id) => {
            // Avoid duplicates (Gun .map() might re-emit)
            if (document.getElementById(`review-${review.id}`)) return;

            const item = this.createReviewElement(review);
            container.prepend(item); // Newest first usually, but Gun order isn't guaranteed without sort
        });
    },

    createReviewElement(review) {
        const item = document.createElement('div');
        item.className = 'info-card-premium';
        item.id = `review-${review.id}`;
        item.style.marginBottom = '1.5rem';

        // Use real ratings if available, else use mock
        const subRatings = review.subRatings ? [
            { label: 'Sabor', val: review.subRatings.sabor },
            { label: 'Ambiente', val: review.subRatings.ambiente },
            { label: 'Servicio', val: review.subRatings.servicio },
            { label: 'Precio', val: review.subRatings.precio }
        ] : [
            { label: 'Sabor', val: 5.0 },
            { label: 'Ambiente', val: 5.0 },
            { label: 'Servicio', val: 4.5 },
            { label: 'Precio', val: 4.0 }
        ];

        const initials = review.userName ? review.userName.split(' ').map(n => n[0]).join('') : 'AN';
        const displayRating = review.avgRating || '5.0';
        const voted = JSON.parse(localStorage.getItem(this.VOTES_KEY) || '{}');

        item.innerHTML = `
                <div class="review-header-flex">
                    <div style="display:flex; gap:1rem; align-items:center;">
                        <div style="width:48px; height:48px; border-radius:50%; background:#333; display:flex; align-items:center; justify-content:center; font-weight:800; border:1px solid rgba(255,255,255,0.1); color:white;">${initials}</div>
                        <div>
                            <div style="font-weight:800; font-size:1.1rem; display:flex; align-items:center; gap:8px;">
                                ${review.userName}
                                ${review.isVerified ? '<span style="color:#FFD700; font-size:0.8rem;"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></span>' : ''}
                            </div>
                            <div style="font-size:0.8rem; color:#666;">${review.date} • P2P Sync</div>
                        </div>
                    </div>
                    <div style="font-weight:900; color:#FFD700; font-size:1.1rem;"><i class="fa-solid fa-star"></i> ${displayRating}</div>
                </div>

                <p style="margin: 1.5rem 0; line-height:1.6; color:#ccc; font-size:0.95rem;">${review.text}</p>

                <div class="review-metric-row">
                    ${subRatings.map(s => `
                        <div class="metric-pill">
                            <i class="fa-solid fa-star"></i>
                            <span style="color:white; font-weight:700;">${(s.val || 5.0).toFixed(1)}</span>
                            <span>${s.label}</span>
                        </div>
                    `).join('')}
                </div>

                <div style="margin-top:1.5rem; display:flex; gap:1rem;">
                     <button class="helpful-btn ${voted[review.id] ? 'voted' : ''}" style="border-radius:20px; padding:6px 15px;" onclick="CommunitySystem.voteHelpful('${review.id}')">
                        <i class="fa-regular fa-thumbs-up"></i> Útil (${review.helpful})
                    </button>
                    <button class="helpful-btn" style="border-radius:20px; padding:6px 15px; border-color:transparent;">Responder</button>
                </div>
            `;
        return item;
    }
};

// ===========================
// ADMIN SYSTEM
// ===========================
const AdminSystem = {
    init() {
        const adminRoot = document.querySelector('.admin-layout');
        if (!adminRoot) return;

        // PROTECTION: Check if logged in as admin
        const currentUser = AuthManager.getCurrentUser();
        if (!currentUser || currentUser.role !== 'admin') {
            window.location.href = 'login.html';
            return;
        }

        this.setupTabs();

        this.renderStats();
        this.renderUsers();
        this.renderVenues();
        this.renderAnalyticsVenues();
        this.renderReviews();
        this.renderDailyConnections(); // Render initially
        this.setupNewVenueForm();
        this.setupMetricModal();



        debug('Admin System Initialized');
    },

    setupMetricModal() {
        const modal = document.getElementById('metric-detail-modal');
        const closeBtn = document.getElementById('close-metric-modal-btn');
        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => this.closeMetricModal());
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeMetricModal();
            });
        }
    },

    showMetricDetail(type) {
        const modal = document.getElementById('metric-detail-modal');
        const title = document.getElementById('metric-modal-title');
        const subtitle = document.getElementById('metric-modal-subtitle');
        const content = document.getElementById('metric-detailed-content');

        if (!modal || !content) return;

        let html = '';
        let modalTitle = '';
        let modalSub = '';

        switch (type) {
            case 'users':
                modalTitle = 'Audiencia y Demografía';
                modalSub = 'Análisis detallado de los usuarios registrados.';
                html = `
                    <div class="admin-grid-2col" style="gap:2rem;">
                        <div>
                            <h4 style="color:white; margin-bottom:1rem;">Rangos de Edad</h4>
                            <div class="mock-age-bars">
                                <div class="age-bar-row"><span>18-24</span> <div class="bar-bg"><div class="bar-fill" style="width: 35%;"></div></div> <span>35%</span></div>
                                <div class="age-bar-row"><span>25-34</span> <div class="bar-bg"><div class="bar-fill highlighted" style="width: 45%;"></div></div> <span>45%</span></div>
                                <div class="age-bar-row"><span>35-44</span> <div class="bar-bg"><div class="bar-fill" style="width: 15%;"></div></div> <span>15%</span></div>
                                <div class="age-bar-row"><span>45+</span> <div class="bar-bg"><div class="bar-fill" style="width: 5%;"></div></div> <span>5%</span></div>
                            </div>
                        </div>
                        <div>
                            <h4 style="color:white; margin-bottom:1rem;">Género</h4>
                            <div class="mock-pie-chart" style="padding:0; gap:1.5rem;">
                                <div class="pie-visual" style="width:100px; height:100px;"></div>
                                <div class="pie-legend" style="gap:0.5rem;">
                                    <div class="legend-item"><span class="dot" style="background:var(--primary-red);"></span> Hombres (45%)</div>
                                    <div class="legend-item"><span class="dot" style="background:#333;"></span> Mujeres (55%)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'traffic':
                modalTitle = 'Tráfico y Actividad';
                modalSub = 'Volumen de visitas y hotspots de la plataforma.';
                html = `
                    <div class="admin-panel-card" style="background:rgba(255,255,255,0.02); padding:1.5rem;">
                        <h4 style="color:white; margin-bottom:1rem;">Visitas por Hora (Hoy)</h4>
                        <div class="mock-chart-container" style="height:150px;">
                            <div class="mock-bar" style="height: 20%"></div><div class="mock-bar" style="height: 15%"></div>
                            <div class="mock-bar" style="height: 10%"></div><div class="mock-bar" style="height: 30%"></div>
                            <div class="mock-bar highlighted" style="height: 80%"></div><div class="mock-bar" style="height: 95%"></div>
                            <div class="mock-bar highlighted" style="height: 85%"></div><div class="mock-bar" style="height: 60%"></div>
                            <div class="mock-bar" style="height: 40%"></div><div class="mock-bar" style="height: 25%"></div>
                        </div>
                        <div style="display:flex; justify-content:space-between; color:#555; font-size:0.7rem; margin-top:10px;">
                            <span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>00:00</span>
                        </div>
                    </div>
                    <div style="margin-top:2rem;">
                         <h4 style="color:white; margin-bottom:1rem;">Zonas con Mayor Actividad</h4>
                         <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
                            <div style="background:rgba(255,255,255,0.03); padding:1rem; border-radius:8px;">
                                <span style="display:block; font-size:0.8rem; color:#666;">POCITOS</span>
                                <span style="font-size:1.2rem; font-weight:800;">1,420 visitas</span>
                            </div>
                            <div style="background:rgba(255,255,255,0.03); padding:1rem; border-radius:8px;">
                                <span style="display:block; font-size:0.8rem; color:#666;">CORDÓN</span>
                                <span style="font-size:1.2rem; font-weight:800;">1,650 visitas</span>
                            </div>
                         </div>
                    </div>
                `;
                break;
            default:
                modalTitle = 'Resumen General';
                modalSub = 'Métricas clave del sistema.';
                html = `<p style="padding:2rem; text-align:center; color:#888;">Cargando datos detallados para ${type}...</p>`;
        }

        title.textContent = modalTitle;
        subtitle.textContent = modalSub;
        content.innerHTML = html;
        modal.classList.add('active');
    },

    closeMetricModal() {
        const modal = document.getElementById('metric-detail-modal');
        if (modal) modal.classList.remove('active');
    },

    exportToPDF() {
        NotificationSystem.showToast({
            title: 'Generando Reporte',
            message: 'El PDF se está procesando. Se descargará en breve.',
            icon: 'fa-file-pdf',
            type: 'success'
        });

        setTimeout(() => {
            alert('Simulación: El reporte PDF ha sido generado y descargado con éxito.');
        }, 2000);
    },

    renderDailyConnections(monthName = 'Mayo') {
        const chartContainer = document.getElementById('monthly-connections-chart');
        if (!chartContainer) return;

        let barsHtml = '';
        for (let i = 0; i < 30; i++) {
            const height = Math.floor(Math.random() * 80) + 20;
            const isWeekend = i % 7 === 5 || i % 7 === 6;
            // Slightly different colors for weekends to make it pop
            barsHtml += `<div class="mock-bar ${isWeekend ? 'highlighted' : ''}" 
                             style="height:${height}%; flex:1;" 
                             title="${monthName} ${i + 1}: ${height * 15} conexiones"></div>`;
        }
        chartContainer.innerHTML = barsHtml;
    },

    showMonthMetrics(month) {
        const panel = document.getElementById('month-metrics-panel');
        const monthSpan = document.getElementById('selected-month-name');

        if (panel && monthSpan) {
            monthSpan.textContent = month;
            panel.style.display = 'block';

            // Actualizar la gráfica que ahora siempre es visible
            this.renderDailyConnections(month);

            // Auto-scroll to panel for options
            panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            NotificationSystem.showToast({
                title: 'Data Actualizada',
                message: `Mostrando tendencia diaria para ${month}.`,
                icon: 'fa-chart-line',
                type: 'success'
            });
        }
    },

    showTopVenue(type) {
        const modal = document.getElementById('metric-detail-modal');
        const title = document.getElementById('metric-modal-title');
        const content = document.getElementById('metric-detailed-content');
        const monthElem = document.getElementById('selected-month-name');
        const month = monthElem ? monthElem.textContent : 'Mayo';

        if (!modal || !content) return;

        let venueId = 'rudy';
        let metricTitle = '';
        let metricInfo = '';

        if (type === 'visited') {
            venueId = 'garage';
            metricTitle = `Local Más Visitado - ${month}`;
            metricInfo = 'Este local registró el mayor volumen de tráfico web y clics en el botón de reserva este mes.';
        } else {
            venueId = 'rudy';
            metricTitle = `Local Más Rankeado - ${month}`;
            metricInfo = 'Este local obtuvo la calificación promedio más alta (4.9⭐) y el mayor número de reseñas certificadas.';
        }

        const venue = VenueData[venueId] || { name: "Local Ganador", style: "Restaurante", address: "Ubicación Premium", logo: "" };

        title.innerHTML = `<i class="fa-solid fa-trophy" style="color:#FFD700;"></i> ${metricTitle}`;
        content.innerHTML = `
            <div style="display:flex; align-items:center; gap:15px; background:rgba(255,255,255,0.03); padding:15px; border-radius:12px; margin-bottom:15px;">
                <img src="${venue.logo || venue.banner}" style="width:60px; height:60px; border-radius:10px; object-fit:cover;">
                <div>
                    <h3 style="color:white; margin:0; font-size:1.1rem;">${venue.name}</h3>
                    <p style="color:#888; margin:2px 0; font-size:0.8rem;">${venue.style}</p>
                    <span class="status-pill active" style="font-size:0.65rem; padding:2px 8px;">GANADOR</span>
                </div>
            </div>
            <div class="admin-grid-2col" style="gap:15px;">
                <div class="admin-panel-card" style="background:rgba(255,255,255,0.02); padding:15px;">
                    <h4 style="color:#666; font-size:0.7rem; margin-bottom:10px; text-transform:uppercase;">RESULTADO</h4>
                    <div style="font-size:1.4rem; font-weight:900; color:white;">
                        ${type === 'visited' ? '12.8K <span style="font-size:0.8rem; font-weight:400; color:#555;">visitas</span>' : '4.9 <i class="fa-solid fa-star" style="color:#FFD700;"></i>'}
                    </div>
                </div>
                <div class="admin-panel-card" style="background:rgba(255,255,255,0.02); padding:15px;">
                    <h4 style="color:#666; font-size:0.7rem; margin-bottom:10px; text-transform:uppercase;">TENDENCIA</h4>
                    <div style="font-size:1.4rem; font-weight:900; color:#4CAF50;">
                        +22.5%
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
    },

    setupTabs() {
        const navItems = document.querySelectorAll('.admin-nav-item');
        const panes = document.querySelectorAll('.admin-tab-pane');
        const currentCrumb = document.getElementById('current-crumb');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = item.dataset.tab;

                // Update UI state
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                panes.forEach(p => p.classList.remove('active'));
                const targetPane = document.getElementById(`tab-${tabId}`);
                if (targetPane) targetPane.classList.add('active');

                // Update breadcrumb
                if (currentCrumb) currentCrumb.textContent = item.querySelector('span').textContent;
            });
        });
    },

    renderStats() {
        const users = JSON.parse(localStorage.getItem('burguertop_users') || '[]');
        const reviews = CommunitySystem.getReviews();
        const venues = Object.keys(VenueData).length;

        if (document.getElementById('total-users-val')) document.getElementById('total-users-val').textContent = 142 + users.length;
        if (document.getElementById('total-venues-val')) document.getElementById('total-venues-val').textContent = venues;
        if (document.getElementById('total-reviews-val')) document.getElementById('total-reviews-val').textContent = reviews.length;
    },

    renderUsers() {
        const container = document.getElementById('admin-users-list');
        if (!container) return;

        const users = JSON.parse(localStorage.getItem('burguertop_users') || '[]');

        // Mock some users for the table
        const mockUsers = [
            { nombre: "Marcos Rodríguez", email: "marcos@gmail.com", age: 24, gender: "Masculino", interactions: 15, status: "active" },
            { nombre: "Lucía Pérez", email: "lucia.p@hotmail.com", age: 31, gender: "Femenino", interactions: 8, status: "active" },
            { nombre: "User Trolls", email: "troll@spam.com", age: 19, gender: "Otro", interactions: 2, status: "banned" }
        ];

        const allUsers = [...mockUsers, ...users.map(u => ({
            nombre: u.nombre,
            email: u.email,
            age: Math.floor(Math.random() * 20) + 20,
            gender: Math.random() > 0.5 ? "Femenino" : "Masculino",
            interactions: u.votes ? u.votes.length : 0,
            status: u.isBanned ? "banned" : "active"
        }))];

        container.innerHTML = allUsers.map(u => `
            <tr>
                <td style="font-weight:700;">${u.nombre}</td>
                <td style="color:#888;">${u.email}</td>
                <td>${u.age} años</td>
                <td>${u.gender}</td>
                <td><span class="status-pill ${u.status}">${u.status === 'active' ? 'Activo' : 'Baneado'}</span></td>
                <td style="text-align:center;">${u.interactions}</td>
                <td>
                    <button class="btn-icon-sm" onclick="AdminSystem.toggleBan('${u.email}')" title="${u.status === 'active' ? 'Banear' : 'Desbanear'}">
                        <i class="fa-solid ${u.status === 'active' ? 'fa-user-slash' : 'fa-user-check'}"></i>
                    </button>
                    <button class="btn-icon-sm delete" onclick="AdminSystem.deleteUser('${u.email}')"><i class="fa-solid fa-trash-can"></i></button>
                </td>
            </tr>
        `).join('');
    },

    renderVenues() {
        const container = document.getElementById('admin-venues-list');
        if (!container) return;

        container.innerHTML = Object.entries(VenueData).map(([id, data]) => `
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap:12px;">
                        <img src="${data.logo || data.banner}" style="width:32px; height:32px; border-radius:4px; object-fit:cover;">
                        <div>
                            <div style="font-weight:700;">${data.name}</div>
                            <div style="font-size:0.7rem; color:#555;">ID: #${id.toUpperCase()}</div>
                        </div>
                    </div>
                </td>
                <td style="color:#888;">${data.style || 'Restaurante'}</td>
                <td><span class="plan-tag ${data.priceRange === '$$$' ? 'premium' : ''}">${data.priceRange === '$$$' ? 'Pro Business' : 'Básico'}</span></td>
                <td><span class="status-pill active">Activo</span></td>
                <td>
                    <div style="display:flex; gap:8px;">
                        <button class="btn-icon-sm" onclick="AdminSystem.exportData('${id}', 'csv')" title="Exportar CSV"><i class="fa-solid fa-file-csv" style="color:#4CAF50;"></i></button>
                        <button class="btn-icon-sm" onclick="AdminSystem.exportData('${id}', 'pdf')" title="Exportar PDF"><i class="fa-solid fa-file-pdf" style="color:var(--primary-red);"></i></button>
                    </div>
                </td>
                <td>
                    <button class="btn-icon-sm" onclick="AdminSystem.editVenue('${id}')"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn-icon-sm delete" onclick="AdminSystem.deleteVenue('${id}')"><i class="fa-solid fa-trash-can"></i></button>
                </td>
            </tr>
        `).join('');
    },

    renderAnalyticsVenues() {
        const container = document.getElementById('admin-analytics-venues-list');
        if (!container) return;

        container.innerHTML = Object.entries(VenueData).map(([id, data]) => {
            const mockVisits = Math.floor(Math.random() * 5000) + 1000;
            const mockReservations = Math.floor(mockVisits * 0.15);
            const mockReviews = Math.floor(Math.random() * 200) + 20;
            const conversion = ((mockReservations / mockVisits) * 100).toFixed(1);

            return `
                <tr class="clickable-row" onclick="AdminSystem.showVenueAnalytics('${id}')">
                    <td>
                        <div style="display:flex; align-items:center; gap:10px;">
                            <img src="${data.logo || data.banner}" style="width:24px; height:24px; border-radius:4px; object-fit:cover;">
                            <span style="font-weight:700;">${data.name}</span>
                        </div>
                    </td>
                    <td>${mockVisits.toLocaleString()}</td>
                    <td>${mockReservations.toLocaleString()}</td>
                    <td>${mockReviews}</td>
                    <td><span style="color:#4CAF50; font-weight:700;">${conversion}%</span></td>
                    <td><button class="btn-icon-sm"><i class="fa-solid fa-magnifying-glass-chart"></i></button></td>
                </tr>
            `;
        }).join('');
    },

    renderReviews() {
        const container = document.getElementById('admin-reviews-list');
        if (!container) return;

        const reviews = CommunitySystem.getReviews();

        container.innerHTML = reviews.map(r => `
            <tr>
                <td style="font-weight:700;">${r.userName}</td>
                <td style="color:var(--primary-red); font-weight:700;">${r.burger.toUpperCase()}</td>
                <td style="max-width:300px; color:#aaa; font-style:italic;">"${r.text}"</td>
                <td><i class="fa-solid fa-star" style="color:#FFD700;"></i> ${r.avgRating || '5.0'}</td>
                <td>
                    <button class="btn-icon-sm delete" onclick="AdminSystem.deleteReview('${r.id}')"><i class="fa-solid fa-trash-can"></i></button>
                </td>
            </tr>
        `).join('');
    },

    toggleBan(email) {
        let users = JSON.parse(localStorage.getItem('burguertop_users') || '[]');
        const userIndex = users.findIndex(u => u.email === email);

        if (userIndex !== -1) {
            users[userIndex].isBanned = !users[userIndex].isBanned;
            localStorage.setItem('burguertop_users', JSON.stringify(users));
            this.renderUsers();
            NotificationSystem.showToast({
                title: 'Usuario Actualizado',
                message: `El estado del usuario ha sido modificado.`,
                icon: 'fa-user-shield',
                type: 'success'
            });
        } else {
            alert('Este es un usuario de ejemplo y no puede ser baneado permanentemente en esta demo.');
        }
    },

    deleteReview(id) {
        if (!confirm('¿Seguro que deseas eliminar esta reseña permanentemente?')) return;

        let reviews = JSON.parse(localStorage.getItem('burguertop_reviews') || '[]');
        const filtered = reviews.filter(r => r.id !== id);
        localStorage.setItem('burguertop_reviews', JSON.stringify(filtered));

        this.renderReviews();
        this.renderStats();

        NotificationSystem.showToast({
            title: 'Reseña Eliminada',
            message: 'La moderación se ha aplicado con éxito.',
            icon: 'fa-trash',
            type: 'success'
        });
    },

    toggleVenueVisibility(id) {
        NotificationSystem.showToast({
            title: 'Visibilidad Cambiada',
            message: `El local ${id} ahora está oculto para los usuarios.`,
            icon: 'fa-eye-slash',
            type: 'success'
        });
    },

    showNewVenueForm() {
        document.getElementById('venue-form-container').style.display = 'block';
    },

    hideNewVenueForm() {
        document.getElementById('venue-form-container').style.display = 'none';
    },

    setupNewVenueForm() {
        const form = document.getElementById('new-venue-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('v-name').value;
            const address = document.getElementById('v-address').value;
            const category = document.getElementById('v-cat').value;
            const price = document.getElementById('v-price').value;
            const description = document.getElementById('v-desc').value;
            const plan = document.getElementById('v-plan').value;

            if (!name || !address) return;

            // En un sistema real, aquí guardaríamos en VenueData y localStorage
            NotificationSystem.showToast({
                title: 'Registro Exitoso',
                message: `${name} ha sido añadido con el plan ${plan.toUpperCase()}.`,
                icon: 'fa-shop',
                type: 'success'
            });

            this.hideNewVenueForm();
            form.reset();

            // Simular actualización
            setTimeout(() => {
                this.renderVenues();
                this.renderAnalyticsVenues();
            }, 500);
        });
    },

    exportData(id, format) {
        const venue = VenueData[id];
        if (!venue) return;

        NotificationSystem.showToast({
            title: `Exportando ${format.toUpperCase()}`,
            message: `Generando archivo para ${venue.name}...`,
            icon: format === 'pdf' ? 'fa-file-pdf' : 'fa-file-csv',
            type: 'success'
        });

        setTimeout(() => {
            alert(`SIMULACIÓN: Se ha descargado el archivo report_${id}.${format} con toda la data comercial del local.`);
        }, 1500);
    },

    showVenueAnalytics(id) {
        const venue = VenueData[id];
        if (!venue) return;

        const modal = document.getElementById('metric-detail-modal');
        const title = document.getElementById('metric-modal-title');
        const content = document.getElementById('metric-detailed-content');

        if (!modal || !content) return;

        title.innerHTML = `<i class="fa-solid fa-chart-line"></i> Analytics: ${venue.name}`;

        content.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                <div class="admin-panel-card" style="background:rgba(255,255,255,0.03); padding:1rem;">
                    <h4 style="color:#aaa; font-size:0.75rem; margin-bottom:8px;">RENDIMIENTO SEMANAL</h4>
                    <div class="mock-chart-container" style="height:80px; padding:0;">
                        ${[20, 45, 30, 80, 55, 90, 40].map(h => `<div class="mock-bar" style="height:${h}%"></div>`).join('')}
                    </div>
                </div>
                <div class="admin-panel-card" style="background:rgba(255,255,255,0.03); padding:1rem;">
                    <h4 style="color:#aaa; font-size:0.75rem; margin-bottom:8px;">MÉTRICAS CLAVE</h4>
                    <div style="display:flex; flex-direction:column; gap:5px; font-size:0.85rem;">
                        <div style="display:flex; justify-content:space-between;"><span>Impresiones</span><span style="font-weight:800;">12.4K</span></div>
                        <div style="display:flex; justify-content:space-between;"><span>Reservas</span><span style="font-weight:800; color:#4CAF50;">482</span></div>
                        <div style="display:flex; justify-content:space-between;"><span>Rating</span><span style="font-weight:800; color:#FFD700;">4.8 <i class="fa-solid fa-star"></i></span></div>
                    </div>
                </div>
            </div>
            <div style="margin-top:15px; background:rgba(255,255,255,0.02); padding:10px; border-radius:10px;">
                <h4 style="color:#aaa; font-size:0.75rem; margin-bottom:10px;">TOP PRODUCTOS</h4>
                <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:8px;">
                    ${(venue.featuredDishes || ['Plato Especial', 'Menú del Día', 'Postre Estrella']).map(d => `
                        <div style="background:rgba(0,0,0,0.3); padding:10px; border-radius:6px; font-size:0.8rem;">
                            <span style="display:block; font-weight:700;">${d.name || d}</span>
                            <span style="color:#666;">842 views</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        modal.classList.add('active');
    },
};

// ===========================
// B2B SYSTEM (Business Tools)
// ===========================
const B2BSystem = {
    init() {
        // Just ensures the object is available
        debug('B2B System Initialized');
    },

    generateReport() {
        const btn = document.getElementById('report-btn');
        if (!btn) return;

        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Procesando Data...';

        // Simular procesamiento y descarga
        setTimeout(() => {
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Reporte Generado';
            btn.style.background = '#4CAF50';

            // Simular "descarga" abriendo una alerta o nueva pestaña con un mock
            setTimeout(() => {
                alert('Tu Reporte de Inteligencia de Negocios ha sido generado con éxito.\n\nEn un entorno real, esto iniciaría la descarga de un PDF personalizado con analíticas de tu local.');
                btn.disabled = false;
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 1000);
        }, 2000);
    }
};

// ===========================
// COUPON DATA (GEOLOCALIZADO)
// ===========================
const CouponData = [
    {
        id: 'cp1',
        venueId: 'rudy',
        title: '50% OFF en Rudy Original',
        desc: 'Válido solo por hoy usando el código FLOW50.',
        lat: -34.9156, lng: -56.1587,
        icon: 'fa-burger',
        expires: '2025-12-31',
        status: 'active'
    },
    {
        id: 'cp2',
        venueId: 'garage',
        title: '2x1 en Craft Beer',
        desc: 'De 19:30 a 21:00 en Garage Burger.',
        lat: -34.9088, lng: -56.1723,
        icon: 'fa-beer-mug-empty',
        expires: '2025-12-31',
        status: 'active'
    },
    {
        id: 'cp3',
        venueId: 'tbv',
        title: 'Papas Gratis con tu Combo',
        desc: 'Muestra esta notificación al ordenar en TBV.',
        lat: -34.9011, lng: -56.1645,
        icon: 'fa-utensils',
        expires: '2025-12-31',
        status: 'active'
    }
];

// ===========================
// GAMIFICATION SYSTEM
// ===========================
const AchievementsData = {
    first_review: {
        id: 'first_review',
        title: 'Primera Voz',
        desc: 'Publicaste tu primera reseña honesta.',
        icon: 'fa-microphone',
        color: '#4CAF50'
    },
    explorer: {
        id: 'explorer',
        title: 'Aventurero',
        desc: 'Visitaste 3 locales diferentes.',
        icon: 'fa-compass',
        color: '#2196F3'
    },
    critic: {
        id: 'critic',
        title: 'Crítico Experto',
        desc: 'Tu reseña fue marcada como útil 5 veces.',
        icon: 'fa-feather-pointed',
        color: '#9C27B0'
    },
    trendsetter: {
        id: 'trendsetter',
        title: 'Trendsetter',
        desc: 'Fuiste el primero en reseñar un local nuevo.',
        icon: 'fa-fire',
        color: '#FF5722'
    },
    photographer: {
        id: 'photographer',
        title: 'Ojo Fotográfico',
        desc: 'Subiste 10 fotos de comida.',
        icon: 'fa-camera',
        color: '#E91E63'
    }
};

const GamificationSystem = {
    init() {
        // Initialize logic
    },

    checkAchievements(user) {
        if (!user.achievements) user.achievements = [];
        let newUnlock = false;

        // Check First Review
        if (user.votes && user.votes.length >= 1 && !this.hasAchievement(user, 'first_review')) {
            this.unlock(user, 'first_review');
            newUnlock = true;
        }

        // Check Explorer (Unique venues visited)
        if (user.votes) {
            const uniqueVenues = new Set(user.votes.map(v => v.id)).size;
            if (uniqueVenues >= 3 && !this.hasAchievement(user, 'explorer')) {
                this.unlock(user, 'explorer');
                newUnlock = true;
            }
        }

        // Save if updated
        if (newUnlock) {
            AuthManager.saveUser(user);
        }
    },

    hasAchievement(user, id) {
        if (!user || !user.achievements) return false;
        return user.achievements.some(a => a.id === id);
    },

    unlock(user, id) {
        // Prevent re-unlocking if already exists locally
        if (this.hasAchievement(user, id)) return;

        const ach = AchievementsData[id];
        if (!ach) return;

        const newAchievement = {
            id: id,
            date: new Date().toISOString()
        };

        // Update local state immediately for UI responsiveness
        if (!user.achievements) user.achievements = [];
        user.achievements.push(newAchievement);

        // PERSIST TO GUNDB (Server)
        // If we are unlocked for the current logged in user
        if (AuthManager.getCurrentUser() && AuthManager.getCurrentUser().id === user.id) {
            gun.user().get('achievements').set(newAchievement);

            // Also publish to global feed for social bragging
            db.get('global_feed').set({
                type: 'achievement',
                data: { ...newAchievement, userName: user.nombre },
                content: `ha desbloqueado <strong>${ach.title}</strong>`,
                timestamp: Date.now()
            });
        }

        NotificationSystem.showToast({
            title: '¡Logro Desbloqueado!',
            message: ach.title,
            icon: ach.icon,
            type: 'achievement'
        });
    },

    getLeaderboard() {
        const users = AuthManager.getUsers();
        // Sort by level/reviews count descending
        return users.sort((a, b) => {
            const scoreA = (a.votes ? a.votes.length : 0);
            const scoreB = (b.votes ? b.votes.length : 0);
            return scoreB - scoreA;
        }).slice(0, 10); // Top 10
    },

    init() {
        const badgeContainer = document.getElementById('badges-container');
        if (badgeContainer) this.renderBadges(badgeContainer);

        const leaderboardContainer = document.getElementById('leaderboard-container');
        if (leaderboardContainer) this.renderLeaderboard();
    },

    renderLeaderboard() {
        const container = document.getElementById('leaderboard-container');
        if (!container) return;

        const topUsers = this.getLeaderboard();

        // If empty mock some users if needed or show message
        if (topUsers.length === 0) {
            container.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:2rem;">Sé el primero en aparecer aquí.</div>';
            return;
        }

        container.innerHTML = topUsers.map((u, index) => {
            const reviews = u.votes ? u.votes.length : 0;
            const badge = AuthManager.getCommunityBadge(reviews);
            const avatar = u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.nombre)}&background=333&color=fff`;
            const isTop3 = index < 3;

            return `
                <div class="card premium-card" style="display:flex; align-items:center; gap:1rem; padding:1.5rem; border: ${isTop3 ? '1px solid ' + badge.color : 'none'};">
                    <div style="font-size:1.5rem; font-weight:900; color:${index === 0 ? '#FFD700' : (index === 1 ? '#C0C0C0' : (index === 2 ? '#CD7F32' : '#444'))}; min-width:30px;">#${index + 1}</div>
                    <img src="${avatar}" style="width:60px; height:60px; border-radius:50%; object-fit:cover; border:2px solid ${badge.color};">
                    <div style="flex:1;">
                        <h4 style="margin:0; font-size:1.1rem;">${u.nombre}</h4>
                        <div style="font-size:0.85rem; color:${badge.color}; margin-top:2px;">${badge.icon} ${badge.name}</div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-weight:700; font-size:1.2rem;">${reviews}</div>
                        <div style="font-size:0.7rem; color:#888;">Reseñas</div>
                    </div>
                </div>
            `;
        }).join('');
    },

    renderBadges(container) {
        const user = AuthManager.getCurrentUser();
        container.innerHTML = '';

        Object.values(AchievementsData).forEach(ach => {
            const isUnlocked = user ? this.hasAchievement(user, ach.id) : false;

            const badgeEl = document.createElement('div');
            badgeEl.className = `badge-item ${isUnlocked ? 'unlocked' : 'locked'}`;
            badgeEl.innerHTML = `
                 <div class="badge-icon" style="color:${isUnlocked ? ach.color : '#555'}"><i class="fa-solid ${ach.icon}"></i></div>
                 <div class="badge-info">
                     <h5>${ach.title}</h5>
                     <p style="font-size:0.7rem; color:#888;">${ach.desc}</p>
                 </div>
             `;
            container.appendChild(badgeEl);
        });
    }
};

// ===========================
// SOCIAL SYSTEM
// ===========================
const SocialSystem = {
    init() {
        // Init logic
        if (document.getElementById('activity-feed-container')) {
            this.renderFeed();
        }
    },

    followUser(targetId) {
        if (!AuthManager.isLoggedIn()) {
            window.location.href = 'login.html';
            return;
        }

        const currentUser = AuthManager.getCurrentUser();
        if (currentUser.id === targetId) return; // Cannot follow self

        if (!currentUser.following) currentUser.following = [];
        if (!currentUser.following.includes(targetId)) {
            currentUser.following.push(targetId);
            AuthManager.saveUser(currentUser);

            // Generate notification for target (Mock)
            // In a real app we would update the target user doc too

            NotificationSystem.showToast({
                title: 'Siguiendo',
                message: `Ahora sigues a este usuario.`,
                icon: 'fa-user-plus',
                type: 'success'
            });

            this.updateUI(targetId);
        }
    },

    unfollowUser(targetId) {
        if (!AuthManager.isLoggedIn()) return;

        const currentUser = AuthManager.getCurrentUser();
        if (!currentUser.following) return;

        currentUser.following = currentUser.following.filter(id => id !== targetId);
        AuthManager.saveUser(currentUser);

        NotificationSystem.showToast({
            title: 'Dejado de seguir',
            message: `Ya no sigues a este usuario.`,
            icon: 'fa-user-minus',
            type: 'geo'
        });

        this.updateUI(targetId);
    },

    isFollowing(targetId) {
        const currentUser = AuthManager.getCurrentUser();
        if (!currentUser || !currentUser.following) return false;
        return currentUser.following.includes(targetId);
    },

    updateUI(targetId) {
        // If we are on a page showing this user, update button state
        // For now mainly ProfileSystem or Leaderboard re-render
        if (typeof ProfileSystem !== 'undefined') {
            // If viewing own profile stats might change (following count)
            ProfileSystem.renderStats(AuthManager.getCurrentUser());
        }
        if (typeof GamificationSystem !== 'undefined') {
            GamificationSystem.renderLeaderboard();
        }
    },

    listenToFeed(callback) {
        // Listen to global feed
        db.get('global_feed').map().on((item, id) => {
            if (item) callback(item);
        });
    },

    getFeed() {
        return []; // Legacy
    },

    renderFeed() {
        const container = document.getElementById('activity-feed-container');
        if (!container) return;

        container.innerHTML = ''; // Clear for realtime

        this.listenToFeed((item) => {
            // Avoid dups
            if (document.getElementById(`feed-${item.data.id}`)) return;

            const avatar = item.data.userName ? `https://ui-avatars.com/api/?name=${encodeURIComponent(item.data.userName)}&background=222&color=fff` : '';
            const user = item.data.userName || 'Anon';
            const icon = item.type === 'review' ? 'fa-star' : 'fa-trophy';
            const color = item.type === 'review' ? '#FFD700' : '#4CAF50';
            const content = item.type === 'review' ?
                `ha calificado <strong>${(item.data.burger || 'Un local').toUpperCase()}</strong> con ${item.data.avgRating}⭐` :
                item.content;

            const el = document.createElement('div');
            el.id = `feed-${item.data.id}`;
            el.innerHTML = `
                <div style="display:flex; gap:12px; margin-bottom:1.5rem; align-items:flex-start;">
                    <img src="${avatar}" style="width:40px; height:40px; border-radius:50%; border:1px solid #444;">
                    <div>
                        <div style="font-size:0.9rem; margin-bottom:4px;">
                            <span style="font-weight:700; color:white;">${user}</span> 
                            <span style="color:#aaa;">${content}</span>
                        </div>
                        <div style="font-size:0.75rem; color:#666; display:flex; align-items:center; gap:6px;">
                            <i class="fa-solid ${icon}" style="color:${color};"></i> Reciente
                        </div>
                    </div>
                </div>
            `;
            container.prepend(el);
        });

        // Initialize with legacy feed for demo content if stream is empty initially?
        // For p2p, we rely on stream.
    }
};

// ===========================
// COUPON & WALLET SYSTEM
// ===========================
const CouponSystem = {
    init() {
        // Load claimed coupons from storage
        this.loadUserCoupons();
    },

    loadUserCoupons() {
        const claimed = JSON.parse(localStorage.getItem('rateflow_user_coupons') || '[]');
        // Update local status based on storage
        CouponData.forEach(cp => {
            if (claimed.includes(cp.id)) {
                cp.status = 'claimed';
            }
        });
    },

    claimCoupon(id) {
        if (!AuthManager.isLoggedIn()) {
            AuthManager.openModal();
            return;
        }

        const coupon = CouponData.find(c => c.id === id);
        if (!coupon || coupon.status !== 'active') return;

        coupon.status = 'claimed';

        // Save to storage
        let claimed = JSON.parse(localStorage.getItem('rateflow_user_coupons') || '[]');
        if (!claimed.includes(id)) {
            claimed.push(id);
            localStorage.setItem('rateflow_user_coupons', JSON.stringify(claimed));
        }

        NotificationSystem.showToast({
            title: '¡Cupón Guardado!',
            message: 'Lo encontrarás en tu billetera de cupones.',
            icon: 'fa-ticket',
            type: 'success'
        });

        // Trigger UI update if wallet is open
        if (typeof WalletSystem !== 'undefined') WalletSystem.renderWallet();
    },

    redeemCoupon(id) {
        const coupon = CouponData.find(c => c.id === id);
        if (!coupon || coupon.status !== 'claimed') return;

        if (confirm(`¿Estás en el local y listo para usar "${coupon.title}"? Esto no se puede deshacer.`)) {
            coupon.status = 'redeemed';
            // In a real app, we would update the server here

            NotificationSystem.showToast({
                title: '¡Cupón Canjeado!',
                message: 'Muestra esta pantalla al personal.',
                icon: 'fa-qrcode',
                type: 'success'
            });

            if (typeof WalletSystem !== 'undefined') WalletSystem.renderWallet();
        }
    }
};

const WalletSystem = {
    init() {
        // Create wallet modal if not exists
        if (!document.getElementById('wallet-modal')) {
            this.createWalletModal();
        }
    },

    createWalletModal() {
        const modal = document.createElement('div');
        modal.id = 'wallet-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-container premium-modal" style="max-width: 450px;">
                <button class="close-modal-btn" onclick="WalletSystem.close()"><i class="fa-solid fa-xmark"></i></button>
                <div class="modal-header">
                    <h3><i class="fa-solid fa-wallet" style="color:var(--primary-red);"></i> Mis Cupones</h3>
                    <p>Gestiona tus beneficios y descuentos.</p>
                </div>
                <div class="modal-body" id="wallet-list">
                    <!-- Coupons injected here -->
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    open() {
        if (!document.getElementById('wallet-modal')) this.createWalletModal();
        this.renderWallet();
        document.getElementById('wallet-modal').classList.add('active');
    },

    close() {
        const m = document.getElementById('wallet-modal');
        if (m) m.classList.remove('active');
    },

    renderWallet() {
        const container = document.getElementById('wallet-list');
        if (!container) return;

        // reload text
        CouponSystem.loadUserCoupons();
        const myCoupons = CouponData.filter(c => c.status === 'claimed' || c.status === 'redeemed');

        if (myCoupons.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding: 2rem; color:#666;">
                    <i class="fa-regular fa-face-sad-tear" style="font-size:3rem; margin-bottom:1rem;"></i>
                    <p>Aún no tienes cupones.</p>
                    <button class="btn-text-only" onclick="WalletSystem.close(); window.location.href='index.html'">Explorar Mapa</button>
                </div>
            `;
            return;
        }

        container.innerHTML = myCoupons.map(cp => {
            const isRedeemed = cp.status === 'redeemed';
            return `
                <div class="coupon-card ${isRedeemed ? 'redeemed' : ''}" style="background:rgba(255,255,255,0.05); padding:1rem; border-radius:8px; margin-bottom:1rem; border:1px dashed ${isRedeemed ? '#666' : 'var(--primary-red)'}; position:relative; overflow:hidden;">
                    ${isRedeemed ? '<div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%) rotate(-15deg); font-size:2rem; font-weight:900; color:rgba(255,255,255,0.1); border:4px solid rgba(255,255,255,0.1); padding:0.5rem;">CANJEADO</div>' : ''}
                    <div style="display:flex; gap:12px; align-items:center;">
                        <div style="width:40px; height:40px; background:#333; border-radius:50%; display:flex; align-items:center; justify-content:center;">
                            <i class="fa-solid ${cp.icon}" style="color:${isRedeemed ? '#666' : 'var(--primary-red)'};"></i>
                        </div>
                        <div style="flex:1;">
                            <h4 style="margin:0; font-size:0.95rem; color:${isRedeemed ? '#888' : 'white'};">${cp.title}</h4>
                            <p style="font-size:0.8rem; color:#888; margin:2px 0 0;">Vence: ${cp.expires}</p>
                        </div>
                    </div>
                    ${!isRedeemed ? `
                        <div style="margin-top:1rem; text-align:center;">
                            <button class="btn-primary-gradient full-width" style="padding:8px;" onclick="CouponSystem.redeemCoupon('${cp.id}')">Usar Ahora <i class="fa-solid fa-qrcode"></i></button>
                            <div style="font-size:0.7rem; color:#555; margin-top:5px;">Muestra esto al cajero</div>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }
};

// ===========================
// NOTIFICATION SYSTEM (Toasts & Dropdown)
// ===========================
const NotificationSystem = {
    init() {
        // Create container if not exists
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 1rem;
            `;
            document.body.appendChild(container);
        }

        // Setup notification dropdown listeners (once navigation is updated)
        this.setupDropdownToggle();

        // Simular alerta de proximidad solo en Index
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
            setTimeout(() => {
                this.checkProximityNotifications();
            }, 3000);
        }
    },

    setupDropdownToggle() {
        const checkBtn = setInterval(() => {
            const btn = document.getElementById('notification-bell-btn');
            const dropdown = document.getElementById('notification-dropdown');
            if (btn && dropdown) {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    dropdown.classList.toggle('active');
                    if (dropdown.classList.contains('active')) {
                        this.renderNotifications();
                    }
                };
                document.addEventListener('click', (e) => {
                    if (!dropdown.contains(e.target)) {
                        dropdown.classList.remove('active');
                    }
                });
                clearInterval(checkBtn);
            }
        }, 500);
    },

    checkProximityNotifications() {
        if (!RecommendationSystem.userCoords) return;

        CouponData.forEach(coupon => {
            const dist = GeolocationManager.calculateDistance(
                RecommendationSystem.userCoords.lat, RecommendationSystem.userCoords.lng,
                coupon.lat, coupon.lng
            );

            // Si está a menos de 1km, lanzar toast
            if (dist < 1.0) {
                this.showToast({
                    title: '¡Cupón Cercano!',
                    message: `${coupon.title} (a ${dist.toFixed(1)} km)`,
                    icon: coupon.icon,
                    type: 'geo'
                });
            }
        });
    },

    renderNotifications() {
        const container = document.getElementById('notification-list');
        if (!container) return;

        const uCoords = RecommendationSystem.userCoords || GeolocationManager.defaultCoords;

        container.innerHTML = '';

        CouponData.forEach(coupon => {
            const dist = GeolocationManager.calculateDistance(
                uCoords.lat, uCoords.lng,
                coupon.lat, coupon.lng
            );

            const item = document.createElement('div');
            item.className = 'notification-item';
            item.innerHTML = `
                <div class="notification-icon"><i class="fa-solid ${coupon.icon}"></i></div>
                <div class="notification-content">
                    <div class="notification-title">${coupon.title}</div>
                    <div class="notification-desc">${coupon.desc}</div>
                    <div class="notification-meta"><i class="fa-solid fa-location-dot"></i> a ${dist.toFixed(1)} km de ti</div>
                    <button class="btn-text-only" style="padding:0; margin-top:5px; font-size:0.8rem; color:var(--primary-red);" onclick="CouponSystem.claimCoupon('${coupon.id}')">Reclamar Cupón</button>
                </div>
            `;
            container.appendChild(item);
        });
    },

    showToast({ title, message, icon, type }) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast-notification active';
        toast.style.cssText = `
            background: rgba(20, 20, 20, 0.95);
            backdrop-filter: blur(10px);
            border-left: 4px solid ${type === 'geo' ? '#E30613' : (type === 'achievement' ? '#FFD700' : '#E30613')};
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            color: white;
            min-width: 280px;
            display: flex;
            align-items: center;
            gap: 1rem;
            transform: translateX(120%);
            transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        `;

        toast.innerHTML = `
            <div style="font-size: 1.5rem; color: ${type === 'achievement' ? '#FFD700' : '#E30613'}">
                <i class="fa-solid ${icon}"></i>
            </div>
            <div>
                <div style="font-weight: 800; font-size: 0.9rem; margin-bottom: 2px;">${title}</div>
                <div style="font-size: 0.8rem; color: #ccc;">${message}</div>
            </div>
        `;

        container.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Remove after delay
        setTimeout(() => {
            toast.style.transform = 'translateX(120%)';
            setTimeout(() => toast.remove(), 500);
        }, 6000);
    }
};

// ===========================
// VENUE DATA & DETAIL SYSTEM
// ===========================
const VenueData = {
    rudy: {
        name: "Rudy Burgers",
        tagline: "El sabor de lo clásico, elevado al máximo.",
        coordinates: { lat: -34.9156, lng: -56.1587 },
        tags: ['hamburguesa', 'smash', 'gourmet', 'carne', 'cena'],
        heroDesc: "Cocina urbana contemporánea con el sello de la mejor carne de exportación. Una experiencia gourmet que redefine el concepto de smashburger en el corazón de Montevideo.",
        fullDescription: "Rudy Burgers nació con el objetivo de traer la auténtica hamburguesa smash a Montevideo. Carne seleccionada, pan artesanal y una salsa secreta se combinan para crear un equilibrio perfecto. Nuestro local ofrece un ambiente moderno y relajado, ideal para disfrutar con amigos o en pareja.",
        address: "Luis de la Torre 564, Montevideo",
        hours: "Mar - Dom: 19:30 a 00:00",
        phone: "+598 2712 3456",
        website: "www.rudyburgers.com.uy",
        style: "Smash / Gourmet",
        priceRange: "$$$",
        logo: "img/rudy.png",
        banner: "img/bannertema.jpg",
        facilities: [
            { icon: "fa-wifi", label: "Wi-Fi Gratis" },
            { icon: "fa-car", label: "Parking" },
            { icon: "fa-umbrella-beach", label: "Terraza" },
            { icon: "fa-wheelchair", label: "Accesible" },
            { icon: "fa-glass-cheers", label: "Bar Completo" },
            { icon: "fa-calendar-check", label: "Reservas" }
        ],
        featuredDishes: [
            { name: "Rudy Original", price: "$320", desc: "Doble carne smash, cheddar, cebolla picada y salsa secreta.", img: "img/burguer1.png" },
            { name: "Pulpo a la Brasa", price: "$650", desc: "Tentáculo de pulpo grillado sobre crema de papas y pimentón.", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" }
        ],
        menu: [
            { name: "Double Rudy", desc: "Doble carne smash, doble cheddar, cebolla y salsa Rudy.", price: "$410" },
            { name: "Bacon & Cheese", desc: "Doble carne, cheddar, panceta crocante y BBQ.", price: "$450" },
            { name: "Papas Rudy", desc: "Papas fritas triples cocción, sal de mar y hierbas.", price: "$180" }
        ]
    },
    garage: {
        name: "Garage Burger",
        tagline: "Expertos en Toppings y Combinaciones Audaces.",
        coordinates: { lat: -34.9088, lng: -56.1723 },
        tags: ['hamburguesa', 'cerveza', 'craft', 'musica', 'toppings'],
        heroDesc: "Sabores intensos en un entorno industrial único. Donde la creatividad se encuentra con la parrilla para ofrecerte hamburguesas que desafían lo convencional.",
        fullDescription: "En Garage Burger nos especializamos en hamburguesas con personalidad. Ingredientes frescos, combinaciones únicas y un ambiente industrial que te encantará. Cada receta es diseñada para sorprender, usando quesos artesanales y salsas de la casa.",
        address: "Bv. España 2623, Montevideo",
        hours: "Todos los días: 19:30 a 00:30",
        phone: "+598 2707 9876",
        website: "www.garageburger.com.uy",
        style: "Industrial / Creativa",
        priceRange: "$$$",
        logo: "img/garage.png",
        banner: "https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        facilities: [
            { icon: "fa-wifi", label: "Wi-Fi Premium" },
            { icon: "fa-music", label: "Música en vivo" },
            { icon: "fa-beer", label: "Craft Beer" },
            { icon: "fa-dog", label: "Pet Friendly" }
        ],
        featuredDishes: [
            { name: "The Muscle", price: "$460", desc: "Doble carne, cheddar, cebolla caramelizada y huevo frito.", img: "img/burguer2.png" },
            { name: "Garage Loaded Fries", price: "$280", desc: "Papas con cheddar fundido, panceta y verdeo.", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" }
        ],
        menu: [
            { name: "Green Garage", desc: "Hamburguesa vegetal premium, palta, rúcula y mayo de ajo.", price: "$390" },
            { name: "Spicy Hell", desc: "Carne, jalapeños, queso pepper jack y salsa brava.", price: "$430" }
        ]
    },
    tbv: {
        name: "The Burger Vilas",
        tagline: "Calidad Premium en Formato Rápido.",
        coordinates: { lat: -34.9011, lng: -56.1645 },
        tags: ['hamburguesa', 'fast food', 'premium', 'delivery', 'promo'],
        heroDesc: "La excelencia de la carne uruguaya servida con rapidez y maestría. Ingredientes de pastoreo y procesos artesanales para los paladares más exigentes.",
        fullDescription: "TBV redefine la comida rápida combinando ingredientes de alta gama con un servicio ágil. Nuestra carne de pastoreo es el secreto de nuestro éxito, molida diariamente y cocida a la perfección.",
        address: "Arenal Grande 1350, Montevideo",
        hours: "Lun - Sáb: 11:30 a 23:00",
        phone: "+598 2400 1234",
        website: "www.tbv.com.uy",
        style: "Fast Casual / Premium",
        priceRange: "$$",
        logo: "img/tbv.png",
        banner: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80",
        facilities: [
            { icon: "fa-bicycle", label: "Delivery Propio" },
            { icon: "fa-bolt", label: "Servicio Express" },
            { icon: "fa-leaf", label: "Veggie Friendly" }
        ],
        featuredDishes: [
            { name: "The Big Vilas", price: "$520", desc: "Triple carne, triple queso, panceta y pepinillos.", img: "img/burguer3.png" },
            { name: "Truffle Burger", price: "$490", desc: "Carne, queso brie, rúcula y aceite de trufa blanca.", img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" }
        ],
        menu: [
            { name: "TBV Classic", desc: "Carne prime, cheddar, lechuga, tomate y salsa TBV.", price: "$350" },
            { name: "Sweet Potatoes", desc: "Boniatos fritos con miel de caña.", price: "$190" }
        ]
    }
};

const VenueDetailSystem = {
    init() {
        const root = document.getElementById('venue-detail-root');
        if (!root) return;

        const params = new URLSearchParams(window.location.search);
        let venueId = params.get('id');

        if (!venueId || !VenueData[venueId]) {
            venueId = 'rudy';
        }

        this.renderLocal(venueId);
    },

    renderLocal(id) {
        const data = VenueData[id];
        if (!data) return;

        // Hero
        if (document.getElementById('venue-title')) document.getElementById('venue-title').textContent = data.name;
        if (document.getElementById('breadcrumb-local')) document.getElementById('breadcrumb-local').textContent = data.name;
        if (document.getElementById('venue-hero-desc')) document.getElementById('venue-hero-desc').textContent = data.heroDesc;
        if (document.getElementById('venue-hero-bg')) document.getElementById('venue-hero-bg').style.backgroundImage = `url('${data.banner}')`;
        if (document.getElementById('gallery-thumb')) document.getElementById('gallery-thumb').src = data.banner;

        // Ratings Hero
        if (typeof RatingSystem !== 'undefined') {
            const category = RatingSystem.getCategoryForItem(id);
            const rating = RatingSystem.calculateAverage(category, id);
            const votes = (RatingSystem.ratings[category] && RatingSystem.ratings[category][id])
                ? RatingSystem.ratings[category][id].totalVotes
                : 0;
            if (document.getElementById('hero-rating-val')) document.getElementById('hero-rating-val').textContent = rating;
            if (document.getElementById('hero-votes-count')) document.getElementById('hero-votes-count').textContent = `${votes} reseñas`;
        }

        // About
        if (document.getElementById('venue-full-desc')) document.getElementById('venue-full-desc').textContent = data.fullDescription;

        // Facilities
        const facContainer = document.getElementById('facilities-grid');
        if (facContainer) {
            facContainer.innerHTML = '';
            data.facilities.forEach(fac => {
                const item = document.createElement('div');
                item.className = 'facility-item';
                item.innerHTML = `<i class="fa-solid ${fac.icon}"></i> <span>${fac.label}</span>`;
                facContainer.appendChild(item);
            });
        }

        // Featured Dishes
        const dishContainer = document.getElementById('featured-dishes-container');
        if (dishContainer) {
            dishContainer.innerHTML = '';
            data.featuredDishes.forEach(dish => {
                const el = document.createElement('div');
                el.className = 'dish-card-horizontal';
                el.innerHTML = `
                    <img src="${dish.img}" alt="${dish.name}" class="dish-img-thumb" onerror="this.src='https://via.placeholder.com/100?text=Food'">
                    <div class="dish-info-mini">
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                            <span style="font-weight:800; font-size:1.1rem;">${dish.name}</span>
                            <span style="color:var(--primary-red); font-weight:800; font-size:1rem;">${dish.price}</span>
                        </div>
                        <p style="font-size:0.85rem; color:#aaa; line-height:1.4;">${dish.desc}</p>
                    </div>
                `;
                dishContainer.appendChild(el);
            });
        }

        // Sidebar
        if (document.getElementById('side-hours')) document.getElementById('side-hours').textContent = data.hours;
        if (document.getElementById('side-phone')) document.getElementById('side-phone').textContent = data.phone;
        if (document.getElementById('side-web')) {
            document.getElementById('side-web').textContent = data.website;
            document.getElementById('side-web').href = `http://${data.website}`;
        }
        if (document.getElementById('side-price')) document.getElementById('side-price').textContent = data.priceRange;
        if (document.getElementById('side-style')) document.getElementById('side-style').textContent = data.style;
        if (document.getElementById('side-address')) document.getElementById('side-address').textContent = data.address;

        // Setup hidden select for reviews
        const reviewSelect = document.getElementById('review-burger-select');
        if (reviewSelect) reviewSelect.value = id;

        // Setup Reservation Button
        const resBtn = document.getElementById('btn-reservar');
        if (resBtn) {
            resBtn.onclick = () => {
                if (typeof ReservationSystem !== 'undefined') {
                    ReservationSystem.openModal(id);
                } else {
                    console.error("ReservationSystem not loaded");
                }
            };
        }

        debug(`Detalle del local '${id}' renderizado premium.`);
    }
};


// ===========================
// COOKIE CONSENT SYSTEM
// ===========================
const CookieSystem = {
    CONSENT_KEY: 'rateflow_cookie_consent',

    init() {
        // Check if user has already made a choice
        if (!localStorage.getItem(this.CONSENT_KEY)) {
            // Wait a bit for UX before showing banner
            setTimeout(() => {
                this.renderBanner();
            }, 1500);
        }
    },

    renderBanner() {
        // Prevent duplicates
        if (document.querySelector('.cookie-banner')) return;

        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <div class="cookie-text">
                    <h4>🍪 Valoramos tu Privacidad</h4>
                    <p>Utilizamos cookies propias y de terceros para mejorar tu experiencia, analizar el tráfico y personalizar el contenido. 
                    Si las aceptas, nos ayudas a mantener el "Flow". Si las rechazas, solo usaremos las esenciales para que el sitio funcione.
                    <br><a href="cookies.html">Ver Política de Cookies</a></p>
                </div>
                <div class="cookie-actions">
                    <button class="btn-cookie reject" onclick="CookieSystem.reject()">Rechazar</button>
                    <button class="btn-cookie accept" onclick="CookieSystem.accept()">Aceptar Todas</button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        // Force reflow
        void banner.offsetWidth;

        // Activate animation
        requestAnimationFrame(() => {
            banner.classList.add('active');
        });
    },

    accept() {
        localStorage.setItem(this.CONSENT_KEY, 'accepted');
        this.closeBanner();

        // Notification
        if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.showToast({
                title: 'Cookies Aceptadas',
                message: '¡Gracias! Ahora disfrutarás de la experiencia completa.',
                icon: 'fa-cookie-bite',
                type: 'success'
            });
        }
    },

    reject() {
        localStorage.setItem(this.CONSENT_KEY, 'rejected');
        this.closeBanner();

        // Notification
        if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.showToast({
                title: 'Cookies Rechazadas',
                message: 'Entendido. Solo usaremos lo esencial.',
                icon: 'fa-shield-halved', // Updated icon
                type: 'success' // Keeping success style for neutral feedback
            });
        }
    },

    closeBanner() {
        const banner = document.querySelector('.cookie-banner');
        if (banner) {
            banner.classList.remove('active');
            setTimeout(() => {
                banner.remove();
            }, 600); // Match CSS transition
        }
    }
};

// Initialize Cookie System
document.addEventListener('DOMContentLoaded', () => {
    CookieSystem.init();
});

// Initialize other systems if needed (AuthManager is usually auto-init in usage or header script)
// But we can ensure init here too
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AuthManager !== 'undefined') AuthManager.init();
    if (typeof RatingSystem !== 'undefined') RatingSystem.init();
    if (typeof VenueDetailSystem !== 'undefined') VenueDetailSystem.init();
    if (typeof NotificationSystem !== 'undefined') NotificationSystem.init();
    if (typeof B2BSystem !== 'undefined') B2BSystem.init();
    if (typeof AdminSystem !== 'undefined' && window.location.pathname.includes('admin')) AdminSystem.init();
});

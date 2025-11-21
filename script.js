
const menuToggle = document.querySelector('.menu-toggle');
const navContent = document.querySelector('.nav-content');

menuToggle.addEventListener('click', () => {
    navContent.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navContent.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                if (link.getAttribute('href').substring(1) === entry.target.id) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    });
};

const sectionObserver = new IntersectionObserver(observerCallback, {
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
});

sections.forEach(section => {
    sectionObserver.observe(section);
});


const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.release-card, .video-item, .gallery-item, .collab-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

const collabItems = document.querySelectorAll('.collab-item');

collabItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        
        collabItems.forEach(el => el.classList.remove('active'));
        
        item.classList.add('active');
        
        console.log(`Colaboración ${index + 1} seleccionada`);
    });
});

const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    let scrollTop = window.scrollY;
    
    if (scrollTop > 100) {
        navbar.style.padding = '0.75rem 1.5rem';
    } else {
        navbar.style.padding = '1.5rem';
    }
    
    lastScrollTop = scrollTop;
});

const socialLinks = document.querySelectorAll('.social-link');

socialLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.social-icon');
        icon.style.transform = 'scale(1.1) rotate(5deg)';
    });
    
    link.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.social-icon');
        icon.style.transform = 'scale(1) rotate(0)';
    });
});

const staggerElements = () => {
    const sections = document.querySelectorAll('.video-item, .gallery-item');
    sections.forEach((element, index) => {
        element.style.transitionDelay = `${index * 0.1}s`;
    });
};

staggerElements();

const images = document.querySelectorAll('img');
images.forEach(img => {
    img.addEventListener('error', function() {
        console.error(`Error cargando imagen: ${this.src}`);
        this.style.backgroundColor = '#374151';
    });
});

const playAudio = (audioSrc) => {
    const audio = new Audio(audioSrc);
    audio.play().catch(error => {
        console.error('Error reproduciendo audio:', error);
    });
};

const isMobile = () => {
    return window.innerWidth <= 768;
};

window.addEventListener('resize', () => {
    const navContainer = document.querySelector('.nav-container');
    
    if (isMobile()) {
        navContainer.style.maxWidth = '100%';
    } else {
        navContainer.style.maxWidth = '500px';
    }
});

window.addEventListener('load', () => {
    const navContainer = document.querySelector('.nav-container');
    if (isMobile()) {
        navContainer.style.maxWidth = '100%';
    }
});

console.log('🎵 Página de TupacIGO cargada correctamente');

document.addEventListener('click', (e) => {
    // Cerrar menú móvil si se hace clic fuera
    if (e.target !== menuToggle && e.target !== navContent) {
        navContent.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navContent.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});

const init = () => {
    console.log('✨ Inicializando aplicación...');
    
    document.body.classList.add('loaded');
};

// ========== REPRODUCTOR DE MÚSICA ==========
class MusicPlayer {
    constructor() {
        this.currentTrack = 0;
        this.isPlaying = false;
        this.playlistItems = document.querySelectorAll('.playlist-item');
        this.audioPlayer = document.getElementById('audio-player');
        this.playBtn = document.getElementById('play-btn');
        this.prevBtn = document.querySelector('.prev-track');
        this.nextBtn = document.querySelector('.next-track');
        this.prevPlaylistBtn = document.querySelector('.prev-btn');
        this.nextPlaylistBtn = document.querySelector('.next-btn');
        this.currentTimeEl = document.querySelector('.current-time');
        this.durationEl = document.querySelector('.duration');
        this.progressSlider = document.querySelector('.progress-slider');
        this.progressFill = document.querySelector('.progress-fill');
        this.volumeSlider = document.querySelector('.volume-slider');
        this.currentTrackDisplay = document.querySelector('.current-track');
        this.totalTracksDisplay = document.querySelector('.total-tracks');

        this.init();
    }

    init() {
        // Event listeners para items de playlist
        this.playlistItems.forEach((item, index) => {
            item.addEventListener('click', () => this.selectTrack(index));
        });

        // Event listeners para controles
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.previousTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        this.prevPlaylistBtn.addEventListener('click', () => this.previousTrack());
        this.nextPlaylistBtn.addEventListener('click', () => this.nextTrack());
        this.progressSlider.addEventListener('input', (e) => this.seek(e));
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e));

        // Event listeners de audio
        this.audioPlayer.addEventListener('timeupdate', () => this.updateProgress());
        this.audioPlayer.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audioPlayer.addEventListener('ended', () => this.nextTrack());

        // Asegurar preload de metadata y seleccionar primera canción
        this.audioPlayer.preload = 'metadata';
        // Seleccionar primera canción
        this.selectTrack(0);
        this.updatePlaylistCounter();
        this.setVolume({ target: this.volumeSlider });
    }

    selectTrack(index) {
        if (index < 0 || index >= this.playlistItems.length) return;
        
        this.currentTrack = index;
        this.updatePlaylistUI();
        this.updateNowPlaying();
        this.updatePlaylistCounter();
        this.updatePlayingIndicator();
        
        const audioSrc = this.playlistItems[index].dataset.src;
        this.audioPlayer.src = audioSrc;
        // Reset UI/progress to start (defensive: evita que la barra aparezca "avanzada")
        try {
            this.audioPlayer.currentTime = 0;
        } catch (err) {
            // some browsers may throw if metadata not loaded yet — ignore
        }
        if (this.progressFill) this.progressFill.style.width = '0%';
        if (this.progressSlider) this.progressSlider.value = 0;
        if (this.currentTimeEl) this.currentTimeEl.textContent = '0:00';

        // Reproducir inmediatamente al seleccionar (clic del usuario)
        this.isPlaying = true;
        this.audioPlayer.play().catch(err => {
            // Si el autoplay es bloqueado, mantener la UI consistente
            console.warn('Autoplay blocked or play error:', err);
            this.isPlaying = false;
            this.updatePlayBtn();
        });
        this.updatePlayBtn();
        this.updatePlayingIndicator();
    }

    updatePlaylistUI() {
        this.playlistItems.forEach((item, index) => {
            if (index === this.currentTrack) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    updateNowPlaying() {
        const currentItem = this.playlistItems[this.currentTrack];
        const title = currentItem.querySelector('.item-title').textContent;
        const artist = currentItem.querySelector('.item-artist').textContent;
        const thumb = currentItem.querySelector('.item-thumbnail').src;

        document.querySelector('.now-playing-title').textContent = title;
        document.querySelector('.now-playing-artist').textContent = artist;
        document.querySelector('.now-playing-thumb').src = thumb;
    }

    updatePlaylistCounter() {
        this.currentTrackDisplay.textContent = this.currentTrack + 1;
        this.totalTracksDisplay.textContent = this.playlistItems.length;
    }

    togglePlay() {
        if (this.isPlaying) {
            this.audioPlayer.pause();
            this.isPlaying = false;
            this.updatePlayBtn();
        } else {
            this.audioPlayer.play();
            this.isPlaying = true;
            this.updatePlayBtn();
        }
        this.updatePlayingIndicator();
    }

    updatePlayBtn() {
        if (this.isPlaying) {
            this.playBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
        } else {
            this.playBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
        }
    }

    updatePlayingIndicator() {
        this.playlistItems.forEach((item, index) => {
            if (index === this.currentTrack && this.isPlaying) {
                item.classList.add('playing');
            } else {
                item.classList.remove('playing');
            }
        });
    }

    nextTrack() {
        if (this.currentTrack < this.playlistItems.length - 1) {
            this.selectTrack(this.currentTrack + 1);
        }
    }

    previousTrack() {
        if (this.currentTrack > 0) {
            this.selectTrack(this.currentTrack - 1);
        }
    }

    seek(e) {
        const percent = e.target.value;
        const duration = this.audioPlayer.duration;
        this.audioPlayer.currentTime = (percent / 100) * duration;
    }

    updateProgress() {
        if (this.audioPlayer.duration) {
            const percent = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
            this.progressFill.style.width = percent + '%';
            this.progressSlider.value = percent;
            this.currentTimeEl.textContent = this.formatTime(this.audioPlayer.currentTime);
        }
    }

    updateDuration() {
        this.durationEl.textContent = this.formatTime(this.audioPlayer.duration);
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    setVolume(e) {
        const volume = e.target.value;
        this.audioPlayer.volume = volume / 100;
        // Actualizar el gradiente del slider
        e.target.style.background = `linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) ${volume}%, #374151 ${volume}%, #374151 100%)`;
    }
}

// Ejecutar inicialización cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        init();
        if (document.querySelector('.playlist-item')) {
            new MusicPlayer();
        }
        // Inicializar galería de eventos después de DOMContentLoaded
        initEventGallery();
    });
} else {
    init();
    if (document.querySelector('.playlist-item')) {
        new MusicPlayer();
    }
    initEventGallery();
}

// ========== GALERÍA DE EVENTOS (IMG_* en carpeta imagenes) ==========
function initEventGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryModal = document.getElementById('gallery-modal');
    const galleryImagesEl = document.querySelector('.gallery-images');
    const btnClose = galleryModal && galleryModal.querySelector('.gallery-close');
    const btnPrev = galleryModal && galleryModal.querySelector('.gallery-prev');
    const btnNext = galleryModal && galleryModal.querySelector('.gallery-next');

    // Buscar todas las imágenes que empiezan con 'imagenes/IMG_' en la página
    const allImgs = Array.from(document.querySelectorAll('img')).filter(i => i.getAttribute('src') && i.getAttribute('src').match(/imagenes\/(IMG_.*)/i)).map(i => i.getAttribute('src').replace(/\\/g, '/'));

    if (!galleryModal || !galleryImagesEl || allImgs.length === 0) return;

    let currentIndex = 0;

    function openGallery(startIndex = 0) {
        galleryImagesEl.innerHTML = '';
        allImgs.forEach((src, idx) => {
            const slide = document.createElement('div');
            slide.className = 'gallery-slide';
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Foto ${idx + 1}`;
            slide.appendChild(img);
            galleryImagesEl.appendChild(slide);
        });
        currentIndex = startIndex >= 0 && startIndex < allImgs.length ? startIndex : 0;
        galleryModal.classList.add('open');
        galleryModal.setAttribute('aria-hidden', 'false');
        // esperar un tick y hacer scroll al slide
        setTimeout(() => {
            const slides = galleryImagesEl.querySelectorAll('.gallery-slide');
            if (slides[currentIndex]) slides[currentIndex].scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }, 60);
    }

    function closeGallery() {
        galleryModal.classList.remove('open');
        galleryModal.setAttribute('aria-hidden', 'true');
        galleryImagesEl.innerHTML = '';
    }

    function goTo(index) {
        const slides = galleryImagesEl.querySelectorAll('.gallery-slide');
        if (!slides.length) return;
        currentIndex = Math.max(0, Math.min(index, slides.length - 1));
        slides[currentIndex].scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }

    // Eventos en los items de evento: si el enlace apunta a '#' abrimos el modal,
    // si apunta a otra página (ej. 'gallery.html') dejamos que navegue normalmente.
    galleryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const href = item.getAttribute('href');
            if (!href || href === '#' || href.trim() === '') {
                e.preventDefault();
                const imgEl = item.querySelector('img');
                const src = imgEl ? imgEl.getAttribute('src').replace(/\\/g, '/') : null;
                const startIndex = src ? allImgs.indexOf(src) : 0;
                openGallery(startIndex);
            } else {
                // enlace a otra página (por ejemplo gallery.html) — permitir navegación
                return;
            }
        });
    });

    // Controles
    btnClose.addEventListener('click', closeGallery);
    galleryModal.querySelector('.gallery-backdrop').addEventListener('click', closeGallery);
    btnPrev.addEventListener('click', () => goTo(currentIndex - 1));
    btnNext.addEventListener('click', () => goTo(currentIndex + 1));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (galleryModal.classList.contains('open')) {
            if (e.key === 'Escape') closeGallery();
            if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
            if (e.key === 'ArrowRight') goTo(currentIndex + 1);
        }
    });
}

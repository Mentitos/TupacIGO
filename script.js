document.addEventListener('DOMContentLoaded', () => {
    fetch('_data/contenido.json')
        .then(response => response.json())
        .then(data => {
            render(data);
            initApp(data);
        })
        .catch(error => console.error('Error loading data:', error));
});

function render(data) {
    // Hero
    if (data.hero) {
        document.querySelector('.hero-image').src = data.hero.image;
        document.querySelector('.hero-content h1').textContent = data.hero.title;
    }

    // Latest Release
    if (data.latestRelease) {
        const latestRelease = data.latestRelease;
        document.querySelector('.release-video iframe').src = latestRelease.youtubeUrl;
        document.querySelector('.release-info h3').textContent = latestRelease.title;
        document.querySelector('.release-date').textContent = latestRelease.releaseDate;
        
        const creditsList = document.querySelector('.credits-list');
        creditsList.innerHTML = '';
        latestRelease.credits.forEach(credit => {
            const creditItem = document.createElement('p');
            creditItem.classList.add('credit-item');
            creditItem.innerHTML = `${credit.role}<br><span>${credit.name}</span>`;
            creditsList.appendChild(creditItem);
        });

        document.querySelector('.release-address').innerHTML = latestRelease.direction;

        const platformLinks = document.querySelector('.platform-links');
        platformLinks.innerHTML = '';
        latestRelease.platforms.forEach(platform => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = platform.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.setAttribute('aria-label', `Escuchar en ${platform.name}`);
            link.innerHTML = getPlatformIcon(platform.name);
            listItem.appendChild(link);
            platformLinks.appendChild(listItem);
        });
    }

    // Music
    if (data.music) {
        const musicSection = document.querySelector('.music-section .container');
        musicSection.querySelector('h2').textContent = data.music.title;
        const videosGrid = musicSection.querySelector('.videos-grid');
        videosGrid.innerHTML = '';
        data.music.videos.forEach(video => {
            const videoItem = document.createElement('div');
            videoItem.classList.add('video-item');
            videoItem.innerHTML = `<iframe src="${video.url}" title="${video.title}" 
                frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen></iframe>`;
            videosGrid.appendChild(videoItem);
        });
        musicSection.querySelector('.btn').href = data.music.seeMoreUrl;
    }

    // Collaborations
    if (data.collaborations) {
        const collaborationsSection = document.querySelector('.collaborations .container');
        collaborationsSection.querySelector('h2').textContent = data.collaborations.title;
        const playlist = collaborationsSection.querySelector('.playlist');
        playlist.innerHTML = '';
        data.collaborations.tracks.forEach((track, index) => {
            const playlistItem = document.createElement('li');
            playlistItem.classList.add('playlist-item');
            if (index === 0) playlistItem.classList.add('active');
            playlistItem.dataset.src = track.audioSrc;
            playlistItem.dataset.image = track.imageSrc;
            playlistItem.innerHTML = `
                <span class="item-number">${index + 1}</span>
                <img src="${track.imageSrc}" alt="${track.title}" class="item-thumbnail">
                <div class="item-info">
                    <div class="item-title">${track.title}</div>
                    <div class="item-artist">${track.artist}</div>
                </div>
            `;
            playlist.appendChild(playlistItem);
        });
    }

    // Gallery
    if (data.gallery) {
        const gallerySection = document.querySelector('.gallery .container');
        gallerySection.querySelector('h2').textContent = data.gallery.title;
        gallerySection.querySelector('p').textContent = data.gallery.description;
        const galleryGrid = gallerySection.querySelector('.gallery-grid');
        galleryGrid.innerHTML = '';
        data.gallery.events.forEach(event => {
            const galleryItem = document.createElement('a');
            galleryItem.href = 'gallery.html';
            galleryItem.classList.add('gallery-item');
            galleryItem.innerHTML = `
                <img src="${event.thumbnail}" alt="${event.name}">
                <div class="gallery-overlay">
                    <h3>${event.name}</h3>
                </div>
            `;
            galleryGrid.appendChild(galleryItem);
        });
    }

    // Social
    if (data.social) {
        const socialCard = document.querySelector('.social-card');
        socialCard.querySelector('.profile-image img').src = data.social.profileImage;
        socialCard.querySelector('.profile-info h1').textContent = data.social.name;
        socialCard.querySelector('.profile-title').textContent = data.social.title;
        socialCard.querySelector('.profile-bio').textContent = data.social.bio;
        const networksList = socialCard.querySelector('.networks-list');
        networksList.innerHTML = '';
        data.social.networks.forEach(network => {
            const link = document.createElement('a');
            link.href = network.url;
            link.target = '_blank';
            link.classList.add('social-link');
            link.innerHTML = `
                <div class="social-icon ${network.name.toLowerCase()}">
                    ${getPlatformIcon(network.name)}
                </div>
                <span>${network.name}</span>
            `;
            networksList.appendChild(link);
        });
    }

    // Footer
    if (data.footer) {
        document.querySelector('.footer-section:last-child p').textContent = data.footer.contactEmail;
    }
}

function getPlatformIcon(platformName) {
    const icons = {
        'YouTube': '<svg viewBox="0 0 576 512"><path fill="currentColor" d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path></svg>',
        'Spotify': '<svg viewBox="0 0 496 512"><path fill="currentColor" d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z"></path></svg>',
        'Instagram': '<svg viewBox="0 0 448 512"><path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg>',
        'TikTok': '<svg viewBox="0 0 448 512"><path fill="currentColor" d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"></path></svg>'
    };
    return icons[platformName] || '';
}

function initApp(data) {
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

    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        let scrollTop = window.scrollY;
        if (scrollTop > 100) {
            navbar.style.padding = '0.75rem 1.5rem';
        } else {
            navbar.style.padding = '1.5rem';
        }
    });

    document.querySelectorAll('.social-link').forEach(link => {
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

    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            console.error(`Error cargando imagen: ${this.src}`);
            this.style.backgroundColor = '#374151';
        });
    });

    if (document.querySelector('.playlist-item')) {
        new MusicPlayer(data.collaborations.tracks);
    }
    initEventGallery(data.gallery);
}

class MusicPlayer {
    constructor(tracks) {
        this.tracks = tracks;
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
        this.playlistItems.forEach((item, index) => {
            item.addEventListener('click', () => this.selectTrack(index));
        });

        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.previousTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        this.prevPlaylistBtn.addEventListener('click', () => this.previousTrack());
        this.nextPlaylistBtn.addEventListener('click', () => this.nextTrack());
        this.progressSlider.addEventListener('input', (e) => this.seek(e));
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e));

        this.audioPlayer.addEventListener('timeupdate', () => this.updateProgress());
        this.audioPlayer.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audioPlayer.addEventListener('ended', () => this.nextTrack());

        this.audioPlayer.preload = 'metadata';
        this.selectTrack(0);
        this.updatePlaylistCounter();
        this.setVolume({ target: this.volumeSlider });
    }

    selectTrack(index) {
        if (index < 0 || index >= this.tracks.length) return;
        
        this.currentTrack = index;
        this.updatePlaylistUI();
        this.updateNowPlaying();
        this.updatePlaylistCounter();
        this.updatePlayingIndicator();
        
        const audioSrc = this.tracks[index].audioSrc;
        this.audioPlayer.src = audioSrc;
        try {
            this.audioPlayer.currentTime = 0;
        } catch (err) {}
        if (this.progressFill) this.progressFill.style.width = '0%';
        if (this.progressSlider) this.progressSlider.value = 0;
        if (this.currentTimeEl) this.currentTimeEl.textContent = '0:00';

        this.isPlaying = true;
        this.audioPlayer.play().catch(err => {
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
        const currentItem = this.tracks[this.currentTrack];
        document.querySelector('.now-playing-title').textContent = currentItem.title;
        document.querySelector('.now-playing-artist').textContent = currentItem.artist;
        document.querySelector('.now-playing-thumb').src = currentItem.imageSrc;
    }

    updatePlaylistCounter() {
        this.currentTrackDisplay.textContent = this.currentTrack + 1;
        this.totalTracksDisplay.textContent = this.tracks.length;
    }

    togglePlay() {
        if (this.isPlaying) {
            this.audioPlayer.pause();
        } else {
            this.audioPlayer.play();
        }
        this.isPlaying = !this.isPlaying;
        this.updatePlayBtn();
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
        this.selectTrack((this.currentTrack + 1) % this.tracks.length);
    }

    previousTrack() {
        this.selectTrack((this.currentTrack - 1 + this.tracks.length) % this.tracks.length);
    }

    seek(e) {
        const percent = e.target.value;
        this.audioPlayer.currentTime = (percent / 100) * this.audioPlayer.duration;
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
        e.target.style.background = `linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) ${volume}%, #374151 ${volume}%, #374151 100%)`;
    }
}

function initEventGallery(galleryData) {
    const galleryModal = document.getElementById('gallery-modal');
    if (!galleryModal) return;

    const galleryImagesEl = galleryModal.querySelector('.gallery-images');
    const btnClose = galleryModal.querySelector('.gallery-close');
    const btnPrev = galleryModal.querySelector('.gallery-prev');
    const btnNext = galleryModal.querySelector('.gallery-next');

    let allImgs = [];
    if (galleryData && galleryData.events) {
        galleryData.events.forEach(event => {
            allImgs = allImgs.concat(event.images);
        });
    }
    
    if (allImgs.length === 0) return;

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

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const imgEl = item.querySelector('img');
            const src = imgEl ? imgEl.getAttribute('src').replace(/\/g, '/') : null;
            const startIndex = src ? allImgs.indexOf(src) : 0;
            openGallery(startIndex);
        });
    });

    btnClose.addEventListener('click', closeGallery);
    galleryModal.querySelector('.gallery-backdrop').addEventListener('click', closeGallery);
    btnPrev.addEventListener('click', () => goTo(currentIndex - 1));
    btnNext.addEventListener('click', () => goTo(currentIndex + 1));

    document.addEventListener('keydown', (e) => {
        if (galleryModal.classList.contains('open')) {
            if (e.key === 'Escape') closeGallery();
            if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
            if (e.key === 'ArrowRight') goTo(currentIndex + 1);
        }
    });
}
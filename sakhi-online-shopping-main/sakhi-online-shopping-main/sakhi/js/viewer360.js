// js/viewer360.js

class Viewer360 {
    constructor(containerId, product) {
        this.container = document.getElementById(containerId);
        this.product = product;
        
        // Gallery images
        this.images = product.gallery || [product.mainImage];
        this.is360Supported = this.images.length > 1;

        this.currentIndex = 0;
        this.isDragging = false;
        this.startX = 0;
        
        this.isAutoRotating = false;
        this.autoRotateInterval = null;
        this.isZoomed = false;
        this.isFullscreen = false;
        
        this.render();
        this.attachEvents();
    }

    render() {
        if (!this.container) return;

        let thumbnailsHtml = '';
        if (this.is360Supported) {
            thumbnailsHtml = this.images.map((img, idx) => {
                // Determine angle label based on index (assuming 8 images max for demo)
                const angles = ['FRONT', '45°', 'RIGHT', 'BACK RIGHT', 'BACK', 'BACK LEFT', 'LEFT', '45° LEFT'];
                const label = angles[idx % angles.length] || `Angle ${idx+1}`;
                return `
                    <div class="viewer-thumb-container ${idx === 0 ? 'active' : ''}" data-index="${idx}">
                        <div class="thumb-label">${label}</div>
                        <img src="${img}" class="viewer-thumb" data-index="${idx}" alt="${this.product.name} angle ${idx+1}">
                    </div>
                `;
            }).join('');
        }

        const fallbackHtml = !this.is360Supported ? `<div class="viewer-fallback-label">360° view unavailable</div>` : `<div class="viewer-drag-label">↔ Drag to rotate</div>`;

        this.container.innerHTML = `
            <div class="viewer-layout" id="viewer-layout">
                ${this.is360Supported ? `<div class="viewer-thumbnails">${thumbnailsHtml}</div>` : ''}
                
                <div class="viewer-main-container" id="viewer-main-container">
                    ${fallbackHtml}
                    <img src="${this.images[this.currentIndex]}" class="viewer-main-img" id="viewer-main-img" alt="${this.product.name}">
                    
                    <div class="viewer-nav-btns" style="${!this.is360Supported ? 'display:none;' : ''}">
                        <button id="viewer-prev" class="nav-btn">&lt;</button>
                        <button id="viewer-next" class="nav-btn">&gt;</button>
                    </div>

                    <div class="viewer-controls">
                        ${this.is360Supported ? `<button id="viewer-autorotate">▶ Auto Rotate</button>` : ''}
                        <button id="viewer-zoom">🔍 Zoom</button>
                        <button id="viewer-fullscreen">⛶ Fullscreen</button>
                    </div>
                </div>
            </div>
        `;
    }

    attachEvents() {
        const mainImg = this.container.querySelector('#viewer-main-img');
        const thumbs = this.container.querySelectorAll('.viewer-thumb-container');
        const prevBtn = this.container.querySelector('#viewer-prev');
        const nextBtn = this.container.querySelector('#viewer-next');
        const zoomBtn = this.container.querySelector('#viewer-zoom');
        const autoRotateBtn = this.container.querySelector('#viewer-autorotate');
        const fullscreenBtn = this.container.querySelector('#viewer-fullscreen');
        const containerArea = this.container.querySelector('#viewer-main-container');
        const dragLabel = this.container.querySelector('.viewer-drag-label');

        // Thumbnail clicks
        thumbs.forEach(thumb => {
            thumb.addEventListener('click', (e) => {
                const target = e.currentTarget;
                this.setIndex(parseInt(target.dataset.index));
                this.pauseAutoRotate();
            });
        });

        // Prev/Next
        if (prevBtn) prevBtn.addEventListener('click', () => { this.prev(); this.pauseAutoRotate(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { this.next(); this.pauseAutoRotate(); });

        // Auto Rotate
        if (autoRotateBtn) {
            autoRotateBtn.addEventListener('click', () => {
                this.isAutoRotating = !this.isAutoRotating;
                if (this.isAutoRotating) {
                    autoRotateBtn.innerText = "⏸ Pause";
                    this.autoRotateInterval = setInterval(() => this.next(), 600);
                } else {
                    this.pauseAutoRotate();
                }
            });
        }

        // Zoom (mouse track panning)
        if (zoomBtn) {
            zoomBtn.addEventListener('click', () => {
                this.isZoomed = !this.isZoomed;
                mainImg.style.transform = this.isZoomed ? 'scale(2)' : 'scale(1)';
                mainImg.style.cursor = this.isZoomed ? 'zoom-out' : (this.is360Supported ? 'grab' : 'default');
                if (this.isZoomed) this.pauseAutoRotate();
            });
            
            containerArea.addEventListener('mousemove', (e) => {
                if(!this.isZoomed) return;
                const rect = containerArea.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                mainImg.style.transformOrigin = `${(x / rect.width) * 100}% ${(y / rect.height) * 100}%`;
            });
        }

        // Fullscreen
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                const layout = this.container.querySelector('#viewer-layout');
                if (!document.fullscreenElement) {
                    layout.requestFullscreen().catch(err => {
                        alert(`Error attempting to enable fullscreen: ${err.message}`);
                    });
                    layout.classList.add('is-fullscreen');
                    fullscreenBtn.innerText = "⛶ Exit";
                } else {
                    document.exitFullscreen();
                    layout.classList.remove('is-fullscreen');
                    fullscreenBtn.innerText = "⛶ Fullscreen";
                }
            });

            document.addEventListener('fullscreenchange', () => {
                const layout = this.container.querySelector('#viewer-layout');
                if (!document.fullscreenElement) {
                    layout.classList.remove('is-fullscreen');
                    if(fullscreenBtn) fullscreenBtn.innerText = "⛶ Fullscreen";
                }
            });
        }

        // Mouse Drag / Touch Swipe for rotation (only if 360 supported)
        if (this.is360Supported) {
            const startDrag = (x) => {
                if(this.isZoomed) return;
                this.isDragging = true;
                this.startX = x;
                mainImg.style.cursor = 'grabbing';
                if(dragLabel) dragLabel.innerText = "Release to stop";
                this.pauseAutoRotate();
            };

            const onDrag = (x) => {
                if (!this.isDragging) return;
                const diff = x - this.startX;
                // Sensitivity
                if (Math.abs(diff) > 30) {
                    if (diff > 0) this.prev();
                    else this.next();
                    this.startX = x; 
                }
            };

            const stopDrag = () => {
                this.isDragging = false;
                if(!this.isZoomed) mainImg.style.cursor = 'grab';
                if(dragLabel) dragLabel.innerText = "↔ Drag to rotate";
            };

            // Desktop Mouse
            containerArea.addEventListener('mousedown', (e) => {
                // ignore button clicks
                if(e.target.tagName.toLowerCase() === 'button') return;
                startDrag(e.clientX);
            });
            window.addEventListener('mousemove', (e) => onDrag(e.clientX));
            window.addEventListener('mouseup', stopDrag);

            // Mobile Touch
            containerArea.addEventListener('touchstart', (e) => {
                if(e.target.tagName.toLowerCase() === 'button') return;
                startDrag(e.touches[0].clientX);
            });
            window.addEventListener('touchmove', (e) => {
                if (this.isDragging) e.preventDefault(); // prevent scroll
                onDrag(e.touches[0].clientX);
            }, {passive: false});
            window.addEventListener('touchend', stopDrag);
        }
    }

    pauseAutoRotate() {
        this.isAutoRotating = false;
        clearInterval(this.autoRotateInterval);
        const autoRotateBtn = this.container.querySelector('#viewer-autorotate');
        if (autoRotateBtn) autoRotateBtn.innerText = "▶ Auto Rotate";
    }

    setIndex(index) {
        if (this.images.length === 0) return;
        this.currentIndex = (index + this.images.length) % this.images.length;
        this.updateView();
    }

    next() {
        this.setIndex(this.currentIndex + 1);
    }

    prev() {
        this.setIndex(this.currentIndex - 1);
    }

    updateView() {
        const mainImg = this.container.querySelector('#viewer-main-img');
        const thumbs = this.container.querySelectorAll('.viewer-thumb-container');
        
        mainImg.src = this.images[this.currentIndex];
        
        thumbs.forEach(t => t.classList.remove('active'));
        if(thumbs[this.currentIndex]) {
            thumbs[this.currentIndex].classList.add('active');
            thumbs[this.currentIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
}

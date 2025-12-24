// Elements
const iframe = document.getElementById('iframe');
const errorMessage = document.getElementById('error-message');
const statusIcon = document.getElementById('status-icon');
const statusText = document.getElementById('status-text');
const retryBtn = document.getElementById('retry-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const lastUpdateEl = document.getElementById('last-update');

// Deteksi perangkat
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

// Fungsi utama untuk cek koneksi
function checkConnection() {
    const isOnline = navigator.onLine;
    
    if (isOnline) {
        // Mode online
        iframe.style.display = 'block';
        errorMessage.style.display = 'none';
        statusIcon.className = 'status-icon online';
        statusIcon.textContent = '●';
        statusText.textContent = 'Terhubung';
        
        // Update waktu terakhir
        updateLastUpdateTime();
        
        // Coba reload iframe jika sebelumnya error
        if (iframe.src && !iframe.src.includes('#')) {
            iframe.src = iframe.src;
        }
    } else {
        // Mode offline
        iframe.style.display = 'none';
        errorMessage.style.display = 'block';
        statusIcon.className = 'status-icon offline';
        statusIcon.textContent = '●';
        statusText.textContent = 'Terputus';
    }
    
    // Optimasi untuk iOS
    if (isIOS) {
        document.body.style.webkitOverflowScrolling = 'touch';
        document.documentElement.style.height = '100%';
        document.body.style.height = '100%';
    }
}

// Update waktu terakhir
function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    lastUpdateEl.textContent = `Update: ${timeString}`;
}

// Fungsi fullscreen
function openFullscreen() {
    const elem = document.documentElement;
    
    if (isMobile) {
        // Untuk mobile, gunakan screen orientation jika tersedia
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(() => {
                // Fallback ke fullscreen biasa
                requestFullscreen(elem);
            });
        } else {
            requestFullscreen(elem);
        }
    } else {
        requestFullscreen(elem);
    }
    
    function requestFullscreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }
}

// Fungsi exit fullscreen
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

// Cek perubahan fullscreen
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

function handleFullscreenChange() {
    const isFullscreen = document.fullscreenElement || 
                        document.webkitFullscreenElement || 
                        document.msFullscreenElement;
    
    // Update tombol fullscreen
    if (fullscreenBtn) {
        fullscreenBtn.innerHTML = isFullscreen ? 
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 9l6 6m0-6l-6 6"/><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' :
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>';
    }
}

// Event Listeners
if (retryBtn) {
    retryBtn.addEventListener('click', () => {
        retryBtn.textContent = 'Memuat ulang...';
        setTimeout(() => {
            checkConnection();
            retryBtn.textContent = 'COBA LAGI';
        }, 1000);
    });
}

if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', openFullscreen);
}

// Event untuk perubahan koneksi
window.addEventListener('online', () => {
    statusText.textContent = 'Menyambungkan...';
    setTimeout(checkConnection, 500);
});

window.addEventListener('offline', () => {
    statusText.textContent = 'Memutuskan...';
    setTimeout(checkConnection, 500);
});

// Optimasi untuk touch devices
if (isMobile) {
    // Prevent zoom on double tap
    document.addEventListener('dblclick', (e) => {
        e.preventDefault();
    }, { passive: false });
    
    // Better touch handling
    document.addEventListener('touchstart', () => {}, { passive: true });
    
    // Prevent pull-to-refresh on mobile
    document.addEventListener('touchmove', (e) => {
        if (e.scale !== 1) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Cek koneksi secara berkala
setInterval(checkConnection, 600000);

// Inisialisasi pertama kali
document.addEventListener('DOMContentLoaded', () => {
    checkConnection();
    updateLastUpdateTime();
    
    // Auto fullscreen untuk mobile saat pertama kali (opsional)
    if (isMobile && window.innerWidth < 768) {
        setTimeout(() => {
            if (!document.fullscreenElement) {
                document.body.click();
            }
        }, 1000);
    }
});

// Handle visibility change (tab switching)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        checkConnection();
    }
});

// Handle orientation change
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        iframe.style.height = `${window.innerHeight - 120}px`;
    }, 300);
});


const iframe = document.getElementById('iframe');
const errorMessage = document.getElementById('error-message');

function checkConnection() {
    if (navigator.onLine) {
        errorMessage.style.display = 'none';
        iframe.style.display = 'block';
    } else {
        iframe.style.display = 'none';
        errorMessage.style.display = 'block';
    }
}

checkConnection();

window.addEventListener('online', () => location.reload());
window.addEventListener('offline', checkConnection);

// 🔽 Tambahan untuk minta fullscreen saat interaksi pertama
function openFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
}

// Jalankan fullscreen saat pertama kali halaman diklik
document.addEventListener('click', function triggerFullscreenOnce() {
    openFullscreen();
    document.removeEventListener('click', triggerFullscreenOnce);
});
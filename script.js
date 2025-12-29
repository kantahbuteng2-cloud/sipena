// Pastikan iframe selalu menyesuaikan tinggi layar
window.addEventListener("resize", setIframeHeight);
window.addEventListener("load", setIframeHeight);


function setIframeHeight() {
const iframe = document.getElementById("sipenaFrame");
iframe.style.height = window.innerHeight + "px";
}

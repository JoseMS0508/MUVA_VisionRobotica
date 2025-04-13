
document.addEventListener('DOMContentLoaded', function() {
  // Animación simple para los elementos que aparecen en la página
  const animateElements = document.querySelectorAll('.blog-post-card, .prose h1, .prose h2, .prose h3');
  
  animateElements.forEach((element, index) => {
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 100 * index);
  });
  
  // Comportamiento para videos - reproducir/pausar al hacer clic
  const videos = document.querySelectorAll('video');
  
  videos.forEach(video => {
    video.addEventListener('click', function() {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  });
  
  // Mejora la experiencia de navegación haciendo que los enlaces externos se abran en una nueva pestaña
  const externalLinks = document.querySelectorAll('a[href^="http"]');
  
  externalLinks.forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
});

// Función para volver al inicio
function goHome() {
  window.location.href = 'index.html';
}
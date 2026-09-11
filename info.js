
function scrollToCards() {
    // Buscar la sección de cards (ajusta el selector según tu HTML)
    const cardsSection = document.querySelector('.cards-container') || 
                        document.querySelector('.advantage-cards') || 
                        document.querySelector('[class*="card"]').parentElement;
    
    if (cardsSection) {
        // Scroll suave hacia los cards
        cardsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Efecto visual opcional: destacar cards brevemente
        setTimeout(() => {
            cardsSection.style.transform = 'scale(1.02)';
            cardsSection.style.transition = 'transform 0.3s ease';
            
            setTimeout(() => {
                cardsSection.style.transform = 'scale(1)';
            }, 300);
        }, 500);
    }
}

// Opcional: Detectar cuando los cards están visibles
window.addEventListener('scroll', function() {
    const readMoreBtn = document.querySelector('.read-more-btn');
    const cardsSection = document.querySelector('.cards-container') || 
                        document.querySelector('.advantage-cards') || 
                        document.querySelector('[class*="card"]').parentElement;
    
    if (readMoreBtn && cardsSection) {
        const cardsRect = cardsSection.getBoundingClientRect();
        const isVisible = cardsRect.top < window.innerHeight && cardsRect.bottom > 0;
        
        // Ocultar botón cuando los cards están visibles
        if (isVisible) {
            readMoreBtn.style.opacity = '0.5';
            readMoreBtn.style.transform = 'scale(0.9)';
        } else {
            readMoreBtn.style.opacity = '1';
            readMoreBtn.style.transform = 'scale(1)';
        }
    }
});


function unlockAudio() {
    localStorage.setItem("audioUnlocked", "true");
}

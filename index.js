// Mensaje en consola
console.log(`
🚀 KAIZEN Loader Iniciado
✨ Características:
   • Gradiente animado de fondo
   • Spinner con efectos de luz
   • Letras K-A-I-Z-E-N con animación secuencial
   • Partículas flotantes
   • Barra de progreso animada
   • Efectos de brillo
   • Completamente responsivo
   • Redirección automática después de 8 segundos
`);

// Agregar efecto de brillo a las letras después de que aparezcan
setTimeout(() => {
    const letters = document.querySelectorAll('.letter');
    letters.forEach((letter, index) => {
        setTimeout(() => {
            letter.classList.add('shine');
            setTimeout(() => {
                letter.classList.remove('shine');
            }, 1000);
        }, index * 200);
    });
}, 4000);

// Simular carga completa y redirección
setTimeout(() => {
    // ✅ CORREGIDO: querySelector sin espacios
    const loadingText = document.querySelector('.loading-text');
    if (loadingText) {
        loadingText.textContent = '¡LISTO! BIENVENIDO DISFRUTE DE ESTA AVENTURA ...';
    }
    
    // Efecto de fade out
    setTimeout(() => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 2s ease-out';
        
        // 🔥 REDIRECCIÓN CORREGIDA - Cambia por tu archivo de login
        setTimeout(() => {
            window.location.href = 'registro.html'; // ← AQUÍ VA TU LOGIN
        }, 1000);
    }, 1000);
}, 8000); // 8 segundos total de carga

// Efecto de partículas adicionales al hacer clic
document.addEventListener('click', (e) => {
    createClickParticles(e.clientX, e.clientY);
});

function createClickParticles(x, y) {
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${x}px;
            top: ${y}px;
        `;
        
        document.body.appendChild(particle);
        
        const angle = (i * 60) * Math.PI / 180;
        const velocity = 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let posX = x;
        let posY = y;
        let opacity = 1;
        
        const animate = () => {
            posX += vx * 0.02;
            posY += vy * 0.02;
            opacity -= 0.02;
            
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        animate();
    }
}

// Prevenir errores si no se encuentra algún elemento
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ KAIZEN Loader cargado correctamente');
    
    // Verificar que todos los elementos existan
    const requiredElements = [
        '.loader-container',
        '.kaizen-text',
        '.loading-text',
        '.progress-bar'
    ];
    
    requiredElements.forEach(selector => {
        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`⚠️ Elemento no encontrado: ${selector}`);
        }
    });
});
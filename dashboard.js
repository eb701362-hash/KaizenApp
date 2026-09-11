        // Manejar click en el círculo con ondas ÉPICAS
        function handleCircleClick() {
            console.log('🌊 CÍRCULO CLICKEADO - ONDAS MASIVAS ACTIVADAS');
            
            const circle = document.getElementById('waveCircle');
            const overlay = document.getElementById('transitionOverlay');
            
            // Crear múltiples ondas de click
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    const clickWave = document.createElement('div');
                    clickWave.className = 'multi-click-wave';
                    circle.appendChild(clickWave);
                    
                    // Limpiar onda después de la animación
                    setTimeout(() => {
                        if (clickWave.parentNode) {
                            clickWave.parentNode.removeChild(clickWave);
                        }
                    }, 1500);
                }, i * 100);
            }
            
            // Efecto de vibración y escala en el círculo
            circle.style.animation = 'none';
            circle.style.transform = 'scale(1.3)';
            
            setTimeout(() => {
                circle.style.transform = 'scale(1)';
                circle.style.animation = '';
            }, 300);
            
            // Mostrar overlay de transición con delay
            setTimeout(() => {
                overlay.classList.add('active');
                
                // Redireccionar después de la animación
                setTimeout(() => {
                    // 🚀 AQUÍ CAMBIA POR TU PÁGINA DESTINO
                    window.location.href = 'panel.html';
                }, 1800);
            }, 600);
        }

        // Efectos adicionales de mouse
        document.addEventListener('mousemove', (e) => {
            const circle = document.getElementById('waveCircle');
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            
            circle.style.transform = `translate(${x}px, ${y}px)`;
        });

        // Efecto de respiración en el círculo
        setInterval(() => {
            const circle = document.getElementById('waveCircle');
            circle.style.boxShadow = `
                0 0 ${60 + Math.sin(Date.now() * 0.003) * 20}px rgba(102, 126, 234, 0.6),
                0 0 ${120 + Math.sin(Date.now() * 0.003) * 40}px rgba(118, 75, 162, 0.4),
                0 0 ${180 + Math.sin(Date.now() * 0.003) * 60}px rgba(240, 147, 251, 0.3)
            `;
        }, 50);

        // Mensaje en consola
        console.log(`
🌊 Dashboard KAIZEN - Solo Círculo
✨ Características ÉPICAS:
   • Fondo oscuro minimalista
   • Círculo central con gradiente animado
   • 5 ondas constantes expandiéndose
   • Efecto de click con ondas múltiples
   • Respiración dinámica del círculo
   • Efecto parallax sutil con mouse
   • Transición suave a nueva pantalla
   • Diseño completamente responsivo

🚀 Haz click en el círculo para activar las ondas masivas
        `);
        function sendForm(e) {
            e.preventDefault();
            const toast = document.getElementById('toast');
            toast.innerHTML = '<span>✅</span> ¡Mensaje enviado con éxito! Te contactaremos pronto.';
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 4000);
            e.target.reset();
        }

        function openAdvisor() {
            const toast = document.getElementById('toast');
            toast.innerHTML = '<span>🎧</span> ¡Conectando con un asesor! Te contactaremos en breve.';
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 4000);
        }
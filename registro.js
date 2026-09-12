// Configuración del sistema
const APP_CONFIG = {
    ANIMATION_DURATION: 300,
    TOAST_DURATION: 4000,
    PASSWORD_MIN_LENGTH: 8,
    USERNAME_MIN_LENGTH: 3,
    STORAGE_KEY: 'authflow_users',
    VALIDATION_DELAY: 300,
    VERIFICATION_EXPIRY: 15 * 60 * 1000 // 15 minutos
};

// Configuración de EmailJS - TUS DATOS REALES
const EMAIL_CONFIG = {
    SERVICE_ID: 'service_coihh3e',      // ✅ Tu Service ID
    TEMPLATE_ID: 'template_ust2lox',    // ✅ Tu Template ID
    PUBLIC_KEY: 'pUIQpqxr69yHsM8m1'     // ✅ Tu Public Key
};

console.log('🚀 AuthFlow JavaScript iniciado');
console.log('📧 EmailJS Config:', EMAIL_CONFIG);

// Clase para manejar notificaciones Toast
class ToastNotification {
    constructor() {
        this.container = this.createContainer();
        this.toasts = new Map();
    }

    createContainer() {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 400px;
            `;
            document.body.appendChild(container);
        }
        return container;
    }

    show(message, type = 'info', duration = APP_CONFIG.TOAST_DURATION) {
        console.log(`📢 ${type.toUpperCase()}: ${message}`);
        
        const id = Date.now().toString();
        const toast = this.createToast(message, type, id);
        
        this.container.appendChild(toast);
        this.toasts.set(id, toast);
        
        // Mostrar con animación
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
            toast.style.opacity = '1';
        });
        
        // Auto-remover
        setTimeout(() => {
            this.remove(id);
        }, duration);
        
        return id;
    }

    createToast(message, type, id) {
        const toast = document.createElement('div');
        toast.dataset.id = id;
        
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        toast.style.cssText = `
            background: ${colors[type] || colors.info};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-weight: 500;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            max-width: 350px;
            word-wrap: break-word;
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        toast.innerHTML = `
            <span style="font-size: 16px;">${icons[type] || icons.info}</span>
            <span style="flex: 1;">${message}</span>
            <span style="font-size: 18px; cursor: pointer; opacity: 0.7; hover: opacity: 1;" onclick="authApp.toast.remove('${id}')">&times;</span>
        `;
        
        // Click para cerrar
        toast.addEventListener('click', () => {
            this.remove(id);
        });
        
        return toast;
    }

    remove(id) {
        const toast = this.toasts.get(id);
        if (toast) {
            toast.style.transform = 'translateX(100%)';
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
                this.toasts.delete(id);
            }, 300);
        }
    }

    clear() {
        this.toasts.forEach((toast, id) => {
            this.remove(id);
        });
    }
}

// Clase para validaciones
class FormValidator {
    static isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    static isValidPassword(password) {
        // Al menos 8 caracteres, una mayúscula, una minúscula y un número
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    }

    static getPasswordStrength(password) {
        let score = 0;
        let feedback = [];

        if (password.length >= 8) score++;
        else feedback.push('Al menos 8 caracteres');

        if (/[a-z]/.test(password)) score++;
        else feedback.push('Una letra minúscula');

        if (/[A-Z]/.test(password)) score++;
        else feedback.push('Una letra mayúscula');

        if (/\d/.test(password)) score++;
        else feedback.push('Un número');

        if (/[@$!%*?&]/.test(password)) score++;
        else feedback.push('Un carácter especial');

        const levels = ['weak', 'weak', 'fair', 'good', 'strong'];
        const labels = ['Muy débil', 'Débil', 'Regular', 'Buena', 'Fuerte'];
        
        return {
            score,
            level: levels[score] || 'weak',
            label: labels[score] || 'Muy débil',
            feedback,
            percentage: Math.min((score / 5) * 100, 100)
        };
    }

    static isValidName(name) {
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,30}$/;
        return regex.test(name.trim());
    }
}

// Clase para efectos visuales
class UIEffects {
    static showLoading(message = 'Procesando...') {
        let overlay = document.getElementById('loadingOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loadingOverlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(4px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            overlay.innerHTML = `
                <div style="
                    text-align: center;
                    padding: 30px;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 20px 25px rgba(0,0,0,0.1);
                    max-width: 300px;
                ">
                    <div style="
                        width: 40px;
                        height: 40px;
                        border: 4px solid #e2e8f0;
                        border-top: 4px solid #3949ee;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 20px;
                    "></div>
                    <p id="loadingText" style="
                        color: #64748b;
                        font-weight: 500;
                        margin: 0;
                    ">${message}</p>
                </div>
            `;
            
            document.body.appendChild(overlay);
        }
        
        const loadingText = overlay.querySelector('#loadingText');
        if (loadingText) {
            loadingText.textContent = message;
        }
        
        overlay.style.display = 'flex';
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });
    }

    static hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    }

    static addButtonLoading(button) {
        if (!button) return;
        button.classList.add('loading');
        button.disabled = true;
        
        // Agregar spinner si no existe
        if (!button.querySelector('.btn-loader')) {
            const loader = document.createElement('div');
            loader.className = 'btn-loader';
            loader.style.cssText = `
                position: absolute;
                width: 20px;
                height: 20px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top: 2px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            button.appendChild(loader);
        }
        
        const span = button.querySelector('span');
        const loader = button.querySelector('.btn-loader');
        
        if (span) span.style.opacity = '0';
        if (loader) loader.style.opacity = '1';
    }

    static removeButtonLoading(button) {
        if (!button) return;
        button.classList.remove('loading');
        button.disabled = false;
        
        const span = button.querySelector('span');
        const loader = button.querySelector('.btn-loader');
        
        if (span) span.style.opacity = '1';
        if (loader) loader.style.opacity = '0';
    }

    static switchTab(targetTab) {
        console.log('🔄 Cambiando a tab:', targetTab);
        
        // Actualizar botones
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === targetTab) {
                btn.classList.add('active');
            }
        });

        // Actualizar contenido
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
            if (content.id === `${targetTab}Tab`) {
                content.classList.add('active');
            }
        });
    }

    static showModal(modal) {
        if (!modal) return;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    static hideModal(modal) {
        if (!modal) return;
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    static updateValidationIcon(container, isValid) {
        if (!container) return;
        
        let icon = container.querySelector('.validation-icon');
        if (!icon) {
            icon = document.createElement('div');
            icon.className = 'validation-icon';
            icon.style.cssText = `
                position: absolute;
                right: 3rem;
                top: 50%;
                transform: translateY(-50%);
                margin-top: 12px;
                opacity: 0;
                transition: all 0.3s ease;
                font-family: "Font Awesome 6 Free";
                font-weight: 900;
            `;
            container.appendChild(icon);
        }
        
        if (isValid !== null) {
            icon.style.opacity = '1';
            if (isValid) {
                icon.style.color = '#10b981';
                icon.textContent = '✓';
            } else {
                icon.style.color = '#ef4444';
                icon.textContent = '✗';
            }
        } else {
            icon.style.opacity = '0';
        }
    }

    static setInputState(container, state) {
        if (!container) return;
        
        const input = container.querySelector('input');
        if (!input) return;
        
        // Remover clases anteriores
        input.classList.remove('success', 'error');
        
        if (state === 'success') {
            input.style.borderColor = '#10b981';
            input.style.backgroundColor = 'rgba(16, 185, 129, 0.05)';
        } else if (state === 'error') {
            input.style.borderColor = '#ef4444';
            input.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
        } else {
            input.style.borderColor = '#e2e8f0';
            input.style.backgroundColor = '#ffffff';
        }
    }
}

// Clase para almacenamiento
class UserStorage {
    static getUsers() {
        try {
            return JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEY)) || [];
        } catch (error) {
            console.error('Error al leer usuarios:', error);
            return [];
        }
    }

    static saveUsers(users) {
        try {
            localStorage.setItem(APP_CONFIG.STORAGE_KEY, JSON.stringify(users));
            return true;
        } catch (error) {
            console.error('Error al guardar usuarios:', error);
            return false;
        }
    }

    static userExists(email) {
        const users = this.getUsers();
        return users.some(user => user.email.toLowerCase() === email.toLowerCase());
    }

    static authenticateUser(email, password) {
        const users = this.getUsers();
        return users.find(user => 
            user.email.toLowerCase() === email.toLowerCase() && 
            user.password === password
        );
    }

    static registerUser(userData) {
        const users = this.getUsers();
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            registrationDate: new Date().toISOString(),
            lastLogin: null,
            isActive: true
        };
        
        users.push(newUser);
        return this.saveUsers(users);
    }

    static updateLastLogin(userId) {
        const users = this.getUsers();
        const userIndex = users.findIndex(user => user.id === userId);
        
        if (userIndex !== -1) {
            users[userIndex].lastLogin = new Date().toISOString();
            this.saveUsers(users);
        }
    }

    static updateUser(email, updates) {
        const users = this.getUsers();
        const userIndex = users.findIndex(user => user.email.toLowerCase() === email.toLowerCase());
        
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
            return this.saveUsers(users);
        }
        return false;
    }

    static deleteUser(email) {
        const users = this.getUsers();
        const filteredUsers = users.filter(user => user.email.toLowerCase() !== email.toLowerCase());
        return this.saveUsers(filteredUsers);
    }

    static clearAllUsers() {
        localStorage.removeItem(APP_CONFIG.STORAGE_KEY);
        return true;
    }
}

// Clase principal de la aplicación
class AuthFlowApp {
    constructor() {
        this.toast = new ToastNotification();
        this.validationTimeouts = new Map();
        console.log('🚀 AuthFlowApp iniciado');
        this.init();
    }

    init() {
        console.log('🔧 Inicializando aplicación...');
        this.initializeEmailJS();
        this.setupEventListeners();
        this.setupValidation();
        this.setupPasswordToggles();
        this.initializeTestUsers();
        this.addCustomStyles();
        this.toast.show('Sistema Kaizen cargado correctamente', 'success');
    }

    // Inicializar EmailJS
    initializeEmailJS() {
        try {
            if (typeof emailjs !== 'undefined') {
                emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
                console.log('✅ EmailJS inicializado correctamente');
            } else {
                throw new Error('EmailJS no está disponible');
            }
        } catch (error) {
            console.error('❌ Error inicializando EmailJS:', error);
            this.toast.show('Error inicializando servicio de email: ' + error.message, 'error');
        }
    }

    // Agregar estilos CSS dinámicamente
    addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .submit-btn.loading span {
                opacity: 0 !important;
            }
            
            .submit-btn.loading .btn-loader {
                opacity: 1 !important;
            }
            
            .code-input.invalid {
                border-color: #ef4444 !important;
                background: rgba(239, 68, 68, 0.05) !important;
                animation: shake 0.5s ease-in-out;
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            .verification-icon {
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        console.log('🔧 Configurando event listeners...');
        
        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.tab;
                UIEffects.switchTab(target);
            });
        });

        // Formulario de registro
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('📝 Formulario de registro enviado');
                this.handleRegister();
            });
            console.log('✅ Event listener de registro configurado');
        }

        // Formulario de login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('🔐 Formulario de login enviado');
                this.handleLogin();
            });
            console.log('✅ Event listener de login configurado');
        }

        // Modal de verificación
        this.setupVerificationModal();

        // Botones sociales
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const provider = btn.classList.contains('google-btn') ? 'Google' : 'Apple';
                this.handleSocialLogin(provider);
            });
        });

        // Enlace de contraseña olvidada
        const forgotLink = document.getElementById('forgotLink');
        if (forgotLink) {
            forgotLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });
        }

        // Cerrar modal con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('verificationModal');
                if (modal && modal.classList.contains('show')) {
                    UIEffects.hideModal(modal);
                }
            }
        });

        console.log('✅ Todos los event listeners configurados');
    }

    setupVerificationModal() {
        // Botón de verificación
        const verifyBtn = document.getElementById('verifyCodeBtn');
        if (verifyBtn) {
            verifyBtn.addEventListener('click', () => {
                console.log('🔍 Botón de verificación clickeado');
                const email = document.getElementById('verificationEmail')?.textContent;
                this.verifyCode(email);
            });
        }

        // Botón de reenvío
        const resendBtn = document.getElementById('resendCodeBtn');
        if (resendBtn) {
            resendBtn.addEventListener('click', () => {
                console.log('🔄 Botón de reenvío clickeado');
                const email = document.getElementById('verificationEmail')?.textContent;
                this.resendVerificationCode(email);
            });
        }

        // Auto-verificar cuando se complete el código
        const codeInput = document.getElementById('verificationCode');
        if (codeInput) {
            codeInput.addEventListener('input', (e) => {
                const code = e.target.value.replace(/\D/g, ''); // Solo números
                e.target.value = code;
                
                // Remover clase de error al escribir
                e.target.classList.remove('invalid');
                
                if (code.length === 6) {
                    const email = document.getElementById('verificationEmail')?.textContent;
                    setTimeout(() => this.verifyCode(email), 500);
                }
            });

            // Permitir solo números
            codeInput.addEventListener('keypress', (e) => {
                if (!/\d/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter'].includes(e.key)) {
                    e.preventDefault();
                }
            });
        }
    }

    setupValidation() {
        // Validación en tiempo real para registro
        const validationFields = [
            { element: document.getElementById('firstName'), validator: FormValidator.isValidName },
            { element: document.getElementById('lastName'), validator: FormValidator.isValidName },
            { element: document.getElementById('registerEmail'), validator: FormValidator.isValidEmail },
            { element: document.getElementById('registerPassword'), validator: FormValidator.isValidPassword },
            { element: document.getElementById('confirmPassword'), validator: (value) => {
                const password = document.getElementById('registerPassword')?.value || '';
                return value === password && value.length > 0;
            }}
        ];

        validationFields.forEach(({ element, validator }) => {
            if (!element) return;

            element.addEventListener('input', () => {
                this.debounceValidation(element, validator);
            });

            element.addEventListener('blur', () => {
                this.validateField(element, validator);
            });
        });

        // Validación especial para contraseña
        const passwordField = document.getElementById('registerPassword');
        if (passwordField) {
            passwordField.addEventListener('input', (e) => {
                this.updatePasswordStrength(e.target.value, e.target.parentElement);
            });
        }

        // Validación de confirmación de contraseña
        const confirmField = document.getElementById('confirmPassword');
        if (confirmField) {
            confirmField.addEventListener('input', () => {
                const password = document.getElementById('registerPassword')?.value || '';
                const confirm = confirmField.value || '';
                const isValid = confirm === password && confirm.length > 0;
                
                UIEffects.updateValidationIcon(confirmField.parentElement, 
                    confirm.length > 0 ? isValid : null);
            });
        }
    }

    debounceValidation(element, validator) {
        const key = element.id;
        
        if (this.validationTimeouts.has(key)) {
            clearTimeout(this.validationTimeouts.get(key));
        }

        const timeout = setTimeout(() => {
            this.validateField(element, validator);
            this.validationTimeouts.delete(key);
        }, APP_CONFIG.VALIDATION_DELAY);

        this.validationTimeouts.set(key, timeout);
    }

    validateField(element, validator) {
        if (!element) return null;
        
        const value = element.value.trim();
        const container = element.parentElement;
        
        if (value.length === 0) {
            UIEffects.setInputState(container, '');
            UIEffects.updateValidationIcon(container, null);
            return null;
        }

        const isValid = validator(value);
        UIEffects.setInputState(container, isValid ? 'success' : 'error');
        UIEffects.updateValidationIcon(container, isValid);
        
        return isValid;
    }

    updatePasswordStrength(password, container) {
        const strength = FormValidator.getPasswordStrength(password);
        const strengthElement = container.querySelector('.password-strength');
        
        if (!strengthElement) return;
        
        const strengthFill = strengthElement.querySelector('.strength-fill');
        const strengthText = strengthElement.querySelector('.strength-text');
        
        if (!strengthFill || !strengthText) return;
        
        // Remover clases anteriores
        strengthElement.className = 'password-strength';
        
        if (password.length > 0) {
            strengthElement.classList.add(`strength-${strength.level}`);
            strengthText.textContent = `${strength.label} (${Math.round(strength.percentage)}%)`;
            strengthFill.style.width = `${strength.percentage}%`;
            
            // Colores según el nivel
            const colors = {
                weak: '#ef4444',
                fair: '#f59e0b',
                good: '#3b82f6',
                strong: '#10b981'
            };
            strengthFill.style.backgroundColor = colors[strength.level] || colors.weak;
            
            if (strength.feedback.length > 0) {
                strengthText.title = `Falta: ${strength.feedback.join(', ')}`;
            } else {
                strengthText.title = '¡Contraseña segura!';
            }
        } else {
            strengthText.textContent = 'Seguridad de la contraseña';
            strengthText.title = '';
            strengthFill.style.width = '0%';
        }
    }

    setupPasswordToggles() {
        document.querySelectorAll('.password-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const targetId = toggle.dataset.target;
                const input = document.getElementById(targetId);
                const icon = toggle.querySelector('i');
                
                if (!input || !icon) return;
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.className = 'fas fa-eye-slash';
                } else {
                    input.type = 'password';
                    icon.className = 'fas fa-eye';
                }
            });
        });
    }

    // Generar código de verificación
    generateVerificationCode() {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        console.log('🔢 Código generado:', code);
        return code;
    }

    // Enviar email de verificación
    async sendVerificationEmail(email, firstName, code) {
        console.log('📧 Intentando enviar email a:', email);
        console.log('📧 Código:', code);
        
        try {
            const templateParams = {
                to_email: email,
                to_name: firstName,
                verification_code: code,
                from_name: 'AuthFlow'
            };

            console.log('📧 Parámetros del template:', templateParams);

            const result = await emailjs.send(
                EMAIL_CONFIG.SERVICE_ID,
                EMAIL_CONFIG.TEMPLATE_ID,
                templateParams,
                EMAIL_CONFIG.PUBLIC_KEY
            );

            console.log('✅ Email enviado exitosamente:', result);
            return true;
        } catch (error) {
            console.error('❌ Error enviando email:', error);
            return false;
        }
    }

    // Mostrar modal de verificación
    showVerificationModal(email) {
        console.log('📱 Mostrando modal de verificación para:', email);
        
        const modal = document.getElementById('verificationModal');
        const emailDisplay = document.getElementById('verificationEmail');
        const codeInput = document.getElementById('verificationCode');

        if (!modal || !emailDisplay || !codeInput) {
            console.error('❌ No se encontraron elementos del modal');
            this.toast.show('Error: No se encontraron elementos del modal', 'error');
            return;
        }

        // Configurar email en el modal
        emailDisplay.textContent = email;
        
        // Limpiar campo de código
        codeInput.value = '';
        codeInput.classList.remove('invalid', 'valid');

        // Mostrar modal
        UIEffects.showModal(modal);
        
        console.log('✅ Modal de verificación mostrado');
        
        // Focus en el campo de código
        setTimeout(() => {
            codeInput.focus();
        }, 300);
    }

    // Ocultar modal de verificación
    hideVerificationModal() {
        console.log('📱 Ocultando modal de verificación');
        
        const modal = document.getElementById('verificationModal');
        if (modal) {
            UIEffects.hideModal(modal);
            console.log('✅ Modal de verificación ocultado');
        }
    }

    // Verificar código
    async verifyCode(email) {
        console.log('🔍 Verificando código para:', email);
        
        const codeInput = document.getElementById('verificationCode');
        const verifyBtn = document.getElementById('verifyCodeBtn');
        const code = codeInput?.value.trim();

        if (!code || code.length !== 6) {
            console.log('❌ Código inválido:', code);
            this.toast.show('Ingresa un código de 6 dígitos', 'error');
            if (codeInput) {
                codeInput.classList.add('invalid');
                setTimeout(() => codeInput.classList.remove('invalid'), 500);
            }
            return;
        }

        console.log('🔍 Código a verificar:', code);

        UIEffects.addButtonLoading(verifyBtn);

        try {
            // Simular delay de red
            await this.delay(1500);

            const users = UserStorage.getUsers();
            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (!user) {
                console.log('❌ Usuario no encontrado');
                this.toast.show('Usuario no encontrado', 'error');
                return;
            }

            console.log('👤 Usuario encontrado:', user);

            // Verificar si el código expiró
            if (Date.now() > user.verificationExpiry) {
                console.log('⏰ Código expirado');
                this.toast.show('El código ha expirado. Solicita uno nuevo', 'error');
                if (codeInput) {
                    codeInput.classList.add('invalid');
                    setTimeout(() => codeInput.classList.remove('invalid'), 500);
                }
                return;
            }

            // Verificar código
            if (user.verificationCode === code) {
                console.log('✅ Código correcto');
                
                // Marcar como verificado
                const success = UserStorage.updateUser(email, {
                    emailVerified: true,
                    verificationCode: null,
                    verificationExpiry: null,
                    verifiedAt: new Date().toISOString()
                });

                if (success) {
                    this.hideVerificationModal();
                    this.toast.show('¡Email verificado exitosamente!', 'success');
                    
                    setTimeout(() => {
                        UIEffects.switchTab('login');
                        this.toast.show('Ahora puedes iniciar sesión', 'info');
                    }, 1500);
                } else {
                    console.log('❌ Error actualizando usuario');
                    this.toast.show('Error actualizando usuario', 'error');
                }
            } else {
                console.log('❌ Código incorrecto. Esperado:', user.verificationCode, 'Recibido:', code);
                this.toast.show('Código incorrecto. Inténtalo de nuevo', 'error');
                if (codeInput) {
                    codeInput.classList.add('invalid');
                    codeInput.value = '';
                    setTimeout(() => codeInput.classList.remove('invalid'), 500);
                }
            }
        } catch (error) {
            console.error('❌ Error en verificación:', error);
            this.toast.show('Error verificando código: ' + error.message, 'error');
        } finally {
            UIEffects.removeButtonLoading(verifyBtn);
        }
    }

    // Reenviar código de verificación
    async resendVerificationCode(email) {
        console.log('🔄 Reenviando código a:', email);
        
        const resendBtn = document.getElementById('resendCodeBtn');
        UIEffects.addButtonLoading(resendBtn);

        try {
            // Simular delay de red
            await this.delay(1000);

            const users = UserStorage.getUsers();
            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (!user) {
                console.log('❌ Usuario no encontrado para reenvío');
                this.toast.show('Usuario no encontrado', 'error');
                return;
            }

            // Generar nuevo código
            const newCode = this.generateVerificationCode();
            const success = UserStorage.updateUser(email, {
                verificationCode: newCode,
                verificationExpiry: Date.now() + APP_CONFIG.VERIFICATION_EXPIRY
            });

            if (!success) {
                console.log('❌ Error actualizando código');
                this.toast.show('Error actualizando código', 'error');
                return;
            }

            // Enviar nuevo email
            const emailSent = await this.sendVerificationEmail(email, user.firstName, newCode);

            if (emailSent) {
                console.log('✅ Código reenviado exitosamente');
                this.toast.show('Nuevo código enviado a tu email', 'success');
                
                // Limpiar campo de código
                const codeInput = document.getElementById('verificationCode');
                if (codeInput) {
                    codeInput.value = '';
                    codeInput.classList.remove('invalid');
                }
            } else {
                console.log('❌ Error reenviando email');
                this.toast.show('Error reenviando código', 'error');
            }
        } catch (error) {
            console.error('❌ Error al reenviar:', error);
            this.toast.show('Error al reenviar código: ' + error.message, 'error');
        } finally {
            UIEffects.removeButtonLoading(resendBtn);
        }
    }

    // Manejar registro
    async handleRegister() {
        console.log('📝 Procesando registro...');
        
        const formData = {
            firstName: document.getElementById('firstName')?.value.trim(),
            lastName: document.getElementById('lastName')?.value.trim(),
            email: document.getElementById('registerEmail')?.value.trim(),
            password: document.getElementById('registerPassword')?.value.trim(),
            confirmPassword: document.getElementById('confirmPassword')?.value.trim(),
            acceptTerms: document.getElementById('acceptTerms')?.checked,
            newsletter: document.getElementById('newsletter')?.checked
        };

        console.log('📝 Datos del formulario:', { ...formData, password: '***', confirmPassword: '***' });

        const validation = this.validateRegistrationForm(formData);
        if (!validation.isValid) {
            console.log('❌ Validación fallida:', validation.message);
            this.toast.show(validation.message, 'error');
            return;
        }

        const submitBtn = document.querySelector('#registerForm .submit-btn');
        UIEffects.addButtonLoading(submitBtn);
        UIEffects.showLoading('Creando tu cuenta...');

        try {
            await this.delay(1000);

            if (UserStorage.userExists(formData.email)) {
                console.log('❌ Usuario ya existe');
                this.toast.show('Ya existe una cuenta con este email', 'error');
                return;
            }

            // Generar código de verificación
            const verificationCode = this.generateVerificationCode();
            console.log('🔢 Código de verificación generado:', verificationCode);
            
            // Guardar usuario como NO VERIFICADO
            const success = UserStorage.registerUser({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                newsletter: formData.newsletter,
                emailVerified: false,  // ← IMPORTANTE: Usuario no verificado
                verificationCode: verificationCode,
                verificationExpiry: Date.now() + APP_CONFIG.VERIFICATION_EXPIRY
            });

            if (success) {
                console.log('✅ Usuario guardado exitosamente');
                UIEffects.hideLoading();
                UIEffects.showLoading('Enviando código de verificación...');
                
                // Enviar email de verificación
                const emailSent = await this.sendVerificationEmail(
                    formData.email, 
                    formData.firstName, 
                    verificationCode
                );
                
                UIEffects.hideLoading();
                
                if (emailSent) {
                    console.log('✅ Email enviado, mostrando modal');
                    this.toast.show('¡Cuenta creada! Revisa tu email', 'success');
                    this.showVerificationModal(formData.email);
                    this.resetForm(document.getElementById('registerForm'));
                } else {
                    console.log('⚠️ Email no enviado, pero mostrando modal');
                    this.toast.show('Cuenta creada, pero error enviando email. Inténtalo de nuevo', 'warning');
                    this.showVerificationModal(formData.email);
                    this.resetForm(document.getElementById('registerForm'));
                }
            } else {
                UIEffects.hideLoading();
                console.log('❌ Error guardando usuario');
                this.toast.show('Error al crear la cuenta', 'error');
            }
        } catch (error) {
            UIEffects.hideLoading();
            console.error('❌ Error en registro:', error);
            this.toast.show('Error al procesar el registro: ' + error.message, 'error');
        } finally {
            UIEffects.removeButtonLoading(submitBtn);
        }
    }

    // Validar formulario de registro
    validateRegistrationForm(data) {
        if (!data.firstName || !data.lastName || !data.email || !data.password || !data.confirmPassword) {
            return { isValid: false, message: "Por favor, completa todos los campos obligatorios" };
        }

        if (!FormValidator.isValidName(data.firstName)) {
            return { isValid: false, message: "El nombre debe contener solo letras (2-30 caracteres)" };
        }

        if (!FormValidator.isValidName(data.lastName)) {
            return { isValid: false, message: "El apellido debe contener solo letras (2-30 caracteres)" };
        }

        if (!FormValidator.isValidEmail(data.email)) {
            return { isValid: false, message: "Por favor, ingresa un email válido" };
        }

        if (!FormValidator.isValidPassword(data.password)) {
            return { isValid: false, message: "La contraseña debe tener al menos 8 caracteres, incluyendo mayúscula, minúscula y número" };
        }

        if (data.password !== data.confirmPassword) {
            return { isValid: false, message: "Las contraseñas no coinciden" };
        }

        if (!data.acceptTerms) {
            return { isValid: false, message: "Debes aceptar los términos y condiciones" };
        }

        return { isValid: true };
    }

    // Manejar login
    async handleLogin() {
        console.log('🔐 Procesando login...');
        
        const email = document.getElementById('loginEmail')?.value.trim();
        const password = document.getElementById('loginPassword')?.value.trim();

        if (!email || !password) {
            this.toast.show('Por favor, completa todos los campos', 'error');
            return;
        }

        if (!FormValidator.isValidEmail(email)) {
            this.toast.show('Por favor, ingresa un email válido', 'error');
            return;
        }

        const submitBtn = document.querySelector('#loginForm .submit-btn');
        UIEffects.addButtonLoading(submitBtn);
        UIEffects.showLoading('Verificando credenciales...');

        try {
            await this.delay(1500);

            const user = UserStorage.authenticateUser(email, password);

            if (user) {
                // ✅ VERIFICAR SI EL EMAIL ESTÁ VERIFICADO
                if (!user.emailVerified) {
                    UIEffects.hideLoading();
                    this.toast.show('Debes verificar tu email antes de iniciar sesión', 'warning');
                    
                    // Preguntar si quiere reenviar código
                    setTimeout(() => {
                        if (confirm('¿Quieres que reenviemos el código de verificación?')) {
                            this.resendVerificationCode(email);
                            this.showVerificationModal(email);
                        }
                    }, 1000);
                    
                    return;
                }

                UserStorage.updateLastLogin(user.id);
                
                UIEffects.hideLoading();
                this.toast.show(`¡Bienvenido de vuelta, ${user.firstName}!`, 'success');
                
                setTimeout(() => {
                    UIEffects.showLoading('Redirigiendo al dashboard...');
                    setTimeout(() => {
                        UIEffects.hideLoading();
                        this.toast.show('Inicio de sesión exitoso', 'success');
                        this.resetForm(document.getElementById('loginForm'));
                        
                        // 🚀 REDIRECCIÓN AL DASHBOARD
                        window.location.href = 'dashboard.html';
                    }, 1000);
                }, 1000);
            } else {
                UIEffects.hideLoading();
                this.toast.show('Email o contraseña incorrectos', 'error');
            }
        } catch (error) {
            UIEffects.hideLoading();
            this.toast.show('Error al procesar la solicitud', 'error');
            console.error('Error en login:', error);
        } finally {
            UIEffects.removeButtonLoading(submitBtn);
        }
    }

    // Manejar login social
    handleSocialLogin(provider) {
        this.toast.show(`Redirigiendo a ${provider}...`, 'info');
        UIEffects.showLoading(`Conectando con ${provider}...`);
        
        setTimeout(() => {
            UIEffects.hideLoading();
            this.toast.show(`Función de ${provider} estará disponible próximamente`, 'warning');
        }, 2000);
    }

    // Manejar contraseña olvidada
    handleForgotPassword() {
        const email = prompt('Ingresa tu email para recuperar la contraseña:');
        
        if (email && FormValidator.isValidEmail(email)) {
            UIEffects.showLoading('Enviando email de recuperación...');
            setTimeout(() => {
                UIEffects.hideLoading();
                this.toast.show('Se ha enviado un enlace de recuperación a tu email', 'success');
            }, 2000);
        } else if (email) {
            this.toast.show('Por favor, ingresa un email válido', 'error');
        }
    }

    // Resetear formulario
    resetForm(form) {
        if (!form) return;
        
        form.reset();
        
        // Limpiar estados de validación
        form.querySelectorAll('.input-container').forEach(container => {
            UIEffects.setInputState(container, '');
            UIEffects.updateValidationIcon(container, null);
        });
        
        // Limpiar medidor de contraseña
        const strengthElement = form.querySelector('.password-strength');
        if (strengthElement) {
            strengthElement.className = 'password-strength';
            const strengthText = strengthElement.querySelector('.strength-text');
            const strengthFill = strengthElement.querySelector('.strength-fill');
            if (strengthText) strengthText.textContent = 'Seguridad de la contraseña';
            if (strengthFill) strengthFill.style.width = '0%';
        }
    }

    // Inicializar usuarios de prueba
    initializeTestUsers() {
        const existingUsers = UserStorage.getUsers();
        
        if (existingUsers.length === 0) {
            const testUsers = [
                {
                    id: '1',
                    firstName: 'Admin',
                    lastName: 'Sistema',
                    email: 'admin@authflow.com',
                    password: 'Admin123!',
                    newsletter: true,
                    emailVerified: true, // ← Usuario de prueba ya verificado
                    registrationDate: new Date().toISOString(),
                    verifiedAt: new Date().toISOString(),
                    lastLogin: null,
                    isActive: true
                },
                {
                    id: '2',
                    firstName: 'Usuario',
                    lastName: 'Demo',
                    email: 'usuario@authflow.com',
                    password: 'Usuario123!',
                    newsletter: false,
                    emailVerified: true, // ← Usuario de prueba ya verificado
                    registrationDate: new Date().toISOString(),
                    verifiedAt: new Date().toISOString(),
                    lastLogin: null,
                    isActive: true
                }
            ];
            
            UserStorage.saveUsers(testUsers);
            console.log('✅ Usuarios de prueba creados');
        }
    }

    // Utilidad para delay
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Métodos públicos para testing y debug
    showRegisteredUsers() {
        const users = UserStorage.getUsers();
        console.table(users.map(user => ({
            ID: user.id,
            Nombre: `${user.firstName} ${user.lastName}`,
            Email: user.email,
            Verificado: user.emailVerified ? '✅ Sí' : '❌ No',
            Código: user.verificationCode || 'N/A',
            'Último Login': user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Nunca',
            Newsletter: user.newsletter ? 'Sí' : 'No',
            Estado: user.isActive ? 'Activo' : 'Inactivo'
        })));
        this.toast.show(`${users.length} usuarios registrados (ver consola)`, 'info');
        return users;
    }

    clearTestData() {
        UserStorage.clearAllUsers();
        this.toast.show('Datos de prueba eliminados', 'warning');
        console.log('🗑️ Datos eliminados. Recarga la página para restaurar usuarios de prueba.');
    }

    addTestUsers() {
        this.initializeTestUsers();
        this.toast.show('Usuarios de prueba restaurados', 'success');
    }

    exportUserData() {
        const users = UserStorage.getUsers();
        const dataStr = JSON.stringify(users, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `authflow_usuarios_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.toast.show('Datos exportados exitosamente', 'success');
    }

    generateSecurePassword(length = 12) {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&";
        let password = "";
        
        // Asegurar al menos un carácter de cada tipo
        password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
        password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
        password += "0123456789"[Math.floor(Math.random() * 10)];
        password += "@$!%*?&"[Math.floor(Math.random() * 7)];
        
        // Completar el resto
        for (let i = password.length; i < length; i++) {
            password += charset[Math.floor(Math.random() * charset.length)];
        }
        
        // Mezclar caracteres
        const shuffled = password.split('').sort(() => Math.random() - 0.5).join('');
        console.log('🔐 Contraseña generada:', shuffled);
        return shuffled;
    }

    async testEmailSending() {
        const testEmail = prompt('Ingresa tu email para probar el envío:');
        if (!testEmail || !FormValidator.isValidEmail(testEmail)) {
            this.toast.show('Email inválido', 'error');
            return;
        }

        console.log('🧪 Probando envío de email a:', testEmail);
        UIEffects.showLoading('Enviando email de prueba...');
        
        const testCode = this.generateVerificationCode();
        const success = await this.sendVerificationEmail(testEmail, 'Usuario de Prueba', testCode);
        
        UIEffects.hideLoading();
        
        if (success) {
            this.toast.show(`Email de prueba enviado a ${testEmail}`, 'success');
            console.log(`📧 Código de prueba: ${testCode}`);
        } else {
            this.toast.show('Error enviando email de prueba', 'error');
        }
    }
}

// Variables globales
let authApp;

// Funciones globales para debug (compatibilidad)
function showUsers() {
    return authApp?.showRegisteredUsers();
}

function clearData() {
    return authApp?.clearTestData();
}

function testEmail() {
    return authApp?.testEmailSending();
}

function addTestUsers() {
    return authApp?.addTestUsers();
}

function exportData() {
    return authApp?.exportUserData();
}

function generatePassword(length) {
    return authApp?.generateSecurePassword(length);
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM cargado, iniciando AuthFlow...');
    
    // Verificar dependencias
    if (typeof emailjs === 'undefined') {
        console.warn('⚠️ EmailJS no está disponible. Asegúrate de incluir el script.');
    }
    
    // Inicializar aplicación
    authApp = new AuthFlowApp();
    
    // Mensaje de bienvenida en consola
    console.log(`
🎨 AuthFlow - Sistema de Autenticación Completo
📧 EmailJS configurado con verificación por email

🛠️ Funciones de testing disponibles:
   • showUsers() - Ver usuarios registrados
   • clearData() - Limpiar datos de prueba  
   • testEmail() - Probar envío de email
   • addTestUsers() - Restaurar usuarios de prueba
   • exportData() - Exportar datos de usuarios
   • generatePassword(length) - Generar contraseña segura

🔧 Configuración EmailJS:
   • Service ID: ${EMAIL_CONFIG.SERVICE_ID}
   • Template ID: ${EMAIL_CONFIG.TEMPLATE_ID}
   • Public Key: ${EMAIL_CONFIG.PUBLIC_KEY}

📝 Para probar el registro:
   1. Ve a la pestaña "Registrarse"
   2. Completa el formulario con tu email real
   3. Haz clic en "Crear Cuenta"
   4. Revisa tu email para el código de verificación

👤 Usuarios de prueba (ya verificados):
   • admin@authflow.com / Admin123!
   • usuario@authflow.com / Usuario123!

✨ Características incluidas:
   ✓ Verificación por email real con EmailJS
   ✓ Códigos de 6 dígitos que expiran en 15 minutos
   ✓ Reenvío de códigos de verificación
   ✓ Login bloqueado para usuarios no verificados
   ✓ Validación en tiempo real de formularios
   ✓ Medidor de fuerza de contraseña
   ✓ Notificaciones toast modernas
   ✓ Almacenamiento local persistente
   ✓ Sistema de debug completo
   ✓ Manejo de errores robusto
   ✓ Interfaz responsiva
   ✓ Animaciones suaves
   ✓ Redirección automática al dashboard
    `);
});

// Manejo de errores globales
window.addEventListener('error', (event) => {
    console.error('💥 Error del sistema:', event.error);
    if (authApp?.toast) {
        authApp.toast.show('Ha ocurrido un error inesperado', 'error');
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('💥 Promesa rechazada:', event.reason);
    if (authApp?.toast) {
        authApp.toast.show('Error en la aplicación', 'error');
    }
});

// Detectar estado de conexión
window.addEventListener('online', () => {
    if (authApp?.toast) {
        authApp.toast.show('Conexión restaurada', 'success');
    }
});

window.addEventListener('offline', () => {
    if (authApp?.toast) {
        authApp.toast.show('Sin conexión a internet - El envío de emails puede fallar', 'warning');
    }
});
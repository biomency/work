// ==================== TELEGRAM WEB APP ====================
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#0a0a0a');
    tg.setBackgroundColor('#0a0a0a');
    if (tg.BackButton) {
        tg.BackButton.hide();
    }
}

// ==================== PARTICLES BACKGROUND ====================
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 80;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = `rgba(79, 172, 254, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((particle, i) => {
        particle.update();
        particle.draw();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particle.x - particles[j].x;
            const dy = particle.y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.strokeStyle = `rgba(79, 172, 254, ${0.1 * (1 - distance / 100)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    });

    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

initParticles();
animateParticles();

// ==================== NAVIGATION ====================
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('section[id]');

function setActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 200;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${sectionId}`) {
                    item.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', setActiveNav);

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        if (tg?.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
    });
});

// ==================== COUNTER ANIMATION ====================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = Math.round(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
}

const counters = document.querySelectorAll('.counting, [data-target]');
let countersAnimated = false;

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
            countersAnimated = true;
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                if (target) {
                    animateCounter(counter, target);
                }
            });
        }
    });
}, { threshold: 0.5 });

if (counters.length > 0) {
    counterObserver.observe(counters[0].closest('section'));
}

// ==================== LIVE CHAT DEMO ====================
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const chatMessages = document.getElementById('chatMessages');

const aiResponses = [
    "Отличный вопрос! Давай обсудим детали проекта",
    "Это реализуемо, займёт примерно 3-5 дней",
    "Да, могу интегрировать AI в твой бот",
    "Бюджет зависит от сложности, но есть решения для любых задач",
    "Конечно, покажу примеры похожих работ",
    "Напиши подробнее о твоей задаче"
];

function addMessage(text, isUser = false) {
    const message = document.createElement('div');
    message.className = `message ${isUser ? 'user' : 'bot'}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = isUser ? '👤' : '🤖';
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;
    
    message.appendChild(avatar);
    message.appendChild(bubble);
    chatMessages.appendChild(message);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    
    addMessage(text, true);
    chatInput.value = '';
    
    if (tg?.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    
    setTimeout(() => {
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        addMessage(randomResponse, false);
    }, 800);
}

if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
}

if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// ==================== CODE TYPING ANIMATION ====================
const codeText = `from telegram import Update
from telegram.ext import Application

# Создаём бота
async def start(update, context):
    await update.message.reply_text(
        "🤖 Привет! Я готов помочь!"
    )

# Запускаем
app = Application.builder()
app.token("YOUR_TOKEN").build()
app.add_handler(CommandHandler("start", start))
app.run_polling()`;

const typingCode = document.getElementById('typingCode');
let codeIndex = 0;

function typeCode() {
    if (codeIndex < codeText.length) {
        typingCode.textContent += codeText.charAt(codeIndex);
        codeIndex++;
        setTimeout(typeCode, 30);
    } else {
        setTimeout(() => {
            typingCode.textContent = '';
            codeIndex = 0;
            typeCode();
        }, 3000);
    }
}

if (typingCode) {
    const codeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeCode();
                codeObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });
    
    codeObserver.observe(typingCode);
}

// ==================== STATS COUNTING ====================
const statValues = document.querySelectorAll('.stat-card .stat-value.counting');

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            if (target) {
                animateCounter(entry.target, target, 1500);
            }
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statValues.forEach(stat => statsObserver.observe(stat));

// SERVICE BUTTONS - ИСПРАВЛЕННАЯ ВЕРСИЯ
const serviceBtns = document.querySelectorAll('.service-btn');

serviceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (tg?.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('medium');
        }
        
        const serviceName = btn.closest('.service-card').querySelector('h3').textContent;
        const encodedText = encodeURIComponent(`Здравствуйте! Интересует услуга: ${serviceName}`);
        
        if (tg) {
            tg.openTelegramLink(`https://t.me/moldenov?text=${encodedText}`);
        } else {
            window.open(`https://t.me/moldenov?text=${encodedText}`, '_blank');
        }
    });
});

// ==================== FAQ ACCORDION ====================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        faqItems.forEach(faq => faq.classList.remove('active'));
        
        if (!isActive) {
            item.classList.add('active');
        }
        
        if (tg?.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
    });
});

// ==================== CONTACT BUTTON ====================
const contactBtn = document.getElementById('contactBtn');

if (contactBtn) {
    contactBtn.addEventListener('click', () => {
        if (tg?.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('medium');
        }
        
        if (tg) {
            tg.openTelegramLink('https://t.me/moldenov');
        } else {
            window.open('https://t.me/moldenov', '_blank');
        }
    });
}

// ==================== SMOOTH SCROLL FOR ALL LINKS ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== INTERSECTION OBSERVER FOR ANIMATIONS ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const elementsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

const animatedElements = document.querySelectorAll('.hover-lift, .zoom-in, .fade-in');
animatedElements.forEach(el => {
    if (!el.style.opacity) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    }
    elementsObserver.observe(el);
});

// ==================== PARALLAX EFFECT FOR ORBS ====================
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;
});

function animateOrbs() {
    const orbs = document.querySelectorAll('.glow-orb');
    
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 15;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        
        orb.style.transform = `translate(${x}px, ${y}px)`;
    });
    
    requestAnimationFrame(animateOrbs);
}

animateOrbs();

// ==================== PERFORMANCE OPTIMIZATION ====================
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            setActiveNav();
            ticking = false;
        });
        ticking = true;
    }
});

// ==================== LOADING STATE ====================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ==================== BOT BUTTONS ANIMATION ====================
const botBtns = document.querySelectorAll('.bot-btn');

botBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        btn.style.animation = 'none';
        setTimeout(() => {
            btn.style.animation = 'pulse 0.3s ease';
        }, 10);
        
        if (tg?.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
    });
});

// ==================== CHART BARS HOVER ====================
const chartBars = document.querySelectorAll('.chart-bar');

chartBars.forEach(bar => {
    bar.addEventListener('mouseenter', () => {
        if (tg?.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
    });
});

// ==================== TECH ITEMS 3D TILT ====================
const techItems = document.querySelectorAll('.tech-item');

techItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// ==================== TIMELINE ANIMATION ON SCROLL ====================
const timelineItems = document.querySelectorAll('.timeline-item');

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
        }
    });
}, { threshold: 0.3 });

timelineItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    timelineObserver.observe(item);
});

// ==================== GLITCH EFFECT ON HOVER ====================
const glitchTitles = document.querySelectorAll('.glitch');

glitchTitles.forEach(title => {
    title.addEventListener('mouseenter', () => {
        if (tg?.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
    });
});

// ==================== CONSOLE EASTER EGG ====================
console.log('%c🚀 Portfolio Mini App', 'font-size: 20px; font-weight: bold; color: #4facfe;');
console.log('%c💻 Хочешь такое же приложение? Пиши: @moldenov', 'font-size: 14px; color: #a855f7;');
console.log('%c⚡ Telegram Bots • AI • Automation', 'font-size: 12px; color: #6b7280;');

if (tg?.initDataUnsafe?.user) {
    console.log('👤 Telegram User:', tg.initDataUnsafe.user);
}

// ==================== MOBILE OPTIMIZATIONS ====================
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    // Disable hover effects on touch devices
    const hoverElements = document.querySelectorAll('.hover-lift, .hover-tilt');
    hoverElements.forEach(el => {
        el.addEventListener('touchstart', () => {
            el.classList.add('touch-active');
        });
        el.addEventListener('touchend', () => {
            setTimeout(() => {
                el.classList.remove('touch-active');
            }, 300);
        });
    });
}

// ==================== PREVENT CONTEXT MENU (OPTIONAL) ====================
// document.addEventListener('contextmenu', (e) => e.preventDefault());

// ==================== DEBUG INFO ====================
console.log('✅ Script loaded successfully');
console.log('📱 Viewport:', window.innerWidth, 'x', window.innerHeight);
console.log('🎨 Particles:', particleCount);
// ... весь твой код выше ...

if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    const hoverElements = document.querySelectorAll('.hover-lift, .hover-tilt');
    hoverElements.forEach(el => {
        el.addEventListener('touchstart', () => {
            el.classList.add('touch-active');
        });
        el.addEventListener('touchend', () => {
            setTimeout(() => {
                el.classList.remove('touch-active');
            }, 300);
        });
    });
}

console.log('✅ Script loaded successfully');
console.log('📱 Viewport:', window.innerWidth, 'x', window.innerHeight);
console.log('🎨 Particles:', particleCount);

// BACKGROUND MUSIC
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.querySelector('.music-icon');
let isMusicPlaying = false;

if (musicToggle && bgMusic) {
    bgMusic.volume = 0.3; // 30% громкости
    
    musicToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicIcon.textContent = '🔇';
            isMusicPlaying = false;
        } else {
            bgMusic.play();
            musicIcon.textContent = '🔊';
            isMusicPlaying = true;
        }
        
        if (tg?.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
    });
}
// SNOWFLAKES
function createSnowflakes() {
    const snowContainer = document.createElement('div');
    snowContainer.className = 'snow-container';
    document.body.appendChild(snowContainer);
    
    for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = '❄';
        snowflake.style.left = Math.random() * 100 + '%';
        snowflake.style.animationDuration = (Math.random() * 3 + 2) + 's';
        snowflake.style.animationDelay = Math.random() * 5 + 's';
        snowflake.style.fontSize = (Math.random() * 10 + 10) + 'px';
        snowflake.style.opacity = Math.random() * 0.6 + 0.4;
        snowContainer.appendChild(snowflake);
    }
}

// Вызываем только если кнопка музыки нажата (опционально)
// или сразу при загрузке:
// createSnowflakes();

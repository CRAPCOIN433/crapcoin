// Sound effects
const sounds = {
    click: new Audio('./sounds/click.mp3'),
    mission: new Audio('./sounds/mission-passed.mp3'),
    hover: new Audio('./sounds/hover.mp3')
};

function playSound(soundName) {
    if (sounds[soundName]) {
        sounds[soundName].play().catch(() => {});
    }
}

let isMuted = localStorage.getItem('isMuted') === 'true';

function toggleSound() {
    isMuted = !isMuted;
    localStorage.setItem('isMuted', isMuted);
    document.querySelector('.sound-toggle').textContent = isMuted ? '🔇' : '🔊';
}

function switchLanguage(lang) {
    document.body.classList.remove('en', 'ru');
    document.body.classList.add(lang);
    
    // Update active state of language buttons
    document.querySelectorAll('.language-switch button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === lang.toUpperCase()) {
            btn.classList.add('active');
        }
    });

    // Save preference
    localStorage.setItem('language', lang);
}

// Mission passed animation
function showMissionPassed() {
    const missionPass = document.createElement('div');
    missionPass.classList.add('mission-passed');
    missionPass.innerHTML = 'MISSION PASSED! <br> RESPECT +';
    document.body.appendChild(missionPass);
    
    playSound('mission');
    
    setTimeout(() => {
        missionPass.remove();
    }, 3000);
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        playSound('click');
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Button click effects
document.querySelectorAll('.gta-button').forEach(button => {
    button.addEventListener('click', () => {
        playSound('click');
        button.classList.add('clicked');
        setTimeout(() => button.classList.remove('clicked'), 200);
    });
    button.addEventListener('mouseover', () => playSound('hover'));
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const loadingBar = document.querySelector('.loading-progress');
    let progress = 0;
    
    const loadingInterval = setInterval(() => {
        progress += 1;
        loadingBar.style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
            setTimeout(() => {
                document.getElementById('loading-overlay').style.display = 'none';
                playSound('mission');
            }, 500);
        }
    }, 20);
    
    const savedLang = localStorage.getItem('language') || 'en';
    switchLanguage(savedLang);
    
    // Update sound button state
    document.querySelector('.sound-toggle').textContent = isMuted ? '🔇' : '🔊';

    // Initialize particles
    particlesJS('particles-js', {
        particles: {
            number: { value: 80 },
            color: { value: '#ffb700' },
            shape: { type: 'circle' },
            opacity: { value: 0.5 },
            size: { value: 3 },
            move: { enable: true, speed: 2 }
        }
    });
});

// Track mission completion
function completeMission(missionElement) {
    missionElement.classList.add('mission-completed');
    showMissionPassed();
    localStorage.setItem(missionElement.id, 'completed');
}

// Achievement system
const achievements = new Set(JSON.parse(localStorage.getItem('achievements') || '[]'));

function unlockAchievement(id) {
    if (!achievements.has(id)) {
        achievements.add(id);
        localStorage.setItem('achievements', JSON.stringify([...achievements]));
        showMissionPassed();
    }
}

// Price ticker updates
function updatePrice() {
    const priceValue = document.querySelector('.price-value');
    const priceChange = document.querySelector('.price-change');
    
    const newPrice = (Math.random() * 0.0001).toFixed(8);
    const changePercent = (Math.random() * 100 - 50).toFixed(2);
    
    priceValue.textContent = `$${newPrice}`;
    priceChange.textContent = `${changePercent}%`;
    priceChange.className = `price-change ${changePercent > 0 ? 'up' : 'down'}`;
}

setInterval(updatePrice, 3000);

// Back to top button
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    playSound('click');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

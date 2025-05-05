particlesJS('particles-js', {
  particles: {
    number: {
      value: 30, // Reduced for better performance
      density: {
        enable: true,
        value_area: 1000
      }
    },
    color: {
      value: ['#ffb700', '#ff6b00', '#00ff00', '#ffffff']
    },
    shape: {
      type: ['circle', 'star', 'char'],
      stroke: {
        width: 1,
        color: '#ffb700'
      },
      character: {
        value: ['$', '💰', '🚀', '💎', '🎮'],
        font: 'Pricedown',
        style: 'bold',
        weight: 'bold'
      }
    },
    opacity: {
      value: 0.5,
      random: true,
      animation: {
        enable: true,
        speed: 1,
        minimumValue: 0.1,
        sync: false
      }
    },
    size: {
      value: 6,
      random: true,
      animation: {
        enable: true,
        speed: 4,
        minimumValue: 2,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: '#ffb700',
      opacity: 0.4,
      width: 1
    },
    move: {
      enable: true,
      speed: 2,
      direction: 'top',
      random: true,
      straight: false,
      outModes: {
        default: 'out',
        bottom: 'bounce'
      },
      attract: {
        enable: true,
        rotateX: 600,
        rotateY: 1200
      }
    }
  },
  interactivity: {
    detectsOn: 'canvas',
    events: {
      onhover: {
        enable: true,
        mode: 'repulse'
      },
      onclick: {
        enable: true,
        mode: 'push'
      },
      resize: true
    },
    modes: {
      repulse: {
        distance: 200,
        duration: 0.8
      },
      push: {
        particles_nb: 1
      }
    }
  },
  retina_detect: true
});

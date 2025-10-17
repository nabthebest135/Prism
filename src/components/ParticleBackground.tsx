import { useEffect } from 'react'

declare global {
  interface Window {
    tsParticles: any
  }
}

const ParticleBackground = () => {
  useEffect(() => {
    const loadParticles = async () => {
      if (window.tsParticles) {
        await window.tsParticles.load('tsparticles', {
          background: {
            color: {
              value: 'transparent'
            }
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: false
              },
              onHover: {
                enable: false
              },
              resize: true
            }
          },
          particles: {
            color: {
              value: '#e91f42'
            },
            links: {
              color: '#ff6b8a',
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1
            },
            move: {
              direction: 'none',
              enable: true,
              outModes: {
                default: 'bounce'
              },
              random: false,
              speed: 1,
              straight: false
            },
            number: {
              density: {
                enable: true,
                area: 800
              },
              value: 50
            },
            opacity: {
              value: 0.3
            },
            shape: {
              type: 'circle'
            },
            size: {
              value: { min: 1, max: 3 }
            }
          },
          detectRetina: true
        })
      }
    }

    loadParticles()
  }, [])

  return <div id="tsparticles" />
}

export default ParticleBackground
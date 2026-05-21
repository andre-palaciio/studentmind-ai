/* ═══════════════════════════════════════════
   StudentMind AI — JavaScript
   Explicación para tutorial de YouTube
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Toggle buttons ─────────────────────────────────────────
  // Controla los botones de selección "Sí" / "No" mediante atributos ocultos.
  document.querySelectorAll('.toggle-group').forEach(group => {
    const buttons = group.querySelectorAll('.toggle-btn');
    const hidden = group.querySelector('input[type="hidden"]');

    // Activar la primera opción por defecto
    buttons[0].classList.add('active');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (hidden) hidden.value = btn.dataset.value;
      });
    });
  });

  // ─── Model card toggle ────────────────────────────────────────
  // Permite seleccionar el modelo ML con una tarjeta interactiva.
  document.querySelectorAll('.model-card').forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    card.addEventListener('click', () => {
      document.querySelectorAll('.model-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      radio.checked = true;
    });
  });

  // ─── Form submission loader ──────────────────────────────────
  const form = document.getElementById('prediction-form');
  const submitBtn = document.getElementById('submit-btn');

  if (form) {
    form.addEventListener('submit', (e) => {
      // Validación básica para evitar campos vacíos antes de enviar.
      const required = form.querySelectorAll('input[required], select[required]');
      let allFilled = true;

      required.forEach(field => {
        if (!field.value.trim()) {
          allFilled = false;
          field.style.borderColor = 'rgba(239,68,68,0.6)';
          field.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.1)';
          field.addEventListener('input', () => {
            field.style.borderColor = '';
            field.style.boxShadow = '';
          }, { once: true });
        }
      });

      if (!allFilled) {
        e.preventDefault();
        // Animación de error en el formulario si faltan datos.
        form.style.animation = 'none';
        form.offsetHeight; // Reflow forzado
        form.style.animation = 'shake 0.4s ease';
        setTimeout(() => form.style.animation = '', 400);
        return;
      }

      // Mostrar animación de carga al enviar el formulario.
      if (submitBtn) {
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        if (btnText) btnText.classList.add('hidden');
        if (btnLoader) btnLoader.classList.remove('hidden');
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.8';
      }
    });
  }

  // ─── Smooth scroll to form ─────────────────────────────────────
  const heroBtn = document.querySelector('[href="#form-section"]');
  if (heroBtn) {
    heroBtn.addEventListener('click', e => {
      e.preventDefault();
      document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ─── Animate stat pills on load ───────────────────────────────
  // Anima las métricas de la cabecera al cargar la página.
  const statPills = document.querySelectorAll('.stat-pill');
  statPills.forEach((pill, i) => {
    pill.style.opacity = '0';
    pill.style.transform = 'translateY(16px)';
    setTimeout(() => {
      pill.style.transition = 'all 0.5s ease';
      pill.style.opacity = '1';
      pill.style.transform = 'translateY(0)';
    }, 600 + i * 100);
  });

  // ─── Feature cards scroll reveal ──────────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = `all 0.5s ease ${i * 0.08}s`;
    observer.observe(card);
  });

  // ─── Result page: animate bars after load ──────────────────────
  const scaleFill = document.querySelector('.scale-fill');
  const impBars = document.querySelectorAll('.imp-bar');

  if (scaleFill || impBars.length) {
    const scaleFillTarget = scaleFill ? scaleFill.style.width : null;
    const impBarTargets = [];

    impBars.forEach(bar => {
      impBarTargets.push(bar.style.width);
      bar.style.width = '0%';
    });

    if (scaleFill) scaleFill.style.width = '0%';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (scaleFill && scaleFillTarget) scaleFill.style.width = scaleFillTarget;
        impBars.forEach((bar, i) => {
          setTimeout(() => {
            bar.style.width = impBarTargets[i];
          }, i * 100);
        });
      });
    });
  }

  // ─── Input number: highlight on focus ─────────────────────────
  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('focus', () => {
      input.select();
    });
  });

  // ─── Slider: gradient track fill ──────────────────────────────
  document.querySelectorAll('.slider').forEach(slider => {
    const updateSlider = () => {
      const val = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
      slider.style.background = `linear-gradient(to right, #06b6d4 0%, #8b5cf6 ${val}%, rgba(255,255,255,0.1) ${val}%)`;
    };
    updateSlider();
    slider.addEventListener('input', updateSlider);
  });

});

// ─── Shake keyframe injection ──────────────────────────────────
// Define la animación que se usa cuando el formulario tiene errores.
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}
`;
document.head.appendChild(shakeStyle);

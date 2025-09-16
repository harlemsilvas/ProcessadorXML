// JavaScript para Landing Page do ProcessadorXML
document.addEventListener("DOMContentLoaded", function () {
  // Elementos do DOM
  const navbar = document.querySelector(".navbar");
  const heroSection = document.querySelector(".hero-section");
  const contactForm = document.getElementById("contactForm");
  const scrollTopBtn = createScrollTopButton();

  // Inicializar componentes
  initializeNavbar();
  initializeScrollAnimations();
  initializeContactForm();
  initializeSmoothScrolling();
  initializeScrollTopButton();
  initializeAnimations();

  // Navbar scroll effect
  function initializeNavbar() {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 100) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  }

  // Smooth scrolling para links de navegação
  function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          const navbarHeight = navbar.offsetHeight;
          const targetPosition = target.offsetTop - navbarHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      });
    });
  }

  // Animações de scroll reveal
  function initializeScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("loading");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    // Observar elementos que devem animar
    const animateElements = document.querySelectorAll(
      ".feature-card, .pricing-card, .testimonial-card, .benefit-item, .stat-card"
    );

    animateElements.forEach((el) => {
      observer.observe(el);
    });
  }

  // Botão scroll to top
  function createScrollTopButton() {
    const btn = document.createElement("button");
    btn.className = "scroll-top";
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.setAttribute("aria-label", "Voltar ao topo");
    document.body.appendChild(btn);
    return btn;
  }

  function initializeScrollTopButton() {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 500) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");
      }
    });

    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Formulário de contato
  function initializeContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Validar formulário
      if (validateForm()) {
        submitForm();
      }
    });

    // Validação em tempo real
    const inputs = contactForm.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      input.addEventListener("blur", validateField);
      input.addEventListener("input", clearFieldError);
    });
  }

  function validateForm() {
    let isValid = true;
    const requiredFields = contactForm.querySelectorAll("[required]");

    requiredFields.forEach((field) => {
      if (!validateField({ target: field })) {
        isValid = false;
      }
    });

    // Validar email específicamente
    const emailField = document.getElementById("email");
    if (emailField.value && !isValidEmail(emailField.value)) {
      showFieldError(emailField, "Digite um email válido");
      isValid = false;
    }

    return isValid;
  }

  function validateField(event) {
    const field = event.target;
    const value = field.value.trim();

    // Remover erros anteriores
    clearFieldError({ target: field });

    // Verificar se campo obrigatório está vazio
    if (field.hasAttribute("required") && !value) {
      showFieldError(field, "Este campo é obrigatório");
      return false;
    }

    // Validar email
    if (field.type === "email" && value && !isValidEmail(value)) {
      showFieldError(field, "Digite um email válido");
      return false;
    }

    // Validar telefone (opcional)
    if (field.type === "tel" && value && !isValidPhone(value)) {
      showFieldError(field, "Digite um telefone válido");
      return false;
    }

    return true;
  }

  function showFieldError(field, message) {
    field.classList.add("is-invalid");

    // Remover mensagem de erro anterior
    const existingError = field.parentNode.querySelector(".invalid-feedback");
    if (existingError) {
      existingError.remove();
    }

    // Adicionar nova mensagem de erro
    const errorDiv = document.createElement("div");
    errorDiv.className = "invalid-feedback";
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
  }

  function clearFieldError(event) {
    const field = event.target;
    field.classList.remove("is-invalid");
    const errorMsg = field.parentNode.querySelector(".invalid-feedback");
    if (errorMsg) {
      errorMsg.remove();
    }
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  function submitForm() {
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    // Honeypot simples
    if (data._gotcha) {
      console.warn("Spam detectado pelo honeypot.");
      return;
    }

    // Mostrar loading no botão
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';
    submitBtn.disabled = true;

    // Enviar ao Formspree
    fetch(contactForm.action, {
      method: contactForm.method || "POST",
      headers: { Accept: "application/json" },
      body: formData,
    })
      .then(async (response) => {
        if (response.ok) {
          showSuccessMessage();
          contactForm.reset();
          trackEvent("contact_submit_success", { source: "form" });
        } else {
          const contentType = response.headers.get("content-type") || "";
          let errorMsg =
            "Não foi possível enviar sua mensagem. Tente novamente.";
          if (contentType.includes("application/json")) {
            const data = await response.json().catch(() => ({}));
            if (data && data.errors && data.errors.length > 0) {
              errorMsg = data.errors.map((e) => e.message).join(", ");
            }
          }
          showErrorMessage(errorMsg);
          trackEvent("contact_submit_error", { status: response.status });
        }
      })
      .catch((err) => {
        console.error("Erro ao enviar formulário:", err);
        showErrorMessage(
          "Ocorreu um erro de rede. Verifique sua conexão e tente novamente."
        );
        trackEvent("contact_submit_exception", { message: String(err) });
      })
      .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      });
  }

  function showSuccessMessage() {
    // Criar elemento de sucesso
    const successAlert = document.createElement("div");
    successAlert.className =
      "alert alert-success alert-dismissible fade show mt-4";
    successAlert.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            <strong>Mensagem enviada com sucesso!</strong> 
            Entraremos em contato em breve.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

    // Inserir antes do formulário
    contactForm.parentNode.insertBefore(successAlert, contactForm);

    // Remover automaticamente após 5 segundos
    setTimeout(() => {
      if (successAlert.parentNode) {
        successAlert.remove();
      }
    }, 5000);
  }

  function showErrorMessage(message) {
    const errorAlert = document.createElement("div");
    errorAlert.className =
      "alert alert-danger alert-dismissible fade show mt-4";
    errorAlert.innerHTML = `
            <i class="fas fa-exclamation-triangle me-2"></i>
            <strong>Ops!</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

    contactForm.parentNode.insertBefore(errorAlert, contactForm);

    setTimeout(() => {
      if (errorAlert.parentNode) {
        errorAlert.remove();
      }
    }, 7000);
  }

  // Inicializar animações CSS personalizadas
  function initializeAnimations() {
    // Animar contadores na seção de estatísticas
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    const statCards = document.querySelectorAll(".stat-card h3");
    statCards.forEach((card) => {
      statsObserver.observe(card);
    });

    // Animar barras de progresso (se houver)
    const progressBars = document.querySelectorAll(".progress-bar");
    if (progressBars.length > 0) {
      const progressObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const width = entry.target.getAttribute("data-width");
              entry.target.style.width = width + "%";
            }
          });
        },
        { threshold: 0.5 }
      );

      progressBars.forEach((bar) => {
        progressObserver.observe(bar);
      });
    }
  }

  function animateCounter(element) {
    const target = parseInt(element.textContent);
    const increment = target / 50; // Duração da animação
    let current = 0;

    const updateCounter = () => {
      if (current < target) {
        current += increment;
        element.textContent = Math.ceil(current);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };

    updateCounter();
  }

  // Lazy loading para imagens
  function initializeLazyLoading() {
    const images = document.querySelectorAll("img[data-src]");

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          observer.unobserve(img);
        }
      });
    });

    images.forEach((img) => {
      imageObserver.observe(img);
    });
  }

  // Easter egg - Konami Code
  let konamiCode = [];
  const konamiSequence = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ];

  document.addEventListener("keydown", function (e) {
    konamiCode.push(e.code);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join("") === konamiSequence.join("")) {
      activateEasterEgg();
    }
  });

  function activateEasterEgg() {
    // Efeito especial quando o código Konami é digitado
    document.body.style.animation = "rainbow 2s ease-in-out";

    // Mostrar mensagem especial
    const easterEgg = document.createElement("div");
    easterEgg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
            color: white;
            padding: 2rem;
            border-radius: 20px;
            text-align: center;
            font-weight: bold;
            z-index: 9999;
            animation: bounce 1s ease infinite;
        `;
    easterEgg.innerHTML = `
            <h3>🎉 Easter Egg Encontrado! 🎉</h3>
            <p>Você descobriu o segredo do desenvolvedor!</p>
            <small>Harlem Silva - Desenvolvedor Full Stack</small>
        `;

    document.body.appendChild(easterEgg);

    setTimeout(() => {
      easterEgg.remove();
      document.body.style.animation = "";
    }, 3000);
  }

  // Adicionar CSS para rainbow animation
  const rainbowStyle = document.createElement("style");
  rainbowStyle.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
  document.head.appendChild(rainbowStyle);

  // Detectar modo escuro do sistema
  function initializeDarkModeDetection() {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)");

    function handleDarkModeChange(e) {
      if (e.matches) {
        // Usuário prefere modo escuro
        document.body.classList.add("dark-mode-preferred");
      } else {
        document.body.classList.remove("dark-mode-preferred");
      }
    }

    prefersDarkMode.addEventListener("change", handleDarkModeChange);
    handleDarkModeChange(prefersDarkMode);
  }

  // Rastreamento de eventos (para analytics)
  function trackEvent(event, data = {}) {
    // Aqui você pode integrar com Google Analytics, Mixpanel, etc.
    console.log("Event tracked:", event, data);

    // Exemplo para Google Analytics (se estiver configurado)
    if (typeof gtag !== "undefined") {
      gtag("event", event, data);
    }
  }

  // Rastrear cliques nos CTAs
  document.querySelectorAll(".btn-primary").forEach((btn) => {
    btn.addEventListener("click", () => {
      trackEvent("cta_click", {
        button_text: btn.textContent.trim(),
        page_location: window.location.href,
      });
    });
  });

  // Rastrear tempo na página
  let startTime = Date.now();
  window.addEventListener("beforeunload", () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    trackEvent("page_time", { time_seconds: timeSpent });
  });

  // Performance monitoring
  function monitorPerformance() {
    if ("performance" in window) {
      window.addEventListener("load", () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType("navigation")[0];
          const loadTime = navigation.loadEventEnd - navigation.loadEventStart;

          trackEvent("page_performance", {
            load_time: Math.round(loadTime),
            dom_content_loaded: Math.round(
              navigation.domContentLoadedEventEnd -
                navigation.domContentLoadedEventStart
            ),
          });
        }, 0);
      });
    }
  }

  // Inicializar monitoramento
  monitorPerformance();
  initializeDarkModeDetection();
  initializeLazyLoading();

  console.log("Landing Page ProcessadorXML inicializada com sucesso! 🚀");
});

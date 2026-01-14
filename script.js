// Script.js corrigido - sem dependências externas
document.addEventListener("DOMContentLoaded", function () {
  // Configurar accordion do FAQ
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
      // Fechar outros itens abertos
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains("active")) {
          otherItem.classList.remove("active");
        }
      });

      // Abrir/fechar item atual
      item.classList.toggle("active");
    });
  });

  // Carrossel
  const carouselTrack = document.getElementById("carouselTrack");
  const carouselBtnLeft = document.getElementById("carouselBtnLeft");
  const carouselBtnRight = document.getElementById("carouselBtnRight");
  const carouselIndicators = document.getElementById("carouselIndicators");
  const indicators = document.querySelectorAll(".indicator");

  const carouselCards = document.querySelectorAll(".carousel-card");

  // Calcular rolagem
  function getScrollAmount() {
    const cardWidth = carouselCards[0].offsetWidth + 20; // + gap
    const containerWidth = carouselTrack.parentElement.offsetWidth;
    const visibleCards = Math.floor(containerWidth / cardWidth);
    return cardWidth * Math.max(1, Math.floor(visibleCards * 0.8));
  }

  // Atualizar indicadores
  function updateIndicators(currentPosition) {
    const totalWidth =
      carouselTrack.scrollWidth - carouselTrack.parentElement.offsetWidth;
    const progress = Math.min(currentPosition / totalWidth, 1);
    const indicatorIndex = Math.floor(progress * (indicators.length - 1));

    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === indicatorIndex);
    });
  }

  // Função para rolar o carrossel
  function scrollCarousel(direction) {
    const scrollAmount = getScrollAmount();
    const currentScroll = parseInt(carouselTrack.dataset.scroll) || 0;
    const maxScroll =
      carouselTrack.scrollWidth - carouselTrack.parentElement.offsetWidth;

    let newScroll;
    if (direction === "left") {
      newScroll = Math.max(0, currentScroll - scrollAmount);
    } else {
      newScroll = Math.min(maxScroll, currentScroll + scrollAmount);
    }

    // Usar transform para melhor performance
    carouselTrack.style.transform = `translateX(-${newScroll}px)`;
    carouselTrack.dataset.scroll = newScroll;

    updateIndicators(newScroll);
  }

  // Configurar botões do carrossel
  carouselBtnLeft.addEventListener("click", () => {
    scrollCarousel("left");
  });

  carouselBtnRight.addEventListener("click", () => {
    scrollCarousel("right");
  });

  // Suporte a swipe no mobile
  let startX = 0;
  let isDragging = false;

  carouselTrack.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    },
    { passive: true }
  );

  carouselTrack.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;
      e.preventDefault();
    },
    { passive: false }
  );

  carouselTrack.addEventListener("touchend", (e) => {
    if (!isDragging) return;

    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        scrollCarousel("right");
      } else {
        scrollCarousel("left");
      }
    }

    isDragging = false;
  });

  // Configurar indicadores
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      const containerWidth = carouselTrack.parentElement.offsetWidth;
      const scrollTo =
        (index / indicators.length) *
        (carouselTrack.scrollWidth - containerWidth);

      carouselTrack.style.transform = `translateX(-${scrollTo}px)`;
      carouselTrack.dataset.scroll = scrollTo;

      updateIndicators(scrollTo);
    });
  });

  // ============= MENU HAMBÚRGUER =============
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  // Função para controlar scroll do body
  function toggleBodyScroll(isMenuOpen) {
    if (isMenuOpen) {
      document.body.classList.add("menu-open");
      // Salvar a posição do scroll
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.classList.remove("menu-open");
      // Restaurar a posição do scroll
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
  }

  // Função para fechar menu
  function closeMobileMenu() {
    mobileMenu.classList.remove("active");
    mobileMenuBtn.classList.remove("active");

    // Resetar ícone
    const icon = mobileMenuBtn.querySelector("i");
    icon.className = "fas fa-bars";

    // Restaurar scroll do body
    toggleBodyScroll(false);
  }

  if (mobileMenuBtn && mobileMenu) {
    // Abrir/fechar menu
    mobileMenuBtn.addEventListener("click", () => {
      const isOpening = !mobileMenu.classList.contains("active");
      mobileMenu.classList.toggle("active");
      mobileMenuBtn.classList.toggle("active");

      // Controlar scroll do body
      toggleBodyScroll(mobileMenu.classList.contains("active"));

      // Alterar ícone do botão
      const icon = mobileMenuBtn.querySelector("i");
      if (mobileMenu.classList.contains("active")) {
        icon.className = "fas fa-times"; // Ícone de X
      } else {
        icon.className = "fas fa-bars"; // Ícone de hambúrguer
      }
    });

    // Fechar menu ao clicar fora
    document.addEventListener("click", (e) => {
      if (
        !mobileMenu.contains(e.target) &&
        !mobileMenuBtn.contains(e.target) &&
        mobileMenu.classList.contains("active")
      ) {
        closeMobileMenu();
      }
    });

    // Fechar menu ao clicar em um link
    const mobileLinks = document.querySelectorAll(".mobile-nav-link");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        // Pequeno delay para permitir a animação de clique
        setTimeout(closeMobileMenu, 100);
      });
    });

    // Fechar menu ao pressionar ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
        closeMobileMenu();
      }
    });

    // Fechar menu ao redimensionar a tela (se voltar para desktop)
    window.addEventListener("resize", () => {
      if (window.innerWidth > 992 && mobileMenu.classList.contains("active")) {
        closeMobileMenu();
      }
    });
  }
  // ============= FIM MENU HAMBÚRGUER =============

  // Formulários
  const emailForms = document.querySelectorAll(".email-input");
  const ctaButtons = document.querySelectorAll(".btn-cta");

  ctaButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const emailInput = emailForms[index];

      if (emailInput.value && isValidEmail(emailInput.value)) {
        alert(
          `Obrigado! Enviaremos mais informações para: ${emailInput.value}`
        );
        emailInput.value = "";
      } else {
        alert("Por favor, insira um email válido.");
        emailInput.focus();
      }
    });
  });

  // Permitir enviar com Enter
  emailForms.forEach((input) => {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const button = input.nextElementSibling;
        if (button && button.classList.contains("btn-cta")) {
          button.click();
        }
      }
    });
  });

  // Função para validar email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Botão "Entrar"
  const entrarButton = document.querySelector(".btn-entrar");

  if (entrarButton) {
    entrarButton.addEventListener("click", () => {
      alert("Redirecionando para a página de login...");
    });
  }

  // Botões nos cards
  const playButtons = document.querySelectorAll(".btn-play");
  const infoButtons = document.querySelectorAll(".btn-info");

  playButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const cardTitle = button
        .closest(".carousel-card")
        .querySelector(".card-title").textContent;
      alert(`Iniciando reprodução de: ${cardTitle}`);
    });
  });

  infoButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const cardTitle = button
        .closest(".carousel-card")
        .querySelector(".card-title").textContent;
      alert(`Mostrando detalhes de: ${cardTitle}`);
    });
  });

  // Scroll suave
  const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");

      if (targetId && targetId.startsWith("#")) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          const headerHeight = document.querySelector(".header").offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });

  // Seletor de idioma
  const languageSelect = document.querySelector(".language-select");

  if (languageSelect) {
    languageSelect.addEventListener("change", function () {
      if (this.value === "en") {
        alert("Changing language to English.");
      } else {
        alert("Mudando para Português.");
      }
    });
  }

  // Inicializar
  updateIndicators(0);
  carouselTrack.dataset.scroll = "0";
});

//................ Botão de rolar para o topo.........................
document.addEventListener("DOMContentLoaded", function () {
  // Criar elemento do botão se não existir no HTML
  let scrollToTopBtn = document.getElementById("scrollToTop");

  if (!scrollToTopBtn) {
    scrollToTopBtn = document.createElement("button");
    scrollToTopBtn.id = "scrollToTop";
    scrollToTopBtn.className = "scroll-to-top";
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.setAttribute("aria-label", "Voltar ao topo");
    scrollToTopBtn.setAttribute("title", "Voltar ao topo");
    document.body.appendChild(scrollToTopBtn);
  }

  // Mostrar/ocultar botão baseado no scroll
  function toggleScrollToTopButton() {
    const scrollPosition =
      window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Mostrar botão após rolar 300px para baixo
    if (scrollPosition > 300) {
      scrollToTopBtn.classList.add("visible");
      scrollToTopBtn.classList.remove("fade-out");
      scrollToTopBtn.classList.add("fade-in");
    } else {
      scrollToTopBtn.classList.remove("fade-in");
      scrollToTopBtn.classList.add("fade-out");

      // Remover a classe visible após a animação
      setTimeout(() => {
        if (scrollPosition <= 300) {
          scrollToTopBtn.classList.remove("visible");
        }
      }, 300);
    }

    // Esconder botão quando estiver no final da página
    if (scrollPosition + windowHeight >= documentHeight - 100) {
      scrollToTopBtn.style.bottom = "80px"; // Ajustar para não cobrir elementos do footer
    } else {
      scrollToTopBtn.style.bottom = "30px";
    }
  }

  // Função para rolar suavemente para o topo
  function scrollToTop() {
    // Usar scroll suave se suportado
    if ("scrollBehavior" in document.documentElement.style) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      // Fallback para navegadores antigos
      const scrollStep = -window.scrollY / 15;
      const scrollInterval = setInterval(function () {
        if (window.scrollY !== 0) {
          window.scrollBy(0, scrollStep);
        } else {
          clearInterval(scrollInterval);
        }
      }, 15);
    }

    // Feedback visual
    scrollToTopBtn.classList.add("clicked");
    setTimeout(() => {
      scrollToTopBtn.classList.remove("clicked");
    }, 300);
  }

  // Event Listeners
  window.addEventListener("scroll", toggleScrollToTopButton);
  scrollToTopBtn.addEventListener("click", scrollToTop);

  // Também permitir rolar para o topo com tecla ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && scrollToTopBtn.classList.contains("visible")) {
      scrollToTop();
    }
  });

  // Inicializar estado do botão
  toggleScrollToTopButton();

  // Adicionar estilo para estado clicked
  const style = document.createElement("style");
  style.textContent = `
        .scroll-to-top.clicked {
            transform: scale(0.9);
            background-color: #ff3d3d;
        }
        
        .scroll-to-top.clicked i {
            animation: bounce 0.5s;
        }
        
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
        }
    `;
  document.head.appendChild(style);

  // Adicionar funcionalidade de rolagem suave para todas as âncoras
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Verificar se é uma âncora interna (não # apenas)
      if (href !== "#" && href.startsWith("#")) {
        e.preventDefault();
        const targetElement = document.querySelector(href);

        if (targetElement) {
          const headerHeight =
            document.querySelector(".header")?.offsetHeight || 0;
          const targetPosition = targetElement.offsetTop - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });

  // Adicionar funcionalidade de rolagem com botão do mouse (opcional)
  let isScrolling = false;

  scrollToTopBtn.addEventListener("mousedown", function () {
    isScrolling = true;
    scrollToTopBtn.classList.add("scrolling");
  });

  document.addEventListener("mouseup", function () {
    if (isScrolling) {
      isScrolling = false;
      scrollToTopBtn.classList.remove("scrolling");
    }
  });

  // Adicionar funcionalidade de arrastar para cima (mobile)
  let touchStartY = 0;
  let touchEndY = 0;

  scrollToTopBtn.addEventListener(
    "touchstart",
    function (e) {
      touchStartY = e.touches[0].clientY;
    },
    { passive: true }
  );

  scrollToTopBtn.addEventListener(
    "touchend",
    function (e) {
      touchEndY = e.changedTouches[0].clientY;

      // Se o usuário arrastou para cima, rolar mais rápido
      if (touchStartY - touchEndY > 50) {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    },
    { passive: true }
  );
});

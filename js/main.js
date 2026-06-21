(() => {
  "use strict";

  const config = window.SITE_CONFIG;
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-nav");

  menuButton?.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  });

  navigation?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
    });
  });

  const whatsappUrl = (message = config.defaultMessage) =>
    `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;

  document.querySelectorAll(".js-whatsapp").forEach((link) => {
    link.href = whatsappUrl();
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  document.querySelectorAll(".js-phone").forEach((link) => {
    link.href = `tel:${config.phoneInternational}`;
  });

  document.querySelectorAll("[data-contact-phone]").forEach((element) => {
    element.textContent = config.phoneDisplay;
  });

  document.querySelectorAll("[data-contact-hours]").forEach((element) => {
    element.textContent = config.openingHours;
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  const calculator = document.getElementById("area-calculator");
  if (calculator) {
    const exactOutput = document.getElementById("exact-area");
    const recommendedOutput = document.getElementById("recommended-area");
    const sendButton = document.getElementById("send-calculation");
    const numberFormatter = new Intl.NumberFormat("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    const calculateArea = () => {
      const length = Number.parseFloat(calculator.elements.namedItem("length").value) || 0;
      const width = Number.parseFloat(calculator.elements.namedItem("width").value) || 0;
      const margin = Number.parseFloat(calculator.elements.namedItem("margin").value) || 0;
      const exactArea = length * width;
      const recommendedArea = exactArea * (1 + margin / 100);

      exactOutput.value = numberFormatter.format(exactArea);
      recommendedOutput.value = numberFormatter.format(recommendedArea);
      sendButton.disabled = exactArea <= 0;
      return { length, width, margin, exactArea, recommendedArea };
    };

    calculator.addEventListener("input", calculateArea);
    calculator.addEventListener("submit", (event) => {
      event.preventDefault();
      const result = calculateArea();
      if (result.exactArea <= 0) return;
      const message = [
        "Hola, quiero consultar un pedido de césped natural.",
        "",
        `Medidas aproximadas: ${result.length} m × ${result.width} m`,
        `Superficie exacta: ${numberFormatter.format(result.exactArea)} m²`,
        `Margen seleccionado: ${result.margin}%`,
        `Cantidad orientativa: ${numberFormatter.format(result.recommendedArea)} m²`,
        "",
        "¿Podéis ayudarme a confirmar la cantidad y preparar un presupuesto?"
      ].join("\n");
      window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
    });
  }

  const viewer = document.querySelector("[data-grass-viewer]");
  const model = viewer?.querySelector("[data-grass-model]");
  const bladeContainer = viewer?.querySelector("[data-grass-blades]");

  if (viewer && model && bladeContainer) {
    const bladeCount = window.innerWidth < 600 ? 70 : 120;
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < bladeCount; index += 1) {
      const blade = document.createElement("i");
      blade.className = "blade";
      blade.style.left = `${5 + ((index * 47) % 90)}%`;
      blade.style.top = `${4 + ((index * 73) % 91)}%`;
      blade.style.setProperty("--blade-height", `${12 + ((index * 17) % 18)}px`);
      blade.style.setProperty("--blade-tilt", `${-18 + ((index * 11) % 36)}deg`);
      fragment.appendChild(blade);
    }
    bladeContainer.appendChild(fragment);

    let rotationX = 58;
    let rotationZ = -34;
    let startX = 0;
    let startY = 0;
    let dragging = false;
    let autoRotate = false;
    let animationFrame;

    const renderModel = () => {
      model.style.transform = `rotateX(${rotationX}deg) rotateZ(${rotationZ}deg)`;
    };

    const animate = () => {
      if (!autoRotate) return;
      rotationZ += 0.18;
      renderModel();
      animationFrame = requestAnimationFrame(animate);
    };

    const stopDragging = () => {
      dragging = false;
      model.style.transition = "transform .7s cubic-bezier(.2,.75,.25,1)";
    };

    viewer.querySelector(".scene").addEventListener("pointerdown", (event) => {
      dragging = true;
      startX = event.clientX;
      startY = event.clientY;
      model.style.transition = "none";
      event.currentTarget.setPointerCapture(event.pointerId);
    });

    viewer.querySelector(".scene").addEventListener("pointermove", (event) => {
      if (!dragging) return;
      rotationZ += (event.clientX - startX) * 0.35;
      rotationX = Math.max(20, Math.min(78, rotationX - (event.clientY - startY) * 0.2));
      startX = event.clientX;
      startY = event.clientY;
      renderModel();
    });

    viewer.querySelector(".scene").addEventListener("pointerup", stopDragging);
    viewer.querySelector(".scene").addEventListener("pointercancel", stopDragging);

    viewer.querySelectorAll("[data-view]").forEach((button) => {
      button.addEventListener("click", () => {
        const view = button.dataset.view;
        if (view === "auto") {
          autoRotate = !autoRotate;
          button.classList.toggle("active", autoRotate);
          button.setAttribute("aria-pressed", String(autoRotate));
          cancelAnimationFrame(animationFrame);
          if (autoRotate) animate();
          return;
        }

        viewer.querySelectorAll("[data-view]:not([data-view='auto'])").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        if (view === "top") [rotationX, rotationZ] = [5, 0];
        if (view === "side") [rotationX, rotationZ] = [74, 0];
        if (view === "default") [rotationX, rotationZ] = [58, -34];
        renderModel();
      });
    });
  }

  document.getElementById("budget-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = [
      "Hola, quiero solicitar un presupuesto de césped natural.",
      "",
      `Nombre: ${data.get("name")}`,
      `Teléfono: ${data.get("phone")}`,
      `Localidad: ${data.get("city") || "Sin indicar"}`,
      `Superficie: ${data.get("area") || "Sin indicar"}`,
      `Detalles: ${data.get("message") || "Sin indicar"}`
    ].join("\n");

    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
  });
})();

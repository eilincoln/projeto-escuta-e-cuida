/*
 * Projeto Escuta e Cuida
 * Desenvolvido por Lincoln Berto — github.com/eilincoln
 * © 2026 — Uso não comercial. Créditos obrigatórios.
 */
/* ─────────────────────────────────────────
   1. VER MAIS / VER MENOS (original)
───────────────────────────────────────── */
document.querySelectorAll(".psi-card").forEach((card) => {
  const description = card.querySelector(".psi-description");

  if (description.textContent.length > 180) {
    const button = document.createElement("button");
    button.className = "psi-read-more";
    button.textContent = "Ver mais";
    description.after(button);

    button.addEventListener("click", () => {
      description.classList.toggle("expanded");
      button.textContent = description.classList.contains("expanded")
        ? "Ver menos"
        : "Ver mais";
    });
  }
});

/* ─────────────────────────────────────────
   2. FADE-IN AO ROLAR (Intersection Observer)
───────────────────────────────────────── */
const fadeEls = document.querySelectorAll(
  ".psi-card, .step, .approach-card, .team-card, .developer-card",
);

// Remove a animação CSS estática para o JS assumir o controle
fadeEls.forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(24px)";
  el.style.transition = "opacity 0.55s ease, transform 0.55s ease";
});

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

fadeEls.forEach((el) => fadeObserver.observe(el));

/* ─────────────────────────────────────────
   3. BOTÃO VOLTAR AO TOPO
───────────────────────────────────────── */
const backToTop = document.createElement("button");
backToTop.innerHTML = "↑";
backToTop.setAttribute("aria-label", "Voltar ao topo");
backToTop.style.cssText = `
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--green-dark);
  color: white;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 999;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s, transform 0.3s, background 0.2s;
  box-shadow: 0 4px 16px rgba(26, 92, 58, 0.3);
`;
document.body.appendChild(backToTop);

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    backToTop.style.opacity = "1";
    backToTop.style.transform = "translateY(0)";
  } else {
    backToTop.style.opacity = "0";
    backToTop.style.transform = "translateY(10px)";
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

backToTop.addEventListener("mouseenter", () => {
  backToTop.style.background = "var(--green)";
});
backToTop.addEventListener("mouseleave", () => {
  backToTop.style.background = "var(--green-dark)";
});

/* ─────────────────────────────────────────
   4. FILTRO DE PSICÓLOGOS POR ABORDAGEM
───────────────────────────────────────── */
const psiSection = document.getElementById("psicologos");
const psiGrid = psiSection.querySelector(".psi-grid");
const psiCards = Array.from(psiGrid.querySelectorAll(".psi-card"));

// Mapeamento de abordagem por texto da tag
const abordagens = [
  "Todos",
  "Psicanálise",
  "Cognitivo-Comportamental",
  "Humanista",
];

// Cria o container de filtros
const filterContainer = document.createElement("div");
filterContainer.style.cssText = `
  display: flex;
  justify-content: center;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

abordagens.forEach((abordagem) => {
  const btn = document.createElement("button");
  btn.textContent = abordagem;
  btn.dataset.filter = abordagem;
  btn.style.cssText = `
    padding: 0.45rem 1.1rem;
    border-radius: 2rem;
    border: 1.5px solid var(--green-mid);
    background: transparent;
    color: var(--green-dark);
    font-family: "DM Sans", sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
  `;

  if (abordagem === "Todos") {
    btn.style.background = "var(--green-dark)";
    btn.style.color = "white";
    btn.style.borderColor = "var(--green-dark)";
  }

  btn.addEventListener("click", () => {
    // Atualiza estilo dos botões
    filterContainer.querySelectorAll("button").forEach((b) => {
      b.style.background = "transparent";
      b.style.color = "var(--green-dark)";
      b.style.borderColor = "var(--green-mid)";
    });
    btn.style.background = "var(--green-dark)";
    btn.style.color = "white";
    btn.style.borderColor = "var(--green-dark)";

    // Filtra os cards
    psiCards.forEach((card) => {
      const tags = Array.from(card.querySelectorAll(".psi-tag")).map((t) =>
        t.textContent.trim(),
      );
      const match =
        abordagem === "Todos" || tags.some((t) => t.includes(abordagem));

      if (match) {
        card.style.display = "flex";
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 10);
      } else {
        card.style.opacity = "0";
        card.style.transform = "translateY(10px)";
        setTimeout(() => {
          card.style.display = "none";
        }, 300);
      }
    });
  });

  filterContainer.appendChild(btn);
});

// Insere os filtros antes do grid
psiGrid.before(filterContainer);

/* ─────────────────────────────────────────
   5. CONTADOR ANIMADO NO HERO
───────────────────────────────────────── */
function animateCounter(el, target, duration = 1200, suffix = "") {
  const isText = isNaN(parseInt(target));
  if (isText) return; // pula se for texto puro (ex: "Online", "Psicólogos")

  let start = null;
  const numTarget = parseInt(target);

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(eased * numTarget) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const heroNums = document.querySelectorAll(".hero-info-num");

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const originalText = el.textContent.trim();

        if (originalText === "100%") {
          animateCounter(el, 100, 1200, "%");
        }
        // "Online" e "Psicólogos" são texto, não animam

        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 },
);

heroNums.forEach((el) => counterObserver.observe(el));

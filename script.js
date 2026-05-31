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

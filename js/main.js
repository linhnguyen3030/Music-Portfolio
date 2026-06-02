document.getElementById("year").textContent = String(new Date().getFullYear());

document.querySelectorAll(".play-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const wasPlaying = btn.classList.contains("is-playing");
    document.querySelectorAll(".play-btn").forEach((b) => {
      b.classList.remove("is-playing");
      b.textContent = "▶";
      b.setAttribute("aria-label", b.getAttribute("aria-label").replace("Pause", "Play"));
    });
    if (!wasPlaying) {
      btn.classList.add("is-playing");
      btn.textContent = "❚❚";
      const label = btn.getAttribute("aria-label");
      if (label) btn.setAttribute("aria-label", label.replace("Play", "Pause"));
    }
  });
});

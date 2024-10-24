try {
    document.querySelector(".seta_volta_sem_titulo").addEventListener("click", () => window.history.back());
} catch {
    document.querySelector(".seta_volta_com_titulo").addEventListener("click", () => window.history.back());
}
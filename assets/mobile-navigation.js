(() => {
    "use strict";

    function initializeNavigation() {
        const header = document.querySelector("[data-header]");
        const desktopNavigation = header?.querySelector("nav");
        const trigger = header && [...header.querySelectorAll("a")].find(
            (link) => link.textContent.trim() === "Menú",
        );

        if (!trigger || !desktopNavigation) {
            return false;
        }

        const dialog = document.createElement("dialog");
        dialog.id = "viaje-mobile-menu";
        dialog.className = "viaje-mobile-menu";
        dialog.setAttribute("aria-label", "Navegación de Viaje Ya");

        const title = document.createElement("h2");
        title.textContent = "Explora tu viaje";
        dialog.append(title);

        const closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.className = "viaje-menu-close";
        closeButton.textContent = "Cerrar menú";
        closeButton.addEventListener("click", () => dialog.close());
        dialog.append(closeButton);

        const navigation = document.createElement("nav");
        navigation.setAttribute("aria-label", "Secciones del viaje");

        desktopNavigation.querySelectorAll("a").forEach((originalLink) => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = originalLink.textContent;
            button.addEventListener("click", () => {
                dialog.close();
                originalLink.click();
            });
            navigation.append(button);
        });

        dialog.append(navigation);
        document.body.append(dialog);

        trigger.href = "#viaje-mobile-menu";
        trigger.setAttribute("role", "button");
        trigger.setAttribute("aria-controls", dialog.id);
        trigger.setAttribute("aria-haspopup", "dialog");
        trigger.setAttribute("aria-expanded", "false");

        trigger.addEventListener("click", (event) => {
            event.preventDefault();
            trigger.setAttribute("aria-expanded", "true");
            dialog.showModal();
        });

        trigger.addEventListener("keydown", (event) => {
            if (event.key === " ") {
                event.preventDefault();
                trigger.click();
            }
        });

        dialog.addEventListener("click", (event) => {
            if (event.target === dialog) {
                dialog.close();
            }
        });

        dialog.addEventListener("close", () => {
            trigger.setAttribute("aria-expanded", "false");
            trigger.focus({ preventScroll: true });
        });

        window.matchMedia("(min-width: 768px)").addEventListener("change", (event) => {
            if (event.matches && dialog.open) {
                dialog.close();
            }
        });

        return true;
    }

    if (!initializeNavigation()) {
        const observer = new MutationObserver(() => {
            if (initializeNavigation()) {
                observer.disconnect();
            }
        });

        observer.observe(document.documentElement, { childList: true, subtree: true });
    }
})();

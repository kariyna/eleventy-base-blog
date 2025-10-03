document.addEventListener("DOMContentLoaded", function () {
  const decoratedLinks = new WeakSet();

  function decorateExternalLinks(context = document) {
    const links = context.querySelectorAll("a[href]:not(.external-link)");

    links.forEach(link => {
      if (decoratedLinks.has(link)) return;

      let isExternal = false;
      try {
        const url = new URL(link.href, window.location.href);
        const linkHost = url.hostname;
        const currentHost = window.location.hostname;

        const isHowSoon = linkHost === "howsoonisnow.org" || linkHost.endsWith(".howsoonisnow.org");
        isExternal = !isHowSoon;
      } catch (e) {
        return;
      }

      if (isExternal) {
        link.classList.add("external-link");

        const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        icon.setAttribute("aria-hidden", "true");
        icon.setAttribute("class", "external-icon");
        icon.setAttribute("style", "margin-left: 0.25em; max-width: 0.8em; max-height: 0.8em; vertical-align: middle; pointer-events: none;");
        icon.setAttribute("viewBox", "0 0 512 512");

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M320 0H288V64h32 82.7L201.4 265.4 178.7 288 224 333.3l22.6-22.6L448 109.3V192v32h64V192 32 0H480 320zM32 32H0V64 480v32H32 456h32V480 352 320H424v32 96H64V96h96 32V32H160 32z");
        icon.appendChild(path);

        link.insertAdjacentElement("afterend", icon);
        decoratedLinks.add(link);
      }
    });
  }

  decorateExternalLinks();

  const observer = new MutationObserver(() => {
    decorateExternalLinks();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  setTimeout(() => {
    decorateExternalLinks();
  }, 5000);
});
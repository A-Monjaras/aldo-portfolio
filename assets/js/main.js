(function () {
	"use strict";

	var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	/* Footer year */
	var yearEl = document.querySelector("[data-year]");
	if (yearEl) yearEl.textContent = String(new Date().getFullYear());

	/* Sticky header shadow state */
	var header = document.querySelector("[data-site-header]");
	if (header) {
		var onScroll = function () {
			header.classList.toggle("is-scrolled", window.scrollY > 8);
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
	}

	/* Mobile nav toggle */
	var navToggle = document.querySelector("[data-nav-toggle]");
	var primaryNav = document.querySelector("[data-primary-nav]");

	function closeNav() {
		if (!navToggle || !primaryNav) return;
		navToggle.setAttribute("aria-expanded", "false");
		primaryNav.classList.remove("is-open");
		document.body.style.overflow = "";
	}

	function openNav() {
		if (!navToggle || !primaryNav) return;
		navToggle.setAttribute("aria-expanded", "true");
		primaryNav.classList.add("is-open");
		document.body.style.overflow = "hidden";
	}

	if (navToggle && primaryNav) {
		navToggle.addEventListener("click", function () {
			var isOpen = navToggle.getAttribute("aria-expanded") === "true";
			if (isOpen) { closeNav(); } else { openNav(); }
		});

		primaryNav.querySelectorAll("a").forEach(function (link) {
			link.addEventListener("click", closeNav);
		});

		document.addEventListener("keydown", function (e) {
			if (e.key === "Escape") closeNav();
		});

		var mq = window.matchMedia("(min-width: 900px)");
		var handleMqChange = function () { closeNav(); };
		if (mq.addEventListener) mq.addEventListener("change", handleMqChange);
	}

	/* Scroll-spy: highlight the active nav link */
	var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav-link]"));
	var sections = navLinks
		.map(function (link) {
			var id = link.getAttribute("href");
			if (!id || id.charAt(0) !== "#") return null;
			var el = document.querySelector(id);
			return el ? { link: link, el: el } : null;
		})
		.filter(Boolean);

	if (sections.length && "IntersectionObserver" in window) {
		var spy = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					var match = sections.find(function (s) { return s.el === entry.target; });
					if (!match) return;
					if (entry.isIntersecting) {
						navLinks.forEach(function (l) { l.removeAttribute("aria-current"); });
						match.link.setAttribute("aria-current", "true");
					}
				});
			},
			{ rootMargin: "-45% 0px -50% 0px", threshold: 0 }
		);
		sections.forEach(function (s) { spy.observe(s.el); });
	}

	/* Reveal-on-scroll */
	var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
	if (revealEls.length) {
		if (reduceMotion || !("IntersectionObserver" in window)) {
			revealEls.forEach(function (el) { el.classList.add("is-visible"); });
		} else {
			var revealObserver = new IntersectionObserver(
				function (entries, obs) {
					entries.forEach(function (entry) {
						if (entry.isIntersecting) {
							entry.target.classList.add("is-visible");
							obs.unobserve(entry.target);
						}
					});
				},
				{ threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
			);
			revealEls.forEach(function (el) { revealObserver.observe(el); });
		}
	}
})();

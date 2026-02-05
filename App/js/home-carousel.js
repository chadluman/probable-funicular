import { PRODUCTS } from "./store.js";

// Pick which products to feature (first 5 by default).
const FEATURED = PRODUCTS.slice(0, 5);

const els = {
  img: document.getElementById("carouselImg"),
  title: document.getElementById("carouselTitle"),
  price: document.getElementById("carouselPrice"),
  link: document.getElementById("carouselLink"),
  prev: document.querySelector(".carousel .prev"),
  next: document.querySelector(".carousel .next"),
  dots: document.getElementById("carouselDots"),
};

let index = 0;
let timerId = null;
const AUTOPLAY_MS = 4000;

function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

function getImg(item) {
  // If you haven't added real images yet, this still works.
  return item?.img || "./hero.jpg";
}

function renderDots() {
  if (!els.dots) return;
  els.dots.innerHTML = "";
  FEATURED.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "carousel__dot" + (i === index ? " is-active" : "");
    dot.dataset.go = String(i);
    els.dots.appendChild(dot);
  });
}

function renderSlide(i) {
  const item = FEATURED[i];
  if (!item || !els.img || !els.title || !els.price || !els.link) return;

  els.img.src = getImg(item);
  els.img.alt = item.name || "Product";
  els.img.onerror = () => {
    els.img.onerror = null;
    els.img.src = "./images/placeholder.jpg";
  };

  els.title.textContent = item.name;
  els.price.textContent = money(item.price);
  els.link.href = "./store.html";

  renderDots();
}

function go(newIndex) {
  if (!FEATURED.length) return;
  index = (newIndex + FEATURED.length) % FEATURED.length;
  renderSlide(index);
}

function next() {
  go(index + 1);
}

function prev() {
  go(index - 1);
}

function startAutoplay() {
  stopAutoplay();
  timerId = setInterval(next, AUTOPLAY_MS);
}

function stopAutoplay() {
  if (timerId) clearInterval(timerId);
  timerId = null;
}

function bindEvents() {
  if (els.prev) els.prev.addEventListener("click", () => {
    prev();
    startAutoplay();
  });

  if (els.next) els.next.addEventListener("click", () => {
    next();
    startAutoplay();
  });

  if (els.dots) {
    els.dots.addEventListener("click", (e) => {
      const dot = e.target.closest("[data-go]");
      if (!dot) return;
      const i = Number(dot.dataset.go);
      go(i);
      startAutoplay();
    });
  }

  const viewport = document.querySelector(".carousel__viewport");
  if (viewport) {
    viewport.addEventListener("mouseenter", stopAutoplay);
    viewport.addEventListener("mouseleave", startAutoplay);
  }
}

function initCarousel() {
  // If the markup isn't on this page, do nothing.
  if (!document.getElementById("productCarousel")) return;
  if (!FEATURED.length) return;

  renderSlide(index);
  bindEvents();
  startAutoplay();
}

document.addEventListener("DOMContentLoaded", initCarousel);

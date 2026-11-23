
/* =========================================
   RAJESH S - DIGITAL MARKETING PORTFOLIO
   Main JavaScript
   ========================================= */

document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- 1. BASIC HELPERS ---------- */

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  /* ---------- 2. THEME TOGGLE ---------- */

  const themeButton = $("#th");
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);

    if (themeButton) {
      themeButton.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );

      themeButton.setAttribute(
        "aria-pressed",
        theme === "dark" ? "true" : "false"
      );
    }
  }

  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem("portfolio-theme");
  } catch (error) {
    savedTheme = null;
  }

  if (savedTheme === "dark" || savedTheme === "light") {
    applyTheme(savedTheme);
  } else {
    applyTheme("dark");
  }

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      const currentTheme = root.getAttribute("data-theme");
      const nextTheme = currentTheme === "dark" ? "light" : "dark";

      applyTheme(nextTheme);

      try {
        localStorage.setItem("portfolio-theme", nextTheme);
      } catch (error) {
        // Theme still works if browser storage is unavailable.
      }
    });
  }


  /* ---------- 3. SCROLL PROGRESS ---------- */

  const progressBar = $("#bar");
  const timeline = $("#tl");
  const navLinks = $$("nav a.l");
  const sections = $$("main section[id]");

  function updateScroll() {
    const scrollTop = window.scrollY;
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress = scrollHeight > 0
      ? scrollTop / scrollHeight
      : 0;

    if (progressBar) {
      progressBar.style.transform = `scaleX(${progress})`;
    }

    if (timeline) {
      const rect = timeline.getBoundingClientRect();

      const timelineProgress = Math.max(
        0,
        Math.min(
          1,
          (window.innerHeight * 0.7 - rect.top) / rect.height
        )
      );

      timeline.style.setProperty("--p", timelineProgress);
    }

    let currentSection = "";

    sections.forEach((section) => {
      if (section.getBoundingClientRect().top < window.innerHeight * 0.4) {
        currentSection = section.id;
      }
    });

    navLinks.forEach((link) => {
      const active =
        link.getAttribute("href") === `#${currentSection}`;

      link.classList.toggle("on", active);
    });
  }

  window.addEventListener("scroll", updateScroll, {
    passive: true
  });

  window.addEventListener("resize", updateScroll);

  updateScroll();


  /* ---------- 4. POINTER GLOW ---------- */

  const glow = $("#glow");

  if (glow && !reduceMotion) {
    window.addEventListener("pointermove", function (event) {
      glow.style.setProperty("--x", `${event.clientX}px`);
      glow.style.setProperty("--y", `${event.clientY}px`);
    });
  }


  /* ---------- 5. CARD HOVER EFFECT ---------- */

  $$(".bx").forEach((card) => {
    card.addEventListener("pointermove", function (event) {
      const rect = card.getBoundingClientRect();

      card.style.setProperty(
        "--mx",
        `${event.clientX - rect.left}px`
      );

      card.style.setProperty(
        "--my",
        `${event.clientY - rect.top}px`
      );
    });
  });


  /* ---------- 6. BUTTON HOVER MOVEMENT ---------- */

  if (!reduceMotion) {
    $$(".btn").forEach((button) => {

      button.addEventListener("pointermove", function (event) {
        const rect = button.getBoundingClientRect();

        const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.20;

        button.style.transform = `translate(${x}px, ${y}px)`;
      });

      button.addEventListener("pointerleave", function () {
        button.style.transform = "";
      });

    });
  }


  /* ---------- 7. COUNTER ANIMATION ---------- */

  function animateCounter(element) {
    if (!element || element.dataset.animated === "true") {
      return;
    }

    element.dataset.animated = "true";

    const target = Number(element.dataset.n);
    const suffix = element.dataset.s || "";

    if (!Number.isFinite(target)) {
      return;
    }

    if (reduceMotion) {
      element.textContent = target.toLocaleString("en-IN") + suffix;
      return;
    }

    const duration = 1500;
    let startTime = null;

    function updateCounter(timestamp) {
      if (!startTime) {
        startTime = timestamp;
      }

      const progress = Math.min(
        (timestamp - startTime) / duration,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);

      element.textContent =
        value.toLocaleString("en-IN") + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
  }

  function startCounters(container) {
    if (!container) return;

    container.querySelectorAll("[data-n]").forEach((counter) => {
      animateCounter(counter);
    });
  }


  /* ---------- 8. SCROLL REVEAL ANIMATION ---------- */

  const revealElements = $$(".rv");

  if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
      function (entries, observer) {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add("in");

            startCounters(entry.target);

            if (entry.target.matches(".sn")) {
              entry.target.classList.add("in");
            }

            observer.unobserve(entry.target);
          }

        });

      },
      {
        threshold: 0.15
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });

  } else {

    revealElements.forEach((element) => {
      element.classList.add("in");
      startCounters(element);
    });

  }

  // Also initialize counters if the stats section is already visible.
  const statsSection = $(".sn");

  if (statsSection && !("IntersectionObserver" in window)) {
    startCounters(statsSection);
  }


  /* ---------- 9. TYPEWRITER EFFECT ---------- */

  const typewriter = $("#tw");

  if (typewriter) {

    const words = [
      "SEO",
      "Meta Ads",
      "social media",
      "local searches"
    ];

    let wordIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    if (reduceMotion) {

      typewriter.textContent = "SEO";

    } else {

      function typeEffect() {

        const currentWord = words[wordIndex];

        if (deleting) {
          characterIndex--;
        } else {
          characterIndex++;
        }

        typewriter.textContent =
          currentWord.slice(0, characterIndex) || "\u200B";

        let delay = deleting ? 45 : 95;

        if (!deleting && characterIndex === currentWord.length) {
          deleting = true;
          delay = 1400;

        } else if (deleting && characterIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          delay = 300;
        }

        window.setTimeout(typeEffect, delay);
      }

      typeEffect();
    }
  }


  /* ---------- 10. LEAD ESTIMATOR ---------- */

  const budgetSlider = $("#bs");
  const costSlider = $("#cs");

  const budgetValue = $("#bv");
  const costValue = $("#cv");
  const leadsValue = $("#lv");

  function calculateLeads() {

    if (
      !budgetSlider ||
      !costSlider ||
      !budgetValue ||
      !costValue ||
      !leadsValue
    ) {
      return;
    }

    const budget = Number(budgetSlider.value);
    const cost = Number(costSlider.value);

    if (cost <= 0) return;

    const estimatedLeads = Math.round(budget / cost);

    budgetValue.textContent =
      "₹" + budget.toLocaleString("en-IN");

    costValue.textContent =
      "₹" + cost.toLocaleString("en-IN");

    leadsValue.textContent =
      estimatedLeads.toLocaleString("en-IN");
  }

  if (budgetSlider && costSlider) {
    budgetSlider.addEventListener("input", calculateLeads);
    costSlider.addEventListener("input", calculateLeads);

    calculateLeads();
  }


  /* ---------- 11. SKILLS TABS ---------- */

  const skillCategories = [
    {
      name: "SEO",
      description:
        "Helping a website get found for the searches its customers make.",
      skills: [
        "On-page SEO",
        "Off-page SEO",
        "Technical SEO",
        "Local SEO",
        "Keyword Research",
        "Backlink Building"
      ]
    },
    {
      name: "Meta Ads",
      description:
        "Facebook and Instagram campaigns built to bring in enquiries.",
      skills: [
        "Campaign Setup",
        "Audience Targeting",
        "Instant Forms",
        "Lead Generation",
        "Budget Management",
        "Performance Analysis"
      ]
    },
    {
      name: "Social Media Marketing",
      description:
        "Planning and managing the pages where audiences meet the brand.",
      skills: [
        "Instagram",
        "Facebook",
        "LinkedIn",
        "Content Planning",
        "Page Management"
      ]
    },
    {
      name: "Creative & Web",
      description:
        "Promotional creatives and website updates that support campaigns.",
      skills: [
        "Canva",
        "Photoshop",
        "Premiere Pro",
        "WordPress",
        "Elementor"
      ]
    }
  ];

  const tabsContainer = $("#tabs");
  const skillsPanel = $("#pan");

  if (tabsContainer && skillsPanel) {

    tabsContainer.innerHTML = "";

    function showSkillCategory(index, moveFocus = false) {

      const category = skillCategories[index];

      if (!category) return;

      Array.from(tabsContainer.children).forEach((button, i) => {

        const selected = i === index;

        button.setAttribute("aria-selected", String(selected));
        button.tabIndex = selected ? 0 : -1;

      });

      skillsPanel.setAttribute(
        "aria-labelledby",
        `tab${index}`
      );

      // Build content safely using DOM elements.
      skillsPanel.replaceChildren();

      const content = document.createElement("div");
      content.className = "sw";

      const heading = document.createElement("h3");
      heading.textContent = category.name;

      const description = document.createElement("p");
      description.textContent = category.description;

      const tags = document.createElement("div");
      tags.className = "tags";

      category.skills.forEach((skill) => {
        const tag = document.createElement("span");
        tag.textContent = skill;
        tags.appendChild(tag);
      });

      content.append(heading, description, tags);
      skillsPanel.appendChild(content);

      if (moveFocus) {
        tabsContainer.children[index].focus();
      }
    }

    skillCategories.forEach((category, index) => {

      const button = document.createElement("button");

      button.type = "button";
      button.className = "tb";
      button.id = `tab${index}`;
      button.textContent = category.name;

      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", "pan");
      button.setAttribute("aria-selected", "false");

      button.tabIndex = index === 0 ? 0 : -1;

      button.addEventListener("click", function () {
        showSkillCategory(index);
      });

      tabsContainer.appendChild(button);
    });

    tabsContainer.addEventListener("keydown", function (event) {

      const currentIndex = Array.from(
        tabsContainer.children
      ).findIndex((button) => button.tabIndex === 0);

      let nextIndex = currentIndex;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextIndex = (currentIndex + 1) % skillCategories.length;

      } else if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowUp"
      ) {
        nextIndex =
          (currentIndex - 1 + skillCategories.length) %
          skillCategories.length;

      } else if (event.key === "Home") {
        nextIndex = 0;

      } else if (event.key === "End") {
        nextIndex = skillCategories.length - 1;

      } else {
        return;
      }

      event.preventDefault();
      showSkillCategory(nextIndex, true);

    });

    // Show SEO skills by default.
    showSkillCategory(0);
  }


  /* ---------- 12. ABOUT READ MORE ---------- */

  const readMoreButton = $("#rm");
  const moreContent = $("#more");

  if (readMoreButton && moreContent) {

    readMoreButton.addEventListener("click", function () {

      const expanded = moreContent.classList.toggle("o");

      readMoreButton.textContent =
        expanded ? "Read less" : "Read more";

      readMoreButton.setAttribute(
        "aria-expanded",
        String(expanded)
      );

    });
  }


  /* ---------- 13. INITIAL REFRESH ---------- */

  updateScroll();

  console.log("Rajesh S Portfolio JavaScript loaded successfully.");

});


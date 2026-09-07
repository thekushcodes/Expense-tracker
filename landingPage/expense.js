// ================================================
// Spendly — Main JavaScript
// ================================================

const snapContainer =
    document.querySelector(".snap-container");


// ================================================
// PREVENT BROWSER SCROLL RESTORATION
// ================================================

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}


// ================================================
// PAGE START — ALWAYS HERO
// ================================================

function resetPageToTop() {

    const snapContainer =
        document.querySelector(".snap-container");

    if (snapContainer) {
        snapContainer.scrollTop = 0;
    }

    window.scrollTo(0, 0);
}

resetPageToTop();


// ================================================
// MAIN INITIALIZATION
// ================================================

document.addEventListener("DOMContentLoaded", () => {

    const snapContainer =
        document.querySelector(".snap-container");


    // Make sure page starts at hero
    resetPageToTop();

    requestAnimationFrame(() => {
        resetPageToTop();
    });

    setTimeout(() => {
        resetPageToTop();
    }, 100);


    // ================================================
    // NAVIGATION ELEMENTS
    // ================================================

    const navLinks =
        document.querySelectorAll(".nav-links a");

    const heroButtons =
        document.querySelectorAll(
            ".primary-button, .secondary-button"
        );


    // ================================================
    // GET STARTED BUTTONS
    // ================================================

    const heroGetStarted =
        document.getElementById("heroGetStarted");

    const finalGetStarted =
        document.getElementById("finalGetStarted");

    const getStartedButton =
        document.getElementById("getStartedButton");


    function handleGetStarted(event) {

        event.preventDefault();

        openSignup();
    }


    if (heroGetStarted) {
        heroGetStarted.addEventListener(
            "click",
            handleGetStarted
        );
    }


    if (finalGetStarted) {
        finalGetStarted.addEventListener(
            "click",
            handleGetStarted
        );
    }


    if (getStartedButton) {
        getStartedButton.addEventListener(
            "click",
            handleGetStarted
        );
    }


    // ================================================
    // CUSTOM SMOOTH SCROLL
    // ================================================

    let animationFrame = null;


    function smoothScrollTo(
        targetId,
        duration = 1200
    ) {

        const target =
            document.querySelector(targetId);

        if (!target || !snapContainer) {
            return;
        }


        // Cancel previous animation
        if (animationFrame !== null) {

            cancelAnimationFrame(
                animationFrame
            );

            animationFrame = null;
        }


        const startPosition =
            snapContainer.scrollTop;

        const targetPosition =
            target.offsetTop;

        const distance =
            targetPosition - startPosition;


        if (Math.abs(distance) < 1) {

            snapContainer.scrollTop =
                targetPosition;

            updateActiveNav();

            return;
        }


        // Disable CSS snapping while JS
        // performs the smooth animation.

        snapContainer.style.scrollSnapType =
            "none";


        let startTime = null;


        function easeInOutCubic(t) {

            return t < 0.5
                ? 4 * t * t * t
                : 1 -
                    Math.pow(-2 * t + 2, 3) / 2;
        }


        function animateScroll(currentTime) {

            if (!startTime) {
                startTime = currentTime;
            }


            const elapsed =
                currentTime - startTime;


            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            const easedProgress =
                easeInOutCubic(progress);


            snapContainer.scrollTop =
                startPosition +
                distance * easedProgress;


            if (progress < 1) {

                animationFrame =
                    requestAnimationFrame(
                        animateScroll
                    );

            } else {

                snapContainer.scrollTop =
                    targetPosition;

                animationFrame = null;


                setTimeout(() => {

                    if (animationFrame === null) {

                        snapContainer.style.scrollSnapType =
                            "y mandatory";
                    }

                    updateActiveNav();

                }, 80);
            }
        }


        animationFrame =
            requestAnimationFrame(
                animateScroll
            );
    }


    // ================================================
    // SPENDLY LOGO → HERO
    // ================================================

    const logo = document.querySelector(".logo");

    if (logo) {
        logo.addEventListener("click", event => {
            event.preventDefault();

            smoothScrollTo("#hero", 1200);

            history.replaceState(null, "", "#hero");
        });
    }


    // ================================================
    // NAV LINKS
    // ================================================

    navLinks.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                event.preventDefault();


                const targetId =
                    link.getAttribute("href");


                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                smoothScrollTo(
                    targetId,
                    1200
                );


                history.pushState(
                    null,
                    "",
                    targetId
                );
            }
        );
    });


    // ================================================
    // HERO BUTTONS THAT POINT TO SECTIONS
    // ================================================

    heroButtons.forEach(button => {

        button.addEventListener(
            "click",
            event => {

                const targetId =
                    button.getAttribute("href");


                // Buttons such as Start Tracking
                // are handled separately.

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                event.preventDefault();


                smoothScrollTo(
                    targetId,
                    1200
                );


                history.pushState(
                    null,
                    "",
                    targetId
                );
            }
        );
    });


    // ================================================
    // ACTIVE NAVIGATION
    // ================================================

    function updateActiveNav() {

        if (
            !snapContainer ||
            navLinks.length === 0
        ) {
            return;
        }


        const scrollTop =
            snapContainer.scrollTop;

        const snapSections =
            snapContainer.querySelectorAll(
                ".snap-section"
            );


        let closestSection = null;
        let closestDistance = Infinity;


        snapSections.forEach(section => {

            const sectionTop =
                section.offsetTop;


            const distance =
                Math.abs(
                    sectionTop - scrollTop
                );


            if (
                distance <
                closestDistance
            ) {

                closestDistance =
                    distance;

                closestSection =
                    section;
            }
        });


        navLinks.forEach(link => {

            link.classList.remove(
                "active"
            );
        });


        if (!closestSection) {
            return;
        }


        const SNAP_TOLERANCE = 15;


        if (
            closestDistance >
            SNAP_TOLERANCE
        ) {
            return;
        }


        const activeLink =
            document.querySelector(
                `.nav-links a[href="#${closestSection.id}"]`
            );


        if (activeLink) {

            activeLink.classList.add(
                "active"
            );
        }
    }


    if (snapContainer) {

        snapContainer.addEventListener(
            "scroll",
            updateActiveNav,
            {
                passive: true
            }
        );
    }


    window.addEventListener(
        "resize",
        updateActiveNav
    );


    requestAnimationFrame(() => {
        updateActiveNav();
    });


    // ================================================
    // MOBILE MENU
    // ================================================

    const menuButton =
        document.querySelector(".menu-button");

    const navbar =
        document.querySelector(".navbar");


    if (menuButton && navbar) {

        menuButton.addEventListener(
            "click",
            () => {

                navbar.classList.toggle(
                    "mobile-menu-open"
                );
            }
        );
    }


    // Close mobile menu when a link is clicked

    navLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                if (navbar) {

                    navbar.classList.remove(
                        "mobile-menu-open"
                    );
                }
            }
        );
    });


    // ================================================
    // FEATURE SECTION
    // ================================================
    //
    // The new Features section contains:
    // - transactions
    // - category bars
    // - budget progress
    // - insight chart
    //
    // Animate those elements when the section
    // actually enters the viewport.
    // ================================================

    const featureSection =
        document.querySelector(
            ".features-section"
        );


    function animateFeatureSection() {

        if (!featureSection) {
            return;
        }


        // Category bars

        const categoryBars =
            featureSection.querySelectorAll(
                ".category-bar i"
            );


        categoryBars.forEach(bar => {

            const finalWidth =
                bar.style.width;

            bar.style.width = "0";


            requestAnimationFrame(() => {

                bar.style.transition =
                    "width 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)";

                bar.style.width =
                    finalWidth;
            });
        });


        // Budget progress

        const budgetProgress =
            featureSection.querySelector(
                ".budget-progress span"
            );


        if (budgetProgress) {

            const finalWidth =
                budgetProgress.style.width ||
                "71%";


            budgetProgress.style.width =
                "0";


            requestAnimationFrame(() => {

                budgetProgress.style.transition =
                    "width 1s cubic-bezier(0.2, 0.8, 0.2, 1)";

                budgetProgress.style.width =
                    finalWidth;
            });
        }


        // Insight mini chart

        const chartBars =
            featureSection.querySelectorAll(
                ".insight-chart span"
            );


        chartBars.forEach((bar, index) => {

            const finalHeight =
                bar.style.height;

            bar.style.height = "0";


            setTimeout(() => {

                bar.style.transition =
                    "height 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)";

                bar.style.height =
                    finalHeight;

            }, index * 70);
        });
    }


    let featureAnimated = false;


    if (featureSection) {

        const featureObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting &&
                            !featureAnimated
                        ) {

                            featureAnimated = true;

                            animateFeatureSection();
                        }
                    });
                },
                {
                    threshold: 0.35
                }
            );


        featureObserver.observe(
            featureSection
        );
    }


    // ================================================
    // HOW IT WORKS
    // ================================================
    //
    // Make the flow pills interactive.
    //
    // Clicking:
    // Add
    // Organize
    // Understand
    // Improve
    //
    // changes the active step.
    // ================================================

    const flowPills =
        document.querySelectorAll(
            ".flow-pill"
        );


    const flowDescriptions = {

        Add:
            "Record the amount, merchant, category, and date of every expense.",

        Organize:
            "Group your transactions into useful categories and keep your budgets clear.",

        Understand:
            "Compare your spending patterns to see where your money is going.",

        Improve:
            "Use those insights to make better spending decisions next month."
    };


    const howSection =
        document.querySelector(
            ".how-section"
        );


    flowPills.forEach(pill => {

        pill.style.cursor = "pointer";


        pill.addEventListener(
            "click",
            () => {

                flowPills.forEach(item => {

                    item.classList.remove(
                        "active"
                    );
                });


                pill.classList.add(
                    "active"
                );


                const step =
                    pill.textContent.trim();


                if (howSection) {

                    const description =
                        howSection.querySelector(
                            ".section-description"
                        );


                    if (description &&
                        flowDescriptions[step]) {

                        description.textContent =
                            flowDescriptions[step];
                    }
                }
            }
        );
    });


    // ================================================
    // PRODUCT PREVIEW
    // ================================================
    //
    // The dashboard preview now behaves like a
    // small interactive dashboard.
    //
    // Overview
    // Transactions
    // Budgets
    // Analytics
    //
    // are selectable.
    // ================================================

    const previewMenuItems =
        document.querySelectorAll(
            ".preview-menu-item"
        );


    const previewMain =
        document.querySelector(
            ".preview-main"
        );


    const previewStates = {

        Overview: {
            greeting: "GOOD MORNING",
            title: "Your financial overview"
        },

        Transactions: {
            greeting: "RECENT ACTIVITY",
            title: "Your transactions"
        },

        Budgets: {
            greeting: "BUDGET CONTROL",
            title: "Your monthly budgets"
        },

        Analytics: {
            greeting: "SPENDING ANALYTICS",
            title: "Understand your spending"
        }
    };


    previewMenuItems.forEach(item => {

        item.style.cursor = "pointer";


        item.addEventListener(
            "click",
            () => {

                previewMenuItems.forEach(
                    menuItem => {

                        menuItem.classList.remove(
                            "active"
                        );
                    }
                );


                item.classList.add(
                    "active"
                );


                const text =
                    item.textContent.trim();


                const state =
                    previewStates[text];


                if (
                    !state ||
                    !previewMain
                ) {
                    return;
                }


                const small =
                    previewMain.querySelector(
                        ".preview-topbar small"
                    );


                const title =
                    previewMain.querySelector(
                        ".preview-topbar h3"
                    );


                if (small) {
                    small.textContent =
                        state.greeting;
                }


                if (title) {
                    title.textContent =
                        state.title;
                }
            }
        );
    });


    // ================================================
    // PRODUCT PREVIEW — CHART ANIMATION
    // ================================================

    const previewSection =
        document.querySelector(
            ".preview-section"
        );


    const chart =
        document.querySelector(
            ".chart-svg"
        );


    let chartAnimated = false;


    if (
        previewSection &&
        chart
    ) {

        const chartObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting &&
                            !chartAnimated
                        ) {

                            chartAnimated = true;


                            chart.style.opacity =
                                "0";


                            chart.style.transform =
                                "translateY(10px)";


                            chart.style.transition =
                                "opacity 0.8s ease, transform 0.8s ease";


                            requestAnimationFrame(() => {

                                chart.style.opacity =
                                    "1";

                                chart.style.transform =
                                    "translateY(0)";
                            });
                        }
                    });
                },
                {
                    threshold: 0.3
                }
            );


        chartObserver.observe(
            previewSection
        );
    }


    // ================================================
    // INSIGHTS SECTION
    // ================================================
    //
    // Highlight insight points when clicked.
    // ================================================

    const insightPoints =
        document.querySelectorAll(
            ".insight-point"
        );


    insightPoints.forEach(point => {

        point.style.cursor = "pointer";


        point.addEventListener(
            "click",
            () => {

                insightPoints.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );
                    }
                );


                point.classList.add(
                    "active"
                );
            }
        );
    });


    // ================================================
    // LOGIN MODAL
    // ================================================

    const loginButton =
        document.getElementById(
            "loginButton"
        );


    const loginModal =
        document.getElementById(
            "loginModal"
        );


    const closeLogin =
        document.getElementById(
            "closeLogin"
        );


    const modalBackdrop =
        document.getElementById(
            "modalBackdrop"
        );


    const loginForm =
        document.getElementById(
            "loginForm"
        );


    function openLogin() {

        if (!loginModal) {
            return;
        }


        loginModal.classList.add(
            "active"
        );


        loginModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "modal-open"
        );


        if (snapContainer) {

            snapContainer.style.overflowY =
                "hidden";
        }


        setTimeout(() => {

            const emailInput =
                document.getElementById(
                    "email"
                );


            if (emailInput) {
                emailInput.focus();
            }

        }, 300);
    }


    function closeLoginModal() {

        if (!loginModal) {
            return;
        }


        loginModal.classList.remove(
            "active"
        );


        loginModal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "modal-open"
        );


        if (snapContainer) {

            snapContainer.style.overflowY =
                "scroll";
        }
    }


    if (loginButton) {

        loginButton.addEventListener(
            "click",
            openLogin
        );
    }


    if (closeLogin) {

        closeLogin.addEventListener(
            "click",
            closeLoginModal
        );
    }


    if (modalBackdrop) {

        modalBackdrop.addEventListener(
            "click",
            closeLoginModal
        );
    }


    // ================================================
    // SIGNUP MODAL
    // ================================================

    const createAccountButton =
        document.getElementById(
            "createAccountButton"
        );


    const signupModal =
        document.getElementById(
            "signupModal"
        );


    const closeSignup =
        document.getElementById(
            "closeSignup"
        );


    const signupBackdrop =
        document.getElementById(
            "signupBackdrop"
        );


    const signupForm =
        document.getElementById(
            "signupForm"
        );


    const switchToLogin =
        document.getElementById(
            "switchToLogin"
        );


    function openSignup() {

        if (!signupModal) {
            return;
        }


        closeLoginModal();


        signupModal.classList.add(
            "active"
        );


        signupModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "modal-open"
        );


        if (snapContainer) {

            snapContainer.style.overflowY =
                "hidden";
        }


        setTimeout(() => {

            const nameInput =
                document.getElementById(
                    "signupName"
                );


            if (nameInput) {
                nameInput.focus();
            }

        }, 300);
    }


    function closeSignupModal() {

        if (!signupModal) {
            return;
        }


        signupModal.classList.remove(
            "active"
        );


        signupModal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "modal-open"
        );


        if (snapContainer) {

            snapContainer.style.overflowY =
                "scroll";
        }
    }


    if (createAccountButton) {

        createAccountButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                openSignup();
            }
        );
    }


    if (closeSignup) {

        closeSignup.addEventListener(
            "click",
            closeSignupModal
        );
    }


    if (signupBackdrop) {

        signupBackdrop.addEventListener(
            "click",
            closeSignupModal
        );
    }


    // ================================================
    // SIGNUP → LOGIN
    // ================================================

    if (switchToLogin) {

        switchToLogin.addEventListener(
            "click",
            event => {

                event.preventDefault();


                closeSignupModal();

                openLogin();
            }
        );
    }


    // ================================================
    // ESCAPE → CLOSE MODALS
    // ================================================

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeLoginModal();

                closeSignupModal();
            }
        }
    );


    // ================================================
    // LOGIN FORM
    // ================================================

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const email =
                    document.getElementById(
                        "email"
                    );


                const password =
                    document.getElementById(
                        "password"
                    );


                if (
                    !email ||
                    !password
                ) {
                    return;
                }


                console.log(
                    "Login submitted:",
                    {
                        email: email.value,
                        password: password.value
                    }
                );


                alert(
                    "Login submitted successfully!"
                );
            }
        );
    }


    // ================================================
    // SIGNUP FORM
    // ================================================

    if (signupForm) {

        signupForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const name =
                    document.getElementById(
                        "signupName"
                    );


                const email =
                    document.getElementById(
                        "signupEmail"
                    );


                const password =
                    document.getElementById(
                        "signupPassword"
                    );


                if (
                    !name ||
                    !email ||
                    !password
                ) {
                    return;
                }


                console.log(
                    "Signup submitted:",
                    {
                        name: name.value,
                        email: email.value,
                        password: password.value
                    }
                );


                alert(
                    "Account created successfully!"
                );
            }
        );
    }


    // ================================================
    // KEYBOARD ACCESSIBILITY
    // ================================================

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                document.activeElement
            ) {

                const activeElement =
                    document.activeElement;


                if (
                    activeElement.classList.contains(
                        "flow-pill"
                    )
                ) {

                    activeElement.click();
                }
            }
        }
    );

});
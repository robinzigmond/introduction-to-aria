let isSlideshow = !!sessionStorage.getItem("slideshow");
let revealed = 0;
const TOTAL_PAGES = 15;

if (isSlideshow) {
    document.body.classList.add("ss-mode");
} else {
    document.body.classList.remove("ss-mode");
}

const revealableElements = document.querySelectorAll("[data-reveal]");
const numToReveal = Math.max(...[...revealableElements].map(element => +element.dataset.reveal));

function revealOrHide() {
    revealableElements.forEach((element) => {
        const sequence = +element.dataset.reveal;
        if (sequence <= revealed) {
            element.classList.add("shown");
            if (sequence === revealed) {
                element.scrollIntoView();
            }
        } else {
            element.classList.remove("shown");
        }
    });
}

function nextSlide(previous) {
    const urlParts = window.location.href.split("/");
    const currentPage = parseInt(urlParts[urlParts.length - 1], 10);
    let nextPage = currentPage;
    if (previous && currentPage > 1) {
        nextPage -= 1;
    } else if (!previous && currentPage < TOTAL_PAGES) {
        nextPage += 1;
    }
    if (nextPage !== currentPage) {
        window.location.href = [...urlParts.slice(0, urlParts.length - 1), `${nextPage}.html`].join("/");
    }
}

document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "F9":
            isSlideshow = !isSlideshow;
            if (isSlideshow) {
                sessionStorage.setItem("slideshow", "true");
                document.body.classList.add("ss-mode");
            } else {
                sessionStorage.removeItem("slideshow");
                document.body.classList.remove("ss-mode");
            }
            break;
        case "ArrowRight":
            if (isSlideshow) {
                if (revealed < numToReveal) {
                    revealed += 1;
                    revealOrHide();
                } else {
                    nextSlide(false);
                }
            }
            break;
        case "ArrowLeft":
            if (isSlideshow) {
                if (revealed > 0) {
                    revealed -= 1;
                    revealOrHide();
                } else {
                    nextSlide(true);
                }
            }
            break;
    }
});

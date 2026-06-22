/* ==========================================
   COUNTDOWN TIMER
========================================== */

const weddingDate = new Date("2027-03-20T15:00:00").getTime();

function updateCountdown() {

    const now = new Date().getTime();
    const difference = weddingDate - now;

    if (difference <= 0) {

        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";

        return;
    }

    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24))
        / (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (difference % (1000 * 60 * 60))
        / (1000 * 60)
    );

    const seconds = Math.floor(
        (difference % (1000 * 60))
        / 1000
    );

    document.getElementById("days").textContent =
        String(days).padStart(2, "0");

    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");
}

updateCountdown();

setInterval(updateCountdown, 1000);


/* ==========================================
   SMOOTH SCROLLING
========================================== */

document.querySelectorAll('nav a[href^="#"]')
    .forEach(anchor => {

        anchor.addEventListener("click", function (e) {

            e.preventDefault();

            const target =
                document.querySelector(
                    this.getAttribute("href")
                );

            if (!target) return;

            const offset = 80;

            const position =
                target.offsetTop - offset;

            window.scrollTo({

                top: position,
                behavior: "smooth"

            });

        });

    });


/* ==========================================
   MOBILE MENU
========================================== */

const menuBtn =
    document.querySelector(".menu-btn");

const nav =
    document.querySelector(".navbar nav");

if (menuBtn && nav) {

    menuBtn.addEventListener("click", () => {

        nav.classList.toggle("active");

    });

}


/* ==========================================
   NAVBAR SCROLL EFFECT
========================================== */

const navbar =
    document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        navbar.style.background =
            "linear-gradient(90deg, rgba(58, 38, 57, 0.98), rgba(85, 62, 81, 0.96))";

        navbar.style.boxShadow =
            "0 5px 25px rgba(152,112,112,0.12)";

    } else {

        navbar.style.background =
            "linear-gradient(90deg, rgba(58, 38, 57, 0.96), rgba(85, 62, 81, 0.94))";

        navbar.style.boxShadow = "none";

    }

});


/* ==========================================
   FAQ ACCORDION
========================================== */

document.querySelectorAll(".faq-item")
    .forEach(item => {

        const button =
            item.querySelector(".faq-toggle");

        if (!button) return;

        const answer =
            item.querySelector(".faq-answer");

        button.addEventListener("click", () => {

            button.classList.toggle("active");

            if (answer) {
                answer.classList.toggle("open");
            }

        });

    });


/* ==========================================
   STORY PHOTO LIGHTBOX
========================================== */

const storyPhotoButtons =
    document.querySelectorAll(".story-photo");

const photoLightbox =
    document.getElementById("photoLightbox");

const photoLightboxImage =
    document.getElementById("photoLightboxImage");

const photoLightboxCaption =
    document.getElementById("photoLightboxCaption");

function closePhotoLightbox() {

    if (!photoLightbox) return;

    photoLightbox.classList.remove("open");
    photoLightbox.setAttribute("aria-hidden", "true");

    if (photoLightboxImage) {
        photoLightboxImage.src = "";
        photoLightboxImage.alt = "";
    }

    document.body.style.overflow = "";
}

storyPhotoButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (!photoLightbox || !photoLightboxImage) return;

        const image =
            button.querySelector("img");

        const fullImage =
            button.dataset.full || image?.src || "";

        const caption =
            button.dataset.caption || image?.alt || "";

        photoLightboxImage.src = fullImage;
        photoLightboxImage.alt = caption;

        if (photoLightboxCaption)
            photoLightboxCaption.textContent = caption;

        photoLightbox.classList.add("open");
        photoLightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

    });

});

if (photoLightbox) {

    photoLightbox.addEventListener("click", event => {

        if (
            event.target === photoLightbox ||
            event.target.closest(".photo-lightbox-close")
        ) {
            closePhotoLightbox();
        }

    });

}

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        closePhotoLightbox();
    }

});


/* ==========================================
   MUSIC PLAYER
========================================== */

const musicButton =
    document.getElementById("playBtn");

const musicIcon =
    document.querySelector(".music-btn");

const currentSongTitle =
    document.getElementById("currentSongTitle");

const currentSongArtist =
    document.getElementById("currentSongArtist");

const navCurrentSong =
    document.getElementById("navCurrentSong");

const playlistItems =
    document.querySelectorAll(".playlist-item");

/*
    Replace with your music file later:

    assets/music.mp3
*/

const audio = new Audio(
    "assets/123.mp3"
);

audio.loop = false;
audio.preload = "auto";
audio.volume = 0.8;

let isPlaying = false;
let shouldRetryAutoplay = false;
let skippedMissingTracks = 0;

function toggleMusic() {

    if (isPlaying && audio.muted) {

        audio.muted = false;
        updateMusicUi(true);

        return;
    }

    if (!isPlaying) {

        audio.muted = false;
        audio.play()
            .then(() => {
                shouldRetryAutoplay = false;
            })
            .catch(() => {
                updateMusicUi(false);
                shouldRetryAutoplay = true;
            });

        isPlaying = true;

        if (musicButton)
            musicButton.textContent = "Pause";

        if (musicIcon)
            musicIcon.textContent = "🔊";

    } else {

        audio.pause();
        shouldRetryAutoplay = false;

        isPlaying = false;

        if (musicButton)
            musicButton.textContent = "Play";

        if (musicIcon)
            musicIcon.textContent = "🔇";

    }

}

if (musicButton) {

    musicButton.addEventListener(
        "click",
        toggleMusic
    );

}

if (musicIcon) {

    musicIcon.addEventListener(
        "click",
        toggleMusic
    );

}

function updateMusicUi(playing) {

    isPlaying = playing;

    if (musicButton)
        musicButton.textContent = playing ? "Pause" : "Play";

    if (musicIcon)
        musicIcon.textContent = playing ? "\uD83D\uDD0A" : "\uD83D\uDD07";
}

function tryAutoplayMusic() {

    audio.muted = true;

    const playRequest = audio.play();

    if (!playRequest) {

        updateMusicUi(true);
        shouldRetryAutoplay = false;

        return;
    }

    playRequest
        .then(() => {

            updateMusicUi(true);
            shouldRetryAutoplay = false;

        })
        .catch(() => {

            updateMusicUi(false);
            shouldRetryAutoplay = true;

        });
}

function enableAutoplaySound() {

    audio.muted = false;

    if (!isPlaying || shouldRetryAutoplay) {

        const playRequest = audio.play();

        if (playRequest) {

            playRequest
                .then(() => {
                    updateMusicUi(true);
                    shouldRetryAutoplay = false;
                })
                .catch(() => {
                    updateMusicUi(false);
                    shouldRetryAutoplay = true;
                });

        } else {

            updateMusicUi(true);
            shouldRetryAutoplay = false;

        }
    }
}

function selectPlaylistItem(item, shouldPlay) {

    if (!item) return;

    const title = item.dataset.title || "Untitled Song";
    const artist = item.dataset.artist || "";
    const src = item.dataset.src;

    playlistItems.forEach(playlistItem => {
        playlistItem.classList.remove("active");
    });

    item.classList.add("active");

    if (currentSongTitle)
        currentSongTitle.textContent = title;

    if (currentSongArtist)
        currentSongArtist.textContent = artist;

    if (navCurrentSong)
        navCurrentSong.textContent = `${title} — ${artist}`;

    if (src && audio.getAttribute("src") !== src) {

        audio.src = src;
        audio.load();

    }

    if (shouldPlay) {

        audio.muted = false;
        const playRequest = audio.play();

        if (playRequest) {

            playRequest
                .then(() => {
                    updateMusicUi(true);
                })
                .catch(() => {
                    updateMusicUi(false);
                });

        } else {

            updateMusicUi(true);

        }
    }
}

playlistItems.forEach(item => {

    item.addEventListener("click", () => {
        selectPlaylistItem(item, true);
    });

});

const activePlaylistItem =
    document.querySelector(".playlist-item.active");

if (activePlaylistItem) {
    selectPlaylistItem(activePlaylistItem, false);
}

audio.addEventListener("ended", () => {

    const playlist = Array.from(playlistItems);
    const currentIndex = playlist.findIndex(item =>
        item.classList.contains("active")
    );

    const nextItem =
        playlist[(currentIndex + 1) % playlist.length];

    selectPlaylistItem(nextItem, true);
});

audio.addEventListener("error", () => {

    const playlist = Array.from(playlistItems);

    if (!playlist.length || skippedMissingTracks >= playlist.length) {

        skippedMissingTracks = 0;
        updateMusicUi(false);

        return;
    }

    skippedMissingTracks += 1;

    const currentIndex = playlist.findIndex(item =>
        item.classList.contains("active")
    );

    const nextItem =
        playlist[(currentIndex + 1) % playlist.length];

    selectPlaylistItem(nextItem, isPlaying);
});

audio.addEventListener("playing", () => {
    skippedMissingTracks = 0;
});

window.addEventListener(
    "load",
    tryAutoplayMusic
);

[
    "pointerdown",
    "click",
    "touchstart",
    "keydown"
].forEach(eventName => {

    document.addEventListener(
        eventName,
        event => {

            if (
                event.target.closest("#playBtn") ||
                event.target.closest(".music-btn")
            )
                return;

            enableAutoplaySound();

        },
        { once: true, capture: true }
    );

});


/* ==========================================
   FADE-IN ANIMATIONS
========================================== */

const sections =
    document.querySelectorAll(
        "section"
    );

const observer =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "show"
                    );

                }

            });

        },

        {
            threshold: 0.15
        }

    );

sections.forEach(section => {

    section.classList.add("hidden");

    observer.observe(section);

});


/* ==========================================
   OPTIONAL:
   AUTO-CLOSE MOBILE MENU
========================================== */

document.querySelectorAll(".navbar nav a")
    .forEach(link => {

        link.addEventListener("click", () => {

            if (nav) {

                nav.classList.remove("active");

            }

        });

    });


/* ==========================================
   DEBUG
========================================== */

console.log(
    "Wedding invitation initialized ❤️"
);

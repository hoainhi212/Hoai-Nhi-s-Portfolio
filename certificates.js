/* =====================================================
   MENU
===================================================== */

const menuButton =
    document.getElementById("menuButton");

const menuPanel =
    document.getElementById("menuPanel");


menuButton.addEventListener("click", function () {

    menuPanel.classList.toggle("open");

});


/* =====================================================
   BOOK ELEMENTS
===================================================== */

const book =
    document.getElementById("book");

const bookCover =
    document.getElementById("bookCover");

const pages =
    document.querySelectorAll(".book-page");

const bookHint =
    document.getElementById("bookHint");


/* =====================================================
   PAGE SETTINGS
===================================================== */

const totalPages = pages.length - 1;

/*
    pages gồm:

    page-1
    page-2
    page-3
    page-4
    page-5
    last-page

    => 5 chứng chỉ
*/

let currentPage = 0;


/* =====================================================
   AUDIO
   TẠO ÂM THANH LẬT GIẤY NHẸ BẰNG WEB AUDIO API
===================================================== */

let audioContext = null;


function createAudio() {

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

    }

}


/* =====================================================
   BOOK FLIP SOUND
===================================================== */

function playPageSound() {

    createAudio();

    if (audioContext.state === "suspended") {

        audioContext.resume();

    }


    const duration = 0.12;

    const buffer =
        audioContext.createBuffer(
            1,
            audioContext.sampleRate * duration,
            audioContext.sampleRate
        );

    const data =
        buffer.getChannelData(0);


    /*
        Tạo tiếng giấy rất ngắn,
        không phải tiếng "whoosh" điện tử.
    */

    for (
        let i = 0;
        i < data.length;
        i++
    ) {

        const envelope =
            1 - i / data.length;

        data[i] =
            (
                Math.random() * 2 - 1
            ) *
            envelope *
            0.18;

    }


    const source =
        audioContext.createBufferSource();

    const filter =
        audioContext.createBiquadFilter();

    const gain =
        audioContext.createGain();


    filter.type = "bandpass";

    filter.frequency.value = 1800;

    filter.Q.value = 0.7;


    gain.gain.setValueAtTime(
        0.0001,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.22,
        audioContext.currentTime + 0.015
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + duration
    );


    source.buffer = buffer;

    source.connect(filter);

    filter.connect(gain);

    gain.connect(audioContext.destination);


    source.start();

}


/* =====================================================
   OPEN BOOK
===================================================== */

function openBook() {

    if (book.classList.contains("open")) {

        return;

    }


    createAudio();

    book.classList.remove("closed");

    book.classList.add("open");

    bookHint.textContent =
        "✦ Nhấn vào mép trang để tiếp tục ✦";


    setTimeout(() => {

        currentPage = 0;

        updateBook();

    }, 400);

}


/* =====================================================
   CLOSE BOOK
===================================================== */

function closeBook() {

    /*
        Lật các trang về lại vị trí ban đầu
    */

    pages.forEach(page => {

        page.classList.remove("flipped");

    });


    currentPage = 0;

    book.classList.remove("open");

    book.classList.add("closed");

    bookHint.textContent =
        "✦ Nhấn vào cuốn sách để mở ✦";


    updateBook();

}


/* =====================================================
   GO NEXT
===================================================== */

function nextPageAction() {

    if (!book.classList.contains("open")) {

        openBook();

        return;

    }


    if (currentPage >= totalPages) {

        return;

    }


    playPageSound();


    /*
        Trang hiện tại sẽ lật sang trái
    */

    pages[currentPage].classList.add("flipped");

    currentPage++;

    updateBook();

}


/* =====================================================
   GO PREVIOUS
===================================================== */

function previousPageAction() {

    if (
        !book.classList.contains("open") ||
        currentPage <= 0
    ) {

        return;

    }


    playPageSound();


    currentPage--;

    pages[currentPage].classList.remove("flipped");

    updateBook();

}


/* =====================================================
   UPDATE UI
===================================================== */

function updateBook() {

    if (!book.classList.contains("open")) {

        return;

    }

    if (currentPage >= totalPages) {

        bookHint.textContent =
            "✦ Đã đến trang cuối ✦";

    } else {

        bookHint.textContent =
            "✦ Nhấn vào trang để lật ✦";

    }

}


/* =====================================================
   COVER CLICK
===================================================== */


bookCover.addEventListener("click", function (event) {

    event.stopPropagation();

    openBook();

});

/* =====================================================
   CLICK MÉP TRÁI / PHẢI CỦA SÁCH
===================================================== */

book.addEventListener("click", function (event) {

    // Nếu sách chưa mở → click vào bìa để mở
    if (!book.classList.contains("open")) {
        return;
    }

    const rect = book.getBoundingClientRect();

    // Vị trí click tính từ mép trái của cuốn sách
    const clickX = event.clientX - rect.left;

    // Chiều rộng sách
    const bookWidth = rect.width;

    // Khoảng vùng mép trái / phải
    const edgeZone = bookWidth * 0.25;


    /* ================================
       CLICK MÉP TRÁI
       → LẬT NGƯỢC
    ================================= */

    if (clickX <= edgeZone) {

        previousPageAction();

        return;
    }


    /* ================================
       CLICK MÉP PHẢI
       → LẬT TIẾP
    ================================= */

    if (clickX >= bookWidth - edgeZone) {

        nextPageAction();

        return;
    }

});

/* =====================================================
   KEYBOARD
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "ArrowRight" ||
            event.key === " "
        ) {

            event.preventDefault();

            nextPageAction();

        }


        if (event.key === "ArrowLeft") {

            event.preventDefault();

            previousPageAction();

        }


        if (event.key === "Escape") {

            closeBook();

        }

    }
);


/* =====================================================
   INITIAL STATE
===================================================== */

pages.forEach(function (page) {

    page.classList.remove("flipped");

});


book.classList.add("closed");

updateBook();
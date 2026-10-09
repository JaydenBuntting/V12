document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
).matches;


/* =========================================================
   POP-UP ANIMATIONS
   ========================================================= */

const popElements = document.querySelectorAll('.pop');

if ('IntersectionObserver' in window) {

    const popObserver = new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add('in');

                    popObserver.unobserve(entry.target);
                }
            });

        },
        {
            threshold: 0.2
        }
    );

    popElements.forEach(function (element) {
        popObserver.observe(element);
    });

} else {

    popElements.forEach(function (element) {
        element.classList.add('in');
    });
}


/* =========================================================
   FEEDBACK FORM
   ========================================================= */

const feedbackForm =
    document.getElementById('feedback');

if (feedbackForm) {

    feedbackForm.addEventListener(
        'submit',
        function (event) {

            event.preventDefault();

            feedbackForm.style.display = 'none';

            const thanks =
                document.getElementById('thanks');

            if (thanks) {
                thanks.style.display = 'block';
            }
        }
    );
}


/* =========================================================
   SUBJECT PAGE DROPDOWNS
   ========================================================= */

const subjectLevels =
    document.querySelectorAll('.level');

subjectLevels.forEach(function (levelButton) {

    levelButton.addEventListener(
        'click',
        function () {

            levelButton.classList.toggle('open');

            const content =
                levelButton.nextElementSibling;

            if (!content) {
                return;
            }

            if (levelButton.classList.contains('open')) {

                content.style.maxHeight =
                    content.scrollHeight + 'px';

            } else {

                content.style.maxHeight = '0px';
            }
        }
    );
});


/* =========================================================
   91164 LESSON SYSTEM
   =========================================================

   Lesson structure:

       91164
         |
         |-- Lesson 1
         |     |-- Part 1
         |     |-- Part 2
         |     |-- Part 3
         |
         |-- Lesson 2
         |
         |-- Lesson 3
         |
         |-- Lesson 4
         |
         |-- Lesson 5


   The reader contains:

       TOP BAR
       -------------------------
       91164 / Lesson / Part
       -------------------------

       PROGRESS
       -------------------------
       Lesson progress
       -------------------------

       SLIDE
       -------------------------
       Content
       -------------------------

       BOTTOM NAV
       -------------------------
       Previous       Next
       -------------------------

   ========================================================= */


/* ---------------------------------------------------------
   Main elements
   --------------------------------------------------------- */

const standardOverview =
    document.getElementById('standardOverview');

const lessonMode =
    document.getElementById('lessonMode');

const lessonCards =
    document.querySelectorAll('.lesson-card');

const lessonInstances =
    document.querySelectorAll('.lesson-instance');


/* ---------------------------------------------------------
   Navigation
   --------------------------------------------------------- */

const backToStandard =
    document.getElementById('backToStandard');

const previousLessonSlide =
    document.getElementById('previousLessonSlide');

const nextLessonSlide =
    document.getElementById('nextLessonSlide');


/* ---------------------------------------------------------
   Lesson information
   --------------------------------------------------------- */

const lessonTitle =
    document.getElementById('lessonTitle');

const lessonNumber =
    document.getElementById('lessonNumber');

const lessonTotal =
    document.getElementById('lessonTotal');

const currentPart =
    document.getElementById('currentPart');

const totalParts =
    document.getElementById('totalParts');

const partTitle =
    document.getElementById('partTitle');


/* ---------------------------------------------------------
   Lesson names
   --------------------------------------------------------- */

const lessonNames = [
    'Lewis Structures',
    'Molecular Shapes',
    'Polarity',
    'Heat Calculations and Diagrams',
    'Solids and their Properties'
];


/* ---------------------------------------------------------
   Current position
   --------------------------------------------------------- */

let activeLesson = 0;
let activePart = 0;


/* =========================================================
   PROGRESS BAR
   ========================================================= */

/*
    We deliberately create the progress bar if it does not
    already exist in the HTML.

    This means the lesson system won't break simply because
    #lessonProgressBar has been forgotten from the markup.
*/

let lessonProgressBar =
    document.getElementById('lessonProgressBar');


function createProgressBar() {

    if (!lessonMode) {
        return null;
    }


    /* Already exists */
    if (lessonProgressBar) {
        return lessonProgressBar;
    }


    /*
        Outer progress container
    */

    const progressContainer =
        document.createElement('div');

    progressContainer.className =
        'lesson-progress';

    progressContainer.setAttribute(
        'aria-label',
        'Lesson progress'
    );


    /*
        Inner progress bar
    */

    lessonProgressBar =
        document.createElement('div');

    lessonProgressBar.id =
        'lessonProgressBar';

    lessonProgressBar.className =
        'lesson-progress-bar';


    progressContainer.appendChild(
        lessonProgressBar
    );


    /*
        Put it at the top of the lesson reader.

        If your CSS already has a specific location for
        .lesson-progress, it can style this normally.
    */

    const firstChild =
        lessonMode.firstElementChild;

    if (firstChild) {

        lessonMode.insertBefore(
            progressContainer,
            firstChild
        );

    } else {

        lessonMode.appendChild(
            progressContainer
        );
    }


    /*
        Small fallback styles.

        These ensure the progress bar is visible even if
        CSS has not yet been added.
    */

    progressContainer.style.width =
        '100%';

    progressContainer.style.height =
        '4px';

    progressContainer.style.background =
        'rgba(0,0,0,0.08)';

    progressContainer.style.overflow =
        'hidden';

    progressContainer.style.position =
        'relative';

    lessonProgressBar.style.width =
        '0%';

    lessonProgressBar.style.height =
        '100%';

    lessonProgressBar.style.background =
        '#f4c928';

    lessonProgressBar.style.transition =
        reduceMotion
            ? 'none'
            : 'width 300ms ease';

    return lessonProgressBar;
}


/*
    Create it immediately if lesson reader exists.
*/

if (lessonMode) {
    createProgressBar();
}


/* ---------------------------------------------------------
   Update progress bar
   --------------------------------------------------------- */

function updateLessonProgress() {

    const bar =
        createProgressBar();

    if (!bar) {
        return;
    }


    const selectedLesson =
        document.querySelector(
            '.lesson-instance[data-lesson="' +
            activeLesson +
            '"]'
        );


    if (!selectedLesson) {
        bar.style.width = '0%';
        return;
    }


    const slides =
        selectedLesson.querySelectorAll(
            '.lesson-slide'
        );


    const total =
        slides.length;


    if (total <= 0) {

        bar.style.width =
            '0%';

        return;
    }


    const progress =
        (
            (activePart + 1) /
            total
        ) * 100;


    bar.style.width =
        Math.min(
            100,
            Math.max(
                0,
                progress
            )
        ) + '%';


    /*
        Accessibility
    */

    bar.setAttribute(
        'aria-valuemin',
        '1'
    );

    bar.setAttribute(
        'aria-valuemax',
        String(total)
    );

    bar.setAttribute(
        'aria-valuenow',
        String(activePart + 1)
    );
}


/* =========================================================
   URL / HASH HANDLING
   ========================================================= */

function updateHash() {

    const inLesson =
        lessonMode &&
        lessonMode.classList.contains('active');


    const hash =
        inLesson
            ? '#l' +
              activeLesson +
              '-p' +
              activePart
            : '';


    if (window.location.hash === hash) {
        return;
    }


    const newUrl =
        hash
            ? window.location.pathname +
              window.location.search +
              hash

            : window.location.pathname +
              window.location.search;


    history.pushState(
        null,
        '',
        newUrl
    );
}


function restoreFromHash() {

    if (
        !standardOverview ||
        !lessonMode
    ) {
        return;
    }


    const match =
        window.location.hash.match(
            /^#l(\d+)-p(\d+)$/
        );


    if (match) {

        openLesson(
            Number(match[1]),
            Number(match[2]),
            {
                skipHashUpdate: true
            }
        );

    } else {

        showStandardOverview(
            false
        );
    }
}


/* =========================================================
   SHOW OVERVIEW
   ========================================================= */

function showStandardOverview(
    updateURL = true
) {

    if (
        !standardOverview ||
        !lessonMode
    ) {
        return;
    }


    standardOverview.classList.add(
        'active'
    );


    lessonMode.classList.remove(
        'active'
    );


    lessonMode.setAttribute(
        'aria-hidden',
        'true'
    );


    document.body.classList.remove(
        'lesson-reading'
    );

    document.documentElement.classList.remove(
        'lesson-reading'
    );


    /*
        Hide all lesson instances.
    */

    lessonInstances.forEach(
        function (lesson) {

            lesson.classList.remove(
                'active'
            );
        }
    );


    /*
        Reset progress.
    */

    if (lessonProgressBar) {

        lessonProgressBar.style.width =
            '0%';
    }


    /*
        Remove focus from lesson controls.
    */

    if (
        document.activeElement &&
        typeof document.activeElement.blur ===
        'function'
    ) {

        document.activeElement.blur();
    }


    if (updateURL) {
        updateHash();
    }
}


/* =========================================================
   OPEN LESSON
   ========================================================= */

function openLesson(
    lessonIndex,
    partIndex = 0,
    options = {}
) {

    if (
        !standardOverview ||
        !lessonMode
    ) {
        return;
    }


    const selectedLesson =
        document.querySelector(
            '.lesson-instance[data-lesson="' +
            lessonIndex +
            '"]'
        );


    if (!selectedLesson) {

        showStandardOverview(
            !options.skipHashUpdate
        );

        return;
    }


    const slides =
        selectedLesson.querySelectorAll(
            '.lesson-slide'
        );


    if (slides.length === 0) {
        return;
    }


    /*
        Clamp the requested slide number.
    */

    activeLesson =
        Math.max(
            0,
            Math.min(
                lessonIndex,
                lessonInstances.length - 1
            )
        );


    activePart =
        Math.max(
            0,
            Math.min(
                partIndex,
                slides.length - 1
            )
        );


    /*
        Show lesson reader.
    */

    standardOverview.classList.remove(
        'active'
    );

    lessonMode.classList.add(
        'active'
    );

    lessonMode.setAttribute(
        'aria-hidden',
        'false'
    );


    document.body.classList.add(
        'lesson-reading'
    );

    document.documentElement.classList.add(
        'lesson-reading'
    );


    /*
        Hide every lesson.
    */

    lessonInstances.forEach(
        function (lesson) {

            lesson.classList.remove(
                'active'
            );
        }
    );


    /*
        Show selected lesson.
    */

    selectedLesson.classList.add(
        'active'
    );


    /*
        Hide every slide.
    */

    slides.forEach(
        function (slide) {

            slide.classList.remove(
                'active'
            );
        }
    );


    /*
        Show selected slide.
    */

    slides[activePart].classList.add(
        'active'
    );


    /*
        Reset internal scroll position.
    */

    slides[activePart].scrollTop =
        0;


    /*
        Update all interface information.
    */

    updateLessonInterface();


    /*
        IMPORTANT:
        Progress is updated here, after activeLesson
        and activePart have been set.

        This fixes the old `total is not defined`
        problem.
    */

    updateLessonProgress();


    /*
        Update URL.
    */

    if (!options.skipHashUpdate) {
        updateHash();
    }
}


/* =========================================================
   UPDATE LESSON INTERFACE
   ========================================================= */

function updateLessonInterface() {

    const selectedLesson =
        document.querySelector(
            '.lesson-instance[data-lesson="' +
            activeLesson +
            '"]'
        );


    if (!selectedLesson) {
        return;
    }


    const slides =
        selectedLesson.querySelectorAll(
            '.lesson-slide'
        );


    const total =
        slides.length;


    /*
        Lesson title
    */

    if (lessonTitle) {

        lessonTitle.textContent =
            lessonNames[activeLesson] ||
            'Lesson ' +
            (activeLesson + 1);
    }


    /*
        Lesson number
    */

    if (lessonNumber) {

        lessonNumber.textContent =
            String(
                activeLesson + 1
            ).padStart(
                2,
                '0'
            );
    }


    /*
        Total lessons
    */

    if (lessonTotal) {

        lessonTotal.textContent =
            String(
                lessonInstances.length
            ).padStart(
                2,
                '0'
            );
    }


    /*
        Current part
    */

    if (currentPart) {

        currentPart.textContent =
            String(
                activePart + 1
            ).padStart(
                2,
                '0'
            );
    }


    /*
        Total parts
    */

    if (totalParts) {

        totalParts.textContent =
            String(
                total
            ).padStart(
                2,
                '0'
            );
    }


    /*
        Part title
    */

    if (
        partTitle &&
        slides[activePart]
    ) {

        partTitle.textContent =
            slides[activePart]
                .dataset
                .partTitle ||
            '';
    }


    /*
        Previous button
    */

    if (previousLessonSlide) {

        previousLessonSlide.disabled =
            activeLesson === 0 &&
            activePart === 0;
    }


    /*
        Next button
    */

    if (nextLessonSlide) {

        nextLessonSlide.disabled =
            activeLesson ===
                lessonInstances.length - 1 &&
            activePart ===
                total - 1;
    }


    /*
        Update progress every time the interface
        changes.
    */

    updateLessonProgress();
}


/* =========================================================
   SHOW SPECIFIC SLIDE
   ========================================================= */

function showPart(partIndex) {

    const selectedLesson =
        document.querySelector(
            '.lesson-instance[data-lesson="' +
            activeLesson +
            '"]'
        );


    if (!selectedLesson) {
        return;
    }


    const slides =
        selectedLesson.querySelectorAll(
            '.lesson-slide'
        );


    if (
        partIndex < 0 ||
        partIndex >= slides.length
    ) {
        return;
    }


    slides.forEach(
        function (slide) {

            slide.classList.remove(
                'active'
            );
        }
    );


    const slide =
        slides[partIndex];


    slide.classList.add(
        'active'
    );


    slide.scrollTop =
        0;


    activePart =
        partIndex;


    updateLessonInterface();

    updateLessonProgress();

    updateHash();


    /*
        Move focus to the new slide heading.
    */

    const heading =
        slide.querySelector(
            '.part-heading h2, .cover-title'
        );


    if (heading) {

        heading.tabIndex =
            -1;

        heading.focus({
            preventScroll: true
        });
    }
}


/* =========================================================
   NEXT
   ========================================================= */

function goNext() {

    const selectedLesson =
        document.querySelector(
            '.lesson-instance[data-lesson="' +
            activeLesson +
            '"]'
        );


    if (!selectedLesson) {
        return;
    }


    const slides =
        selectedLesson.querySelectorAll(
            '.lesson-slide'
        );


    /*
        Move to next slide within lesson.
    */

    if (
        activePart <
        slides.length - 1
    ) {

        showPart(
            activePart + 1
        );

        return;
    }


    /*
        Move to next lesson.
    */

    if (
        activeLesson <
        lessonInstances.length - 1
    ) {

        openLesson(
            activeLesson + 1,
            0
        );
    }
}


/* =========================================================
   PREVIOUS
   ========================================================= */

function goPrevious() {

    /*
        Move backwards within lesson.
    */

    if (activePart > 0) {

        showPart(
            activePart - 1
        );

        return;
    }


    /*
        Move to previous lesson.
    */

    if (activeLesson > 0) {

        const previousLesson =
            document.querySelector(
                '.lesson-instance[data-lesson="' +
                (activeLesson - 1) +
                '"]'
            );


        if (previousLesson) {

            const previousSlides =
                previousLesson.querySelectorAll(
                    '.lesson-slide'
                );


            openLesson(
                activeLesson - 1,
                previousSlides.length - 1
            );
        }
    }
}


/* =========================================================
   LESSON CARD CLICK
   ========================================================= */

lessonCards.forEach(
    function (card) {

        card.addEventListener(
            'click',
            function () {

                const lessonIndex =
                    Number(
                        card.dataset.lesson
                    );


                if (
                    Number.isNaN(
                        lessonIndex
                    )
                ) {
                    return;
                }


                openLesson(
                    lessonIndex
                );
            }
        );
    }
);


/* =========================================================
   BACK TO 91164
   ========================================================= */

if (backToStandard) {

    backToStandard.addEventListener(
        'click',
        function () {

            showStandardOverview();
        }
    );
}


/* =========================================================
   NEXT BUTTON
   ========================================================= */

if (nextLessonSlide) {

    nextLessonSlide.addEventListener(
        'click',
        function () {

            goNext();
        }
    );
}


/* =========================================================
   PREVIOUS BUTTON
   ========================================================= */

if (previousLessonSlide) {

    previousLessonSlide.addEventListener(
        'click',
        function () {

            goPrevious();
        }
    );
}


/* =========================================================
   KEYBOARD NAVIGATION
   ========================================================= */

document.addEventListener(
    'keydown',
    function (event) {

        if (
            !lessonMode ||
            !lessonMode.classList.contains(
                'active'
            )
        ) {
            return;
        }


        const tag =
            event.target.tagName
                ? event.target.tagName.toLowerCase()
                : '';


        /*
            Don't hijack form controls.
        */

        if (
            tag === 'input' ||
            tag === 'textarea' ||
            tag === 'select' ||
            event.target.isContentEditable
        ) {
            return;
        }


        /*
            Right arrow
        */

        if (
            event.key ===
            'ArrowRight'
        ) {

            event.preventDefault();

            goNext();
        }


        /*
            Left arrow
        */

        if (
            event.key ===
            'ArrowLeft'
        ) {

            event.preventDefault();

            goPrevious();
        }


        /*
            Escape
        */

        if (
            event.key ===
            'Escape'
        ) {

            event.preventDefault();

            showStandardOverview();
        }
    }
);


/* =========================================================
   INITIAL STATE
   ========================================================= */

restoreFromHash();

window.addEventListener(
    'popstate',
    restoreFromHash
);

window.addEventListener(
    'hashchange',
    restoreFromHash
);


/* =========================================================
   VALENCE ELECTRON QUIZ
   ========================================================= */

const veQuiz =
    document.getElementById('veQuiz');

if (veQuiz) {

    const veRows =
        veQuiz.querySelectorAll(
            '.ve-quiz-row'
        );

    const veMarkButton =
        document.getElementById(
            'veQuizMark'
        );

    const veResetButton =
        document.getElementById(
            'veQuizReset'
        );

    const veScore =
        document.getElementById(
            'veQuizScore'
        );


    if (veMarkButton) {

        veMarkButton.addEventListener(
            'click',
            function () {

                let correctCount = 0;


                veRows.forEach(
                    function (row) {

                        const input =
                            row.querySelector(
                                '.ve-quiz-input'
                            );


                        if (!input) {
                            return;
                        }


                        const correctAnswer =
                            Number(
                                row.dataset.answer
                            );


                        const userAnswer =
                            Number(
                                input.value
                            );


                        row.classList.remove(
                            'correct',
                            'incorrect'
                        );


                        if (
                            input.value.trim() ===
                            ''
                        ) {
                            return;
                        }


                        if (
                            userAnswer ===
                            correctAnswer
                        ) {

                            row.classList.add(
                                'correct'
                            );

                            correctCount++;

                        } else {

                            row.classList.add(
                                'incorrect'
                            );
                        }
                    }
                );


                if (veScore) {

                    veScore.textContent =
                        correctCount +
                        ' / ' +
                        veRows.length +
                        ' correct';
                }
            }
        );
    }


    if (veResetButton) {

        veResetButton.addEventListener(
            'click',
            function () {

                veRows.forEach(
                    function (row) {

                        row.classList.remove(
                            'correct',
                            'incorrect'
                        );


                        const input =
                            row.querySelector(
                                '.ve-quiz-input'
                            );


                        if (input) {
                            input.value = '';
                        }
                    }
                );


                if (veScore) {
                    veScore.textContent = '';
                }
            }
        );
    }
}


/* =========================================================
   LEWIS STRUCTURE DRAWING WIDGETS
   ========================================================= */

const lewisDrawWidgets =
    document.querySelectorAll(
        '.lewis-draw'
    );


lewisDrawWidgets.forEach(
    function (widget) {

        const canvas =
            widget.querySelector(
                '.lewis-draw-canvas'
            );


        if (!canvas) {
            return;
        }


        const ctx =
            canvas.getContext('2d');


        const colorButtons =
            widget.querySelectorAll(
                '.lewis-color'
            );


        const sizeButtons =
            widget.querySelectorAll(
                '.lewis-size'
            );


        const undoButton =
            widget.querySelector(
                '.lewis-undo'
            );


        const clearButton =
            widget.querySelector(
                '.lewis-clear'
            );


        const revealButton =
            widget.querySelector(
                '.lewis-reveal'
            );


        const answerImage =
            widget.querySelector(
                '.lewis-draw-answer'
            );


        let currentColor =
            '#1a1714';


        let currentSize =
            2.5;


        let drawing =
            false;


        let currentStroke =
            null;


        let strokes =
            [];


        /* -----------------------------------------------------
           Canvas sizing
           ----------------------------------------------------- */

        function resizeCanvas() {

            const rect =
                canvas.getBoundingClientRect();


            if (
                rect.width === 0 ||
                rect.height === 0
            ) {
                return;
            }


            const ratio =
                window.devicePixelRatio || 1;


            canvas.width =
                rect.width * ratio;


            canvas.height =
                rect.height * ratio;


            ctx.setTransform(
                ratio,
                0,
                0,
                ratio,
                0,
                0
            );


            redraw();
        }


        if (
            'ResizeObserver' in window
        ) {

            const canvasResizeObserver =
                new ResizeObserver(
                    resizeCanvas
                );


            canvasResizeObserver.observe(
                canvas
            );

        } else {

            window.addEventListener(
                'resize',
                resizeCanvas
            );
        }


        /* -----------------------------------------------------
           Redraw
           ----------------------------------------------------- */

        function redraw() {

            const rect =
                canvas.getBoundingClientRect();


            ctx.clearRect(
                0,
                0,
                rect.width,
                rect.height
            );


            strokes.forEach(
                function (stroke) {

                    drawStroke(
                        stroke
                    );
                }
            );
        }


        function drawStroke(
            stroke
        ) {

            if (
                !stroke.points.length
            ) {
                return;
            }


            ctx.strokeStyle =
                stroke.color;


            ctx.lineWidth =
                stroke.size;


            ctx.lineCap =
                'round';


            ctx.lineJoin =
                'round';


            ctx.beginPath();


            ctx.moveTo(
                stroke.points[0].x,
                stroke.points[0].y
            );


            stroke.points.forEach(
                function (point) {

                    ctx.lineTo(
                        point.x,
                        point.y
                    );
                }
            );


            ctx.stroke();
        }


        /* -----------------------------------------------------
           Pointer position
           ----------------------------------------------------- */

        function getPoint(
            event
        ) {

            const rect =
                canvas.getBoundingClientRect();


            return {

                x:
                    event.clientX -
                    rect.left,

                y:
                    event.clientY -
                    rect.top
            };
        }


        /* -----------------------------------------------------
           Drawing
           ----------------------------------------------------- */

        canvas.addEventListener(
            'pointerdown',
            function (event) {

                drawing = true;


                currentStroke = {

                    color:
                        currentColor,

                    size:
                        currentSize,

                    points: [
                        getPoint(event)
                    ]
                };


                canvas.setPointerCapture(
                    event.pointerId
                );
            }
        );


        canvas.addEventListener(
            'pointermove',
            function (event) {

                if (
                    !drawing ||
                    !currentStroke
                ) {
                    return;
                }


                currentStroke.points.push(
                    getPoint(event)
                );


                redraw();


                drawStroke(
                    currentStroke
                );
            }
        );


        function endStroke() {

            if (
                !drawing ||
                !currentStroke
            ) {
                return;
            }


            strokes.push(
                currentStroke
            );


            currentStroke =
                null;


            drawing =
                false;
        }


        canvas.addEventListener(
            'pointerup',
            endStroke
        );


        canvas.addEventListener(
            'pointercancel',
            endStroke
        );


        /* -----------------------------------------------------
           Toolbar: colours
           ----------------------------------------------------- */

        colorButtons.forEach(
            function (button) {

                button.addEventListener(
                    'click',
                    function () {

                        colorButtons.forEach(
                            function (b) {

                                b.classList.remove(
                                    'active'
                                );
                            }
                        );


                        button.classList.add(
                            'active'
                        );


                        currentColor =
                            button.dataset.color;
                    }
                );
            }
        );


        /* -----------------------------------------------------
           Toolbar: size
           ----------------------------------------------------- */

        sizeButtons.forEach(
            function (button) {

                button.addEventListener(
                    'click',
                    function () {

                        sizeButtons.forEach(
                            function (b) {

                                b.classList.remove(
                                    'active'
                                );
                            }
                        );


                        button.classList.add(
                            'active'
                        );


                        currentSize =
                            Number(
                                button.dataset.size
                            );
                    }
                );
            }
        );


        /* -----------------------------------------------------
           Undo
           ----------------------------------------------------- */

        if (undoButton) {

            undoButton.addEventListener(
                'click',
                function () {

                    strokes.pop();

                    redraw();
                }
            );
        }


        /* -----------------------------------------------------
           Clear
           ----------------------------------------------------- */

        if (clearButton) {

            clearButton.addEventListener(
                'click',
                function () {

                    strokes = [];

                    redraw();
                }
            );
        }


        /* -----------------------------------------------------
           REVEAL ANSWER
           
           IMPORTANT:
           The answer replaces the student's canvas.

           It is NOT drawn over the canvas.
           ----------------------------------------------------- */

                if (revealButton && answerImage) {

            const canvasWrap =
                widget.querySelector('.lewis-draw-canvas-wrap');

            let answerShown = false;

            /* Set the starting state in JS, not in the HTML */
            answerImage.hidden = true;
            canvas.hidden = false;

            revealButton.addEventListener('click', function () {

                answerShown = !answerShown;

                answerImage.hidden = !answerShown;
                canvas.hidden = answerShown;

                revealButton.textContent =
                    answerShown ? 'Try again' : 'Show answer';

                if (canvasWrap) {
                    canvasWrap.classList.toggle('answer-visible', answerShown);
                }
            });
        }


        /* -----------------------------------------------------
           Initial sizing
           ----------------------------------------------------- */

        /* -----------------------------------------------------
   Initial sizing
   ----------------------------------------------------- */

/*
    The lesson starts hidden.

    A canvas inside display:none has zero dimensions,
    so store the resize function on the widget so it
    can be called again when the slide becomes visible.
*/

widget._resizeLewisCanvas = resizeCanvas;

const promptImage =
    widget.querySelector('.lewis-draw-prompt');

if (promptImage) {
    promptImage.style.pointerEvents = 'none';
}

canvas.style.pointerEvents = 'auto';

resizeCanvas();
    }
);


/* =========================================================
   CONTENTS PAGE LINKS
   ========================================================= */

document
    .querySelectorAll(
        '.cover-contents button'
    )
    .forEach(
        function (button) {

            button.addEventListener(
                'click',
                function () {

                    const target =
                        Number(
                            button.dataset.goto
                        );


                    if (
                        Number.isNaN(
                            target
                        )
                    ) {
                        return;
                    }


                    showPart(
                        target
                    );
                }
            );
        }
    );


/* =========================================================
   SHAPE + ANGLE PICKERS
   ========================================================= */

document
    .querySelectorAll(
        '.shape-pick'
    )
    .forEach(
        function (widget) {

            const groups =
                widget.querySelectorAll(
                    '.shape-pick-group'
                );


            const checkButton =
                widget.querySelector(
                    '.shape-check'
                );


            const resetButton =
                widget.querySelector(
                    '.shape-reset'
                );


            const result =
                widget.querySelector(
                    '.shape-pick-result'
                );


            /* -------------------------------------------------
               Option selection
               ------------------------------------------------- */

            groups.forEach(
                function (group) {

                    const options =
                        group.querySelectorAll(
                            '.shape-option'
                        );


                    options.forEach(
                        function (option) {

                            option.addEventListener(
                                'click',
                                function () {

                                    if (
                                        widget.classList.contains(
                                            'checked'
                                        )
                                    ) {
                                        return;
                                    }


                                    options.forEach(
                                        function (other) {

                                            other.classList.remove(
                                                'selected'
                                            );


                                            other.setAttribute(
                                                'aria-pressed',
                                                'false'
                                            );
                                        }
                                    );


                                    option.classList.add(
                                        'selected'
                                    );


                                    option.setAttribute(
                                        'aria-pressed',
                                        'true'
                                    );


                                    if (result) {

                                        result.textContent =
                                            '';

                                        result.classList.remove(
                                            'all-correct'
                                        );
                                    }
                                }
                            );
                        }
                    );
                }
            );


            /* -------------------------------------------------
               Check
               ------------------------------------------------- */

            if (checkButton) {

                checkButton.addEventListener(
                    'click',
                    function () {

                        if (
                            widget.classList.contains(
                                'checked'
                            )
                        ) {
                            return;
                        }


                        const unanswered =
                            Array.from(
                                groups
                            ).some(
                                function (group) {

                                    return !group.querySelector(
                                        '.shape-option.selected'
                                    );
                                }
                            );


                        if (unanswered) {

                            if (result) {

                                result.textContent =
                                    'Answer every part first.';

                                result.classList.remove(
                                    'all-correct'
                                );
                            }

                            return;
                        }


                        const feedback = [];

                        let correctCount = 0;


                        groups.forEach(
                            function (group) {

                                const key =
                                    group.dataset.group;


                                const correctValue =
                                    widget.dataset[key];


                                const selected =
                                    group.querySelector(
                                        '.shape-option.selected'
                                    );


                                const isCorrect =
                                    selected.dataset.value ===
                                    correctValue;


                                selected.classList.add(
                                    isCorrect
                                        ? 'correct'
                                        : 'incorrect'
                                );


                                if (isCorrect) {
                                    correctCount++;
                                }


                                feedback.push(
                                    key.charAt(0).toUpperCase() +
                                    key.slice(1) +
                                    (
                                        isCorrect
                                            ? ' ✓'
                                            : ' ✕'
                                    )
                                );
                            }
                        );


                        widget.classList.add(
                            'checked'
                        );


                        if (!result) {
                            return;
                        }


                        if (
                            correctCount ===
                            groups.length
                        ) {

                            result.textContent =
                                'All correct.';

                            result.classList.add(
                                'all-correct'
                            );

                        } else {

                            result.textContent =
                                feedback.join(
                                    '   '
                                );

                            result.classList.remove(
                                'all-correct'
                            );
                        }
                    }
                );
            }


            /* -------------------------------------------------
               Reset
               ------------------------------------------------- */

            if (resetButton) {

                resetButton.addEventListener(
                    'click',
                    function () {

                        widget.classList.remove(
                            'checked'
                        );


                        widget
                            .querySelectorAll(
                                '.shape-option'
                            )
                            .forEach(
                                function (option) {

                                    option.classList.remove(
                                        'selected',
                                        'correct',
                                        'incorrect'
                                    );


                                    option.setAttribute(
                                        'aria-pressed',
                                        'false'
                                    );
                                }
                            );


                        if (result) {

                            result.textContent =
                                '';

                            result.classList.remove(
                                'all-correct'
                            );
                        }
                    }
                );
            }
        }
    );


/* =========================================================
   WRITTEN QUESTION WIDGETS
   ========================================================= */

document
    .querySelectorAll(
        '.written-q'
    )
    .forEach(
        function (widget) {

            const input =
                widget.querySelector(
                    '.wq-input'
                );


            const submitButton =
                widget.querySelector(
                    '.wq-submit'
                );


            const clearButton =
                widget.querySelector(
                    '.wq-clear'
                );


            const wordCount =
                widget.querySelector(
                    '.wq-wordcount'
                );


            const message =
                widget.querySelector(
                    '.wq-message'
                );


            const feedback =
                widget.querySelector(
                    '.wq-feedback'
                );


            const keywordScore =
                widget.querySelector(
                    '.wq-keyword-score'
                );


            const gaugeFill =
                widget.querySelector(
                    '.wq-gauge-fill'
                );


            const keywordItems =
                widget.querySelectorAll(
                    '.wq-keywords .wq-checklist li'
                );


            const minWords =
                Number(
                    widget.dataset.minWords
                ) || 1;


            function countWords(text) {

                return text
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean)
                    .length;
            }


            function escapeRegExp(text) {

                return text.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    '\\$&'
                );
            }


            function containsKeyword(
                text,
                keyword
            ) {

                const k =
                    keyword
                        .trim()
                        .toLowerCase();


                if (!k) {
                    return false;
                }


                return new RegExp(
                    '(^|[^a-z0-9.])' +
                    escapeRegExp(k)
                ).test(text);
            }


            function scan(text) {

                let foundCount = 0;


                keywordItems.forEach(
                    function (item) {

                        const keywords =
                            (
                                item.dataset.keywords ||
                                ''
                            ).split('|');


                        const found =
                            keywords.some(
                                function (keyword) {

                                    return containsKeyword(
                                        text,
                                        keyword
                                    );
                                }
                            );


                        item.classList.toggle(
                            'found',
                            found
                        );


                        item.classList.toggle(
                            'missing',
                            !found
                        );


                        const tick =
                            item.querySelector(
                                '.wq-tick'
                            );


                        if (tick) {

                            tick.textContent =
                                found
                                    ? '✓'
                                    : '✕';
                        }


                        if (found) {
                            foundCount++;
                        }
                    }
                );


                const total =
                    keywordItems.length;


                if (keywordScore) {

                    keywordScore.textContent =
                        foundCount +
                        ' / ' +
                        total;
                }


                if (gaugeFill) {

                    gaugeFill.style.width =
                        (
                            total
                                ? (
                                    foundCount /
                                    total
                                ) * 100
                                : 0
                        ) +
                        '%';
                }
            }


            if (input) {

                input.addEventListener(
                    'input',
                    function () {

                        const words =
                            countWords(
                                input.value
                            );


                        if (wordCount) {

                            wordCount.textContent =
                                words +
                                (
                                    words === 1
                                        ? ' word'
                                        : ' words'
                                );
                        }


                        if (message) {
                            message.textContent = '';
                        }
                    }
                );
            }


            if (submitButton) {

                submitButton.addEventListener(
                    'click',
                    function () {

                        const answer =
                            input.value.trim();


                        if (
                            countWords(answer) <
                            minWords
                        ) {

                            if (message) {

                                message.textContent =
                                    'Write a little more before submitting (at least ' +
                                    minWords +
                                    ' words).';
                            }

                            return;
                        }


                        if (message) {
                            message.textContent = '';
                        }


                        scan(
                            normalise(answer)
                        );


                        if (feedback) {

                            feedback.hidden =
                                false;

                            feedback.open =
                                true;


                            feedback.scrollIntoView({
                                behavior:
                                    reduceMotion
                                        ? 'auto'
                                        : 'smooth',

                                block:
                                    'nearest'
                            });
                        }


                        submitButton.textContent =
                            'Check again';
                    }
                );
            }


            function normalise(text) {

                return text
                    .toLowerCase()

                    .replace(
                        /[₀-₉]/g,
                        function (d) {

                            return String(
                                d.charCodeAt(0) -
                                0x2080
                            );
                        }
                    )

                    .replace(
                        /[’‘]/g,
                        "'"
                    )

                    .replace(
                        /[–—]/g,
                        '-'
                    )

                    .replace(
                        /[°º˚]/g,
                        ''
                    )

                    .replace(
                        /\s+/g,
                        ' '
                    );
            }


            if (clearButton) {

                clearButton.addEventListener(
                    'click',
                    function () {

                        input.value = '';


                        if (wordCount) {
                            wordCount.textContent =
                                '0 words';
                        }


                        if (message) {
                            message.textContent = '';
                        }


                        if (feedback) {

                            feedback.hidden =
                                true;

                            feedback.open =
                                false;
                        }


                        keywordItems.forEach(
                            function (item) {

                                item.classList.remove(
                                    'found',
                                    'missing'
                                );


                                const tick =
                                    item.querySelector(
                                        '.wq-tick'
                                    );


                                if (tick) {
                                    tick.textContent = '';
                                }
                            }
                        );


                        if (keywordScore) {
                            keywordScore.textContent = '';
                        }


                        if (gaugeFill) {
                            gaugeFill.style.width = '0';
                        }


                        submitButton.textContent =
                            'Submit';
                    }
                );
            }
        }
    );


/* =========================================================
   ELECTRONEGATIVITY QUIZ
   ========================================================= */

const enQuiz =
    document.getElementById(
        'enQuiz'
    );


if (enQuiz) {

    const enRows =
        enQuiz.querySelectorAll(
            '.ve-quiz-row'
        );


    const enMarkButton =
        document.getElementById(
            'enQuizMark'
        );


    const enResetButton =
        document.getElementById(
            'enQuizReset'
        );


    const enScore =
        document.getElementById(
            'enQuizScore'
        );


    if (enMarkButton) {

        enMarkButton.addEventListener(
            'click',
            function () {

                let correctCount =
                    0;


                enRows.forEach(
                    function (row) {

                        const input =
                            row.querySelector(
                                '.ve-quiz-input'
                            );


                        if (!input) {
                            return;
                        }


                        const correctAnswer =
                            row.dataset.answer
                                .toLowerCase();


                        const userAnswer =
                            input.value
                                .trim()
                                .toLowerCase();


                        row.classList.remove(
                            'correct',
                            'incorrect'
                        );


                        if (
                            userAnswer ===
                            ''
                        ) {
                            return;
                        }


                        if (
                            userAnswer ===
                            correctAnswer
                        ) {

                            row.classList.add(
                                'correct'
                            );

                            correctCount++;

                        } else {

                            row.classList.add(
                                'incorrect'
                            );
                        }
                    }
                );


                if (enScore) {

                    enScore.textContent =
                        correctCount +
                        ' / ' +
                        enRows.length +
                        ' correct';
                }
            }
        );
    }


    if (enResetButton) {

        enResetButton.addEventListener(
            'click',
            function () {

                enRows.forEach(
                    function (row) {

                        row.classList.remove(
                            'correct',
                            'incorrect'
                        );


                        const input =
                            row.querySelector(
                                '.ve-quiz-input'
                            );


                        if (input) {
                            input.value = '';
                        }
                    }
                );


                if (enScore) {
                    enScore.textContent = '';
                }
            }
        );
    }
}


/* =========================================================
   CALCULATION QUESTIONS
   ========================================================= */

document
    .querySelectorAll(
        '.calc-q'
    )
    .forEach(
        function (widget) {

            const input =
                widget.querySelector(
                    '.calc-q-input'
                );


            const checkButton =
                widget.querySelector(
                    '.calc-q-check'
                );


            const resetButton =
                widget.querySelector(
                    '.calc-q-reset'
                );


            const result =
                widget.querySelector(
                    '.calc-q-result'
                );


            const working =
                widget.querySelector(
                    '.calc-q-working'
                );


            const exact =
                Number(
                    widget.dataset.answer
                );


            const wantedSF =
                Number(
                    widget.dataset.sf
                ) || 3;


            const rounded =
                Number(
                    exact.toPrecision(
                        wantedSF
                    )
                );


            function countSigFigs(text) {

                return text
                    .replace(
                        /^[-+]/,
                        ''
                    )

                    .replace(
                        '.',
                        ''
                    )

                    .replace(
                        /^0+/,
                        ''
                    )

                    .length;
            }


            function setResult(
                message,
                state
            ) {

                result.textContent =
                    message;


                result.classList.remove(
                    'correct',
                    'incorrect'
                );


                if (state) {

                    result.classList.add(
                        state
                    );
                }
            }


            if (checkButton) {

                checkButton.addEventListener(
                    'click',
                    function () {

                        const raw =
                            input.value
                                .trim()
                                .replace(
                                    /,/g,
                                    ''
                                );


                        const value =
                            Number(raw);


                        if (
                            raw === '' ||
                            Number.isNaN(value)
                        ) {

                            setResult(
                                'Enter a number first.',
                                ''
                            );

                            return;
                        }


                        const nearlyRight =
                            Math.abs(
                                value -
                                exact
                            ) /
                            Math.abs(exact) <
                            0.01;


                        if (!nearlyRight) {

                            setResult(
                                'Not quite. Check which way the equation rearranges, and your units.',
                                'incorrect'
                            );


                            if (working) {
                                working.hidden = false;
                            }

                            return;
                        }


                        if (
                            countSigFigs(raw) !==
                            wantedSF
                        ) {

                            setResult(
                                'Right value, but give it to ' +
                                wantedSF +
                                ' significant figures.',
                                'incorrect'
                            );

                            return;
                        }


                        if (
                            Math.abs(
                                value -
                                rounded
                            ) >
                            Math.abs(rounded) *
                            1e-9
                        ) {

                            setResult(
                                'Close, but check your rounding. Look at the digit after the last one you keep.',
                                'incorrect'
                            );

                            return;
                        }


                        setResult(
                            'Correct.',
                            'correct'
                        );


                        if (working) {

                            working.hidden =
                                false;

                            working.open =
                                true;
                        }
                    }
                );
            }


            if (resetButton) {

                resetButton.addEventListener(
                    'click',
                    function () {

                        input.value =
                            '';


                        setResult(
                            '',
                            ''
                        );


                        if (working) {

                            working.hidden =
                                true;

                            working.open =
                                false;
                        }
                    }
                );
            }
        }
    );


/* =========================================================
   MODE QUESTION
   ========================================================= */

(function () {

    function num(s) {

        const n =
            parseFloat(
                String(s)
                    .replace(
                        /,/g,
                        ''
                    )
                    .trim()
            );


        return isNaN(n)
            ? null
            : n;
    }


    function close(
        value,
        answer,
        tolerance
    ) {

        return (
            value !== null &&
            Math.abs(
                value -
                answer
            ) /
            Math.abs(answer) <=
            tolerance
        );
    }


    function esc(s) {

        return s.replace(
            /[.*+?^${}()|[\]\\]/g,
            '\\$&'
        );
    }


    document
        .querySelectorAll(
            '.mode-q'
        )
        .forEach(
            function (root) {

                const tabs =
                    root.querySelectorAll(
                        '.mq-tab'
                    );


                const panels =
                    root.querySelectorAll(
                        '.mq-panel'
                    );


                const fb =
                    root.querySelector(
                        '.mq-feedback'
                    );


                let revealed =
                    null;


                function show(mode) {

                    root.dataset.mode =
                        mode;


                    tabs.forEach(
                        function (tab) {

                            const active =
                                tab.dataset.mode ===
                                mode;


                            tab.classList.toggle(
                                'active',
                                active
                            );


                            tab.setAttribute(
                                'aria-selected',
                                active
                            );
                        }
                    );


                    panels.forEach(
                        function (panel) {

                            panel.hidden =
                                panel.dataset.mode !==
                                mode;
                        }
                    );


                    if (fb) {

                        fb.hidden =
                            revealed !== mode;
                    }
                }


                function reveal(mode) {

                    revealed =
                        mode;


                    if (!fb) {
                        return;
                    }


                    fb.hidden =
                        false;


                    fb.open =
                        true;


                    fb.scrollIntoView({
                        behavior:
                            reduceMotion
                                ? 'auto'
                                : 'smooth',

                        block:
                            'nearest'
                    });
                }


                function unreveal(mode) {

                    if (
                        revealed ===
                        mode
                    ) {

                        revealed =
                            null;


                        if (fb) {

                            fb.hidden =
                                true;

                            fb.open =
                                false;
                        }
                    }
                }


                tabs.forEach(
                    function (tab) {

                        tab.addEventListener(
                            'click',
                            function () {

                                show(
                                    tab.dataset.mode
                                );
                            }
                        );
                    }
                );


                /* -------------------------------------------------
                   Exam version
                   ------------------------------------------------- */

                const work =
                    root.querySelector(
                        '.mq-working'
                    );


                const valIn =
                    root.querySelector(
                        '.mq-final-value'
                    );


                const unitIn =
                    root.querySelector(
                        '.mq-final-unit'
                    );


                const examMsg =
                    root.querySelector(
                        '.mq-exam-msg'
                    );


                root
                    .querySelectorAll(
                        '.mq-sym'
                    )
                    .forEach(
                        function (button) {

                            button.addEventListener(
                                'mousedown',
                                function (event) {

                                    event.preventDefault();
                                }
                            );


                            button.addEventListener(
                                'click',
                                function () {

                                    if (!work) {
                                        return;
                                    }


                                    const insert =
                                        button.dataset.insert;


                                    const start =
                                        work.selectionStart;


                                    const end =
                                        work.selectionEnd;


                                    work.value =
                                        work.value.slice(
                                            0,
                                            start
                                        ) +
                                        insert +
                                        work.value.slice(
                                            end
                                        );


                                    work.focus();


                                    work.setSelectionRange(
                                        start +
                                        insert.length,
                                        start +
                                        insert.length
                                    );
                                }
                            );
                        }
                    );


                function runKeywords(text) {

                    if (!fb) {
                        return;
                    }


                    const lower =
                        text.toLowerCase();


                    const items =
                        fb.querySelectorAll(
                            '.wq-checklist li[data-keywords]'
                        );


                    let found =
                        0;


                    items.forEach(
                        function (li) {

                            const hit =
                                li.dataset.keywords
                                    .split('|')
                                    .some(
                                        function (keyword) {

                                            return new RegExp(
                                                '(^|[^a-z0-9.])' +
                                                esc(
                                                    keyword
                                                        .trim()
                                                        .toLowerCase()
                                                )
                                            ).test(
                                                lower
                                            );
                                        }
                                    );


                            li.classList.toggle(
                                'found',
                                hit
                            );


                            li.classList.toggle(
                                'missing',
                                !hit
                            );


                            const tick =
                                li.querySelector(
                                    '.wq-tick'
                                );


                            if (tick) {

                                tick.textContent =
                                    hit
                                        ? '✓'
                                        : '✕';
                            }


                            if (hit) {
                                found++;
                            }
                        }
                    );


                    const score =
                        fb.querySelector(
                            '.wq-keyword-score'
                        );


                    const gauge =
                        fb.querySelector(
                            '.wq-gauge-fill'
                        );


                    if (score) {

                        score.textContent =
                            found +
                            ' / ' +
                            items.length;
                    }


                    if (gauge) {

                        gauge.style.width =
                            (
                                items.length
                                    ? (
                                        found /
                                        items.length
                                    ) * 100
                                    : 0
                            ) +
                            '%';
                    }
                }


                const examSubmit =
                    root.querySelector(
                        '.mq-exam-submit'
                    );


                if (examSubmit) {

                    examSubmit.addEventListener(
                        'click',
                        function () {

                            const text =
                                work
                                    ? work.value.trim()
                                    : '';


                            const value =
                                valIn
                                    ? num(
                                        valIn.value
                                    )
                                    : null;


                            const unit =
                                unitIn
                                    ? unitIn.value.trim()
                                    : '';


                            if (
                                text.length <
                                20
                            ) {

                                if (examMsg) {

                                    examMsg.className =
                                        'mq-msg bad';

                                    examMsg.textContent =
                                        'Show your working before submitting.';
                                }

                                return;
                            }


                            if (
                                value === null
                            ) {

                                if (examMsg) {

                                    examMsg.className =
                                        'mq-msg bad';

                                    examMsg.textContent =
                                        'Enter your final answer.';
                                }

                                return;
                            }


                            const answer =
                                parseFloat(
                                    root.dataset.answer
                                );


                            const tolerance =
                                parseFloat(
                                    root.dataset.tol
                                );


                            const valueCorrect =
                                close(
                                    value,
                                    answer,
                                    tolerance
                                );


                            const unitPattern =
                                new RegExp(
                                    root.dataset.unit ||
                                    '^(l|litres?|liters?)$',
                                    'i'
                                );


                            const unitCorrect =
                                unitPattern.test(
                                    unit
                                        .replace(
                                            /\s+/g,
                                            ' '
                                        )
                                        .replace(
                                            /[\u2212\u2013]/g,
                                            '-'
                                        )
                                );


                            if (
                                valueCorrect &&
                                unitCorrect
                            ) {

                                examMsg.className =
                                    'mq-msg ok';

                                examMsg.textContent =
                                    'Final answer correct.';

                            } else if (
                                valueCorrect
                            ) {

                                examMsg.className =
                                    'mq-msg bad';

                                examMsg.textContent =
                                    'The value matches, but the unit is missing or wrong.';

                            } else {

                                examMsg.className =
                                    'mq-msg bad';

                                examMsg.textContent =
                                    'Final answer doesn’t match. Compare your working with the exemplar.';
                            }


                            runKeywords(
                                text +
                                ' ' +
                                (
                                    valIn
                                        ? valIn.value
                                        : ''
                                ) +
                                ' ' +
                                unit
                            );


                            reveal(
                                'exam'
                            );
                        }
                    );
                }


                const examReset =
                    root.querySelector(
                        '.mq-exam-reset'
                    );


                if (examReset) {

                    examReset.addEventListener(
                        'click',
                        function () {

                            if (work) {
                                work.value = '';
                            }


                            if (valIn) {
                                valIn.value = '';
                            }


                            if (unitIn) {
                                unitIn.value = '';
                            }


                            if (examMsg) {

                                examMsg.textContent =
                                    '';

                                examMsg.className =
                                    'mq-msg mq-exam-msg';
                            }


                            if (fb) {

                                fb
                                    .querySelectorAll(
                                        '.wq-checklist li'
                                    )
                                    .forEach(
                                        function (li) {

                                            li.classList.remove(
                                                'found',
                                                'missing'
                                            );


                                            const tick =
                                                li.querySelector(
                                                    '.wq-tick'
                                                );


                                            if (tick) {
                                                tick.textContent = '';
                                            }
                                        }
                                    );


                                const score =
                                    fb.querySelector(
                                        '.wq-keyword-score'
                                    );


                                const gauge =
                                    fb.querySelector(
                                        '.wq-gauge-fill'
                                    );


                                if (score) {
                                    score.textContent = '';
                                }


                                if (gauge) {
                                    gauge.style.width = '0';
                                }
                            }


                            unreveal(
                                'exam'
                            );
                        }
                    );
                }


                /* -------------------------------------------------
                   Guided version
                   ------------------------------------------------- */

                const steps =
                    Array.from(
                        root.querySelectorAll(
                            '.mq-step'
                        )
                    );


                const road =
                    root.querySelectorAll(
                        '.mq-roadmap li'
                    );


                const doneMsg =
                    root.querySelector(
                        '.mq-guided-done'
                    );


                function paint() {

                    const current =
                        steps.findIndex(
                            function (step) {

                                return !step.classList.contains(
                                    'done'
                                );
                            }
                        );


                    steps.forEach(
                        function (step, index) {

                            const locked =
                                current !== -1 &&
                                index > current;


                            step.classList.toggle(
                                'locked',
                                locked
                            );


                            const input =
                                step.querySelector(
                                    '.mq-input'
                                );


                            if (input) {

                                input.disabled =
                                    locked ||
                                    step.classList.contains(
                                        'done'
                                    );
                            }
                        }
                    );


                    road.forEach(
                        function (item, index) {

                            if (!steps[index]) {
                                return;
                            }


                            item.classList.toggle(
                                'done',
                                steps[index].classList.contains(
                                    'done'
                                )
                            );


                            item.classList.toggle(
                                'active',
                                index === current
                            );
                        }
                    );
                }


                steps.forEach(
                    function (step) {

                        const input =
                            step.querySelector(
                                '.mq-input'
                            );


                        const msg =
                            step.querySelector(
                                '.mq-msg'
                            );


                        const checkButton =
                            step.querySelector(
                                '.mq-step-check'
                            );


                        function check() {

                            if (!input || !msg) {
                                return;
                            }


                            let correct;


                            if (
                                step.dataset.text
                            ) {

                                if (!input.value) {

                                    msg.className =
                                        'mq-msg bad';

                                    msg.textContent =
                                        'Choose an answer first.';

                                    return;
                                }


                                correct =
                                    input.value.toLowerCase() ===
                                    step.dataset.text;

                            } else {

                                const value =
                                    num(
                                        input.value
                                    );


                                if (
                                    value === null
                                ) {

                                    msg.className =
                                        'mq-msg bad';

                                    msg.textContent =
                                        'Type your answer first.';

                                    return;
                                }


                                correct =
                                    close(
                                        value,
                                        parseFloat(
                                            step.dataset.answer
                                        ),
                                        parseFloat(
                                            step.dataset.tol
                                        )
                                    );
                            }


                            if (correct) {

                                step.classList.add(
                                    'done'
                                );


                                const working =
                                    step.querySelector(
                                        '.mq-step-working'
                                    );


                                if (working) {
                                    working.hidden = false;
                                }


                                msg.className =
                                    'mq-msg ok';

                                msg.textContent =
                                    'Correct.';


                                paint();


                                const allDone =
                                    steps.every(
                                        function (s) {

                                            return s.classList.contains(
                                                'done'
                                            );
                                        }
                                    );


                                if (allDone) {

                                    if (doneMsg) {
                                        doneMsg.hidden = false;
                                    }


                                    reveal(
                                        'guided'
                                    );
                                }

                            } else {

                                msg.className =
                                    'mq-msg bad';

                                msg.textContent =
                                    step.dataset.nudge ||
                                    'Not quite. Try again.';
                            }
                        }


                        if (checkButton) {

                            checkButton.addEventListener(
                                'click',
                                check
                            );
                        }


                        if (input) {

                            input.addEventListener(
                                'keydown',
                                function (event) {

                                    if (
                                        event.key ===
                                        'Enter'
                                    ) {

                                        event.preventDefault();

                                        check();
                                    }
                                }
                            );
                        }
                    }
                );


                const guidedReset =
                    root.querySelector(
                        '.mq-guided-reset'
                    );


                if (guidedReset) {

                    guidedReset.addEventListener(
                        'click',
                        function () {

                            steps.forEach(
                                function (step) {

                                    step.classList.remove(
                                        'done'
                                    );


                                    const input =
                                        step.querySelector(
                                            '.mq-input'
                                        );


                                    if (input) {
                                        input.value = '';
                                    }


                                    const working =
                                        step.querySelector(
                                            '.mq-step-working'
                                        );


                                    if (working) {
                                        working.hidden = true;
                                    }


                                    const message =
                                        step.querySelector(
                                            '.mq-msg'
                                        );


                                    if (message) {

                                        message.textContent =
                                            '';

                                        message.className =
                                            'mq-msg';
                                    }
                                }
                            );


                            if (doneMsg) {
                                doneMsg.hidden = true;
                            }


                            unreveal(
                                'guided'
                            );


                            paint();
                        }
                    );
                }


                const gotoExam =
                    root.querySelector(
                        '.mq-goto-exam'
                    );


                if (gotoExam) {

                    gotoExam.addEventListener(
                        'click',
                        function () {

                            show(
                                'exam'
                            );
                        }
                    );
                }


                paint();

                show('exam');
            }
        );

})();


/* =========================================================
   BOND ENTHALPY QUESTION
   ========================================================= */

(function () {

    function num(s) {

        const text =
            String(s)
                .replace(
                    /[\u2212\u2013]/g,
                    '-'
                )
                .replace(
                    /,/g,
                    ''
                )
                .trim();


        const number =
            parseFloat(text);


        return isNaN(number)
            ? null
            : number;
    }


    document
        .querySelectorAll(
            '.bond-q'
        )
        .forEach(
            function (root) {

                const rows =
                    root.querySelectorAll(
                        '.bq-row'
                    );


                const score =
                    root.querySelector(
                        '.bq-score'
                    );


                function mark(
                    row,
                    correct
                ) {

                    row.classList.toggle(
                        'correct',
                        correct
                    );


                    row.classList.toggle(
                        'incorrect',
                        !correct
                    );
                }


                const checkButton =
                    root.querySelector(
                        '.bq-check'
                    );


                if (checkButton) {

                    checkButton.addEventListener(
                        'click',
                        function () {

                            let right =
                                0;


                            let answered =
                                0;


                            rows.forEach(
                                function (row) {

                                    const answer =
                                        row.dataset.answer;


                                    if (
                                        row.classList.contains(
                                            'bq-select-row'
                                        )
                                    ) {

                                        const select =
                                            row.querySelector(
                                                '.bq-select'
                                            );


                                        const value =
                                            select
                                                ? select.value
                                                : '';


                                        if (!value) {

                                            row.classList.remove(
                                                'correct',
                                                'incorrect'
                                            );

                                            return;
                                        }


                                        answered++;


                                        const correct =
                                            value ===
                                            answer;


                                        mark(
                                            row,
                                            correct
                                        );


                                        if (correct) {
                                            right++;
                                        }


                                        return;
                                    }


                                    const input =
                                        row.querySelector(
                                            '.bq-input'
                                        );


                                    const raw =
                                        input
                                            ? input.value
                                            : '';


                                    if (
                                        !raw.trim()
                                    ) {

                                        row.classList.remove(
                                            'correct',
                                            'incorrect'
                                        );

                                        return;
                                    }


                                    answered++;


                                    const number =
                                        num(raw);


                                    const target =
                                        parseFloat(
                                            answer
                                        );


                                    const correct =
                                        number !== null &&
                                        Math.abs(
                                            number -
                                            target
                                        ) /
                                        Math.abs(
                                            target
                                        ) <=
                                        0.005;


                                    mark(
                                        row,
                                        correct
                                    );


                                    if (correct) {
                                        right++;
                                    }
                                }
                            );


                            if (score) {

                                score.textContent =
                                    answered === 0
                                        ? 'Fill in at least one answer.'
                                        : right +
                                          ' / ' +
                                          rows.length +
                                          ' correct';
                            }
                        }
                    );
                }


                const resetButton =
                    root.querySelector(
                        '.bq-reset'
                    );


                if (resetButton) {

                    resetButton.addEventListener(
                        'click',
                        function () {

                            rows.forEach(
                                function (row) {

                                    row.classList.remove(
                                        'correct',
                                        'incorrect'
                                    );


                                    const input =
                                        row.querySelector(
                                            '.bq-input'
                                        );


                                    const select =
                                        row.querySelector(
                                            '.bq-select'
                                        );


                                    if (input) {
                                        input.value = '';
                                    }


                                    if (select) {
                                        select.value = '';
                                    }
                                }
                            );


                            if (score) {
                                score.textContent = '';
                            }
                        }
                    );
                }
            }
        );

})();


/* =========================================================
   TABLE QUESTION
   ========================================================= */

(function () {

    function normalise(text) {

        return text
            .toLowerCase()

            .replace(
                /[\u2080-\u2089]/g,
                function (digit) {

                    return String(
                        digit.charCodeAt(0) -
                        0x2080
                    );
                }
            )

            .replace(
                /[\u2019\u2018]/g,
                "'"
            )

            .replace(
                /[\u2013\u2014]/g,
                '-'
            )

            .replace(
                /\s+/g,
                ' '
            )

            .trim();
    }


    function esc(s) {

        return s.replace(
            /[.*+?^${}()|[\]\\]/g,
            '\\$&'
        );
    }


    function hasKeyword(
        text,
        list
    ) {

        return list
            .split('|')
            .some(
                function (keyword) {

                    keyword =
                        keyword
                            .trim()
                            .toLowerCase();


                    return (
                        keyword !== '' &&
                        new RegExp(
                            '(^|[^a-z0-9.])' +
                            esc(keyword)
                        ).test(text)
                    );
                }
            );
    }


    document
        .querySelectorAll(
            '.table-q'
        )
        .forEach(
            function (root) {

                const cells =
                    root.querySelectorAll(
                        '.tq-cell'
                    );


                const score =
                    root.querySelector(
                        '.tq-score'
                    );


                const working =
                    root.querySelector(
                        '.tq-working'
                    );


                const checkButton =
                    root.querySelector(
                        '.tq-check'
                    );


                if (checkButton) {

                    checkButton.addEventListener(
                        'click',
                        function () {

                            let right =
                                0;


                            let answered =
                                0;


                            cells.forEach(
                                function (cell) {

                                    const input =
                                        cell.querySelector(
                                            '.tq-input'
                                        );


                                    const msg =
                                        cell.querySelector(
                                            '.tq-msg'
                                        );


                                    if (!input) {
                                        return;
                                    }


                                    const text =
                                        normalise(
                                            input.value
                                        );


                                    cell.classList.remove(
                                        'correct',
                                        'incorrect'
                                    );


                                    if (msg) {
                                        msg.textContent = '';
                                    }


                                    if (text === '') {
                                        return;
                                    }


                                    answered++;


                                    if (
                                        hasKeyword(
                                            text,
                                            cell.dataset.accept ||
                                            ''
                                        )
                                    ) {

                                        cell.classList.add(
                                            'correct'
                                        );


                                        if (msg) {

                                            msg.textContent =
                                                'Correct.';
                                        }


                                        right++;

                                    } else {

                                        cell.classList.add(
                                            'incorrect'
                                        );


                                        if (msg) {

                                            msg.textContent =
                                                cell.dataset.hint ||
                                                'Not quite.';
                                        }
                                    }
                                }
                            );


                            if (
                                answered ===
                                0
                            ) {

                                if (score) {

                                    score.textContent =
                                        'Fill in at least one answer.';
                                }

                                return;
                            }


                            if (score) {

                                score.textContent =
                                    right +
                                    ' / ' +
                                    cells.length +
                                    ' correct';
                            }


                            if (
                                answered ===
                                    cells.length &&
                                working
                            ) {

                                working.hidden =
                                    false;

                                working.open =
                                    true;
                            }
                        }
                    );
                }


                const resetButton =
                    root.querySelector(
                        '.tq-reset'
                    );


                if (resetButton) {

                    resetButton.addEventListener(
                        'click',
                        function () {

                            cells.forEach(
                                function (cell) {

                                    cell.classList.remove(
                                        'correct',
                                        'incorrect'
                                    );


                                    const input =
                                        cell.querySelector(
                                            '.tq-input'
                                        );


                                    if (input) {
                                        input.value = '';
                                    }


                                    const msg =
                                        cell.querySelector(
                                            '.tq-msg'
                                        );


                                    if (msg) {
                                        msg.textContent = '';
                                    }
                                }
                            );


                            if (score) {
                                score.textContent = '';
                            }


                            if (working) {

                                working.hidden =
                                    true;

                                working.open =
                                    false;
                            }
                        }
                    );
                }
            }
        );

})();

/* -----------------------------------------------------
   Next button
   ----------------------------------------------------- */

if (nextLessonSlide) {

    const isLastPart =
        activePart === total - 1;

    const isLastLesson =
        activeLesson ===
        lessonInstances.length - 1;


    nextLessonSlide.disabled =
        isLastPart && isLastLesson;


    if (isLastPart && !isLastLesson) {

        nextLessonSlide.textContent =
            'Next: ' +
            (
                lessonNames[activeLesson + 1] ||
                'Next section'
            ) +
            ' →';

    } else if (isLastPart && isLastLesson) {

        nextLessonSlide.textContent =
            'Back to 91164 →';

    } else {

        nextLessonSlide.textContent =
            'Next →';
    }
}



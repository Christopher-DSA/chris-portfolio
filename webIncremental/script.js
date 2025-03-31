// script.js (v1.8 - Forced Correct WORD QTE Chars, Editor Line Limit, Composable QTEs, Alert Fix)

// --- DOM Elements ---
const locCountElement = document.getElementById('loc-count');
const locPerSecElement = document.getElementById('loc-per-sec');
const moneyCountElement = document.getElementById('money-count');
const moneyPerSecElement = document.getElementById('money-per-sec');
const qteSuccessBonusElement = document.getElementById('qte-success-bonus'); // Shows base bonus per step
const statusArea = document.getElementById('status-area');

// Editor Elements
const editorWrapper = document.querySelector('.editor-wrapper');
const codeEditorArea = document.getElementById('code-editor-area');
const codeEditorHighlightPre = document.getElementById('code-editor-highlight');
const codeEditorHighlightCode = codeEditorHighlightPre?.querySelector('code'); // Optional chaining
const qtePromptElement = document.getElementById('qte-prompt');
const locIndicatorContainer = document.getElementById('loc-indicator-container');

const saveButton = document.getElementById('save-button');
const loadButton = document.getElementById('load-button');
const resetButton = document.getElementById('reset-button');

// Upgrade Buttons & Displays
const buyAutoTyperButton = document.getElementById('buy-auto-typer');
const autoTyperCostElement = document.getElementById('auto-typer-cost');
const autoTyperLpsElement = document.getElementById('auto-typer-lps');
const autoTyperLevelElement = document.getElementById('auto-typer-level');

const buyFasterTypingButton = document.getElementById('buy-faster-typing');
const fasterTypingCostElement = document.getElementById('faster-typing-cost');
const fasterTypingBonusElement = document.getElementById('faster-typing-bonus'); // Shows base bonus increase
const fasterTypingLevelElement = document.getElementById('faster-typing-level');

// Tech Unlock Buttons
const learnCssButton = document.getElementById('learn-css-button');
const learnCssCostElement = document.getElementById('learn-css-cost');
const learnCssStatusElement = document.getElementById('learn-css-status');
const learnJsButton = document.getElementById('learn-js-button');
const learnJsCostElement = document.getElementById('learn-js-cost');
const learnJsStatusElement = document.getElementById('learn-js-status');

// Project Elements
const activeProjectDisplay = document.getElementById('active-project-display');
const availableProjectsList = document.getElementById('available-projects-list');
const commitLocAmountInput = document.getElementById('commit-loc-amount');
const commitLocButton = document.getElementById('commit-loc-button');
const commit1LocButton = document.getElementById('commit-1-loc');
const commit10LocButton = document.getElementById('commit-10-loc');
const commitPlus1LocButton = document.getElementById('commit-plus-1-loc');
const commitPlus10LocButton = document.getElementById('commit-plus-10-loc');

// --- Game Configuration ---
const SAVE_KEY = 'codeTyperSave_v18'; // Incremented version for forced WORD char
const QTE_THRESHOLD = 15; // Characters typed before QTE is guaranteed to trigger
const WORD_QTE_BASE_LOC_MULTIPLIER = 1.5; // Default multiplier for word steps (applied to base * length)
const QTE_FAIL_VISUAL_DURATION = 300;
const GAME_LOOP_INTERVAL = 1000;
const AUTO_SAVE_INTERVAL = 60000;
const STATUS_MESSAGE_DURATION = 4000;
const UPGRADE_COST_MULTIPLIER = 1.15;
const MAX_EDITOR_LINES = 4; // Maximum lines allowed in the editor before clearing

// --- Game State ---
let gameState = {};
let statusMessageTimeoutId = null; // <<< Added: To track the status message timeout

function getDefaultGameState() {
    return {
        loc: 100,
        money: 0,
        reputation: 0,
        locPerQteSuccess: 1, // Base bonus per KEY step, or per CHAR in WORD step
        locPerSec: 0,
        moneyPerSec: 0,
        autoTyper: { level: 1, baseCost: 10, cost: 10, baseLps: 1, currentLps: 1 }, // Start at 0 LPS
        fasterTyping: { level: 0, baseCost: 25, cost: 25, qteBonusIncrease: 1, currentBonus: 0 }, // This increases locPerQteSuccess
        tech: {
            css: { learned: false, cost: 150 },
            js: { learned: false, cost: 500 }
        },
        activeProjects: [],
        completedProjects: [],
        projectPassiveIncome: 0,
        techUnlocks: {}, // Keep track of which projects are specifically unlocked by tech
        editorContent: "",
        lastUpdate: Date.now()
    };
}

// --- QTE Definitions (NEW STRUCTURE) ---
const QTE_ACTION_TYPES = {
    KEY: 'key',   // Press a specific key
    WORD: 'word'  // Type a specific word
};

// QTE Library: Define sequences of actions
const QTE_LIBRARY = {
    // Simple Sequences
    QUICK_SPACE: [
        { type: QTE_ACTION_TYPES.KEY, key: ' ', prompt: 'Press SPACE!', locMultiplier: 1.0 }
    ],
    TYPE_FUNCTION_WORD: [ // Modified example
        { type: QTE_ACTION_TYPES.KEY, key: 'Enter', prompt: 'Press ENTER!', locMultiplier: 1.0 },
        { type: QTE_ACTION_TYPES.WORD, target: 'function', prompt: 'Type: function', locMultiplier: WORD_QTE_BASE_LOC_MULTIPLIER },
        { type: QTE_ACTION_TYPES.KEY, key: ' ', prompt: 'Press SPACE!', locMultiplier: 1.2 },
    ],
    TYPE_PARENS: [ // Modified example
        { type: QTE_ACTION_TYPES.WORD, target: '()', prompt: 'Type: ()', locMultiplier: WORD_QTE_BASE_LOC_MULTIPLIER },
        { type: QTE_ACTION_TYPES.KEY, key: 'Enter', prompt: 'Press ENTER!', locMultiplier: 1.0 },
        { type: QTE_ACTION_TYPES.KEY, key: 'Tab', prompt: 'Press TAB!', locMultiplier: 1.0 }
    ],
    TYPE_LET: [ // Modified example
        { type: QTE_ACTION_TYPES.KEY, key: 'Enter', prompt: 'Press ENTER!', locMultiplier: 1.0 },
        { type: QTE_ACTION_TYPES.WORD, target: 'let', prompt: 'Type: let', locMultiplier: WORD_QTE_BASE_LOC_MULTIPLIER },
        { type: QTE_ACTION_TYPES.KEY, key: ' ', prompt: 'Press SPACE!', locMultiplier: 1.5 },
        { type: QTE_ACTION_TYPES.WORD, target: 'a', prompt: 'Type: a', locMultiplier: WORD_QTE_BASE_LOC_MULTIPLIER },
        { type: QTE_ACTION_TYPES.KEY, key: ' ', prompt: 'Press SPACE!', locMultiplier: 1.5 },
        { type: QTE_ACTION_TYPES.KEY, key: '=', prompt: 'Press =', locMultiplier: 1.5 },
        { type: QTE_ACTION_TYPES.KEY, key: ' ', prompt: 'Press SPACE!', locMultiplier: 1.5 }
    ],

    // Compound Sequences
    ENTER_THEN_TAB: [
        { type: QTE_ACTION_TYPES.KEY, key: 'Enter', prompt: 'Press ENTER!', locMultiplier: 2 },
        { type: QTE_ACTION_TYPES.KEY, key: 'Tab', prompt: 'Press TAB!', locMultiplier: 2 }
    ],
    ENTER_THEN_FUNCTION_THEN_SPACE: [
        { type: QTE_ACTION_TYPES.KEY, key: 'Enter', prompt: 'Press ENTER!', locMultiplier: 1.0 },
        { type: QTE_ACTION_TYPES.WORD, target: 'function', prompt: 'Type: function', locMultiplier: WORD_QTE_BASE_LOC_MULTIPLIER },
        { type: QTE_ACTION_TYPES.KEY, key: '(', prompt: 'Press (', locMultiplier: 1.0 },
        { type: QTE_ACTION_TYPES.KEY, key: ')', prompt: 'Press )', locMultiplier: 1.0 },
        { type: QTE_ACTION_TYPES.KEY, key: 'Enter', prompt: 'Press ENTER!', locMultiplier: 1.0 }

    ],
    DECLARE_LET_VAR: [
        { type: QTE_ACTION_TYPES.KEY, key: 'Enter', prompt: 'Press ENTER!', locMultiplier: 1.0 },
        { type: QTE_ACTION_TYPES.WORD, target: 'let', prompt: 'Type: let', locMultiplier: WORD_QTE_BASE_LOC_MULTIPLIER },
        { type: QTE_ACTION_TYPES.KEY, key: ' ', prompt: 'Press SPACE!', locMultiplier: 1.0 },
        { type: QTE_ACTION_TYPES.WORD, target: 'b', prompt: 'Type: b', locMultiplier: WORD_QTE_BASE_LOC_MULTIPLIER },
        { type: QTE_ACTION_TYPES.KEY, key: ' ', prompt: 'Press SPACE!', locMultiplier: 1.0 },
        { type: QTE_ACTION_TYPES.KEY, key: '=', prompt: 'Press =', locMultiplier: 1.0 },
        { type: QTE_ACTION_TYPES.KEY, key: ' ', prompt: 'Press SPACE!', locMultiplier: 1.0 },
    ],
    CONSOLE_LOG_EMPTY: [
        { type: QTE_ACTION_TYPES.KEY, key: '.', prompt: 'Press .', locMultiplier: 1.0 },
        { type: QTE_ACTION_TYPES.WORD, target: 'log', prompt: 'Type: log', locMultiplier: WORD_QTE_BASE_LOC_MULTIPLIER },
        { type: QTE_ACTION_TYPES.KEY, key: '(', prompt: 'Press (', locMultiplier: 1.0 },
        { type: QTE_ACTION_TYPES.KEY, key: ')', prompt: 'Press )', locMultiplier: 1.0 },
        { type: QTE_ACTION_TYPES.KEY, key: 'Enter', prompt: 'Press ENTER!', locMultiplier: 1.0 }
    ],
};

// List of QTE keys available for random triggering
const AVAILABLE_QTE_KEYS = Object.keys(QTE_LIBRARY).filter(key => ![/*'QUICK_TAB'*/].includes(key));

// --- QTE State (Module level, not saved) ---
let consecutiveChars = 0;
let activeQteSequenceKey = null;
let qteSequenceStep = 0;
let currentStepAction = null;
let qteWordTarget = null;
let qteWordProgress = 0;
let qteFailTimeout = null;

// --- Formatting Helpers ---
const formatNumber = (num, decimals = 0) => num.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
const formatBigNumber = (num) => {
    if (num < 1e6) return formatNumber(Math.floor(num));
    if (num < 1e9) return (num / 1e6).toFixed(2) + " M";
    if (num < 1e12) return (num / 1e9).toFixed(2) + " B";
    return (num / 1e12).toFixed(2) + " T";
};

// --- Random Color Helper ---
function getRandomColor() {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 30) + 70; // Saturation 70-100
    const l = Math.floor(Math.random() * 20) + 60; // Lightness 60-80
    return `hsl(${h}, ${s}%, ${l}%)`;
}

// --- Utility Functions ---

/**
 * Checks if the code editor content exceeds MAX_EDITOR_LINES.
 * If it does, clears the editor content and updates the highlight.
 */
function checkAndClearEditor() {
    if (!codeEditorArea) return; // Safety check
    const currentText = codeEditorArea.value;
    const lines = currentText.split('\n');
    const lineCount = currentText.endsWith('\n') ? lines.length -1 : lines.length; // Handle trailing newline correctly
    if (lineCount > MAX_EDITOR_LINES) {
        codeEditorArea.value = '';
        if (gameState && typeof gameState === 'object') { gameState.editorContent = ''; }
        updateCodeHighlight();
    }
}


// --- Core Game Functions ---
function updateResources() {
    const now = Date.now();
    const delta = (now - gameState.lastUpdate) / 1000;
    gameState.loc += gameState.locPerSec * delta;
    gameState.money += gameState.moneyPerSec * delta; // Use moneyPerSec which includes project income
    gameState.lastUpdate = now;
}

function updateDisplay() {
    locCountElement.textContent = formatBigNumber(gameState.loc);
    locPerSecElement.textContent = formatNumber(gameState.locPerSec, 1);
    moneyCountElement.textContent = formatBigNumber(gameState.money);
    moneyPerSecElement.textContent = formatNumber(gameState.moneyPerSec, 2); // Display total money/s
    qteSuccessBonusElement.textContent = formatNumber(gameState.locPerQteSuccess);
    autoTyperCostElement.textContent = formatBigNumber(gameState.autoTyper.cost);
    autoTyperLpsElement.textContent = formatNumber(gameState.autoTyper.currentLps, 1);
    autoTyperLevelElement.textContent = gameState.autoTyper.level;
    buyAutoTyperButton.disabled = gameState.loc < gameState.autoTyper.cost;
    fasterTypingCostElement.textContent = formatBigNumber(gameState.fasterTyping.cost);
    fasterTypingBonusElement.textContent = formatNumber(gameState.fasterTyping.currentBonus);
    fasterTypingLevelElement.textContent = gameState.fasterTyping.level;
    buyFasterTypingButton.disabled = gameState.loc < gameState.fasterTyping.cost;
    learnCssCostElement.textContent = formatBigNumber(gameState.tech.css.cost);
    learnCssButton.disabled = gameState.loc < gameState.tech.css.cost || gameState.tech.css.learned;
    learnCssStatusElement.textContent = gameState.tech.css.learned ? "Learned" : "Not Learned";
    learnCssStatusElement.className = gameState.tech.css.learned ? "badge bg-success" : "badge bg-secondary";
    learnJsCostElement.textContent = formatBigNumber(gameState.tech.js.cost);
    learnJsButton.disabled = gameState.loc < gameState.tech.js.cost || gameState.tech.js.learned || !gameState.tech.css.learned;
    learnJsStatusElement.textContent = gameState.tech.js.learned ? "Learned" : "Not Learned";
    learnJsStatusElement.className = gameState.tech.js.learned ? "badge bg-success" : "badge bg-secondary";
    learnJsButton.title = !gameState.tech.css.learned ? "Requires CSS first" : "";
    updateAvailableProjectsDisplay();
    updateActiveProjectDisplay();
    updateQTEPrompt();
}

// --- Word Highlighting & Editor Sync ---
function updateCodeHighlight() {
    if (!codeEditorArea || !codeEditorHighlightCode || !codeEditorHighlightPre) { return; }
    const code = codeEditorArea.value;
    if (gameState && typeof gameState === 'object') { gameState.editorContent = code; }
    codeEditorHighlightCode.innerHTML = '';
    const tokens = code.match(/\s+|[^\s]+/g) || [];
    tokens.forEach(token => {
        if (/\s+/.test(token)) {
            codeEditorHighlightCode.appendChild(document.createTextNode(token));
        } else {
            const span = document.createElement('span');
            span.style.color = getRandomColor();
            span.textContent = token;
            codeEditorHighlightCode.appendChild(span);
        }
    });
    // Sync scroll position
    codeEditorHighlightPre.scrollTop = codeEditorArea.scrollTop;
    codeEditorHighlightPre.scrollLeft = codeEditorArea.scrollLeft;
}

// --- Floating LoC Indicator ---
function showLocIndicator(amount) {
    if (!locIndicatorContainer || amount <= 0) return;
    const indicator = document.createElement('div');
    indicator.className = 'loc-indicator';
    indicator.textContent = `+${formatNumber(amount)} LoC`;
    const randTop = Math.random() * 70 + 15; // 15% to 85% top
    const randLeft = Math.random() * 70 + 15; // 15% to 85% left
    indicator.style.top = `${randTop}%`;
    indicator.style.left = `${randLeft}%`;
    locIndicatorContainer.appendChild(indicator);

    // Animate and remove
    setTimeout(() => {
        indicator.classList.add('fade-out');
        setTimeout(() => {
            // Check if it's still a child before removing (safety for rapid calls)
            if (indicator.parentNode === locIndicatorContainer) {
                indicator.remove();
            }
        }, 600); // Matches CSS animation duration
    }, 100); // Start fading after a short delay
}


// ==========================================================================
// --- QTE Engine Functions ---
// ==========================================================================

function resetQTEState() {
    activeQteSequenceKey = null;
    qteSequenceStep = 0;
    currentStepAction = null;
    qteWordTarget = null;
    qteWordProgress = 0;
    consecutiveChars = 0;
    clearTimeout(qteFailTimeout);
    qteFailTimeout = null;
    if (editorWrapper) {
        editorWrapper.classList.remove('qte-active', 'qte-fail');
    }
    updateQTEPrompt();
}

function setupCurrentQteStep() {
    if (!activeQteSequenceKey || !QTE_LIBRARY[activeQteSequenceKey]) {
        console.error("Invalid sequence key:", activeQteSequenceKey);
        resetQTEState();
        return;
    }

    const sequence = QTE_LIBRARY[activeQteSequenceKey];
    if (qteSequenceStep >= sequence.length) {
        // Sequence complete
        resetQTEState();
        return;
    }

    currentStepAction = sequence[qteSequenceStep];
    qteWordTarget = null; // Reset word target
    qteWordProgress = 0; // Reset word progress

    if (currentStepAction.type === QTE_ACTION_TYPES.WORD) {
        qteWordTarget = currentStepAction.target;
    }

    updateQTEPrompt();
}

// --- Handle Keystroke (Main Logic - Modified for Forced WORD Chars) ---
function handleKeyPress(event) {
    // --- I. QTE Active: Handle Input for the Current Sequence Step ---
    if (activeQteSequenceKey && currentStepAction) {
        // Prevent default action for *all* key presses while a QTE step is active
        event.preventDefault();

        // Clear fail state visual on any input attempt during QTE
        clearTimeout(qteFailTimeout);
        qteFailTimeout = null;
        if (editorWrapper) editorWrapper.classList.remove('qte-fail');

        let stepSuccess = false;
        let stepCompleted = false;
        let locGainedThisStep = 0;
        let insertedChars = '';

        // --- A. Handle WORD Action Type ---
        if (currentStepAction.type === QTE_ACTION_TYPES.WORD) {
            const targetChar = qteWordTarget[qteWordProgress]; // The character we expect next

            // 1. Check for CORRECT character
            if (event.key === targetChar) {
                qteWordProgress++;
                insertedChars = targetChar; // We will insert this char
                stepSuccess = true;
                if (qteWordProgress === qteWordTarget.length) {
                    // Word completed
                    stepCompleted = true;
                    // Calculate bonus based on word length and multiplier
                    locGainedThisStep = Math.ceil(gameState.locPerQteSuccess * qteWordTarget.length * (currentStepAction.locMultiplier || 1.0));
                } else {
                    // Word in progress
                    stepCompleted = false;
                    updateQTEPrompt(); // Update prompt to show progress
                }
            }
            // 2. Check for Backspace to allow correction (Only if progress > 0)
            else if (event.key === 'Backspace' && qteWordProgress > 0) {
                const start = codeEditorArea.selectionStart;
                const end = codeEditorArea.selectionEnd;
                // Only allow backspace if cursor is immediately after the last correctly typed char
                if (start === end && start > 0) {
                    const currentVal = codeEditorArea.value;
                    const expectedPrevChar = qteWordTarget[qteWordProgress - 1];
                    if (currentVal.substring(start - 1, start) === expectedPrevChar) {
                        qteWordProgress--;
                        // Manually perform the backspace action
                        codeEditorArea.value = currentVal.substring(0, start - 1) + currentVal.substring(start);
                        codeEditorArea.selectionStart = codeEditorArea.selectionEnd = start - 1;
                        updateCodeHighlight();
                        updateQTEPrompt(); // Update prompt to show new state
                    }
                }
                 // Backspace itself doesn't count as success or failure for step progression
                 stepSuccess = false;
                 stepCompleted = false;
            }
            // 3. Handle INCORRECT characters (Printable keys that don't match targetChar)
            else if (event.key.length === 1 || ['Enter', 'Tab', ' '].includes(event.key)) {
                 // DO NOTHING: Ignore incorrect keypress. preventDefault() stops typing.
                 stepSuccess = false;
                 stepCompleted = false;
                 // Optionally add visual feedback for incorrect key here if desired
                 // if (editorWrapper) editorWrapper.classList.add('qte-fail');
                 // qteFailTimeout = setTimeout(() => { /* ... */ }, QTE_FAIL_VISUAL_DURATION);
            }
            // 4. Other keys (Shift, Ctrl, Arrows etc.) are implicitly ignored by preventDefault()

        }
        // --- B. Handle KEY Action Type ---
        else if (currentStepAction.type === QTE_ACTION_TYPES.KEY) {
            if (event.key === currentStepAction.key) {
                stepSuccess = true;
                stepCompleted = true;
                locGainedThisStep = Math.ceil(gameState.locPerQteSuccess * (currentStepAction.locMultiplier || 1.0));
                // Determine what character(s) to insert based on the key
                if (currentStepAction.key === 'Enter') insertedChars = '\n';
                else if (currentStepAction.key === 'Tab') insertedChars = '\t'; // Use actual tab char
                else if (event.key.length === 1 || currentStepAction.key === ' ') insertedChars = currentStepAction.key; // Printable keys or space
                else insertedChars = ''; // For keys like Shift, Ctrl if they were targetted (not recommended)

            } else {
                // Incorrect key press for KEY type
                stepSuccess = false;
                stepCompleted = false;
                // Only show fail visual for printable keys or specific functional keys
                 if (event.key.length === 1 || ['Enter', 'Tab', ' '].includes(event.key)) {
                     if (editorWrapper) editorWrapper.classList.add('qte-fail');
                     qteFailTimeout = setTimeout(() => {
                         if (editorWrapper) editorWrapper.classList.remove('qte-fail');
                         qteFailTimeout = null;
                     }, QTE_FAIL_VISUAL_DURATION);
                 }
                 // preventDefault() at top handles stopping incorrect key action
            }
        }

        // --- C. Process Step Result ---
        if (stepSuccess) {
            // Insert characters if any were generated by the successful step (and not backspace)
            if (insertedChars && event.key !== 'Backspace') {
                const start = codeEditorArea.selectionStart;
                const end = codeEditorArea.selectionEnd;
                codeEditorArea.value = codeEditorArea.value.substring(0, start) + insertedChars + codeEditorArea.value.substring(end);
                codeEditorArea.selectionStart = codeEditorArea.selectionEnd = start + insertedChars.length;
                updateCodeHighlight(); // Update highlight FIRST
                checkAndClearEditor(); // THEN Check lines
            }
            // Add LoC if gained
            if (locGainedThisStep > 0) {
                gameState.loc += locGainedThisStep;
                showLocIndicator(locGainedThisStep);
            }
            // If the step is fully completed, advance to the next or finish
            if (stepCompleted) {
                qteSequenceStep++;
                setupCurrentQteStep(); // Setup next step or reset if sequence finished
            }
            updateDisplay(); // Update resource display
        }
        // If stepSuccess is false, we just ignore the input (preventDefault handled it) unless it was Backspace
        return; // End QTE processing, don't fall through to normal typing
    }

    // --- II. Normal Key Press: Track Chars & Trigger QTE ---
    // Ignore modifier keys, function keys, navigation keys etc. for QTE triggering
    const ignoredKeys = ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown', 'Insert', 'NumLock', 'ScrollLock', 'Pause', 'ContextMenu', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];
    if (event.ctrlKey || event.altKey || event.metaKey || ignoredKeys.includes(event.key)) {
        // Allow default action for these, update highlight after delay
        setTimeout(updateCodeHighlight, 0);
        return;
    }

    let keyJustHitThreshold = false;
    // Count only "typing" characters (length 1, not space/tab/enter) for the threshold
    if (event.key.length === 1 && ![' ', '\n', '\t'].includes(event.key)) {
        consecutiveChars++;
        if (consecutiveChars >= QTE_THRESHOLD) {
            keyJustHitThreshold = true;
        }
    } else if ([' ', 'Enter', 'Tab', 'Backspace', 'Delete'].includes(event.key)) {
        // Reset counter on space, enter, tab, or deletion
        consecutiveChars = 0;
    }

    // Trigger QTE if threshold was just hit
    if (keyJustHitThreshold) {
        event.preventDefault(); // Prevent the character that triggered the QTE from being typed
        if (AVAILABLE_QTE_KEYS.length > 0) {
            const randomIndex = Math.floor(Math.random() * AVAILABLE_QTE_KEYS.length);
            const chosenSequenceKey = AVAILABLE_QTE_KEYS[randomIndex];
            activeQteSequenceKey = chosenSequenceKey;
            qteSequenceStep = 0; // Start from the first step
            setupCurrentQteStep();
            console.log("QTE Sequence Triggered:", chosenSequenceKey);
            if (editorWrapper) editorWrapper.classList.add('qte-active');
        } else {
            console.warn("QTE triggered, but AVAILABLE_QTE_KEYS empty!");
            // Allow the character if no QTEs are available? Or keep preventing? Let's prevent.
        }
        consecutiveChars = 0; // Reset counter after triggering
        return; // Stop processing this keypress further
    }

    // --- Allow Default Action If No QTE Active ---
    // Use setTimeout to allow the character to appear before highlighting/clearing
    setTimeout(() => {
        updateCodeHighlight();
        checkAndClearEditor(); // Check lines after normal typing
    }, 0);
}


function updateQTEPrompt() {
    if (!qtePromptElement || !editorWrapper) return;

    if (activeQteSequenceKey && currentStepAction) {
        editorWrapper.classList.add('qte-active');
        // Ensure fail state isn't cleared if a fail timeout is active
        if (!qteFailTimeout) {
            editorWrapper.classList.remove('qte-fail');
        }

        let promptHTML = '';
        const stepNum = qteSequenceStep + 1;
        const sequence = QTE_LIBRARY[activeQteSequenceKey];
        const totalSteps = sequence ? sequence.length : 0;
        const sequencePrefix = totalSteps > 1 ? `<span class="qte-step-indicator">[${stepNum}/${totalSteps}]</span> ` : '';

        if (currentStepAction.type === QTE_ACTION_TYPES.WORD) {
            const target = currentStepAction.target;
            const progress = qteWordProgress;
            // Basic HTML escaping
            const escapeHtml = (unsafe) => unsafe.replace(/</g, "<").replace(/>/g, ">");
            const typedPart = escapeHtml(target.substring(0, progress));
            const remainingPart = escapeHtml(target.substring(progress));
            let basePrompt = currentStepAction.prompt || `Type: ${target}`;

             // Highlight typed/remaining parts within the target word if present in prompt
             if (basePrompt.includes(target)) {
                 const highlightedPrompt = basePrompt.replace(target, `<strong class="qte-typed">${typedPart}</strong><span class="qte-remaining">${remainingPart}</span>`);
                 promptHTML = `${sequencePrefix}${highlightedPrompt}`;
             } else {
                 // If target word not in prompt, show it separately
                 promptHTML = `${sequencePrefix}${basePrompt} (<strong class="qte-typed">${typedPart}</strong><span class="qte-remaining">${remainingPart}</span>)`;
             }
        } else if (currentStepAction.type === QTE_ACTION_TYPES.KEY) {
            let displayKey = currentStepAction.key;
            if (displayKey === ' ') displayKey = 'SPACE';
            if (displayKey === '\t') displayKey = 'TAB';
            // Add more key display names if needed
            const basePrompt = currentStepAction.prompt || `Press: ${displayKey}`;
            promptHTML = `${sequencePrefix}${basePrompt}`;
        } else {
            promptHTML = `${sequencePrefix}Unknown QTE Step...`;
        }
        qtePromptElement.innerHTML = promptHTML;
    } else {
        // No active QTE
        editorWrapper.classList.remove('qte-active', 'qte-fail');
        qtePromptElement.innerHTML = ''; // Clear prompt
    }
}

// ==========================================================================
// --- Upgrade & Tech Functions ---
// ==========================================================================

function buyUpgrade(upgradeName) {
    if (!gameState[upgradeName]) return;
    const upgrade = gameState[upgradeName];
    if (gameState.loc >= upgrade.cost) {
        gameState.loc -= upgrade.cost;
        upgrade.level++;
        if (upgradeName === 'autoTyper') {
            upgrade.currentLps += upgrade.baseLps;
             recalculateDerivedStats(); // Recalculate locPerSec
        } else if (upgradeName === 'fasterTyping') {
            upgrade.currentBonus += upgrade.qteBonusIncrease;
            recalculateDerivedStats(); // Recalculate locPerQteSuccess
        }
        upgrade.cost = Math.ceil(upgrade.baseCost * Math.pow(UPGRADE_COST_MULTIPLIER, upgrade.level));
        updateDisplay();
        displaySaveMessage(`${upgradeName === 'autoTyper' ? 'Auto-Typer' : 'Faster Typing'} upgraded to Lvl ${upgrade.level}!`);
    } else {
        displaySaveMessage("Not enough LoC!", true);
    }
}

function learnTech(techId) {
    if (!gameState.tech[techId]) return;
    const tech = gameState.tech[techId];

    // Dependency check (example for JS requiring CSS)
    if (techId === 'js' && !gameState.tech.css?.learned) {
        displaySaveMessage("Requires CSS knowledge first!", true);
        return;
    }

    if (tech.learned) {
        displaySaveMessage(`Already learned ${techId.toUpperCase()}.`, true);
        return;
    }
    if (gameState.loc < tech.cost) {
        displaySaveMessage("Not enough LoC!", true);
        return;
    }

    gameState.loc -= tech.cost;
    tech.learned = true;

    // Update techUnlocks based on project requirements
    Object.values(projectData).forEach(proj => {
        if (proj.requirements && proj.requirements.includes(techId)) {
            // Check if *all* requirements for this project are now met
            const allReqsMet = proj.requirements.every(req => gameState.tech[req]?.learned);
            if (allReqsMet) {
                 gameState.techUnlocks = gameState.techUnlocks || {}; // Ensure object exists
                gameState.techUnlocks[proj.id] = true; // Mark project as specifically unlocked
                 console.log(`Project unlocked by tech: ${proj.name}`);
            }
        }
    });


    displaySaveMessage(`Learned ${techId.toUpperCase()}! New projects may be available.`, false);
    recalculateDerivedStats(); // In case tech unlocks affect passive income (future)
    updateDisplay(); // Updates buttons and project list indirectly via getAvailableProjects
}

// ==========================================================================
// --- Project Functions ---
// ==========================================================================

// Function to get available projects based on game state
function getAvailableProjects(state) {
    return Object.values(projectData).filter(proj => {
        // 1. Filter out completed projects
        if (state.completedProjects.includes(proj.id)) {
            return false;
        }
        // 2. Filter out the currently active project (if any)
        if (state.activeProjects.some(ap => ap.id === proj.id)) {
             return false;
        }

        // 3. Check unlock status:
        // Either it's unlocked by default OR specifically unlocked via tech
        const isUnlockedByDefault = proj.unlocked === true;
        const isUnlockedByTech = state.techUnlocks && state.techUnlocks[proj.id] === true;

        // 4. More robust requirement check (check learned tech against project requirements)
        let meetsRequirements = true;
        if (proj.requirements && proj.requirements.length > 0) {
             meetsRequirements = proj.requirements.every(req => state.tech[req]?.learned === true);
        } else {
            meetsRequirements = true; // No requirements means it's met
        }

        // Project is available if it meets requirements AND (is unlocked by default OR is unlocked by tech)
        return meetsRequirements && (isUnlockedByDefault || isUnlockedByTech);
    });
}


function updateAvailableProjectsDisplay() {
    if (typeof getAvailableProjects !== 'function' || typeof projectData === 'undefined') {
        console.error("Project data/function missing.");
        availableProjectsList.innerHTML = '<li class="list-group-item text-danger small">Error loading projects.</li>';
        return;
    }

    const available = getAvailableProjects(gameState);
    availableProjectsList.innerHTML = ''; // Clear current list

    if (available.length === 0) {
        availableProjectsList.innerHTML = '<li class="list-group-item text-center text-muted small p-2">No projects available. Check tech unlocks or complete current project.</li>';
        return;
    }

    available.forEach(proj => {
        const li = document.createElement('li');
        li.className = 'list-group-item project-card p-2 mb-2 rounded border border-secondary bg-dark text-white'; // Use darker theme classes

        // Build inner HTML using template literals for clarity
        li.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="mb-1 project-name text-info">${proj.name}</h6>
                    <p class="small text-light text-opacity-75 mb-1 project-desc">${proj.description}</p>
                </div>
                <button class="btn btn-sm btn-success start-project-btn py-0 px-2 flex-shrink-0 ms-2" data-project-id="${proj.id}" title="Start Project">
                    <i class="fas fa-play"></i> Start
                </button>
            </div>
            <div class="d-flex justify-content-start align-items-center small mt-2 project-stats text-white-50">
                <span class="me-3" title="LoC Cost"><i class="fas fa-file-code text-primary fa-fw"></i> ${formatBigNumber(proj.locCost)}</span>
                <span class="me-3" title="Money Reward"><i class="fas fa-dollar-sign text-success fa-fw"></i> ${formatNumber(proj.rewardMoney)}</span>
                ${proj.rewardPassiveMps > 0 ? `<span title="Passive Income"><i class="fas fa-sync-alt text-info fa-fw"></i> ${formatNumber(proj.rewardPassiveMps, 2)}/s</span>` : ''}
                ${proj.rewardReputation > 0 ? `<span class="ms-3" title="Reputation Reward"><i class="fas fa-star text-warning fa-fw"></i> ${formatNumber(proj.rewardReputation)}</span>` : ''}
            </div>
            ${proj.requirements && proj.requirements.length > 0 ? `<div class="small mt-1 text-warning">Requires: ${proj.requirements.map(r => r.toUpperCase()).join(', ')}</div>` : ''}
        `;

        // Add event listener to the start button
        const startButton = li.querySelector('.start-project-btn');
        if(startButton) {
            startButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent potential parent clicks
                startProject(proj.id);
            });
        }
        availableProjectsList.appendChild(li);
    });
}

function updateActiveProjectDisplay() {
    const commitControls = [commitLocButton, commit1LocButton, commit10LocButton, commitPlus1LocButton, commitPlus10LocButton, commitLocAmountInput];

    if (gameState.activeProjects.length === 0) {
        activeProjectDisplay.innerHTML = '<p class="text-center text-muted small">No active project.</p>';
        commitControls.forEach(el => el && (el.disabled = true)); // Disable all commit controls
        if (commitLocAmountInput) commitLocAmountInput.value = 1; // Reset input
        return;
    }

    const activeProjState = gameState.activeProjects[0]; // Assuming only one active project for now
    if (typeof projectData !== 'object' || projectData === null || !projectData[activeProjState.id]) {
        console.error("Active project data missing:", activeProjState.id);
        activeProjectDisplay.innerHTML = '<p class="text-danger small">Error loading active project data.</p>';
        commitControls.forEach(el => el && (el.disabled = true));
        return;
    }

    const projDef = projectData[activeProjState.id];
    const progressPercent = Math.min(100, (activeProjState.locCommitted / projDef.locCost) * 100);

    activeProjectDisplay.innerHTML = `
        <h6 class="mb-1">${projDef.name}</h6>
        <div class="progress project-progress mb-1" role="progressbar" aria-valuenow="${progressPercent}" aria-valuemin="0" aria-valuemax="100" style="height: 10px;">
            <div class="progress-bar progress-bar-striped progress-bar-animated bg-info" style="width: ${progressPercent}%"></div>
        </div>
        <div class="d-flex justify-content-between small mb-2 text-white-50">
            <span>${formatBigNumber(activeProjState.locCommitted)} / ${formatBigNumber(projDef.locCost)} LoC</span>
            <span>${formatNumber(progressPercent, 1)}%</span>
        </div>
        <button class="btn btn-sm btn-outline-danger cancel-project-btn w-100 py-0" data-project-id="${projDef.id}">
            <i class="fas fa-times-circle"></i> Cancel Project
        </button>
    `;

    // Add event listener to the cancel button
    const cancelButton = activeProjectDisplay.querySelector('.cancel-project-btn');
    if (cancelButton) {
        cancelButton.addEventListener('click', () => cancelProject(projDef.id));
    }

    // Enable commit controls if player has LoC
    const canCommit = gameState.loc >= 1;
    commitControls.forEach(el => el && (el.disabled = !canCommit));
    if (commitLocAmountInput && !canCommit) commitLocAmountInput.value = 1; // Reset input if cannot commit
}

function startProject(projectId) {
    if (gameState.activeProjects.length > 0) {
        displaySaveMessage("Finish or cancel your current project first!", true);
        return;
    }
    if (typeof projectData !== 'object' || projectData === null) {
        displaySaveMessage("Error: Project data not loaded.", true);
        return;
    }
    const projDef = projectData[projectId];
    if (!projDef) {
        displaySaveMessage("Error: Could not find project definition.", true);
        return;
    }

    // Double-check requirements before starting (though getAvailableProjects should handle this)
    let canStart = true;
    let missingReqs = [];
    if (projDef.requirements && projDef.requirements.length > 0) {
        projDef.requirements.forEach(req => {
            const learned = gameState.tech[req]?.learned === true;
            if (!learned) {
                canStart = false;
                missingReqs.push(req.toUpperCase());
            }
        });
    }

    if (!canStart) {
        displaySaveMessage(`Project requires: ${missingReqs.join(', ')}`, true);
        return;
    }

    gameState.activeProjects.push({
        id: projectId,
        locCommitted: 0
    });
    displaySaveMessage(`Started project: ${projDef.name}`, false);
    updateDisplay(); // Update active project display and available list
}

function commitLoC(amount = -1) { // amount = -1 means use the input field
    if (gameState.activeProjects.length === 0) {
        displaySaveMessage("No active project to commit to.", true);
        return;
    }
    const activeProjState = gameState.activeProjects[0];
    if (typeof projectData !== 'object' || projectData === null || !projectData[activeProjState.id]) {
        displaySaveMessage("Error: Active project data missing.", true);
        return;
    }
    const projDef = projectData[activeProjState.id];

    let commitAmount;
    if (amount === -1) {
         commitAmount = parseInt(commitLocAmountInput?.value || '1', 10);
    } else {
         commitAmount = amount;
    }

    if (isNaN(commitAmount) || commitAmount <= 0) {
        displaySaveMessage("Invalid commit amount.", true);
        if (commitLocAmountInput && amount === -1) commitLocAmountInput.value = 1; // Reset input only if it was used
        return;
    }

    const needed = projDef.locCost - activeProjState.locCommitted;
    commitAmount = Math.min(commitAmount, needed); // Don't commit more than needed
    commitAmount = Math.min(commitAmount, Math.floor(gameState.loc)); // Don't commit more LoC than available

    if (commitAmount <= 0) {
        if (needed <= 0) {
             displaySaveMessage("Project already fully committed!", true);
        } else if (Math.floor(gameState.loc) < 1) {
            displaySaveMessage("Not enough LoC!", true);
        } else {
            displaySaveMessage("Cannot commit this amount (possibly 0 needed or not enough LoC).", true);
        }
        if (commitLocAmountInput && amount === -1) commitLocAmountInput.value = 1; // Reset input
        return;
    }

    gameState.loc -= commitAmount;
    activeProjState.locCommitted += commitAmount;
    displaySaveMessage(`Committed ${formatBigNumber(commitAmount)} LoC to ${projDef.name}.`, false);

    // Check for completion *after* updating state
    if (activeProjState.locCommitted >= projDef.locCost) {
        activeProjState.locCommitted = projDef.locCost; // Ensure it doesn't exceed cost
        completeProject(activeProjState.id); // This will update display internally
    } else {
        updateActiveProjectDisplay(); // Just update progress bar if not complete
        updateDisplay(); // Update general resource counts
    }

    // Reset input field only if it was the source of the amount
    if(commitLocAmountInput && amount === -1) commitLocAmountInput.value = 1;
}

function completeProject(projectId) {
    const projIndex = gameState.activeProjects.findIndex(p => p.id === projectId);
    if (projIndex === -1) return; // Project not active?

    if (typeof projectData !== 'object' || projectData === null || !projectData[projectId]) {
        displaySaveMessage("Error completing project: data missing.", true);
        gameState.activeProjects.splice(projIndex, 1); // Remove corrupted project
        updateDisplay();
        return;
    }

    const projDef = projectData[projectId];
    gameState.money += projDef.rewardMoney || 0;
    gameState.reputation += projDef.rewardReputation || 0;
    // Passive income is handled by recalculateDerivedStats

    displaySaveMessage(`Project Complete: ${projDef.name}! Rewards gained.`, false);

    // Move from active to completed
    gameState.activeProjects.splice(projIndex, 1);
    if (!Array.isArray(gameState.completedProjects)) { gameState.completedProjects = []; } // Ensure array exists
    gameState.completedProjects.push(projectId);

    recalculateDerivedStats(); // Update passive income totals
    updateDisplay(); // Update everything: resources, active project (now gone), available projects
}

function cancelProject(projectId) {
    const projIndex = gameState.activeProjects.findIndex(p => p.id === projectId);
    if (projIndex > -1) {
        const projDef = (typeof projectData === 'object' && projectData !== null) ? projectData[projectId] : null;
        const projectName = projDef ? projDef.name : `Project ID ${projectId}`;
        gameState.activeProjects.splice(projIndex, 1);
        displaySaveMessage(`Project Cancelled: ${projectName}.`, true); // Use error style for cancel
        updateDisplay(); // Update active display and potentially commit buttons
    }
}

// ==========================================================================
// --- Save/Load & Utility ---
// ==========================================================================

function saveGame() {
    try {
        // Ensure latest editor content is saved
        if (codeEditorArea) {
            gameState.editorContent = codeEditorArea.value;
        }
        gameState.lastUpdate = Date.now(); // Capture time right before saving
        localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
        console.log("Game saved at", new Date().toLocaleTimeString());
        // Optionally provide non-intrusive feedback like a brief button glow
    } catch (error) {
        console.error("Error saving game:", error);
        displaySaveMessage("Error saving game! Check console.", true);
        if (error.name === 'QuotaExceededError') {
             displaySaveMessage("Error: Local storage full. Cannot save.", true);
        }
    }
}

function loadGame() {
    try {
        const savedGame = localStorage.getItem(SAVE_KEY);
        if (savedGame) {
            const loadedState = JSON.parse(savedGame);

            // Basic validation - check for a few core properties
            if (typeof loadedState.loc !== 'number' || typeof loadedState.autoTyper !== 'object' || !loadedState.tech) {
                console.warn(`Save data (${SAVE_KEY}) invalid/outdated structure. Resetting.`);
                resetGame(true); // Force reset without confirm
                displaySaveMessage("Save data corrupted/incompatible. Game reset.", true);
                return;
            }

            // Merge loaded state with default state to handle new properties in updates
            const defaultState = getDefaultGameState();
            gameState = { ...defaultState }; // Start with defaults

            // Overwrite with loaded data, merging objects deeply for upgrades/tech
            for (const key in defaultState) {
                 if (loadedState.hasOwnProperty(key)) {
                     if (typeof defaultState[key] === 'object' && !Array.isArray(defaultState[key]) && defaultState[key] !== null) {
                         // Deep merge for nested objects like autoTyper, fasterTyping, tech
                         gameState[key] = { ...defaultState[key], ...(loadedState[key] || {}) };
                         // Special handling for the 'tech' object to ensure sub-properties exist
                         if (key === 'tech') {
                            for (const techKey in defaultState.tech) {
                                if (loadedState.tech && loadedState.tech[techKey]) {
                                    // Merge individual tech states
                                    gameState.tech[techKey] = { ...defaultState.tech[techKey], ...loadedState.tech[techKey] };
                                }
                             }
                         }
                     } else {
                         // Overwrite primitive types and arrays directly
                         gameState[key] = loadedState[key];
                     }
                 }
             }

            // Ensure arrays exist even if save was from before they were added
            gameState.activeProjects = Array.isArray(gameState.activeProjects) ? gameState.activeProjects : [];
            gameState.completedProjects = Array.isArray(gameState.completedProjects) ? gameState.completedProjects : [];
            gameState.techUnlocks = typeof gameState.techUnlocks === 'object' ? gameState.techUnlocks : {};


            recalculateDerivedStats(); // Crucial after loading potentially different levels/projects
            gameState.lastUpdate = Date.now(); // Set last update to now after loading

            // Restore editor content
            if (codeEditorArea) {
                codeEditorArea.value = gameState.editorContent || "";
                updateCodeHighlight();
            }

            resetQTEState(); // Ensure QTE is not active on load
            updateDisplay(); // Refresh UI with loaded state
            displaySaveMessage("Game Loaded!");

        } else {
            // No save found, start fresh
            gameState = getDefaultGameState();
            gameState.lastUpdate = Date.now();
            recalculateDerivedStats();
            if (codeEditorArea) {
                codeEditorArea.value = ""; // Ensure editor is clear
                gameState.editorContent = "";
                updateCodeHighlight();
            }
            resetQTEState();
            updateDisplay();
            displaySaveMessage("No save game found. Start typing!", false);
        }
    } catch (error) {
        console.error("Error loading game:", error);
        displaySaveMessage("Error loading game! Resetting to default.", true);
        resetGame(true); // Force reset
    }
}

function resetGame(skipConfirm = false) {
    if (skipConfirm || confirm("Are you sure you want to reset your game? All progress will be lost permanently!")) {
        localStorage.removeItem(SAVE_KEY);
        gameState = getDefaultGameState();
        gameState.lastUpdate = Date.now();
        recalculateDerivedStats(); // Reset calculated stats

        // Clear UI elements
        if (codeEditorArea) {
            codeEditorArea.value = '';
            updateCodeHighlight();
        }
        if (locIndicatorContainer) {
            locIndicatorContainer.innerHTML = ''; // Clear floating indicators
        }

        resetQTEState(); // Reset any active QTE
        updateDisplay(); // Update UI to default state
        if (!skipConfirm) displaySaveMessage("Game Reset.");
        console.log("Game reset to default state.");
    }
}

function recalculateDerivedStats() {
    gameState.locPerSec = gameState.autoTyper.currentLps || 0;
    gameState.locPerQteSuccess = 1 + (gameState.fasterTyping.currentBonus || 0);

    // Calculate passive income from completed projects
    gameState.projectPassiveIncome = gameState.completedProjects.reduce((total, projId) => {
        const projDef = (typeof projectData === 'object' && projectData !== null) ? projectData[projId] : null;
        return total + (projDef?.rewardPassiveMps || 0);
    }, 0);
    gameState.moneyPerSec = gameState.projectPassiveIncome; // Update the main money/sec stat
}

// --- MODIFIED displaySaveMessage with Timeout Clearing ---
function displaySaveMessage(message, isError = false) {
    if (!statusArea) {
        console.warn("Status area not found, cannot display message:", message);
        return;
    }

    // Clear any existing timeout that might be scheduled to close a previous alert
    if (statusMessageTimeoutId) {
        clearTimeout(statusMessageTimeoutId);
        statusMessageTimeoutId = null; // Reset the ID immediately
    }

    const alertType = isError ? 'alert-danger' : 'alert-success';
    const icon = isError ? '<i class="fas fa-exclamation-triangle me-2"></i>' : '<i class="fas fa-check-circle me-2"></i>';

    // Clear the area *before* adding the new alert
    statusArea.innerHTML = '';

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${alertType} alert-dismissible fade show m-0 rounded-0 status-message`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `${icon} ${message}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;

    statusArea.appendChild(alertDiv);

    // Store the ID of the new timeout
    statusMessageTimeoutId = setTimeout(() => {
        // Find the specific alert this timeout was for (important if messages change quickly)
        const currentAlert = alertDiv; // Use the reference to the specific div created

        if (currentAlert && currentAlert.parentNode === statusArea) { // Check if it's still in the statusArea
            // Attempt to use Bootstrap's close method first
            if (typeof bootstrap !== 'undefined' && bootstrap.Alert) {
                const alertInstance = bootstrap.Alert.getOrCreateInstance(currentAlert);
                if (alertInstance) {
                    try {
                        alertInstance.close(); // Bootstrap handles removal and fade
                    } catch (e) {
                        // If BS close fails (e.g., element removed unexpectedly), fallback
                        console.warn("Bootstrap Alert close failed, removing manually.", e);
                         if (currentAlert.parentNode === statusArea) { // Double check parent before removal
                            currentAlert.remove();
                         }
                    }
                } else {
                     // If no instance could be created, remove manually
                     if (currentAlert.parentNode === statusArea) {
                         currentAlert.remove();
                     }
                }
            } else {
                // Fallback if Bootstrap JS isn't loaded correctly
                 if (currentAlert.parentNode === statusArea) {
                     currentAlert.remove();
                 }
            }
        }
        // Reset the ID *after* this timeout function has finished executing
        // Check if the current ID still belongs to *this* timeout before nulling
        if (statusMessageTimeoutId === timeoutId) { // 'timeoutId' refers to the ID returned by this specific setTimeout call
             statusMessageTimeoutId = null;
        }
    }, STATUS_MESSAGE_DURATION);

    // Assign the timeoutId to a variable accessible within the callback for the check above
    const timeoutId = statusMessageTimeoutId;
}

// ==========================================================================
// --- Event Listeners ---
// ==========================================================================

function setupEventListeners() {
    console.log("Setting up event listeners...");

    // Editor listeners
    if (codeEditorArea && codeEditorHighlightPre && locIndicatorContainer && codeEditorHighlightCode) {
        codeEditorArea.addEventListener('keydown', handleKeyPress);
        // Sync scrolling between textarea and highlight pre
        codeEditorArea.addEventListener('scroll', () => {
            if(codeEditorHighlightPre) {
                codeEditorHighlightPre.scrollTop = codeEditorArea.scrollTop;
                codeEditorHighlightPre.scrollLeft = codeEditorArea.scrollLeft;
            }
        });
        // Initial highlight on focus/load
        codeEditorArea.addEventListener('input', updateCodeHighlight); // Update highlight on any input
        console.log("Attached listeners to code editor.");
    } else {
        console.error("CRITICAL: Editor elements not found! Cannot attach key listeners.");
        displaySaveMessage("Critical Error: Editor UI missing. Refresh might be needed.", true);
    }

    // Save/Load/Reset Buttons
    saveButton?.addEventListener('click', () => { saveGame(); displaySaveMessage("Game Saved.", false); });
    loadButton?.addEventListener('click', loadGame); // loadGame handles its own messages
    resetButton?.addEventListener('click', () => resetGame()); // resetGame handles confirm & message

    // Upgrade Buttons
    buyAutoTyperButton?.addEventListener('click', () => buyUpgrade('autoTyper'));
    buyFasterTypingButton?.addEventListener('click', () => buyUpgrade('fasterTyping'));

    // Tech Buttons
    learnCssButton?.addEventListener('click', () => learnTech('css'));
    learnJsButton?.addEventListener('click', () => learnTech('js'));

    // Project Commit Buttons
    commitLocButton?.addEventListener('click', () => commitLoC()); // Uses input field amount

    if (commitLocAmountInput) {
         const setCommitAmount = (value) => {
            commitLocAmountInput.value = Math.max(1, Math.floor(value)); // Ensure positive integer >= 1
        };
        // +/- Buttons for commit amount
        commit1LocButton?.addEventListener('click', () => { let currentVal = parseInt(commitLocAmountInput.value) || 1; setCommitAmount(currentVal - 1); });
        commit10LocButton?.addEventListener('click', () => { let currentVal = parseInt(commitLocAmountInput.value) || 1; setCommitAmount(currentVal - 10); });
        commitPlus1LocButton?.addEventListener('click', () => { let currentVal = parseInt(commitLocAmountInput.value) || 0; setCommitAmount(currentVal + 1); });
        commitPlus10LocButton?.addEventListener('click', () => { let currentVal = parseInt(commitLocAmountInput.value) || 0; setCommitAmount(currentVal + 10); });
        // Input validation
        commitLocAmountInput.addEventListener('input', () => { let currentVal = parseInt(commitLocAmountInput.value) || 1; if (currentVal < 1) { commitLocAmountInput.value = 1; } });
        commitLocAmountInput.addEventListener('change', () => { let currentVal = parseInt(commitLocAmountInput.value) || 1; if (currentVal < 1) { commitLocAmountInput.value = 1; } }); // Also check on change event
    } else {
         console.warn("Commit LoC amount input field not found.");
    }

    // Note: Project start/cancel buttons are added dynamically in updateAvailableProjectsDisplay/updateActiveProjectDisplay

    console.log("Event listeners setup complete.");
}

// ==========================================================================
// --- Game Loop ---
// ==========================================================================

function gameLoop() {
    updateResources();
    updateDisplay();
    // Future: Add checks for game events, achievements etc. here
}

// ==========================================================================
// --- Initialization ---
// ==========================================================================

function initializeGame() {
    console.log(`Initializing CodeEditor Tycoon v1.8 (Save Key: ${SAVE_KEY})...`);
    // Check if project data is loaded (it should be if projects.js is included before this script)
    if (typeof projectData === 'undefined' || typeof getAvailableProjects === 'undefined') {
        console.error("CRITICAL: projects.js not loaded or failed! Project functionality will be broken.");
        displaySaveMessage("Error: Failed to load project data. Projects unavailable.", true);
        // Optionally disable project tab or show permanent error message
    } else {
        console.log("Project data appears loaded.");
    }

    loadGame(); // Load save or start fresh
    setupEventListeners(); // Attach all interaction listeners

    // Start game loops
    setInterval(gameLoop, GAME_LOOP_INTERVAL);
    console.log(`Game loop started: ${GAME_LOOP_INTERVAL}ms interval`);
    setInterval(saveGame, AUTO_SAVE_INTERVAL); // Auto-save periodically
    console.log(`Auto-save started: ${AUTO_SAVE_INTERVAL}ms interval`);

    // Initial UI setup
    updateDisplay(); // Ensure UI reflects initial state
    updateCodeHighlight(); // Render initial editor content highlight

    // Focus editor on load for immediate typing
    window.addEventListener('load', () => {
        if (codeEditorArea) {
            codeEditorArea.focus();
            console.log("Editor focused on window load.");
        } else {
            console.warn("Editor not found on window load, cannot focus.");
        }
    });

    console.log("Game Initialization Complete.");
}

// ==========================================================================
// --- Start the Game ---
// ==========================================================================
// Use DOMContentLoaded to ensure the HTML is ready before running the script
document.addEventListener('DOMContentLoaded', initializeGame);
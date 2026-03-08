/* =============================================
   ANONEMASI WRITER (one with desired essay writing) — COMPLETE SCRIPT
   Essay Writer (original flow) + Dissertation Writer + References in Downloads
   ============================================= */

const API_KEYS = [
    "AIzaSyDTgF2a1cr8Xv-IEQuVHDaJQvyvEohMVL8",
    "AIzaSyBTnX9_I0NtfT0y42bElPTWEy6JWMRQ4fA",
    "AIzaSyC620ASmy4KnU-hfscGwPLtmoIIpQeA9Eo",
    "AIzaSyDfIYQY6owR0LtzyTVHv610JOSBRwTB4x0",
    "AIzaSyAhdA_I-n7w3H2LhliqjAsAwd-LmPDIbs8",
    "AIzaSyDS8rBA8Nf_N4zWFjbo06A6l6X49pHewmI",
    "AIzaSyAtpu9d7Ycc9Fl02WaE72RLUjKFcdrSC2Q",
    "AIzaSyAo8kR0eNtNQVJgPFGtBh5CrRdxFoATZsg",
    "AIzaSyDlh09rqAqVRVYFVOxGQ-lJt9TEDlRdSz8",
    "AIzaSyCTdgbQE5wevHnvrxDk_19r7aQawAds7wA",
    "AIzaSyCy9Hc54dfEW9REknqwe9xg3VN4Wz800k0",
    "AIzaSyBvbTEBz5xAK7DSFnHZlosJSVvYDBcQnjc",
    "AIzaSyCyas2DC_y3hvEgiikdsqfVLCo0hSrITOE",
    "AIzaSyA_L6NaENi3jjyZkDoh1SBCN4qp5StW_Ik"
];

const MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-2.5-flash-lite"
];

/* Persistent rotation pointers */
let _modelIdx = 0;
let _keyIdx   = 0;

/* =========================================================
   MODE TRACKING
   ========================================================= */
let currentMode = 'essay'; // 'essay' or 'dissertation'

/* =========================================================
   LANDING PAGE FUNCTIONS
   ========================================================= */
function selectService(type) {
    if (type === 'article' || type === 'humanizer') {
        showComingSoonModal(type === 'article' ? 'Article writing is coming soon! Stay tuned.' : 'The Humanizer tool is coming soon! Stay tuned.');
        return;
    }

    currentMode = type; // 'essay' or 'dissertation'

    // Hide landing page, show app
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('app-layout').style.display = 'flex';
    document.body.classList.remove('lp-active');
    document.body.style.height = '100vh';
    document.body.style.overflow = 'hidden';

    if (type === 'dissertation') {
        initDissertationMode();
    } else {
        initEssayMode();
    }
}

function goBackToLanding() {
    // Save current assignment if it has content
    if (currentMode === 'essay' && state.topic) saveAssignment();
    if (currentMode === 'dissertation' && dissState.topic) saveDissertation();

    document.getElementById('app-layout').style.display = 'none';
    document.getElementById('landing-page').style.display = 'flex';
    document.body.classList.add('lp-active');
    document.body.style.height = 'auto';
    document.body.style.overflow = '';
    window.scrollTo(0, 0);
}

function initEssayMode() {
    // Reset state and show essay workspace
    resetToNewAssignment();
    updateSavedAssignmentsList();
}

/* =========================================================
   AUTH MODALS
   ========================================================= */
function showLoginModal() {
    document.getElementById('login-modal').style.display = 'flex';
}
function closeLoginModal() {
    document.getElementById('login-modal').style.display = 'none';
}
function showSignupModal() {
    document.getElementById('signup-modal').style.display = 'flex';
}
function closeSignupModal() {
    document.getElementById('signup-modal').style.display = 'none';
}
function showComingSoonModal(message) {
    document.getElementById('coming-soon-message').textContent = message;
    document.getElementById('coming-soon-modal').style.display = 'flex';
}
function closeComingSoonModal() {
    document.getElementById('coming-soon-modal').style.display = 'none';
}

/* =========================================================
   ESSAY STATE
   ========================================================= */
let state = {
    id:           null,
    requirements: "",
    topic:        "",
    paras:        7,
    refs:         8,
    keyThemes:    [],
    essayType:    "standard",
    englishStyle: "simple",
    useHeadings:  false,
    includeURLs:  false,
    specificQs:   [],
    sources:      [],
    plan:         [],
    drafts:       {},
    references:   "",
    createdAt:    null,
    lastModified: null,
    defaultIntroWords: 95,
    defaultConclusionWords: 95,
    defaultBodyWords: 120
};

/* =========================================================
   LOCAL STORAGE MANAGEMENT (ESSAY)
   ========================================================= */
function saveAssignment() {
    state.lastModified = new Date().toISOString();
    if (!state.id) {
        state.id = 'assignment_' + Date.now();
        state.createdAt = state.lastModified;
    }
    localStorage.setItem(state.id, JSON.stringify(state));
    updateSavedAssignmentsList();
}

function loadAssignment(id) {
    const data = localStorage.getItem(id);
    if (data) {
        state = JSON.parse(data);
        currentMode = 'essay';
        document.getElementById('landing-page').style.display = 'none';
        document.getElementById('app-layout').style.display = 'flex';
        document.body.classList.remove('lp-active');
        reconstructUI();
    }
}

function deleteAssignment(id) {
    showConfirmModal(
        'Delete Assignment',
        'Are you sure you want to delete this assignment? This action cannot be undone.',
        () => {
            localStorage.removeItem(id);
            if (state.id === id) {
                startNewAssignment();
            }
            updateSavedAssignmentsList();
        }
    );
}

function getAllAssignments() {
    const assignments = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('assignment_')) {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                assignments.push({
                    id: key,
                    topic: data.topic || 'Untitled',
                    createdAt: data.createdAt,
                    lastModified: data.lastModified
                });
            } catch(e) {}
        }
    }
    return assignments.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
}

function updateSavedAssignmentsList() {
    const container = document.getElementById('saved-assignments');
    if (!container) return;
    const assignments = getAllAssignments();

    if (assignments.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = assignments.map(a => `
        <div class="saved-item ${a.id === state.id ? 'active' : ''}"
             onclick="loadAssignment('${a.id}')">
            <span class="saved-item-text">
                ${escHtml(a.topic.substring(0, 30))}${a.topic.length > 30 ? '...' : ''}
            </span>
            <span class="saved-item-date">${new Date(a.lastModified).toLocaleDateString()}</span>
            <button class="saved-item-delete" onclick="event.stopPropagation(); deleteAssignment('${a.id}')" title="Delete assignment">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function startNewAssignment() {
    const hasContent = state.topic || state.plan.length > 0 || Object.keys(state.drafts).length > 0;

    if (hasContent) {
        showConfirmModal(
            'Start New Assignment',
            'Start a new assignment? Your current work will be saved automatically.',
            () => {
                resetToNewAssignment();
            }
        );
    } else {
        resetToNewAssignment();
    }
}

function resetToNewAssignment() {
    if (state.topic) saveAssignment();

    state = {
        id: null,
        requirements: "",
        topic: "",
        paras: 7,
        refs: 8,
        keyThemes: [],
        essayType: "standard",
        englishStyle: "simple",
        useHeadings: false,
        includeURLs: false,
        specificQs: [],
        sources: [],
        plan: [],
        drafts: {},
        references: "",
        createdAt: null,
        lastModified: null,
        defaultIntroWords: 95,
        defaultConclusionWords: 95,
        defaultBodyWords: 120
    };

    const chatThread = document.getElementById('chat-thread');
    chatThread.innerHTML = '';

    const welcomeMsg = document.createElement('div');
    welcomeMsg.className = 'msg ai-msg';
    welcomeMsg.id = 'welcome-msg';
    welcomeMsg.innerHTML = `
        <div class="avatar-box"><i class="fas fa-feather-alt"></i></div>
        <div class="msg-content">
            <p class="msg-label">Anonemasi Writer</p>
            <h2>Welcome to your writing workspace.</h2>
            <p>Upload your assignment brief or paste your requirements below. I'll analyze it thoroughly, find academic sources, build a comprehensive plan that covers every angle of your topic, then draft each paragraph with proper citations and validated letter frequency — all visible right here as I work.</p>
            <div id="drop-zone" class="upload-zone">
                <i class="fas fa-cloud-upload-alt"></i>
                <p><strong>Drop your assignment brief here</strong></p>
                <span>PDF or DOCX supported · or paste text below</span>
            </div>
        </div>
    `;
    chatThread.appendChild(welcomeMsg);

    initDropZone();

    setActiveStep(1);
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) { exportBtn.disabled = true; exportBtn.classList.remove('ready'); }
    const mainInput = document.getElementById('main-input');
    if (mainInput) mainInput.value = '';
    setStatus('Ready');
    const progressWrap = document.getElementById('progress-wrap');
    if (progressWrap) progressWrap.style.display = 'none';
    const paraCounter = document.getElementById('para-counter');
    if (paraCounter) paraCounter.style.display = 'none';

    updateSavedAssignmentsList();

    const scroller = document.getElementById('chat-scroller');
    if (scroller) scroller.scrollTop = 0;
}

function reconstructUI() {
    const chatThread = document.getElementById('chat-thread');
    chatThread.innerHTML = '';

    if (state.topic) {
        appendMsg('ai', `
            <h3><i class="fas fa-check-circle"></i> Assignment Analyzed</h3>
            <p><strong>Essay Topic:</strong> ${escHtml(state.topic)}</p>
            <p><strong>Type:</strong> ${state.essayType.charAt(0).toUpperCase() + state.essayType.slice(1)} Essay</p>
            <p><strong>Paragraphs:</strong> ${state.paras} (including intro & conclusion)</p>
        `);
    }

    if (state.sources && state.sources.length > 0) {
        let sourcesHTML = '<div class="sources-grid">';
        state.sources.forEach((s, i) => {
            const url = s.url || `https://scholar.google.com/scholar?q=${encodeURIComponent(s.title + ' ' + s.author)}`;
            sourcesHTML += `
                <a href="${escHtml(url)}" target="_blank" class="source-card clickable-source" title="Click to access this source">
                    <div class="source-num">${i + 1}</div>
                    <div class="source-details">
                        <p class="source-author">${escHtml(s.author)} (${escHtml(s.year)})</p>
                        <p class="source-title">${escHtml(s.title)}</p>
                        <p class="source-journal">${escHtml(s.journal)}</p>
                        ${s.relevance ? `<p class="source-relevance">${escHtml(s.relevance)}</p>` : ''}
                        <p class="source-link"><i class="fas fa-external-link-alt"></i> Click to access</p>
                    </div>
                </a>`;
        });
        sourcesHTML += '</div>';
        appendMsg('ai', `
            <h3><i class="fas fa-books"></i> ${state.sources.length} Sources Found</h3>
            ${sourcesHTML}
        `);
    }

    if (state.plan && state.plan.length > 0) {
        setActiveStep(3);
        let planHTML = '<div class="plan-container">';
        state.plan.forEach((item, i) => {
            const isIntro = item.section === 'Introduction';
            const isConc = item.section === 'Conclusion';
            const sectionClass = isIntro ? 'plan-intro' : isConc ? 'plan-conclusion' : 'plan-body';

            let keyPointsHTML = '';
            if (item.keyPoints && item.keyPoints.length > 0) {
                keyPointsHTML = '<div class="plan-key-points"><strong>Key Points:</strong><ul>';
                item.keyPoints.forEach(kp => { keyPointsHTML += `<li>${escHtml(kp)}</li>`; });
                keyPointsHTML += '</ul></div>';
            }

            let sourcesHTML = '';
            if (item.sources && item.sources.length > 0) {
                sourcesHTML = '<div class="plan-sources"><strong>Sources:</strong> ';
                sourcesHTML += item.sources.map(idx => {
                    const src = state.sources[idx - 1];
                    return src ? `${escHtml(src.author)} (${escHtml(src.year)})` : `Source ${idx}`;
                }).join(', ');
                sourcesHTML += '</div>';
            }

            planHTML += `
                <div class="plan-card ${sectionClass} editable-plan" id="plan-${i}" data-index="${i}">
                    <div class="plan-header">
                        <span class="plan-num">${i + 1}</span>
                        <div class="plan-info">
                            <h4 class="plan-heading-display" id="heading-display-${i}">${escHtml(item.heading)}</h4>
                            <input type="text" class="plan-heading-edit" id="heading-edit-${i}" value="${escHtml(item.heading)}" style="display:none">
                            <span class="plan-meta">
                                <span class="word-count-display" id="words-display-${i}">${item.words} words</span>
                                <input type="number" class="word-count-edit" id="words-edit-${i}" value="${item.words}" min="50" max="1000" style="display:none">
                            </span>
                        </div>
                        <button class="btn-edit-plan" id="edit-btn-${i}" onclick="event.stopPropagation(); toggleEditPlan(${i})" title="Edit paragraph">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                    <div class="plan-body">
                        <p class="plan-purpose-display" id="purpose-display-${i}">${escHtml(item.purpose)}</p>
                        <textarea class="plan-purpose-edit" id="purpose-edit-${i}" style="display:none">${escHtml(item.purpose)}</textarea>
                        ${keyPointsHTML}
                        ${sourcesHTML}
                        <div class="plan-edit-actions" id="edit-actions-${i}" style="display:none;margin-top:12px">
                            <button class="btn-small btn-primary" onclick="event.stopPropagation(); savePlanEdit(${i})"><i class="fas fa-check"></i> Save</button>
                            <button class="btn-small btn-outline" onclick="event.stopPropagation(); cancelPlanEdit(${i})"><i class="fas fa-times"></i> Cancel</button>
                        </div>
                    </div>
                </div>`;
        });
        planHTML += '</div>';

        appendMsg('ai', `
            <h3><i class="fas fa-list-check"></i> Comprehensive Essay Plan</h3>
            <p>Detailed breakdown of all ${state.plan.length} paragraphs.</p>
            ${planHTML}
        `);

        setTimeout(() => {
            document.querySelectorAll('.editable-plan').forEach(card => {
                card.addEventListener('click', function(e) {
                    if (e.target.tagName === 'INPUT' ||
                        e.target.tagName === 'TEXTAREA' ||
                        e.target.tagName === 'BUTTON' ||
                        e.target.closest('button') ||
                        this.classList.contains('editing')) {
                        return;
                    }
                    const index = parseInt(this.dataset.index);
                    toggleEditPlan(index);
                });
            });
        }, 100);
    }

    if (state.drafts && Object.keys(state.drafts).length > 0) {
        setActiveStep(4);
        state.plan.forEach((planItem, i) => {
            const draft = state.drafts[i];
            if (draft) {
                const heading = planItem.heading;
                const paraHTML = `
                    <div class="para-card done" id="card-${i}">
                        <div class="para-header">
                            <h4>${escHtml(heading)}</h4>
                            <span class="badge done" id="badge-${i}">✓ Complete</span>
                        </div>
                        <div class="para-content">
                            <div class="text-block">
                                <p id="ai-text-${i}">${escHtml(draft)}</p>
                            </div>
                        </div>
                    </div>`;
                appendMsg('ai', paraHTML);
            }
        });
    }

    if (state.references) {
        appendMsg('ai', `
            <h3 class="success-heading"><i class="fas fa-check-circle"></i> Essay Complete!</h3>
            <p>Your essay has been fully drafted with ${state.plan.length} paragraphs and proper APA citations.</p>
            <div class="references-block" style="margin-top:16px;padding:14px;background:var(--bg-2);border-radius:var(--radius);border:1px solid var(--border)">
                <h4 style="margin-bottom:10px;text-align:left;">References</h4>
                <div class="references-content">${state.references.split('\n').filter(l => l.trim()).map(l => `<p class="ref-line">${l}</p>`).join('')}</div>
            </div>
        `);
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) { exportBtn.disabled = false; exportBtn.classList.add('ready'); }
    }

    updateSavedAssignmentsList();
    scrollToBottom();
}

/* =========================================================
   AI CALL — rotates models then keys on every failure
   ========================================================= */
async function callAI(prompt) {
    const totalModels = MODELS.length;
    const totalKeys   = API_KEYS.length;
    const maxAttempts = totalModels * totalKeys;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const model = MODELS[_modelIdx % totalModels];
        const key   = API_KEYS[_keyIdx   % totalKeys];

        try {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
                    })
                }
            );

            const rawText = await res.text();
            let data;
            try { data = JSON.parse(rawText); }
            catch (_) { throw new Error(`HTTP ${res.status} — non-JSON response`); }

            if (data.error) {
                const errorMsg = data.error.message;
                const isQuotaError = res.status === 429 || errorMsg.includes('quota') || errorMsg.includes('Quota exceeded');

                if (isQuotaError) {
                    console.warn(`[callAI] ${attempt + 1}/${maxAttempts} | ${model} | …${key.slice(-6)} | QUOTA EXCEEDED - rotating key immediately`);
                    _keyIdx++;
                    if (_keyIdx % totalKeys === 0) {
                        _modelIdx++;
                        console.info(`[callAI] → next model: ${MODELS[_modelIdx % totalModels]}`);
                    }
                    continue;
                }

                throw new Error(`API: ${errorMsg}`);
            }

            const cand = data.candidates && data.candidates[0];
            if (!cand || !cand.content || !cand.content.parts) {
                throw new Error("Empty candidate in response");
            }
            return cand.content.parts[0].text;

        } catch (e) {
            console.warn(`[callAI] ${attempt + 1}/${maxAttempts} | ${model} | …${key.slice(-6)} | ${e.message}`);
            _keyIdx++;
            if (_keyIdx % totalKeys === 0) {
                _modelIdx++;
                console.info(`[callAI] → next model: ${MODELS[_modelIdx % totalModels]}`);
            }
            await sleep(500 + attempt * 300);
        }
    }
    throw new Error("All API keys and models exhausted. Please refresh and try again.");
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/* =========================================================
   ROBUST JSON PARSER
   ========================================================= */
function safeJSON(raw, validateSources = false) {
    let text = raw.trim();

    const jsonMatch = text.match(/```(?:json)?\s*(\[[\s\S]*?\]|\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
        text = jsonMatch[1].trim();
    } else {
        const arrayStart = text.indexOf('[');
        const arrayEnd = text.lastIndexOf(']');
        const objStart = text.indexOf('{');
        const objEnd = text.lastIndexOf('}');

        if (arrayStart !== -1 && arrayEnd !== -1 && arrayStart < arrayEnd) {
            text = text.substring(arrayStart, arrayEnd + 1);
        } else if (objStart !== -1 && objEnd !== -1 && objStart < objEnd) {
            text = text.substring(objStart, objEnd + 1);
        }
    }

    text = text
        .replace(/,\s*([}\]])/g, '$1')
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    try {
        const parsed = JSON.parse(text);

        if (validateSources && Array.isArray(parsed)) {
            const validSources = parsed.filter(s =>
                s && typeof s === 'object' &&
                s.author && s.year && s.title
            );

            if (validSources.length === 0) {
                throw new Error('No valid sources found in response');
            }

            return validSources;
        }

        return parsed;
    } catch (e) {
        console.error('[safeJSON] Parse failed:', e.message);
        console.error('[safeJSON] Raw input (first 500 chars):', raw.substring(0, 500));
        console.error('[safeJSON] Cleaned text (first 500 chars):', text.substring(0, 500));
        throw new Error('AI response not valid JSON: ' + e.message);
    }
}

/* =========================================================
   UI STATE MANAGEMENT
   ========================================================= */
let uiBlocked = false;

function setUIBlocked(blocked) {
    uiBlocked = blocked;
    const input = document.getElementById('main-input');
    const sendBtn = document.getElementById('send-btn');
    if (input) {
        input.disabled = blocked;
    }
    if (sendBtn) {
        sendBtn.disabled = blocked;
        sendBtn.style.opacity = blocked ? '0.5' : '1';
    }
}

function setActiveStep(num) {
    for (let i = 1; i <= 4; i++) {
        const el = document.getElementById('st-' + i);
        if (el) {
            if (i <= num) el.classList.add('active');
            else el.classList.remove('active');
        }
    }
}

function setStatus(text) {
    const label = document.getElementById('status-label');
    if (label) label.textContent = text;
}

function setProgress(percent) {
    const bar = document.getElementById('progress-bar');
    const wrap = document.getElementById('progress-wrap');
    if (bar) bar.style.width = percent + '%';
    if (wrap) wrap.style.display = 'block';
}

function setParaCounter(current, total) {
    const el = document.getElementById('para-counter');
    if (el) {
        el.textContent = `Paragraph ${current} of ${total}`;
        el.style.display = 'block';
    }
}

function scrollToBottom() {
    const scroller = document.getElementById('chat-scroller');
    if (scroller) {
        setTimeout(() => {
            scroller.scrollTop = scroller.scrollHeight;
        }, 10);
    }
}

function appendMsg(role, html, id = null) {
    const container = document.getElementById('chat-thread');
    if (!container) return;

    let className = '';
    let avatar = '';
    let label = '';

    if (role === 'user') {
        className = 'user-msg';
        avatar = '<i class="fas fa-user"></i>';
        label = 'You';
    } else if (role === 'ai') {
        className = 'ai-msg';
        avatar = '<i class="fas fa-feather-alt"></i>';
        label = 'Anonemasi Writer';
    } else if (role === 'thinking') {
        className = 'thinking-msg';
        avatar = '<i class="fas fa-brain"></i>';
        label = 'Thinking';
    }

    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg ' + className;
    if (id) msgDiv.id = id;

    msgDiv.innerHTML = `
        <div class="avatar-box">${avatar}</div>
        <div class="msg-content">
            ${label ? `<p class="msg-label">${label}</p>` : ''}
            ${html}
        </div>
    `;

    container.appendChild(msgDiv);
    scrollToBottom();
}

function removeThinking(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

/* =========================================================
   FILE UPLOAD & DROP ZONE
   ========================================================= */
function initDropZone() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');

    if (!dropZone) return;

    const newDropZone = dropZone.cloneNode(true);
    dropZone.parentNode.replaceChild(newDropZone, dropZone);

    const dz = document.getElementById('drop-zone');

    dz.addEventListener('click', () => fileInput.click());

    dz.addEventListener('dragover', (e) => {
        e.preventDefault();
        dz.style.borderColor = 'var(--primary)';
        dz.style.background = 'var(--primary-lt)';
    });

    dz.addEventListener('dragleave', () => {
        dz.style.borderColor = 'var(--border)';
        dz.style.background = 'transparent';
    });

    dz.addEventListener('drop', (e) => {
        e.preventDefault();
        dz.style.borderColor = 'var(--border)';
        dz.style.background = 'transparent';
        const file = e.dataTransfer.files[0];
        if (file) handleFileUpload(file);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Landing page is shown on load — enable body scroll
    document.body.classList.add('lp-active');

    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const mainInput = document.getElementById('main-input');

    updateSavedAssignmentsList();

    if (dropZone) {
        initDropZone();
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) handleFileUpload(file);
        });
    }

    if (mainInput) {
        mainInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                startGeneration();
            }
        });
    }
});

async function handleFileUpload(file) {
    if (!file) return;

    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!validTypes.includes(file.type)) {
        return;
    }

    try {
        let text = '';
        if (file.type === 'application/pdf') {
            text = await extractTextFromPDF(file);
        } else {
            text = await extractTextFromDOCX(file);
        }

        if (text.trim()) {
            const textarea = document.getElementById('main-input');
            textarea.value = text;
            autoGrow(textarea);
        }
    } catch (e) {
        console.error('Error reading file:', e);
    }
}

async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        const lines = [];
        let currentLine = [];
        let lastY = null;

        textContent.items.forEach(item => {
            const y = item.transform[5];

            if (lastY !== null && Math.abs(y - lastY) > 5) {
                if (currentLine.length > 0) {
                    lines.push(currentLine.join(' ').trim());
                    currentLine = [];
                }
            }

            currentLine.push(item.str);
            lastY = y;
        });

        if (currentLine.length > 0) {
            lines.push(currentLine.join(' ').trim());
        }

        for (let j = 0; j < lines.length; j++) {
            if (lines[j].trim()) {
                fullText += lines[j] + '\n';
            } else {
                fullText += '\n';
            }
        }

        fullText += '\n';
    }

    return fullText;
}

async function extractTextFromDOCX(file) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = result.value;

    let formattedText = '';

    const elements = tempDiv.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li');
    elements.forEach(el => {
        const text = el.textContent.trim();
        if (text) {
            if (el.tagName === 'LI') {
                formattedText += '• ' + text + '\n';
            } else {
                formattedText += text + '\n';
            }

            if (el.tagName.startsWith('H') || el.tagName === 'P') {
                formattedText += '\n';
            }
        }
    });

    if (formattedText.trim().length === 0) {
        const rawResult = await mammoth.extractRawText({ arrayBuffer });
        formattedText = rawResult.value;
    }

    return formattedText;
}

function autoGrow(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
}

/* =========================================================
   CONFIGURATION MODAL
   ========================================================= */
function showConfigurationModal() {
    const modalHTML = `
        <div id="config-modal" class="modal" style="display:flex">
            <div class="modal-backdrop" onclick="closeConfigModal()"></div>
            <div class="modal-content-sm">
                <div class="modal-header">
                    <h3><i class="fas fa-cog"></i> Essay Configuration</h3>
                    <button class="btn-close" onclick="closeConfigModal()"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <label class="input-label">Number of Paragraphs (including intro & conclusion):</label>
                    <input type="number" id="paras-input" value="${state.paras}" min="5" max="15" class="number-input">

                    <label class="input-label">Number of References:</label>
                    <input type="number" id="refs-input" value="${state.refs}" min="3" max="20" class="number-input">

                    <label class="input-label">Essay Type:</label>
                    <select id="type-input" class="select-input">
                        <option value="standard" ${state.essayType === 'standard' ? 'selected' : ''}>Standard</option>
                        <option value="analytical" ${state.essayType === 'analytical' ? 'selected' : ''}>Analytical</option>
                        <option value="argumentative" ${state.essayType === 'argumentative' ? 'selected' : ''}>Argumentative</option>
                        <option value="expository" ${state.essayType === 'expository' ? 'selected' : ''}>Expository</option>
                    </select>

                    <label class="input-label" style="display:flex;align-items:center;gap:8px;margin-top:16px">
                        <input type="checkbox" id="headings-input" ${state.useHeadings ? 'checked' : ''} style="width:auto;margin:0">
                        <span>Include paragraph headings (default is no headings)</span>
                    </label>

                    <label class="input-label" style="display:flex;align-items:center;gap:8px;margin-top:12px">
                        <input type="checkbox" id="urls-input" ${state.includeURLs ? 'checked' : ''} style="width:auto;margin:0">
                        <span>Include URLs/DOIs in references (default is no URLs)</span>
                    </label>

                    <button class="btn-primary full-width" onclick="applyConfiguration()">
                        <i class="fas fa-check"></i> Apply Configuration
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeConfigModal() {
    const modal = document.getElementById('config-modal');
    if (modal) modal.remove();
}

function applyConfiguration() {
    const oldParas = state.paras;
    const oldRefs = state.refs;
    const oldType = state.essayType;
    const oldHeadings = state.useHeadings;
    const oldURLs = state.includeURLs;

    state.paras = parseInt(document.getElementById('paras-input').value);
    state.refs = parseInt(document.getElementById('refs-input').value);
    state.essayType = document.getElementById('type-input').value;
    state.useHeadings = document.getElementById('headings-input').checked;
    state.includeURLs = document.getElementById('urls-input').checked;

    closeConfigModal();

    const configDisplays = document.querySelectorAll('.section-card');
    if (configDisplays.length > 0) {
        configDisplays.forEach(card => {
            const configDiv = card.querySelector('div[style*="background:var(--bg-3)"]');
            if (configDiv) {
                configDiv.innerHTML = `<strong>Configuration:</strong> ${escHtml(state.essayType.charAt(0).toUpperCase() + state.essayType.slice(1))} essay, ${state.paras} paragraphs (including intro & conclusion), ${state.useHeadings ? 'with headings' : 'no headings'}, ${state.includeURLs ? 'with URLs/DOIs' : 'no URLs/DOIs'}`;

                configDiv.style.transition = 'background-color 0.3s ease';
                configDiv.style.backgroundColor = 'var(--success-lt)';
                setTimeout(() => {
                    configDiv.style.backgroundColor = 'var(--bg-3)';
                }, 1500);
            }
        });
    }

    const changes = [];
    if (oldParas !== state.paras) changes.push(`Paragraphs: ${oldParas} → ${state.paras}`);
    if (oldRefs !== state.refs) changes.push(`References: ${oldRefs} → ${state.refs}`);
    if (oldType !== state.essayType) changes.push(`Type: ${oldType} → ${state.essayType}`);
    if (oldHeadings !== state.useHeadings) changes.push(`Headings: ${oldHeadings ? 'yes' : 'no'} → ${state.useHeadings ? 'yes' : 'no'}`);
    if (oldURLs !== state.includeURLs) changes.push(`URLs: ${oldURLs ? 'yes' : 'no'} → ${state.includeURLs ? 'yes' : 'no'}`);

    if (changes.length > 0) {
        appendMsg('ai', `
            <div style="padding:12px;background:var(--success-lt);border-left:3px solid var(--success);border-radius:var(--radius);margin:8px 0">
                <p style="margin:0;font-weight:600;color:var(--success)"><i class="fas fa-check-circle"></i> Configuration Updated</p>
                <p style="margin:4px 0 0 0;font-size:0.85rem;color:var(--text-2)">${changes.join(' • ')}</p>
            </div>
        `);
        scrollToBottom();
    }

    saveAssignment();
}

/* =========================================================
   ENGLISH STYLE MODAL
   ========================================================= */
function showEnglishStyleModal() {
    const modalHTML = `
        <div id="style-modal" class="modal" style="display:flex">
            <div class="modal-backdrop" onclick="closeStyleModal()"></div>
            <div class="modal-content-sm">
                <div class="modal-header">
                    <h3><i class="fas fa-font"></i> English Style</h3>
                    <button class="btn-close" onclick="closeStyleModal()"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <p style="margin-bottom:16px;color:var(--text-2);font-size:0.85rem">Choose the vocabulary and writing style:</p>

                    <div style="display:flex;flex-direction:column;gap:10px">
                        <div class="style-option ${state.englishStyle === 'simple' ? 'selected' : ''}" onclick="selectStyle('simple')">
                            <div style="font-weight:600">Simple & Straightforward</div>
                            <div style="font-size:0.8rem;color:var(--text-3);margin-top:4px">Clear, direct sentences with accessible language</div>
                        </div>

                        <div class="style-option ${state.englishStyle === 'common' ? 'selected' : ''}" onclick="selectStyle('common')">
                            <div style="font-weight:600">Academic Common</div>
                            <div style="font-size:0.8rem;color:var(--text-3);margin-top:4px">Professional but commonly understood words</div>
                        </div>

                        <div class="style-option ${state.englishStyle === 'standard' ? 'selected' : ''}" onclick="selectStyle('standard')">
                            <div style="font-weight:600">Standard Academic</div>
                            <div style="font-size:0.8rem;color:var(--text-3);margin-top:4px">Traditional academic vocabulary and structures</div>
                        </div>
                    </div>

                    <button class="btn-primary full-width" onclick="applyStyleAndDraft()" style="margin-top:20px">
                        <i class="fas fa-arrow-right"></i> Continue to Drafting
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeStyleModal() {
    const modal = document.getElementById('style-modal');
    if (modal) modal.remove();
}

function selectStyle(style) {
    state.englishStyle = style;

    document.querySelectorAll('.style-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    saveAssignment();
}

function applyStyleAndDraft() {
    closeStyleModal();
    draftAllParagraphs();
}

/* =========================================================
   MAIN GENERATION FLOW (ESSAY)
   ========================================================= */
async function startGeneration() {
    const input = document.getElementById('main-input');
    const requirements = input.value.trim();

    if (!requirements) {
        return;
    }

    state.requirements = requirements;
    setUIBlocked(true);

    const welcomeMsg = document.getElementById('welcome-msg');
    if (welcomeMsg) welcomeMsg.remove();

    appendMsg('user', `<p>${escHtml(requirements.substring(0, 500))}${requirements.length > 500 ? '...' : ''}</p>`);

    input.value = '';
    input.style.height = 'auto';

    performAnalysis();
}

async function performAnalysis() {
    setActiveStep(1);
    setStatus('Analyzing requirements…');
    setProgress(5);

    const thinkingId = 'think-analyze';
    appendMsg('thinking', '<i class="fas fa-spinner fa-spin"></i> Analyzing assignment requirements and identifying key themes…', thinkingId);

    try {
        const analysisPrompt = `Analyze this assignment requirement thoroughly:

"""
${state.requirements}
"""

Return JSON with:
{
  "topic": "Clear essay title based on the assignment",
  "keyThemes": ["theme1", "theme2", "theme3"],
  "essayType": "One of: analytical, argumentative, expository, descriptive",
  "specificQuestions": ["question1", "question2"]
}

Be thorough and extract ALL key requirements.`;

        const resp = await callAI(analysisPrompt);
        let analysis;
        try {
            analysis = safeJSON(resp);
        } catch (e) {
            const jsonMatch = resp.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    analysis = JSON.parse(jsonMatch[0]);
                } catch (e2) {
                    throw new Error('Could not parse analysis response. Please try again.');
                }
            } else {
                throw new Error('No valid JSON found in response. Please try again.');
            }
        }

        state.topic = analysis.topic || 'Untitled Essay';
        state.keyThemes = analysis.keyThemes || [];
        state.specificQs = analysis.specificQuestions || [];

        removeThinking(thinkingId);

        let themesHTML = '<ul>';
        state.keyThemes.forEach(theme => {
            themesHTML += `<li>${escHtml(theme)}</li>`;
        });
        themesHTML += '</ul>';

        appendMsg('ai', `
            <h3><i class="fas fa-lightbulb"></i> Analysis Complete</h3>
            <div class="section-card">
                <h4>Essay Topic</h4>
                <p><strong>${escHtml(state.topic)}</strong></p>
                <h4 style="margin-top:16px">Key Themes Identified</h4>
                ${themesHTML}
                <div style="margin-top:12px;padding:10px;background:var(--bg-3);border-radius:8px;font-size:0.82rem">
                    <strong>Configuration:</strong> ${escHtml(state.essayType.charAt(0).toUpperCase() + state.essayType.slice(1))} essay, ${state.paras} paragraphs (including intro & conclusion), ${state.useHeadings ? 'with headings' : 'no headings'}, ${state.includeURLs ? 'with URLs/DOIs' : 'no URLs/DOIs'}
                </div>
            </div>
            <div class="action-row" style="margin-top:16px">
                <button class="btn-outline" onclick="showConfigurationModal()"><i class="fas fa-edit"></i> Edit Configuration</button>
                <button class="btn-primary" onclick="findCitations()"><i class="fas fa-arrow-right"></i> Proceed to Citations</button>
            </div>`);

        scrollToBottom();

    } catch (e) {
        removeThinking(thinkingId);
        appendMsg('ai', `<p style="color:var(--danger)"><i class="fas fa-exclamation-triangle"></i> Analysis failed: ${escHtml(e.message)}</p>`);
        setUIBlocked(false);
    }
}

async function findCitations() {
    setActiveStep(2);
    setStatus('Finding academic sources…');
    setProgress(15);

    const thinkingId = 'think-sources';
    appendMsg('thinking', '<i class="fas fa-spinner fa-spin"></i> Searching for high-quality academic sources…', thinkingId);

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        try {
            const sourcesPrompt = `Find EXACTLY ${state.refs} highly relevant academic sources for this essay on: ${state.topic}

Key themes to cover:
${state.keyThemes.map(t => '- ' + t).join('\n')}

CRITICAL REQUIREMENTS:
- You MUST return EXACTLY ${state.refs} sources — no more, no fewer. Count carefully before responding.
- Return ONLY a valid JSON array with exactly ${state.refs} items. No markdown, no explanation, no code blocks.

Return exactly this format (${state.refs} items):
[
  {
    "author": "Last, F. M.",
    "year": "2023",
    "title": "Full article or book title",
    "type": "journal" or "book" or "report" or "chapter",
    "journal": "Journal Name in Title Case (for journal articles)",
    "volume": "45",
    "issue": "3",
    "pages": "112-134",
    "publisher": "Publisher Name (for books/reports)",
    "relevance": "Brief note on relevance",
    "url": "Direct URL or Google Scholar link"
  }
]

Field rules:
- type: "journal" for journal articles, "book" for monographs, "report" for institutional reports, "chapter" for book chapters
- journal: the real journal name — only for type "journal" or "chapter"
- volume + issue + pages: the REAL volume, issue and page numbers for this specific article — only for type "journal"
- publisher: the real publisher — only for type "book" or "report" or "chapter"
- If you are not certain of a field for a specific source, omit that field entirely rather than guessing
- author: use "Last, F. M." format; for multiple authors separate with " & "
- Sources must be recent (2018-2024), diverse, and highly credible
- Return ONLY the JSON array with EXACTLY ${state.refs} items, nothing else`;

            const resp = await callAI(sourcesPrompt);
            let parsedSources = safeJSON(resp, true);

            // If AI returned fewer sources than requested, top up with a second call
            if (parsedSources.length < state.refs) {
                const missing = state.refs - parsedSources.length;
                const existingTitles = parsedSources.map(s => s.title).join('; ');
                const topUpPrompt = `I need exactly ${missing} MORE academic sources for an essay on: ${state.topic}

Do NOT duplicate any of these already-found sources:
${existingTitles}

Return EXACTLY ${missing} new sources as a JSON array with exactly ${missing} items:
[{"author":"Last, F. M.","year":"2022","title":"...","type":"journal","journal":"...","volume":"...","issue":"...","pages":"...","relevance":"...","url":"..."}]

Return ONLY the JSON array, nothing else.`;
                try {
                    const topUpResp = await callAI(topUpPrompt);
                    const extra = safeJSON(topUpResp, true);
                    parsedSources = parsedSources.concat(extra);
                } catch (topUpErr) {
                    console.warn('Top-up sources fetch failed:', topUpErr.message);
                }
            }

            // Ensure exact count
            state.sources = parsedSources.slice(0, state.refs);

            removeThinking(thinkingId);

            let sourcesHTML = '<div class="sources-grid">';
            state.sources.forEach((s, i) => {
                const url = s.url || `https://scholar.google.com/scholar?q=${encodeURIComponent(s.title + ' ' + s.author)}`;
                sourcesHTML += `
                    <a href="${escHtml(url)}" target="_blank" class="source-card clickable-source" title="Click to access this source">
                        <div class="source-num">${i + 1}</div>
                        <div class="source-details">
                            <p class="source-author">${escHtml(s.author)} (${escHtml(s.year)})</p>
                            <p class="source-title">${escHtml(s.title)}</p>
                            <p class="source-journal">${escHtml(s.journal)}</p>
                            ${s.relevance ? `<p class="source-relevance">${escHtml(s.relevance)}</p>` : ''}
                            <p class="source-link"><i class="fas fa-external-link-alt"></i> Click to access</p>
                        </div>
                    </a>`;
            });
            sourcesHTML += '</div>';

            appendMsg('ai', `
                <h3><i class="fas fa-books"></i> ${state.sources.length} Sources Found</h3>
                <p style="font-size:0.85rem;color:var(--text-2);margin-bottom:12px"><i class="fas fa-info-circle"></i> Click on any source to access it directly</p>
                ${sourcesHTML}
                <div class="action-row" style="margin-top:16px">
                    <button class="btn-outline" onclick="showSourcesModal()"><i class="fas fa-plus"></i> Add More Sources</button>
                    <button class="btn-primary" onclick="createPlan()"><i class="fas fa-arrow-right"></i> Proceed to Planning</button>
                </div>`);

            scrollToBottom();
            return;

        } catch (e) {
            attempts++;
            console.error(`Source search attempt ${attempts} failed:`, e.message);

            if (attempts < maxAttempts) {
                const thinkingEl = document.getElementById(thinkingId);
                if (thinkingEl) {
                    thinkingEl.querySelector('.msg-content').innerHTML =
                        `<i class="fas fa-spinner fa-spin"></i> Retrying source search (attempt ${attempts + 1}/${maxAttempts})...`;
                }
                await sleep(1000);
            } else {
                removeThinking(thinkingId);
                appendMsg('ai', `
                    <p style="color:var(--danger)"><i class="fas fa-exclamation-triangle"></i> Source search failed after ${maxAttempts} attempts: ${escHtml(e.message)}</p>
                    <p style="font-size:0.85rem;margin-top:8px">This is usually a temporary issue. Please try again, or you can:</p>
                    <div class="action-row" style="margin-top:12px">
                        <button class="btn-outline" onclick="findCitations()"><i class="fas fa-redo"></i> Try Again</button>
                        <button class="btn-outline" onclick="showSourcesModal()"><i class="fas fa-upload"></i> Upload Your Own Sources</button>
                    </div>
                `);
                setUIBlocked(false);
            }
        }
    }
}

async function createPlan() {
    setActiveStep(3);
    setStatus('Creating comprehensive essay plan…');
    setProgress(30);

    const thinkingId = 'think-plan';
    appendMsg('thinking', '<i class="fas fa-spinner fa-spin"></i> Building detailed paragraph-by-paragraph plan with comprehensive coverage…', thinkingId);

    try {
        let essayTypeGuidance = '';
        if (state.essayType === 'argumentative') {
            essayTypeGuidance = `
CRITICAL ESSAY TYPE GUIDANCE - ARGUMENTATIVE (BODY PARAGRAPHS ONLY):
- Introduction and Conclusion should be written as standard excellent intro/conclusion (NOT argumentative style)
- ONLY body paragraphs should use the argumentative approach

For BODY paragraphs:
- Compare and contrast different authors' perspectives on the topic
- Present multiple viewpoints from your sources
- Analyze agreements and disagreements between scholars
- Present your own analysis at the end, synthesizing the different positions
- Example structure: "Smith (2020) argues X, while Johnson (2021) contends Y. However, Brown (2022) offers a middle ground... Based on these perspectives, it becomes clear that..."

For INTRODUCTION: Write as an excellent standard introduction (engaging hook, background, clear thesis)
For CONCLUSION: Write as an excellent standard conclusion (synthesize main points, broader implications, strong closing)`;
        } else if (state.essayType === 'analytical') {
            essayTypeGuidance = `
ESSAY TYPE GUIDANCE - ANALYTICAL:
Each body paragraph must:
- Break down complex concepts into components
- Examine causes, effects, and relationships
- Provide deep analysis with supporting evidence
- Connect ideas logically`;
        } else if (state.essayType === 'expository') {
            essayTypeGuidance = `
ESSAY TYPE GUIDANCE - EXPOSITORY:
Each body paragraph must:
- Explain and inform about the topic objectively
- Present facts and evidence clearly
- Use examples to illustrate points
- Maintain neutral, informative tone`;
        }

        const planPrompt = `Create a DETAILED paragraph-by-paragraph plan for a ${state.paras}-paragraph essay on: ${state.topic}

${essayTypeGuidance}

Key themes to cover:
${state.keyThemes.map(t => '- ' + t).join('\n')}

Available sources:
${state.sources.map((s, i) => `[${i + 1}] ${s.author} (${s.year}): ${s.title}`).join('\n')}

Requirements:
- Total paragraphs: ${state.paras} (including 1 introduction + ${state.paras - 2} body + 1 conclusion)
- Each body paragraph should cover ALL important aspects of its main point
- Be COMPREHENSIVE - don't leave gaps in coverage
- For body paragraphs, specify:
  * Main heading (engaging and specific)
  * Detailed purpose (what will be covered and how)
  * Specific sources to cite (by number)
  * Target word count (intro=95, body=120, conclusion=95)
  * Key points to cover (list ALL major points that should be included)

Return JSON array (${state.paras} items):
[
  {
    "section": "Introduction",
    "heading": "Introduction",
    "purpose": "Detailed description of what the introduction will cover: hook, background, thesis statement with main arguments",
    "sources": [],
    "words": 95,
    "keyPoints": ["Engaging hook", "Background context", "Clear thesis with 3 main points"]
  },
  {
    "section": "Body",
    "heading": "Specific descriptive heading",
    "purpose": "Comprehensive description: what this paragraph covers, how it relates to thesis, what arguments/analysis will be presented, how sources will be used",
    "sources": [1, 3, 5],
    "words": 120,
    "keyPoints": ["First major point to cover", "Second important aspect", "Third key element", "How these connect"]
  },
  ...
  {
    "section": "Conclusion",
    "heading": "Conclusion",
    "purpose": "Detailed summary: restate thesis, synthesize main arguments, broader implications, final thoughts",
    "sources": [],
    "words": 95,
    "keyPoints": ["Restate thesis", "Summarize key findings", "Broader significance", "Closing insight"]
  }
]

Make the plan THOROUGH and DETAILED so the user can understand exactly what will be covered.`;

        const resp = await callAI(planPrompt);
        state.plan = safeJSON(resp);

        removeThinking(thinkingId);

        let planHTML = '<div class="plan-container">';
        state.plan.forEach((item, i) => {
            const isIntro = item.section === 'Introduction';
            const isConc = item.section === 'Conclusion';
            const sectionClass = isIntro ? 'plan-intro' : isConc ? 'plan-conclusion' : 'plan-body';

            let keyPointsHTML = '';
            if (item.keyPoints && item.keyPoints.length > 0) {
                keyPointsHTML = '<div class="plan-key-points"><strong>Key Points:</strong><ul>';
                item.keyPoints.forEach(kp => {
                    keyPointsHTML += `<li>${escHtml(kp)}</li>`;
                });
                keyPointsHTML += '</ul></div>';
            }

            let sourcesHTML = '';
            if (item.sources && item.sources.length > 0) {
                sourcesHTML = '<div class="plan-sources"><strong>Sources:</strong> ';
                sourcesHTML += item.sources.map(idx => {
                    const src = state.sources[idx - 1];
                    return src ? `${escHtml(src.author)} (${escHtml(src.year)})` : `Source ${idx}`;
                }).join(', ');
                sourcesHTML += '</div>';
            }

            planHTML += `
                <div class="plan-card ${sectionClass} editable-plan" id="plan-${i}" data-index="${i}">
                    <div class="plan-header">
                        <span class="plan-num">${i + 1}</span>
                        <div class="plan-info">
                            <h4 class="plan-heading-display" id="heading-display-${i}">${escHtml(item.heading)}</h4>
                            <input type="text" class="plan-heading-edit" id="heading-edit-${i}" value="${escHtml(item.heading)}" style="display:none">
                            <span class="plan-meta">
                                <span class="word-count-display" id="words-display-${i}">${item.words} words</span>
                                <input type="number" class="word-count-edit" id="words-edit-${i}" value="${item.words}" min="50" max="1000" style="display:none">
                            </span>
                        </div>
                        <button class="btn-edit-plan" id="edit-btn-${i}" onclick="event.stopPropagation(); toggleEditPlan(${i})" title="Edit paragraph">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                    <div class="plan-body">
                        <p class="plan-purpose-display" id="purpose-display-${i}">${escHtml(item.purpose)}</p>
                        <textarea class="plan-purpose-edit" id="purpose-edit-${i}" style="display:none">${escHtml(item.purpose)}</textarea>
                        ${keyPointsHTML}
                        ${sourcesHTML}
                        <div class="plan-edit-actions" id="edit-actions-${i}" style="display:none;margin-top:12px">
                            <button class="btn-small btn-primary" onclick="event.stopPropagation(); savePlanEdit(${i})"><i class="fas fa-check"></i> Save</button>
                            <button class="btn-small btn-outline" onclick="event.stopPropagation(); cancelPlanEdit(${i})"><i class="fas fa-times"></i> Cancel</button>
                        </div>
                    </div>
                </div>`;
        });
        planHTML += '</div>';

        appendMsg('ai', `
            <h3><i class="fas fa-list-check"></i> Comprehensive Essay Plan</h3>
            <p>Detailed breakdown of all ${state.plan.length} paragraphs. <strong>Click anywhere on a paragraph to edit it.</strong></p>
            ${planHTML}
            <div class="action-row" style="margin-top:20px">
                <button class="btn-outline" onclick="showAddParaModal()"><i class="fas fa-plus"></i> Add Paragraph</button>
                <button class="btn-primary" onclick="showEnglishStyleModal()"><i class="fas fa-check"></i> Approve & Continue</button>
            </div>`);

        setTimeout(() => {
            document.querySelectorAll('.editable-plan').forEach(card => {
                card.addEventListener('click', function(e) {
                    if (e.target.tagName === 'INPUT' ||
                        e.target.tagName === 'TEXTAREA' ||
                        e.target.tagName === 'BUTTON' ||
                        e.target.closest('button') ||
                        this.classList.contains('editing')) {
                        return;
                    }
                    const index = parseInt(this.dataset.index);
                    toggleEditPlan(index);
                });
            });
        }, 100);

        scrollToBottom();
        saveAssignment();

    } catch (e) {
        removeThinking(thinkingId);
        const isQuotaError = e.message && (e.message.includes('quota') || e.message.includes('exhausted'));

        if (isQuotaError) {
            appendMsg('ai', `
                <p style="color:var(--danger)"><i class="fas fa-exclamation-triangle"></i> API Rate Limit Reached</p>
                <p style="font-size:0.85rem;margin-top:8px">We've temporarily hit the API rate limit. This usually resolves within a few minutes. You can:</p>
                <div class="action-row" style="margin-top:12px">
                    <button class="btn-primary" onclick="createPlan()"><i class="fas fa-redo"></i> Try Again</button>
                    <button class="btn-outline" onclick="location.reload()"><i class="fas fa-refresh"></i> Refresh Page</button>
                </div>
                <p style="font-size:0.75rem;margin-top:8px;color:var(--text-3)">Note: Your work is automatically saved and will be restored when you reload.</p>
            `);
        } else {
            appendMsg('ai', `
                <p style="color:var(--danger)"><i class="fas fa-exclamation-triangle"></i> Planning failed: ${escHtml(e.message)}</p>
                <div class="action-row" style="margin-top:12px">
                    <button class="btn-outline" onclick="createPlan()"><i class="fas fa-redo"></i> Try Again</button>
                </div>
            `);
        }
        setUIBlocked(false);
    }
}

async function draftAllParagraphs() {
    setActiveStep(4);
    setProgress(40);
    setParaCounter(1, state.plan.length);

    for (let i = 0; i < state.plan.length; i++) {
        const planItem = state.plan[i];
        const heading = planItem.heading;
        const purpose = planItem.purpose;
        const targetWords = planItem.words || 200;
        const isIntro = planItem.section === 'Introduction';
        const isConc = planItem.section === 'Conclusion';

        setParaCounter(i + 1, state.plan.length);
        const planCard = document.getElementById('plan-' + i);
        if (planCard) {
            planCard.classList.add('active-plan');
        }

        const paraHTML = `
            <div class="para-card drafting" id="card-${i}">
                <div class="para-header">
                    <h4>${escHtml(heading)}</h4>
                    <span class="badge drafting" id="badge-${i}">✦ Drafting…</span>
                </div>
                <div class="para-content">
                    <div class="text-block">
                        <p class="cursor-blink" id="ai-text-${i}"></p>
                    </div>
                </div>
            </div>`;

        appendMsg('ai', paraHTML);
        setStatus(`Drafting: ${heading}…`);
        scrollToBottom();

        const progress = 40 + Math.floor((i / state.plan.length) * 50);
        setProgress(progress);

        await sleep(300);

        let writingStyleInstructions = '';
        if (state.essayType === 'argumentative' && !isIntro && !isConc) {
            writingStyleInstructions = `
WRITING STYLE - ARGUMENTATIVE (BODY PARAGRAPH ONLY):
- Compare different authors' perspectives throughout the paragraph
- Use phrases like: "While X argues..., Y contends...", "In contrast to...", "Building on this perspective..."
- Present multiple viewpoints before your analysis
- End with your synthesis of these different positions
- Example: "Smith (2020) suggests that climate action requires immediate policy change. However, Johnson (2021) argues for gradual market-based solutions. Brown (2022) offers a middle ground, proposing hybrid approaches. Examining these perspectives reveals that..."`;
        }

        let englishStyleInstructions = '';
        if (state.englishStyle === 'simple') {
            englishStyleInstructions = `
ENGLISH STYLE - SIMPLE (Secondary School Level):
- Write clearly and directly - explain concepts as you would to a secondary school student
- Use straightforward vocabulary and sentence structures
- RETAIN all technical nouns and terminology relevant to the topic (e.g., "photosynthesis", "democracy", "capitalism")
- AVOID unnecessary adjectives and adverbs - use them only when essential for accuracy
- NO flowery or ornamental language
- Use active voice when possible: "Researchers found" NOT "It was found by researchers"
- Keep sentences clear and readable
- Examples:
  * GOOD: "Climate change increases storm frequency."
  * BAD: "Climate change demonstrates a remarkable propensity to engender significantly increased meteorological disturbances."
  * GOOD: "The study presents three findings."
  * BAD: "The research magnificently illuminates a triumvirate of profoundly salient discoveries."`;
        } else if (state.englishStyle === 'common') {
            englishStyleInstructions = `
ENGLISH STYLE - STANDARD (Normal Conversational):
- Write in normal, everyday English that people actually use in conversation
- Keep technical terminology where relevant to the topic
- AVOID unnecessary adjectives and adverbs - use them sparingly and only when truly needed
- NO bombastic or overly complex language
- NO convoluted phrasing that obscures meaning
- Be direct and straightforward - say what you mean clearly
- Use natural sentence flow without artificial complexity`;
        } else {
            englishStyleInstructions = `
ENGLISH STYLE - ACADEMIC (University Level):
- Use university-level academic vocabulary without being bombastic
- Write clearly and directly - avoid convoluted phrasing that's hard to understand
- PRESERVE all technical terms and key concepts
- AVOID excessive adjectives and adverbs - use them only when necessary for precision
- NO flowery language or unnecessary embellishment
- Maintain academic tone while prioritizing clarity and directness`;
        }

        let sourcesInfo = '';
        if (planItem.sources && planItem.sources.length > 0) {
            sourcesInfo = '\n\nSources to cite in this paragraph:\n';
            planItem.sources.forEach(idx => {
                const src = state.sources[idx - 1];
                if (src) {
                    sourcesInfo += `[${idx}] ${src.author} (${src.year}): ${src.title}\n`;
                }
            });
        }

        let draftPrompt = '';

        if (isIntro) {
            draftPrompt = `Write the introduction paragraph for this essay: ${state.topic}

Purpose: ${purpose}

CRITICAL STRUCTURE REQUIREMENTS:
1. Write EXACTLY ONE SINGLE PARAGRAPH - do not split into multiple paragraphs
2. Do not use line breaks or paragraph breaks within your response
3. Output must be ONE continuous flowing paragraph

CRITICAL CONTENT RULES:
1. NO first-person perspective (avoid "I will", "I argue", "my paper", etc.)
2. ABSOLUTELY NO meta-statements like "This essay will discuss...", "This paper examines...", "In this essay...", "This study explores...", "The following essay...", or ANY variation that announces what the essay will do
3. NEVER use em-dashes (—) anywhere - use commas, periods, or parentheses instead
4. Start with an engaging hook that captures attention
5. Provide necessary background/context with citations where appropriate
6. End with a clear, strong thesis statement
7. Write as a confident scholar presenting research, not announcing what you will do
8. CITATIONS: Use APA format (Author, Year) for any factual claims. Place citations at end of sentences: (Smith, 2022)
9. CITATION VALIDATION: Only cite sources from the provided sources list. Every citation must match a source from the list.
10. Cite frequently - background information and context should be supported by sources

${writingStyleInstructions}
${englishStyleInstructions}

${sourcesInfo}

WORD COUNT: Write EXACTLY ${targetWords} words (±10 words). Count carefully — this is a strict requirement. Do not write fewer than ${Math.round(targetWords * 0.92)} words or more than ${Math.round(targetWords * 1.08)} words.

Write naturally and engagingly as ONE SINGLE CONTINUOUS PARAGRAPH. Include APA in-text citations where appropriate.`;

        } else if (isConc) {
            draftPrompt = `Write the conclusion paragraph for this essay: ${state.topic}

Purpose: ${purpose}

Main points covered in the essay:
${state.plan.filter(p => p.section === 'Body').map(p => '- ' + p.heading).join('\n')}

CRITICAL STRUCTURE REQUIREMENTS:
1. Write EXACTLY ONE SINGLE PARAGRAPH - do not split into multiple paragraphs
2. Do not use line breaks or paragraph breaks within your response
3. Output must be ONE continuous flowing paragraph

CRITICAL CONTENT RULES:
1. Synthesize the main arguments (don't just repeat them)
2. Reinforce the thesis in a fresh way
3. Discuss broader implications or significance
4. End with a strong closing thought
5. NO first-person perspective
6. NO new evidence or citations in conclusion
7. ABSOLUTELY NO meta-statements like "This essay has shown...", "In conclusion, this paper...", "This study has examined...", or ANY variation that refers to the essay itself
8. NEVER use em-dashes (—) anywhere - use commas, periods, or parentheses instead

${englishStyleInstructions}

WORD COUNT: Write EXACTLY ${targetWords} words (±10 words). Count carefully — this is a strict requirement. Do not write fewer than ${Math.round(targetWords * 0.92)} words or more than ${Math.round(targetWords * 1.08)} words.

Write as ONE SINGLE CONTINUOUS PARAGRAPH with strong impact.`;

        } else {
            draftPrompt = `Write a body paragraph for this essay: ${state.topic}

Heading: ${heading}
Purpose: ${purpose}

CRITICAL STRUCTURE REQUIREMENTS:
1. Write EXACTLY ONE SINGLE PARAGRAPH - do not split into multiple paragraphs
2. Do not use line breaks or paragraph breaks within your response
3. Output must be ONE continuous flowing paragraph

${writingStyleInstructions}
${englishStyleInstructions}

CRITICAL CITATION REQUIREMENTS (APA 7th Edition):
1. MANDATORY: Every factual claim, statistic, theory, or assertion MUST be cited
2. PREFERRED FORMAT: Place citations at the END of sentences: (Author, Year)
   Example: "Climate change significantly impacts biodiversity (Smith, 2022)."
3. ALTERNATIVE FORMAT (use sparingly): Narrative citation with author integrated: Author (Year) states/argues/found that...
   Example: "Smith (2022) argues that climate change impacts biodiversity."
4. For multiple sources on same point: (Author1, Year1; Author2, Year2)
5. For 3+ authors, use et al.: (Smith et al., 2022)
6. For page-specific quotes: (Author, Year, p. 45) or (Author, Year, pp. 45-47)
7. CITATION DISTRIBUTION: Use DIFFERENT sources throughout the paragraph - aim for variety
8. CITATION VALIDATION: Only cite sources from the provided sources list above
9. NO DUPLICATE CITATIONS: Never cite the same (Author, Year) more than once within a single paragraph. Each citation must appear only once per paragraph — do not repeat it anywhere in the same paragraph.
10. CITATION LIMIT FOR SHORT PARAGRAPHS: For paragraphs of 120 words or fewer, use a maximum of 3 different in-text citations total. Do not exceed 3 citations in a short paragraph.

CRITICAL: You MUST cite information from the sources provided above. Every source listed should be cited at least once. Do not invent citations - only use the sources provided.

PARAGRAPH STRUCTURE REQUIREMENTS:
1. Start with a clear MAIN POINT that directly addresses the paragraph's purpose
2. Follow with SUPPORTING POINTS that develop and explain the main point
3. Include SPECIFIC EXAMPLES that are:
   - Relevant to the topic and question
   - Well-known globally or widely recognized in the field
   - Concrete and detailed (not vague or generic)
   - Appropriate for the essay type and paragraph word count
4. Cover EVERYTHING related to the main point - be comprehensive based on:
   - The kind of essay being written
   - The number of words allocated for this paragraph
   - The specific requirements of the question
5. Be AS SPECIFIC AS POSSIBLE - provide concrete details, data, or examples rather than general statements

TRANSITIONAL WORDS AND FLOW:
1. DO NOT constantly repeat transitional words across paragraphs
2. AVOID transitional words within paragraphs (between sentences)
3. Let ideas flow naturally without forced transitions
4. NEVER use em dashes (—) ANYWHERE IN THE ESSAY - use commas, periods, or parentheses instead

APA 7TH EDITION FORMATTING:
- In-text citations: (Author, Year) at end of sentence or Author (Year) integrated into sentence
- Multiple authors (2): (Smith & Jones, 2022)
- Multiple authors (3+): (Smith et al., 2022)
- Multiple sources: (Smith, 2022; Jones, 2023)
- Direct quotes: (Smith, 2022, p. 45) or (Smith, 2022, pp. 45-47)
- When mentioning book/journal titles in text, use italics: *Title of Work*
- For article titles in text, use quotation marks: "Article title here"
- Every claim needs a citation - cite frequently and from the provided sources only

IMPORTANT: Prioritize end-of-sentence citations like (Smith, 2022) over narrative citations. Ensure ALL citations match sources from the list provided above.

${sourcesInfo}

WORD COUNT: Write EXACTLY ${targetWords} words (±10 words). Count carefully — this is a strict requirement. Do not write fewer than ${Math.round(targetWords * 0.92)} words or more than ${Math.round(targetWords * 1.08)} words.

Write as ONE SINGLE CONTINUOUS PARAGRAPH with proper citations throughout.`;
        }

        try {
            const draftResp = await callAI(draftPrompt);
            let draft = draftResp.trim();

            draft = draft.replace(/\n\n+/g, ' ').replace(/\n/g, ' ');
            draft = draft.replace(/\s*—\s*/g, ', ');
            draft = draft.replace(/This\s+(essay|paper|study|article|work|research)\s+(will|has|examines?|explores?|discusses?|investigates?|analyzes?|focuses?\s+on|looks\s+at|considers?|addresses?)[^.!?]*[.!?]\s*/gi, '');
            draft = draft.replace(/In\s+this\s+(essay|paper|study|article|work|research)[^.!?]*[.!?]\s*/gi, '');
            draft = draft.replace(/The\s+following\s+(essay|paper|study|article|work|research)[^.!?]*[.!?]\s*/gi, '');
            draft = draft.replace(/In\s+conclusion,\s+this\s+(essay|paper|study|article|work|research)[^.!?]*[.!?]\s*/gi, 'In conclusion, ');
            draft = draft.replace(/\s{2,}/g, ' ').trim();

            // Word count enforcement: retry if too far from target
            const countWords = str => str.trim().split(/\s+/).filter(w => w.length > 0).length;
            const draftWordCount = countWords(draft);
            const tolerance = Math.round(targetWords * 0.15); // 15% tolerance
            const minWords = targetWords - tolerance;
            const maxWords = targetWords + tolerance;

            if (draftWordCount < minWords || draftWordCount > maxWords) {
                const direction = draftWordCount < minWords ? 'expand' : 'shorten';
                const wordDiff = draftWordCount < minWords
                    ? (targetWords - draftWordCount)
                    : (draftWordCount - targetWords);
                const correctionPrompt = `The following paragraph needs to be ${direction}ed by approximately ${wordDiff} words to reach the target of EXACTLY ${targetWords} words (currently ${draftWordCount} words).

Current paragraph:
${draft}

STRICT REQUIREMENTS:
- Output EXACTLY ONE SINGLE CONTINUOUS PARAGRAPH (no line breaks, no splits)
- Target word count: EXACTLY ${targetWords} words (±10 words). Do NOT exceed ${targetWords + 10} or go below ${targetWords - 10} words.
- Preserve all existing citations (Author, Year) exactly as they appear
- Preserve the meaning, tone, and all key points
- Do NOT add meta-statements or em-dashes
- Output ONLY the rewritten paragraph, nothing else`;

                try {
                    const corrResp = await callAI(correctionPrompt);
                    let corrDraft = corrResp.trim()
                        .replace(/\n\n+/g, ' ').replace(/\n/g, ' ')
                        .replace(/\s*—\s*/g, ', ')
                        .replace(/\s{2,}/g, ' ').trim();
                    const corrWordCount = countWords(corrDraft);
                    // Accept the correction only if it moved closer to the target
                    if (Math.abs(corrWordCount - targetWords) < Math.abs(draftWordCount - targetWords)) {
                        draft = corrDraft;
                    }
                } catch (corrErr) {
                    console.warn(`Word count correction failed for paragraph ${i}:`, corrErr.message);
                }
            }

            state.drafts[i] = draft;

            const textEl = document.getElementById('ai-text-' + i);
            if (textEl) {
                textEl.classList.remove('cursor-blink');
                await streamText(textEl, draft);
            }

            const badge = document.getElementById('badge-' + i);
            if (badge) {
                badge.textContent = '✓ Complete';
                badge.classList.remove('drafting');
                badge.classList.add('done');
            }
            const card = document.getElementById('card-' + i);
            if (card) {
                card.classList.remove('drafting');
                card.classList.add('done');
            }
            if (planCard) {
                planCard.classList.remove('active-plan');
                planCard.classList.add('done-plan');
            }

            scrollToBottom();
            saveAssignment();

        } catch (e) {
            appendMsg('ai', `<p style="color:var(--danger)">Drafting failed for ${heading}: ${escHtml(e.message)}</p>`);
            break;
        }
    }

    await generateReferences();

    setProgress(100);
    setStatus('Complete!');
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) { exportBtn.disabled = false; exportBtn.classList.add('ready'); }
    setUIBlocked(false);
}

async function generateReferences() {
    setStatus('Generating references…');

    try {
        // Build APA 7th references deterministically from stored source data — no guessing
        const sorted = [...state.sources].sort((a, b) =>
            (a.author || '').localeCompare(b.author || '')
        );

        const refLines = sorted.map(s => buildAPAReference(s, state.includeURLs));

        const references = refLines.join('\n');
        state.references = references;

        appendMsg('ai', `
            <h3 class="success-heading"><i class="fas fa-check-circle"></i> Essay Complete!</h3>
            <p>Your essay has been fully drafted with ${state.plan.length} paragraphs and proper APA citations.</p>
            <div class="references-block" style="margin-top:16px;padding:14px;background:var(--bg-2);border-radius:var(--radius);border:1px solid var(--border)">
                <h4 style="margin-bottom:10px;text-align:left;">References</h4>
                <div class="references-content">${refLines.map(l => `<p class="ref-line">${l}</p>`).join('')}</div>
            </div>
        `);

        saveAssignment();
        scrollToBottom();

    } catch (e) {
        appendMsg('ai', `<p style="color:var(--danger)">Reference generation failed: ${escHtml(e.message)}</p>`);
    }
}

/**
 * Build a single APA 7th edition reference from a source object.
 * Uses only fields actually stored on the source — never invents data.
 */
function buildAPAReference(s, includeURLs = false) {
    const author = s.author || 'Unknown Author';
    const year   = s.year   || 'n.d.';
    const title  = s.title  || 'Untitled';
    const type   = (s.type  || 'journal').toLowerCase();

    let ref = '';

    if (type === 'book') {
        // Book: Author, A. A. (Year). <i>Title in sentence case</i>. Publisher.
        const pub = s.publisher ? ` ${s.publisher}.` : '';
        ref = `${author} (${year}). <i>${title}</i>.${pub}`;

    } else if (type === 'chapter') {
        // Chapter: Author (Year). Chapter title. In E. Editor (Ed.), <i>Book Title</i> (pp. X–Y). Publisher.
        const journal  = s.journal   ? ` <i>${s.journal}</i>` : '';
        const pages    = s.pages     ? ` (pp. ${s.pages}).`   : '.';
        const pub      = s.publisher ? ` ${s.publisher}.`     : '';
        ref = `${author} (${year}). ${title}. In${journal}${pages}${pub}`;

    } else if (type === 'report') {
        // Report: Author (Year). <i>Title</i>. Organisation.
        const pub = s.publisher ? ` ${s.publisher}.` : '';
        ref = `${author} (${year}). <i>${title}</i>.${pub}`;

    } else {
        // Journal article (default): Author (Year). Title. <i>Journal, Vol</i>(Issue), pages.
        const journal = s.journal || '';
        let citation  = '';

        if (journal) {
            const vol   = s.volume ? `, ${s.volume}` : '';
            const issue = s.issue  ? `(${s.issue})`  : '';
            const pages = s.pages  ? `, ${s.pages}.` : '.';
            citation = ` <i>${journal}${vol}</i>${issue}${pages}`;
        } else {
            citation = '.';
        }

        ref = `${author} (${year}). ${title}.${citation}`;
    }

    // Append DOI/URL only if user opted in and we have one
    if (includeURLs && s.url && !s.url.includes('scholar.google.com')) {
        ref += ` ${s.url}`;
    }

    return ref;
}

/* =========================================================
   PLAN EDITING — CLICK-TO-EDIT WITH WORD COUNT APPLY-TO-ALL
   ========================================================= */
function toggleEditPlan(index) {
    const card = document.getElementById('plan-' + index);
    if (!card) return;

    const headingDisplay = document.getElementById('heading-display-' + index);
    const headingEdit = document.getElementById('heading-edit-' + index);
    const wordsDisplay = document.getElementById('words-display-' + index);
    const wordsEdit = document.getElementById('words-edit-' + index);
    const purposeDisplay = document.getElementById('purpose-display-' + index);
    const purposeEdit = document.getElementById('purpose-edit-' + index);
    const editActions = document.getElementById('edit-actions-' + index);
    const editBtn = document.getElementById('edit-btn-' + index);

    const isEditing = card.classList.contains('editing');

    if (isEditing) {
        const oldWords = state.plan[index].words;
        const newWords = parseInt(wordsEdit.value);
        const section = state.plan[index].section;

        state.plan[index].heading = headingEdit.value;
        state.plan[index].purpose = purposeEdit.value;

        function finishEditMode() {
            headingDisplay.textContent = headingEdit.value;
            wordsDisplay.textContent = state.plan[index].words + ' words';
            purposeDisplay.textContent = purposeEdit.value;

            card.classList.remove('editing');
            headingDisplay.style.display = 'block';
            headingEdit.style.display = 'none';
            wordsDisplay.style.display = 'inline';
            wordsEdit.style.display = 'none';
            purposeDisplay.style.display = 'block';
            purposeEdit.style.display = 'none';
            editActions.style.display = 'none';
            editBtn.style.display = 'block';

            saveAssignment();
        }

        if (oldWords !== newWords) {
            if (section === 'Introduction') {
                const conclusionIndex = state.plan.findIndex(p => p.section === 'Conclusion');
                if (conclusionIndex !== -1) {
                    showWordCountModal(
                        `Apply this word count (${newWords}) to the Conclusion as well?`,
                        (apply) => {
                            if (apply) {
                                state.plan[conclusionIndex].words = newWords;
                                const conclusionWordsDisplay = document.getElementById('words-display-' + conclusionIndex);
                                if (conclusionWordsDisplay) {
                                    conclusionWordsDisplay.textContent = newWords + ' words';
                                    const conclusionCard = document.getElementById('plan-' + conclusionIndex);
                                    if (conclusionCard) {
                                        conclusionCard.style.backgroundColor = 'var(--primary-lt)';
                                        setTimeout(() => { conclusionCard.style.backgroundColor = ''; }, 1500);
                                    }
                                }
                            }
                            state.plan[index].words = newWords;
                            finishEditMode();
                        }
                    );
                    return;
                }
            } else if (section === 'Conclusion') {
                const introIndex = state.plan.findIndex(p => p.section === 'Introduction');
                if (introIndex !== -1) {
                    showWordCountModal(
                        `Apply this word count (${newWords}) to the Introduction as well?`,
                        (apply) => {
                            if (apply) {
                                state.plan[introIndex].words = newWords;
                                const introWordsDisplay = document.getElementById('words-display-' + introIndex);
                                if (introWordsDisplay) {
                                    introWordsDisplay.textContent = newWords + ' words';
                                    const introCard = document.getElementById('plan-' + introIndex);
                                    if (introCard) {
                                        introCard.style.backgroundColor = 'var(--primary-lt)';
                                        setTimeout(() => { introCard.style.backgroundColor = ''; }, 1500);
                                    }
                                }
                            }
                            state.plan[index].words = newWords;
                            finishEditMode();
                        }
                    );
                    return;
                }
            } else if (section === 'Body') {
                showWordCountModal(
                    `Apply this word count (${newWords}) to all other body paragraphs?`,
                    (apply) => {
                        if (apply) {
                            state.plan.forEach((p, i) => {
                                if (p.section === 'Body' && i !== index) {
                                    p.words = newWords;
                                    const bodyWordsDisplay = document.getElementById('words-display-' + i);
                                    if (bodyWordsDisplay) {
                                        bodyWordsDisplay.textContent = newWords + ' words';
                                        const bodyCard = document.getElementById('plan-' + i);
                                        if (bodyCard) {
                                            bodyCard.style.backgroundColor = 'var(--primary-lt)';
                                            setTimeout(() => { bodyCard.style.backgroundColor = ''; }, 1500);
                                        }
                                    }
                                }
                            });
                        }
                        state.plan[index].words = newWords;
                        finishEditMode();
                    }
                );
                return;
            }
        }

        state.plan[index].words = newWords;
        finishEditMode();

    } else {
        card.classList.add('editing');
        headingDisplay.style.display = 'none';
        headingEdit.style.display = 'block';
        wordsDisplay.style.display = 'none';
        wordsEdit.style.display = 'inline-block';
        purposeDisplay.style.display = 'none';
        purposeEdit.style.display = 'block';
        editActions.style.display = 'flex';
        editBtn.style.display = 'none';

        setTimeout(() => headingEdit.focus(), 50);
    }
}

function savePlanEdit(index) {
    const card = document.getElementById('plan-' + index);
    const headingEdit = document.getElementById('heading-edit-' + index);
    const wordsEdit = document.getElementById('words-edit-' + index);
    const purposeEdit = document.getElementById('purpose-edit-' + index);
    const headingDisplay = document.getElementById('heading-display-' + index);
    const wordsDisplay = document.getElementById('words-display-' + index);
    const purposeDisplay = document.getElementById('purpose-display-' + index);
    const editActions = document.getElementById('edit-actions-' + index);
    const editBtn = document.getElementById('edit-btn-' + index);

    const oldWords = state.plan[index].words;
    const newWords = parseInt(wordsEdit.value);
    const section = state.plan[index].section;

    state.plan[index].heading = headingEdit.value;
    state.plan[index].purpose = purposeEdit.value;

    function exitEditMode() {
        headingDisplay.textContent = headingEdit.value;
        wordsDisplay.textContent = state.plan[index].words + ' words';
        purposeDisplay.textContent = purposeEdit.value;

        card.classList.remove('editing');
        headingDisplay.style.display = 'block';
        headingEdit.style.display = 'none';
        wordsDisplay.style.display = 'inline';
        wordsEdit.style.display = 'none';
        purposeDisplay.style.display = 'block';
        purposeEdit.style.display = 'none';
        editActions.style.display = 'none';
        editBtn.style.display = 'block';

        saveAssignment();
    }

    if (oldWords !== newWords) {
        if (section === 'Introduction') {
            const conclusionIndex = state.plan.findIndex(p => p.section === 'Conclusion');
            if (conclusionIndex !== -1) {
                showWordCountModal(
                    `Apply this word count (${newWords}) to the Conclusion as well?`,
                    (apply) => {
                        if (apply) {
                            state.plan[conclusionIndex].words = newWords;
                            const conclusionWordsDisplay = document.getElementById('words-display-' + conclusionIndex);
                            if (conclusionWordsDisplay) {
                                conclusionWordsDisplay.textContent = newWords + ' words';
                                const conclusionCard = document.getElementById('plan-' + conclusionIndex);
                                if (conclusionCard) {
                                    conclusionCard.style.backgroundColor = 'var(--primary-lt)';
                                    setTimeout(() => { conclusionCard.style.backgroundColor = ''; }, 1500);
                                }
                            }
                        }
                        state.plan[index].words = newWords;
                        exitEditMode();
                    }
                );
                return;
            }
        } else if (section === 'Conclusion') {
            const introIndex = state.plan.findIndex(p => p.section === 'Introduction');
            if (introIndex !== -1) {
                showWordCountModal(
                    `Apply this word count (${newWords}) to the Introduction as well?`,
                    (apply) => {
                        if (apply) {
                            state.plan[introIndex].words = newWords;
                            const introWordsDisplay = document.getElementById('words-display-' + introIndex);
                            if (introWordsDisplay) {
                                introWordsDisplay.textContent = newWords + ' words';
                                const introCard = document.getElementById('plan-' + introIndex);
                                if (introCard) {
                                    introCard.style.backgroundColor = 'var(--primary-lt)';
                                    setTimeout(() => { introCard.style.backgroundColor = ''; }, 1500);
                                }
                            }
                        }
                        state.plan[index].words = newWords;
                        exitEditMode();
                    }
                );
                return;
            }
        } else if (section === 'Body') {
            showWordCountModal(
                `Apply this word count (${newWords}) to all other body paragraphs?`,
                (apply) => {
                    if (apply) {
                        state.plan.forEach((p, i) => {
                            if (p.section === 'Body' && i !== index) {
                                p.words = newWords;
                                const bodyWordsDisplay = document.getElementById('words-display-' + i);
                                if (bodyWordsDisplay) {
                                    bodyWordsDisplay.textContent = newWords + ' words';
                                    const bodyCard = document.getElementById('plan-' + i);
                                    if (bodyCard) {
                                        bodyCard.style.backgroundColor = 'var(--primary-lt)';
                                        setTimeout(() => { bodyCard.style.backgroundColor = ''; }, 1500);
                                    }
                                }
                            }
                        });
                    }
                    state.plan[index].words = newWords;
                    exitEditMode();
                }
            );
            return;
        }
    }

    state.plan[index].words = newWords;
    exitEditMode();
}

function cancelPlanEdit(index) {
    const card = document.getElementById('plan-' + index);
    const headingEdit = document.getElementById('heading-edit-' + index);
    const wordsEdit = document.getElementById('words-edit-' + index);
    const purposeEdit = document.getElementById('purpose-edit-' + index);
    const headingDisplay = document.getElementById('heading-display-' + index);
    const wordsDisplay = document.getElementById('words-display-' + index);
    const purposeDisplay = document.getElementById('purpose-display-' + index);
    const editActions = document.getElementById('edit-actions-' + index);
    const editBtn = document.getElementById('edit-btn-' + index);

    headingEdit.value = state.plan[index].heading;
    wordsEdit.value = state.plan[index].words;
    purposeEdit.value = state.plan[index].purpose;

    card.classList.remove('editing');
    headingDisplay.style.display = 'block';
    headingEdit.style.display = 'none';
    wordsDisplay.style.display = 'inline';
    wordsEdit.style.display = 'none';
    purposeDisplay.style.display = 'block';
    purposeEdit.style.display = 'none';
    editActions.style.display = 'none';
    editBtn.style.display = 'block';
}

/* =========================================================
   STREAM TEXT (typewriter)
   ========================================================= */
async function streamText(el, text, speed = 15) {
    if (!el) return;
    el.textContent = '';
    const chunk = 3;
    for (let i = 0; i < text.length; i += chunk) {
        el.textContent += text.slice(i, i + chunk);
        if (i % 50 === 0) scrollToBottom();
        await sleep(speed);
    }
}

/* =========================================================
   PREVIEW MODAL
   ========================================================= */
function showPreviewModal() {
    let html = `<h1>${escHtml(state.topic)}</h1>`;

    for (let i = 0; i < state.plan.length; i++) {
        const text = state.drafts[i] || '';
        if (!text) continue;

        if (state.plan[i].section === 'Introduction') {
            html += `<p>${escHtml(text)}</p>`;
        } else if (state.plan[i].section === 'Conclusion') {
            if (state.useHeadings) {
                html += `<h3>Conclusion</h3><p>${escHtml(text)}</p>`;
            } else {
                html += `<p>${escHtml(text)}</p>`;
            }
        } else {
            if (state.useHeadings) {
                html += `<h3>${escHtml(state.plan[i].heading)}</h3><p>${escHtml(text)}</p>`;
            } else {
                html += `<p>${escHtml(text)}</p>`;
            }
        }
    }

    if (state.references) {
        html += `<div style="page-break-before: always;"><h3 style="text-align:left;">References</h3>`;
        state.references.split('\n').filter(l => l.trim()).forEach(l => {
            html += `<p class="ref-entry">${l}</p>`;
        });
        html += `</div>`;
    }
    document.getElementById('paper-view').innerHTML = html;
    document.getElementById('preview-modal').style.display = 'flex';
}

function closePreview() {
    document.getElementById('preview-modal').style.display = 'none';
}

/* =========================================================
   EXPORT TO WORD
   ========================================================= */
function exportToWord() {
    let body = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom><w:DoNotOptimizeForBrowser/></w:WordDocument></xml><![endif]-->
<style>
@page {
    size: 8.5in 11in;
    margin: 1in;
}
body {
    font-family: "Times New Roman", serif;
    font-size: 12pt;
    line-height: 2;
    color: #000;
    text-align: justify;
}
h1 {
    font-family: "Times New Roman", serif;
    text-align: center;
    font-size: 12pt;
    font-weight: bold;
    margin-bottom: 24pt;
    page-break-after: avoid;
}
.meta {
    font-family: "Times New Roman", serif;
    text-align: center;
    font-size: 12pt;
    margin-bottom: 12pt;
}
h3 {
    font-family: "Times New Roman", serif;
    font-size: 12pt;
    font-weight: bold;
    margin-top: 0pt;
    margin-bottom: 0pt;
    text-align: left;
    page-break-after: avoid;
}
p {
    font-family: "Times New Roman", serif;
    font-size: 12pt;
    margin-bottom: 0pt;
    text-indent: 0in;
    text-align: justify;
    page-break-inside: avoid;
}
.ref {
    font-family: "Times New Roman", serif;
    font-size: 12pt;
    text-indent: -0.5in;
    margin-left: 0.5in;
    margin-bottom: 0pt;
    text-align: left;
}
.page-break {
    page-break-before: always;
}
</style>
</head>
<body>`;

    body += `<h1>${escHtml(state.topic || 'Essay')}</h1>`;

    for (let i = 0; i < state.plan.length; i++) {
        const text = state.drafts[i] || '';
        if (!text) continue;
        const esc = escHtml(text);

        if (state.plan[i].section === 'Introduction') {
            body += `<p>${esc}</p>`;
        } else if (state.plan[i].section === 'Conclusion') {
            if (state.useHeadings) {
                body += `<h3>Conclusion</h3><p>${esc}</p>`;
            } else {
                body += `<p>${esc}</p>`;
            }
        } else {
            if (state.useHeadings) {
                body += `<h3>${escHtml(state.plan[i].heading)}</h3><p>${esc}</p>`;
            } else {
                body += `<p>${esc}</p>`;
            }
        }
    }

    if (state.references) {
        body += `<div class="page-break"><h3 style="text-align:left">References</h3>`;
        state.references.split('\n').filter(l => l.trim()).forEach(l => {
            body += `<p class="ref">${l}</p>`;
        });
        body += `</div>`;
    }

    body += `</body></html>`;
    const blob = new Blob(['\ufeff', body], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (state.topic || 'Essay').replace(/[^a-zA-Z0-9 ]/g, '').trim().substring(0, 60) + '.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 3000);
}

/* =========================================================
   DOWNLOAD SOURCES LIST
   ========================================================= */
function downloadSourcesList() {
    if (!state.sources || state.sources.length === 0) {
        return;
    }

    let content = `SOURCES LIST FOR: ${state.topic}\n`;
    content += `Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n`;
    content += `Total Sources: ${state.sources.length}\n`;
    content += `${'='.repeat(80)}\n\n`;

    state.sources.forEach((s, i) => {
        content += `[${i + 1}] ${s.author} (${s.year})\n`;
        content += `    Title: ${s.title}\n`;
        content += `    Published in: ${s.journal}\n`;
        if (s.relevance) {
            content += `    Relevance: ${s.relevance}\n`;
        }
        content += `\n`;
    });

    content += `\n${'='.repeat(80)}\n`;
    content += `APA 7TH EDITION REFERENCE LIST\n`;
    content += `${'='.repeat(80)}\n\n`;

    const sortedSources = [...state.sources].sort((a, b) => {
        const authorA = a.author.split(',')[0].toLowerCase();
        const authorB = b.author.split(',')[0].toLowerCase();
        return authorA.localeCompare(authorB);
    });

    sortedSources.forEach(s => {
        // Strip HTML tags from buildAPAReference output for plain text file
        const ref = buildAPAReference(s, false).replace(/<[^>]+>/g, '');
        content += `${ref}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sources_${(state.topic || 'Essay').replace(/[^a-zA-Z0-9 ]/g, '').trim().substring(0, 40)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 3000);
}

function viewAllSources() {
    if (!state.sources || state.sources.length === 0) {
        return;
    }

    let sourcesHTML = '<div class="sources-grid">';
    state.sources.forEach((s, i) => {
        sourcesHTML += `
            <div class="source-card">
                <div class="source-num">${i + 1}</div>
                <div class="source-details">
                    <p class="source-author">${escHtml(s.author)} (${escHtml(s.year)})</p>
                    <p class="source-title">${escHtml(s.title)}</p>
                    <p class="source-journal">${escHtml(s.journal)}</p>
                    ${s.relevance ? `<p class="source-relevance">${escHtml(s.relevance)}</p>` : ''}
                </div>
            </div>`;
    });
    sourcesHTML += '</div>';

    appendMsg('ai', `
        <h3><i class="fas fa-books"></i> All Current Sources (${state.sources.length} total)</h3>
        ${sourcesHTML}
        <div class="action-row" style="margin-top:16px">
            <button class="btn-outline" onclick="downloadSourcesList()"><i class="fas fa-download"></i> Download Sources</button>
            <button class="btn-outline" onclick="showSourcesModal()"><i class="fas fa-plus"></i> Add More Sources</button>
        </div>`);

    scrollToBottom();
}

/* =========================================================
   SOURCES MODAL
   ========================================================= */
function showSourcesModal() {
    const currentCount = state.sources.length;
    const modalContent = document.getElementById('sources-modal');

    const modalDesc = modalContent.querySelector('.modal-desc');
    if (modalDesc) {
        modalDesc.innerHTML = `You currently have <strong>${currentCount} source${currentCount !== 1 ? 's' : ''}</strong>. Would you like to add your own sources or have AI find additional sources?`;
    }

    document.getElementById('sources-modal').style.display = 'flex';
}

function closeSourcesModal() {
    document.getElementById('sources-modal').style.display = 'none';
    document.getElementById('upload-sources-section').style.display = 'none';
    document.getElementById('ai-sources-section').style.display = 'none';
}

function showUploadSources() {
    document.getElementById('upload-sources-section').style.display = 'block';
    document.getElementById('ai-sources-section').style.display = 'none';

    const sourceFileInput = document.getElementById('source-file-input');
    if (sourceFileInput && !sourceFileInput.dataset.listenerAdded) {
        sourceFileInput.addEventListener('change', handleSourceFilesUpload);
        sourceFileInput.dataset.listenerAdded = 'true';
    }
}

async function handleSourceFilesUpload(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    closeSourcesModal();

    const thinkingId = 'think-upload-sources';
    appendMsg('thinking', `<i class="fas fa-spinner fa-spin"></i> Processing ${files.length} uploaded source file(s)...`, thinkingId);
    setStatus('Extracting source information...');

    try {
        const newSources = [];

        for (let file of files) {
            let text = '';
            if (file.type === 'application/pdf') {
                text = await extractTextFromPDF(file);
            } else {
                text = await extractTextFromDOCX(file);
            }

            const extractPrompt = `Extract bibliographic information from this academic source text:

"""
${text.substring(0, 2000)}
"""

Return JSON:
{
  "author": "Last, F." or "Multiple Authors" if unclear,
  "year": "2023" or best estimate,
  "title": "Extract the title from the document",
  "journal": "Journal name" or "Book" or "Conference Paper" based on content,
  "relevance": "Brief summary of what this source discusses (1-2 sentences)"
}

Be as accurate as possible based on the text provided.`;

            const resp = await callAI(extractPrompt);
            const sourceInfo = safeJSON(resp);
            newSources.push(sourceInfo);
        }

        const startIndex = state.sources.length;
        state.sources = state.sources.concat(newSources);
        state.refs = state.sources.length;

        removeThinking(thinkingId);

        let sourcesHTML = '<div class="sources-grid">';
        newSources.forEach((s, i) => {
            const url = s.url || `https://scholar.google.com/scholar?q=${encodeURIComponent(s.title + ' ' + s.author)}`;
            sourcesHTML += `
                <a href="${escHtml(url)}" target="_blank" class="source-card clickable-source" title="Click to access this source">
                    <div class="source-num">${startIndex + i + 1}</div>
                    <div class="source-details">
                        <p class="source-author">${escHtml(s.author)} (${escHtml(s.year)})</p>
                        <p class="source-title">${escHtml(s.title)}</p>
                        <p class="source-journal">${escHtml(s.journal)}</p>
                        ${s.relevance ? `<p class="source-relevance">${escHtml(s.relevance)}</p>` : ''}
                        <p class="source-link"><i class="fas fa-external-link-alt"></i> Click to access</p>
                    </div>
                </a>`;
        });
        sourcesHTML += '</div>';

        appendMsg('ai', `
            <h3><i class="fas fa-check-circle"></i> ${newSources.length} Source(s) Added from Uploads</h3>
            <p>Total sources: ${state.sources.length}</p>
            ${sourcesHTML}
            <div class="action-row" style="margin-top:16px">
                <button class="btn-outline" onclick="showSourcesModal()"><i class="fas fa-plus"></i> Add More Sources</button>
            </div>`);

        saveAssignment();
        scrollToBottom();
        setStatus('Sources uploaded successfully!');

        e.target.value = '';

    } catch (e) {
        removeThinking(thinkingId);
        appendMsg('ai', `<p style="color:var(--danger)"><i class="fas fa-exclamation-triangle"></i> Source upload failed: ${escHtml(e.message)}</p>`);
    }
}

function showAISourcesInput() {
    document.getElementById('ai-sources-section').style.display = 'block';
    document.getElementById('upload-sources-section').style.display = 'none';
}

async function searchAdditionalSources() {
    const count = parseInt(document.getElementById('ai-sources-count').value);
    if (count < 1 || count > 10) {
        return;
    }

    closeSourcesModal();

    const thinkingId = 'think-add-sources';
    appendMsg('thinking', `<i class="fas fa-spinner fa-spin"></i> Searching for ${count} additional sources...`, thinkingId);
    setStatus(`Finding ${count} more sources...`);

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        try {
            const sourcesPrompt = `Find ${count} additional highly relevant academic sources for this essay on: ${state.topic}

Key themes to cover:
${state.keyThemes.map(t => '- ' + t).join('\n')}

Already have these sources (find DIFFERENT ones):
${state.sources.map(s => `${s.author} (${s.year}): ${s.title}`).join('\n')}

CRITICAL: Return ONLY a valid JSON array. No markdown, no explanation, no code blocks.

Return exactly this format:
[
  {
    "author": "Last, F. M.",
    "year": "2023",
    "title": "Full article or book title",
    "type": "journal" or "book" or "report" or "chapter",
    "journal": "Journal Name in Title Case (for journal articles)",
    "volume": "45",
    "issue": "3",
    "pages": "112-134",
    "publisher": "Publisher Name (for books/reports)",
    "relevance": "Brief note on relevance",
    "url": "Direct URL or Google Scholar link"
  }
]

Field rules:
- type: "journal" for journal articles, "book" for monographs, "report" for institutional reports, "chapter" for book chapters
- journal: real journal name — only for type "journal" or "chapter"
- volume + issue + pages: REAL volume, issue and page numbers — only for type "journal"
- publisher: real publisher — only for type "book" or "report" or "chapter"
- If you are not certain of a field, omit it entirely rather than guessing
- Sources must be recent (2018-2024), NOT duplicates of existing sources
- Return ONLY the JSON array, nothing else`;

            const resp = await callAI(sourcesPrompt);
            const newSources = safeJSON(resp, true);

            const startIndex = state.sources.length;
            state.sources = state.sources.concat(newSources);
            state.refs = state.sources.length;

            removeThinking(thinkingId);

            let sourcesHTML = '<div class="sources-grid">';
            newSources.forEach((s, i) => {
                const url = s.url || `https://scholar.google.com/scholar?q=${encodeURIComponent(s.title + ' ' + s.author)}`;
                sourcesHTML += `
                    <a href="${escHtml(url)}" target="_blank" class="source-card clickable-source" title="Click to access this source">
                        <div class="source-num">${startIndex + i + 1}</div>
                        <div class="source-details">
                            <p class="source-author">${escHtml(s.author)} (${escHtml(s.year)})</p>
                            <p class="source-title">${escHtml(s.title)}</p>
                            <p class="source-journal">${escHtml(s.journal)}</p>
                            ${s.relevance ? `<p class="source-relevance">${escHtml(s.relevance)}</p>` : ''}
                            <p class="source-link"><i class="fas fa-external-link-alt"></i> Click to access</p>
                        </div>
                    </a>`;
            });
            sourcesHTML += '</div>';

            appendMsg('ai', `
                <h3><i class="fas fa-check-circle"></i> ${newSources.length} Additional Sources Found</h3>
                <p>Total sources: ${state.sources.length}</p>
                ${sourcesHTML}
                <div class="action-row" style="margin-top:16px">
                    <button class="btn-outline" onclick="showSourcesModal()"><i class="fas fa-plus"></i> Add More Sources</button>
                </div>`);

            saveAssignment();
            scrollToBottom();
            setStatus('Sources added successfully!');
            return;

        } catch (e) {
            attempts++;
            console.error(`Additional source search attempt ${attempts} failed:`, e.message);

            if (attempts < maxAttempts) {
                const thinkingEl = document.getElementById(thinkingId);
                if (thinkingEl) {
                    thinkingEl.querySelector('.msg-content').innerHTML =
                        `<i class="fas fa-spinner fa-spin"></i> Retrying additional source search (attempt ${attempts + 1}/${maxAttempts})...`;
                }
                await sleep(1000);
            } else {
                removeThinking(thinkingId);
                appendMsg('ai', `
                    <p style="color:var(--danger)"><i class="fas fa-exclamation-triangle"></i> Additional source search failed after ${maxAttempts} attempts: ${escHtml(e.message)}</p>
                    <p style="font-size:0.85rem;margin-top:8px">This is usually a temporary issue. Please try again.</p>
                    <div class="action-row" style="margin-top:12px">
                        <button class="btn-outline" onclick="showSourcesModal()"><i class="fas fa-redo"></i> Try Again</button>
                    </div>
                `);
            }
        }
    }
}

/* =========================================================
   ADD PARAGRAPH MODAL
   ========================================================= */
function showAddParaModal() {
    document.getElementById('add-para-modal').style.display = 'flex';
}

function closeAddParaModal() {
    document.getElementById('add-para-modal').style.display = 'none';
}

function addNewParagraph() {
    const heading = document.getElementById('new-para-heading').value.trim();
    const purpose = document.getElementById('new-para-purpose').value.trim();
    const words = parseInt(document.getElementById('new-para-words').value);
    const position = document.getElementById('new-para-position').value;

    if (!heading || !purpose) {
        return;
    }

    const newPara = {
        section: 'Body',
        heading: heading,
        purpose: purpose,
        sources: [],
        words: words,
        keyPoints: []
    };

    if (position === 'before-conclusion') {
        state.plan.splice(state.plan.length - 1, 0, newPara);
    } else {
        state.plan.push(newPara);
    }

    closeAddParaModal();
    saveAssignment();
}

/* =========================================================
   WORD COUNT CHANGE MODAL
   ========================================================= */
let wordCountModalCallback = null;

function showWordCountModal(question, callback) {
    document.getElementById('word-count-question').textContent = question;
    document.getElementById('word-count-modal').style.display = 'flex';
    wordCountModalCallback = callback;
}

function closeWordCountModal() {
    document.getElementById('word-count-modal').style.display = 'none';
    wordCountModalCallback = null;
}

function wordCountModalResponse(apply) {
    const cb = wordCountModalCallback;  // capture before close nulls it
    closeWordCountModal();
    if (cb) {
        cb(apply);
    }
}

/* =========================================================
   CONFIRMATION MODAL
   ========================================================= */
let confirmModalCallback = null;

function showConfirmModal(title, message, callback) {
    document.getElementById('confirm-title').innerHTML = `<i class="fas fa-exclamation-circle"></i> ${escHtml(title)}`;
    document.getElementById('confirm-message').textContent = message;
    document.getElementById('confirm-modal').style.display = 'flex';
    confirmModalCallback = callback;
}

function closeConfirmModal() {
    document.getElementById('confirm-modal').style.display = 'none';
    confirmModalCallback = null;
}

function confirmModalResponse() {
    const cb = confirmModalCallback;  // capture before close nulls it
    closeConfirmModal();
    if (cb) {
        cb();
    }
}

/* =========================================================
   ██████╗ ██╗███████╗███████╗███████╗██████╗ ████████╗
   ██╔══██╗██║██╔════╝██╔════╝██╔════╝██╔══██╗╚══██╔══╝
   ██║  ██║██║███████╗███████╗█████╗  ██████╔╝   ██║
   ██║  ██║██║╚════██║╚════██║██╔══╝  ██╔══██╗   ██║
   ██████╔╝██║███████║███████║███████╗██║  ██║   ██║
   ╚═════╝ ╚═╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝   ╚═╝
   DISSERTATION MODE — COMPLETE IMPLEMENTATION
   ========================================================= */

/* ---- Dissertation State ---- */
let dissState = {
    id: null,
    topic: '',
    program: '',
    region: '',
    chapters: [],           // Chapter plan array
    chapterDrafts: {},      // { chapterIndex: textContent }
    chapterReferences: {},  // { chapterIndex: referencesText }
    sources: [],            // All dissertation sources
    currentChapter: 0,
    totalWords: 15000,
    researchData: '',
    status: 'setup',        // setup | planning | writing | complete
    createdAt: null,
    lastModified: null
};

/* ---- Dissertation localStorage ---- */
function saveDissertation() {
    dissState.lastModified = new Date().toISOString();
    if (!dissState.id) {
        dissState.id = 'dissertation_' + Date.now();
        dissState.createdAt = dissState.lastModified;
    }
    localStorage.setItem(dissState.id, JSON.stringify(dissState));
}

function loadDissertation(id) {
    const data = localStorage.getItem(id);
    if (data) {
        dissState = JSON.parse(data);
        currentMode = 'dissertation';
        document.getElementById('landing-page').style.display = 'none';
        document.getElementById('app-layout').style.display = 'flex';
        reconstructDissertationUI();
    }
}

/* ---- Init Dissertation Mode ---- */
function initDissertationMode() {
    // Reset diss state
    dissState = {
        id: null,
        topic: '',
        program: '',
        region: '',
        chapters: [],
        chapterDrafts: {},
        chapterReferences: {},
        sources: [],
        currentChapter: 0,
        totalWords: 15000,
        researchData: '',
        status: 'setup',
        createdAt: null,
        lastModified: null
    };

    // Clear chat
    const chatThread = document.getElementById('chat-thread');
    chatThread.innerHTML = '';

    // Update step tracker labels for dissertation
    updateStepTrackerForDissertation();

    // Show dissertation welcome
    appendMsg('ai', `
        <h3><i class="fas fa-book"></i> Dissertation Writing Mode</h3>
        <p>Welcome to the Dissertation Writer. I'll help you create a complete, professionally structured dissertation with proper APA 7th edition citations in every chapter.</p>
        <div class="section-card">
            <h4>How would you like to start?</h4>
            <div class="source-options" style="margin-top:16px">
                <button class="option-card" onclick="openTopicGenModal()">
                    <i class="fas fa-lightbulb"></i>
                    <span>Generate Topics</span>
                    <small>Let AI suggest research topics</small>
                </button>
                <button class="option-card" onclick="openManualTopicModal()">
                    <i class="fas fa-keyboard"></i>
                    <span>Enter My Topic</span>
                    <small>I already have a topic</small>
                </button>
                <button class="option-card" onclick="openUploadExistingModal()">
                    <i class="fas fa-upload"></i>
                    <span>Upload Existing</span>
                    <small>Continue from existing work</small>
                </button>
            </div>
        </div>
    `);

    setStatus('Ready');
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) { exportBtn.disabled = true; exportBtn.classList.remove('ready'); }
}

function updateStepTrackerForDissertation() {
    const st1 = document.getElementById('st-1');
    const st2 = document.getElementById('st-2');
    const st3 = document.getElementById('st-3');
    const st4 = document.getElementById('st-4');
    if (st1) st1.innerHTML = '<span class="st-num">1</span> Topic';
    if (st2) st2.innerHTML = '<span class="st-num">2</span> Sources';
    if (st3) st3.innerHTML = '<span class="st-num">3</span> Plan';
    if (st4) st4.innerHTML = '<span class="st-num">4</span> Write';
}

/* ---- Topic Generation Modal ---- */
function openTopicGenModal() {
    document.getElementById('topic-gen-modal').style.display = 'flex';
}

function closeTopicGenModal() {
    document.getElementById('topic-gen-modal').style.display = 'none';
}

async function generateTopics() {
    const program = document.getElementById('topic-program').value.trim();
    const region = document.getElementById('topic-region').value.trim();
    const interest = document.getElementById('topic-interest').value.trim();

    if (!program) {
        alert('Please enter your program/field first.');
        return;
    }

    closeTopicGenModal();

    dissState.program = program;
    dissState.region = region;

    const thinkingId = 'think-topics';
    appendMsg('thinking', '<i class="fas fa-spinner fa-spin"></i> Generating 10 research topics for your program…', thinkingId);
    setStatus('Generating topics…');

    try {
        const topicsPrompt = `Generate 10 excellent, researchable dissertation topics for:
Program: ${program}
Region/Location: ${region || 'General/International'}
Specific interest: ${interest || 'Any relevant area'}

Requirements:
- Topics must be specific, focused, and researchable
- Topics should be relevant to the region if specified
- Topics should be appropriate for a master's or undergraduate dissertation
- Each topic must be distinct and cover different aspects

Return ONLY a JSON array of 10 topic strings:
["Topic 1 here", "Topic 2 here", ...]`;

        const resp = await callAI(topicsPrompt);
        const topics = safeJSON(resp);

        removeThinking(thinkingId);

        let topicsHTML = `<h3><i class="fas fa-lightbulb"></i> 10 Research Topics for ${escHtml(program)}</h3>
        <p style="font-size:0.85rem;color:var(--text-2);margin-bottom:16px">Click on any topic to select it, or enter your own below.</p>
        <div style="display:flex;flex-direction:column;gap:8px">`;

        topics.forEach((topic, i) => {
            topicsHTML += `
            <div class="topic-option" onclick="selectTopic(${i})" data-index="${i}" style="
                padding:12px 16px;
                background:var(--bg-2);
                border:2px solid var(--border);
                border-radius:var(--radius);
                cursor:pointer;
                transition:all 0.2s;
                font-size:0.88rem;
            " onmouseover="this.style.borderColor='var(--primary)';this.style.background='var(--primary-lt)'"
               onmouseout="this.style.borderColor='var(--border)';this.style.background='var(--bg-2)'">
                <span style="font-weight:600;color:var(--primary);margin-right:8px">${i + 1}.</span>
                ${escHtml(topic)}
            </div>`;
        });

        topicsHTML += `</div>
        <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border)">
            <p style="font-size:0.82rem;color:var(--text-3);margin-bottom:8px">Or enter a custom topic:</p>
            <div style="display:flex;gap:8px">
                <input type="text" id="custom-topic-input" class="text-input" placeholder="Enter your own research topic..." style="flex:1">
                <button class="btn-primary" onclick="useCustomTopic()"><i class="fas fa-check"></i> Use This Topic</button>
            </div>
        </div>`;

        // Store topics for selection
        window._generatedTopics = topics;

        appendMsg('ai', topicsHTML);
        scrollToBottom();
        setStatus('Select a topic');

    } catch (e) {
        removeThinking(thinkingId);
        appendMsg('ai', `<p style="color:var(--danger)"><i class="fas fa-exclamation-triangle"></i> Topic generation failed: ${escHtml(e.message)}</p>`);
    }
}

function selectTopic(index) {
    const topics = window._generatedTopics || [];
    if (topics[index]) {
        dissState.topic = topics[index];
        proceedWithDissertationTopic();
    }
}

function useCustomTopic() {
    const input = document.getElementById('custom-topic-input');
    if (input && input.value.trim()) {
        dissState.topic = input.value.trim();
        proceedWithDissertationTopic();
    }
}

/* ---- Manual Topic Modal ---- */
function openManualTopicModal() {
    document.getElementById('manual-topic-modal').style.display = 'flex';
}

function closeManualTopicModal() {
    document.getElementById('manual-topic-modal').style.display = 'none';
}

function submitManualTopicDiss() {
    const input = document.getElementById('manual-topic-input').value.trim();
    if (!input) {
        alert('Please enter a research topic.');
        return;
    }
    dissState.topic = input;
    closeManualTopicModal();
    proceedWithDissertationTopic();
}

/* ---- Upload Existing Modal ---- */
function openUploadExistingModal() {
    document.getElementById('upload-existing-modal').style.display = 'flex';
}

function closeUploadExistingModal() {
    document.getElementById('upload-existing-modal').style.display = 'none';
}

function submitExistingContent() {
    const topic = document.getElementById('existing-topic').value.trim();
    const content = document.getElementById('existing-content').value.trim();

    if (!topic || !content) {
        alert('Please enter both your topic and existing content.');
        return;
    }

    dissState.topic = topic;
    dissState.researchData = content;
    closeUploadExistingModal();
    proceedWithDissertationTopic();
}

/* ---- Proceed after topic selection ---- */
async function proceedWithDissertationTopic() {
    setActiveStep(1);
    setStatus('Analyzing topic…');

    appendMsg('user', `<p><strong>Dissertation Topic:</strong> ${escHtml(dissState.topic)}</p>`);

    const thinkingId = 'think-diss-analyze';
    appendMsg('thinking', '<i class="fas fa-spinner fa-spin"></i> Analyzing your dissertation topic and finding academic sources…', thinkingId);

    try {
        // Find sources for the dissertation
        setActiveStep(2);
        const sourcesPrompt = `Find 12 highly relevant, recent academic sources for this dissertation:

Topic: ${dissState.topic}
Program: ${dissState.program || 'Academic'}
Region: ${dissState.region || 'General'}

Return ONLY a JSON array:
[
  {
    "author": "Last, F. M.",
    "year": "2023",
    "title": "Full academic title",
    "type": "journal" or "book" or "report" or "chapter",
    "journal": "Journal Name in Title Case (for journal articles)",
    "volume": "45",
    "issue": "3",
    "pages": "112-134",
    "publisher": "Publisher Name (for books/reports)",
    "relevance": "How this source relates to the dissertation topic",
    "url": "https://scholar.google.com/scholar?q=title"
  }
]

Field rules:
- type: "journal" for journal articles, "book" for monographs, "report" for institutional/government reports, "chapter" for book chapters
- journal: the real journal name — only include for type "journal" or "chapter"
- volume, issue, pages: the REAL published volume, issue and page numbers for this specific article — only for type "journal". Do not guess — if uncertain, omit these fields
- publisher: the real publisher — only for type "book", "report", or "chapter"
- Mix of journals, books, and reports preferred
- Sources from 2018-2024 preferred
- Must be directly relevant to the topic
- Return ONLY the JSON array, nothing else`;

        const sourcesResp = await callAI(sourcesPrompt);
        dissState.sources = safeJSON(sourcesResp, true);

        removeThinking(thinkingId);

        let sourcesHTML = '<div class="sources-grid">';
        dissState.sources.forEach((s, i) => {
            const url = s.url || `https://scholar.google.com/scholar?q=${encodeURIComponent(s.title + ' ' + s.author)}`;
            sourcesHTML += `
                <a href="${escHtml(url)}" target="_blank" class="source-card clickable-source">
                    <div class="source-num">${i + 1}</div>
                    <div class="source-details">
                        <p class="source-author">${escHtml(s.author)} (${escHtml(s.year)})</p>
                        <p class="source-title">${escHtml(s.title)}</p>
                        <p class="source-journal">${escHtml(s.journal)}</p>
                        ${s.relevance ? `<p class="source-relevance">${escHtml(s.relevance)}</p>` : ''}
                        <p class="source-link"><i class="fas fa-external-link-alt"></i> Click to access</p>
                    </div>
                </a>`;
        });
        sourcesHTML += '</div>';

        appendMsg('ai', `
            <h3><i class="fas fa-books"></i> ${dissState.sources.length} Academic Sources Found</h3>
            <p style="font-size:0.85rem;color:var(--text-2);margin-bottom:12px">These sources will be used throughout your dissertation chapters.</p>
            ${sourcesHTML}
            <div class="action-row" style="margin-top:16px">
                <button class="btn-primary" onclick="createDissertationPlan()"><i class="fas fa-arrow-right"></i> Proceed to Chapter Planning</button>
            </div>
        `);

        scrollToBottom();
        saveDissertation();

    } catch (e) {
        const thinkEl = document.getElementById(thinkingId);
        if (thinkEl) thinkEl.remove();
        appendMsg('ai', `<p style="color:var(--danger)"><i class="fas fa-exclamation-triangle"></i> Setup failed: ${escHtml(e.message)}</p>
            <div class="action-row" style="margin-top:12px">
                <button class="btn-outline" onclick="proceedWithDissertationTopic()"><i class="fas fa-redo"></i> Try Again</button>
            </div>`);
    }
}

/* ---- Chapter Plan ---- */
async function createDissertationPlan() {
    setActiveStep(3);
    setStatus('Creating dissertation chapter plan…');
    setProgress(20);

    const thinkingId = 'think-diss-plan';
    appendMsg('thinking', '<i class="fas fa-spinner fa-spin"></i> Building comprehensive 5-chapter dissertation plan…', thinkingId);

    try {
        const planPrompt = `Create a comprehensive 5-chapter dissertation plan for:

Topic: ${dissState.topic}
Program: ${dissState.program || 'Academic Research'}
Region: ${dissState.region || 'General'}

Available sources:
${dissState.sources.map((s, i) => `[${i+1}] ${s.author} (${s.year}): ${s.title}`).join('\n')}

Return a JSON array of 5 chapters:
[
  {
    "number": 1,
    "title": "Introduction",
    "sections": ["Background", "Problem Statement", "Objectives", "Research Questions", "Significance", "Scope and Limitations", "Structure of the Study"],
    "purpose": "Comprehensive introduction establishing context, problem, objectives, and rationale",
    "sources": [1, 2, 3],
    "targetWords": 3000,
    "keyPoints": ["Establish research context", "Define problem statement", "State clear objectives"]
  },
  {
    "number": 2,
    "title": "Literature Review",
    "sections": ["Theoretical Framework", "Empirical Literature", "Conceptual Framework", "Summary of Literature Gaps"],
    "purpose": "Critical review of existing research and theoretical foundations",
    "sources": [1,2,3,4,5,6],
    "targetWords": 4000,
    "keyPoints": ["Review key theories", "Identify research gaps", "Establish theoretical framework"]
  },
  {
    "number": 3,
    "title": "Research Methodology",
    "sections": ["Research Design", "Population and Sample", "Data Collection Methods", "Data Analysis Methods", "Validity and Reliability", "Ethical Considerations"],
    "purpose": "Detailed methodology explaining how research will be conducted",
    "sources": [3,4,5],
    "targetWords": 3000,
    "keyPoints": ["Justify research design", "Describe sampling strategy", "Detail data collection"]
  },
  {
    "number": 4,
    "title": "Results and Findings",
    "sections": ["Demographic Profile", "Main Findings", "Statistical Analysis", "Thematic Analysis"],
    "purpose": "Presentation and analysis of research findings",
    "sources": [6,7,8,9],
    "targetWords": 3000,
    "keyPoints": ["Present key findings", "Analyze patterns", "Link to research questions"]
  },
  {
    "number": 5,
    "title": "Discussion, Conclusion and Recommendations",
    "sections": ["Discussion of Findings", "Conclusion", "Recommendations", "Limitations", "Areas for Further Research"],
    "purpose": "Interpret findings, draw conclusions, and make recommendations",
    "sources": [9,10,11,12],
    "targetWords": 2000,
    "keyPoints": ["Interpret findings", "Draw conclusions", "Make practical recommendations"]
  }
]

Make the plan specific to the topic: ${dissState.topic}`;

        const planResp = await callAI(planPrompt);
        dissState.chapters = safeJSON(planResp);

        removeThinking(thinkingId);

        // Display plan
        let planHTML = `<h3><i class="fas fa-list"></i> Dissertation Chapter Plan</h3>
        <p style="font-size:0.85rem;color:var(--text-2);margin-bottom:16px">Review and approve the chapter plan before writing begins.</p>
        <div id="diss-plan-container">`;

        dissState.chapters.forEach((ch, i) => {
            const sourcesText = ch.sources && ch.sources.length > 0
                ? ch.sources.map(idx => {
                    const src = dissState.sources[idx - 1];
                    return src ? `${src.author.split(',')[0]} (${src.year})` : `Src ${idx}`;
                }).join(', ')
                : 'Various sources';

            planHTML += `
            <div class="plan-card plan-body" id="diss-plan-${i}" style="margin-bottom:12px">
                <div class="plan-header">
                    <span class="plan-num">${ch.number}</span>
                    <div class="plan-info">
                        <h4>Chapter ${ch.number}: ${escHtml(ch.title)}</h4>
                        <span class="plan-meta">~${ch.targetWords ? ch.targetWords.toLocaleString() : '3,000'} words</span>
                    </div>
                </div>
                <div class="plan-body">
                    <p style="font-size:0.83rem;color:var(--text-2);margin-bottom:8px">${escHtml(ch.purpose)}</p>
                    ${ch.sections && ch.sections.length > 0 ? `
                    <div style="font-size:0.8rem;color:var(--text-3);margin-bottom:6px">
                        <strong>Sections:</strong> ${ch.sections.map(s => escHtml(s)).join(' • ')}
                    </div>` : ''}
                    <div class="plan-sources"><strong>Sources:</strong> ${escHtml(sourcesText)}</div>
                </div>
            </div>`;
        });

        planHTML += `</div>
        <div class="action-row" style="margin-top:20px">
            <button class="btn-outline" onclick="createDissertationPlan()"><i class="fas fa-sync"></i> Regenerate Plan</button>
            <button class="btn-primary" onclick="startDissertationWriting()"><i class="fas fa-check"></i> Approve & Start Writing</button>
        </div>`;

        appendMsg('ai', planHTML);
        scrollToBottom();
        saveDissertation();

    } catch (e) {
        removeThinking(thinkingId);
        appendMsg('ai', `<p style="color:var(--danger)"><i class="fas fa-exclamation-triangle"></i> Plan creation failed: ${escHtml(e.message)}</p>
            <div class="action-row" style="margin-top:12px">
                <button class="btn-outline" onclick="createDissertationPlan()"><i class="fas fa-redo"></i> Try Again</button>
            </div>`);
    }
}

/* ---- Start Writing ---- */
async function startDissertationWriting() {
    setActiveStep(4);
    setStatus('Writing dissertation…');
    setProgress(10);
    dissState.status = 'writing';

    appendMsg('ai', `
        <h3><i class="fas fa-pen"></i> Dissertation Writing Begins</h3>
        <p>Writing all 5 chapters with full APA 7th edition citations. Each chapter will include a complete reference list when downloaded.</p>
        <div style="padding:12px;background:var(--primary-lt);border-left:3px solid var(--primary);border-radius:var(--radius);margin-top:12px;font-size:0.85rem">
            <i class="fas fa-info-circle"></i> <strong>Chapters 4 & 5</strong> will be written with synthesized desk research findings. You can also provide your own data after Chapter 3.
        </div>
    `);

    // Write chapters 1-3 first
    for (let i = 0; i < 3; i++) {
        await writeDissertationChapter(i);
    }

    // After ch 3, ask for data
    showDataInputModal();
}

async function writeDissertationChapter(chapterIndex) {
    const chapter = dissState.chapters[chapterIndex];
    if (!chapter) return;

    const chapterNum = chapter.number;
    const chapterTitle = chapter.title;
    const targetWords = chapter.targetWords || 3000;

    setStatus(`Writing Chapter ${chapterNum}: ${chapterTitle}…`);
    setProgress(10 + (chapterIndex / 5) * 70);

    // Show drafting card
    const draftCardHTML = `
        <div class="para-card drafting" id="diss-card-${chapterIndex}">
            <div class="para-header">
                <h4>Chapter ${chapterNum}: ${escHtml(chapterTitle)}</h4>
                <span class="badge drafting" id="diss-badge-${chapterIndex}">✦ Writing…</span>
            </div>
            <div class="para-content">
                <div class="text-block">
                    <p class="cursor-blink" id="diss-text-${chapterIndex}" style="font-family:'Lora',serif;line-height:1.8"></p>
                </div>
            </div>
        </div>`;

    appendMsg('ai', draftCardHTML);
    scrollToBottom();

    const sourcesForChapter = chapter.sources && chapter.sources.length > 0
        ? chapter.sources.map(idx => {
            const src = dissState.sources[idx - 1];
            return src ? `[${idx}] ${src.author} (${src.year}): ${src.title} (${src.journal})` : null;
        }).filter(Boolean).join('\n')
        : dissState.sources.slice(0, 6).map((s, i) => `[${i+1}] ${s.author} (${s.year}): ${s.title}`).join('\n');

    const sectionsText = chapter.sections ? chapter.sections.join(', ') : '';

    const chapterPrompt = `Write Chapter ${chapterNum} of a dissertation on: "${dissState.topic}"

Chapter Title: ${chapterTitle}
Sections to cover: ${sectionsText}
Purpose: ${chapter.purpose}
Target word count: approximately ${targetWords} words

Sources available for this chapter:
${sourcesForChapter}

DISSERTATION WRITING REQUIREMENTS:
1. Write in formal, academic English appropriate for a Master's or undergraduate dissertation
2. Include ALL sections listed: ${sectionsText}
3. Use proper APA 7th edition in-text citations: (Author, Year) or Author (Year)
4. MANDATORY: Cite at least one source per paragraph - every factual claim must be cited
5. Use section headings formatted as: ### Section Title
6. Write approximately ${targetWords} words in total
7. No first-person perspective (avoid "I", "we", "my")
8. No meta-statements about what the chapter will discuss
9. Write in continuous academic prose with proper paragraph structure
10. Every in-text citation must match a source from the list provided above

APA 7TH EDITION CITATION RULES:
- Single author: (Smith, 2022) or Smith (2022)
- Two authors: (Smith & Jones, 2022)
- Three or more: (Smith et al., 2022)
- Multiple sources: (Smith, 2022; Jones, 2023)
- Direct quote: (Smith, 2022, p. 45)

${chapterNum === 1 ? `
CHAPTER 1 SPECIFIC REQUIREMENTS:
- Background section: provide thorough context with citations
- Problem Statement: clearly articulate the research problem
- Objectives: list 3-5 specific, measurable objectives
- Research Questions: list corresponding research questions
- Significance: explain theoretical and practical contributions
- Scope: define boundaries of the study
- Structure: briefly describe remaining chapters` : ''}

${chapterNum === 2 ? `
CHAPTER 2 SPECIFIC REQUIREMENTS:
- Theoretical Framework: identify and explain 2-3 key theories
- Empirical Literature: review recent studies on the topic
- Conceptual Framework: develop and explain the framework
- Literature Gaps: clearly identify what is missing in existing literature
- Use many citations from the source list throughout` : ''}

${chapterNum === 3 ? `
CHAPTER 3 SPECIFIC REQUIREMENTS:
- Research Design: justify the chosen design (qualitative/quantitative/mixed)
- Population and Sample: describe target population and sampling strategy
- Data Collection: explain instruments/tools used
- Data Analysis: describe analytical methods
- Validity and Reliability: address these concepts
- Ethics: discuss ethical considerations` : ''}

Write the complete chapter now. Use ### for section headings. Ensure every paragraph has at least one in-text citation from the sources list.`;

    try {
        const chapterResp = await callAI(chapterPrompt);
        let chapterText = chapterResp.trim();

        // Clean up
        chapterText = chapterText.replace(/\s*—\s*/g, ', ');

        // Generate references for this chapter
        const chapterRefs = await generateChapterReferences(chapter, dissState.sources);

        dissState.chapterDrafts[chapterIndex] = chapterText;
        dissState.chapterReferences[chapterIndex] = chapterRefs;

        // Stream the text
        const textEl = document.getElementById('diss-text-' + chapterIndex);
        if (textEl) {
            textEl.classList.remove('cursor-blink');
            // For long chapters, just set the text (no streaming to avoid UI hanging)
            textEl.innerHTML = formatChapterText(chapterText);
        }

        // Mark done and add download button
        const badge = document.getElementById('diss-badge-' + chapterIndex);
        if (badge) {
            badge.textContent = '✓ Complete';
            badge.classList.remove('drafting');
            badge.classList.add('done');
        }
        const card = document.getElementById('diss-card-' + chapterIndex);
        if (card) {
            card.classList.remove('drafting');
            card.classList.add('done');

            // Add download and view buttons after the card
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'action-row';
            actionsDiv.style.marginTop = '10px';
            actionsDiv.innerHTML = `
                <button class="btn-outline" onclick="downloadChapter(${chapterIndex})">
                    <i class="fas fa-download"></i> Download Chapter ${chapterNum} + References
                </button>
                <button class="btn-outline" onclick="previewChapter(${chapterIndex})">
                    <i class="fas fa-eye"></i> Preview
                </button>
            `;
            card.parentElement.insertBefore(actionsDiv, card.nextSibling);
        }

        scrollToBottom();
        saveDissertation();

    } catch (e) {
        const badge = document.getElementById('diss-badge-' + chapterIndex);
        if (badge) { badge.textContent = '✗ Failed'; badge.style.color = 'var(--danger)'; }
        appendMsg('ai', `<p style="color:var(--danger)">Chapter ${chapterNum} writing failed: ${escHtml(e.message)}</p>
            <button class="btn-outline" onclick="writeDissertationChapter(${chapterIndex})"><i class="fas fa-redo"></i> Retry Chapter ${chapterNum}</button>`);
    }
}

function formatChapterText(text) {
    // Convert markdown-style headings and formatting to HTML
    let html = escHtml(text);
    // Convert ### headings
    html = html.replace(/###\s+(.+)/g, '<h4 style="font-family:DM Sans,sans-serif;font-size:0.95rem;font-weight:700;margin:20px 0 10px;color:var(--text)">$1</h4>');
    // Convert ## headings
    html = html.replace(/##\s+(.+)/g, '<h3 style="font-family:DM Sans,sans-serif;font-size:1rem;font-weight:700;margin:24px 0 12px;color:var(--text)">$1</h3>');
    // Convert *italic*
    html = html.replace(/\*([^*]+)\*/g, '<i>$1</i>');
    // Convert **bold**
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Convert line breaks to paragraphs
    const paragraphs = html.split(/\n\n+/);
    html = paragraphs.map(p => {
        p = p.replace(/\n/g, ' ').trim();
        if (!p) return '';
        if (p.startsWith('<h')) return p;
        return `<p style="font-family:Lora,Georgia,serif;font-size:0.9rem;line-height:1.8;text-align:justify;margin-bottom:1em">${p}</p>`;
    }).filter(Boolean).join('');
    return html;
}

/* ---- Generate Chapter References (APA 7th) — deterministic, no AI guessing ---- */
async function generateChapterReferences(chapter, allSources) {
    try {
        const chapterSourceIndices = chapter.sources || [];
        const sourcesToFormat = chapterSourceIndices.length > 0
            ? chapterSourceIndices.map(idx => allSources[idx - 1]).filter(Boolean)
            : allSources.slice(0, 8);

        const sorted = [...sourcesToFormat].sort((a, b) =>
            (a.author || '').localeCompare(b.author || '')
        );

        return sorted.map(s => buildAPAReference(s, false)).join('\n');

    } catch (e) {
        // Minimal fallback
        const chapterSourceIndices = chapter.sources || [];
        const sourcesToFormat = chapterSourceIndices.length > 0
            ? chapterSourceIndices.map(idx => allSources[idx - 1]).filter(Boolean)
            : allSources.slice(0, 8);
        return sourcesToFormat
            .sort((a, b) => (a.author || '').localeCompare(b.author || ''))
            .map(s => buildAPAReference(s, false))
            .join('\n');
    }
}

/* ---- Data Input Modal ---- */
function showDataInputModal() {
    document.getElementById('data-input-modal').style.display = 'flex';
}

function closeDataInputModal() {
    document.getElementById('data-input-modal').style.display = 'none';
}

function selectDataOption(option) {
    if (option === 'paste') {
        document.getElementById('paste-data-section').style.display = 'block';
        document.getElementById('research-data-section').style.display = 'none';
    } else {
        document.getElementById('research-data-section').style.display = 'block';
        document.getElementById('paste-data-section').style.display = 'none';
    }
}

async function submitResearchData() {
    const data = document.getElementById('research-data-input').value.trim();
    if (!data) {
        alert('Please enter your research data first.');
        return;
    }
    dissState.researchData = data;
    closeDataInputModal();
    await writeFinalChapters();
}

async function performDeskResearch() {
    const query = document.getElementById('research-query-input').value.trim();
    if (!query) {
        alert('Please enter a research query first.');
        return;
    }

    closeDataInputModal();

    const thinkingId = 'think-desk-research';
    appendMsg('thinking', '<i class="fas fa-spinner fa-spin"></i> Performing desk research and synthesizing findings…', thinkingId);

    try {
        const researchPrompt = `Perform comprehensive desk research for this dissertation on: "${dissState.topic}"

Research query: ${query}

Synthesize findings as if you are presenting research data. Include:
1. Key statistics and data points relevant to the topic
2. Case studies or examples from the region/context
3. Survey-like findings based on published research
4. Thematic patterns from existing literature
5. Quantitative data where available

Write as comprehensive research findings (400-600 words) that can be used as the basis for Chapter 4 and 5 of a dissertation.`;

        const researchResp = await callAI(researchPrompt);
        dissState.researchData = researchResp.trim();

        removeThinking(thinkingId);

        appendMsg('ai', `
            <div style="padding:12px;background:var(--success-lt);border-left:3px solid var(--success);border-radius:var(--radius)">
                <p style="font-weight:600;color:var(--success)"><i class="fas fa-check-circle"></i> Research Data Synthesized</p>
                <p style="font-size:0.83rem;margin-top:6px">${escHtml(dissState.researchData.substring(0, 200))}…</p>
            </div>
        `);

        await writeFinalChapters();

    } catch (e) {
        removeThinking(thinkingId);
        appendMsg('ai', `<p style="color:var(--danger)">Research failed: ${escHtml(e.message)}</p>`);
    }
}

async function writeFinalChapters() {
    // Write chapters 4 and 5
    for (let i = 3; i < 5; i++) {
        if (dissState.chapters[i]) {
            await writeDissertationChapterWithData(i);
        }
    }

    // All done - show completion
    await completeDissertation();
}

async function writeDissertationChapterWithData(chapterIndex) {
    const chapter = dissState.chapters[chapterIndex];
    if (!chapter) return;

    const chapterNum = chapter.number;
    const chapterTitle = chapter.title;
    const targetWords = chapter.targetWords || 3000;

    setStatus(`Writing Chapter ${chapterNum}: ${chapterTitle}…`);
    setProgress(70 + (chapterIndex - 3) * 12);

    const draftCardHTML = `
        <div class="para-card drafting" id="diss-card-${chapterIndex}">
            <div class="para-header">
                <h4>Chapter ${chapterNum}: ${escHtml(chapterTitle)}</h4>
                <span class="badge drafting" id="diss-badge-${chapterIndex}">✦ Writing…</span>
            </div>
            <div class="para-content">
                <div class="text-block">
                    <p class="cursor-blink" id="diss-text-${chapterIndex}" style="font-family:'Lora',serif;line-height:1.8"></p>
                </div>
            </div>
        </div>`;

    appendMsg('ai', draftCardHTML);
    scrollToBottom();

    const sourcesForChapter = chapter.sources && chapter.sources.length > 0
        ? chapter.sources.map(idx => {
            const src = dissState.sources[idx - 1];
            return src ? `[${idx}] ${src.author} (${src.year}): ${src.title}` : null;
        }).filter(Boolean).join('\n')
        : dissState.sources.slice(0, 6).map((s, i) => `[${i+1}] ${s.author} (${s.year}): ${s.title}`).join('\n');

    const sectionsText = chapter.sections ? chapter.sections.join(', ') : '';

    const chapterPrompt = `Write Chapter ${chapterNum} of a dissertation on: "${dissState.topic}"

Chapter Title: ${chapterTitle}
Sections to cover: ${sectionsText}
Purpose: ${chapter.purpose}
Target word count: approximately ${targetWords} words

RESEARCH DATA TO BASE CHAPTER ON:
${dissState.researchData || 'Use synthesized findings from published research on the topic'}

Sources available for citations:
${sourcesForChapter}

REQUIREMENTS:
1. Write in formal academic English
2. Cover ALL sections listed
3. Use proper APA 7th edition in-text citations from the sources list
4. Cite at least once per paragraph
5. Use ### for section headings
6. For Chapter 4 (Results): Present the research findings based on the data provided, use tables or thematic presentation
7. For Chapter 5 (Discussion/Conclusion): Interpret findings, compare with literature, draw conclusions, make recommendations
8. Write approximately ${targetWords} words
9. No first-person perspective

${chapterNum === 4 ? `
CHAPTER 4 SPECIFIC REQUIREMENTS:
- Present findings systematically (by theme or objective)
- Link each finding to a research question/objective
- Use the research data provided above
- Describe patterns and trends
- Use narrative to explain findings` : ''}

${chapterNum === 5 ? `
CHAPTER 5 SPECIFIC REQUIREMENTS:
- Discussion: Interpret findings in context of literature (cite sources)
- Conclusion: Restate what was done and key findings
- Recommendations: Practical recommendations (3-5 specific, numbered)
- Limitations: Honest acknowledgment of study limitations
- Future Research: 2-3 areas for further investigation` : ''}

Write the complete chapter using ### for section headings. Ensure every paragraph has at least one in-text citation.`;

    try {
        const chapterResp = await callAI(chapterPrompt);
        let chapterText = chapterResp.trim();
        chapterText = chapterText.replace(/\s*—\s*/g, ', ');

        const chapterRefs = await generateChapterReferences(chapter, dissState.sources);

        dissState.chapterDrafts[chapterIndex] = chapterText;
        dissState.chapterReferences[chapterIndex] = chapterRefs;

        const textEl = document.getElementById('diss-text-' + chapterIndex);
        if (textEl) {
            textEl.classList.remove('cursor-blink');
            textEl.innerHTML = formatChapterText(chapterText);
        }

        const badge = document.getElementById('diss-badge-' + chapterIndex);
        if (badge) {
            badge.textContent = '✓ Complete';
            badge.classList.remove('drafting');
            badge.classList.add('done');
        }
        const card = document.getElementById('diss-card-' + chapterIndex);
        if (card) {
            card.classList.remove('drafting');
            card.classList.add('done');

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'action-row';
            actionsDiv.style.marginTop = '10px';
            actionsDiv.innerHTML = `
                <button class="btn-outline" onclick="downloadChapter(${chapterIndex})">
                    <i class="fas fa-download"></i> Download Chapter ${chapterNum} + References
                </button>
                <button class="btn-outline" onclick="previewChapter(${chapterIndex})">
                    <i class="fas fa-eye"></i> Preview
                </button>
            `;
            card.parentElement.insertBefore(actionsDiv, card.nextSibling);
        }

        scrollToBottom();
        saveDissertation();

    } catch (e) {
        appendMsg('ai', `<p style="color:var(--danger)">Chapter ${chapterNum} failed: ${escHtml(e.message)}</p>
            <button class="btn-outline" onclick="writeDissertationChapterWithData(${chapterIndex})"><i class="fas fa-redo"></i> Retry</button>`);
    }
}

async function completeDissertation() {
    setProgress(100);
    setStatus('Dissertation Complete!');
    dissState.status = 'complete';

    // Generate full APA 7th edition reference list for all sources
    const allRefsHTML = await generateFullDissertationReferences();

    appendMsg('ai', `
        <h3 class="success-heading"><i class="fas fa-graduation-cap"></i> Dissertation Complete!</h3>
        <p>Your complete 5-chapter dissertation has been written with proper APA 7th edition citations throughout.</p>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:16px">
            <div style="padding:14px;background:var(--bg-2);border-radius:var(--radius);text-align:center">
                <div style="font-size:1.4rem;font-weight:700;color:var(--primary)">${dissState.chapters.length}</div>
                <div style="font-size:0.78rem;color:var(--text-3)">Chapters</div>
            </div>
            <div style="padding:14px;background:var(--bg-2);border-radius:var(--radius);text-align:center">
                <div style="font-size:1.4rem;font-weight:700;color:var(--primary)">${dissState.sources.length}</div>
                <div style="font-size:0.78rem;color:var(--text-3)">Sources</div>
            </div>
            <div style="padding:14px;background:var(--bg-2);border-radius:var(--radius);text-align:center">
                <div style="font-size:1.4rem;font-weight:700;color:var(--primary)">APA 7</div>
                <div style="font-size:0.78rem;color:var(--text-3)">Citation Style</div>
            </div>
        </div>

        <div class="references-block" style="margin-top:20px;padding:16px;background:var(--bg-2);border-radius:var(--radius);border:1px solid var(--border)">
            <h4 style="margin-bottom:12px;text-align:left;"><i class="fas fa-list"></i> Complete Reference List (APA 7th Edition)</h4>
            <div class="references-content">${allRefsHTML.split('\n').filter(l => l.trim()).map(l => `<p class="ref-line">${l}</p>`).join('')}</div>
        </div>

        <div class="action-row" style="margin-top:20px;flex-wrap:wrap">
            <button class="btn-primary" onclick="downloadFullDissertation()">
                <i class="fas fa-download"></i> Download Full Dissertation (.doc)
            </button>
            <button class="btn-outline" onclick="downloadAllChapters()">
                <i class="fas fa-file-archive"></i> Download All Chapters Separately
            </button>
        </div>
    `);

    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) { exportBtn.disabled = false; exportBtn.classList.add('ready'); }
    saveDissertation();
    scrollToBottom();
}

async function generateFullDissertationReferences() {
    // Deterministic — built directly from stored source data, no AI call needed
    const sorted = [...dissState.sources].sort((a, b) =>
        (a.author || '').localeCompare(b.author || '')
    );
    return sorted.map(s => buildAPAReference(s, false)).join('\n');
}

/* ---- Chapter Download with References ---- */
function downloadChapter(chapterIndex) {
    const chapter = dissState.chapters[chapterIndex];
    const chapterText = dissState.chapterDrafts[chapterIndex];
    const chapterRefs = dissState.chapterReferences[chapterIndex];

    if (!chapter || !chapterText) {
        alert('Chapter content not available. Please wait for writing to complete.');
        return;
    }

    const chapterNum = chapter.number;
    const chapterTitle = chapter.title;

    // Convert markdown headings and text to Word-compatible HTML
    let formattedText = escHtml(chapterText);
    formattedText = formattedText.replace(/###\s+(.+)/g, '</p><h3 style="font-family:\'Times New Roman\',serif;font-size:12pt;font-weight:bold;margin-top:18pt;margin-bottom:6pt">$1</h3><p>');
    formattedText = formattedText.replace(/##\s+(.+)/g, '</p><h2 style="font-family:\'Times New Roman\',serif;font-size:12pt;font-weight:bold;margin-top:24pt;margin-bottom:8pt">$1</h2><p>');
    formattedText = formattedText.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    formattedText = formattedText.replace(/\*([^*]+)\*/g, '<i>$1</i>');
    const paragraphs = formattedText.split(/\n\n+/);
    const bodyText = paragraphs.map(p => `<p style="font-family:'Times New Roman',serif;font-size:12pt;line-height:2;text-align:justify;margin-bottom:0pt">${p.replace(/\n/g, ' ').trim()}</p>`).join('');

    // Build references section
    let refsSection = '';
    if (chapterRefs) {
        const refLines = chapterRefs.split('\n').filter(l => l.trim());
        const refsHtml = refLines.map(l => `<p style="font-family:'Times New Roman',serif;font-size:12pt;text-indent:-0.5in;margin-left:0.5in;margin-bottom:6pt;text-align:left">${l}</p>`).join('');
        refsSection = `
            <div style="page-break-before:always">
                <h2 style="font-family:'Times New Roman',serif;font-size:12pt;font-weight:bold;text-align:center;margin-bottom:18pt">References</h2>
                ${refsHtml}
            </div>`;
    }

    const wordDoc = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<style>
@page { size: 8.5in 11in; margin: 1in; }
body { font-family: "Times New Roman", serif; font-size: 12pt; line-height: 2; color: #000; }
h1 { font-size: 14pt; font-weight: bold; text-align: center; margin-bottom: 24pt; }
h2 { font-size: 12pt; font-weight: bold; margin-top: 18pt; margin-bottom: 6pt; }
h3 { font-size: 12pt; font-weight: bold; margin-top: 14pt; margin-bottom: 4pt; }
p { font-size: 12pt; line-height: 2; margin-bottom: 0pt; text-align: justify; }
</style>
</head>
<body>
<h1>Chapter ${chapterNum}: ${escHtml(chapterTitle)}</h1>
<h1 style="font-size:12pt;font-weight:normal;font-style:italic;margin-top:-12pt;margin-bottom:24pt">${escHtml(dissState.topic)}</h1>
${bodyText}
${refsSection}
</body></html>`;

    const blob = new Blob(['\ufeff', wordDoc], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Chapter_${chapterNum}_${chapterTitle.replace(/[^a-zA-Z0-9 ]/g, '').trim().substring(0, 40)}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 3000);
}

function previewChapter(chapterIndex) {
    const chapter = dissState.chapters[chapterIndex];
    const chapterText = dissState.chapterDrafts[chapterIndex];
    const chapterRefs = dissState.chapterReferences[chapterIndex];

    if (!chapter || !chapterText) return;

    let html = `<h1>Chapter ${chapter.number}: ${escHtml(chapter.title)}</h1>`;
    html += formatChapterText(chapterText);

    if (chapterRefs) {
        html += `<div style="margin-top:32px;padding-top:24px;border-top:2px solid var(--border)">
            <h3 style="text-align:left;margin-bottom:16px">References</h3>`;
        chapterRefs.split('\n').filter(l => l.trim()).forEach(l => {
            html += `<p class="ref-entry" style="text-indent:-0.5in;margin-left:0.5in;margin-bottom:8px">${l}</p>`;
        });
        html += '</div>';
    }

    document.getElementById('paper-view').innerHTML = html;
    document.getElementById('preview-modal').style.display = 'flex';
}

function downloadAllChapters() {
    dissState.chapters.forEach((ch, i) => {
        if (dissState.chapterDrafts[i]) {
            setTimeout(() => downloadChapter(i), i * 800);
        }
    });
}

function downloadFullDissertation() {
    let body = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<style>
@page { size: 8.5in 11in; margin: 1in; }
body { font-family: "Times New Roman", serif; font-size: 12pt; line-height: 2; color: #000; }
h1 { font-size: 14pt; font-weight: bold; text-align: center; margin-bottom: 18pt; }
h2 { font-size: 12pt; font-weight: bold; text-align: center; margin-top: 0; margin-bottom: 18pt; }
h3 { font-size: 12pt; font-weight: bold; margin-top: 18pt; margin-bottom: 6pt; }
h4 { font-size: 12pt; font-weight: bold; margin-top: 14pt; margin-bottom: 4pt; }
p { font-size: 12pt; line-height: 2; margin-bottom: 0pt; text-align: justify; }
.ref { text-indent: -0.5in; margin-left: 0.5in; text-align: left; }
.page-break { page-break-before: always; }
.title-page { text-align: center; margin-top: 2in; }
</style>
</head>
<body>

<div class="title-page">
    <h1 style="font-size:16pt;margin-bottom:32pt">${escHtml(dissState.topic)}</h1>
    <p style="text-align:center;margin:8pt 0">A Dissertation</p>
    <p style="text-align:center;margin:8pt 0">Submitted in Partial Fulfilment of the Requirements</p>
    ${dissState.program ? `<p style="text-align:center;margin:8pt 0">For the degree of ${escHtml(dissState.program)}</p>` : ''}
    <p style="text-align:center;margin:24pt 0">${new Date().getFullYear()}</p>
</div>`;

    // Table of Contents
    body += `<div class="page-break">
<h2>TABLE OF CONTENTS</h2>`;
    dissState.chapters.forEach(ch => {
        body += `<p style="text-align:left">Chapter ${ch.number}: ${escHtml(ch.title)}</p>`;
    });
    body += `<p style="text-align:left">References</p>
</div>`;

    // Each chapter
    dissState.chapters.forEach((ch, i) => {
        const text = dissState.chapterDrafts[i];
        if (!text) return;

        body += `<div class="page-break">`;
        body += `<h1>Chapter ${ch.number}: ${escHtml(ch.title)}</h1>`;

        // Convert markdown to Word HTML
        let formattedText = escHtml(text);
        formattedText = formattedText.replace(/###\s+(.+)/g, '</p><h3>$1</h3><p>');
        formattedText = formattedText.replace(/##\s+(.+)/g, '</p><h4>$1</h4><p>');
        formattedText = formattedText.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        formattedText = formattedText.replace(/\*([^*]+)\*/g, '<i>$1</i>');

        const paragraphs = formattedText.split(/\n\n+/);
        paragraphs.forEach(p => {
            const cleaned = p.replace(/\n/g, ' ').trim();
            if (cleaned) {
                if (cleaned.startsWith('<h')) {
                    body += cleaned;
                } else {
                    body += `<p>${cleaned}</p>`;
                }
            }
        });

        body += `</div>`;
    });

    // Final references section
    const allRefs = getAllDissertationReferences();
    body += `<div class="page-break">
<h1 style="text-align:center">References</h1>`;
    allRefs.split('\n').filter(l => l.trim()).forEach(l => {
        body += `<p class="ref">${l}</p>`;
    });
    body += `</div>`;

    body += `</body></html>`;

    const blob = new Blob(['\ufeff', body], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dissertation_${dissState.topic.replace(/[^a-zA-Z0-9 ]/g, '').trim().substring(0, 50)}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 3000);
}

function getAllDissertationReferences() {
    // Build deterministically from stored source data — no invented numbers
    const sorted = [...dissState.sources].sort((a, b) =>
        (a.author || '').localeCompare(b.author || '')
    );
    return sorted.map(s => buildAPAReference(s, false)).join('\n');
}

/* ---- Reconstruct Dissertation UI (for loaded dissertations) ---- */
function reconstructDissertationUI() {
    const chatThread = document.getElementById('chat-thread');
    chatThread.innerHTML = '';

    updateStepTrackerForDissertation();

    appendMsg('ai', `
        <h3><i class="fas fa-book"></i> Dissertation Loaded</h3>
        <p><strong>Topic:</strong> ${escHtml(dissState.topic)}</p>
        <p><strong>Status:</strong> ${escHtml(dissState.status)}</p>
        <p><strong>Chapters written:</strong> ${Object.keys(dissState.chapterDrafts).length} of ${dissState.chapters.length}</p>
    `);

    // Reconstruct written chapters
    dissState.chapters.forEach((ch, i) => {
        const draft = dissState.chapterDrafts[i];
        if (draft) {
            const cardHTML = `
                <div class="para-card done" id="diss-card-${i}">
                    <div class="para-header">
                        <h4>Chapter ${ch.number}: ${escHtml(ch.title)}</h4>
                        <span class="badge done" id="diss-badge-${i}">✓ Complete</span>
                    </div>
                    <div class="para-content">
                        <div class="text-block" style="max-height:200px;overflow-y:auto">
                            <div style="font-family:'Lora',serif;font-size:0.9rem;line-height:1.8">${formatChapterText(draft.substring(0, 600))}...</div>
                        </div>
                    </div>
                </div>`;
            appendMsg('ai', cardHTML);

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'action-row';
            actionsDiv.style.marginTop = '10px';
            actionsDiv.innerHTML = `
                <button class="btn-outline" onclick="downloadChapter(${i})">
                    <i class="fas fa-download"></i> Download Chapter ${ch.number} + References
                </button>
                <button class="btn-outline" onclick="previewChapter(${i})">
                    <i class="fas fa-eye"></i> Preview
                </button>
            `;
            // Append after the last message
            const lastMsg = chatThread.lastElementChild;
            if (lastMsg) lastMsg.appendChild(actionsDiv);
        }
    });

    if (dissState.status === 'complete') {
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) { exportBtn.disabled = false; exportBtn.classList.add('ready'); }

        appendMsg('ai', `
            <div class="action-row" style="margin-top:16px;flex-wrap:wrap">
                <button class="btn-primary" onclick="downloadFullDissertation()">
                    <i class="fas fa-download"></i> Download Full Dissertation (.doc)
                </button>
                <button class="btn-outline" onclick="downloadAllChapters()">
                    <i class="fas fa-file-archive"></i> Download All Chapters Separately
                </button>
            </div>
        `);
    } else {
        appendMsg('ai', `
            <div class="action-row" style="margin-top:16px">
                <button class="btn-primary" onclick="continueDissertation()">
                    <i class="fas fa-play"></i> Continue Writing
                </button>
            </div>
        `);
    }

    setStatus('Dissertation loaded');
    scrollToBottom();
}

async function continueDissertation() {
    // Find what chapter to continue from
    const nextChapterIndex = Object.keys(dissState.chapterDrafts).length;
    if (nextChapterIndex >= dissState.chapters.length) {
        await completeDissertation();
        return;
    }

    if (nextChapterIndex < 3) {
        for (let i = nextChapterIndex; i < 3; i++) {
            await writeDissertationChapter(i);
        }
        showDataInputModal();
    } else {
        await writeFinalChapters();
    }
}

/* ---- Old chapter plan modal functions (kept for backward compatibility) ---- */
function closeChapterPlanModal() {
    document.getElementById('chapter-plan-modal').style.display = 'none';
}

function approvePlanAndGenerate() {
    closeChapterPlanModal();
    startDissertationWriting();
}

function regeneratePlan() {
    closeChapterPlanModal();
    createDissertationPlan();
}

/* =========================================================
   UTILITY
   ========================================================= */
function escHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

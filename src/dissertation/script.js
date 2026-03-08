/* =============================================
   ESSAYFLOW PRO — WHERE DISSERTATION WORK AND IS 100% PERFECT
   ============================================= */

const API_KEYS = [
    "AIzaSyCyxiKVm9Oheegyl5GSL9P4IBBBy5UE2lQ",
    "AIzaSyC4zjWw7wZOlu9XxTjTDkHcKpHDZHsKweE",
    "AIzaSyChEjBSxEwmFEzImgvA6WUuqJ2Xeu8jvIc",
    "AIzaSyBtWRx7ErE6zDuCL6ElAJVSf-WBN3FRXhw",
    "AIzaSyCAy92k4yS3P8tWsFhHSWwnas7Csga3umI",
    "AIzaSyAPti_i4IxcZwkqvzeS0PEqDws77UPyny8",
    "AIzaSyBG0vkLsxxtrGoM49J-BcKB7K8faZ9-HBU",
    "AIzaSyAQHUYPRxEyFa1Z8R9FsM7EnvbyJA61qEc",
    "AIzaSyBsW-zBcW7GPR0fD4QSp7Z5eB7avKSpBVY",
    "AIzaSyD2P3eXluVp3xsvLty1MVqgjYHYd42CdjQ",
    "AIzaSyA_L6NaENi3jjyZkDoh1SBCN4qp5StW_Ik"
];

const MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-pro"
];

/* Persistent rotation pointers */
let _modelIdx = 0;
let _keyIdx   = 0;

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
   DISSERTATION STATE & CONFIGURATION
   ========================================================= */
let dissState = {
    id: null,
    topic: "",
    program: "",
    region: "",
    selectedTopicData: null,
    hasConceptNote: false,
    conceptNote: "",
    currentChapter: 0,
    chapters: {
        1: { title: "Chapter 1: Study Overview", content: "", plan: null, approved: false },
        2: { title: "Chapter 2: Literature Review", content: "", plan: null, approved: false },
        3: { title: "Chapter 3: Research Methodology", content: "", plan: null, approved: false },
        4: { title: "Chapter 4: Findings", content: "", plan: null, approved: false },
        5: { title: "Chapter 5: Conclusions & Recommendations", content: "", plan: null, approved: false }
    },
    researchData: "",
    references: "",
    chapterCitations: {},
    approvedCitations: {},
    includeDoi: false,
    createdAt: null,
    lastModified: null
};

// Chapter Structure Configurations (from the pasted script)
const chapterConfigs = {
    1: {
        sections: [
            { heading: "1.0 Introduction", defaultParas: 1, defaultWords: 90, description: "A roadmap paragraph listing the sections in this chapter" },
            { heading: "1.1 Background", defaultParas: 8, defaultWords: 100, description: "Start globally, narrow to Malawi, then to your study site using the funnel method" },
            { heading: "1.2 Problem Statement", defaultParas: 2, defaultWords: 100, description: "Define the ideal vs reality, explain the gap, and anchor your study" },
            { heading: "1.3 Objectives of the study", defaultParas: 0, defaultWords: 0, description: "Main objective, specific objectives (3-4), and research questions — structured list format" },
            { heading: "1.4 Significance of the study", defaultParas: 1, defaultWords: 100, description: "Who benefits and link to SDGs and National Goals" },
            { heading: "1.5 Chapter summary", defaultParas: 1, defaultWords: 90, description: "Recap and transition to Chapter 2" }
        ]
    },
    2: {
        sections: [
            { heading: "2.0 Introduction", defaultParas: 1, defaultWords: 50, description: "State that this chapter reviews literature, theories, and conceptual framework" },
            { heading: "2.1 Main Concept", defaultParas: 5, defaultWords: 140, description: "Definitions, purpose, types, success factors, and challenges" },
            { heading: "2.2 Theoretical Framework", defaultParas: 7, defaultWords: 140, description: "Core theory, empirical factors, and related studies showing research gap" },
            { heading: "2.3 Conceptual Framework", defaultParas: 2, defaultWords: 140, description: "Relationship between variables with diagram placeholder" },
            { heading: "2.4 Chapter Summary", defaultParas: 1, defaultWords: 110, description: "Summarize definitions, theory, and empirical factors" }
        ]
    },
    3: {
        sections: [
            { heading: "3.0 Introduction", defaultParas: 1, defaultWords: 40, description: "Outline methods, design, setting, sampling, data collection, and analysis" },
            { heading: "3.1 Research Design", defaultParas: 2, defaultWords: 140, description: "Define, apply, and justify the research design" },
            { heading: "3.2 Study Setting", defaultParas: 2, defaultWords: 140, description: "Describe and justify the study area" },
            { heading: "3.3 Sampling Technique", defaultParas: 2, defaultWords: 140, description: "Define, apply technique and respondents, justify" },
            { heading: "3.4 Data Collection", defaultParas: 6, defaultWords: 140, description: "Primary, secondary data collection and detailed breakdown by objectives" },
            { heading: "3.5 Data Analysis", defaultParas: 2, defaultWords: 140, description: "Define, apply thematic or statistical methods" },
            { heading: "3.6 Ethical consideration", defaultParas: 1, defaultWords: 100, description: "Informed consent, anonymity, voluntary participation" },
            { heading: "3.7 Chapter summary", defaultParas: 1, defaultWords: 110, description: "Recap design and transition to Chapter 4" }
        ]
    },
    4: {
        sections: [
            { heading: "4.0 Introduction", defaultParas: 1, defaultWords: 60, description: "Overview of findings presentation" },
            { heading: "4.1 Response Rate", defaultParas: 1, defaultWords: 60, description: "Survey/interview response statistics" },
            { heading: "4.2 Context", defaultParas: 2, defaultWords: 140, description: "General development/situation before analysis" },
            { heading: "4.3 Findings on Theme 1", defaultParas: 3, defaultWords: 140, description: "Narrative, quote, discussion using sandwich method" },
            { heading: "4.4 Findings on Theme 2", defaultParas: 2, defaultWords: 140, description: "Narrative, quote, discussion using sandwich method" },
            { heading: "4.5 Evaluation", defaultParas: 3, defaultWords: 140, description: "Critical analysis against Ch2 theory, optimal vs sub-optimal" },
            { heading: "4.6 Key Challenges", defaultParas: 1, defaultWords: 100, description: "Bullet points of identified challenges" },
            { heading: "4.7 Chapter Conclusion", defaultParas: 2, defaultWords: 110, description: "Summary and transition" }
        ]
    },
    5: {
        sections: [
            { heading: "5.0 Introduction", defaultParas: 1, defaultWords: 60, description: "Overview of conclusions and recommendations" },
            { heading: "5.1 Conclusions", defaultParas: 3, defaultWords: 140, description: "Verdict on main objective, synthesis, implications" },
            { heading: "5.2 Recommendations", defaultParas: 5, defaultWords: 140, description: "Model-based recommendations citing international examples" },
            { heading: "5.3 Areas for Further Research", defaultParas: 1, defaultWords: 60, description: "Suggestions for future studies" }
        ]
    }
};

let currentMode = null; // 'assignment' or 'dissertation'

/* =========================================================
   CITATIONS MANAGER STATE
   ========================================================= */
let citationsManagerCitations = [];  // Array of citation objects for the manager
let citationsManagerContext = null;  // { mode: 'assignment' | 'dissertation', chapterNum: n }
let citationsPdfInput = null;        // hidden file input for PDF uploads

/* =========================================================
   WORD COUNT HELPERS
   ========================================================= */
function applyBodyWordsTotal(total) {
    // Distribute total words across all body paragraphs
    const bodyParas = state.plan.filter(p => p.section === 'Body');
    if (!bodyParas.length) { showNotification('No body paragraphs to update.', 'error'); return; }
    const perPara = Math.round(total / bodyParas.length);
    state.plan.forEach((p, i) => {
        if (p.section === 'Body') {
            p.words = perPara;
            // Update display
            const disp = document.getElementById(`words-display-${i}`);
            const edit = document.getElementById(`words-edit-${i}`);
            if (disp) disp.textContent = perPara + ' words';
            if (edit) edit.value = perPara;
        }
    });
    saveAssignment();
    showNotification(`Body paragraphs updated: ~${perPara} words each (${total} total).`, 'success');
}

function applyIntroConcWords(total) {
    // Split between intro and conclusion
    const half = Math.round(total / 2);
    state.plan.forEach((p, i) => {
        if (p.section === 'Introduction' || p.section === 'Conclusion') {
            p.words = half;
            const disp = document.getElementById(`words-display-${i}`);
            const edit = document.getElementById(`words-edit-${i}`);
            if (disp) disp.textContent = half + ' words';
            if (edit) edit.value = half;
        }
    });
    saveAssignment();
    showNotification(`Intro & Conclusion updated: ~${half} words each (${total} total).`, 'success');
}

function applyPlanCitationCount(count) {
    state.refs = parseInt(count) || state.refs;
    saveAssignment();
    showNotification(`Citation target updated to ${state.refs}.`, 'success');
}

function renderPlanControls() {
    // Calculate current totals
    const bodyTotal = state.plan.filter(p => p.section === 'Body').reduce((s, p) => s + (p.words || 0), 0);
    const icTotal = state.plan.filter(p => p.section === 'Introduction' || p.section === 'Conclusion').reduce((s, p) => s + (p.words || 0), 0);
    return `
    <div class="plan-controls-panel" id="plan-controls-panel">
        <h4><i class="fas fa-sliders-h"></i> Plan Word Count & Citation Settings</h4>
        <div class="plan-controls-grid">
            <div class="plan-ctrl-item">
                <label><i class="fas fa-align-left"></i> Body Paragraphs — Total Words (all combined)</label>
                <div class="plan-ctrl-row">
                    <input type="number" id="ctrl-body-total" value="${bodyTotal}" min="100" max="10000" step="50">
                    <button class="plan-ctrl-ok" onclick="applyBodyWordsTotal(parseInt(document.getElementById('ctrl-body-total').value))">OK</button>
                </div>
                <div class="plan-ctrl-hint">Words shared equally across ${state.plan.filter(p=>p.section==='Body').length} body paragraph(s)</div>
            </div>
            <div class="plan-ctrl-item">
                <label><i class="fas fa-bookmark"></i> Intro + Conclusion — Combined Words</label>
                <div class="plan-ctrl-row">
                    <input type="number" id="ctrl-ic-total" value="${icTotal}" min="50" max="2000" step="20">
                    <button class="plan-ctrl-ok" onclick="applyIntroConcWords(parseInt(document.getElementById('ctrl-ic-total').value))">OK</button>
                </div>
                <div class="plan-ctrl-hint">Split equally between Introduction and Conclusion</div>
            </div>
            <div class="plan-cite-ctrl">
                <label><i class="fas fa-quote-right"></i> Citations target:</label>
                <input type="number" id="ctrl-cite-count" value="${state.refs}" min="1" max="30" step="1">
                <button class="plan-ctrl-ok" onclick="applyPlanCitationCount(document.getElementById('ctrl-cite-count').value)">OK</button>
                <span class="plan-cite-badge">Number of academic citations to include in your essay</span>
            </div>
        </div>
    </div>`;
}

function renderDissertationPlanControls(chapterNum) {
    return `
    <div class="plan-controls-panel" id="diss-plan-controls-panel" style="margin-top:20px;">
        <h4><i class="fas fa-sliders-h"></i> Word Count & Citation Settings for this Chapter</h4>
        <div class="plan-controls-grid">
            <div class="plan-ctrl-item">
                <label><i class="fas fa-align-left"></i> Body Sections — Total Words (all combined)</label>
                <div class="plan-ctrl-row">
                    <input type="number" id="diss-ctrl-body-total" value="1680" min="200" max="20000" step="100">
                    <button class="plan-ctrl-ok" onclick="applyDissBodyWordsTotal(${chapterNum}, parseInt(document.getElementById('diss-ctrl-body-total').value))">OK</button>
                </div>
                <div class="plan-ctrl-hint">Distributed across body sections (excludes intro/summary)</div>
            </div>
            <div class="plan-ctrl-item">
                <label><i class="fas fa-bookmark"></i> Intro + Summary — Combined Words</label>
                <div class="plan-ctrl-row">
                    <input type="number" id="diss-ctrl-ic-total" value="200" min="50" max="2000" step="10">
                    <button class="plan-ctrl-ok" onclick="applyDissIntroConcWords(${chapterNum}, parseInt(document.getElementById('diss-ctrl-ic-total').value))">OK</button>
                </div>
                <div class="plan-ctrl-hint">Split between chapter introduction and summary</div>
            </div>
            <div class="plan-cite-ctrl">
                <label><i class="fas fa-quote-right"></i> Citations per chapter:</label>
                <input type="number" id="diss-ctrl-cite-count" value="13" min="1" max="40" step="1">
                <button class="plan-ctrl-ok" onclick="applyDissCitationCount(${chapterNum}, parseInt(document.getElementById('diss-ctrl-cite-count').value))">OK</button>
                <span class="plan-cite-badge">Default: 13 citations per chapter</span>
            </div>
        </div>
    </div>`;
}

function applyDissBodyWordsTotal(chapterNum, total) {
    const plan = dissState.chapters[chapterNum].plan;
    if (!plan) return;
    const bodySections = plan.filter(s => s.paragraphs > 0 && 
        !s.heading.includes('Introduction') && !s.heading.match(/\d+\.0/) &&
        !s.heading.toLowerCase().includes('summary') && !s.heading.toLowerCase().includes('conclusion') &&
        s.paragraphs > 0);
    if (!bodySections.length) { showNotification('No body sections found.', 'error'); return; }
    const totalParas = bodySections.reduce((s, sec) => s + sec.paragraphs, 0);
    const perPara = Math.round(total / totalParas);
    bodySections.forEach(sec => { sec.wordsPerPara = perPara; });
    saveDissertation();
    showChapterPlanModal(chapterNum, plan);
    showNotification(`Body sections updated to ~${perPara} words/para.`, 'success');
}

function applyDissIntroConcWords(chapterNum, total) {
    const plan = dissState.chapters[chapterNum].plan;
    if (!plan) return;
    const half = Math.round(total / 2);
    plan.forEach(sec => {
        if (sec.heading.match(/\d+\.0/) || sec.heading.toLowerCase().includes('introduction') ||
            sec.heading.toLowerCase().includes('summary') || sec.heading.toLowerCase().includes('conclusion')) {
            sec.wordsPerPara = half;
        }
    });
    saveDissertation();
    showChapterPlanModal(chapterNum, plan);
    showNotification(`Intro & Summary sections updated to ~${half} words each.`, 'success');
}

function applyDissCitationCount(chapterNum, count) {
    if (!dissState.chapters[chapterNum]) return;
    dissState.chapters[chapterNum].targetCitations = count;
    saveDissertation();
    showNotification(`Chapter ${chapterNum} citation target set to ${count}.`, 'success');
}

/* =========================================================
   CITATIONS MANAGER
   ========================================================= */
async function showCitationsManager(context, citations) {
    citationsManagerContext = context;
    citationsManagerCitations = citations.map((c, i) => ({ ...c, id: i, userUploaded: false }));

    // Show a loading state first
    appendMsg('ai', `
        <h3><i class="fas fa-book-open"></i> Building Citations List</h3>
        <p>Generating overviews for ${citationsManagerCitations.length} citations…</p>
        <div class="loading-indicator"><div class="loading-spinner"></div><span>Preparing citations…</span></div>
    `);
    setStatus('Preparing citations…');

    // Generate overviews for each citation
    try {
        const prompt = `For each of these academic citations, write a single short sentence (max 20 words) describing what the source covers and why it is relevant to academic research. Return ONLY a JSON array of objects with "index" (0-based) and "overview" keys.

Citations:
${citations.map((c, i) => `[${i}] ${c.author} (${c.year}). "${c.title}". ${c.journal || ''}`).join('\n')}

Topic context: ${context.mode === 'assignment' ? state.topic : dissState.topic}

Return only the JSON array. No markdown.`;

        const raw = await callGeminiAPI(prompt);
        const overviews = JSON.parse(raw.replace(/```json/g,'').replace(/```/g,'').trim());
        overviews.forEach(o => {
            if (citationsManagerCitations[o.index]) {
                citationsManagerCitations[o.index].overview = o.overview;
            }
        });
    } catch (e) {
        // Add generic overviews if generation fails
        citationsManagerCitations.forEach((c, i) => {
            if (!c.overview) c.overview = `Academic source covering ${c.title || 'research topic'}.`;
        });
    }

    renderCitationsManagerUI();
    setStatus('Ready');
}

function renderCitationsManagerUI() {
    const ctx = citationsManagerContext;
    const title = ctx.mode === 'dissertation' ? `Chapter ${ctx.chapterNum} Citations` : 'Essay Citations';

    let itemsHtml = '';
    citationsManagerCitations.forEach((c, i) => {
        const doi = c.doi ? `https://doi.org/${c.doi}` : null;
        const gschol = `https://scholar.google.com/scholar?q=${encodeURIComponent((c.author||'') + ' ' + (c.title||''))}`;
        const linkUrl = c.url || doi || gschol;
        const linkLabel = c.doi ? `DOI: ${c.doi}` : 'Google Scholar';
        const badge = c.userUploaded ? '<span style="font-size:0.7rem;background:var(--accent-lt);color:var(--accent);padding:2px 6px;border-radius:4px;font-weight:600;">Your PDF</span>' : '';

        itemsHtml += `
        <div class="citation-item ${c.userUploaded ? 'user-uploaded' : ''}" id="cite-item-${i}">
            <div class="citation-num">${i + 1}</div>
            <div class="citation-body">
                <div class="citation-title">${escHtml(c.author || '')} (${escHtml(String(c.year || ''))}) ${badge}</div>
                <div class="citation-meta">${escHtml(c.title || '')}${c.journal ? ' — <em>' + escHtml(c.journal) + '</em>' : ''}</div>
                ${c.overview ? `<div class="citation-overview">${escHtml(c.overview)}</div>` : ''}
                <a href="${linkUrl}" target="_blank" class="citation-link"><i class="fas fa-external-link-alt"></i> ${linkLabel}</a>
            </div>
            <div class="citation-actions">
                <button class="btn-cite-regen" onclick="regenCitationInManager(${i})" id="cite-regen-${i}">
                    <i class="fas fa-sync"></i> Regenerate
                </button>
                <button class="btn-cite-delete" onclick="removeCitationFromManager(${i})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>`;
    });

    const managerHtml = `
    <div class="citations-manager">
        <div class="citations-manager-header">
            <h3><i class="fas fa-quote-right" style="color:var(--primary)"></i> ${title}</h3>
            <span style="font-size:0.8rem;color:var(--text-3);">${citationsManagerCitations.length} citations</span>
        </div>
        <p style="font-size:0.85rem;color:var(--text-2);margin-bottom:12px;">Review, manage, and customise the citations below. All citations will be referenced in your writing. You can delete unwanted ones, upload your own PDF sources, or regenerate any citation.</p>
        <div class="citations-list" id="citations-list">
            ${itemsHtml}
        </div>
        <div class="citations-add-row">
            <button class="btn-add-pdf" onclick="triggerCitationPdfUpload()">
                <i class="fas fa-file-pdf"></i> Add Your Own PDF Source
            </button>
            <span style="font-size:0.78rem;color:var(--text-3);">Upload a PDF to include your own source in the list</span>
        </div>
        <div class="citations-proceed-row">
            <span class="cite-count-badge" id="cite-count-badge">${citationsManagerCitations.length} citation(s) will be used</span>
            <button class="btn-outline" onclick="regenAllCitationsInManager()">
                <i class="fas fa-sync-alt"></i> Regenerate All
            </button>
            <button class="btn-primary" onclick="proceedFromCitationsManager()">
                <i class="fas fa-pen-fancy"></i> Proceed & Start Writing
            </button>
        </div>
    </div>`;

    replaceLastMsg(managerHtml);

    // Ensure the hidden PDF input exists
    if (!document.getElementById('citation-pdf-input')) {
        const inp = document.createElement('input');
        inp.type = 'file';
        inp.id = 'citation-pdf-input';
        inp.accept = '.pdf';
        inp.style.display = 'none';
        inp.addEventListener('change', handleCitationPdfUploadNew);
        document.body.appendChild(inp);
    }
}

function updateCiteCountBadge() {
    const badge = document.getElementById('cite-count-badge');
    if (badge) badge.textContent = `${citationsManagerCitations.length} citation(s) will be used`;
}

function removeCitationFromManager(index) {
    citationsManagerCitations.splice(index, 1);
    // Re-assign IDs
    citationsManagerCitations.forEach((c, i) => c.id = i);
    renderCitationsManagerUI();
    updateCiteCountBadge();
}

async function regenCitationInManager(index) {
    const c = citationsManagerCitations[index];
    const item = document.getElementById(`cite-item-${index}`);
    const btn = document.getElementById(`cite-regen-${index}`);
    if (!item || !btn) return;

    item.classList.add('regenerating');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Regenerating…';
    btn.disabled = true;

    const topic = citationsManagerContext.mode === 'assignment' ? state.topic : dissState.topic;
    try {
        const prompt = `Generate one alternative high-quality academic citation to replace this source for an essay/dissertation on: "${topic}".

Replace this citation:
Author: ${c.author}, Year: ${c.year}, Title: ${c.title}, Journal: ${c.journal || 'N/A'}

Rules:
1. Must be a REAL, verifiable academic work
2. Year: 2015-2024
3. Must be directly relevant to the topic
4. Include a valid DOI (format: 10.XXXX/xxxxx)
5. Provide a brief overview (1 sentence, max 20 words)

Return ONLY a JSON object:
{"author":"Smith, J. A.","year":"2021","title":"Realistic title","journal":"Journal Name","volume":"12","issue":"3","pages":"45-67","doi":"10.1016/j.example.2021.001","relevance":"Why this source is relevant","overview":"One sentence overview of what this source covers"}`;

        const raw = await callGeminiAPI(prompt);
        const newCite = JSON.parse(raw.replace(/```json/g,'').replace(/```/g,'').trim());
        newCite.id = index;
        newCite.userUploaded = false;
        citationsManagerCitations[index] = newCite;
        renderCitationsManagerUI();
        showNotification('Citation regenerated successfully.', 'success');
    } catch (e) {
        item.classList.remove('regenerating');
        btn.innerHTML = '<i class="fas fa-sync"></i> Regenerate';
        btn.disabled = false;
        showNotification('Failed to regenerate citation. Try again.', 'error');
    }
}

async function regenAllCitationsInManager() {
    const topic = citationsManagerContext.mode === 'assignment' ? state.topic : dissState.topic;
    const count = citationsManagerCitations.filter(c => !c.userUploaded).length;
    if (!count) return;

    appendMsg('ai', `
        <h3><i class="fas fa-sync fa-spin"></i> Regenerating All Citations</h3>
        <p>Finding ${count} fresh citations for your topic…</p>
        <div class="loading-indicator"><div class="loading-spinner"></div><span>Searching…</span></div>
    `);
    setStatus('Regenerating citations…');

    try {
        const prompt = `Generate exactly ${count} high-quality academic citations for a dissertation/essay on: "${topic}".

Rules:
1. All must be REAL, verifiable academic works
2. Years: 2015-2024 (1-2 seminal older works allowed)
3. Include real DOIs (format: 10.XXXX/xxxxx)
4. Mix of journals, books (1-2), and reports
5. Each must include a brief overview (1 sentence, max 20 words)

Return ONLY a JSON array:
[{"author":"Smith, J. A.","year":"2021","title":"Title","journal":"Journal Name","volume":"12","issue":"3","pages":"45-67","doi":"10.1016/j.example.2021.001","relevance":"Why relevant","overview":"One sentence overview"}]`;

        const raw = await callGeminiAPI(prompt);
        const newCites = JSON.parse(raw.replace(/```json/g,'').replace(/```/g,'').trim());

        // Replace non-user-uploaded ones
        const userUploaded = citationsManagerCitations.filter(c => c.userUploaded);
        citationsManagerCitations = [
            ...newCites.map((c, i) => ({ ...c, id: i, userUploaded: false })),
            ...userUploaded.map((c, i) => ({ ...c, id: newCites.length + i }))
        ];

        // Replace last message
        renderCitationsManagerUI();
        setStatus('Ready');
    } catch (e) {
        replaceLastMsg(`
            <h3><i class="fas fa-exclamation-triangle"></i> Error</h3>
            <p>Failed to regenerate citations. Please try again.</p>
            <button class="btn-primary" onclick="regenAllCitationsInManager()"><i class="fas fa-redo"></i> Try Again</button>
        `);
        setStatus('Error');
    }
}

function triggerCitationPdfUpload() {
    const inp = document.getElementById('citation-pdf-input');
    if (inp) inp.click();
}

async function handleCitationPdfUploadNew(e) {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = '';
    showNotification('Processing your PDF…', 'info');
    try {
        const text = await extractPdfText(file);
        const topic = citationsManagerContext.mode === 'assignment' ? state.topic : dissState.topic;
        const prompt = `Extract the citation details from this PDF content and return as a JSON object. If you cannot extract full details, make reasonable inferences from the text.

PDF Content (first 2000 chars):
"""
${text.substring(0, 2000)}
"""

Return ONLY a JSON object:
{"author":"Author names in APA format","year":"Publication year","title":"Document title","journal":"Journal or publisher name if applicable","pages":"","doi":"","overview":"One sentence description of what this source covers (max 20 words)","relevance":"How this relates to: ${topic}"}`;

        const raw = await callGeminiAPI(prompt);
        const citeData = JSON.parse(raw.replace(/```json/g,'').replace(/```/g,'').trim());
        citeData.userUploaded = true;
        citeData.id = citationsManagerCitations.length;
        citeData.url = ''; // local PDF
        citationsManagerCitations.push(citeData);
        renderCitationsManagerUI();
        showNotification(`PDF "${file.name}" added to citations!`, 'success');
    } catch (err) {
        console.error('PDF citation error:', err);
        // Add with minimal info
        citationsManagerCitations.push({
            id: citationsManagerCitations.length,
            author: file.name.replace('.pdf',''),
            year: new Date().getFullYear().toString(),
            title: file.name.replace('.pdf',''),
            journal: 'Uploaded PDF',
            overview: 'User-uploaded PDF source.',
            userUploaded: true
        });
        renderCitationsManagerUI();
        showNotification(`PDF added (could not extract full metadata).`, 'warning');
    }
}

function proceedFromCitationsManager() {
    // Update sources with the managed citations
    const ctx = citationsManagerContext;
    if (ctx.mode === 'assignment') {
        state.sources = citationsManagerCitations.map(c => ({
            author: c.author, year: c.year, title: c.title,
            journal: c.journal || '', volume: c.volume || '', issue: c.issue || '',
            pages: c.pages || '', doi: c.doi || '', relevance: c.relevance || '',
            url: c.url || (c.doi ? `https://doi.org/${c.doi}` : '')
        }));
        saveAssignment();
        draftAllParagraphs();
    } else {
        // dissertation mode
        const chapterNum = ctx.chapterNum;
        dissState.chapters[chapterNum].approvedCitations = citationsManagerCitations;
        saveDissertation();
        generateChapterContent(chapterNum, dissState.chapters[chapterNum].userInstructions);
    }
}

/* =========================================================
   INITIALIZATION
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    initPage();
});

function initPage() {
    // Show landing page by default
    document.getElementById('landing-page').style.display = 'block';
    document.getElementById('app-layout').style.display = 'none';
    document.body.classList.add('landing-active');

    // Wire up the file input ONCE globally — works in both assignment and dissertation mode
    const fileInput = document.getElementById('file-input');
    if (fileInput && !fileInput._globalBound) {
        fileInput._globalBound = true;
        fileInput.addEventListener('change', e => {
            const file = e.target.files[0];
            if (file) handleFileUpload(file);
            fileInput.value = ''; // reset so same file can be re-selected
        });
    }
}

/* =========================================================
   LANDING PAGE & SERVICE SELECTION
   ========================================================= */
function selectService(service) {
    if (service === 'assignment') {
        currentMode = 'assignment';
        initAssignmentMode();
    } else if (service === 'dissertation') {
        currentMode = 'dissertation';
        initDissertationMode();
    } else {
        // Show coming soon modal
        const messages = {
            'article': 'Article composition is coming soon! This feature will help you write research articles and academic papers with proper formatting and citations.',
            'humanizer': 'Text humanizer is coming soon! This feature will help you make AI-generated text sound more natural and human-like.'
        };
        
        document.getElementById('coming-soon-message').textContent = messages[service] || 'This feature is coming soon!';
        document.getElementById('coming-soon-modal').style.display = 'flex';
    }
}

function closeComingSoonModal() {
    document.getElementById('coming-soon-modal').style.display = 'none';
}

function goBackToLanding() {
    // Check which mode we're in and save appropriately
    if (currentMode === 'dissertation') {
        if (dissState.topic) {
            saveDissertation();
        }
        // Reset dissertation state for clean return
        dissState = {
            id: null,
            topic: "",
            program: "",
            region: "",
            selectedTopicData: null,
            hasConceptNote: false,
            conceptNote: "",
            currentChapter: 0,
            chapters: {
                1: { title: "Chapter 1: Study Overview", content: "", plan: null, approved: false },
                2: { title: "Chapter 2: Literature Review", content: "", plan: null, approved: false },
                3: { title: "Chapter 3: Research Methodology", content: "", plan: null, approved: false },
                4: { title: "Chapter 4: Findings", content: "", plan: null, approved: false },
                5: { title: "Chapter 5: Conclusions & Recommendations", content: "", plan: null, approved: false }
            },
            researchData: "",
            references: "",
            chapterCitations: {},
            approvedCitations: {},
            createdAt: null,
            lastModified: null
        };
    } else if (currentMode === 'assignment') {
        if (state.topic) {
            saveAssignment();
        }
        // Reset essay state for clean return
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
    }
    
    // Hide app and show landing
    document.getElementById('app-layout').style.display = 'none';
    document.getElementById('landing-page').style.display = 'block';
    document.body.classList.add('landing-active');
    window.scrollTo(0, 0);
    
    // Reset mode
    currentMode = null;
}

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

/* =========================================================
   ASSIGNMENT MODE INITIALIZATION
   ========================================================= */
function initAssignmentMode() {
    // Hide landing page and show the app
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('app-layout').style.display = 'flex';
    document.body.classList.remove('landing-active');
    document.querySelector('.sidebar-brand .brand-text span').innerHTML = 'Anonemasi <strong>Writer</strong>';
    document.querySelector('.sidebar-brand .logo').innerHTML = '<i class="fas fa-feather-alt"></i>';
    
    // Reset step tracker to assignment mode
    const stepItems = document.querySelectorAll('.st-item');
    if (stepItems.length >= 4) {
        stepItems[0].innerHTML = '<span class="st-num">1</span> Analyze';
        stepItems[1].innerHTML = '<span class="st-num">2</span> Citations';
        stepItems[2].innerHTML = '<span class="st-num">3</span> Plan';
        stepItems[3].innerHTML = '<span class="st-num">4</span> Draft';
    }
    
    // Clear chat thread
    const chatThread = document.getElementById('chat-thread');
    chatThread.innerHTML = '';
    
    // Reset welcome message for assignment mode
    const welcomeMsg = document.createElement('div');
    welcomeMsg.className = 'msg ai-msg';
    welcomeMsg.id = 'welcome-msg';
    welcomeMsg.innerHTML = `
        <div class="avatar-box"><i class="fas fa-feather-alt"></i></div>
        <div class="msg-content">
            <p class="msg-label">Anonemasi Writer</p>
            <h2>Welcome to your writing workspace.</h2>
            <p>Upload your essay brief or paste your requirements below. I'll analyze it thoroughly, find academic sources, build a comprehensive plan that covers every angle of your topic, then draft each paragraph with proper citations and validated letter frequency — all visible right here as I work.</p>
            <div id="drop-zone" class="upload-zone">
                <i class="fas fa-cloud-upload-alt"></i>
                <p><strong>Drop your essay brief here</strong></p>
                <span>PDF or DOCX supported · or paste text below</span>
            </div>
        </div>
    `;
    chatThread.appendChild(welcomeMsg);
    
    // Reset sidebar
    const navItem = document.querySelector('.nav-item');
    if (navItem) {
        navItem.innerHTML = '<i class="fas fa-plus-circle"></i> New Essay';
        navItem.setAttribute('onclick', 'startNewAssignment()');
    }
    
    // Load saved assignments
    updateSavedAssignmentsList();
    
    // Re-initialize drop zone
    initDropZone();
    
    // Reset export button
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
        exportBtn.onclick = exportToWord;
        exportBtn.disabled = true;
        exportBtn.classList.remove('ready');
    }
    
    // Reset step tracker
    setActiveStep(1);
}

/* =========================================================
   DISSERTATION MODE INITIALIZATION
   ========================================================= */
function initDissertationMode() {
    // Hide landing page and show the app
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('app-layout').style.display = 'flex';
    document.body.classList.remove('landing-active');
    
    // Update branding for dissertation mode
    document.querySelector('.sidebar-brand .brand-text span').innerHTML = 'Anonemasi <strong>Dissertation</strong>';
    document.querySelector('.sidebar-brand .logo').innerHTML = '<i class="fas fa-book"></i>';
    
    // Update step tracker
    const stepItems = document.querySelectorAll('.st-item');
    if (stepItems.length >= 4) {
        stepItems[0].innerHTML = '<span class="st-num">1</span> Topic';
        stepItems[1].innerHTML = '<span class="st-num">2</span> Concept';
        stepItems[2].innerHTML = '<span class="st-num">3</span> Chapters';
        stepItems[3].innerHTML = '<span class="st-num">4</span> Export';
    }
    
    // Clear chat and show dissertation welcome
    const chatThread = document.getElementById('chat-thread');
    chatThread.innerHTML = '';
    
    const welcomeMsg = document.createElement('div');
    welcomeMsg.className = 'msg ai-msg';
    welcomeMsg.id = 'welcome-msg';
    welcomeMsg.innerHTML = `
        <div class="avatar-box"><i class="fas fa-book"></i></div>
        <div class="msg-content">
            <p class="msg-label">Dissertation Writer</p>
            <h2>Welcome to your dissertation workspace.</h2>
            <p>I'll help you create a comprehensive research dissertation with proper academic structure, citations, and methodology. Let's start by either generating topic suggestions or you can provide your own topic and existing content.</p>
            <div class="topic-options-grid">
                <button class="option-btn-diss" onclick="startTopicGeneration()">
                    <i class="fas fa-lightbulb"></i>
                    <span>Generate Topics</span>
                    <small>Get 10 research topics</small>
                </button>
                <button class="option-btn-diss" onclick="showManualTopicInput()">
                    <i class="fas fa-keyboard"></i>
                    <span>Manual Topic</span>
                    <small>Enter your topic</small>
                </button>
                <button class="option-btn-diss" onclick="showUploadExisting()">
                    <i class="fas fa-upload"></i>
                    <span>Upload Existing</span>
                    <small>Continue from draft</small>
                </button>
            </div>
        </div>
    `;
    chatThread.appendChild(welcomeMsg);
    
    // Update sidebar
    const navItem = document.querySelector('.nav-item');
    if (navItem) {
        navItem.innerHTML = '<i class="fas fa-plus-circle"></i> New Dissertation';
        navItem.setAttribute('onclick', 'startNewDissertation()');
    }
    
    // Load saved dissertations
    updateSavedDissertationsList();
    
    // Reset export button
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
        exportBtn.onclick = exportDissertation;
        exportBtn.disabled = true;
        exportBtn.classList.remove('ready');
    }
    
    // Reset step tracker
    setActiveStep(1);

    // Ensure revision mode is cleared
    revisionState = { active: false, chapterNum: null, awaitingConfirm: false, pendingPlan: null, pendingComments: null, extractedComments: null };

    // Reset attach button to default
    updateAttachButton();
}

/* =========================================================
   DISSERTATION TOPIC GENERATION
   ========================================================= */
function startTopicGeneration() {
    document.getElementById('topic-gen-modal').style.display = 'flex';
}

function closeTopicGenModal() {
    document.getElementById('topic-gen-modal').style.display = 'none';
}

async function generateTopics() {
    const program = document.getElementById('topic-program').value.trim();
    const region = document.getElementById('topic-region').value.trim();
    const interest = document.getElementById('topic-interest').value.trim();
    
    if (!program || !region) {
        showNotification('Please fill in program and region', 'error');
        return;
    }
    
    // Close modal
    closeTopicGenModal();
    
    // Show generating message with loading indicator
    appendMsg('ai', `
        <h3><i class="fas fa-magic"></i> Generating Research Topics</h3>
        <p>Creating 10 research topics for ${escHtml(program)} in ${escHtml(region)}...</p>
        <div class="loading-indicator">
            <div class="loading-spinner"></div>
            <span>Generating topics...</span>
        </div>
    `);
    
    setStatus('Generating topics...');
    
    try {
        const prompt = `Generate 10 research topics for a student in ${program} situated in ${region}, Malawi. 
${interest ? `The user is specifically interested in: "${interest}". Focus topics around this.` : ''}

CRITICAL INSTRUCTIONS:
1. **TITLE:** Must explicitly include the specific study site (e.g., "Analysis of X in Ndirande, Blantyre").
2. **RESEARCH GAP:** You must act like an excellent scholar. Search your knowledge base for how top researchers write problem statements. Formulate a sophisticated "Research Gap" that explains exactly what is missing in current literature (e.g., "While global studies exist on X, there is a paucity of empirical data regarding Y in the specific context of Z...").
3. **SITE:** Choose a real, specific location within ${region}.
4. **REFERENCES:** Provide at least 5 valid, real-sounding citations.

Format strictly as a JSON Array of objects. 
Each object must have: 
"title", 
"problem" (1 sentence), 
"gap" (2-3 sentences explaining the academic gap),
"site" (The specific place name),
"site_rationale" (1 sentence explanation),
"refs" (Array of at least 5 strings). 

Do NOT use Markdown. Just raw JSON.`;

        const response = await callGeminiAPI(prompt);
        
        // Parse response
        const clean = response.replace(/```json/g, '').replace(/```/g, '').trim();
        const topics = JSON.parse(clean);
        
        // Display topics
        let topicsHtml = `
            <h3><i class="fas fa-check-circle"></i> Generated Research Topics</h3>
            <p>Select a topic to begin your dissertation:</p>
            <div class="topics-grid">
        `;
        
        topics.forEach((t, i) => {
            let refsHtml = '';
            if (Array.isArray(t.refs)) {
                refsHtml = t.refs.map(ref => {
                    const searchUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(ref)}`;
                    return `<a href="${searchUrl}" target="_blank" class="ref-link"><i class="fas fa-external-link-alt"></i> ${escHtml(ref)}</a>`;
                }).join('');
            }
            
            topicsHtml += `
                <div class="topic-card" data-index="${i}" data-topic='${JSON.stringify(t).replace(/'/g, "&apos;")}'>
                    <h4>${i+1}. ${escHtml(t.title)}</h4>
                    <p style="font-size:0.9rem; margin:5px 0; color:#555;">${escHtml(t.problem)}</p>
                    
                    <div class="gap-box">
                        <div class="gap-title"><i class="fas fa-lightbulb"></i> Research Gap</div>
                        <div class="gap-text">${escHtml(t.gap)}</div>
                    </div>

                    <div class="location-box">
                        <div class="location-title"><i class="fas fa-map-marker-alt"></i> Study Site: ${escHtml(t.site)}</div>
                        <div class="location-reason">" ${escHtml(t.site_rationale)} "</div>
                    </div>

                    <div style="margin-top:10px; border-top:1px solid #eee; padding-top:5px;">
                        <small style="color:#007A33; font-weight:bold;">Recommended References (Click to Verify):</small>
                        <div style="margin-top:5px;">${refsHtml}</div>
                    </div>
                </div>
            `;
        });
        
        topicsHtml += '</div>';
        
        // Replace loading message with topics
        const messages = document.querySelectorAll('.msg');
        const lastMsg = messages[messages.length - 1];
        lastMsg.querySelector('.msg-content').innerHTML = topicsHtml;
        
        // Add click event listeners to topic cards
        setTimeout(() => {
            document.querySelectorAll('.topic-card').forEach(card => {
                card.addEventListener('click', function(e) {
                    // Don't trigger if clicking on a reference link
                    if (e.target.tagName === 'A' || e.target.parentElement.tagName === 'A') return;
                    
                    const index = parseInt(this.dataset.index);
                    const topicData = JSON.parse(this.dataset.topic.replace(/&apos;/g, "'"));
                    selectTopic(index, topicData);
                });
            });
        }, 100);
        
        setStatus('Ready');
        setActiveStep(1);
        
    } catch (error) {
        console.error('Error generating topics:', error);
        appendMsg('ai', `
            <h3><i class="fas fa-exclamation-triangle"></i> Error</h3>
            <p>Sorry, I couldn't generate topics. Please try again or enter your topic manually.</p>
            <button class="btn-primary" onclick="startTopicGeneration()">
                <i class="fas fa-redo"></i> Try Again
            </button>
        `);
        setStatus('Error');
    }
}

function selectTopic(index, topicData) {
    dissState.topic = topicData.title;
    dissState.selectedTopicData = topicData;
    dissState.program = document.getElementById('topic-program').value;
    dissState.region = document.getElementById('topic-region').value;
    
    // Mark all topic cards as not selected except the chosen one
    const topicCards = document.querySelectorAll('.topic-card');
    topicCards.forEach((card, i) => {
        if (i === index) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
    
    // Show confirmation and concept note option
    appendMsg('ai', `
        <h3><i class="fas fa-check-circle"></i> Topic Selected</h3>
        <p><strong>Your research topic:</strong> ${escHtml(dissState.topic)}</p>
        <p>Before we start the chapters, would you like to create a Concept Note? A concept note is a brief document that outlines your research idea.</p>
        <div class="action-row" style="margin-top: 16px;">
            <button class="btn-outline" onclick="skipConceptNote()">
                <i class="fas fa-forward"></i> Skip Concept Note
            </button>
            <button class="btn-primary" onclick="generateConceptNote()">
                <i class="fas fa-file-alt"></i> Generate Concept Note
            </button>
        </div>
    `);
    
    saveDissertation();
    setActiveStep(2);
    
    // Scroll to the bottom to show the proceed button with delay
    setTimeout(() => {
        scrollToBottom();
    }, 300);
}

function showManualTopicInput() {
    document.getElementById('manual-topic-modal').style.display = 'flex';
}

function closeManualTopicModal() {
    document.getElementById('manual-topic-modal').style.display = 'none';
}

function submitManualTopicDiss() {
    const topic = document.getElementById('manual-topic-input').value.trim();
    
    if (!topic) {
        showNotification('Please enter a topic', 'error');
        return;
    }
    
    dissState.topic = topic;
    closeManualTopicModal();
    
    appendMsg('ai', `
        <h3><i class="fas fa-check-circle"></i> Topic Set</h3>
        <p><strong>Your research topic:</strong> ${escHtml(dissState.topic)}</p>
        <p>Before we start the chapters, would you like to create a Concept Note? A concept note is a brief document that outlines your research idea.</p>
        <div class="action-row" style="margin-top: 16px;">
            <button class="btn-outline" onclick="skipConceptNote()">
                <i class="fas fa-forward"></i> Skip Concept Note
            </button>
            <button class="btn-primary" onclick="generateConceptNote()">
                <i class="fas fa-file-alt"></i> Generate Concept Note
            </button>
        </div>
    `);
    
    saveDissertation();
    setActiveStep(2);
}

function showUploadExisting() {
    document.getElementById('upload-existing-modal').style.display = 'flex';
}

function closeUploadExistingModal() {
    document.getElementById('upload-existing-modal').style.display = 'none';
}

/* --- Import triggers --- */
function triggerImportConceptNote() {
    const input = document.getElementById('import-concept-note-input');
    input.onchange = handleConceptNoteImport;
    input.value = '';
    input.click();
}

function triggerImportChapter1() {
    const input = document.getElementById('import-chapter1-input');
    input.onchange = handleChapter1Import;
    input.value = '';
    input.click();
}

/* --- Parse a docx file and return plain text --- */
async function parseDocxToText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const result = await mammoth.extractRawText({ arrayBuffer: e.target.result });
                resolve(result.value);
            } catch (err) { reject(err); }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

/* --- Parse a docx file and return HTML --- */
async function parseDocxToHtml(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const result = await mammoth.convertToHtml({ arrayBuffer: e.target.result });
                resolve(result.value);
            } catch (err) { reject(err); }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

/* --- Handle concept note import --- */
async function handleConceptNoteImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    closeUploadExistingModal();

    appendMsg('ai', `<h3><i class="fas fa-spinner fa-spin"></i> Reading Concept Note...</h3><p>Extracting content from <strong>${escHtml(file.name)}</strong>...</p>`);
    setStatus('Reading file...');

    try {
        const text = await parseDocxToText(file);
        if (!text || text.trim().length < 10) {
            throw new Error('File appears to be empty or unreadable.');
        }

        // Store concept note
        dissState.conceptNote = text.trim();

        // Try to extract topic from concept note using AI
        let extractedTopic = dissState.topic;
        if (!extractedTopic) {
            try {
                const tp = await callGeminiAPI(`From the following concept note, extract the research topic/title in one concise sentence. Return ONLY the topic title, nothing else.\n\n${text.substring(0, 2000)}`);
                extractedTopic = tp.trim().replace(/^["']|["']$/g, '');
                dissState.topic = extractedTopic;
            } catch(_) {}
        }

        const messages = document.querySelectorAll('.msg');
        const lastMsg = messages[messages.length - 1];
        lastMsg.querySelector('.msg-content').innerHTML = `
            <h3><i class="fas fa-check-circle"></i> Concept Note Imported</h3>
            <p>Your concept note has been successfully imported${extractedTopic ? ` for the topic: <strong>${escHtml(extractedTopic)}</strong>` : ''}.</p>
            <div class="chapter-content" style="margin: 12px 0; max-height: 220px; overflow-y: auto;">
                <div class="chapter-title-display">Concept Note</div>
                <div class="chapter-text" style="white-space: pre-wrap; font-size: 0.92rem;">${escHtml(text.trim())}</div>
            </div>
            <p style="color: var(--text-muted); font-size: 0.88rem;"><i class="fas fa-info-circle"></i> Chapter 1 will be generated in line with the objectives and direction in this concept note.</p>
            <div class="action-row" style="margin-top: 16px;">
                <button class="btn-primary" onclick="startChapterWorkflowFromConceptNote()">
                    <i class="fas fa-bolt"></i> Generate Chapter 1
                </button>
            </div>
        `;
        saveDissertation();
        setStatus('Ready');
        setActiveStep(2);
    } catch (err) {
        console.error('Concept note import error:', err);
        const messages = document.querySelectorAll('.msg');
        const lastMsg = messages[messages.length - 1];
        lastMsg.querySelector('.msg-content').innerHTML = `
            <h3><i class="fas fa-exclamation-triangle"></i> Import Failed</h3>
            <p>Could not read the file: ${escHtml(err.message || 'Unknown error')}. Please make sure it is a valid .docx file.</p>
            <button class="btn-primary" onclick="showUploadExisting()"><i class="fas fa-redo"></i> Try Again</button>
        `;
        setStatus('Error');
    }
}

function startChapterWorkflowFromConceptNote() {
    dissState.currentChapter = 1;
    // Inject concept note into context so chapter plan uses it
    startChapterWorkflow(1);
}

/* --- Handle chapter 1 import --- */
async function handleChapter1Import(e) {
    const file = e.target.files[0];
    if (!file) return;
    closeUploadExistingModal();

    appendMsg('ai', `<h3><i class="fas fa-spinner fa-spin"></i> Reading Chapter 1...</h3><p>Extracting content from <strong>${escHtml(file.name)}</strong>...</p>`);
    setStatus('Reading file...');

    try {
        const html = await parseDocxToHtml(file);
        const text = await parseDocxToText(file);
        if (!text || text.trim().length < 10) {
            throw new Error('File appears to be empty or unreadable.');
        }

        // Store as chapter 1
        const chapterNum = 1;
        dissState.chapters[chapterNum].content = html || `<p>${escHtml(text)}</p>`;
        dissState.chapters[chapterNum].approved = true;
        dissState.currentChapter = chapterNum;

        // Try to extract topic
        if (!dissState.topic) {
            try {
                const tp = await callGeminiAPI(`From the following chapter text, extract the research topic/title in one concise sentence. Return ONLY the topic title, nothing else.\n\n${text.substring(0, 2000)}`);
                dissState.topic = tp.trim().replace(/^["']|["']$/g, '');
            } catch(_) {}
        }

        const messages = document.querySelectorAll('.msg');
        const lastMsg = messages[messages.length - 1];
        lastMsg.querySelector('.msg-content').innerHTML = `
            <h3><i class="fas fa-check-circle"></i> Chapter 1: Study Overview — Imported</h3>
            <div class="chapter-content">
                <div class="chapter-title-display">Chapter 1: Study Overview</div>
                <div class="chapter-text">${dissState.chapters[chapterNum].content}</div>
            </div>
            <div class="action-row" style="margin-top: 16px;">
                <button class="btn-outline" onclick="startChapterRevision(${chapterNum})">
                    <i class="fas fa-comment-dots"></i> Revise with Feedback
                </button>
                <button class="btn-outline" onclick="downloadChapter(${chapterNum})">
                    <i class="fas fa-download"></i> Download Chapter
                </button>
                <button class="btn-primary" onclick="proceedToNext(${chapterNum})">
                    <i class="fas fa-forward"></i> Continue to Chapter 2
                </button>
            </div>
            <div class="upload-or-generate-row" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border);">
                <span style="font-size:0.85rem; color:var(--text-muted); margin-right: 8px;">Or upload next chapter instead of generating:</span>
                <button class="btn-outline btn-sm" onclick="triggerUploadNextChapter(2)">
                    <i class="fas fa-upload"></i> Upload Chapter 2
                </button>
            </div>
        `;

        saveDissertation();
        setStatus('Ready');
        updateChapterTracker();
        updateExportButtonDiss();
        setActiveStep(2);
    } catch (err) {
        console.error('Chapter 1 import error:', err);
        const messages = document.querySelectorAll('.msg');
        const lastMsg = messages[messages.length - 1];
        lastMsg.querySelector('.msg-content').innerHTML = `
            <h3><i class="fas fa-exclamation-triangle"></i> Import Failed</h3>
            <p>Could not read the file: ${escHtml(err.message || 'Unknown error')}. Please make sure it is a valid .docx file.</p>
            <button class="btn-primary" onclick="showUploadExisting()"><i class="fas fa-redo"></i> Try Again</button>
        `;
        setStatus('Error');
    }
}

/* --- Generic: upload any chapter --- */
function triggerUploadNextChapter(chapterNum) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.doc,.docx';
    input.onchange = (e) => handleUploadedChapter(e, chapterNum);
    input.click();
}

async function handleUploadedChapter(e, chapterNum) {
    const file = e.target.files[0];
    if (!file) return;

    appendMsg('ai', `<h3><i class="fas fa-spinner fa-spin"></i> Reading Chapter ${chapterNum}...</h3><p>Extracting content from <strong>${escHtml(file.name)}</strong>...</p>`);
    setStatus('Reading file...');

    try {
        const html = await parseDocxToHtml(file);
        const text = await parseDocxToText(file);
        if (!text || text.trim().length < 10) throw new Error('File appears to be empty or unreadable.');

        dissState.chapters[chapterNum].content = html || `<p>${escHtml(text)}</p>`;
        dissState.chapters[chapterNum].approved = true;
        dissState.currentChapter = chapterNum;

        const chapterTitle = dissState.chapters[chapterNum].title || `Chapter ${chapterNum}`;
        const nextChapter = chapterNum + 1;

        // Build next action buttons
        let nextActions = '';
        if (chapterNum < 5) {
            nextActions = `
                <button class="btn-primary" onclick="proceedToNext(${chapterNum})">
                    <i class="fas fa-forward"></i> Generate Chapter ${nextChapter}
                </button>`;
            if (chapterNum < 4) {
                nextActions += `
                <div class="upload-or-generate-row" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border);">
                    <span style="font-size:0.85rem; color:var(--text-muted); margin-right: 8px;">Or upload next chapter:</span>
                    <button class="btn-outline btn-sm" onclick="triggerUploadNextChapter(${nextChapter})">
                        <i class="fas fa-upload"></i> Upload Chapter ${nextChapter}
                    </button>
                </div>`;
            }
        } else {
            nextActions = `
                <button class="btn-primary" onclick="generateReferences()">
                    <i class="fas fa-book"></i> Generate References
                </button>`;
        }

        const messages = document.querySelectorAll('.msg');
        const lastMsg = messages[messages.length - 1];
        lastMsg.querySelector('.msg-content').innerHTML = `
            <h3><i class="fas fa-check-circle"></i> ${escHtml(chapterTitle)} — Imported</h3>
            <div class="chapter-content">
                <div class="chapter-title-display">${escHtml(chapterTitle)}</div>
                <div class="chapter-text">${dissState.chapters[chapterNum].content}</div>
            </div>
            <div class="action-row" style="margin-top: 16px;">
                <button class="btn-outline" onclick="startChapterRevision(${chapterNum})">
                    <i class="fas fa-comment-dots"></i> Revise with Feedback
                </button>
                <button class="btn-outline" onclick="downloadChapter(${chapterNum})">
                    <i class="fas fa-download"></i> Download Chapter
                </button>
                ${nextActions}
            </div>
        `;

        saveDissertation();
        setStatus('Ready');
        updateChapterTracker();
        updateExportButtonDiss();
    } catch (err) {
        console.error('Chapter import error:', err);
        appendMsg('ai', `
            <h3><i class="fas fa-exclamation-triangle"></i> Import Failed</h3>
            <p>Could not read the file: ${escHtml(err.message || 'Unknown error')}.</p>
            <button class="btn-outline" onclick="triggerUploadNextChapter(${chapterNum})"><i class="fas fa-redo"></i> Try Again</button>
        `);
        setStatus('Error');
    }
}

async function submitExistingContent() {
    // Legacy stub — now handled by new import flow
    closeUploadExistingModal();
    showUploadExisting();
}

/* =========================================================
   CONCEPT NOTE GENERATION
   ========================================================= */
function skipConceptNote() {
    appendMsg('ai', `
        <h3><i class="fas fa-forward"></i> Starting Dissertation</h3>
        <p>Skipping concept note. Let's start with Chapter 1.</p>
        <button class="btn-primary" onclick="startChapterWorkflow(1)">
            <i class="fas fa-book-open"></i> Start Chapter 1
        </button>
    `);
}

async function generateConceptNote() {
    appendMsg('ai', `
        <h3><i class="fas fa-file-alt"></i> Generating Concept Note</h3>
        <p>Creating a comprehensive concept note for your research...</p>
        <div class="loading-indicator">
            <div class="loading-spinner"></div>
            <span>Writing concept note...</span>
        </div>
    `);
    
    setStatus('Generating concept note...');
    
    try {
        const prompt = `Create a comprehensive Concept Note for the research topic: "${dissState.topic}"

${dissState.selectedTopicData ? `
Context:
- Problem: ${dissState.selectedTopicData.problem}
- Research Gap: ${dissState.selectedTopicData.gap}
- Study Site: ${dissState.selectedTopicData.site}
- Site Rationale: ${dissState.selectedTopicData.site_rationale}
` : ''}

A concept note should include:
1. **Title**: The research topic
2. **Background** (2-3 paragraphs): Brief context and importance
3. **Problem Statement** (1-2 paragraphs): What problem are we addressing?
4. **Research Objectives** (3-4 bullet points): Main and specific objectives
5. **Methodology** (1 paragraph): Brief overview of approach
6. **Expected Outcomes** (1 paragraph): What will be achieved
7. **Significance** (1 paragraph): Why this matters

Format in HTML with proper headings (<h3> for sections) and paragraphs (<p>).
Use simple, straightforward academic English.
Include 3-5 in-text citations where relevant (Author, Year).`;

        const response = await callGeminiAPI(prompt);
        
        const cleanContent = response.replace(/```html/g, '').replace(/```/g, '').trim();
        dissState.conceptNote = cleanContent;
        dissState.hasConceptNote = true;
        saveDissertation();
        
        const messages = document.querySelectorAll('.msg');
        const lastMsg = messages[messages.length - 1];
        lastMsg.querySelector('.msg-content').innerHTML = `
            <h3><i class="fas fa-check-circle"></i> Concept Note Complete</h3>
            <div class="chapter-content" style="margin: 16px 0;">
                <div class="chapter-text">${cleanContent}</div>
            </div>
            <div class="action-row" style="margin-top: 16px;">
                <button class="btn-outline" onclick="downloadConceptNote()">
                    <i class="fas fa-download"></i> Download Concept Note
                </button>
                <button class="btn-outline" onclick="regenerateConceptNote()">
                    <i class="fas fa-sync"></i> Regenerate
                </button>
                <button class="btn-primary" onclick="startChapterWorkflow(1)">
                    <i class="fas fa-forward"></i> Start Chapter 1
                </button>
            </div>
        `;
        
        setStatus('Ready');
        
    } catch (error) {
        console.error('Error generating concept note:', error);
        const messages = document.querySelectorAll('.msg');
        const lastMsg = messages[messages.length - 1];
        lastMsg.querySelector('.msg-content').innerHTML = `
            <h3><i class="fas fa-exclamation-triangle"></i> Error</h3>
            <p>Sorry, I couldn't generate the concept note. Please try again.</p>
            <button class="btn-primary" onclick="generateConceptNote()">
                <i class="fas fa-redo"></i> Try Again
            </button>
        `;
        setStatus('Error');
    }
}

async function regenerateConceptNote() {
    appendMsg('ai', `
        <h3><i class="fas fa-sync fa-spin"></i> Regenerating Concept Note</h3>
        <p>Creating a new version...</p>
        <div class="loading-indicator">
            <div class="loading-spinner"></div>
            <span>Regenerating...</span>
        </div>
    `);
    
    await generateConceptNote();
}

function downloadConceptNote() {
    if (!dissState.conceptNote) {
        showNotification('No concept note to download', 'error');
        return;
    }
    
    const topic = dissState.topic || 'Concept Note';
    const bodyContent = dissState.conceptNote + '<p>&nbsp;</p>';
    const doc = buildWordDoc(`Concept Note\n${topic}`, bodyContent);
    const safeTitle = topic.substring(0, 40).replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '_');
    triggerDownload(doc, `Concept_Note_${safeTitle}.doc`);
    showNotification('Concept note downloaded!', 'success');
}

/* =========================================================
   CHAPTER WORKFLOW
   ========================================================= */
function generateDetailedPlanText(plan) {
    let text = '';
    
    plan.forEach((section, sIndex) => {
        text += `\n${section.heading}:\n`;
        text += `Guidelines: ${section.guidelines}\n`;
        
        if (section.paragraphs === 0) {
            text += `Format: Structured format (not prose paragraphs)\n`;
        } else {
            text += `Total Paragraphs: ${section.paragraphs}\n`;
            
            if (section.paragraphDetails && section.paragraphDetails.length > 0) {
                section.paragraphDetails.forEach((para, pIndex) => {
                    text += `  Paragraph ${pIndex + 1} (${para.words} words): ${para.instruction}\n`;
                });
            } else {
                // Default if no detailed instructions
                for (let i = 0; i < section.paragraphs; i++) {
                    text += `  Paragraph ${i + 1} (${section.wordsPerPara} words): Write about ${section.heading}\n`;
                }
            }
        }
        text += '\n';
    });
    
    return text;
}

/* =========================================================
   CHAPTER WORKFLOW
   ========================================================= */
async function startChapterWorkflow(chapterNum, userInstructions) {
    if (!dissState.topic) {
        showNotification('Please select or enter a topic first', 'error');
        return;
    }
    
    dissState.currentChapter = chapterNum;
    const chapter = dissState.chapters[chapterNum];
    
    // Check if we need data input (after chapter 3)
    if (chapterNum === 4 && !dissState.researchData) {
        showDataInputModal();
        return;
    }
    
    // If plan already exists, show it directly
    if (chapter.plan) {
        showChapterPlanModal(chapterNum, chapter.plan);
        return;
    }

    // If no user instructions provided yet, prompt for them first
    if (userInstructions === undefined) {
        awaitingChapterInstructions = chapterNum;
        appendMsg('ai', `
            <h3><i class="fas fa-book-open"></i> ${chapter.title}</h3>
            <p>Before I start planning this chapter, do you have any specific instructions?</p>
            <p style="font-size:0.88rem; color:var(--text-2);">For example: <em>"Only use 3 specific objectives", "Write the background in a narrative style", "Focus on digital health interventions"</em></p>
            <p style="font-size:0.88rem; color:var(--text-2);">Type your instructions below and press <strong>Send</strong>, or click <strong>Continue</strong> to use the default structure.</p>
            <div style="margin-top:12px;">
                <button class="btn-primary" onclick="skipChapterInstructions(${chapterNum})">
                    <i class="fas fa-forward"></i> Continue with Default Structure
                </button>
            </div>
        `);
        // Update input placeholder to guide the user
        const inputEl = document.getElementById('main-input');
        if (inputEl) {
            inputEl.placeholder = `Optional: Tell me how to write ${chapter.title}…`;
            inputEl.focus();
        }
        return;
    }
    
    appendMsg('ai', `
        <h3><i class="fas fa-book-open"></i> ${chapter.title}</h3>
        <p>Let me create a comprehensive plan for this chapter${userInstructions ? ' <em>(with your custom instructions)</em>' : ''}...</p>
        <div class="loading-indicator">
            <div class="loading-spinner"></div>
            <span>Planning chapter structure...</span>
        </div>
    `);
    
    setStatus('Planning chapter...');
    setActiveStep(3);
    
    try {
        // Generate plan based on chapter config
        const plan = await generateChapterPlan(chapterNum, userInstructions);
        chapter.plan = plan;
        
        // Remove the loading message
        const messages = document.querySelectorAll('.msg');
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.querySelector('.loading-indicator')) {
            lastMsg.remove();
        }
        
        // Display plan with editing capability
        showChapterPlanModal(chapterNum, plan);
        
        setStatus('Ready');
        
    } catch (error) {
        console.error('Error planning chapter:', error);
        
        // Replace loading message with error
        const messages = document.querySelectorAll('.msg');
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.querySelector('.loading-indicator')) {
            lastMsg.querySelector('.msg-content').innerHTML = `
                <h3><i class="fas fa-exclamation-triangle"></i> Error Creating Plan</h3>
                <p>Sorry, I couldn't create a plan. Error: ${error.message}</p>
                <button class="btn-primary" onclick="retryPlanGeneration(${chapterNum})">
                    <i class="fas fa-redo"></i> Try Again
                </button>
            `;
        } else {
            appendMsg('ai', `
                <h3><i class="fas fa-exclamation-triangle"></i> Error</h3>
                <p>Sorry, I couldn't create a plan. Please try again.</p>
                <button class="btn-primary" onclick="retryPlanGeneration(${chapterNum})">
                    <i class="fas fa-redo"></i> Try Again
                </button>
            `);
        }
        setStatus('Error');
    }
}

function retryPlanGeneration(chapterNum) {
    // Clear the existing plan to force regeneration
    dissState.chapters[chapterNum].plan = null;
    startChapterWorkflow(chapterNum);
}

async function generateChapterPlan(chapterNum, userInstructions) {
    const config = chapterConfigs[chapterNum];
    if (!config) throw new Error('Invalid chapter number');
    
    const userInstructionBlock = userInstructions && userInstructions.trim()
        ? `\nUSER-SPECIFIED INSTRUCTIONS (HIGHEST PRIORITY — follow these exactly, they override defaults):\n${userInstructions.trim()}\n`
        : '';

    const prompt = `Create a detailed writing plan for ${dissState.chapters[chapterNum].title} on the topic: "${dissState.topic}"
${dissState.conceptNote ? `\nIMPORTANT — This research has a concept note. Ensure the plan aligns with its objectives, problem statement, and direction:\n${dissState.conceptNote.substring(0, 800)}\n` : ''}
${userInstructionBlock}

Chapter structure from academic requirements:
${JSON.stringify(config.sections, null, 2)}

WORD COUNT RULES (strictly follow these):
${chapterNum === 1 ? `- Introduction sections (x.0): exactly 90 words
- Summary/Conclusion sections: exactly 90 words
- ALL other body paragraph sections: exactly 100 words each
- Objectives section (1.3): paragraphs = 0, this is a structured list (not prose)` : `- Introduction sections (x.0): 40–60 words
- Summary/Conclusion sections: 100–110 words
- ALL other body paragraph sections: exactly 140 words each
- Response Rate / Further Research sections: 60 words
- Objectives section (1.3): paragraphs = 0, this is a structured list (not prose)`}

${chapterNum === 1 ? `
CRITICAL Chapter 1 Instructions:
- 1.3 Objectives: set paragraphs to 0. This section uses structured HTML lists, NOT paragraphs.
  Guidelines must say: "Write as structured lists: Main Objective (1 statement), Specific Objectives (numbered list using Bloom's verbs: identify, examine, assess, determine, recommend), Research Questions (numbered list matching each objective)"
- 1.0 Introduction: 1 paragraph × 90 words — roadmap only
- 1.1 Background: 8 paragraphs × 100 words each using funnel method (Global → National → Local)
- 1.2 Problem Statement: 2 paragraphs × 100 words each using Ideal → Reality → Gap → Anchor
- 1.5 Chapter summary: 1 paragraph × 90 words
` : ''}

IMPORTANT: Return ONLY valid JSON. No explanations, no markdown, just the JSON array.

Return as JSON array of sections with this exact structure:
[
  {
    "heading": "exact heading",
    "paragraphs": number,
    "wordsPerPara": number,
    "guidelines": "specific content instructions"
  }
]`;

    const response = await callGeminiAPI(prompt);
    
    // More aggressive cleaning of the response
    let cleanResponse = response.trim();
    
    // Remove markdown code blocks
    cleanResponse = cleanResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Remove any text before the first [ or after the last ]
    const firstBracket = cleanResponse.indexOf('[');
    const lastBracket = cleanResponse.lastIndexOf(']');
    
    if (firstBracket === -1 || lastBracket === -1) {
        throw new Error('No valid JSON array found in response');
    }
    
    cleanResponse = cleanResponse.substring(firstBracket, lastBracket + 1);
    
    try {
        const plan = JSON.parse(cleanResponse);
        return plan;
    } catch (parseError) {
        console.error('Failed to parse plan:', cleanResponse);
        throw new Error('Invalid JSON in plan response');
    }
}

function showChapterPlanModal(chapterNum, plan) {
    const modal = document.getElementById('chapter-plan-modal');
    const title = document.getElementById('plan-modal-title');
    const body = document.getElementById('plan-modal-body');
    
    title.textContent = `Plan for ${dissState.chapters[chapterNum].title}`;
    
    let html = '<div class="chapter-structure">';
    
    plan.forEach((section, sIndex) => {
        html += `
            <div class="section-plan" data-section="${sIndex}">
                <div class="section-plan-header">
                    <div class="section-heading">${escHtml(section.heading)}</div>
                    <button class="btn-outline btn-sm-edit" 
                            onclick="toggleSectionEdit(${chapterNum}, ${sIndex})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </div>
                
                <div class="section-desc">
                    <div id="guidelines-display-${sIndex}">${escHtml(section.guidelines)}</div>
                    <textarea id="guidelines-edit-${sIndex}" class="section-guidelines-edit" style="display:none;">${escHtml(section.guidelines)}</textarea>
                </div>
                
                ${section.paragraphs === 0 ? `
                    <div class="section-structured-note">
                        <strong><i class="fas fa-info-circle"></i> Structured Format</strong>
                        <p>This section uses structured format (objectives/questions list), not regular paragraphs.</p>
                    </div>
                ` : `
                    <div class="paragraphs-breakdown">
                        <div class="paragraphs-breakdown-header">
                            <strong class="para-breakdown-title">
                                <i class="fas fa-paragraph" style="color:var(--primary);"></i> Paragraphs Breakdown
                            </strong>
                            <button class="btn-outline btn-sm-edit" 
                                    onclick="addParagraphToSection(${chapterNum}, ${sIndex})">
                                <i class="fas fa-plus"></i> Add
                            </button>
                        </div>
                        
                        <div id="paragraphs-container-${sIndex}">
                            ${generateParagraphCards(section, sIndex, chapterNum)}
                        </div>
                        
                        <div class="para-breakdown-footer">
                            <span><strong>${section.paragraphs}</strong> paragraph${section.paragraphs !== 1 ? 's' : ''}</span>
                            <span>Est. <strong>~${section.paragraphs * section.wordsPerPara}</strong> words</span>
                        </div>
                    </div>
                `}
                
                <div id="edit-actions-${sIndex}" class="section-edit-actions" style="display:none;">
                    <button class="btn-primary" onclick="saveSectionEdit(${chapterNum}, ${sIndex})">
                        <i class="fas fa-check"></i> Save Changes
                    </button>
                    <button class="btn-outline" onclick="cancelSectionEdit(${chapterNum}, ${sIndex})">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';

    // Compute total estimated word count for this chapter
    let estTotal = 0;
    plan.forEach(section => {
        if (section.paragraphs > 0) {
            if (section.paragraphDetails && section.paragraphDetails.length > 0) {
                section.paragraphDetails.forEach(p => { estTotal += (p.words || section.wordsPerPara || 0); });
            } else {
                estTotal += section.paragraphs * (section.wordsPerPara || 0);
            }
        }
    });

    html += `
        <div class="chapter-word-estimate">
            <i class="fas fa-chart-bar"></i>
            Estimated Total Words for this Chapter:
            <span class="chapter-word-estimate-count" id="chapter-est-total">${estTotal.toLocaleString()}</span>
            words
        </div>
    `;

    html += `
        <div class="plan-tips-box">
            <strong><i class="fas fa-lightbulb"></i> Editing Tips</strong>
            <p>Click <strong>Edit</strong> on any section to modify its guidelines before generation.</p>
            <p>Use the <strong>edit icon</strong> on paragraph cards to customize individual paragraph instructions.</p>
            <p>Adjust word counts using the number inputs. The AI will follow these exactly.</p>
        </div>
        ${renderDissertationPlanControls(chapterNum)}
    `;

    // Word count + citation bulk controls
    html += `
        <div class="plan-wc-panel">
            <h4><i class="fas fa-sliders-h"></i> Bulk Word Count &amp; Citation Settings</h4>

            <div class="plan-wc-row">
                <label><i class="fas fa-align-left plan-wc-icon"></i> Total words for <strong>all body paragraphs</strong> (excl. intro &amp; conclusion) collectively:</label>
                <input type="number" id="bulk-body-words-${chapterNum}" min="100" max="20000" step="50"
                       value="${getBulkBodyWords(chapterNum)}" placeholder="e.g. 3000">
                <button class="btn-ok" onclick="applyBulkBodyWords(${chapterNum})"><i class="fas fa-check"></i> OK</button>
            </div>

            <div class="plan-wc-row">
                <label><i class="fas fa-paragraph plan-wc-icon"></i> Combined words for <strong>intro &amp; conclusion</strong> sections:</label>
                <input type="number" id="bulk-ic-words-${chapterNum}" min="50" max="2000" step="10"
                       value="${getBulkICWords(chapterNum)}" placeholder="e.g. 200">
                <button class="btn-ok" onclick="applyBulkICWords(${chapterNum})"><i class="fas fa-check"></i> OK</button>
            </div>

            <div class="plan-wc-row plan-wc-row-border">
                <label><i class="fas fa-quote-right plan-wc-icon"></i> Number of citations for this chapter:</label>
                <input type="number" id="chapter-citations-${chapterNum}" min="1" max="50"
                       value="${dissState.chapterCitations && dissState.chapterCitations[chapterNum] !== undefined ? dissState.chapterCitations[chapterNum] : 13}" placeholder="13">
                <button class="btn-ok" onclick="applyChapterCitations(${chapterNum})"><i class="fas fa-check"></i> OK</button>
            </div>

            <div class="plan-doi-row">
                <label class="doi-toggle-label">
                    <span class="doi-toggle-icon"><i class="fas fa-link"></i></span>
                    <span>Include DOI in reference list</span>
                    <span class="doi-toggle-badge">Default: Off</span>
                </label>
                <label class="toggle-switch">
                    <input type="checkbox" id="doi-toggle" ${dissState.includeDoi ? 'checked' : ''} onchange="toggleDoiInclusion(this.checked)">
                    <span class="toggle-slider"></span>
                </label>
            </div>
        </div>
    `;
    
    body.innerHTML = html;
    modal.style.display = 'flex';
    
    // Store current chapter for modal actions
    modal.dataset.chapter = chapterNum;
}

/* =========================================================
   BULK WORD COUNT & CITATION HELPERS
   ========================================================= */

// Identify if a section is "intro" or "conclusion/summary"
function isIntroOrConclusion(heading) {
    const h = (heading || '').toLowerCase();
    return /^[0-9]+\.0\b/.test(heading) ||   // x.0 sections
           /introduction/.test(h) ||
           /summary/.test(h) ||
           /conclusion/.test(h);
}

// Calculate total words currently assigned to body paragraphs (non-intro/conclusion)
function getBulkBodyWords(chapterNum) {
    const plan = dissState.chapters[chapterNum]?.plan;
    if (!plan) return '';
    let total = 0;
    plan.forEach(section => {
        if (section.paragraphs > 0 && !isIntroOrConclusion(section.heading)) {
            if (section.paragraphDetails && section.paragraphDetails.length > 0) {
                section.paragraphDetails.forEach(p => { total += (p.words || section.wordsPerPara || 140); });
            } else {
                total += section.paragraphs * (section.wordsPerPara || 140);
            }
        }
    });
    return total || '';
}

// Calculate total words for intro + conclusion sections
function getBulkICWords(chapterNum) {
    const plan = dissState.chapters[chapterNum]?.plan;
    if (!plan) return '';
    let total = 0;
    plan.forEach(section => {
        if (section.paragraphs > 0 && isIntroOrConclusion(section.heading)) {
            if (section.paragraphDetails && section.paragraphDetails.length > 0) {
                section.paragraphDetails.forEach(p => { total += (p.words || section.wordsPerPara || 60); });
            } else {
                total += section.paragraphs * (section.wordsPerPara || 60);
            }
        }
    });
    return total || '';
}

function applyBulkBodyWords(chapterNum) {
    const input = document.getElementById(`bulk-body-words-${chapterNum}`);
    const totalWords = parseInt(input.value);
    if (!totalWords || totalWords < 50) { showNotification('Enter a valid total word count', 'error'); return; }

    const plan = dissState.chapters[chapterNum]?.plan;
    if (!plan) return;

    // Count total body paragraphs
    let totalParas = 0;
    plan.forEach(section => {
        if (section.paragraphs > 0 && !isIntroOrConclusion(section.heading)) {
            totalParas += section.paragraphs;
        }
    });

    if (totalParas === 0) { showNotification('No body paragraphs found', 'warning'); return; }

    const wordsPerPara = Math.round(totalWords / totalParas);

    // Update all body sections
    plan.forEach(section => {
        if (section.paragraphs > 0 && !isIntroOrConclusion(section.heading)) {
            section.wordsPerPara = wordsPerPara;
            if (!section.paragraphDetails) {
                section.paragraphDetails = [];
                for (let i = 0; i < section.paragraphs; i++) {
                    section.paragraphDetails.push({ instruction: `Paragraph ${i + 1} of ${section.heading}`, words: wordsPerPara });
                }
            } else {
                section.paragraphDetails.forEach(p => { p.words = wordsPerPara; });
            }
        }
    });

    saveDissertation();
    showNotification(`Body paragraphs updated: ${wordsPerPara} words each (${totalParas} paragraphs × ${wordsPerPara} = ~${totalParas * wordsPerPara} words)`, 'success');
    showChapterPlanModal(chapterNum, plan);
}

function applyBulkICWords(chapterNum) {
    const input = document.getElementById(`bulk-ic-words-${chapterNum}`);
    const totalWords = parseInt(input.value);
    if (!totalWords || totalWords < 20) { showNotification('Enter a valid word count', 'error'); return; }

    const plan = dissState.chapters[chapterNum]?.plan;
    if (!plan) return;

    let totalParas = 0;
    plan.forEach(section => {
        if (section.paragraphs > 0 && isIntroOrConclusion(section.heading)) totalParas += section.paragraphs;
    });

    if (totalParas === 0) { showNotification('No intro/conclusion paragraphs found', 'warning'); return; }

    const wordsPerPara = Math.round(totalWords / totalParas);

    plan.forEach(section => {
        if (section.paragraphs > 0 && isIntroOrConclusion(section.heading)) {
            section.wordsPerPara = wordsPerPara;
            if (!section.paragraphDetails) {
                section.paragraphDetails = [];
                for (let i = 0; i < section.paragraphs; i++) {
                    section.paragraphDetails.push({ instruction: `Paragraph ${i + 1} of ${section.heading}`, words: wordsPerPara });
                }
            } else {
                section.paragraphDetails.forEach(p => { p.words = wordsPerPara; });
            }
        }
    });

    saveDissertation();
    showNotification(`Intro/conclusion updated: ${wordsPerPara} words each`, 'success');
    showChapterPlanModal(chapterNum, plan);
}

function applyChapterCitations(chapterNum) {
    const input = document.getElementById(`chapter-citations-${chapterNum}`);
    const count = parseInt(input.value);
    if (!count || count < 1) { showNotification('Enter a valid citation count', 'error'); return; }

    if (!dissState.chapterCitations) dissState.chapterCitations = {};
    dissState.chapterCitations[chapterNum] = count;
    saveDissertation();
    showNotification(`Citation count set to ${count} for this chapter`, 'success');
}

function toggleDoiInclusion(include) {
    dissState.includeDoi = !!include;
    saveDissertation();
    showNotification(`DOI ${include ? 'will be included' : 'will be excluded'} in reference lists.`, 'info');
}

function refreshChapterWordEstimate(chapterNum) {
    const plan = dissState.chapters[chapterNum]?.plan;
    if (!plan) return;
    let estTotal = 0;
    plan.forEach(section => {
        if (section.paragraphs > 0) {
            if (section.paragraphDetails && section.paragraphDetails.length > 0) {
                section.paragraphDetails.forEach(p => { estTotal += (p.words || section.wordsPerPara || 0); });
            } else {
                estTotal += section.paragraphs * (section.wordsPerPara || 0);
            }
        }
    });
    const el = document.getElementById('chapter-est-total');
    if (el) el.textContent = estTotal.toLocaleString();
}

/* =========================================================
   CITATIONS MODAL
   ========================================================= */
let _pendingWriteChapter = null;
let _currentCitations = []; // { id, title, overview, apa, url, isUser, pdfText }

function closeCitationsModal() {
    document.getElementById('citations-modal').style.display = 'none';
}

async function showCitationsModal(chapterNum) {
    _pendingWriteChapter = chapterNum;
    _currentCitations = [];

    const citCount = (dissState.chapterCitations && dissState.chapterCitations[chapterNum]) || 13;
    const chapterTitle = dissState.chapters[chapterNum]?.title || `Chapter ${chapterNum}`;

    document.getElementById('citations-modal-title').textContent = `Citations for ${chapterTitle} (${citCount})`;
    document.getElementById('citations-list').innerHTML = '';
    document.getElementById('citations-loading').style.display = 'block';
    document.getElementById('start-writing-btn').disabled = true;
    document.getElementById('citations-modal').style.display = 'flex';

    // Wire up PDF upload
    const pdfInput = document.getElementById('citation-pdf-input');
    pdfInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        pdfInput.value = '';
        await handleCitationPdfUpload(file);
    };

    try {
        await generateCitationsForChapter(chapterNum, citCount);
    } catch(err) {
        console.error('Citation generation error:', err);
        document.getElementById('citations-loading').style.display = 'none';
        document.getElementById('citations-list').innerHTML = `<p style="color:var(--danger); font-size:0.85rem;">Failed to generate citations. <button class="btn-outline" style="font-size:0.8rem;" onclick="regenAllCitationsInManager()">Try Again</button></p>`;
    }
    document.getElementById('start-writing-btn').disabled = false;
}

async function generateCitationsForChapter(chapterNum, count) {
    const topic = dissState.topic;
    const chapterTitle = dissState.chapters[chapterNum]?.title || `Chapter ${chapterNum}`;
    const plan = dissState.chapters[chapterNum]?.plan;
    const planSummary = plan ? plan.map(s => s.heading + ': ' + s.guidelines).join('\n').substring(0, 600) : '';

    const prompt = `You are an academic librarian. Generate exactly ${count} valid, real academic citations for a dissertation chapter.

Chapter: "${chapterTitle}"
Dissertation Topic: "${topic}"
Chapter plan summary: ${planSummary}

For each citation, return a JSON array. Each item must have:
- "title": The title of the source
- "overview": A 1-2 sentence description of what the source is about and how it relates to the topic
- "apa": Full APA 7th edition reference string
- "url": A REAL, valid URL (DOI link like https://doi.org/... or direct Google Scholar/journal link). Must be a real, working URL.
- "year": Publication year (number)
- "authors": First author's last name + "et al." if multiple

Rules:
1. Use real, published academic sources — journals, books, reports.
2. Mix of recent (last 5–10 years) and seminal sources where appropriate.
3. DOI URLs preferred — format: https://doi.org/10.XXXX/xxxxx
4. Include at least 2 Malawi-specific or African sources where relevant.
5. Return ONLY valid JSON array, no markdown, no preamble.

Return as: [{"title":"...","overview":"...","apa":"...","url":"...","year":2020,"authors":"..."},...]`;

    const response = await callGeminiAPI(prompt);
    let clean = response.replace(/```json/g,'').replace(/```/g,'').trim();
    const firstBracket = clean.indexOf('[');
    const lastBracket = clean.lastIndexOf(']');
    if (firstBracket === -1) throw new Error('No JSON array in response');
    clean = clean.substring(firstBracket, lastBracket + 1);

    const citations = JSON.parse(clean);

    _currentCitations = citations.map((c, i) => ({
        id: 'cit_' + Date.now() + '_' + i,
        title: c.title || 'Untitled',
        overview: c.overview || '',
        apa: c.apa || '',
        url: c.url || '',
        year: c.year || '',
        authors: c.authors || '',
        isUser: false
    }));

    renderCitationsList();
    document.getElementById('citations-loading').style.display = 'none';
}

function renderCitationsList() {
    const container = document.getElementById('citations-list');
    if (_currentCitations.length === 0) {
        container.innerHTML = '<p style="color:var(--text-3); font-size:0.84rem; text-align:center; padding:20px 0;">No citations added yet.</p>';
        return;
    }

    container.innerHTML = _currentCitations.map((cit, idx) => `
        <div class="citation-card ${cit.isUser ? 'cit-user' : ''}" id="citcard-${cit.id}">
            <div style="display:flex; align-items:flex-start; gap:10px; margin-bottom:6px;">
                <span class="cit-num">${idx + 1}</span>
                <div style="flex:1;">
                    <span class="cit-title">${escHtml(cit.title)}</span>
                    ${cit.isUser ? '<span class="cit-badge-user" style="margin-left:8px;">Your PDF</span>' : ''}
                </div>
            </div>
            <div class="cit-overview">${escHtml(cit.overview)}</div>
            <div class="cit-apa">${escHtml(cit.apa)}</div>
            ${cit.url ? `<a class="cit-link" href="${escHtml(cit.url)}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt" style="margin-right:4px; font-size:0.72rem;"></i>${escHtml(cit.url)}</a>` : ''}
            <div class="cit-actions">
                ${!cit.isUser ? `<button class="btn-outline" style="font-size:0.75rem; padding:4px 10px;" onclick="regenerateSingleCitation('${cit.id}')"><i class="fas fa-sync"></i> Regenerate</button>` : ''}
                <button class="btn-outline" style="font-size:0.75rem; padding:4px 10px; color:var(--danger); border-color:var(--danger);" onclick="deleteCitation('${cit.id}')"><i class="fas fa-trash"></i> Delete</button>
            </div>
        </div>
    `).join('');
}

function deleteCitation(id) {
    _currentCitations = _currentCitations.filter(c => c.id !== id);
    renderCitationsList();
    showNotification('Citation removed', 'success');
}

async function regenerateSingleCitation(id) {
    const idx = _currentCitations.findIndex(c => c.id === id);
    if (idx === -1) return;

    const card = document.getElementById(`citcard-${id}`);
    if (card) {
        card.style.opacity = '0.5';
        card.innerHTML += '<div style="text-align:center; padding:10px; font-size:0.8rem; color:var(--text-3);"><i class="fas fa-spinner fa-spin"></i> Regenerating…</div>';
    }

    try {
        const topic = dissState.topic;
        const chapterTitle = dissState.chapters[_pendingWriteChapter]?.title || 'Chapter';
        const prompt = `Generate 1 valid, real academic citation for a dissertation on "${topic}" for the chapter "${chapterTitle}".
Return ONLY a JSON object (not array) with: title, overview (1-2 sentences), apa (APA 7th edition), url (real DOI or journal link), year, authors.
No markdown, no preamble. Just the JSON object.`;

        const response = await callGeminiAPI(prompt);
        let clean = response.replace(/```json/g,'').replace(/```/g,'').trim();
        const firstBrace = clean.indexOf('{');
        const lastBrace = clean.lastIndexOf('}');
        if (firstBrace === -1) throw new Error('No JSON');
        clean = clean.substring(firstBrace, lastBrace + 1);
        const c = JSON.parse(clean);

        _currentCitations[idx] = {
            id: id,
            title: c.title || 'Untitled',
            overview: c.overview || '',
            apa: c.apa || '',
            url: c.url || '',
            year: c.year || '',
            authors: c.authors || '',
            isUser: false
        };
        renderCitationsList();
        showNotification('Citation regenerated', 'success');
    } catch(err) {
        showNotification('Failed to regenerate citation', 'error');
        if (card) card.style.opacity = '1';
    }
}

async function regenAllCitationsInManager() {
    if (!_pendingWriteChapter) return;
    const citCount = (dissState.chapterCitations && dissState.chapterCitations[_pendingWriteChapter]) || 13;
    _currentCitations = _currentCitations.filter(c => c.isUser); // keep user-uploaded
    document.getElementById('citations-loading').style.display = 'block';
    document.getElementById('citations-list').innerHTML = '';
    document.getElementById('start-writing-btn').disabled = true;
    try {
        await generateCitationsForChapter(_pendingWriteChapter, citCount);
    } catch(err) {
        showNotification('Failed to regenerate citations', 'error');
    }
    document.getElementById('citations-loading').style.display = 'none';
    document.getElementById('start-writing-btn').disabled = false;
}

async function handleCitationPdfUpload(file) {
    showNotification('Reading PDF…', 'info');
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        for (let p = 1; p <= Math.min(pdf.numPages, 5); p++) {
            const page = await pdf.getPage(p);
            const content = await page.getTextContent();
            text += content.items.map(i => i.str).join(' ') + '\n';
        }
        text = text.substring(0, 1500);

        // Ask AI to build a citation from the PDF content
        const prompt = `Based on this academic text extract, generate a citation object.
Text: "${text}"
Return a JSON object (not array) with: title, overview (1-2 sentences on content), apa (APA 7th edition best guess), url (empty string if unknown), year, authors.
No markdown, no preamble.`;
        const response = await callGeminiAPI(prompt);
        let clean = response.replace(/```json/g,'').replace(/```/g,'').trim();
        const firstBrace = clean.indexOf('{');
        const lastBrace = clean.lastIndexOf('}');
        const c = JSON.parse(clean.substring(firstBrace, lastBrace + 1));

        const newCit = {
            id: 'cit_user_' + Date.now(),
            title: c.title || file.name,
            overview: c.overview || 'User-uploaded PDF source.',
            apa: c.apa || `${file.name}. (n.d.).`,
            url: c.url || '',
            year: c.year || '',
            authors: c.authors || 'Unknown',
            isUser: true,
            pdfText: text
        };
        _currentCitations.unshift(newCit);
        renderCitationsList();
        showNotification('PDF citation added!', 'success');
    } catch(err) {
        console.error('PDF citation error:', err);
        showNotification('Failed to read PDF', 'error');
    }
}

async function proceedWithWriting() {
    if (!_pendingWriteChapter) return;
    // Store citations in dissState for use during chapter generation
    if (!dissState.approvedCitations) dissState.approvedCitations = {};
    dissState.approvedCitations[_pendingWriteChapter] = _currentCitations;
    saveDissertation();

    closeCitationsModal();
    await generateChapterContent(_pendingWriteChapter);
}

function generateParagraphCards(section, sectionIndex, chapterNum) {
    if (!section.paragraphs || section.paragraphs === 0) return '';
    
    let html = '';
    
    // Initialize paragraph-level data if not exists
    if (!section.paragraphDetails) {
        section.paragraphDetails = [];
        for (let i = 0; i < section.paragraphs; i++) {
            section.paragraphDetails.push({
                instruction: `Paragraph ${i + 1} of ${section.heading}`,
                words: section.wordsPerPara
            });
        }
    }
    
    for (let pIndex = 0; pIndex < section.paragraphs; pIndex++) {
        const para = section.paragraphDetails[pIndex] || {
            instruction: `Paragraph ${pIndex + 1} of ${section.heading}`,
            words: section.wordsPerPara
        };
        
        html += `
            <div class="paragraph-card">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px;">
                    <div style="flex:1; min-width:0;">
                        <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                            <span style="background:var(--primary); color:white; width:26px; height:26px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.72rem; font-weight:700; flex-shrink:0;">${pIndex + 1}</span>
                            <strong style="font-size:0.85rem; color:var(--text);">Paragraph ${pIndex + 1}</strong>
                        </div>
                        <div id="para-instruction-display-${sectionIndex}-${pIndex}" style="font-size:0.82rem; color:var(--text-2); line-height:1.6; padding-left:36px;">
                            ${escHtml(para.instruction)}
                        </div>
                        <textarea id="para-instruction-edit-${sectionIndex}-${pIndex}" 
                                  style="display:none; width:100%; min-height:60px; padding:8px 10px; border:1px solid var(--border); border-radius:6px; font-size:0.82rem; font-family:inherit; margin-top:6px; resize:vertical; line-height:1.5;"
                                  placeholder="What should this paragraph cover?">${escHtml(para.instruction)}</textarea>
                    </div>
                    <div style="display:flex; align-items:center; gap:6px; flex-shrink:0;">
                        <div style="display:flex; align-items:center; gap:5px; background:var(--bg-2); border:1px solid var(--border); padding:5px 10px; border-radius:8px;">
                            <span style="font-size:0.72rem; color:var(--text-3); white-space:nowrap;">Words:</span>
                            <input type="number" id="para-words-${sectionIndex}-${pIndex}" 
                                   value="${para.words}" min="30" max="300" step="10"
                                   style="width:55px; padding:2px 4px; border:none; background:transparent; font-size:0.8rem; text-align:center; font-family:inherit; font-weight:600; color:var(--text);"
                                   onchange="updateParagraphWords(${chapterNum}, ${sectionIndex}, ${pIndex}, this.value)">
                        </div>
                        <button class="btn-outline" style="padding:5px 9px; font-size:0.72rem;" 
                                onclick="toggleParagraphEdit(${sectionIndex}, ${pIndex})" title="Edit instruction">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-outline" style="padding:5px 9px; font-size:0.72rem; color:var(--danger); border-color:var(--danger);" 
                                onclick="removeParagraph(${chapterNum}, ${sectionIndex}, ${pIndex})"
                                title="Remove paragraph">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div id="para-edit-actions-${sectionIndex}-${pIndex}" style="display:none; margin-top:10px; padding-top:10px; border-top:1px solid var(--border); gap:8px;">
                    <button class="btn-primary" style="font-size:0.78rem; padding:5px 12px;" 
                            onclick="saveParagraphEdit(${chapterNum}, ${sectionIndex}, ${pIndex})">
                        <i class="fas fa-check"></i> Save
                    </button>
                    <button class="btn-outline" style="font-size:0.78rem; padding:5px 12px;" 
                            onclick="cancelParagraphEdit(${sectionIndex}, ${pIndex})">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </div>
        `;
    }
    
    return html;
}

function updateSectionPlan(chapterNum, sectionIndex, field, value) {
    const chapter = dissState.chapters[chapterNum];
    if (chapter.plan && chapter.plan[sectionIndex]) {
        chapter.plan[sectionIndex][field] = parseInt(value);
        saveDissertation();
        
        // Update display
        const section = document.querySelector(`[data-section="${sectionIndex}"]`);
        const paraCount = section.querySelector('.para-count');
        const s = chapter.plan[sectionIndex];
        if (s.paragraphs > 0) {
            paraCount.textContent = `${s.paragraphs} paragraph${s.paragraphs !== 1 ? 's' : ''} × ${s.wordsPerPara} words ≈ ${s.paragraphs * s.wordsPerPara} words`;
        }
    }
}

function toggleSectionEdit(chapterNum, sectionIndex) {
    const displayEl = document.getElementById(`guidelines-display-${sectionIndex}`);
    const editEl = document.getElementById(`guidelines-edit-${sectionIndex}`);
    const actionsEl = document.getElementById(`edit-actions-${sectionIndex}`);
    
    if (displayEl.style.display === 'none') {
        // Cancel edit
        cancelSectionEdit(chapterNum, sectionIndex);
    } else {
        // Enter edit mode
        displayEl.style.display = 'none';
        editEl.style.display = 'block';
        actionsEl.style.display = 'flex';
    }
}

function saveSectionEdit(chapterNum, sectionIndex) {
    const editEl = document.getElementById(`guidelines-edit-${sectionIndex}`);
    const newGuidelines = editEl.value;
    
    // Update state
    const chapter = dissState.chapters[chapterNum];
    if (chapter.plan && chapter.plan[sectionIndex]) {
        chapter.plan[sectionIndex].guidelines = newGuidelines;
        saveDissertation();
        
        // Update display
        document.getElementById(`guidelines-display-${sectionIndex}`).textContent = newGuidelines;
        
        // Exit edit mode
        cancelSectionEdit(chapterNum, sectionIndex);
    }
}

function cancelSectionEdit(chapterNum, sectionIndex) {
    const displayEl = document.getElementById(`guidelines-display-${sectionIndex}`);
    const editEl = document.getElementById(`guidelines-edit-${sectionIndex}`);
    const actionsEl = document.getElementById(`edit-actions-${sectionIndex}`);
    
    displayEl.style.display = 'block';
    editEl.style.display = 'none';
    actionsEl.style.display = 'none';
    
    // Reset textarea to original value
    const chapter = dissState.chapters[chapterNum];
    if (chapter.plan && chapter.plan[sectionIndex]) {
        editEl.value = chapter.plan[sectionIndex].guidelines;
    }
}

function toggleParagraphEdit(sectionIndex, paraIndex) {
    const displayEl = document.getElementById(`para-instruction-display-${sectionIndex}-${paraIndex}`);
    const editEl = document.getElementById(`para-instruction-edit-${sectionIndex}-${paraIndex}`);
    const actionsEl = document.getElementById(`para-edit-actions-${sectionIndex}-${paraIndex}`);
    
    if (displayEl.style.display === 'none') {
        // Cancel edit
        cancelParagraphEdit(sectionIndex, paraIndex);
    } else {
        // Enter edit mode
        displayEl.style.display = 'none';
        editEl.style.display = 'block';
        actionsEl.style.display = 'flex';
    }
}

function saveParagraphEdit(chapterNum, sectionIndex, paraIndex) {
    const editEl = document.getElementById(`para-instruction-edit-${sectionIndex}-${paraIndex}`);
    const newInstruction = editEl.value;
    
    // Update state
    const chapter = dissState.chapters[chapterNum];
    if (chapter.plan && chapter.plan[sectionIndex]) {
        const section = chapter.plan[sectionIndex];
        if (!section.paragraphDetails) {
            section.paragraphDetails = [];
        }
        
        if (!section.paragraphDetails[paraIndex]) {
            section.paragraphDetails[paraIndex] = {
                instruction: newInstruction,
                words: section.wordsPerPara
            };
        } else {
            section.paragraphDetails[paraIndex].instruction = newInstruction;
        }
        
        saveDissertation();
        
        // Update display
        document.getElementById(`para-instruction-display-${sectionIndex}-${paraIndex}`).textContent = newInstruction;
        
        // Exit edit mode
        cancelParagraphEdit(sectionIndex, paraIndex);
    }
}

function cancelParagraphEdit(sectionIndex, paraIndex) {
    const displayEl = document.getElementById(`para-instruction-display-${sectionIndex}-${paraIndex}`);
    const editEl = document.getElementById(`para-instruction-edit-${sectionIndex}-${paraIndex}`);
    const actionsEl = document.getElementById(`para-edit-actions-${sectionIndex}-${paraIndex}`);
    
    displayEl.style.display = 'block';
    editEl.style.display = 'none';
    actionsEl.style.display = 'none';
}

function updateParagraphWords(chapterNum, sectionIndex, paraIndex, words) {
    const chapter = dissState.chapters[chapterNum];
    if (chapter.plan && chapter.plan[sectionIndex]) {
        const section = chapter.plan[sectionIndex];
        if (!section.paragraphDetails) {
            section.paragraphDetails = [];
        }
        
        if (!section.paragraphDetails[paraIndex]) {
            section.paragraphDetails[paraIndex] = {
                instruction: `Paragraph ${paraIndex + 1} of ${section.heading}`,
                words: parseInt(words)
            };
        } else {
            section.paragraphDetails[paraIndex].words = parseInt(words);
        }
        
        saveDissertation();
    }
}

function removeParagraph(chapterNum, sectionIndex, paraIndex) {
    if (!confirm('Remove this paragraph from the plan?')) return;
    
    const chapter = dissState.chapters[chapterNum];
    if (chapter.plan && chapter.plan[sectionIndex]) {
        const section = chapter.plan[sectionIndex];
        
        // Remove from paragraph details
        if (section.paragraphDetails && section.paragraphDetails[paraIndex]) {
            section.paragraphDetails.splice(paraIndex, 1);
        }
        
        // Decrease paragraph count
        section.paragraphs = Math.max(0, section.paragraphs - 1);
        
        saveDissertation();
        
        // Refresh the modal
        showChapterPlanModal(chapterNum, chapter.plan);
    }
}

function addParagraphToSection(chapterNum, sectionIndex) {
    const chapter = dissState.chapters[chapterNum];
    if (chapter.plan && chapter.plan[sectionIndex]) {
        const section = chapter.plan[sectionIndex];
        section.paragraphs += 1;
        
        // Initialize paragraph details if needed
        if (!section.paragraphDetails) {
            section.paragraphDetails = [];
        }
        
        // Add new paragraph with default instruction
        section.paragraphDetails.push({
            instruction: `Additional paragraph for ${section.heading}`,
            words: section.wordsPerPara
        });
        
        saveDissertation();
        
        // Refresh modal
        showChapterPlanModal(chapterNum, chapter.plan);
    }
}

function closeChapterPlanModal() {
    document.getElementById('chapter-plan-modal').style.display = 'none';
}

async function regeneratePlan() {
    const modal = document.getElementById('chapter-plan-modal');
    const chapterNum = parseInt(modal.dataset.chapter);
    
    closeChapterPlanModal();
    
    appendMsg('ai', `
        <h3><i class="fas fa-sync fa-spin"></i> Regenerating Plan</h3>
        <p>Creating a new plan for ${dissState.chapters[chapterNum].title}...</p>
        <div class="loading-indicator">
            <div class="loading-spinner"></div>
            <span>Replanning chapter...</span>
        </div>
    `);
    
    setStatus('Replanning...');
    
    try {
        const plan = await generateChapterPlan(chapterNum, dissState.chapters[chapterNum].userInstructions);
        showChapterPlanModal(chapterNum, plan);
        setStatus('Ready');
    } catch (error) {
        appendMsg('ai', `
            <h3><i class="fas fa-exclamation-triangle"></i> Error</h3>
            <p>Sorry, I couldn't regenerate the plan. Please try again.</p>
            <button class="btn-primary" onclick="regeneratePlan()">
                <i class="fas fa-redo"></i> Try Again
            </button>
        `);
        setStatus('Error');
    }
}

async function approvePlanAndGenerate() {
    const modal = document.getElementById('chapter-plan-modal');
    const chapterNum = parseInt(modal.dataset.chapter);
    
    closeChapterPlanModal();
    
    dissState.chapters[chapterNum].approved = true;
    saveDissertation();
    
    // Generate citations list then show citations manager before writing
    await generateAndShowDissertationCitations(chapterNum);
}

async function generateAndShowDissertationCitations(chapterNum) {
    const targetCount = dissState.chapters[chapterNum].targetCitations || 13;
    const topic = dissState.topic;
    const chTitle = dissState.chapters[chapterNum].title;

    appendMsg('ai', `
        <h3><i class="fas fa-search"></i> Finding ${targetCount} Citations for ${escHtml(chTitle)}</h3>
        <p>Locating peer-reviewed sources for this chapter…</p>
        <div class="loading-indicator"><div class="loading-spinner"></div><span>Searching academic databases…</span></div>
    `);
    setStatus('Finding citations…');

    try {
        const prompt = `You are a research librarian. Find exactly ${targetCount} high-quality academic citations for this dissertation chapter:

Chapter: "${chTitle}"
Dissertation Topic: "${topic}"

CRITICAL RULES:
1. Every source MUST be a REAL, VERIFIABLE academic work that actually exists.
2. Use well-known journals and publishers.
3. Years: 2015-2024 (1-2 seminal older works allowed).
4. Include valid DOIs (format: 10.XXXX/xxxxx) where available.
5. Mix: journal articles (majority), 1-2 books, optionally 1 report.
6. Each must include a brief overview (1 sentence, max 20 words) of what the source covers.

Return ONLY a valid JSON array of exactly ${targetCount} objects:
[{"author":"Smith, J. A.","year":"2021","title":"Title","journal":"Journal Name","volume":"12","issue":"3","pages":"45-67","doi":"10.1016/j.example.2021.001","relevance":"Why relevant to this chapter","overview":"One sentence description of this source"}]`;

        const raw = await callGeminiAPI(prompt);
        const citations = JSON.parse(raw.replace(/```json/g,'').replace(/```/g,'').trim());

        // Remove the loading message before showing citations manager
        const messages = document.querySelectorAll('.msg');
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.querySelector('.loading-indicator')) lastMsg.remove();

        await showCitationsManager({ mode: 'dissertation', chapterNum }, citations);

    } catch (error) {
        console.error('Citation generation error:', error);
        appendMsg('ai', `
            <h3><i class="fas fa-exclamation-triangle"></i> Error Finding Citations</h3>
            <p>Could not generate citations. Proceeding to write the chapter anyway.</p>
            <button class="btn-primary" onclick="generateChapterContent(${chapterNum})">
                <i class="fas fa-pen-fancy"></i> Write Chapter Anyway
            </button>
        `);
        setStatus('Error');
    }
}

let isGenerating = false; // Flag to prevent duplicate generations

async function generateChapterContent(chapterNum, userInstructions) {
    if (isGenerating) {
        console.log('Generation already in progress, ignoring duplicate call');
        return;
    }
    
    isGenerating = true;
    const chapter = dissState.chapters[chapterNum];
    
    appendMsg('ai', `
        <h3><i class="fas fa-pen-fancy"></i> Writing ${chapter.title}</h3>
        <p>Generating content based on the approved plan...</p>
        <div class="loading-indicator">
            <div class="loading-spinner"></div>
            <span>Writing chapter content...</span>
        </div>
    `);
    
    setStatus('Generating content...');
    setActiveStep(3);
    updateProgressBar(30);
    
    try {
        // Build comprehensive prompt based on pasted script instructions
        const prompt = buildChapterPrompt(chapterNum, userInstructions);
        
        const response = await callGeminiAPI(prompt);
        
        // Clean and store content
        const cleanContent = response.replace(/```html/g, '').replace(/```/g, '').trim();
        chapter.content = cleanContent;
        saveDissertation();
        
        updateProgressBar(100);
        
        // Display generated content
        const messages = document.querySelectorAll('.msg');
        const lastMsg = messages[messages.length - 1];
        lastMsg.querySelector('.msg-content').innerHTML = `
            <h3><i class="fas fa-check-circle"></i> ${chapter.title} Complete</h3>
            <div class="chapter-content">
                <div class="chapter-title-display">${chapter.title}</div>
                <div class="chapter-text">${cleanContent}</div>
            </div>
            <div class="action-row" style="margin-top: 16px;">
                <button class="btn-outline" onclick="startChapterRevision(${chapterNum})">
                    <i class="fas fa-comment-dots"></i> Revise with Feedback
                </button>
                <button class="btn-outline" onclick="downloadChapter(${chapterNum})">
                    <i class="fas fa-download"></i> Download Chapter
                </button>
                <button class="btn-primary" onclick="proceedToNext(${chapterNum})">
                    <i class="fas fa-forward"></i> Continue
                </button>
            </div>
        `;
        
        updateProgressBar(0);
        setStatus('Ready');
        updateChapterTracker();
        updateExportButtonDiss();
        
    } catch (error) {
        console.error('Error generating content:', error);
        const messages = document.querySelectorAll('.msg');
        const lastMsg = messages[messages.length - 1];
        lastMsg.querySelector('.msg-content').innerHTML = `
            <h3><i class="fas fa-exclamation-triangle"></i> Error</h3>
            <p>Sorry, I couldn't generate the chapter. Error: ${error.message || 'Unknown error'}</p>
            <button class="btn-primary" onclick="generateChapterContent(${chapterNum})">
                <i class="fas fa-redo"></i> Try Again
            </button>
        `;
        updateProgressBar(0);
        setStatus('Error');
    } finally {
        isGenerating = false;
    }
}

function buildChapterPrompt(chapterNum, userInstructions) {
    const chapter = dissState.chapters[chapterNum];
    const plan = chapter.plan;
    const topic = dissState.topic;
    
    const userInstructionBlock = userInstructions && userInstructions.trim()
        ? `\nUSER-SPECIFIED INSTRUCTIONS (HIGHEST PRIORITY — follow these exactly):\n${userInstructions.trim()}\n`
        : '';

    // Base system instruction
    let prompt = `You are an academic research assistant writing a dissertation.

STRICT LANGUAGE RULES:
1. Use SIMPLE, STRAIGHTFORWARD English. Do not use complex words when simple ones work (e.g., use "show" instead of "elucidate").
2. Avoid flowery phrases like "meticulously review," "in the grand tapestry."
3. Tone: Formal and objective, but easy to read. Never use "I" or "We."

STRICT FORMATTING RULES:
1. PARAGRAPH LENGTH: Maximum 12 lines (approx 120 words) per paragraph. Split if longer.
2. CITATIONS: Every paragraph MUST contain at least one in-text citation (Author, Year). Longer paragraphs need 2-3 citations.
3. Use HTML <p> tags for every paragraph. No indentation.
4. All text should be justified alignment.
5. MALAWI GOVERNMENT CITATION RULE: Any citation referring to a Malawi government source — including Acts of Parliament, policies, national plans, ministerial documents, council reports, or government strategies — MUST be cited as (Government of Malawi, Year). Do NOT cite by the name of the Act, policy, or ministry (e.g., do NOT write "(National Physical Planning Act, 2016)" — write "(Government of Malawi, 2016)" instead). This applies to all Malawi government sources without exception.

Topic: "${topic}"
${dissState.conceptNote ? `\nCONCEPT NOTE (IMPORTANT — align all content, objectives, and direction with this):\n${dissState.conceptNote.substring(0, 1500)}\n` : ''}${dissState.researchData ? `Research Data: "${dissState.researchData.substring(0, 500)}..."` : ''}

${dissState.approvedCitations && dissState.approvedCitations[chapterNum] && dissState.approvedCitations[chapterNum].length > 0 ? `
APPROVED CITATIONS FOR THIS CHAPTER (USE THESE — cite them as in-text citations throughout):
${dissState.approvedCitations[chapterNum].map((c, i) => `[${i+1}] ${c.authors || 'Author'} (${c.year || 'n.d.'}) — ${c.title} — APA: ${c.apa}`).join('\n')}
You MUST use at least ${Math.min(dissState.approvedCitations[chapterNum].length, (dissState.chapterCitations?.[chapterNum] || 13))} of these citations distributed throughout the chapter paragraphs.
` : chapter.approvedCitations && chapter.approvedCitations.length > 0 ? `
APPROVED CITATIONS FOR THIS CHAPTER (USE THESE in every paragraph as in-text citations):
${chapter.approvedCitations.map((c, i) => `[${i+1}] ${c.author || c.authors || 'Unknown'} (${c.year || 'n.d.'}) — "${c.title}" — ${c.journal || c.publisher || ''}`).join('\n')}
You MUST use these citations distributed throughout the chapter. Cite as (Author, Year) format. Aim for at least ${Math.min(chapter.approvedCitations.length, chapter.targetCitations || 13)} citations in the chapter.
` : ''}

USER'S DETAILED PLAN:
${generateDetailedPlanText(plan)}

${userInstructionBlock}
`;

    // Chapter-specific instructions from pasted script
    if (chapterNum === 1) {
        prompt += `Task: Write Chapter 1: Study Overview

Writing Style & Tone:
- Use Formal Academic English but keep it SIMPLE and STRAIGHTFORWARD
- Sound like an expert using domain-specific terminology
- Connect ideas with transitions (Furthermore, Conversely, Consequently)
- High citation density in Background and Problem Statement (2-4 per paragraph)

Section Guidelines:
1.0 Introduction: Single concise paragraph (~40 words) listing chapter sections only
1.1 Background: Use "Funnel Method" — each paragraph ~140 words
   - Para 1: Global scope with international body citations
   - Para 2: Theoretical context, define core concept and theory
   - Para 3: Historical/comparative context (developed vs developing)
   - Para 4: General gap in developing contexts
   - Para 5-6: National context citing Malawi policies/acts
   - Para 7-8: Local/specific study area context
1.2 Problem Statement: Ideal → Reality → Gap → Anchor formula (~140 words per paragraph)
1.3 Objectives of the study — CRITICAL FORMAT RULES:
   This section MUST be formatted as structured lists, NOT paragraphs.
   Use this EXACT HTML structure:

   <h4>1.3.1 Main Objective</h4>
   <p>The main objective of this study is to [verb e.g. assess/examine/investigate] [topic focus] in [study site].</p>

   <h4>1.3.2 Specific Objectives</h4>
   <p>The following are the specific objectives of the study:</p>
   <ol>
     <li>To identify [specific aspect 1] in [study site].</li>
     <li>To examine [specific aspect 2] related to [topic].</li>
     <li>To assess [specific aspect 3] among [population].</li>
     <li>To recommend [strategies/interventions] for improving [outcome].</li>
   </ol>

   <h4>1.3.3 Research Questions</h4>
   <p>The study was guided by the following research questions:</p>
   <ol>
     <li>What are the [aspect 1] in [study site]?</li>
     <li>How does [aspect 2] relate to [topic]?</li>
     <li>What is the extent of [aspect 3] among [population]?</li>
     <li>What recommendations can be made to improve [outcome]?</li>
   </ol>

   RULES:
   - Use Bloom's taxonomy verbs for specific objectives: To identify, To examine, To assess, To determine, To analyse, To evaluate, To recommend
   - Each research question must directly correspond to its matching specific objective
   - Number them 1–4 consistently
   - Do NOT write paragraphs in this section — only the structured HTML above

1.4 Significance: Who benefits, link to SDG and National Development Goal (~140 words)
1.5 Summary: Recap and transition to Chapter 2 (~110 words)

Format: HTML with <p>, <h4>, <ol>, <li> tags as appropriate. Text Alignment: Justified for paragraphs.`;
    }
    
    else if (chapterNum === 2) {
        prompt += `Task: Write Chapter 2: Literature Review for the topic: "${topic}".

STRICT RULES FOR CHAPTER 2:
1. SYNTHESIS: Do not list quotes. Compare/contrast authors (e.g., "While A argues X, B suggests Y").
2. DENSITY: Paragraphs must be LONG and DENSE (approx 15-20 lines each, ~140 words).
3. CITATIONS: High density. Use recent sources (last 5-10 years) for empirical sections. Use grouped citations (Smith, 2019; Jones, 2021). Use SEMINAL/OLD sources (1900s-2000s) for the Theoretical Framework section.
4. LANGUAGE: Simple, straightforward English.

Structure from plan:
${plan.map(s => `${s.heading} - ${s.paragraphs} paragraphs × ${s.wordsPerPara} words: ${s.guidelines}`).join('\n')}

SECTION-BY-SECTION CONTENT GUIDE:

2.0 Introduction (1 Para, ~50 words):
State that this chapter reviews literature, theories, and the conceptual framework.

2.1 The Main Concept (Write exactly 5 DENSE paragraphs, ~140 words each):
- Para 1 (Definitions): Define the core concept using 3 authoritative sources. Synthesize them into a working definition.
- Para 2 (Purpose/Function): Explain the role/function of this concept in the field. Why is it used?
- Para 3 (Classifications/Types): Discuss types/categories (e.g., Type A vs Type B).
- Para 4 (Success Factors): What makes this work? (Infrastructure, management, etc.).
- Para 5 (Challenges): Why does it fail in developing contexts? Cite World Bank/WHO/Industry reports.

2.2 Theoretical Framework:
- 2.2.0 [Name of Core Theory] (2-3 Paras, ~140 words each): Identify a specific relevant theory. Explain Origin (Who/When?), Core Assumptions, and explicitly state how it relates to this study. Use SEMINAL sources (1900s-2000s).
- 2.2.1 Empirical Factors (2 Paras, ~140 words each): Move from theory to evidence. What do recent CONTEMPORARY studies say are the key determinants?
- 2.2.2 Other Related Studies (2 Paras, ~140 words each): Review global case studies (e.g., "Study A in Indonesia... Study B in Nigeria..."). End with the RESEARCH GAP — explicitly state how this study differs from existing literature.

2.3 Conceptual Framework (2 Paras, ~140 words each):
- Describe the relationship between variables (Input/Independent → Output/Dependent).
- MANDATORY: Include this exact text on a new line: "<strong>[Figure 1: Conceptual framework of the study]</strong>"

2.4 Chapter Summary (1 Para, ~130 words):
- Summarize definitions, the specific theory used, and empirical factors.
- Mention that this sets the stage for Methodology.

Format: HTML with <p> tags. Text Alignment: Justified. No Indentation.`;
    }
    
        else if (chapterNum === 3) {
        prompt += `Task: Write Chapter 3: Research Methodology for the topic: "${topic}".

STRICT WRITING RULE: The "Define-Apply-Justify" Pattern.
For Sections 3.1, 3.3, 3.4, and 3.5, you MUST follow this exact formula:
1. DEFINE the concept using a standard citation (e.g., Kothari, Creswell, Saunders, Bryman).
2. APPLY it to this study (e.g., "The study adopted...").
3. JUSTIFY why it was chosen.

CITATION DENSITY: HIGH. You MUST cite a methodological authority (e.g., Kothari, 2004; Creswell, 2014; Saunders et al., 2019; Bryman, 2012) in EVERY SINGLE PARAGRAPH. Do not define anything without a citation.
TENSE: Use Past Tense for actions taken (e.g., "Data was collected"). Use Present Tense for definitions.
PARAGRAPH LENGTH: Each body paragraph ~140 words.

Structure from plan:
${plan.map(s => `${s.heading} - ${s.paragraphs} paragraphs × ${s.wordsPerPara} words: ${s.guidelines}`).join('\n')}

SECTION-BY-SECTION CONTENT GUIDE:

3.0 Introduction (1 Para, ~40 words):
Outline methods, design, setting, sampling, data collection, and analysis tools used in the study.

3.1 Research Design (2 Paras, ~140 words each):
- Define "Research Design" (Cite Creswell or Kothari).
- Apply: State if Qualitative, Quantitative, or Mixed.
- Justify: Why does this design fit the topic?

3.2 Study Setting (2 Paras, ~140 words each):
- Describe the specific Study Area.
- Justify why this setting was chosen for the study.

3.3 Sampling Technique (2 Paras, ~140 words each):
- Define "Sampling" (Cite Saunders or Kothari).
- Apply: Technique (Purposive/Random/Stratified) and Respondents (Who? How many?).
- Justify: Why appropriate for this study?

3.4 Data Collection:
- 3.4.1 Primary Data Collection (1 Para, ~140 words): Describe fieldwork (Surveys/Interviews/Observations). State specific tools used. Cite a methodologist.
- 3.4.2 Secondary Data Collection (1 Para, ~140 words): Desk research (Documents/Reports/Previous Studies). Justify their value to the study.
- 3.4.3 Details of Data Collection (2 Paras, ~140 words each): CRITICAL — Break down by Objectives. (e.g., "To address Objective 1, in-depth interviews were conducted with... To address Objective 2, structured questionnaires were administered to...").

3.5 Data Analysis (2 Paras, ~140 words each):
- Define "Data Analysis" (Cite a methodologist).
- Apply: Thematic Analysis (Qualitative) or SPSS/Excel (Quantitative).
- Mention use of tables and charts to present findings.

3.6 Ethical Consideration (1 Para, ~100 words):
Cover: Informed Consent, Anonymity and Confidentiality, Voluntary Participation, and Institutional approval.

3.7 Chapter Summary (1 Para, ~110 words):
Recap the research design and overall approach. Transition sentence leading into Chapter 4.

Format: HTML with <p> tags. Text Alignment: Justified. No Indentation.`;
    }
    
        else if (chapterNum === 4) {
        prompt += `Task: Write Chapter 4: Findings for the topic: "${topic}".

${dissState.researchData ? `USE THIS REAL DATA: "${dissState.researchData}"` : 'Hallucinate realistic data that is plausible and fits the study context.'}

STYLE RULE: Sandwich Method for every theme sub-section:
1. CLAIM (Narrative, ~10 lines): State the finding and describe what respondents/data said.
2. EVIDENCE (Block Quote): A representative direct quote or data point from a respondent/source.
3. TRIANGULATION (~10 lines): Discuss and link the evidence back to theory from Chapter 2 and existing literature.

LANGUAGE: Simple, straightforward English.
PARAGRAPH LENGTH: Each body paragraph ~140 words.
CITATIONS: Every analytical paragraph must cite at least one source from Chapter 2 literature.

Structure from plan:
${plan.map(s => `${s.heading} - ${s.paragraphs} paragraphs × ${s.wordsPerPara} words: ${s.guidelines}`).join('\n')}

SECTION-BY-SECTION CONTENT GUIDE:

4.0 Introduction (1 Para, ~60 words):
Brief overview of how findings are presented in this chapter.

4.1 Response Rate (1 Para, ~60 words):
State the survey/interview response statistics (e.g., "Of the 50 questionnaires distributed, 46 were returned, representing a 92% response rate").

4.2 Context / General Development (2 Paras, ~140 words each):
Describe the general situation or context at the study site before diving into the thematic analysis.

4.3 Findings on Theme 1 (Linked to Objective 1):
Create 3 Sub-sections. Each sub-section MUST follow the Sandwich Method:
- Narrative (10 lines): What the data shows
- Block Quote: Direct evidence
- Discussion (10 lines): Link to theory/literature

4.4 Findings on Theme 2 (Linked to Objective 2):
Create 2 Sub-sections. Each sub-section MUST follow the Sandwich Method:
- Narrative (10 lines): What the data shows
- Block Quote: Direct evidence
- Discussion (10 lines): Link to theory/literature

4.5 Evaluation with Regards to Core Theory (3 Paras, ~140 words each):
Critical analysis. Does the data MATCH or CONTRADICT the Chapter 2 theory? Discuss "Optimal vs Sub-optimal" outcomes. Use citations to support the evaluation.

4.6 Key Identified Challenges (Bullet points, ~100 words total):
List the main challenges identified in the study using clear bullet points.

4.7 Chapter Conclusion (2 Paras, ~110 words each):
Summarize the key findings from this chapter. Transition to Chapter 5.

Format: HTML with <p> tags. Text Alignment: Justified. No Indentation.`;
    }
    
        else if (chapterNum === 5) {
        prompt += `Task: Write Chapter 5: Conclusions & Recommendations

${dissState.researchData ? `Based on findings: "${dissState.researchData.substring(0, 500)}..."` : ''}

LANGUAGE: Simple, straightforward English
PARAGRAPH LENGTH: Each body paragraph ~140 words.

Structure from plan:
${plan.map(s => `${s.heading} - ${s.paragraphs} paragraphs × ${s.wordsPerPara} words: ${s.guidelines}`).join('\n')}

Section Guidelines:
5.0 Introduction: Overview (~60 words)
5.1 Conclusions: (~3 paras × 140 words each)
   - Verdict on main objective
   - Synthesis of findings
   - Implications for national goal
5.2 Recommendations: 4-5 sub-sections (~140 words each)
   STYLE RULE: "Model-Based"
   For EACH recommendation:
   1. Propose strategy
   2. Link to Ch4 failure
   3. MANDATORY: Cite international model (Vietnam/China/Singapore example)
   4. Expected benefit
5.3 Further Research: Suggestions (~60 words)

Format: HTML with <p> tags. Text Alignment: Justified.`;
    }
    
    return prompt;
}

async function regenerateChapter(chapterNum) {
    // Route through the feedback revision flow so users can guide the rewrite
    startChapterRevision(chapterNum);
}

function proceedToNext(chapterNum) {
    const nextChapter = chapterNum + 1;
    
    // Check if we need data input (after chapter 3)
    if (nextChapter === 4 && !dissState.researchData) {
        showDataInputModal();
        return;
    }
    
    if (nextChapter <= 5) {
        startChapterWorkflow(nextChapter);
    } else {
        // All chapters done, generate references
        appendMsg('ai', `
            <h3><i class="fas fa-book"></i> Generate References</h3>
            <p>All chapters complete! Generate the reference list to finish your dissertation.</p>
            <button class="btn-primary" onclick="generateReferences()">
                <i class="fas fa-book"></i> Generate References
            </button>
        `);
    }
}

/* =========================================================
   DATA INPUT MODAL
   ========================================================= */
function showDataInputModal() {
    document.getElementById('data-input-modal').style.display = 'flex';
}

function closeDataInputModal() {
    document.getElementById('data-input-modal').style.display = 'none';
}

function selectDataOption(option) {
    document.getElementById('paste-data-section').style.display = option === 'paste' ? 'block' : 'none';
    document.getElementById('research-data-section').style.display = option === 'research' ? 'block' : 'none';
}

function submitResearchData() {
    const data = document.getElementById('research-data-input').value.trim();
    
    if (!data) {
        showNotification('Please enter your research data', 'error');
        return;
    }
    
    dissState.researchData = data;
    saveDissertation();
    closeDataInputModal();
    
    appendMsg('ai', `
        <h3><i class="fas fa-check-circle"></i> Research Data Received</h3>
        <p>Thank you! I'll use this data to write Chapters 4 and 5.</p>
        <button class="btn-primary" onclick="startChapterWorkflow(4)">
            <i class="fas fa-forward"></i> Continue to Chapter 4
        </button>
    `);
}

async function performDeskResearch() {
    const query = document.getElementById('research-query-input').value.trim();
    
    if (!query) {
        showNotification('Please enter a research query', 'error');
        return;
    }
    
    closeDataInputModal();
    
    appendMsg('ai', `
        <h3><i class="fas fa-search"></i> Conducting Desk Research</h3>
        <p>Searching for data on: ${escHtml(query)}</p>
        <div class="loading-indicator">
            <div class="loading-spinner"></div>
            <span>Researching...</span>
        </div>
    `);
    
    setStatus('Researching...');
    
    try {
        const prompt = `Conduct desk research on: ${query}

Find and synthesize:
1. Recent statistics and data
2. Case studies and examples
3. Current trends and findings
4. Relevant reports or publications

Topic context: ${dissState.topic}

Provide comprehensive data that can be used for dissertation findings chapter.`;

        const response = await callGeminiAPI(prompt);
        
        dissState.researchData = response;
        saveDissertation();
        
        const messages = document.querySelectorAll('.msg');
        const lastMsg = messages[messages.length - 1];
        lastMsg.querySelector('.msg-content').innerHTML = `
            <h3><i class="fas fa-check-circle"></i> Research Complete</h3>
            <p>I've gathered data on your topic. Here's a summary:</p>
            <div style="background: var(--bg-2); padding: 14px; border-radius: var(--radius); margin: 10px 0; max-height: 300px; overflow-y: auto;">
                ${response.substring(0, 500)}...
            </div>
            <button class="btn-primary" onclick="startChapterWorkflow(4)">
                <i class="fas fa-forward"></i> Continue to Chapter 4
            </button>
        `;
        
        setStatus('Ready');
        
    } catch (error) {
        console.error('Error in desk research:', error);
        const messages = document.querySelectorAll('.msg');
        const lastMsg = messages[messages.length - 1];
        lastMsg.querySelector('.msg-content').innerHTML = `
            <h3><i class="fas fa-exclamation-triangle"></i> Error</h3>
            <p>Sorry, I couldn't complete the research. Please try entering data manually.</p>
            <button class="btn-primary" onclick="showDataInputModal()">
                <i class="fas fa-redo"></i> Try Again
            </button>
        `;
        setStatus('Error');
    }
}

/* =========================================================
   REFERENCES GENERATION
   ========================================================= */
async function generateReferences() {
    appendMsg('ai', `
        <h3><i class="fas fa-book"></i> Generating References</h3>
        <p>Creating comprehensive reference list in APA 7th edition...</p>
        <div class="loading-indicator">
            <div class="loading-spinner"></div>
            <span>Compiling references...</span>
        </div>
    `);
    
    setStatus('Generating references...');
    
    try {
        // Gather all content to find citations
        let allText = "";
        for (let i = 1; i <= 5; i++) {
            if (dissState.chapters[i].content) {
                allText += dissState.chapters[i].content + " ";
            }
        }
        
        // Extract citations
        const citationRegex = /\(([A-Za-z\s&]+),\s*(\d{4})\)/g;
        let matches = [...allText.matchAll(citationRegex)];
        let uniqueCitations = [...new Set(matches.map(m => `${m[1]} (${m[2]})`))];
        let citationList = uniqueCitations.join(", ");
        
        const prompt = `Task: Generate a comprehensive Reference List in APA 7th Edition format for: "${dissState.topic}"

Instructions:
1. I detected these citations: [${citationList}]. Include full references for these.
2. If details missing, hallucinate plausible academic details fitting the context.
3. Add standard methodological references (Kothari, C. R. (2004), Creswell, J. W. (2014), Saunders et al. (2019)).
4. Ensure alphabetical order.
5. Format with hanging indent: <p style="margin-left: 20px; text-indent: -20px;">
6. MALAWI GOVERNMENT RULE: Any citation that is "Government of Malawi" refers to a Malawi government document (Act, policy, plan, ministerial or council report). Format in the reference list as: Government of Malawi. (Year). [Title of document]. Ministry/Department name. Do NOT list it under the Act or policy name — always use "Government of Malawi" as the author.

Output: HTML only. No markdown.`;

        const response = await callGeminiAPI(prompt);
        
        const cleanRefs = response.replace(/```html/g, '').replace(/```/g, '').trim();
        dissState.references = cleanRefs;
        saveDissertation();
        
        const messages = document.querySelectorAll('.msg');
        const lastMsg = messages[messages.length - 1];
        lastMsg.querySelector('.msg-content').innerHTML = `
            <h3><i class="fas fa-trophy"></i> Dissertation Complete!</h3>
            <p>All chapters and references are ready. Your dissertation is complete!</p>
            <div style="background: var(--bg-2); padding: 14px; border-radius: var(--radius); margin: 10px 0; max-height: 400px; overflow-y: auto;">
                <strong>References:</strong>
                ${cleanRefs}
            </div>
            <p style="margin-top: 16px;">Click the "Export .doc" button at the top to download your complete dissertation.</p>
        `;
        
        setStatus('Complete');
        setActiveStep(4);
        updateExportButtonDiss();
        
    } catch (error) {
        console.error('Error generating references:', error);
        const messages = document.querySelectorAll('.msg');
        const lastMsg = messages[messages.length - 1];
        lastMsg.querySelector('.msg-content').innerHTML = `
            <h3><i class="fas fa-exclamation-triangle"></i> Error</h3>
            <p>Sorry, I couldn't generate references. Please try again.</p>
            <button class="btn-primary" onclick="generateReferences()">
                <i class="fas fa-redo"></i> Try Again
            </button>
        `;
        setStatus('Error');
    }
}

/* =========================================================
   DISSERTATION STORAGE
   ========================================================= */
function saveDissertation() {
    dissState.lastModified = new Date().toISOString();
    if (!dissState.id) {
        dissState.id = 'dissertation_' + Date.now();
        dissState.createdAt = dissState.lastModified;
    }
    localStorage.setItem(dissState.id, JSON.stringify(dissState));
    updateSavedDissertationsList();
}

function loadDissertation(id) {
    const data = localStorage.getItem(id);
    if (data) {
        dissState = JSON.parse(data);
        reconstructDissertationUI();
    }
}

function reconstructDissertationUI() {
    // Clear chat
    document.getElementById('chat-thread').innerHTML = '';
    
    // Show topic
    appendMsg('ai', `
        <h3><i class="fas fa-book"></i> Loaded Dissertation</h3>
        <p><strong>Topic:</strong> ${escHtml(dissState.topic)}</p>
    `);
    
    // Show concept note if available
    if (dissState.conceptNote) {
        appendMsg('ai', `
            <h3><i class="fas fa-file-alt"></i> Concept Note</h3>
            <div class="chapter-content">
                <div class="chapter-text">${dissState.conceptNote}</div>
            </div>
            <div class="action-row" style="margin-top: 12px;">
                <button class="btn-outline" onclick="downloadConceptNote()">
                    <i class="fas fa-download"></i> Download Concept Note
                </button>
            </div>
        `);
    }
    
    // Show completed chapters
    for (let i = 1; i <= 5; i++) {
        const chapter = dissState.chapters[i];
        if (chapter.content) {
            appendMsg('ai', `
                <h3><i class="fas fa-check-circle"></i> ${chapter.title}</h3>
                <div class="chapter-content">
                    <div class="chapter-text">${chapter.content}</div>
                </div>
                <div class="action-row" style="margin-top: 12px;">
                    <button class="btn-outline" onclick="startChapterRevision(${i})">
                        <i class="fas fa-comment-dots"></i> Revise with Feedback
                    </button>
                    <button class="btn-outline" onclick="downloadChapter(${i})">
                        <i class="fas fa-download"></i> Download Chapter ${i}
                    </button>
                </div>
            `);
        }
    }
    
    // Show references if available
    if (dissState.references) {
        appendMsg('ai', `
            <h3><i class="fas fa-book"></i> References</h3>
            <div style="background: var(--bg-2); padding: 14px; border-radius: var(--radius);">
                ${dissState.references}
            </div>
        `);
    }
    
    // Determine next action
    const completedChapters = Object.values(dissState.chapters).filter(ch => ch.content).length;
    
    if (completedChapters < 5) {
        const nextChapter = completedChapters + 1;
        if (nextChapter === 4 && !dissState.researchData) {
            appendMsg('ai', `
                <h3><i class="fas fa-database"></i> Data Required</h3>
                <p>Complete the first three chapters. To proceed with Chapters 4 & 5, I need your research data.</p>
                <button class="btn-primary" onclick="showDataInputModal()">
                    <i class="fas fa-database"></i> Provide Research Data
                </button>
            `);
        } else {
            appendMsg('ai', `
                <h3><i class="fas fa-forward"></i> Continue</h3>
                <p>Ready to continue with Chapter ${nextChapter}?</p>
                <button class="btn-primary" onclick="startChapterWorkflow(${nextChapter})">
                    <i class="fas fa-forward"></i> Continue to Chapter ${nextChapter}
                </button>
            `);
        }
    } else if (!dissState.references) {
        appendMsg('ai', `
            <h3><i class="fas fa-book"></i> Generate References</h3>
            <p>All chapters complete. Generate the reference list to finish.</p>
            <button class="btn-primary" onclick="generateReferences()">
                <i class="fas fa-book"></i> Generate References
            </button>
        `);
    }
    
    updateChapterTracker();
    updateExportButtonDiss();
}

function getAllDissertations() {
    const dissertations = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('dissertation_')) {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                dissertations.push({
                    id: key,
                    topic: data.topic || 'Untitled',
                    createdAt: data.createdAt,
                    lastModified: data.lastModified
                });
            } catch(e) {}
        }
    }
    return dissertations.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
}

function updateSavedDissertationsList() {
    const container = document.getElementById('saved-assignments');
    const dissertations = getAllDissertations();
    
    if (dissertations.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = dissertations.map(d => `
        <div class="saved-item ${d.id === dissState.id ? 'active' : ''}" 
             onclick="loadDissertation('${d.id}')">
            <span class="saved-item-text">
                ${escHtml(d.topic.substring(0, 30))}${d.topic.length > 30 ? '...' : ''}
            </span>
            <span class="saved-item-date">${new Date(d.lastModified).toLocaleDateString()}</span>
            <button class="saved-item-delete" onclick="event.stopPropagation(); deleteDissertation('${d.id}')" title="Delete dissertation">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function deleteDissertation(id) {
    showConfirmModal(
        'Delete Dissertation',
        'Are you sure you want to delete this dissertation? This action cannot be undone.',
        () => {
            localStorage.removeItem(id);
            if (dissState.id === id) {
                startNewDissertation();
            }
            updateSavedDissertationsList();
        }
    );
}

function startNewDissertation() {
    if (dissState.topic) saveDissertation();
    
    dissState = {
        id: null,
        topic: "",
        program: "",
        region: "",
        selectedTopicData: null,
        hasConceptNote: false,
        conceptNote: "",
        currentChapter: 0,
        chapters: {
            1: { title: "Chapter 1: Study Overview", content: "", plan: null, approved: false },
            2: { title: "Chapter 2: Literature Review", content: "", plan: null, approved: false },
            3: { title: "Chapter 3: Research Methodology", content: "", plan: null, approved: false },
            4: { title: "Chapter 4: Findings", content: "", plan: null, approved: false },
            5: { title: "Chapter 5: Conclusions & Recommendations", content: "", plan: null, approved: false }
        },
        researchData: "",
        references: "",
        createdAt: null,
        lastModified: null
    };
    
    document.getElementById('chat-thread').innerHTML = '';
    initDissertationMode();
}

function updateChapterTracker() {
    const tracker = document.getElementById('para-counter');
    const completed = Object.values(dissState.chapters).filter(ch => ch.content).length;
    tracker.textContent = `Chapters: ${completed}/5`;
    tracker.style.display = completed > 0 ? 'block' : 'none';
}

function updateExportButtonDiss() {
    const btn = document.getElementById('export-btn');
    const hasContent = Object.values(dissState.chapters).some(ch => ch.content);
    
    if (hasContent) {
        btn.disabled = false;
        btn.classList.add('ready');
        btn.onclick = exportDissertation;
    } else {
        btn.disabled = true;
        btn.classList.remove('ready');
    }
}

function exportDissertation() {
    let bodyContent = '';
    
    for (let i = 1; i <= 5; i++) {
        const chapter = dissState.chapters[i];
        if (chapter.content) {
            bodyContent += buildWordSection(chapter.title, chapter.content);
        }
    }
    
    if (dissState.references) {
        bodyContent += buildWordSection('References', dissState.references);
    }
    
    const doc = buildWordDoc(dissState.topic, bodyContent);
    const safeTitle = dissState.topic.substring(0, 40).replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '_');
    triggerDownload(doc, `${safeTitle}_Full_Dissertation.doc`);
}

/* =========================================================
   CHAPTER DOWNLOAD — individual chapter with its own references
   ========================================================= */
async function downloadChapter(chapterNum) {
    const chapter = dissState.chapters[chapterNum];
    if (!chapter || !chapter.content) {
        showNotification('No content to download for this chapter.', 'error');
        return;
    }
    
    showNotification(`Preparing Chapter ${chapterNum} download…`, 'info');
    
    let refsHtml = '';
    
    // If full reference list exists, filter it to citations in this chapter; otherwise generate fresh
    if (dissState.references) {
        refsHtml = filterRefsForChapter(chapter.content, dissState.references);
    } else {
        // Generate references specifically for this chapter
        refsHtml = await generateChapterRefsHtml(chapter.content, chapterNum);
    }
    
    const bodyContent = buildWordSection(chapter.title, chapter.content) 
                      + (refsHtml ? buildWordSection('References', refsHtml) : '');
    
    const doc = buildWordDoc(`${dissState.topic}\n${chapter.title}`, bodyContent);
    const safeTitle = `Chapter_${chapterNum}_${chapter.title.replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '_').substring(0, 30)}`;
    triggerDownload(doc, `${safeTitle}.doc`);
}

function filterRefsForChapter(chapterContent, allRefsHtml) {
    // Extract all (Author, Year) citations from this chapter
    const citationRegex = /\(([A-Za-z][A-Za-z\s&\-']+),\s*(\d{4}[a-z]?)\)/g;
    const matches = [...chapterContent.matchAll(citationRegex)];
    if (matches.length === 0) return allRefsHtml; // return all if none found
    
    // Get unique last names to filter by
    const authorKeys = [...new Set(matches.map(m => m[1].trim().split(/\s+/).pop().toLowerCase()))];
    
    // Parse the full refs HTML into individual <p> entries and filter
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${allRefsHtml}</div>`, 'text/html');
    // Select both class="ref" and legacy inline-styled paragraphs
    const allPs = doc.querySelectorAll('p');
    
    let filteredHtml = '';
    allPs.forEach(p => {
        const text = p.textContent.toLowerCase();
        const matched = authorKeys.some(key => text.startsWith(key) || text.includes(key + ',') || text.includes(key + ' '));
        if (matched) {
            // Ensure the class="ref" is on the output paragraph
            p.setAttribute('class', 'ref');
            p.removeAttribute('style');
            filteredHtml += p.outerHTML;
        }
    });
    
    return filteredHtml || allRefsHtml;
}

async function generateChapterRefsHtml(chapterContent, chapterNum) {
    try {
        const citationRegex = /\(([A-Za-z][A-Za-z\s&\-']+),\s*(\d{4}[a-z]?)\)/g;
        const matches = [...chapterContent.matchAll(citationRegex)];
        const uniqueCitations = [...new Set(matches.map(m => `${m[1].trim()} (${m[2]})`))]
            .filter(c => c.length > 5);
        
        if (uniqueCitations.length === 0) return '';

        const includeDoi = dissState.includeDoi === true;
        
        const prompt = `Generate a Reference List in APA 7th Edition format for a dissertation chapter on: "${dissState.topic}"

These citations were found in the chapter:
${uniqueCitations.join('\n')}

STRICT APA 7th EDITION RULES:
1. Write a COMPLETE APA 7th edition reference for EVERY citation listed above.
2. Sort ALL references STRICTLY alphabetically by first author's surname (A → Z). Never deviate.
3. If exact publication details are unknown, generate plausible academic details that fit the author name and topic.

FORMAT RULES BY SOURCE TYPE:
• Journal article: Author, A. A., & Author, B. B. (Year). Title of article in sentence case. Journal Name in Title Case, volume(issue), first–last page.${includeDoi ? ' https://doi.org/xxxxx' : ''}
• Book: Author, A. A. (Year). Title of work in sentence case: Subtitle. Publisher Name.
• Chapter in edited book: Author, A. A. (Year). Chapter title. In E. Editor (Ed.), Book title (pp. xx–xx). Publisher.
• Government/institutional report: Government of Malawi. (Year). Title of document. Ministry/Department Name.
• Website: Author, A. A. (Year). Title of page. Site Name. URL

FORMATTING RULES:
4. Wrap EACH reference in: <p class="ref">…</p>
5. Each reference must stand alone on its own <p class="ref"> tag.
6. MALAWI GOVERNMENT RULE: Any "Government of Malawi" citation → format as: Government of Malawi. (Year). [Title of document]. Ministry/Department name. NEVER use the Act name or policy name as the author.
${includeDoi ? '7. Include DOIs where applicable in format: https://doi.org/10.XXXX/xxxxx' : '7. DO NOT include DOI or URL for journal articles and books. Only include URLs for websites/online reports.'}

Output ONLY the <p class="ref"> tags in alphabetical order. No headings, no markdown, no intro text, no numbered list.`;

        const response = await callGeminiAPI(prompt);
        return response.replace(/```html/g, '').replace(/```/g, '').trim();
    } catch (e) {
        console.error('Error generating chapter refs:', e);
        return '';
    }
}

/* =========================================================
   WORD DOC BUILDER HELPERS — shared by all downloads
   ========================================================= */

/**
 * Sanitize arbitrary HTML for clean Word output.
 * Strips app-specific wrapper divs, inline styles that distort Word,
 * class/id attributes, and converts semantic structure to plain block elements.
 */
function sanitizeForWord(html) {
    if (!html) return '';
    
    // 1. Parse into a DOM fragment
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    
    // 2. Unwrap purely presentational/app wrapper elements
    //    (div, span, section, article, aside, figure, figcaption, mark, small, sub, sup)
    const unwrapTags = ['div', 'span', 'section', 'article', 'aside', 'figure',
                        'figcaption', 'mark', 'small'];
    let changed = true;
    while (changed) {
        changed = false;
        unwrapTags.forEach(tag => {
            tmp.querySelectorAll(tag).forEach(el => {
                // Keep <span> only if it carries bold/italic inline role — unwrap all others
                const parent = el.parentNode;
                if (!parent) return;
                while (el.firstChild) {
                    parent.insertBefore(el.firstChild, el);
                }
                parent.removeChild(el);
                changed = true;
            });
        });
    }
    
    // 3. Before stripping styles — tag any hanging-indent paragraphs as references
    tmp.querySelectorAll('p').forEach(el => {
        const style = el.getAttribute('style') || '';
        if (/text-indent\s*:\s*-/i.test(style)) {
            el.setAttribute('class', 'ref');
        }
    });

    // 4. Strip ALL inline styles, class (except "ref" on p), id attributes from every element
    tmp.querySelectorAll('*').forEach(el => {
        el.removeAttribute('style');
        // Preserve class="ref" on p elements
        if (!(el.tagName === 'P' && el.getAttribute('class') === 'ref')) {
            el.removeAttribute('class');
        }
        el.removeAttribute('id');
        el.removeAttribute('data-index');
        // Remove any on* event handlers
        [...el.attributes].forEach(attr => {
            if (attr.name.startsWith('on')) el.removeAttribute(attr.name);
        });
    });
    
    // 4. Demote h1→h3 since h2 is used as section heading by buildWordSection
    tmp.querySelectorAll('h1').forEach(el => {
        const h3 = document.createElement('h3');
        h3.innerHTML = el.innerHTML;
        el.parentNode.replaceChild(h3, el);
    });
    
    // 5. Remove empty paragraphs that only contain &nbsp; or whitespace
    //    (Word handles spacing via styles; extra &nbsp; paras add unwanted blank lines)
    tmp.querySelectorAll('p').forEach(el => {
        const text = el.textContent.replace(/\u00a0/g, '').trim();
        if (!text && !el.querySelector('img')) {
            el.remove();
        }
    });
    
    // 6. Strip <br> tags — use paragraphs instead
    tmp.querySelectorAll('br').forEach(el => {
        el.parentNode.removeChild(el);
    });
    
    return tmp.innerHTML;
}

function buildWordSection(heading, contentHtml) {
    const clean = sanitizeForWord(contentHtml);
    return `
        <h2>${escHtml(heading)}</h2>
        ${clean}
        <p>&nbsp;</p>
    `;
}

function buildWordDoc(title, bodyHtml) {
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const lines = title.split('\n');
    const mainTitle = lines[0] || '';
    const subTitle  = lines[1] || '';

    // Sanitize the full body so no app-specific markup leaks into Word
    const cleanBody = sanitizeForWord(bodyHtml);

    return `<html xmlns:o='urn:schemas-microsoft-com:office:office'
               xmlns:w='urn:schemas-microsoft-com:office:word'
               xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>${escHtml(mainTitle)}</title>
<!--[if gte mso 9]>
<xml>
  <w:WordDocument>
    <w:View>Print</w:View>
    <w:Zoom>100</w:Zoom>
    <w:DoNotOptimizeForBrowser/>
    <w:DocumentKind>DocumentEmail</w:DocumentKind>
  </w:WordDocument>
</xml>
<![endif]-->
<style>
  /* ---- Page layout ---- */
  @page Section1 {
    size: 595.3pt 841.9pt; /* A4 */
    margin: 72pt 72pt 72pt 72pt; /* 1 inch all sides */
    mso-header-margin: 36pt;
    mso-footer-margin: 36pt;
    mso-paper-source: 0;
  }
  div.Section1 { page: Section1; }

  /* ---- Base ---- */
  body, p, h1, h2, h3, h4, li, blockquote, td {
    font-family: 'Times New Roman', Times, serif;
    color: #000000;
    background: transparent;
    mso-ansi-language: EN-US;
  }
  body {
    font-size: 12.0pt;
    line-height: 200%;
    mso-line-height-rule: exactly;
    text-align: justify;
    margin: 0;
    padding: 0;
  }

  /* ---- Title block ---- */
  h1.doc-main-title {
    font-size: 14.0pt;
    font-weight: bold;
    text-align: center;
    text-transform: uppercase;
    margin-top: 0pt;
    margin-bottom: 6pt;
    line-height: 150%;
    mso-style-next: Normal;
    page-break-after: avoid;
  }
  h1.doc-sub-title {
    font-size: 13.0pt;
    font-weight: bold;
    text-align: center;
    margin-top: 0pt;
    margin-bottom: 4pt;
    line-height: 150%;
    page-break-after: avoid;
  }
  p.doc-date {
    font-size: 11.0pt;
    text-align: center;
    color: #444444;
    margin-top: 0pt;
    margin-bottom: 36pt;
  }

  /* ---- Section headings ---- */
  h2 {
    font-size: 13.0pt;
    font-weight: bold;
    text-align: left;
    margin-top: 24pt;
    margin-bottom: 12pt;
    line-height: 150%;
    page-break-before: always;
    mso-style-next: Normal;
  }
  h2:first-of-type {
    page-break-before: avoid;
  }
  h3 {
    font-size: 12.0pt;
    font-weight: bold;
    text-align: left;
    margin-top: 18pt;
    margin-bottom: 8pt;
    line-height: 150%;
    page-break-after: avoid;
  }
  h4 {
    font-size: 12.0pt;
    font-weight: bold;
    text-decoration: underline;
    text-align: left;
    margin-top: 14pt;
    margin-bottom: 6pt;
    line-height: 150%;
    page-break-after: avoid;
  }

  /* ---- Body paragraphs ---- */
  p {
    font-size: 12.0pt;
    margin-top: 0pt;
    margin-bottom: 12pt;
    text-align: justify;
    line-height: 200%;
    mso-line-height-rule: exactly;
    orphans: 2;
    widows: 2;
  }

  /* ---- Lists ---- */
  ol, ul {
    font-size: 12.0pt;
    margin-top: 6pt;
    margin-bottom: 12pt;
    padding-left: 36pt;
    line-height: 200%;
  }
  li {
    font-size: 12.0pt;
    margin-bottom: 6pt;
    line-height: 200%;
    text-align: justify;
  }

  /* ---- Blockquotes ---- */
  blockquote {
    font-size: 11.0pt;
    margin: 12pt 0pt 12pt 36pt;
    font-style: italic;
    line-height: 150%;
  }

  /* ---- Inline emphasis ---- */
  strong, b { font-weight: bold; }
  em, i     { font-style: italic; }

  /* ---- References (APA 7th ed. hanging indent: 0.5 inch) ---- */
  p.ref {
    font-size: 12.0pt;
    margin-top: 0pt;
    margin-bottom: 6pt;
    margin-left: 36pt;
    text-indent: -36pt;
    text-align: left;
    line-height: 200%;
    mso-line-height-rule: exactly;
  }

  /* ---- Divider ---- */
  hr.divider {
    border: none;
    border-top: 2px solid #000000;
    margin: 12pt 0pt 24pt 0pt;
    mso-border-top-alt: solid black .5pt;
  }
</style>
</head>
<body>
<div class="Section1">
  <h1 class="doc-main-title">${escHtml(mainTitle)}</h1>
  ${subTitle ? `<h1 class="doc-sub-title">${escHtml(subTitle)}</h1>` : ''}
  <p class="doc-date">${date}</p>
  <hr class="divider">
  ${cleanBody}
</div>
</body>
</html>`;
}

function triggerDownload(htmlContent, filename) {
    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

/* =========================================================
   API HELPER
   ========================================================= */
async function callGeminiAPI(prompt) {
    for (let attempt = 0; attempt < 5; attempt++) {
        const activeKey = API_KEYS[(_keyIdx + attempt) % API_KEYS.length];
        const model = MODELS[_modelIdx % MODELS.length];
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${activeKey}`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            if (!response.ok) {
                // Try next key on failure
                continue;
            }

            const data = await response.json();
            _keyIdx = (_keyIdx + 1) % API_KEYS.length;
            return data.candidates[0].content.parts[0].text;

        } catch (e) {
            console.error("API error:", e);
        }
    }
    
    throw new Error("Failed to get response from API after multiple attempts");
}

/* =========================================================
   PREVIEW MODAL (Show content so far)
   ========================================================= */
function showPreviewModal() {
    const modal = document.getElementById('preview-modal');
    const paperView = document.getElementById('paper-view');
    
    if (currentMode === 'dissertation') {
        let html = '';
        
        if (dissState.topic) {
            html += `<h1 style="text-align:center;font-size:1.4rem;font-weight:700;margin-bottom:24px;font-family:'DM Sans',sans-serif;">${escHtml(dissState.topic)}</h1>`;
        }
        
        for (let i = 1; i <= 5; i++) {
            const chapter = dissState.chapters[i];
            if (chapter.content) {
                html += `<h2 style="font-size:1.1rem;font-weight:700;margin:32px 0 14px;font-family:'DM Sans',sans-serif;border-bottom:2px solid #e4e4e7;padding-bottom:8px;">${escHtml(chapter.title)}</h2>${chapter.content}<br>`;
            }
        }
        
        if (dissState.references) {
            html += `<h2 style="font-size:1.1rem;font-weight:700;margin:32px 0 14px;font-family:'DM Sans',sans-serif;border-bottom:2px solid #e4e4e7;padding-bottom:8px;">References</h2>${dissState.references}`;
        }
        
        paperView.innerHTML = html || '<p style="color:#9898a8;text-align:center;margin-top:40px;">No content to preview yet. Start your dissertation to see a preview.</p>';
    } else {
        // Essay mode preview
        let html = state.topic ? `<h1>${escHtml(state.topic)}</h1>` : '';
        
        if (state.plan.length > 0) {
            state.plan.forEach((para, i) => {
                if (state.drafts[i]) {
                    html += state.drafts[i];
                }
            });
        }
        
        if (state.references) {
            html += `<h2>References</h2>${state.references}`;
        }
        
        paperView.innerHTML = html || '<p style="color: var(--text-3);">No content to preview yet.</p>';
    }
    
    modal.style.display = 'flex';
}

function closePreview() {
    document.getElementById('preview-modal').style.display = 'none';
}

/* =========================================================
   UI UTILITY FUNCTIONS
   ========================================================= */
function appendMsg(type, html) {
    const chatThread = document.getElementById('chat-thread');
    const msg = document.createElement('div');
    msg.className = `msg ${type}-msg`;
    
    const icon = type === 'ai' ? '<i class="fas fa-' + (currentMode === 'dissertation' ? 'book' : 'feather-alt') + '"></i>' : '<i class="fas fa-user"></i>';
    const label = type === 'ai' ? (currentMode === 'dissertation' ? 'Dissertation Writer' : 'Anonemasi Writer') : 'You';
    
    msg.innerHTML = `
        <div class="avatar-box">${icon}</div>
        <div class="msg-content">
            ${type === 'ai' ? `<p class="msg-label">${label}</p>` : ''}
            ${html}
        </div>
    `;
    
    chatThread.appendChild(msg);
    scrollToBottom();
}

function scrollToBottom() {
    const scroller = document.getElementById('chat-scroller');
    setTimeout(() => {
        scroller.scrollTo({
            top: scroller.scrollHeight,
            behavior: 'smooth'
        });
    }, 100);
}

function setStatus(text) {
    document.getElementById('status-label').textContent = text;
}

function setActiveStep(step) {
    document.querySelectorAll('.st-item').forEach((item, index) => {
        if (index + 1 === step) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function updateProgressBar(percent) {
    const bar = document.getElementById('progress-bar');
    const wrap = document.getElementById('progress-wrap');
    
    if (percent > 0) {
        wrap.style.display = 'block';
        bar.style.width = percent + '%';
    } else {
        wrap.style.display = 'none';
    }
}

function showNotification(message, type = 'info') {
    // Remove any existing toast
    const existing = document.getElementById('toast-notification');
    if (existing) existing.remove();
    
    const colors = {
        success: '#059669',
        error:   '#dc2626',
        info:    '#2563eb',
        warning: '#d97706'
    };
    
    const toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.style.cssText = `
        position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
        background: ${colors[type] || colors.info}; color: white;
        padding: 12px 24px; border-radius: 10px; font-size: 0.88rem;
        font-family: 'DM Sans', sans-serif; font-weight: 500;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2); z-index: 9999;
        opacity: 0; transition: opacity 0.25s ease;
        pointer-events: none; white-space: nowrap;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Fade in
    requestAnimationFrame(() => {
        requestAnimationFrame(() => { toast.style.opacity = '1'; });
    });
    
    // Fade out and remove
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, type === 'error' ? 4000 : 2500);
}

function showConfirmModal(title, message, onConfirm) {
    if (confirm(message)) {
        onConfirm();
    }
}

function escHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/* =========================================================
   ASSIGNMENT MODE FUNCTIONS (Placeholder - keep existing)
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
        reconstructUI();
    }
}

function reconstructUI() {
    // Clear the chat thread
    const chatThread = document.getElementById('chat-thread');
    chatThread.innerHTML = '';
    
    // Reconstruct analysis message if available
    if (state.topic) {
        appendMsg('ai', `
            <h3><i class="fas fa-check-circle"></i> Essay Analyzed</h3>
            <p><strong>Essay Topic:</strong> ${escHtml(state.topic)}</p>
            <p><strong>Type:</strong> ${state.essayType.charAt(0).toUpperCase() + state.essayType.slice(1)} Essay</p>
            <p><strong>Paragraphs:</strong> ${state.paras} (including intro & conclusion)</p>
        `);
    }
    
    // Reconstruct sources if available
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
    
    // Reconstruct plan if available
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
            <p>Detailed breakdown of all ${state.plan.length} paragraphs.</p>
            ${planHTML}
            ${renderPlanControls()}
            <div class="action-row" style="margin-top:16px;">
                <button class="btn-primary" onclick="startDraftingWithCitationsManager()">
                    <i class="fas fa-quote-right"></i> Review Citations & Start Drafting
                </button>
            </div>
        `);
        
        // Add click event listeners to plan cards
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
    
    // Reconstruct drafts if available
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
    
    // Reconstruct references if available
    if (state.references) {
        appendMsg('ai', `
            <h3 class="success-heading"><i class="fas fa-check-circle"></i> Essay Complete!</h3>
            <p>Your essay has been fully drafted with ${state.plan.length} paragraphs and proper APA citations.</p>
            <div class="references-block" style="margin-top:16px;padding:14px;background:var(--bg-2);border-radius:var(--radius);border:1px solid var(--border)">
                <h4 style="margin-bottom:10px;text-align:left;">References</h4>
                <div class="references-content">${state.references.split('\n').filter(l => l.trim()).map(l => `<p class="ref-line">${l}</p>`).join('')}</div>
            </div>
        `);
        document.getElementById('export-btn').disabled = false;
        document.getElementById('export-btn').classList.add('ready');
    }
    
    // Update UI state
    updateSavedAssignmentsList();
    scrollToBottom();
}

function deleteAssignment(id) {
    showConfirmModal(
        'Delete Essay',
        'Are you sure you want to delete this essay?',
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
    
    document.getElementById('chat-thread').innerHTML = '';
    initAssignmentMode();
}

function exportToWord() {
    if (currentMode === 'dissertation') {
        exportDissertation();
        return;
    }

    // Essay mode export
    if (!state.topic && Object.keys(state.drafts).length === 0) {
        showNotification('No essay content to export yet.', 'error');
        return;
    }

    const topic = state.topic || 'Essay';
    let bodyContent = '';

    if (state.plan && state.plan.length > 0) {
        state.plan.forEach((para, i) => {
            if (state.drafts[i]) {
                const isIntro = para.section === 'Introduction';
                const isConc  = para.section === 'Conclusion';
                if (state.useHeadings || isIntro || isConc) {
                    bodyContent += `<h3>${escHtml(para.heading)}</h3>`;
                }
                bodyContent += `<p>${escHtml(state.drafts[i])}</p>`;
            }
        });
    }

    // references is stored as HTML <p> tags
    if (state.references) {
        bodyContent += buildWordSection('References', state.references);
    }

    const doc = buildWordDoc(topic, bodyContent || '<p>No content yet.</p>');
    const safeTitle = topic.substring(0, 40).replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '_');
    triggerDownload(doc, `${safeTitle}.doc`);
}

function initDropZone() {
    // Set up the file input handler
    const fileInput = document.getElementById('file-input');
    if (fileInput && !fileInput._bound) {
        fileInput._bound = true;
        fileInput.addEventListener('change', e => {
            const file = e.target.files[0];
            if (file) handleFileUpload(file);
            fileInput.value = '';
        });
    }

    // Set up drag-and-drop on the drop zone
    setTimeout(() => {
        const dz = document.getElementById('drop-zone');
        if (!dz || dz._bound) return;
        dz._bound = true;
        dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('drag-over'); });
        dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'));
        dz.addEventListener('drop', e => {
            e.preventDefault();
            dz.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file) handleFileUpload(file);
        });
        dz.addEventListener('click', () => document.getElementById('file-input').click());
    }, 200);
}

/* ----- File input trigger (context-aware) ----- */
function triggerFileInput() {
    document.getElementById('file-input').click();
}

/* ----- Update attach button appearance based on mode ----- */
function updateAttachButton() {
    const btn = document.getElementById('attach-btn');
    const icon = document.getElementById('attach-icon');
    if (!btn) return;

    if (revisionState.active) {
        btn.title = 'Upload commented Word doc (.docx)';
        btn.classList.add('revision-mode');
        if (icon) { icon.className = 'fas fa-file-word'; }
    } else {
        btn.title = 'Upload file (PDF or DOCX)';
        btn.classList.remove('revision-mode');
        if (icon) { icon.className = 'fas fa-paperclip'; }
    }
}

async function handleFileUpload(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    setStatus('Reading file...');

    // In revision mode, route docx uploads through the comments extractor
    if (revisionState.active && (ext === 'docx' || ext === 'doc')) {
        await handleCommentedDocUpload(file);
        return;
    }

    try {
        let text = '';
        if (ext === 'pdf') {
            text = await extractPdfText(file);
        } else if (ext === 'docx' || ext === 'doc') {
            text = await extractDocxText(file);
        } else {
            showNotification('Unsupported file type. Please upload a PDF or DOCX.', 'error');
            return;
        }
        if (text.trim().length < 20) {
            showNotification('Could not extract text from file. Try pasting your requirements instead.', 'error');
            return;
        }
        document.getElementById('main-input').value = text.trim();
        autoGrow(document.getElementById('main-input'));
        showNotification('File loaded! Press send to start.', 'success');
        setStatus('Ready');
    } catch (err) {
        console.error('File read error:', err);
        showNotification('Error reading file. Try pasting requirements instead.', 'error');
        setStatus('Ready');
    }
}

/* =========================================================
   DOCX COMMENT EXTRACTION via JSZip
   Reads word/comments.xml and word/document.xml directly,
   bypassing Mammoth.js which strips comment markup entirely.
   Uses regex on raw XML strings for anchor extraction —
   more reliable than DOM sibling-walking across browsers.
   ========================================================= */
async function extractDocxComments(file) {
    const arrayBuffer = await file.arrayBuffer();

    let zip;
    try {
        zip = await JSZip.loadAsync(arrayBuffer);
    } catch (e) {
        console.error('JSZip failed to parse file:', e);
        return { comments: [], bodyText: '', error: 'not_a_zip' };
    }

    // ── 1. Read raw XML strings ───────────────────────────────
    const commentsXmlFile = zip.file('word/comments.xml');
    if (!commentsXmlFile) {
        // No comments.xml = no tracked changes / comments in this doc
        return { comments: [], bodyText: '', error: 'no_comments_xml' };
    }

    const commentsXml  = await commentsXmlFile.async('string');
    const docXmlFile   = zip.file('word/document.xml');
    const documentXml  = docXmlFile ? await docXmlFile.async('string') : '';

    // ── 2. Parse comments.xml via DOM ────────────────────────
    const WNS    = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
    const parser = new DOMParser();
    const commentsDoc = parser.parseFromString(commentsXml, 'application/xml');

    // getElementsByTagNameNS with '*' wildcard works even when parser drops prefix
    const commentEls = [
        ...commentsDoc.getElementsByTagNameNS(WNS, 'comment'),
        ...commentsDoc.getElementsByTagNameNS('*', 'comment')
    ].filter((el, i, arr) => arr.indexOf(el) === i); // deduplicate

    const commentMap = {}; // id → { author, date, text }

    commentEls.forEach(c => {
        // Try both namespaced and prefixed attribute reads for max compatibility
        const id     = c.getAttributeNS(WNS, 'id')     || c.getAttribute('w:id')     || '';
        const author = c.getAttributeNS(WNS, 'author') || c.getAttribute('w:author') || 'Reviewer';
        const date   = c.getAttributeNS(WNS, 'date')   || c.getAttribute('w:date')   || '';

        // Collect all <w:t> runs inside this comment element
        const tEls = [
            ...c.getElementsByTagNameNS(WNS, 't'),
            ...c.getElementsByTagNameNS('*', 't')
        ].filter((el, i, arr) => arr.indexOf(el) === i);

        const text = tEls.map(t => t.textContent).join('').trim();
        if (text && id !== '') {
            commentMap[id] = { author, date: date.substring(0, 10), text };
        }
    });

    // ── 3. Extract anchor text via regex on document.xml ─────
    //    Much more reliable than DOM sibling-walking because
    //    commentRangeStart/End can span paragraph boundaries.
    const anchors = {};

    if (documentXml) {
        for (const id of Object.keys(commentMap)) {
            // Match commentRangeStart with this id (attribute order may vary)
            const startRe = new RegExp(
                `<w:commentRangeStart\\b[^>]*\\bw:id=["']${id}["'][^>]*/?>`,
                'i'
            );
            const endRe = new RegExp(
                `<w:commentRangeEnd\\b[^>]*\\bw:id=["']${id}["'][^>]*/?>`,
                'i'
            );

            const startMatch = startRe.exec(documentXml);
            const endMatch   = endRe.exec(documentXml);

            if (startMatch && endMatch && startMatch.index < endMatch.index) {
                const segment = documentXml.substring(
                    startMatch.index + startMatch[0].length,
                    endMatch.index
                );
                // Pull out all <w:t ...>text</w:t> content from the segment
                const tMatches = [...segment.matchAll(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/gi)];
                const anchorText = tMatches.map(m => m[1]).join('').trim();
                if (anchorText) anchors[id] = anchorText;
            }
        }
    }

    // ── 4. Assemble final list ────────────────────────────────
    const comments = Object.entries(commentMap).map(([id, c], idx) => ({
        index: idx + 1,
        id,
        author: c.author,
        date: c.date,
        text: c.text,
        anchor: anchors[id] || null
    }));

    // ── 5. Also get plain body text via Mammoth (non-critical) ─
    let bodyText = '';
    try {
        const mammothResult = await mammoth.extractRawText({ arrayBuffer });
        bodyText = mammothResult.value || '';
    } catch (e) { /* non-critical */ }

    return { comments, bodyText };
}

/* ----- Handle a commented doc upload in revision mode ----- */


/* Utility: replace the content of the most recent AI message */
function replaceLastMsgContent(html) {
    const msgs = document.querySelectorAll('.msg.ai-msg');
    if (msgs.length > 0) {
        msgs[msgs.length - 1].querySelector('.msg-content').innerHTML = html;
    }
}

/* ── revision fix store ── */
let revisionFixes = [];

/* ── revision state ── */
let revisionState = {
    active: false,
    chapterNum: null,
    awaitingConfirm: false,
    pendingPlan: null,
    pendingComments: null,
    extractedComments: null
};

/* ── chapter instruction state ──
   When awaitingChapterNum is set, the next send() captures the user's
   instructions before writing that chapter.
*/
let awaitingChapterInstructions = null; // null | chapterNum (1-5)

/* =========================================================
   COMMENT EXTRACTION PREVIEW RENDERER
   ========================================================= */
function renderCommentsPreview(comments, fileName, chapterTitle) {
    const cardsHtml = comments.map(c => `
        <div class="comment-card">
            <div class="comment-card-header">
                <div class="comment-badge">${c.index}</div>
                <div class="comment-card-meta">
                    <div class="comment-card-author"><i class="fas fa-user-circle"></i> ${escHtml(c.author)}</div>
                    ${c.date ? `<div class="comment-card-date">${escHtml(c.date)}</div>` : ''}
                </div>
            </div>
            <div class="comment-card-body">
                <div class="comment-card-text">${escHtml(c.text)}</div>
                ${c.anchor ? `
                    <div class="comment-anchor-section">
                        <div class="comment-anchor-label"><i class="fas fa-highlighter"></i> Highlighted passage in document</div>
                        <div class="comment-anchor-text">"${escHtml(c.anchor.substring(0, 260))}${c.anchor.length > 260 ? '\u2026' : ''}"</div>
                    </div>
                ` : `<div class="comment-no-anchor"><i class="fas fa-info-circle"></i> No specific text highlighted for this comment</div>`}
            </div>
        </div>
    `).join('');

    return `
        <div class="comments-extraction-header">
            <div class="extraction-icon"><i class="fas fa-file-word"></i></div>
            <div class="extraction-meta">
                <h4>Supervisor Comments Extracted</h4>
                <span>From: <strong>${escHtml(fileName)}</strong> &nbsp;\u00b7&nbsp; Chapter: <strong>${escHtml(chapterTitle)}</strong></span>
            </div>
            <div class="comments-count-badge">${comments.length} Comment${comments.length !== 1 ? 's' : ''}</div>
        </div>
        <p style="font-size:0.85rem;color:var(--text-2);margin-bottom:12px;">
            Review that these match your supervisor\'s feedback — each comment and its highlighted passage is shown below.
        </p>
        <div class="comments-list">${cardsHtml}</div>
        <div class="action-row" style="margin-top:14px;">
            <button class="btn-outline" onclick="cancelRevisionMode()" style="border-color:var(--error);color:var(--error);">
                <i class="fas fa-times"></i> Cancel
            </button>
            <button class="btn-primary" onclick="proceedWithExtractedComments()">
                <i class="fas fa-arrow-right"></i> Looks correct — Generate Revision Plan
            </button>
        </div>
    `;
}

/* =========================================================
   FIX CARD RENDERER
   ========================================================= */
function renderFixCard(fix, idx) {
    const statusBadgeClass = fix.status === 'accepted' ? 'accepted' : fix.status === 'skipped' ? 'skipped' : 'pending';
    const statusLabel = fix.status === 'accepted' ? 'Accepted' : fix.status === 'skipped' ? 'Skipped' : 'Review';
    const cardClass = fix.status === 'accepted' ? 'accepted' : fix.status === 'skipped' ? 'skipped' : '';
    const safeProposed = escHtml(fix.proposed || '');
    const safeOriginal = fix.original ? escHtml(fix.original.substring(0, 400)) + (fix.original.length > 400 ? '\u2026' : '') : null;

    return `
        <div class="fix-card ${cardClass}" id="fix-card-${idx}">
            <div class="fix-card-header">
                <div class="fix-number">${idx + 1}</div>
                <div class="fix-header-content">
                    <div class="fix-comment-summary">${escHtml(fix.commentSummary || '')}</div>
                    <div class="fix-location"><i class="fas fa-map-pin"></i> ${escHtml(fix.location || '')}</div>
                </div>
                <span class="fix-status-badge ${statusBadgeClass}">${statusLabel}</span>
            </div>
            <div class="fix-card-body">
                <div class="fix-issue-box">
                    <div class="fix-section-label"><i class="fas fa-exclamation-circle"></i> What the supervisor flagged</div>
                    <div class="fix-issue-text">${escHtml(fix.issue || '')}</div>
                </div>
                <div class="fix-diff-area">
                    <div class="fix-section-label"><i class="fas fa-exchange-alt"></i> Proposed change</div>
                    <div class="diff-block">
                        ${safeOriginal ? `<div class="diff-before"><div class="diff-label">\u2715 Original</div>${safeOriginal}</div>` : ''}
                        <div class="diff-after">
                            <div class="diff-label">\u2713 Proposed replacement</div>
                            <span id="fix-proposed-display-${idx}">${safeProposed}</span>
                        </div>
                    </div>
                </div>
                <div class="fix-edit-label" id="fix-edit-label-${idx}" style="display:none;"><i class="fas fa-pencil-alt"></i> Edit the proposed replacement below:</div>
                <textarea class="fix-edit-area" id="fix-edit-area-${idx}"
                    oninput="onFixEditChange(${idx}, this.value)"
                    placeholder="Edit the proposed replacement text\u2026">${safeProposed}</textarea>
            </div>
            <div class="fix-card-actions" id="fix-actions-${idx}">
                <button class="fix-btn fix-btn-edit" onclick="toggleFixEdit(${idx})" id="fix-edit-btn-${idx}">
                    <i class="fas fa-pencil-alt"></i> Edit
                </button>
                <button class="fix-btn fix-btn-regen" onclick="regenerateSingleFix(${idx})" id="fix-regen-btn-${idx}">
                    <i class="fas fa-sync-alt"></i> Re-generate
                </button>
                <div class="fix-regen-loading" id="fix-regen-loading-${idx}" style="display:none;">
                    <div class="fix-regen-spinner"></div> Regenerating\u2026
                </div>
                <div style="flex:1"></div>
                ${fix.status === 'accepted' ? `
                    <button class="fix-btn fix-btn-skip" onclick="setFixStatus(${idx}, \'pending\')">
                        <i class="fas fa-undo"></i> Undo Accept
                    </button>
                ` : fix.status === 'skipped' ? `
                    <button class="fix-btn fix-btn-unskip" onclick="setFixStatus(${idx}, \'pending\')">
                        <i class="fas fa-undo"></i> Restore
                    </button>
                ` : `
                    <button class="fix-btn fix-btn-skip" onclick="setFixStatus(${idx}, \'skipped\')">
                        <i class="fas fa-ban"></i> Skip
                    </button>
                    <button class="fix-btn fix-btn-accept" onclick="setFixStatus(${idx}, \'accepted\')">
                        <i class="fas fa-check"></i> Accept Fix
                    </button>
                `}
            </div>
        </div>
    `;
}

function renderAllFixCards() {
    const chapterNum = revisionState.chapterNum;
    const chapter = dissState.chapters[chapterNum];
    const accepted = revisionFixes.filter(f => f.status === 'accepted').length;
    const total = revisionFixes.length;
    const cardsHtml = revisionFixes.map((fix, idx) => renderFixCard(fix, idx)).join('');
    return `
        <div class="revision-plan-header">
            <div class="plan-icon"><i class="fas fa-clipboard-list"></i></div>
            <div class="plan-meta">
                <h4>Revision Plan \u2014 ${escHtml(chapter.title)}</h4>
                <p>${total} fix${total !== 1 ? 'es' : ''} proposed \u00b7 Review, edit or re-generate each, then accept before applying</p>
            </div>
        </div>
        <div class="fix-cards-list" id="fix-cards-container">${cardsHtml}</div>
        <div class="apply-fixes-bar" id="apply-fixes-bar">
            <div class="apply-info">
                <strong id="accepted-count">${accepted}</strong> of <strong>${total}</strong> fixes accepted
                \u2014 skipped fixes leave those parts unchanged.
            </div>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
                <button class="btn-cancel-plan" onclick="cancelRevisionMode()"><i class="fas fa-times"></i> Cancel</button>
                <button class="btn-primary btn-apply-fixes" id="apply-fixes-btn" onclick="applyAcceptedFixes()" ${accepted === 0 ? 'disabled' : ''}>
                    <i class="fas fa-pen-fancy"></i> Apply ${accepted} Accepted Fix${accepted !== 1 ? 'es' : ''} to Chapter
                </button>
            </div>
        </div>
    `;
}

function refreshFixCard(idx) {
    const card = document.getElementById('fix-card-' + idx);
    if (!card) return;
    const tmp = document.createElement('div');
    tmp.innerHTML = renderFixCard(revisionFixes[idx], idx);
    card.replaceWith(tmp.firstElementChild);
}

function refreshApplyBar() {
    const accepted = revisionFixes.filter(f => f.status === 'accepted').length;
    const countEl = document.getElementById('accepted-count');
    const btn = document.getElementById('apply-fixes-btn');
    if (countEl) countEl.textContent = accepted;
    if (btn) {
        btn.disabled = accepted === 0;
        btn.innerHTML = '<i class="fas fa-pen-fancy"></i> Apply ' + accepted + ' Accepted Fix' + (accepted !== 1 ? 'es' : '') + ' to Chapter';
    }
}

function setFixStatus(idx, status) {
    revisionFixes[idx].status = status;
    refreshFixCard(idx);
    refreshApplyBar();
}

function toggleFixEdit(idx) {
    const area = document.getElementById('fix-edit-area-' + idx);
    const label = document.getElementById('fix-edit-label-' + idx);
    const btn = document.getElementById('fix-edit-btn-' + idx);
    if (!area) return;
    const showing = area.style.display === 'block';
    area.style.display = showing ? 'none' : 'block';
    if (label) label.style.display = showing ? 'none' : 'flex';
    if (btn) btn.innerHTML = showing ? '<i class="fas fa-pencil-alt"></i> Edit' : '<i class="fas fa-eye"></i> Hide editor';
    if (!showing) { area.style.height = 'auto'; area.style.height = area.scrollHeight + 'px'; area.focus(); }
}

function onFixEditChange(idx, value) {
    revisionFixes[idx].proposed = value;
    const display = document.getElementById('fix-proposed-display-' + idx);
    if (display) display.textContent = value;
}

async function regenerateSingleFix(idx) {
    const fix = revisionFixes[idx];
    const chapter = dissState.chapters[revisionState.chapterNum];
    const regenBtn = document.getElementById('fix-regen-btn-' + idx);
    const editBtn  = document.getElementById('fix-edit-btn-'  + idx);
    const loading  = document.getElementById('fix-regen-loading-' + idx);
    const card     = document.getElementById('fix-card-' + idx);
    if (regenBtn) regenBtn.style.display = 'none';
    if (editBtn)  editBtn.style.display  = 'none';
    if (loading)  loading.style.display  = 'flex';
    if (card)     card.classList.add('regenerating');
    try {
        const prompt = `You are a dissertation revision assistant improving one specific fix.

CHAPTER: ${chapter.title}
DISSERTATION TOPIC: ${dissState.topic}
SUPERVISOR COMMENT: "${fix.commentSummary}"
ISSUE: ${fix.issue}
LOCATION: ${fix.location}
${fix.original ? 'ORIGINAL TEXT: "' + fix.original + '"' : ''}
PREVIOUS PROPOSED FIX (student is not satisfied): "${fix.proposed}"

Write a better replacement that:
1. Directly and fully addresses the supervisor comment
2. Is formal, academic, and clear
3. Keeps approximately the same length as the original
4. Uses proper APA in-text citations where applicable
5. MALAWI GOVERNMENT CITATION RULE: cite any Malawi government source as (Government of Malawi, Year)

Return ONLY the replacement text — no preamble, no explanation, no markdown.`;
        const response = await callGeminiAPI(prompt);
        revisionFixes[idx].proposed = response.replace(/```/g, '').trim();
        revisionFixes[idx].status = 'pending';
        refreshFixCard(idx);
        refreshApplyBar();
        showNotification('Fix ' + (idx + 1) + ' regenerated — review and accept if satisfied.', 'success');
    } catch (err) {
        console.error('Regen error:', err);
        showNotification('Failed to regenerate fix ' + (idx + 1) + '.', 'error');
        if (card) card.classList.remove('regenerating');
        if (regenBtn) regenBtn.style.display = '';
        if (editBtn)  editBtn.style.display  = '';
        if (loading)  loading.style.display  = 'none';
    }
}

async function applyAcceptedFixes() {
    const accepted = revisionFixes.filter(f => f.status === 'accepted');
    if (accepted.length === 0) { showNotification('Please accept at least one fix before applying.', 'error'); return; }
    const chapterNum = revisionState.chapterNum;
    const chapter = dissState.chapters[chapterNum];
    const fixInstructions = accepted.map((fix, i) => `FIX ${i+1}:
  Location: ${fix.location}
  Issue: ${fix.issue}
  ${fix.original ? 'Original text: "' + fix.original + '"' : 'No specific original (general improvement)'}
  Replacement text: "${fix.proposed}"`).join('\n\n');

    appendMsg('ai', `
        <h3><i class="fas fa-pen-fancy"></i> Applying ${accepted.length} Fix${accepted.length !== 1 ? 'es' : ''} to ${escHtml(chapter.title)}\u2026</h3>
        <p>Inserting the accepted changes precisely. Everything else stays exactly as it was\u2026</p>
        <div class="loading-indicator"><div class="loading-spinner"></div><span>Rewriting chapter\u2026</span></div>
    `);
    document.getElementById('send-btn').disabled = true;
    setStatus('Applying fixes\u2026');
    updateProgressBar(40);

    try {
        const prompt = `You are a dissertation editor applying a precise set of fixes to a chapter.

DISSERTATION TOPIC: ${dissState.topic}
CHAPTER: ${chapter.title}

ACCEPTED FIXES TO APPLY:
${fixInstructions}

ORIGINAL CHAPTER CONTENT:
"""
${chapter.content}
"""

ABSOLUTE RULES:
1. Apply EVERY fix above — find the location described, find the original text, replace it with the exact replacement text provided.
2. DO NOT change anything not covered by a fix. Every other sentence, heading, citation, and paragraph must remain character-for-character identical to the original.
3. Use the replacement text EXACTLY as given — do not paraphrase or improve it further.
4. Maintain the same HTML structure: <p>, <h4>, <ol>, <li> as in the original.
5. Output the complete chapter from start to finish — do not truncate.
6. MALAWI GOVERNMENT CITATION RULE: keep all (Government of Malawi, Year) citations.

Output: Full revised chapter as HTML only. No markdown. No commentary.`;

        const response = await callGeminiAPI(prompt);
        const cleanContent = response.replace(/\`\`\`html/g, '').replace(/\`\`\`/g, '').trim();
        chapter.content = cleanContent;
        saveDissertation();
        updateProgressBar(100);

        replaceLastMsgContent(`
            <h3><i class="fas fa-check-circle"></i> ${escHtml(chapter.title)} \u2014 Updated</h3>
            <p style="font-size:0.88rem;color:#065f46;font-weight:600;margin-bottom:12px;">
                <i class="fas fa-check-circle"></i> ${accepted.length} fix${accepted.length !== 1 ? 'es' : ''} applied \u00b7 ${revisionFixes.length - accepted.length} section${revisionFixes.length - accepted.length !== 1 ? 's' : ''} left exactly as written.
            </p>
            <div class="chapter-content">
                <div class="chapter-title-display">${escHtml(chapter.title)}</div>
                <div class="chapter-text">${cleanContent}</div>
            </div>
            <div class="action-row" style="margin-top:16px;">
                <button class="btn-outline" onclick="startChapterRevision(${chapterNum})">
                    <i class="fas fa-comment-dots"></i> Revise with More Feedback
                </button>
                <button class="btn-outline" onclick="downloadChapter(${chapterNum})">
                    <i class="fas fa-download"></i> Download Chapter
                </button>
            </div>
        `);

        revisionFixes = [];
        cancelRevisionMode();
        document.getElementById('send-btn').disabled = false;
        updateProgressBar(0);
        setStatus('Complete');
        scrollToBottom();

    } catch (err) {
        console.error('Apply fixes error:', err);
        replaceLastMsgContent(`
            <h3><i class="fas fa-exclamation-triangle"></i> Apply Failed</h3>
            <p>The chapter was not changed \u2014 your original is still safe.</p>
            <button class="btn-primary" onclick="applyAcceptedFixes()"><i class="fas fa-redo"></i> Try Again</button>
        `);
        document.getElementById('send-btn').disabled = false;
        updateProgressBar(0);
        setStatus('Error');
    }
}

async function planRevisionFromComments(formattedComments) {
    const chapterNum = revisionState.chapterNum;
    const chapter = dissState.chapters[chapterNum];
    document.getElementById('send-btn').disabled = true;

    appendMsg('ai', `
        <h3><i class="fas fa-search"></i> Reading Supervisor Feedback\u2026</h3>
        <p>Understanding what needs to change in <strong>${escHtml(chapter.title)}</strong>\u2026</p>
        <div class="loading-indicator"><div class="loading-spinner"></div><span>Building revision plan\u2026</span></div>
    `);
    setStatus('Planning revisions\u2026');

    try {
        const planPrompt = `You are an expert academic dissertation editor planning precise fixes from supervisor feedback.

CHAPTER TITLE: ${chapter.title}
DISSERTATION TOPIC: ${dissState.topic}

SUPERVISOR FEEDBACK:
"""
${formattedComments}
"""

CHAPTER CONTENT (plain text for reference):
"""
${chapter.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 4000)}
"""

For each distinct issue in the supervisor feedback, create one fix object.
Read the chapter carefully and find exactly where each issue applies.

Return ONLY a valid JSON array — no preamble, no explanation, no markdown backticks.

Each object must have EXACTLY these fields:
{
  "commentSummary": "Short label for this comment (max 60 chars)",
  "location": "Specific location e.g. 'Section 1.1 Background paragraph 3' or 'Problem Statement paragraph 1'",
  "issue": "What exactly the supervisor found wrong or wants improved — be specific",
  "original": "The exact sentence(s) or passage from the chapter that need to change (copy directly). Empty string if it is an addition.",
  "proposed": "The complete replacement text — well-written, academic, formal, APA citations where needed. This is inserted directly into the document."
}

Rules for proposed text:
- Must be a COMPLETE replacement the student can paste directly
- Match the academic register of the rest of the chapter
- Approximately same length as original unless supervisor asked for expansion
- MALAWI GOVERNMENT CITATION RULE: cite any Malawi government source as (Government of Malawi, Year)
- If comment says improve citations, add 2-3 appropriate APA citations

Return ONLY the JSON array. No backtick fences.`;

        const response = await callGeminiAPI(planPrompt);
        let jsonStr = response.replace(/\`\`\`json/gi, '').replace(/\`\`\`/g, '').trim();
        const arrStart = jsonStr.indexOf('[');
        if (arrStart > 0) jsonStr = jsonStr.substring(arrStart);
        const fixes = JSON.parse(jsonStr);
        if (!Array.isArray(fixes) || fixes.length === 0) throw new Error('No fixes returned');

        revisionFixes = fixes.map(f => ({ ...f, status: 'pending' }));
        revisionState.awaitingConfirm = true;

        replaceLastMsgContent(renderAllFixCards());
        document.getElementById('send-btn').disabled = false;
        setStatus('Review fixes\u2026');
        scrollToBottom();

    } catch (err) {
        console.error('Plan error:', err);
        replaceLastMsgContent(`
            <h3><i class="fas fa-exclamation-triangle"></i> Planning Failed</h3>
            <p>Could not generate a structured plan. Error: <code style="font-size:0.8rem;">${escHtml(err.message || String(err))}</code></p>
            <button class="btn-primary" onclick="planRevisionFromComments(revisionState.pendingComments)"><i class="fas fa-redo"></i> Try Again</button>
        `);
        revisionState.awaitingConfirm = false;
        document.getElementById('send-btn').disabled = false;
        setStatus('Error');
    }
}

async function handleCommentedDocUpload(file) {
    const chapterNum = revisionState.chapterNum;
    const chapter = dissState.chapters[chapterNum];
    showNotification('Reading "' + file.name + '"\u2026', 'info');
    appendMsg('ai', `
        <h3><i class="fas fa-file-word"></i> Extracting Comments\u2026</h3>
        <p>Opening <strong>${escHtml(file.name)}</strong> and reading supervisor annotations\u2026</p>
        <div class="loading-indicator"><div class="loading-spinner"></div><span>Parsing word/comments.xml\u2026</span></div>
    `);
    setStatus('Extracting comments\u2026');
    scrollToBottom();
    try {
        const { comments, bodyText, error } = await extractDocxComments(file);
        if (error === 'not_a_zip') {
            replaceLastMsgContent('<h3><i class="fas fa-exclamation-triangle"></i> Unreadable File</h3><p>Please re-save as a proper .docx: <em>File \u2192 Save As \u2192 Word Document (.docx)</em>.</p>');
            setStatus('Ready'); return;
        }
        if (error === 'no_comments_xml' || comments.length === 0) {
            if (bodyText.trim().length > 30) {
                replaceLastMsgContent('<h3><i class="fas fa-info-circle"></i> No Tracked Comments Found</h3><p>No Review \u2192 New Comment annotations found. The document text has been pasted below — edit and press Send.</p><p style="font-size:0.82rem;color:var(--text-2);margin-top:6px;"><strong>Tip:</strong> Ask your supervisor to use <em>Review \u2192 New Comment</em> for precise annotations next time.</p>');
                document.getElementById('main-input').value = bodyText.trim().substring(0, 3000);
                autoGrow(document.getElementById('main-input'));
            } else {
                replaceLastMsgContent('<h3><i class="fas fa-exclamation-circle"></i> No Comments Found</h3><p>No tracked comments or readable text in <strong>' + escHtml(file.name) + '</strong>. Paste feedback manually below.</p>');
            }
            setStatus('Ready'); return;
        }
        revisionState.extractedComments = comments;
        replaceLastMsgContent(renderCommentsPreview(comments, file.name, chapter.title));
        showNotification(comments.length + ' comment' + (comments.length !== 1 ? 's' : '') + ' found!', 'success');
        setStatus('Ready');
        scrollToBottom();
    } catch (err) {
        console.error('Comment extraction error:', err);
        replaceLastMsgContent('<h3><i class="fas fa-exclamation-triangle"></i> Extraction Failed</h3><p>Error: <code style="font-size:0.8rem;">' + escHtml(err.message || String(err)) + '</code><br>Please paste feedback manually below.</p>');
        setStatus('Ready');
    }
}

async function proceedWithExtractedComments() {
    const comments = revisionState.extractedComments;
    if (!comments || !comments.length) return;
    const formattedComments = comments.map(c =>
        'Comment ' + c.index + ' (by ' + c.author + (c.date ? ', ' + c.date : '') + '):\n' +
        'Supervisor wrote: "' + c.text + '"\n' +
        (c.anchor ? 'Highlighted passage: "' + c.anchor + '"' : '(No specific text highlighted)')
    ).join('\n\n---\n\n');
    revisionState.pendingComments = formattedComments;
    revisionState.awaitingConfirm = false;
    appendMsg('user', '<p><strong>' + comments.length + ' supervisor comment' + (comments.length !== 1 ? 's' : '') + ' confirmed.</strong> Generating revision plan\u2026</p>');
    await planRevisionFromComments(formattedComments);
}

async function handleRevisionComments() {
    const input = document.getElementById('main-input');
    const comments = input.value.trim();
    if (!comments) { showNotification("Please enter the supervisor\'s comments first.", 'error'); return; }
    revisionState.pendingComments = comments;
    appendMsg('user', '<p>' + escHtml(comments) + '</p>');
    input.value = ''; autoGrow(input);
    await planRevisionFromComments(comments);
}

async function confirmAndRewriteChapter() {
    revisionFixes.forEach(f => { if (f.status === 'pending') f.status = 'accepted'; });
    await applyAcceptedFixes();
}

/* =========================================================
   ESSAY GENERATION PIPELINE
   ========================================================= */
async function startGeneration() {
    if (currentMode !== 'assignment') return;

    const input = document.getElementById('main-input');
    const requirements = input.value.trim();

    if (!requirements) {
        showNotification('Please paste your assignment requirements or upload a file.', 'error');
        return;
    }

    // Disable send button during generation
    const sendBtn = document.getElementById('send-btn');
    sendBtn.disabled = true;

    // Show the user's message
    appendMsg('user', `<p>${escHtml(requirements)}</p>`);
    input.value = '';
    autoGrow(input);

    state.requirements = requirements;

    try {
        // ── STEP 1: Analyze ──────────────────────────────────
        setActiveStep(1);
        setStatus('Analyzing…');
        updateProgressBar(10);

        appendMsg('ai', `
            <h3><i class="fas fa-search"></i> Analyzing Your Assignment</h3>
            <p>Reading your requirements and identifying the essay structure…</p>
            <div class="loading-indicator"><div class="loading-spinner"></div><span>Analyzing…</span></div>
        `);

        const analyzePrompt = `You are an expert academic essay planner. Analyze the following assignment brief and extract the key information needed to write the essay.

Assignment Brief:
"""
${requirements}
"""

Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
  "topic": "The precise essay topic or title",
  "essayType": "argumentative|analytical|descriptive|comparative|reflective",
  "wordLimit": <number or 0 if not specified>,
  "paras": <recommended number of body paragraphs, between 4 and 8>,
  "refs": <minimum number of references needed, between 6 and 12>,
  "keyThemes": ["theme1", "theme2", "theme3"],
  "specificQuestions": ["any specific questions that must be answered"],
  "englishStyle": "simple|academic",
  "useHeadings": <true if headings are required, else false>
}`;

        const analyzeRaw = await callGeminiAPI(analyzePrompt);
        const analysis = JSON.parse(analyzeRaw.replace(/```json/g, '').replace(/```/g, '').trim());

        state.topic        = analysis.topic        || requirements.substring(0, 80);
        state.essayType    = analysis.essayType    || 'analytical';
        state.paras        = Math.min(Math.max(analysis.paras || 6, 4), 9);
        state.refs         = Math.min(Math.max(analysis.refs  || 8, 6), 14);
        state.keyThemes    = analysis.keyThemes    || [];
        state.specificQs   = analysis.specificQuestions || [];
        state.englishStyle = analysis.englishStyle || 'academic';
        state.useHeadings  = analysis.useHeadings  || false;

        updateProgressBar(25);

        // Replace loading message with analysis summary
        replaceLastMsg(`
            <h3><i class="fas fa-check-circle"></i> Assignment Analyzed</h3>
            <p><strong>Topic:</strong> ${escHtml(state.topic)}</p>
            <p><strong>Type:</strong> ${state.essayType.charAt(0).toUpperCase() + state.essayType.slice(1)} Essay &nbsp;|&nbsp; <strong>Body Paragraphs:</strong> ${state.paras} &nbsp;|&nbsp; <strong>References:</strong> ${state.refs}+</p>
            ${state.keyThemes.length ? `<p><strong>Key Themes:</strong> ${state.keyThemes.map(t => `<span class="theme-tag">${escHtml(t)}</span>`).join(' ')}</p>` : ''}
        `);

        saveAssignment();

        // ── STEP 2: Find Academic Sources ─────────────────────
        setActiveStep(2);
        setStatus('Finding sources…');
        updateProgressBar(30);

        appendMsg('ai', `
            <h3><i class="fas fa-graduation-cap"></i> Finding Academic Sources</h3>
            <p>Locating ${state.refs} peer-reviewed sources relevant to your topic…</p>
            <div class="loading-indicator"><div class="loading-spinner"></div><span>Searching academic databases…</span></div>
        `);

        const sourcesPrompt = `You are a research librarian. Find exactly ${state.refs} high-quality academic sources for this essay topic:

Topic: "${state.topic}"
Key themes: ${state.keyThemes.join(', ')}

CRITICAL RULES FOR VALID REFERENCES:
1. Every source MUST be a REAL, VERIFIABLE academic work that actually exists.
2. Use only well-known journals (e.g., Journal of Business Research, Lancet, American Economic Review, Nature, PLOS ONE, etc.)
3. Authors must be real scholars — use plausible names with correct format (Surname, Initials).
4. Years: between 2015 and 2024 (mostly recent, 1–2 older seminal works allowed).
5. Titles must be specific and realistic — no generic or vague titles.
6. DOI or URL: provide a real-looking DOI (format: 10.XXXX/xxxxx) or a Google Scholar URL.
7. Mix source types: journal articles (majority), 1–2 books, optionally 1 report.

Return ONLY a valid JSON array (no markdown) of exactly ${state.refs} objects:
[
  {
    "author": "Smith, J. A., & Brown, K. L.",
    "year": "2021",
    "title": "Specific realistic title of the work",
    "journal": "Full Journal Name",
    "volume": "12",
    "issue": "3",
    "pages": "45-67",
    "doi": "10.1016/j.example.2021.01.001",
    "relevance": "One sentence on why this source is relevant to the essay topic"
  }
]`;

        const sourcesRaw = await callGeminiAPI(sourcesPrompt);
        const sources = JSON.parse(sourcesRaw.replace(/```json/g, '').replace(/```/g, '').trim());
        state.sources = sources;
        saveAssignment();

        updateProgressBar(50);

        // Build sources HTML
        let sourcesHTML = '<div class="sources-grid">';
        sources.forEach((s, i) => {
            const doi   = s.doi   ? `https://doi.org/${s.doi}` : null;
            const gschol = `https://scholar.google.com/scholar?q=${encodeURIComponent((s.author || '') + ' ' + (s.title || ''))}`;
            const url   = doi || gschol;
            sourcesHTML += `
                <a href="${escHtml(url)}" target="_blank" class="source-card clickable-source" title="Verify this source">
                    <div class="source-num">${i + 1}</div>
                    <div class="source-details">
                        <p class="source-author">${escHtml(s.author)} (${escHtml(s.year)})</p>
                        <p class="source-title">${escHtml(s.title)}</p>
                        <p class="source-journal">${escHtml(s.journal)}${s.volume ? ', ' + s.volume : ''}${s.issue ? '(' + s.issue + ')' : ''}${s.pages ? ', pp. ' + s.pages : ''}</p>
                        ${s.relevance ? `<p class="source-relevance"><i class="fas fa-info-circle"></i> ${escHtml(s.relevance)}</p>` : ''}
                        <p class="source-link"><i class="fas fa-external-link-alt"></i> Click to verify</p>
                    </div>
                </a>`;
        });
        sourcesHTML += '</div>';

        replaceLastMsg(`
            <h3><i class="fas fa-books"></i> ${sources.length} Academic Sources Found</h3>
            <p>Click any source to verify it. These will be cited throughout your essay in APA 7th edition.</p>
            ${sourcesHTML}
        `);

        // ── STEP 3: Build Essay Plan ──────────────────────────
        setActiveStep(3);
        setStatus('Building plan…');
        updateProgressBar(60);

        appendMsg('ai', `
            <h3><i class="fas fa-list-check"></i> Building Essay Plan</h3>
            <p>Structuring ${state.paras + 2} paragraphs (intro + ${state.paras} body + conclusion)…</p>
            <div class="loading-indicator"><div class="loading-spinner"></div><span>Planning essay structure…</span></div>
        `);

        const sourcesList = sources.map((s, i) =>
            `[${i + 1}] ${s.author} (${s.year}). ${s.title}. ${s.journal}.`
        ).join('\n');

        const planPrompt = `You are an expert essay planner. Create a detailed paragraph-by-paragraph plan for this essay.

Topic: "${state.topic}"
Essay Type: ${state.essayType}
Key Themes: ${state.keyThemes.join(', ')}
Specific questions to address: ${state.specificQs.length ? state.specificQs.join('; ') : 'None specified'}
Use section headings: ${state.useHeadings}

Available Sources (use source numbers to assign):
${sourcesList}

Structure required:
- 1 Introduction paragraph (hook, background, thesis statement)
- ${state.paras} Body paragraphs (each covering a distinct argument/theme)
- 1 Conclusion paragraph (synthesis, restatement, implications)

Return ONLY a valid JSON array (no markdown) with exactly ${state.paras + 2} objects:
[
  {
    "section": "Introduction",
    "heading": "Introduction",
    "words": 120,
    "purpose": "Detailed description of what this paragraph will cover, including the hook strategy and thesis direction",
    "keyPoints": ["point 1", "point 2", "point 3"],
    "sources": [1, 3]
  },
  {
    "section": "Body",
    "heading": "Specific descriptive heading for this body paragraph",
    "words": 150,
    "purpose": "Detailed description of the argument, evidence, and analysis in this paragraph",
    "keyPoints": ["argument", "evidence", "analysis point"],
    "sources": [2, 4]
  },
  ...
  {
    "section": "Conclusion",
    "heading": "Conclusion",
    "words": 120,
    "purpose": "Synthesis of arguments and final insight",
    "keyPoints": ["restate thesis", "synthesize key arguments", "broader implication"],
    "sources": []
  }
]`;

        const planRaw = await callGeminiAPI(planPrompt);
        const plan = JSON.parse(planRaw.replace(/```json/g, '').replace(/```/g, '').trim());
        state.plan = plan;
        saveAssignment();

        updateProgressBar(70);

        // Render plan cards
        let planHTML = '<div class="plan-container">';
        plan.forEach((item, i) => {
            const isIntro = item.section === 'Introduction';
            const isConc  = item.section === 'Conclusion';
            const cls     = isIntro ? 'plan-intro' : isConc ? 'plan-conclusion' : 'plan-body';

            let kpHTML = '';
            if (item.keyPoints && item.keyPoints.length) {
                kpHTML = '<div class="plan-key-points"><strong>Key Points:</strong><ul>';
                item.keyPoints.forEach(kp => { kpHTML += `<li>${escHtml(kp)}</li>`; });
                kpHTML += '</ul></div>';
            }
            let srcHTML = '';
            if (item.sources && item.sources.length) {
                srcHTML = '<div class="plan-sources"><strong>Sources:</strong> ';
                srcHTML += item.sources.map(idx => {
                    const src = state.sources[idx - 1];
                    return src ? `${escHtml(src.author.split(',')[0])} (${escHtml(src.year)})` : `Src ${idx}`;
                }).join(', ');
                srcHTML += '</div>';
            }

            planHTML += `
                <div class="plan-card ${cls} editable-plan" id="plan-${i}" data-index="${i}">
                    <div class="plan-header">
                        <span class="plan-num">${i + 1}</span>
                        <div class="plan-info">
                            <h4 class="plan-heading-display" id="heading-display-${i}">${escHtml(item.heading)}</h4>
                            <input type="text" class="plan-heading-edit" id="heading-edit-${i}" value="${escHtml(item.heading)}" style="display:none">
                            <span class="plan-meta">
                                <span class="word-count-display" id="words-display-${i}">${item.words} words</span>
                                <input type="number" class="word-count-edit" id="words-edit-${i}" value="${item.words}" min="50" max="500" style="display:none">
                            </span>
                        </div>
                        <button class="btn-edit-plan" id="edit-btn-${i}" onclick="event.stopPropagation(); toggleEditPlan(${i})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                    <div class="plan-body">
                        <p class="plan-purpose-display" id="purpose-display-${i}">${escHtml(item.purpose)}</p>
                        <textarea class="plan-purpose-edit" id="purpose-edit-${i}" style="display:none">${escHtml(item.purpose)}</textarea>
                        ${kpHTML}${srcHTML}
                        <div class="plan-edit-actions" id="edit-actions-${i}" style="display:none;margin-top:12px">
                            <button class="btn-small btn-primary" onclick="event.stopPropagation();savePlanEdit(${i})"><i class="fas fa-check"></i> Save</button>
                            <button class="btn-small btn-outline" onclick="event.stopPropagation();cancelPlanEdit(${i})"><i class="fas fa-times"></i> Cancel</button>
                        </div>
                    </div>
                </div>`;
        });
        planHTML += '</div>';

        replaceLastMsg(`
            <h3><i class="fas fa-list-check"></i> Essay Plan Ready</h3>
            <p>${plan.length} paragraphs planned. You can edit any paragraph before drafting begins.</p>
            ${planHTML}
            ${renderPlanControls()}
            <div class="action-row" style="margin-top:16px;">
                <button class="btn-primary" onclick="startDraftingWithCitationsManager()">
                    <i class="fas fa-quote-right"></i> Review Citations & Start Drafting
                </button>
            </div>
        `);

        // Wire up plan card click-to-edit
        setTimeout(() => {
            document.querySelectorAll('.editable-plan').forEach(card => {
                card.addEventListener('click', function(e) {
                    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' ||
                        e.target.tagName === 'BUTTON' || e.target.closest('button') ||
                        this.classList.contains('editing')) return;
                    toggleEditPlan(parseInt(this.dataset.index));
                });
            });
        }, 150);

        updateProgressBar(0);
        setStatus('Plan ready — click "Start Drafting"');

    } catch (err) {
        console.error('Essay generation error:', err);
        replaceLastMsg(`
            <h3><i class="fas fa-exclamation-triangle"></i> Error</h3>
            <p>Something went wrong: ${escHtml(err.message || 'Unknown error')}. Please try again.</p>
            <button class="btn-primary" onclick="startGeneration()"><i class="fas fa-redo"></i> Retry</button>
        `);
        setStatus('Error');
        updateProgressBar(0);
    }

    sendBtn.disabled = false;
}

/* Replace the innerHTML of the last AI message */
function replaceLastMsg(html) {
    const msgs = document.querySelectorAll('.ai-msg');
    if (msgs.length) msgs[msgs.length - 1].querySelector('.msg-content').innerHTML = html;
}

/* Show citations manager before starting essay drafting */
async function startDraftingWithCitationsManager() {
    if (!state.sources || state.sources.length === 0) {
        showNotification('No sources available. Please generate a plan first.', 'error');
        return;
    }
    await showCitationsManager({ mode: 'assignment' }, state.sources);
}

/* =========================================================
   DRAFT ALL PARAGRAPHS
   ========================================================= */
async function draftAllParagraphs() {
    if (!state.plan || state.plan.length === 0) {
        showNotification('No plan to draft. Please generate a plan first.', 'error');
        return;
    }

    setActiveStep(4);
    setStatus('Drafting essay…');

    const sourcesList = state.sources.map((s, i) =>
        `[${i + 1}] ${s.author} (${s.year}). ${s.title}. ${s.journal}.`
    ).join('\n');

    for (let i = 0; i < state.plan.length; i++) {
        const para = state.plan[i];
        const progress = Math.round(10 + (i / state.plan.length) * 80);
        updateProgressBar(progress);
        setStatus(`Drafting paragraph ${i + 1} of ${state.plan.length}…`);

        // Show a placeholder card
        const cardId = `card-${i}`;
        appendMsg('ai', `
            <div class="para-card drafting" id="${cardId}">
                <div class="para-header">
                    <h4>${escHtml(para.heading)}</h4>
                    <span class="badge drafting" id="badge-${i}"><i class="fas fa-spinner fa-spin"></i> Writing…</span>
                </div>
                <div class="para-content">
                    <div class="loading-indicator" id="loader-${i}"><div class="loading-spinner"></div><span>Composing…</span></div>
                    <div id="ai-text-${i}" class="text-block"></div>
                </div>
            </div>
        `);
        scrollToBottom();

        try {
            const assignedSources = (para.sources || []).map(idx => state.sources[idx - 1]).filter(Boolean);
            const citeInstructions = assignedSources.length
                ? `Cite these specific sources in this paragraph using APA in-text format (Author, Year):\n${assignedSources.map(s => `- ${s.author.split(',')[0]} (${s.year}) — "${s.title}"`).join('\n')}`
                : `Include 1–2 relevant in-text citations (Author, Year) from the source list above.`;

            const draftPrompt = `You are an expert academic writer. Write a single well-structured paragraph for an essay.

Essay Topic: "${state.topic}"
Essay Type: ${state.essayType}
Paragraph Role: ${para.section}
Paragraph Heading: "${para.heading}"
Target Word Count: approximately ${para.words} words
Purpose: ${para.purpose}
Key Points to cover: ${(para.keyPoints || []).join('; ')}

Available Sources:
${sourcesList}

${citeInstructions}

STRICT RULES:
1. Write ONLY the paragraph text — no heading, no label, no preamble.
2. Target word count: ~${para.words} words. Do not go significantly over or under.
3. Use formal, academic English — clear and precise, not flowery.
4. Every paragraph MUST include at least one in-text citation in APA format: (Author, Year).
5. ${para.section === 'Introduction' ? 'Start with an engaging hook, provide background context, and end with a clear thesis statement.' : ''}
6. ${para.section === 'Conclusion' ? 'Synthesize the main arguments, restate the thesis in fresh words, and provide a final insight or implication. Do NOT introduce new arguments.' : ''}
7. ${para.section === 'Body' ? 'Follow the PEEL structure: Point → Evidence (cite source) → Explain → Link back to thesis.' : ''}
8. Output ONLY the paragraph text. No HTML tags, no asterisks, no bold formatting.
9. MALAWI GOVERNMENT CITATION RULE: Any Malawi government source — including Acts of Parliament, national policies, plans, ministerial documents, council reports, or government strategies — MUST be cited as (Government of Malawi, Year). Never cite by the name of the Act, policy, or ministry.`;

            const draft = await callGeminiAPI(draftPrompt);
            const cleanDraft = draft.replace(/```/g, '').trim();

            state.drafts[i] = cleanDraft;
            saveAssignment();

            // Update the card with the draft
            const card = document.getElementById(cardId);
            if (card) {
                card.classList.remove('drafting');
                card.classList.add('done');
                document.getElementById(`badge-${i}`).outerHTML = `<span class="badge done" id="badge-${i}">✓ Complete</span>`;
                const loader = document.getElementById(`loader-${i}`);
                if (loader) loader.remove();
                document.getElementById(`ai-text-${i}`).innerHTML = `<p>${escHtml(cleanDraft)}</p>`;
            }

        } catch (err) {
            console.error(`Error drafting para ${i}:`, err);
            const card = document.getElementById(cardId);
            if (card) {
                card.classList.remove('drafting');
                card.classList.add('error');
                document.getElementById(`badge-${i}`).outerHTML = `<span class="badge error" id="badge-${i}">⚠ Error</span>`;
                document.getElementById(`loader-${i}`).innerHTML = `<p style="color:var(--error)">Failed to draft. <button class="btn-small btn-outline" onclick="retryDraftParagraph(${i})">Retry</button></p>`;
            }
        }
    }

    // ── STEP: Generate References ─────────────────────────
    updateProgressBar(90);
    setStatus('Generating references…');

    try {
        const refsHtml = await generateEssayReferences();
        state.references = refsHtml;
        saveAssignment();

        appendMsg('ai', `
            <h3 class="success-heading"><i class="fas fa-check-circle"></i> Essay Complete!</h3>
            <p>Your essay has been fully drafted with ${state.plan.length} paragraphs and ${state.sources.length} verified APA references.</p>
            <div class="references-block" style="margin-top:16px;padding:16px;background:var(--bg-2);border-radius:var(--radius);border:1px solid var(--border)">
                <h4 style="margin-bottom:10px;text-align:left;"><i class="fas fa-book"></i> References</h4>
                <div class="references-content">${refsHtml}</div>
            </div>
        `);

        document.getElementById('export-btn').disabled = false;
        document.getElementById('export-btn').classList.add('ready');

    } catch (err) {
        console.error('References error:', err);
        showNotification('Essay complete but references failed. Try exporting anyway.', 'warning');
    }

    updateProgressBar(0);
    setStatus('Complete');
    scrollToBottom();
}

async function retryDraftParagraph(i) {
    const para = state.plan[i];
    const cardId = `card-${i}`;
    const card = document.getElementById(cardId);
    if (!card) return;

    card.classList.remove('error');
    card.classList.add('drafting');
    document.getElementById(`badge-${i}`).outerHTML = `<span class="badge drafting" id="badge-${i}"><i class="fas fa-spinner fa-spin"></i> Retrying…</span>`;
    document.getElementById(`ai-text-${i}`).innerHTML = '<div class="loading-indicator"><div class="loading-spinner"></div><span>Retrying…</span></div>';

    try {
        const draftPrompt = `Write a single ${para.section} paragraph (~${para.words} words) for an essay on: "${state.topic}"
Heading: "${para.heading}"
Purpose: ${para.purpose}
Include at least one APA in-text citation (Author, Year).
MALAWI GOVERNMENT CITATION RULE: Any Malawi government source (Acts, policies, plans, ministerial or council documents) MUST be cited as (Government of Malawi, Year) — never by the Act or policy name.
Output ONLY the paragraph text — no headings, no HTML.`;

        const draft = await callGeminiAPI(draftPrompt);
        const cleanDraft = draft.replace(/```/g, '').trim();
        state.drafts[i] = cleanDraft;
        saveAssignment();

        card.classList.remove('drafting');
        card.classList.add('done');
        document.getElementById(`badge-${i}`).outerHTML = `<span class="badge done" id="badge-${i}">✓ Complete</span>`;
        document.getElementById(`ai-text-${i}`).innerHTML = `<p>${escHtml(cleanDraft)}</p>`;
    } catch (err) {
        card.classList.remove('drafting');
        card.classList.add('error');
        document.getElementById(`badge-${i}`).outerHTML = `<span class="badge error" id="badge-${i}">⚠ Error</span>`;
        document.getElementById(`ai-text-${i}`).innerHTML = `<p style="color:var(--error)">Failed again. <button class="btn-small btn-outline" onclick="retryDraftParagraph(${i})">Retry</button></p>`;
    }
}

/* =========================================================
   ESSAY REFERENCES GENERATOR — produces valid APA 7th edition
   ========================================================= */
async function generateEssayReferences() {
    const includeDoi = dissState.includeDoi === true;
    const prompt = `You are an academic librarian producing a reference list in APA 7th edition format.

Generate a properly formatted APA 7th edition reference list for the following sources.
Return ONLY the references as an HTML string — one <p class="ref"> per reference.

STRICT RULES:
1. Journal article format: Author, A. A., & Author, B. B. (Year). Title of article. Journal Name, volume(issue), page–page.${includeDoi ? ' https://doi.org/xxxxx' : ''}
2. Book format: Author, A. A. (Year). Title of work: Capital letter after colon. Publisher.
3. Sort ALL references STRICTLY alphabetically by first author's surname (A → Z).
4. Every reference must be realistic and complete — no placeholders.
${includeDoi ? '5. Include DOIs for journal articles where applicable in format: https://doi.org/10.XXXX/xxxxx' : '5. DO NOT include DOIs or URLs for journal articles and books. Only include URLs for websites/online reports.'}
6. Wrap each reference in: <p class="ref">
7. MALAWI GOVERNMENT RULE: Any Malawi government document (Act, policy, plan, ministerial or council report) MUST be listed with "Government of Malawi" as the author — format as: Government of Malawi. (Year). [Title of document]. Ministry/Department name. Never use the Act name or policy name as the author.

Sources to format:
${state.sources.map((s, i) => `[${i+1}] ${JSON.stringify(s)}`).join('\n')}

Output ONLY the <p class="ref"> tags in alphabetical order. No headings, no intro text, no markdown.`;

    const raw = await callGeminiAPI(prompt);
    return raw.replace(/```html/g, '').replace(/```/g, '').trim();
}

/* =========================================================
   PLAN EDITING FUNCTIONS
   ========================================================= */
function toggleEditPlan(index) {
    const card = document.getElementById(`plan-${index}`);
    const isEditing = card.classList.contains('editing');
    
    if (isEditing) {
        cancelPlanEdit(index);
    } else {
        // Close any other open edits
        document.querySelectorAll('.plan-card.editing').forEach(c => {
            const idx = parseInt(c.dataset.index);
            if (idx !== index) cancelPlanEdit(idx);
        });
        
        // Show edit mode
        card.classList.add('editing');
        document.getElementById(`heading-display-${index}`).style.display = 'none';
        document.getElementById(`heading-edit-${index}`).style.display = 'block';
        document.getElementById(`words-display-${index}`).style.display = 'none';
        document.getElementById(`words-edit-${index}`).style.display = 'inline-block';
        document.getElementById(`purpose-display-${index}`).style.display = 'none';
        document.getElementById(`purpose-edit-${index}`).style.display = 'block';
        document.getElementById(`edit-actions-${index}`).style.display = 'flex';
        document.getElementById(`edit-btn-${index}`).innerHTML = '<i class="fas fa-times"></i>';
    }
}

function savePlanEdit(index) {
    const newHeading = document.getElementById(`heading-edit-${index}`).value;
    const newWords = parseInt(document.getElementById(`words-edit-${index}`).value);
    const newPurpose = document.getElementById(`purpose-edit-${index}`).value;
    
    // Update state
    state.plan[index].heading = newHeading;
    state.plan[index].words = newWords;
    state.plan[index].purpose = newPurpose;
    
    // Update display
    document.getElementById(`heading-display-${index}`).textContent = newHeading;
    document.getElementById(`words-display-${index}`).textContent = newWords + ' words';
    document.getElementById(`purpose-display-${index}`).textContent = newPurpose;
    
    // Exit edit mode
    cancelPlanEdit(index);
    
    // Save to localStorage
    saveAssignment();
}

function cancelPlanEdit(index) {
    const card = document.getElementById(`plan-${index}`);
    card.classList.remove('editing');
    
    // Reset to display mode
    document.getElementById(`heading-display-${index}`).style.display = 'block';
    document.getElementById(`heading-edit-${index}`).style.display = 'none';
    document.getElementById(`words-display-${index}`).style.display = 'inline';
    document.getElementById(`words-edit-${index}`).style.display = 'none';
    document.getElementById(`purpose-display-${index}`).style.display = 'block';
    document.getElementById(`purpose-edit-${index}`).style.display = 'none';
    document.getElementById(`edit-actions-${index}`).style.display = 'none';
    document.getElementById(`edit-btn-${index}`).innerHTML = '<i class="fas fa-edit"></i>';
    
    // Reset values to original
    document.getElementById(`heading-edit-${index}`).value = state.plan[index].heading;
    document.getElementById(`words-edit-${index}`).value = state.plan[index].words;
    document.getElementById(`purpose-edit-${index}`).value = state.plan[index].purpose;
}
/* =========================================================
   HANDLE SEND — main input dispatcher
   ========================================================= */
function handleSend() {
    const input = document.getElementById('main-input');
    const text = input.value.trim();

    // ── CASE 1: Awaiting chapter-specific instructions before planning ──
    if (awaitingChapterInstructions !== null) {
        const chapterNum = awaitingChapterInstructions;
        awaitingChapterInstructions = null;

        // Reset placeholder
        if (input) input.placeholder = 'Paste your assignment requirements here...';

        // Show user message (even if empty, to acknowledge the send)
        if (text) {
            appendMsg('user', `<p>${escHtml(text)}</p>`);
            // Store instructions in dissState for later use (citations manager → content)
            dissState.chapters[chapterNum].userInstructions = text;
        } else {
            appendMsg('user', '<p><em>No specific instructions — using default structure.</em></p>');
            dissState.chapters[chapterNum].userInstructions = '';
        }

        input.value = '';
        autoGrow(input);

        // Now kick off the workflow with the captured instructions ('' means use defaults)
        startChapterWorkflow(chapterNum, text || '');
        return;
    }

    // ── CASE 2: Revision mode — send comments to revision handler ──
    if (revisionState.active) {
        if (!text) { showNotification('Please enter supervisor feedback first.', 'error'); return; }
        handleRevisionComments();
        return;
    }

    // ── CASE 3: Normal essay/dissertation start ──
    if (currentMode === 'assignment') {
        startGeneration();
    } else if (currentMode === 'dissertation') {
        // In dissertation mode with no special state, just show a helpful hint
        if (text) {
            appendMsg('user', `<p>${escHtml(text)}</p>`);
            appendMsg('ai', '<p>Use the chapter buttons to navigate your dissertation. If you want to revise a chapter with feedback, click <strong>Revise with Feedback</strong> on that chapter.</p>');
            input.value = ''; autoGrow(input);
        }
    }
}


/* =========================================================
   SKIP CHAPTER INSTRUCTIONS
   ========================================================= */
function skipChapterInstructions(chapterNum) {
    awaitingChapterInstructions = null;
    const input = document.getElementById("main-input");
    if (input) input.placeholder = "Paste your assignment requirements here...";
    dissState.chapters[chapterNum].userInstructions = "";
    startChapterWorkflow(chapterNum, "");
}

/* =========================================================
   AUTO GROW TEXTAREA
   ========================================================= */
function autoGrow(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
}

/* =========================================================
   PDF TEXT EXTRACTION
   ========================================================= */
async function extractPdfText(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let p = 1; p <= Math.min(pdf.numPages, 20); p++) {
        const page = await pdf.getPage(p);
        const content = await page.getTextContent();
        text += content.items.map(i => i.str).join(' ') + '\n';
    }
    return text;
}

/* =========================================================
   DOCX TEXT EXTRACTION
   ========================================================= */
async function extractDocxText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const result = await mammoth.extractRawText({ arrayBuffer: e.target.result });
                resolve(result.value);
            } catch (err) { reject(err); }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

/* =========================================================
   START CHAPTER REVISION
   ========================================================= */
function startChapterRevision(chapterNum) {
    const chapter = dissState.chapters[chapterNum];
    if (!chapter || !chapter.content) {
        showNotification('No chapter content to revise.', 'error');
        return;
    }

    revisionState = {
        active: true,
        chapterNum: chapterNum,
        awaitingConfirm: false,
        pendingPlan: null,
        pendingComments: null,
        extractedComments: null
    };
    revisionFixes = [];
    updateAttachButton();

    appendMsg('ai', `
        <h3><i class="fas fa-comment-dots"></i> Revision Mode — ${escHtml(chapter.title)}</h3>
        <p>Two ways to provide supervisor feedback:</p>
        <div style="display:flex; gap:12px; margin-top:12px; flex-wrap:wrap;">
            <div style="flex:1; min-width:200px; background:var(--bg-2); border:1px solid var(--border); border-radius:var(--radius); padding:14px;">
                <strong><i class="fas fa-file-word" style="color:#2b579a;"></i> Upload commented .docx</strong>
                <p style="font-size:0.84rem; color:var(--text-2); margin-top:6px;">Click the paperclip and upload a Word doc with tracked comments from your supervisor.</p>
            </div>
            <div style="flex:1; min-width:200px; background:var(--bg-2); border:1px solid var(--border); border-radius:var(--radius); padding:14px;">
                <strong><i class="fas fa-keyboard"></i> Type feedback</strong>
                <p style="font-size:0.84rem; color:var(--text-2); margin-top:6px;">Type or paste your supervisor's comments below and press Send.</p>
            </div>
        </div>
        <button class="btn-outline" style="margin-top:12px; border-color:var(--error); color:var(--error);" onclick="cancelRevisionMode()">
            <i class="fas fa-times"></i> Cancel Revision
        </button>
    `);

    document.getElementById('main-input').focus();
    scrollToBottom();
}

/* =========================================================
   CANCEL REVISION MODE
   ========================================================= */
function cancelRevisionMode() {
    revisionState = {
        active: false,
        chapterNum: null,
        awaitingConfirm: false,
        pendingPlan: null,
        pendingComments: null,
        extractedComments: null
    };
    revisionFixes = [];
    updateAttachButton();

    const input = document.getElementById('main-input');
    if (input) {
        input.placeholder = 'Paste your assignment requirements here...';
    }

    document.getElementById('send-btn').disabled = false;
    setStatus('Ready');
}

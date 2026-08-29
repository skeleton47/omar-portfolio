/**
 * OMAR.SEC - Interactive Cyber Features, Skills Inspector & Resume Modal
 */

document.addEventListener('DOMContentLoaded', () => {
    initCyberWave();
    initInteractiveTerminal();
    initNavEvents();
    initSkillsInspector();
    initResumeModal();
    initCopyActions();
    initMatrixMode();
    initConnectTerminal();
});


/* ==========================================================================
   1. CYBER MATRIX / WAVE CANVAS ANIMATION
   ========================================================================== */
function initCyberWave() {
    const canvas = document.getElementById('cyberWaveCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let animationFrameId;

    // Grid configuration for 3D Cyber Mesh
    const cols = 45;
    const rows = 24;
    let stepX, stepY;
    let points = [];
    let tick = 0;
    let mouse = { x: 0, y: 0, active: false };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        stepX = width / (cols - 1);
        stepY = (height * 0.45) / (rows - 1);

        initPoints();
    }

    function initPoints() {
        points = [];
        for (let r = 0; r < rows; r++) {
            const rowPoints = [];
            for (let c = 0; c < cols; c++) {
                rowPoints.push({
                    baseX: c * stepX,
                    baseY: height - (rows - r) * (stepY * 0.85),
                    x: c * stepX,
                    y: 0,
                    z: r / rows
                });
            }
            points.push(rowPoints);
        }
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });

    resize();

    function render() {
        tick += 0.025;
        ctx.clearRect(0, 0, width, height);

        // Update point elevations with sine waves & perspective
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const pt = points[r][c];
                
                const distToMouse = Math.hypot(pt.baseX - mouse.x, pt.baseY - mouse.y);
                const mouseInfluence = mouse.active && distToMouse < 220 ? (1 - distToMouse / 220) * 35 : 0;

                const wave1 = Math.sin(c * 0.22 + tick + r * 0.15) * 16;
                const wave2 = Math.cos(r * 0.35 - tick * 1.2 + c * 0.1) * 10;
                
                const depthScale = 0.3 + pt.z * 0.7; // perspective scale
                pt.y = pt.baseY + (wave1 + wave2 - mouseInfluence) * depthScale;
            }
        }

        // Draw horizontal grid lines with gradient opacity
        for (let r = 0; r < rows; r++) {
            ctx.beginPath();
            const alpha = (r / rows) * 0.28;
            ctx.strokeStyle = `rgba(0, 255, 102, ${alpha})`;
            ctx.lineWidth = 0.75 + (r / rows) * 0.8;

            for (let c = 0; c < cols; c++) {
                const pt = points[r][c];
                if (c === 0) {
                    ctx.moveTo(pt.x, pt.y);
                } else {
                    ctx.lineTo(pt.x, pt.y);
                }
            }
            ctx.stroke();
        }

        // Draw vertical connector lines (cyber grid mesh)
        for (let c = 0; c < cols; c += 2) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 255, 102, 0.06)`;
            ctx.lineWidth = 0.5;

            for (let r = 0; r < rows; r++) {
                const pt = points[r][c];
                if (r === 0) {
                    ctx.moveTo(pt.x, pt.y);
                } else {
                    ctx.lineTo(pt.x, pt.y);
                }
            }
            ctx.stroke();
        }

        // Draw glowing particle nodes at crests
        for (let r = Math.floor(rows * 0.3); r < rows; r += 2) {
            for (let c = 0; c < cols; c += 3) {
                const pt = points[r][c];
                const nodeAlpha = (r / rows) * 0.6;
                
                ctx.fillStyle = `rgba(0, 255, 102, ${nodeAlpha})`;
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 1.2 + (r / rows), 0, Math.PI * 2);
                ctx.fill();

                // Subtle node glow
                if (r > rows - 5 && c % 6 === 0) {
                    ctx.fillStyle = `rgba(0, 255, 102, ${nodeAlpha * 0.4})`;
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        animationFrameId = requestAnimationFrame(render);
    }

    render();
}

/* ==========================================================================
   2. SKILLS DATABASE & INTERACTIVE CLICK-TO-INSPECT LOGIC
   ========================================================================== */
const skillsDatabase = {
    'fortinet': {
        name: 'FortiSIEM & FortiAnalyzer',
        icon: '<i class="fa-solid fa-shield-halved"></i>',
        category: 'Cybersecurity & SIEM',
        level: 'Certified / Advanced (NTI 2026)',
        desc: 'Specialized in enterprise security operations, real-time threat telemetry correlation, centralized log intelligence, and automated incident triage across complex multi-tenant infrastructures.',
        capabilities: [
            'Configured real-time SIEM event correlation rules, anomaly alerts, and custom syslog parsers.',
            'Centralized syslog management, compliance reporting, and audit log telemetry pipelines.',
            'Investigated and mitigated 15+ real-world enterprise cyber threat vectors in virtualized environments.',
            'Mastered incident response workflows, alert prioritization, and SOC telemetry diagnostics.'
        ],
        projects: [
            { name: 'FortiSIEM & FortiAnalyzer Security Suite', link: '#projects', icon: 'fa-solid fa-shield-halved' },
            { name: 'Enterprise Threat Simulation Lab', link: '#experience', icon: 'fa-solid fa-server' }
        ],
        tags: ['FortiSIEM', 'FortiAnalyzer', 'Event Correlation', 'Syslog', 'SOC Ops', 'Threat Hunting', 'NTI 2026']
    },
    'network-sec': {
        name: 'Network Security & Pen Testing',
        icon: '<i class="fa-solid fa-network-wired"></i>',
        category: 'Cybersecurity & Defense',
        level: 'Advanced Specialist',
        desc: 'Deep understanding of TCP/IP OSI model, firewall configuration, VPN architecture, traffic inspection, packet payload analysis, and defensive vulnerability scanning.',
        capabilities: [
            'Deep packet inspection, handshake analysis, and protocol dissection with Wireshark.',
            'Network topology design, ACL access controls, and VLAN segmentation in Cisco Packet Tracer.',
            'Vulnerability assessment, exploit payload analysis, and hardening with Metasploit & Linux.',
            'Hardened OS environments, firewall rule tuning, and perimeter intrusion prevention.'
        ],
        projects: [
            { name: 'Cyber Threat Lab & Packet Inspector', link: '#projects', icon: 'fa-solid fa-network-wired' },
            { name: 'Egypt Cyber Heroes Hardening Lab', link: '#experience', icon: 'fa-solid fa-shield-virus' }
        ],
        tags: ['Wireshark', 'Metasploit', 'Packet Tracer', 'Firewalls', 'VPN', 'Linux Hardening', 'TCP/IP']
    },
    'dotnet': {
        name: 'C# & .NET 8 / 9',
        icon: '<i class="fa-solid fa-code"></i>',
        category: '.NET & Backend Engineering',
        level: 'Expert Engineer',
        desc: 'Architecting high-performance, maintainable enterprise backends with ASP.NET Core Web API, MVC, Dependency Injection, and strict Clean Architecture.',
        capabilities: [
            'Built enterprise RESTful Web APIs with ASP.NET Core 8/9, JWT Authentication, and rate-limiting.',
            'Implemented Clean Architecture, Repository Pattern, Unit of Work, and Service abstractions.',
            'Robust LINQ querying, database retry policies, and structured exception handling pipelines.',
            'Strong adherence to SOLID design principles, clean code practices, and unit testability.'
        ],
        projects: [
            { name: 'Acolite — AI Freelance Marketplace (API)', link: 'https://github.com/skeleton47/acolite.xyz_iti_.net', icon: 'fa-solid fa-brain' },
            { name: 'MvcTask — Multi-Tier Management System', link: 'https://github.com/skeleton47/MvcTask', icon: 'fa-solid fa-cubes' }
        ],
        tags: ['C#', '.NET 8', '.NET 9', 'ASP.NET Core', 'Clean Architecture', 'JWT', 'SOLID', 'Web API']
    },
    'icpc': {
        name: 'C++ & ICPC Algorithmic Coaching',
        icon: '<i class="fa-solid fa-laptop-code"></i>',
        category: 'Algorithms & Problem Solving',
        level: 'Master Coach',
        desc: 'Advanced problem solver and competitive programming instructor. Trained 50+ students in C++ algorithmic thinking, space-time complexity optimization, and contest problem modeling.',
        capabilities: [
            'Advanced Data Structures: Segment Trees with Lazy Propagation, Fenwick Trees, DSU, Trie.',
            'Graph Theory: Dijkstra, Bellman-Ford, Floyd-Warshall, Kruskal/Prim MST, BFS/DFS, TopoSort.',
            'Dynamic Programming: 1D/2D DP, DP with Bitmasking, State Compression, and Recurrence optimization.',
            'Authored mock contests, problem sets, and led competitive programming training for ECPC/ICPC qualifiers.'
        ],
        projects: [
            { name: 'ICPC Horus University Coaching Syllabus', link: '#icpc-section', icon: 'fa-solid fa-tree' },
            { name: 'Algorithmic Problem-Solving Repository', link: 'https://github.com/skeleton47', icon: 'fa-brands fa-github' }
        ],
        tags: ['C++', 'Segment Trees', 'Graph Theory', 'Dynamic Programming', 'DSU', 'ECPC', 'ICPC Coach']
    },
    'react': {
        name: 'React 18 & TypeScript',
        icon: '<i class="fa-brands fa-react"></i>',
        category: 'Frontend Engineering',
        level: 'Advanced Developer',
        desc: 'Crafting responsive, responsive, high-performance web applications with modern React hooks, TypeScript type-safety, Tailwind CSS, and state management.',
        capabilities: [
            'Built responsive, reactive component trees with modern React 18 hooks & functional components.',
            'Enforced complete type-safety across props, API responses, and custom state using TypeScript.',
            'Sleek modern UI design utilizing Tailwind CSS, glassmorphism, glowing cyber effects, and CSS Grid.',
            'Integrated real-time SignalR WebSocket clients and asynchronous RESTful API consumption.'
        ],
        projects: [
            { name: 'Acolite Frontend Platform (React + TS)', link: 'https://acolite.xyz', icon: 'fa-solid fa-arrow-up-right-from-square' },
            { name: 'Interactive Cyber Portfolio SPA', link: '#home', icon: 'fa-solid fa-bolt' }
        ],
        tags: ['React 18', 'TypeScript', 'Tailwind CSS', 'State Management', 'WebSockets', 'SPA']
    },
    'sql': {
        name: 'SQL Server & EF Core',
        icon: '<i class="fa-solid fa-database"></i>',
        category: 'Database & ORM',
        level: 'Advanced Specialist',
        desc: 'Relational database schema modeling, query optimization, indexing, and seamless entity mapping with Entity Framework Core migrations.',
        capabilities: [
            'Designed normalized relational schemas, foreign keys, cascading rules, and composite indexes.',
            'Entity Framework Core Code-First migrations, fluent API configurations, and relationship mappings.',
            'Optimized LINQ expressions to eliminate N+1 queries and enhance throughput.',
            'Implemented connection resilience, retry strategies, and transaction safety in SQL Server.'
        ],
        projects: [
            { name: 'Acolite Relational Data Layer', link: 'https://github.com/skeleton47/acolite.xyz_iti_.net', icon: 'fa-solid fa-database' },
            { name: 'MvcTask Academic Schema & Migrations', link: 'https://github.com/skeleton47/MvcTask', icon: 'fa-solid fa-cubes' }
        ],
        tags: ['SQL Server', 'EF Core', 'LINQ', 'Migrations', 'Query Optimization', 'Indexes']
    },
    'signalr': {
        name: 'SignalR & Real-Time WebSockets',
        icon: '<i class="fa-solid fa-tower-broadcast"></i>',
        category: 'Real-Time Communication',
        level: 'Advanced Developer',
        desc: 'Full duplex bi-directional communication hubs enabling real-time user chats, instant notifications, status alerts, and live event broadcasting.',
        capabilities: [
            'Built ASP.NET Core SignalR Hubs with group management, user mappings, and token authentication.',
            'Engineered resilient client-side reconnect strategies with React and TypeScript.',
            'Instant bi-directional messaging, typing indicators, and real-time security alerts.',
            'Optimized WebSocket protocol fallback for high-concurrency connections.'
        ],
        projects: [
            { name: 'Acolite Real-Time Freelancer Chat Hub', link: 'https://acolite.xyz', icon: 'fa-solid fa-comments' }
        ],
        tags: ['SignalR', 'WebSockets', 'Real-Time', 'Hubs', 'Instant Messaging', 'Live Alerts']
    },
    'gemini-ai': {
        name: 'Google Gemini AI Integration',
        icon: '<i class="fa-solid fa-brain"></i>',
        category: 'AI & Automation',
        level: 'Proficient Integrator',
        desc: 'Integrating Google Gemini LLM capabilities into enterprise applications for automated resume parsing, intelligent matching, semantic search, and smart workflows.',
        capabilities: [
            'Integrated Google Gemini REST API into C# .NET backend with secure API key management.',
            'Engineered prompt templates for structured JSON output, recruiter matching, and text analysis.',
            'Automated proposal screening and semantic candidate ranking in marketplace software.',
            'Designed fallback mechanisms and token usage optimizations.'
        ],
        projects: [
            { name: 'Acolite AI Recruiter & Semantic Matcher', link: 'https://acolite.xyz', icon: 'fa-solid fa-brain' }
        ],
        tags: ['Google Gemini', 'LLM', 'AI Automation', 'Semantic Search', 'Prompt Engineering']
    },
    'docker-cloud': {
        name: 'Docker & Cloud DevOps',
        icon: '<i class="fa-brands fa-docker"></i>',
        category: 'DevOps & Deployment',
        level: 'Proficient Engineer',
        desc: 'Containerizing full-stack applications with Docker, managing multi-container setups, and continuous deployment to cloud environments (Railway, Vercel, GitHub Pages).',
        capabilities: [
            'Authored optimized multi-stage Dockerfiles for .NET Web APIs and React applications.',
            'Configured GitHub Actions CI/CD workflows for automated build, test, and deployment.',
            'Deployed production microservices to Railway and frontend applications to Vercel.',
            'Managed GitHub Pages automated static hosting pipelines.'
        ],
        projects: [
            { name: 'GitHub Pages Automated Portfolio Pipeline', link: 'https://github.com/skeleton47/omar-portfolio', icon: 'fa-brands fa-github' },
            { name: 'Acolite Cloud Deployment Environment', link: 'https://acolite.xyz', icon: 'fa-solid fa-cloud' }
        ],
        tags: ['Docker', 'GitHub Actions', 'CI/CD', 'Railway', 'Vercel', 'GitHub Pages']
    }
};

function initSkillsInspector() {
    const skillCards = document.querySelectorAll('.skill-card');
    const modalBackdrop = document.getElementById('skillModalBackdrop');
    const closeBtn = document.getElementById('skillModalCloseBtn');
    const closeFooterBtn = document.getElementById('skillModalCloseFooterBtn');
    
    const modalIcon = document.getElementById('skillModalIcon');
    const modalCat = document.getElementById('skillModalCat');
    const modalTitle = document.getElementById('skillModalTitle');
    const modalBadge = document.getElementById('skillModalBadge');
    const modalDesc = document.getElementById('skillModalDesc');
    const modalList = document.getElementById('skillModalList');
    const modalProjects = document.getElementById('skillModalProjects');
    const modalTags = document.getElementById('skillModalTags');

    if (!modalBackdrop || skillCards.length === 0) return;

    function openSkillModal(skillId) {
        const skill = skillsDatabase[skillId];
        if (!skill) return;

        // Populate Modal Fields
        if (modalIcon) modalIcon.innerHTML = skill.icon;
        if (modalCat) modalCat.textContent = skill.category;
        if (modalTitle) modalTitle.textContent = skill.name;
        if (modalBadge) modalBadge.textContent = skill.level;
        if (modalDesc) modalDesc.textContent = skill.desc;

        // Populate Capabilities
        if (modalList) {
            modalList.innerHTML = skill.capabilities
                .map(cap => `<li><i class="fa-solid fa-check text-green"></i> ${cap}</li>`)
                .join('');
        }

        // Populate Projects
        if (modalProjects) {
            modalProjects.innerHTML = skill.projects
                .map(p => `
                    <a href="${p.link}" target="${p.link.startsWith('http') ? '_blank' : '_self'}" class="skill-modal-project-link">
                        <i class="${p.icon}"></i>
                        <span>${p.name}</span>
                    </a>
                `)
                .join('');
        }

        // Populate Tags
        if (modalTags) {
            modalTags.innerHTML = skill.tags
                .map(t => `<span class="tag">${t}</span>`)
                .join('');
        }

        // Open Modal
        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSkillModal() {
        modalBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Attach click listeners to skill cards
    skillCards.forEach(card => {
        card.addEventListener('click', () => {
            const skillId = card.getAttribute('data-skill-id');
            if (skillId) {
                openSkillModal(skillId);
            }
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeSkillModal);
    if (closeFooterBtn) closeFooterBtn.addEventListener('click', closeSkillModal);

    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
            closeSkillModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
            closeSkillModal();
        }
    });
}


/* ==========================================================================
   3. QUICK RESUME PREVIEW MODAL LOGIC
   ========================================================================== */
function initResumeModal() {
    const modalBackdrop = document.getElementById('resumeModalBackdrop');
    const navBtn = document.getElementById('quickResumeNavBtn');
    const heroBtn = document.getElementById('heroResumeModalBtn');
    const aboutBtn = document.getElementById('aboutResumeModalBtn');
    const closeBtn = document.getElementById('resumeModalCloseBtn');
    const closeFooterBtn = document.getElementById('resumeModalCloseFooterBtn');

    if (!modalBackdrop) return;

    function openModal() {
        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (navBtn) navBtn.addEventListener('click', openModal);
    if (heroBtn) heroBtn.addEventListener('click', openModal);
    if (aboutBtn) aboutBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeFooterBtn) closeFooterBtn.addEventListener('click', closeModal);

    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
            closeModal();
        }
    });
}

/* ==========================================================================
   4. COPY ACTIONS & CYBER TOAST
   ========================================================================== */
function showToast(message) {
    const toast = document.getElementById('cyberToast');
    const toastMsg = document.getElementById('toastMsg');
    if (!toast) return;

    toastMsg.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function initCopyActions() {
    const copyItems = document.querySelectorAll('.contact-item-copy');
    copyItems.forEach(item => {
        item.addEventListener('click', () => {
            const textToCopy = item.getAttribute('data-copy');
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast(`Copied ${textToCopy} to clipboard!`);
                }).catch(() => {
                    showToast(`Selected: ${textToCopy}`);
                });
            }
        });
    });
}

/* ==========================================================================
   5. MATRIX MODE ANIMATION TOGGLE
   ========================================================================== */
function initMatrixMode() {
    const matrixBtn = document.getElementById('matrixModeToggleBtn');
    let matrixCanvas = document.getElementById('matrixCanvas');
    let matrixActive = false;
    let matrixInterval = null;

    if (!matrixBtn) return;

    if (!matrixCanvas) {
        matrixCanvas = document.createElement('canvas');
        matrixCanvas.id = 'matrixCanvas';
        document.body.appendChild(matrixCanvas);
    }

    const ctx = matrixCanvas.getContext('2d');
    const chars = '0123456789ABCDEF<>/{};:*~+=-_OMAR.SEC';
    let fontSize = 14;
    let columns = 0;
    let drops = [];

    function setupMatrix() {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
        columns = Math.floor(matrixCanvas.width / fontSize);
        drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * -50);
        }
    }

    function drawMatrix() {
        ctx.fillStyle = 'rgba(5, 8, 8, 0.08)';
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

        ctx.fillStyle = '#00ff66';
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    function toggleMatrix() {
        matrixActive = !matrixActive;
        if (matrixActive) {
            setupMatrix();
            matrixCanvas.classList.add('active');
            matrixInterval = setInterval(drawMatrix, 40);
            showToast('Matrix Rain Mode: ACTIVATED [Click bolt to turn off]');
        } else {
            matrixCanvas.classList.remove('active');
            clearInterval(matrixInterval);
            ctx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
            showToast('Matrix Rain Mode: DEACTIVATED');
        }
    }

    matrixBtn.addEventListener('click', toggleMatrix);
    window.addEventListener('resize', () => {
        if (matrixActive) setupMatrix();
    });
}

/* ==========================================================================
   6. INTERACTIVE CYBER TERMINAL
   ========================================================================== */
function initInteractiveTerminal() {
    const termInput = document.getElementById('termInput');
    const termCursor = document.getElementById('termCursor');
    const dynamicLogs = document.getElementById('dynamicLogs');
    const terminalBody = document.getElementById('terminalBody');
    const terminalToggleBtn = document.getElementById('terminalToggleBtn');

    if (!termInput) return;

    function updateCursorPosition() {
        const textLen = termInput.value.length;
        const charWidth = 8.8;
        termCursor.style.left = `${textLen * charWidth}px`;
    }

    termInput.addEventListener('input', updateCursorPosition);
    termInput.addEventListener('click', () => termInput.focus());

    terminalBody.addEventListener('click', () => {
        termInput.focus();
    });

    if (terminalToggleBtn) {
        terminalToggleBtn.addEventListener('click', () => {
            termInput.focus();
            terminalBody.scrollTop = terminalBody.scrollHeight;
            flashTerminalHighlight();
        });
    }

    function flashTerminalHighlight() {
        const termWindow = document.querySelector('.terminal-window');
        if (termWindow) {
            termWindow.style.boxShadow = '0 0 45px rgba(0, 255, 102, 0.45)';
            setTimeout(() => {
                termWindow.style.boxShadow = '';
            }, 600);
        }
    }

    // Command Registry
    const commands = {
        'help': () => ({
            type: 'success',
            text: `Available commands:\n  • resume      - Open the on-screen interactive CV preview modal\n  • skills      - List Cybersecurity, .NET, React & Algorithm skills\n  • icpc        - What is ICPC & my competitive programming syllabus\n  • fortinet    - FortiSIEM & FortiAnalyzer certification details (NTI 2026)\n  • projects    - View security suites & engineering platforms\n  • exp         - View career history & ICPC coaching\n  • certs       - View Fortinet, NTI, ITI & CS50 credentials\n  • contact     - Show direct email, phone & LinkedIn\n  • clear       - Clear terminal history\n  • whoami      - Print current user identity\n  • matrix      - Toggle cyber matrix rain mode`
        }),
        'resume': () => {
            const modalBackdrop = document.getElementById('resumeModalBackdrop');
            if (modalBackdrop) {
                modalBackdrop.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
            return {
                type: 'success',
                text: `[✓] Opening Interactive Resume Preview Modal...`
            };
        },
        'cv': () => commands['resume'](),
        'icpc': () => ({
            type: 'success',
            text: `[🏆] What is ICPC? (International Collegiate Programming Contest)\n     The premier global competitive programming competition testing algorithmic problem-solving & math.\n\n[📚] What I Instruct & Coach (50+ Students):\n     • Advanced Data Structures : Segment Trees, Lazy Propagation, Fenwick Trees, DSU, Trie\n     • Graph Theory & Traversal  : Dijkstra, Bellman-Ford, Floyd-Warshall, MST, BFS/DFS, TopoSort\n     • Dynamic Programming      : 1D/2D DP, DP with Bitmask, State Optimization\n     • Complexity & Optimization: O(N log N) / O(1) runtime optimization, space reduction\n     • Mentorship               : Training university teams for national qualifiers (ECPC / ICPC)`
        }),
        'fortinet': () => ({
            type: 'success',
            text: `[🛡️] Fortinet FortiSIEM & FortiAnalyzer Specialist — NTI & Fortinet (2026)\n     • FortiSIEM    : Real-time security event correlation, multi-tenant SOC management, SIEM parsing rules.\n     • FortiAnalyzer: Centralized syslog aggregation, compliance reporting, threat hunting & forensics.\n     • SOC Labs     : 15+ real-world attack scenarios mitigated & hardened across virtual environments.`
        }),
        'siem': () => commands['fortinet'](),
        'soc': () => commands['fortinet'](),
        'about': () => ({
            type: 'default',
            text: `Omar Hisham Mohamed Elshayal\nIntelligent Cybersecurity Specialist | Fortinet Certified (FortiSIEM & FortiAnalyzer 2026)\nFull-Stack .NET Developer | ICPC Instructor mentoring 50+ students in C++ & algorithms.`
        }),
        'cat about_me.txt': () => ({
            type: 'default',
            text: `Name       : Omar Hisham Mohamed Elshayal\nRole       : Intelligent Cybersecurity Specialist | Full-Stack .NET Developer | ICPC Instructor\nSecurity   : FortiSIEM & FortiAnalyzer Specialist (Fortinet & NTI 2026)\nEducation  : B.Sc. Intelligent Cybersecurity @ Horus University (GPA 3.02)\nICPC Coach : Trained 50+ students in C++ algorithms & data structures for national qualifiers\nFull-Stack : C#, .NET 8/9, ASP.NET Core, React 18, TypeScript, SQL Server, SignalR\nLocation   : New Damietta, Damietta, Egypt\nMission    : Bulletproof security today, scalable architecture tomorrow.`
        }),
        'skills': () => ({
            type: 'success',
            text: `[+] Cybersecurity : FortiSIEM, FortiAnalyzer, Wireshark, Metasploit, Cisco Packet Tracer, Linux Hardening\n[+] Algorithms    : ICPC Coaching, Segment Trees, Graphs, Dynamic Programming, Complexity Analysis\n[+] Backend & .NET: C#, .NET 8/9, ASP.NET Core (Web API & MVC), EF Core, LINQ, SignalR, JWT\n[+] Frontend      : React.js, TypeScript, JavaScript (ES6+), Tailwind CSS, Bootstrap, HTML5/CSS3\n[+] Databases/AI  : SQL Server, EF Migrations, Google Gemini AI Integration, Docker, Railway, Vercel`
        }),
        'projects': () => ({
            type: 'success',
            text: `1. FortiSIEM & Analyzer Suite - Enterprise SIEM event correlation, log analytics & SOC defense (NTI 2026)\n2. Acolite Platform           - Full-Stack AI Freelance Hub (C# .NET 8, React, Gemini AI, SignalR) [acolite.xyz]\n3. MvcTask Management         - Multi-tier ASP.NET Core MVC enterprise system (C#, .NET 9, EF Core, SQL Server)`
        }),
        'experience': () => ({
            type: 'default',
            text: `• FortiSIEM & FortiAnalyzer Trainee — NTI & Fortinet (2026): Enterprise SIEM correlation & SOC defense.\n• ICPC Instructor — Horus University (Sep 2025 – Present): Trained 50+ students in C++ algorithms.\n• Cybersecurity Trainee — NTI / MCIT (Aug 2025): Egypt Cyber Heroes network & penetration testing.\n• Full-Stack .NET Track — ITI (2026): Clean Architecture & enterprise web apps.`
        }),
        'exp': () => commands['experience'](),
        'certs': () => ({
            type: 'success',
            text: `[✓] FortiSIEM & FortiAnalyzer Specialist — National Telecommunication Institute (NTI) & Fortinet (2026)\n[✓] Egypt Cyber Heroes Program — NTI / MCIT (2025)\n[✓] Full-Stack .NET Track Certificate — Information Technology Institute (ITI) (2026)\n[✓] B.Sc. in Intelligent Cybersecurity (GPA 3.02) — Horus University (Faculty of AI)\n[✓] CS50: Introduction to Computer Science — Harvard University\n[✓] Entrepreneurship & Innovation Certificate — Horus University (2025)`
        }),
        'contact': () => ({
            type: 'default',
            text: `Email   : weo11288@gmail.com\nPhone   : +20 127 975 2075\nLocation: New Damietta, Damietta, Egypt\nGitHub  : github.com/skeleton47\nLinkedIn: linkedin.com/in/omar-hisham-mohamed-elshayal-957696355/`
        }),
        'whoami': () => ({
            type: 'success',
            text: `omar@soc-core:~$ (Omar Hisham Elshayal - Cybersecurity Specialist, Full-Stack .NET Engineer & ICPC Coach)`
        }),
        'matrix': () => {
            const matrixBtn = document.getElementById('matrixModeToggleBtn');
            if (matrixBtn) matrixBtn.click();
            return {
                type: 'success',
                text: `[✓] Toggling Matrix Mode animation...`
            };
        },
        'clear': () => {
            dynamicLogs.innerHTML = '';
            return null;
        }
    };

    termInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawCmd = termInput.value.trim();
            const cmd = rawCmd.toLowerCase();

            if (rawCmd.length > 0) {
                executeCommand(rawCmd, cmd);
            }

            termInput.value = '';
            updateCursorPosition();
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });

    function executeCommand(rawCmd, cmd) {
        if (cmd === 'clear') {
            dynamicLogs.innerHTML = '';
            return;
        }

        let output;
        if (commands[cmd]) {
            output = commands[cmd]();
        } else if (commands[rawCmd]) {
            output = commands[rawCmd]();
        } else {
            output = {
                type: 'error',
                text: `zsh: command not found: ${rawCmd}. Type 'help' for available commands.`
            };
        }

        if (output) {
            const logBlock = document.createElement('div');
            logBlock.className = 'terminal-log-block';

            logBlock.innerHTML = `
                <div class="terminal-log-cmd"><span class="term-arrow">&gt;</span> ${escapeHtml(rawCmd)}</div>
                <div class="terminal-log-res ${output.type}">${escapeHtml(output.text)}</div>
            `;

            dynamicLogs.appendChild(logBlock);
        }
    }

    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}

/* ==========================================================================
   7. NAVIGATION & SCROLL SPY
   ========================================================================== */
function initNavEvents() {
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollIndicator = document.getElementById('scrollTrigger');
    const sections = document.querySelectorAll('main, section');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                if (id) {
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href === `#${id}`) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

/* ==========================================================================
   8. MINI CONNECT TERMINAL
   ========================================================================== */
function initConnectTerminal() {
    const connectBox = document.querySelector('.connect-terminal-box');
    if (!connectBox) return;

    connectBox.addEventListener('click', () => {
        const msg = connectBox.querySelector('.connect-ready-msg');
        if (msg) {
            msg.style.color = '#00ff66';
            msg.innerText = 'Ping response: 18ms [Channel Verified ✓]';
            setTimeout(() => {
                msg.style.color = '#f1f5f9';
                msg.innerText = 'Ready to collaborate 🚀';
            }, 3000);
        }
    });
}


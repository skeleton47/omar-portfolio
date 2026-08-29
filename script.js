/**
 * OMAR.SEC - Interactive Cyber Features & Dynamic Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    initCyberWave();
    initInteractiveTerminal();
    initNavEvents();
    initConnectTerminal();
    initDownloadCV();
    initSkillModal();
    initSocRadar();
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
                
                // Multi-layered cyber wave formula
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
   2. INTERACTIVE CYBER TERMINAL
   ========================================================================== */
function initInteractiveTerminal() {
    const termInput = document.getElementById('termInput');
    const termCursor = document.getElementById('termCursor');
    const dynamicLogs = document.getElementById('dynamicLogs');
    const terminalBody = document.getElementById('terminalBody');
    const terminalToggleBtn = document.getElementById('terminalToggleBtn');

    if (!termInput) return;

    // Synchronize visual cursor with input length & font metrics
    function updateCursorPosition() {
        const textLen = termInput.value.length;
        const charWidth = 8.8;
        termCursor.style.left = `${textLen * charWidth}px`;
    }

    termInput.addEventListener('input', updateCursorPosition);
    termInput.addEventListener('click', () => termInput.focus());

    // Keep focus when clicking anywhere inside the terminal body
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
            text: `Available commands:\n  • icpc        - What is ICPC & my competitive programming syllabus\n  • fortinet    - FortiSIEM & FortiAnalyzer certification details (NTI 2026)\n  • skills      - List Cybersecurity, .NET, React & Algorithm skills\n  • projects    - View security suites & engineering platforms\n  • exp         - View career history & ICPC coaching\n  • certs       - View Fortinet, NTI, ITI & CS50 credentials\n  • contact     - Show direct email, phone & LinkedIn\n  • clear       - Clear terminal history\n  • whoami      - Print current user identity\n  • matrix      - Trigger cyber matrix mode`
        }),
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
        'sudo': () => ({
            type: 'warn',
            text: `[!] Permission denied: Guest user does not have root privileges.`
        }),
        'date': () => ({
            type: 'default',
            text: new Date().toUTCString()
        }),
        'matrix': () => {
            triggerMatrixFlash();
            return {
                type: 'success',
                text: `[✓] System matrix mode initialized successfully.`
            };
        },
        'clear': () => {
            dynamicLogs.innerHTML = '';
            return null;
        }
    };


    // Process Command Enter
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

    function triggerMatrixFlash() {
        const body = document.body;
        body.style.filter = 'hue-rotate(90deg) contrast(1.2)';
        setTimeout(() => {
            body.style.filter = '';
        }, 1500);
    }
}


// Global utility helper
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


/* ==========================================================================
   3. NAVIGATION, SCROLL SPY & SCROLL EVENTS
   ========================================================================== */
function initNavEvents() {
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollIndicator = document.getElementById('scrollTrigger');
    const sections = document.querySelectorAll('main, section');

    // Scroll spy using IntersectionObserver
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

    // Scroll indicator click -> scroll to About section
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
   4. MINI CONNECT TERMINAL
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

/* ==========================================================================
   5. DOWNLOAD CV INTERACTION
   ========================================================================== */
function initDownloadCV() {
    const cvBtn = document.getElementById('downloadCvBtn');
    if (!cvBtn) return;

    cvBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
        alert("CV Download: You can download the latest CV from Omar's GitHub repository or contact directly at omar.sec@example.com");
    });
}

/* ==========================================================================
   6. FLOATING SKILL DETAIL MODAL ("صفحة عايمة عند الضغط على المهارات")
   ========================================================================== */
const skillsDatabase = {
    'fortinet': {
        icon: '<i class="fa-solid fa-shield-halved"></i>',
        category: 'Cybersecurity & SIEM',
        title: 'FortiSIEM & FortiAnalyzer',
        badge: 'NTI 2026 CERTIFIED // FORTINET',
        desc: 'Comprehensive training and real-world laboratory experience in enterprise SIEM deployment, multi-tenant log ingestion, security event correlation, and automated SOC incident mitigation.',
        capabilities: [
            'Configuring FortiSIEM rule-based & machine-learning threat correlation engines',
            'Centralized syslog management, log aggregation, and compliance reporting in FortiAnalyzer',
            'Cross-device event parsing, anomaly identification, and mitigation playbooks',
            '15+ Enterprise attack scenarios hardened across multi-vendor network fabrics'
        ],
        projects: [
            { name: 'FortiSIEM & FortiAnalyzer Security Suite', link: '#projects', sub: 'Enterprise SIEM & SOC defense lab (NTI 2026)' }
        ],
        tags: ['FortiSIEM', 'FortiAnalyzer', 'SIEM Correlation', 'SOC Operations', 'Syslog Parsing', 'Incident Response']
    },
    'network-sec': {
        icon: '<i class="fa-solid fa-network-wired"></i>',
        category: 'Cybersecurity & Network Defense',
        title: 'Network Security & Penetration Testing',
        badge: 'NTI CYBER HEROES 2025',
        desc: 'Hands-on network analysis, packet inspection, intrusion detection, and active vulnerability assessment across internal subnets and edge firewalls.',
        capabilities: [
            'Deep-packet inspection and protocol anomaly hunting with Wireshark',
            'Vulnerability scanning, exploitation frameworks, and payload analysis with Metasploit',
            'Enterprise network topology design, subnetting, and ACLs in Cisco Packet Tracer',
            'Virtual OS hardening, firewall rule filtering, and secure VPN routing'
        ],
        projects: [
            { name: 'Egypt Cyber Heroes Security Operations', link: '#experience', sub: 'Hands-on penetration testing & hardening' }
        ],
        tags: ['Wireshark', 'Metasploit', 'Packet Tracer', 'Network Hardening', 'Firewalls', 'VPNs', 'Nmap']
    },
    'dotnet': {
        icon: '<i class="fa-solid fa-code"></i>',
        category: 'Backend & Enterprise Architecture',
        title: 'C# & .NET 8/9 Enterprise Engineering',
        badge: 'ITI .NET TRACK 2026',
        desc: 'Architecting modular, secure, high-throughput RESTful Web APIs and scalable multi-tier web applications using Clean Architecture, CQRS, and Domain-Driven Design principles.',
        capabilities: [
            'Building RESTful APIs with ASP.NET Core 8/9, Dependency Injection & Middleware pipelines',
            'Implementing Clean Architecture, Repository & Unit of Work patterns',
            'Enterprise authentication & authorization with ASP.NET Core Identity & JWT',
            'Resilient database operations, SQL connection pooling, and retry policies'
        ],
        projects: [
            { name: 'Acolite — AI-Powered Freelance Hub', link: 'https://github.com/skeleton47/acolite.xyz_iti_.net', sub: 'ASP.NET Core 8 Web API, JWT, SignalR' },
            { name: 'MvcTask — Multi-Tier Management System', link: 'https://github.com/skeleton47/MvcTask', sub: 'C#, .NET 9, Service Layer pattern' }
        ],
        tags: ['C#', '.NET 8/9', 'ASP.NET Core Web API', 'ASP.NET Core MVC', 'Clean Architecture', 'JWT Auth', 'DI']
    },
    'icpc': {
        icon: '<i class="fa-solid fa-laptop-code"></i>',
        category: 'Competitive Programming & Algorithms',
        title: 'C++ & ICPC Algorithmic Coaching',
        badge: 'MASTER INSTRUCTOR // 50+ STUDENTS',
        desc: 'Advanced competitive programming instructor at Horus University, training collegiate teams in complex algorithms, optimal data structures, and mathematical problem-solving under extreme time constraints.',
        capabilities: [
            'Advanced Data Structures: Segment Trees with Lazy Propagation, Fenwick Trees, DSU, Trie',
            'Graph Theory: Dijkstra, Bellman-Ford, Floyd-Warshall, Kruskal, Prim, BFS/DFS, TopoSort',
            'Dynamic Programming: 1D/2D DP, DP with Bitmasking, Space & Time Complexity Optimization',
            'Mentored 50+ students for national qualifiers (ECPC) and authored mock competition sets'
        ],
        projects: [
            { name: 'Horus University ICPC Training Program', link: '#icpc-section', sub: 'Curriculum & Problem Sets authored by Omar' }
        ],
        tags: ['C++', 'Segment Trees', 'Graph Theory', 'Dynamic Programming', 'DSU', 'Time Complexity O(N log N)', 'ICPC']
    },
    'react': {
        icon: '<i class="fa-brands fa-react"></i>',
        category: 'Frontend & UI Engineering',
        title: 'React 18 & TypeScript Development',
        badge: 'MODERN SPA & RESPONSIVE UI',
        desc: 'Crafting responsive, type-safe, component-driven Single Page Applications with React 18, TypeScript, Tailwind CSS, and clean state management.',
        capabilities: [
            'Component architecture, custom hooks, and React 18 concurrent rendering',
            'Strict type-safety with TypeScript, avoiding runtime type issues',
            'Responsive cyberpunk and dark-mode styling with Tailwind CSS & CSS Grid',
            'Optimized client-side caching, Axios interceptors, and JWT token refresh flows'
        ],
        projects: [
            { name: 'Acolite Frontend Platform', link: 'https://acolite.xyz', sub: 'React 18, TypeScript, Tailwind CSS' }
        ],
        tags: ['React 18', 'TypeScript', 'Tailwind CSS', 'State Management', 'Axios', 'Responsive Design']
    },
    'sql': {
        icon: '<i class="fa-solid fa-database"></i>',
        category: 'Database & ORM Systems',
        title: 'SQL Server & Entity Framework Core',
        badge: 'RELATIONAL DATA & ORM OPTIMIZATION',
        desc: 'Designing normalized relational databases, executing complex LINQ queries, schema migrations, and configuring EF Core resilience for high-load workloads.',
        capabilities: [
            'Database schema normalization, indexing strategies, and foreign key integrity',
            'Entity Framework Core Code-First migrations, fluent API configurations & shadow properties',
            'High-performance querying with LINQ, eager/lazy loading optimizations, and AsNoTracking',
            'Connection resiliency, execution strategies, and SQL Server transaction management'
        ],
        projects: [
            { name: 'Acolite Relational Database Schema', link: 'https://github.com/skeleton47/acolite.xyz_iti_.net', sub: 'SQL Server + EF Core Migrations' },
            { name: 'MvcTask Academic DB', link: 'https://github.com/skeleton47/MvcTask', sub: 'Multi-table relational schema' }
        ],
        tags: ['SQL Server', 'EF Core', 'LINQ', 'Migrations', 'Database Normalization', 'Transactions']
    },
    'gemini-ai': {
        icon: '<i class="fa-solid fa-brain"></i>',
        category: 'Artificial Intelligence & LLM Integration',
        title: 'Google Gemini AI & LLM Workflows',
        badge: 'SEMANTIC AUTOMATION & PROMPT ENG',
        desc: 'Integrating state-of-the-art Large Language Models into enterprise web backends for automated text analysis, resume evaluation, semantic matchmaking, and conversational agents.',
        capabilities: [
            'API integration with Google Gemini Pro / Flash models in .NET backends',
            'Few-shot prompt engineering and structured JSON response enforcement',
            'Automated applicant matching: scoring candidate skills against client project requirements',
            'Secure API key management and token rate-limiting mechanisms'
        ],
        projects: [
            { name: 'Acolite AI Recruiter & Semantic Matcher', link: 'https://acolite.xyz', sub: 'Google Gemini AI candidate scoring engine' }
        ],
        tags: ['Google Gemini AI', 'Prompt Engineering', 'LLM Integration', 'Semantic Matchmaking', 'JSON Schema']
    },
    'signalr': {
        icon: '<i class="fa-solid fa-tower-broadcast"></i>',
        category: 'Real-Time Systems & WebSockets',
        title: 'SignalR & Real-Time Communication',
        badge: 'WEBSOCKETS & LIVE STREAMING',
        desc: 'Building instant bi-directional messaging, live notifications, real-time telemetry streaming, and collaborative multi-user experiences in ASP.NET Core.',
        capabilities: [
            'Configuring ASP.NET Core SignalR Hubs with WebSockets, SSE & Long Polling fallbacks',
            'User-to-user and group-based message broadcasting with JWT authorization',
            'Live chat, real-time proposal notifications, and online presence indicators',
            'Reconnection handlers and client-side SignalR JavaScript SDK lifecycle management'
        ],
        projects: [
            { name: 'Acolite Real-Time Chat & Proposal Hub', link: 'https://github.com/skeleton47/acolite.xyz_iti_.net', sub: 'SignalR instant client-freelancer messaging' }
        ],
        tags: ['SignalR', 'WebSockets', 'Real-Time Chat', 'Presence Detection', 'Hubs', 'Broadcasting']
    }
};

// Global Modal Controller
function openSkillModal(skillId) {
    if (!skillId) skillId = 'fortinet';
    const modalBackdrop = document.getElementById('skillModalBackdrop');
    if (!modalBackdrop) return;

    const data = skillsDatabase[skillId];
    if (!data) return;

    const modalIcon = document.getElementById('skillModalIcon');
    const modalCat = document.getElementById('skillModalCat');
    const modalTitle = document.getElementById('skillModalTitle');
    const modalBadge = document.getElementById('skillModalBadge');
    const modalDesc = document.getElementById('skillModalDesc');
    const modalList = document.getElementById('skillModalList');
    const modalProjects = document.getElementById('skillModalProjects');
    const modalTags = document.getElementById('skillModalTags');

    if (modalIcon) modalIcon.innerHTML = data.icon;
    if (modalCat) modalCat.textContent = data.category;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalBadge) modalBadge.textContent = data.badge;
    if (modalDesc) modalDesc.textContent = data.desc;

    // Populate capabilities
    if (modalList) {
        modalList.innerHTML = data.capabilities
            .map(cap => `<li><i class="fa-solid fa-check text-green"></i> <span>${escapeHtml(cap)}</span></li>`)
            .join('');
    }

    // Populate projects
    if (modalProjects) {
        modalProjects.innerHTML = data.projects
            .map(p => `
                <a href="${p.link}" target="_blank" class="skill-modal-project-link">
                    <i class="fa-solid fa-arrow-up-right-from-square text-green"></i>
                    <div>
                        <strong>${escapeHtml(p.name)}</strong>
                        <div style="font-size: 0.72rem; color: #94a3b8;">${escapeHtml(p.sub)}</div>
                    </div>
                </a>
            `).join('');
    }

    // Populate tags
    if (modalTags) {
        modalTags.innerHTML = data.tags
            .map(tag => `<span class="tag">${escapeHtml(tag)}</span>`)
            .join('');
    }

    // Update active tab buttons inside modal
    const tabButtons = document.querySelectorAll('.skill-tab-btn');
    tabButtons.forEach(btn => {
        if (btn.getAttribute('data-tab') === skillId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSkillModal() {
    const modalBackdrop = document.getElementById('skillModalBackdrop');
    if (modalBackdrop) {
        modalBackdrop.classList.remove('active');
    }
    document.body.style.overflow = '';
}

// Expose on window
window.openSkillModal = openSkillModal;
window.closeSkillModal = closeSkillModal;

function initSkillModal() {
    const modalBackdrop = document.getElementById('skillModalBackdrop');
    const closeBtn = document.getElementById('skillModalCloseBtn');
    const closeFooterBtn = document.getElementById('skillModalCloseFooterBtn');
    const skillCards = document.querySelectorAll('.skill-card');

    if (!modalBackdrop) return;

    // Attach click to all skill cards
    skillCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const skillId = card.getAttribute('data-skill-id');
            if (skillId) {
                openSkillModal(skillId);
            }
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeSkillModal);
    if (closeFooterBtn) closeFooterBtn.addEventListener('click', closeSkillModal);

    // Close on backdrop click
    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
            closeSkillModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
            closeSkillModal();
        }
    });
}

/* ==========================================================================
   7. REALISTIC TACTICAL SOC RADAR (Canvas 60 FPS Engine)
   ========================================================================== */
function initSocRadar() {
    const canvas = document.getElementById('socRadarCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = width / 2 - 5;

    let sweepAngle = 0;
    const bearingEl = document.getElementById('radarBearingVal');
    const tpsEl = document.getElementById('radarTpsVal');

    // Targets on the tactical radar scope (polar coordinates: r is radius fraction, theta is angle)
    const targets = [
        { r: 0.68, theta: 0.85, label: '10.0.0.1', intensity: 0, ripples: [] },
        { r: 0.42, theta: 3.40, label: '192.168.1.105', intensity: 0, ripples: [] },
        { r: 0.78, theta: 5.15, label: 'PORT 443', intensity: 0, ripples: [] }
    ];

    let lastTime = performance.now();

    function renderRadar(currentTime) {
        const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
        lastTime = currentTime;

        // Advance sweep angle (~2.2s per 360° rotation)
        sweepAngle = (sweepAngle + delta * 2.8) % (Math.PI * 2);

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // 1. Dark CRT Oscilloscope Background
        const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        bgGrad.addColorStop(0, 'rgba(0, 32, 16, 0.96)');
        bgGrad.addColorStop(0.75, 'rgba(1, 16, 12, 0.98)');
        bgGrad.addColorStop(1, 'rgba(0, 6, 6, 1)');
        ctx.fillStyle = bgGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        // 2. Tactical Concentric Range Rings
        ctx.lineWidth = 1;
        const ringFractions = [0.33, 0.66, 1.0];
        ringFractions.forEach((f, idx) => {
            ctx.beginPath();
            ctx.strokeStyle = idx === 2 ? 'rgba(0, 255, 102, 0.55)' : (idx === 1 ? 'rgba(0, 255, 102, 0.28)' : 'rgba(0, 255, 102, 0.18)');
            if (idx === 1) {
                ctx.setLineDash([3, 3]);
            } else {
                ctx.setLineDash([]);
            }
            ctx.arc(cx, cy, radius * f, 0, Math.PI * 2);
            ctx.stroke();
        });
        ctx.setLineDash([]);

        // 3. Crosshair Axes & Degree Cardinal Ticks
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 255, 102, 0.22)';
        ctx.lineWidth = 0.8;
        // Horizontal
        ctx.moveTo(cx - radius, cy);
        ctx.lineTo(cx + radius, cy);
        // Vertical
        ctx.moveTo(cx, cy - radius);
        ctx.lineTo(cx, cy + radius);
        // Diagonal 45 deg lines
        ctx.moveTo(cx - radius * 0.7, cy - radius * 0.7);
        ctx.lineTo(cx + radius * 0.7, cy + radius * 0.7);
        ctx.moveTo(cx - radius * 0.7, cy + radius * 0.7);
        ctx.lineTo(cx + radius * 0.7, cy - radius * 0.7);
        ctx.stroke();

        // Degree ticks on outer rim
        ctx.strokeStyle = 'rgba(0, 255, 102, 0.45)';
        for (let i = 0; i < 12; i++) {
            const tickAngle = (i * Math.PI) / 6;
            const innerR = radius - 3.5;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(tickAngle) * innerR, cy + Math.sin(tickAngle) * innerR);
            ctx.lineTo(cx + Math.cos(tickAngle) * radius, cy + Math.sin(tickAngle) * radius);
            ctx.stroke();
        }

        // 4. Phosphor Sweep Sector (Realistic Smooth Exponential Decay)
        const sweepSpan = Math.PI * 0.4; // ~72 degree phosphor tail
        const steps = 28;
        for (let s = 0; s < steps; s++) {
            const frac = s / steps;
            const startA = sweepAngle - sweepSpan * (1 - frac);
            const endA = sweepAngle - sweepSpan * (1 - (s + 1) / steps);
            const alpha = Math.pow(frac, 2.8) * 0.42;

            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, radius, startA, endA);
            ctx.closePath();
            ctx.fillStyle = `rgba(0, 255, 102, ${alpha})`;
            ctx.fill();
        }

        // 5. Bright Leading Sweep Beam Laser Line
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        const sweepX = cx + Math.cos(sweepAngle) * radius;
        const sweepY = cy + Math.sin(sweepAngle) * radius;
        ctx.lineTo(sweepX, sweepY);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#00ff66';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // 6. Interactive Target Blips (Trigger on sweep pass + Sonar Waves)
        targets.forEach((tgt) => {
            const tx = cx + Math.cos(tgt.theta) * (radius * tgt.r);
            const ty = cy + Math.sin(tgt.theta) * (radius * tgt.r);

            // Compute angular distance from sweep beam
            let diff = sweepAngle - tgt.theta;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;

            // Trigger when sweep line passes over target
            if (diff >= 0 && diff < 0.14 && tgt.intensity < 0.3) {
                tgt.intensity = 1.0;
                tgt.ripples.push({ r: 2, alpha: 0.9 });
            }

            // Decay intensity over time
            tgt.intensity = Math.max(0.12, tgt.intensity - delta * 0.75);

            // Render Expanding Sonar Ping Ripples
            for (let i = tgt.ripples.length - 1; i >= 0; i--) {
                const rip = tgt.ripples[i];
                rip.r += delta * 20;
                rip.alpha -= delta * 1.3;

                if (rip.alpha <= 0 || rip.r > 15) {
                    tgt.ripples.splice(i, 1);
                } else {
                    ctx.beginPath();
                    ctx.arc(tx, ty, rip.r, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(0, 255, 102, ${rip.alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            // Render Target Dot
            ctx.beginPath();
            ctx.arc(tx, ty, tgt.intensity > 0.5 ? 2.6 : 1.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 255, 102, ${Math.min(1, tgt.intensity + 0.25)})`;
            ctx.shadowColor = '#00ff66';
            ctx.shadowBlur = tgt.intensity > 0.5 ? 8 : 2;
            ctx.fill();
            ctx.shadowBlur = 0;

            // If active, render small target brackets
            if (tgt.intensity > 0.5) {
                ctx.strokeStyle = `rgba(0, 255, 102, ${tgt.intensity * 0.8})`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(tx - 3.5, ty); ctx.lineTo(tx + 3.5, ty);
                ctx.moveTo(tx, ty - 3.5); ctx.lineTo(tx, ty + 3.5);
                ctx.stroke();
            }
        });

        // 7. Center SOC Node Blip
        ctx.beginPath();
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#00ff66';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // 8. Update HUD Metrics smoothly
        if (bearingEl) {
            const degrees = Math.floor((sweepAngle * 180 / Math.PI)) % 360;
            bearingEl.textContent = `${degrees.toString().padStart(3, '0')}° LIVE`;
        }
        if (tpsEl && Math.random() < 0.05) {
            const tps = (1.2 + Math.sin(currentTime * 0.002) * 0.15).toFixed(1);
            tpsEl.textContent = `${tps} k/s`;
        }

        requestAnimationFrame(renderRadar);
    }

    requestAnimationFrame(renderRadar);
}





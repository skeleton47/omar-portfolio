/**
 * OMAR.SEC - Interactive Cyber Features & Dynamic Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    initCyberWave();
    initInteractiveTerminal();
    initNavEvents();
    initConnectTerminal();
    initDownloadCV();
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
            text: `Available commands:\n  • about       - Display bio & information\n  • skills      - List core .NET, React & Security skills\n  • projects    - View featured engineering projects (Acolite, MvcTask)\n  • exp         - View career history & ICPC coaching\n  • certs       - View certifications & education\n  • contact     - Show direct email, phone & LinkedIn\n  • clear       - Clear terminal history\n  • whoami      - Print current user identity\n  • matrix      - Trigger cyber matrix mode`
        }),
        'about': () => ({
            type: 'default',
            text: `Omar Hisham Mohamed Elshayal\nFull-Stack .NET Developer | Intelligent Cybersecurity Undergrad @ Horus University (GPA 3.02)\nICPC Instructor mentoring 50+ students in C++ & algorithms.`
        }),
        'cat about_me.txt': () => ({
            type: 'default',
            text: `Name       : Omar Hisham Mohamed Elshayal\nRole       : Full-Stack .NET Developer | ICPC Instructor\nEducation  : B.Sc. Intelligent Cybersecurity @ Horus University (GPA 3.02)\nFocus      : C#, .NET 8/9, ASP.NET Core, React, AI Integration, Network Security\nLocation   : New Damietta, Damietta, Egypt\nLeadership : Trained 50+ students for national ICPC qualifiers\nMission    : Secure today, architect for scale tomorrow.`
        }),
        'skills': () => ({
            type: 'success',
            text: `[+] Backend & .NET : C#, .NET 8/9, ASP.NET Core (Web API & MVC), EF Core, LINQ, SignalR, JWT, DI\n[+] Frontend       : React.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Bootstrap\n[+] Languages      : C#, C++, Python, JavaScript, TypeScript, SQL, Java, C\n[+] Databases/Cloud: SQL Server, EF Migrations, Docker, Railway, Vercel, Postman, Git\n[+] Security       : Network Security, Wireshark, Metasploit, Cisco Packet Tracer, Linux Hardening`
        }),
        'projects': () => ({
            type: 'success',
            text: `1. Acolite  - Full-Stack AI Freelance Platform (C#, .NET 8, React, TypeScript, Gemini AI, SignalR)\n              Live: https://acolite.xyz | Repo: github.com/skeleton47/acolite.xyz_iti_.net\n2. MvcTask  - Multi-tier ASP.NET Core MVC Management System (C#, .NET 9, EF Core, SQL Server)\n              Repo: github.com/skeleton47/MvcTask\n3. CyberLab - Network Hardening & Packet Inspection Suite (Wireshark, Metasploit, NTI Cyber Heroes)`
        }),
        'experience': () => ({
            type: 'default',
            text: `• ICPC Instructor — Horus University (Sep 2025 – Present): Trained 50+ students in C++ algorithms.\n• Cybersecurity Trainee — NTI / MCIT (Aug 2025): Egypt Cyber Heroes network & penetration testing.\n• Full-Stack .NET Track — ITI (2026): Clean Architecture & enterprise web apps.\n• AI Workshop — Arab Media Creativity Summit (Aug 2025): Machine learning workflows.`
        }),
        'exp': () => commands['experience'](),
        'certs': () => ({
            type: 'success',
            text: `[✓] Egypt Cyber Heroes Program — NTI / MCIT (2025)\n[✓] Full-Stack .NET Track Certificate — Information Technology Institute (ITI) (2026)\n[✓] Entrepreneurship & Innovation Certificate — Horus University (2025)\n[✓] CS50: Introduction to Computer Science — Harvard University`
        }),
        'contact': () => ({
            type: 'default',
            text: `Email   : weo11288@gmail.com\nPhone   : +20 127 975 2075\nLocation: New Damietta, Damietta, Egypt\nGitHub  : github.com/skeleton47\nLinkedIn: linkedin.com/in/omar-hisham-mohamed-elshayal-957696355/`
        }),
        'whoami': () => ({
            type: 'success',
            text: `omar@portfolio:~$ (Omar Hisham Elshayal - Full-Stack .NET Developer & Cybersecurity Engineer)`
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

    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function triggerMatrixFlash() {
        const body = document.body;
        body.style.filter = 'hue-rotate(90deg) contrast(1.2)';
        setTimeout(() => {
            body.style.filter = '';
        }, 1500);
    }
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


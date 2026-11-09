// Script Interativo - Ryan Oliveira Personal Trainer

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar Ícones Lucide
    initLucide();

    // 2. Menu Mobile
    initMobileMenu();

    // 3. Calculadora Fitness Completa
    initCalculator();

    // 4. FAQ Accordion
    initFAQ();

    // 5. Suporte a Links Internos com Offset do Header
    initSmoothScroll();
});

// Inicialização segura dos ícones Lucide
function initLucide() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// Controle do Menu Mobile (robusto com suporte a click-outside e troca de ícone)
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOpenIcon = document.getElementById('menuOpenIcon');
    const menuCloseIcon = document.getElementById('menuCloseIcon');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (!mobileMenuBtn || !mobileMenu) return;

    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = !mobileMenu.classList.contains('hidden');
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Fechar ao clicar fora do menu
    document.addEventListener('click', (e) => {
        if (!mobileMenu.classList.contains('hidden')) {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });

    function openMobileMenu() {
        mobileMenu.classList.remove('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        if (menuOpenIcon && menuCloseIcon) {
            menuOpenIcon.classList.add('hidden');
            menuCloseIcon.classList.remove('hidden');
        }
    }

    function closeMobileMenu() {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        if (menuOpenIcon && menuCloseIcon) {
            menuOpenIcon.classList.remove('hidden');
            menuCloseIcon.classList.add('hidden');
        }
    }
}

// Calculadora Fitness Completa (IMC, TMB, TDEE, Água e CTA WhatsApp)
function initCalculator() {
    const calcForm = document.getElementById('calcForm');
    const calcResults = document.getElementById('calcResults');

    if (!calcForm || !calcResults) return;

    calcForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const weightInput = document.getElementById('inputWeight');
        const heightInput = document.getElementById('inputHeight');
        const ageInput = document.getElementById('inputAge');
        const genderInput = document.getElementById('inputGender');
        const activityInput = document.getElementById('inputActivity');
        const goalInput = document.getElementById('inputGoal');

        const weight = parseFloat(weightInput.value);
        const height = parseFloat(heightInput.value);
        const age = parseInt(ageInput.value, 10);
        const gender = genderInput.value;
        const activity = parseFloat(activityInput.value) || 1.375;
        const goal = goalInput ? goalInput.value : 'fat_loss';

        // Validação de segurança dos limites
        if (weight >= 30 && weight <= 300 && height >= 100 && height <= 250 && age >= 12 && age <= 100) {
            // 1. Cálculo de IMC
            const heightM = height / 100;
            const imc = parseFloat((weight / (heightM * heightM)).toFixed(1));

            // Classificação de IMC
            let imcStatus = 'Peso Saudável';
            let imcColorClass = 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40';

            if (imc < 18.5) {
                imcStatus = 'Abaixo do peso';
                imcColorClass = 'text-amber-400 border-amber-500/30 bg-amber-950/40';
            } else if (imc >= 18.5 && imc <= 24.9) {
                imcStatus = 'Peso Saudável';
                imcColorClass = 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40';
            } else if (imc >= 25.0 && imc <= 29.9) {
                imcStatus = 'Sobrepeso';
                imcColorClass = 'text-yellow-400 border-yellow-500/30 bg-yellow-950/40';
            } else {
                imcStatus = 'Obesidade';
                imcColorClass = 'text-rose-400 border-rose-500/30 bg-rose-950/40';
            }

            // 2. Cálculo de TMB (Fórmula de Mifflin-St Jeor)
            let bmr = 10 * weight + 6.25 * height - 5 * age;
            if (gender === 'male') {
                bmr += 5;
            } else {
                bmr -= 161;
            }
            bmr = Math.round(bmr);

            // 3. Gasto Energético Total Diário (TDEE)
            const tdee = Math.round(bmr * activity);

            // 4. Meta Calórica e Proteica de acordo com o Objetivo
            let targetCal = tdee;
            let targetCalBadge = 'Manutenção';
            let targetCalClass = 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40';
            let goalTitle = 'Definição & Manutenção';
            let proteinPerKg = 1.8;

            if (goal === 'fat_loss') {
                targetCal = Math.max(1200, Math.round(tdee - 450));
                targetCalBadge = 'Déficit (-450 kcal)';
                targetCalClass = 'text-amber-400 border-amber-500/30 bg-amber-950/40';
                goalTitle = 'Emagrecimento & Queima de Gordura';
                proteinPerKg = 2.2;
            } else if (goal === 'hypertrophy') {
                targetCal = Math.round(tdee + 350);
                targetCalBadge = 'Superávit (+350 kcal)';
                targetCalClass = 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40';
                goalTitle = 'Hipertrofia & Ganho de Massa Muscular';
                proteinPerKg = 2.0;
            }

            const proteinG = Math.round(weight * proteinPerKg);

            // 5. Meta de Água (35ml/kg)
            const waterL = ((weight * 35) / 1000).toFixed(1);

            // 6. Estimativa Científica de Tempo e Resultado (Fase 4)
            let timelineBadge = 'Definição & Firmeza';
            let timelineTitle = 'Estimativa de Recomposição Corporal';
            let timelineDesc = 'Consumindo o equivalente ao seu gasto calórico com alto aporte de proteína, seu corpo queima gordura residual enquanto tonifica e densifica a musculatura existente.';
            let timelineMetric = 'Tonificação';
            let timelineSub = 'Mais definição e tônus';
            let timelineWAPreview = 'Recomposição corporal e tônus muscular';

            if (goal === 'fat_loss') {
                timelineBadge = 'Queima Acelerada & Segura';
                timelineTitle = 'Estimativa de Perda de Gordura';
                timelineDesc = 'Mantendo o déficit calórico de 450 kcal e treinando com regularidade, a estimativa fisiológica é eliminar entre 1,5 kg e 2 kg de gordura pura por mês, preservando sua massa magra e sem efeito sanfona.';
                timelineMetric = '-1,5 a -2,0 kg/mês';
                timelineSub = 'Gordura pura eliminada';
                timelineWAPreview = 'Eliminar 1,5 kg a 2,0 kg de gordura/mês';
            } else if (goal === 'hypertrophy') {
                timelineBadge = 'Construção Muscular Limpa';
                timelineTitle = 'Estimativa de Ganho de Massa Muscular';
                timelineDesc = 'Com o superávit calórico controlado de 350 kcal e progressão de cargas planejada, sua taxa estimada é de 0,8 kg a 1,5 kg de massa magra por mês, com mínimo acúmulo de gordura corporal.';
                timelineMetric = '+0,8 a +1,5 kg/mês';
                timelineSub = 'Massa magra construída';
                timelineWAPreview = 'Ganhar 0,8 kg a 1,5 kg de massa magra/mês';
            }

            // 7. Atualização da Interface
            document.getElementById('resIMC').textContent = imc.toString();
            
            const imcBadge = document.getElementById('resIMCBadge');
            if (imcBadge) {
                imcBadge.textContent = imcStatus;
                imcBadge.className = `inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 ${imcColorClass}`;
            }

            document.getElementById('resBMR').textContent = `${bmr} kcal`;
            document.getElementById('resTDEE').textContent = `${tdee} kcal`;

            const targetCalEl = document.getElementById('resTargetCal');
            if (targetCalEl) targetCalEl.textContent = `${targetCal} kcal`;

            const targetCalBadgeEl = document.getElementById('resTargetCalBadge');
            if (targetCalBadgeEl) {
                targetCalBadgeEl.textContent = targetCalBadge;
                targetCalBadgeEl.className = `inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 ${targetCalClass}`;
            }

            const proteinEl = document.getElementById('resProtein');
            if (proteinEl) proteinEl.textContent = `${proteinG} g/dia`;

            document.getElementById('resWater').textContent = `${waterL} L/dia`;

            // Atualização do Box de Estimativa de Resultado
            const badgeEl = document.getElementById('resTimelineBadge');
            if (badgeEl) badgeEl.textContent = timelineBadge;

            const titleEl = document.getElementById('resTimelineTitle');
            if (titleEl) titleEl.textContent = timelineTitle;

            const descEl = document.getElementById('resTimelineDesc');
            if (descEl) descEl.textContent = timelineDesc;

            const metricEl = document.getElementById('resTimelineMetric');
            if (metricEl) metricEl.textContent = timelineMetric;

            const subEl = document.getElementById('resTimelineSub');
            if (subEl) subEl.textContent = timelineSub;

            // 8. Atualização dinâmica do botão de WhatsApp com todas as metas
            const sendBtn = document.getElementById('btnSendResultsWhatsApp');
            if (sendBtn) {
                const phone = '5511997433402';
                const message = encodeURIComponent(
                    `Olá Ryan! Fiz a simulação no seu site e gostaria de uma orientação personalizada para o meu perfil:\n` +
                    `• Objetivo: ${goalTitle}\n` +
                    `• Peso: ${weight} kg | Altura: ${height} cm | Idade: ${age} anos\n` +
                    `• IMC: ${imc} (${imcStatus})\n` +
                    `• Gasto Estimado (TDEE): ~${tdee} kcal/dia\n` +
                    `• Meta Calórica Recomendada: ~${targetCal} kcal/dia (${targetCalBadge})\n` +
                    `• Estimativa de Evolução: ${timelineWAPreview}\n` +
                    `• Meta de Proteína: ~${proteinG}g/dia\n` +
                    `• Meta de Água: ${waterL} L/dia\n\n` +
                    `Quero saber como funciona o seu acompanhamento para atingir meus objetivos!`
                );
                sendBtn.href = `https://wa.me/${phone}?text=${message}`;
            }

            // Mostrar card de resultados com transição suave
            calcResults.classList.remove('hidden');
            initLucide();

            // Scroll suave até os resultados
            calcResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            calcForm.reportValidity();
        }
    });
}

// Accordion de FAQ (Perguntas Frequentes) com suporte a acessibilidade
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (!questionBtn || !answer) return;

        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Fechar outros itens abertos para manter a leitura limpa
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherBtn = otherItem.querySelector('.faq-question');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                    if (otherAnswer) otherAnswer.classList.remove('open');
                }
            });

            // Toggle no item clicado
            if (isActive) {
                item.classList.remove('active');
                questionBtn.setAttribute('aria-expanded', 'false');
                answer.classList.remove('open');
            } else {
                item.classList.add('active');
                questionBtn.setAttribute('aria-expanded', 'true');
                answer.classList.add('open');
            }
        });
    });
}

// Rolagem Suave com cálculo de compensação do Header Fixo
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const header = document.querySelector('header');
                const headerOffset = header ? header.offsetHeight : 72;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

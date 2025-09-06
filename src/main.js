class RevenueAllocationTool {
        constructor() {
                const viewportMeta = document.createElement('meta');
                viewportMeta.name = 'viewport';
                viewportMeta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
                document.head.appendChild(viewportMeta);
                this.totalRevenue = 0.001;
                this.isSliding = false;
                this.lockedSlider = null;
                this.annotationsSetup = false;
                this.chart = null;
                this.percentages = {
                        climate: 33.33,
                        national: 33.33,
                        ekerosene: 33.34
                };
                const createColorVariants = (r, g, b, lightText = false) => {
                        const textRgb = lightText ? '255, 255, 255' : '0, 0, 0';

                        return {
                                base: `rgba(${r}, ${g}, ${b}, 1)`,
                                active: `rgba(${r}, ${g}, ${b}, 0.9)`,
                                inactive: `rgba(${r}, ${g}, ${b}, 0.4)`,
                                text: {
                                        active: `rgba(${textRgb}, 0.9)`,
                                        inactive: `rgba(${textRgb}, 0.4)`
                                }
                        }
                };

                this.colors = {
                        climate: createColorVariants(79, 171, 112),
                        national: createColorVariants(255, 150, 117),
                        ekerosene: createColorVariants(28, 59, 56, true),
                        historical: createColorVariants(250, 232, 217),
                        other: createColorVariants(250, 232, 217)
                };

                this.revenueData = {
                        'extra-eea': {
                                title: 'Extra-EEA CO<sub>2</sub> emissions',
                                value: 25.6,
                                infoCategory: 'extraEea'
                        },
                        'non-co2-emissions': {
                                title: 'Non-CO<sub>2</sub> emissions',
                                value: 28.9,
                                infoCategory: 'nonC02'
                        },
                        'free-allowances': {
                                title: 'Free allowances',
                                value: 8,
                                infoCategory: 'freeAllowances'
                        }
                };

                this.categoryData = {
                        climate: {
                                title: 'International climate finance',
                                color: this.colors.climate,
                                index: 0
                        },
                        national: {
                                title: 'National climate action',
                                color: this.colors.national,
                                index: 1
                        },
                        ekerosene: {
                                title: 'E-kerosene funding',
                                color: this.colors.ekerosene,
                                index: 2
                        }
                };

                this.annotationData = {
                        'annotation-climate-one': {
                                y: 55.2,
                                category: 'climate',
                                dataSet: '2012-2023',
                                displayText: '€55.2bn: 20% of annual climate finance goal agreed at COP29',
                                title: '€55.2bn is equivalent to 20% of the annual climate finance goal agreed at COP29',
                                content: 'In 2024, states at COP29 committed to deliver at least $300bn per year by 2035, mainly from developed countries, to support developing countries’ climate action, and a wider goal involving all actors to mobilise at least $1.3tn per year. This money would support developing countries’ reduce emissions, adapt to the adverse effects of climate change, and address the loss and damage caused by climate change.<<br><br>The aviation sector bears a historical responsibility for <a target="_blank" href=" https://ourworldindata.org/global-aviation-emissions">4% of global warming to date</a>. As such, it is right that it contributes to climate change adaptation and mitigation finance for climate vulnerable countries.<br><br>It is also in Europe’s best interest to mobilise international climate finance. Every 1tCO<sub>2</sub> emitted globally is projected to cause between $22.53 and $125.27 in damages within the EEA bloc (including Switzerland). By financing climate mitigation in developing countries, where it today costs less to abate carbon emissions, and thus reducing the climate impacts, developed countries can see a return on investment between 180.2% and 1457.2%.<br><br>This opportunity for the EU to contribute fairly and proportionately to the global goal of $1.3tn a year of climate finance to developing countries, as agreed at COP29, should not be missed. Mandating a proportion of revenue from aviation allowances to meet the EU’s climate finance goals from this global sector is only proportionate and fair, as well as likely to be well received by partner nations across the world.',
                                // footer: 'Learn more about how ETS revenues could support reaching international climate finance goals in the policy guide. [link to section in guide]'
                        },
                        'annotation-national-one': {
                                y: 42,
                                category: 'national',
                                dataSet: '2012-2023',
                                displayText: '€42bn: Two years of EU climate adaptation funding',
                                title: '€42bn could fund two years of EU climate adaptation',
                                content: 'Beyond reducing carbon emissions, a proportion of funds needs to be dedicated to strengthening Europe\'s resilience in the face of the adverse effects of climate crisis such as extreme weather events. If polluters do not pay for their pollution, it is inevitably the most vulnerable of the world, and of Europe, who will. Extreme climate and weather events caused <a target="_blank" href="https://www.eea.europa.eu/en/analysis/indicators/economic-losses-from-climate-related">€162bn in losses between 2021-23</a>, a figure that doesn\'t account for the hardship, sentimental and cultural loss also inflicted, nor social inequities exacerbated as a result. <br><br> The World Bank estimates that climate change adaptation will cost Europe between <a target="_blank" href="https://documents1.worldbank.org/curated/en/099050224072021662/pdf/P179070140a07209a1b5d012d978862b4ff.pdf">€15bn to €64bn</a> per year, with a central estimate of €21bn. EU Member States could use €42bn to fund national adaptation strategies across the EU for two years.',
                                // footer: 'Learn more about how EU Member States could use extra revenues to fund climate action in the policy guide. [link to section in guide]'
                        },
                        'annotation-ekerosene-one': {
                                y: 21.4,
                                category: 'ekerosene',
                                dataSet: '2012-2023',
                                displayText: '€21.4bn: Funds to fulfil ReFuelEU Aviation e-kerosene mandate until 2040',
                                title: '€21.4bn could be used to support e-kerosene producers to meet the ReFuelEU Aviation regulations',
                                content: 'Using €21.4bn of ETS revenues to support producers of e-kerosene, a renewable fuel of non-biological origin (RFNBO) made with green hydrogen, could close the price gap between fossil kerosene and enough e-kerosene to meet the ReFuelEU Aviation mandate until 2040. <a target="_blank" href=https://www.transportenvironment.org/uploads/files/ED18108-Support-Schemes-for-RFNBOS-in-Shipping-and-Aviation-FINAL_CLEAN.pdf>Research</a> conducted by Transport & Environment models that the cost of contracts for difference (CfDs) to cover 20% of this price gap for the amount of e-kerosene needed to meet the RFNBO sub-mandates of 1.2% of jet fuel demand by 2030 and 30% by 2050. <br><br> Despite having enough production capacity to fulfil this mandate, European e-kerosene producers are struggling to access investment due to unpredictable prices due to the technology’s nascency. CfDs create price predictability that de-risks e-kerosene projects and enables producers to access private investment. ',
                                // footer: 'Learn more about the support RFNBO producers need in the policy guide.[link to section in guide]'
                        },
                        'annotation-climate-two': {
                                y: 165.6,
                                category: 'climate',
                                dataSet: '2027-2035',
                                displayText: '€165.6bn: 60% of annual climate finance goal agreed at COP29',
                                title: '€165.6bn is equivalent to 70% of the annual climate finance goal agreed at COP29',
                                content: 'In 2024, states at COP29 committed to deliver at least $300bn per year by 2035, mainly from developed countries, to support developing countries’ climate action, and a wider goal involving all actors to mobilise at least $1.3tn per year. This money would support developing countries’ reduce emissions, adapt to the adverse effects of climate change, and address the loss and damage caused by climate change.<br><br>The aviation sector bears a historical responsibility for <a target="_blank" href=" https://ourworldindata.org/global-aviation-emissions">4% of global warming to date</a>. As such, it is right that it contributes to climate change adaptation and mitigation finance for climate vulnerable countries.<br><br>It is also in Europe’s best interest to mobilise international climate finance. Every 1tCO<sub>2</sub> emitted globally is projected to cause between $22.53 and $125.27 in damages within the EEA bloc (including Switzerland). By financing climate mitigation in developing countries, where it today costs less to abate carbon emissions, and thus reducing the climate impacts, developed countries can see a return on investment between 180.2% and 1457.2%.<br><br>This opportunity for the EU to contribute fairly and proportionately to the global goal of $1.3tn a year of climate finance to developing countries, as agreed at COP29, should not be missed. Mandating a proportion of revenue from aviation allowances to meet the EU’s climate finance goals from this global sector is only proportionate and fair, as well as likely to be well received by partner nations across the world.',
                                // footer: 'Learn more about how ETS revenues could support reaching international climate finance goals in the policy guide. [link to section in guide]'
                        },
                        'annotation-national-two': {
                                y: 126,
                                category: 'national',
                                dataSet: '2027-2035',
                                displayText: '€126bn: Six years of EU adaptation funding',
                                title: '€126bn could six seven years of EU climate adaptation',
                                content: 'Beyond reducing carbon emissions, a proportion of funds needs to be dedicated to strengthening Europe\'s resilience in the face of the adverse effects of climate crisis such as extreme weather events. If polluters do not pay for their pollution, it is inevitably the most vulnerable of the world, and of Europe, who will. Extreme climate and weather events caused <a target="_blank" href="https://www.eea.europa.eu/en/analysis/indicators/economic-losses-from-climate-related">€162bn in losses between 2021-23</a>, a figure that doesn\'t account for the hardship, sentimental and cultural loss also inflicted, nor social inequities exacerbated as a result. <br><br> The World Bank estimates that climate change adaptation will cost Europe between <a target="_blank" href="https://documents1.worldbank.org/curated/en/099050224072021662/pdf/P179070140a07209a1b5d012d978862b4ff.pdf">€15bn to €64bn</a> per year, with a central estimate of €21bn. EU Member States could use €168bn to fund national adaptation strategies across the EU for eight years.',
                                // footer: 'Learn more about how EU Member States could use extra revenues to fund climate action in the policy guide. [link to section in guide]'
                        },
                        'annotation-ekerosene-two': {
                                y: 100,
                                category: 'ekerosene',
                                dataSet: '2027-2035',
                                displayText: '€100bn: capital support for 50 e-kerosene plants (high estimate)',
                                title: '€100bn: up-front capital finance required for 50 commercial-scale e-kerosene plants (high estimate)',
                                content: 'High capital investment is a key barrier to expanding e-kerosene production in Europe. It’s estimated that a typical commercial-scale e-kerosene plant requires an <a target="_blank" href="https://www.transportenvironment.org/topics/planes/saf-observatory/spotlight-on-e-kerosene">upfront investment of between €1bn and €2bn</a>.<br><br>Currently, <a target="_blank" href=https://www.transportenvironment.org/topics/planes/saf-observatory/spotlight-on-e-kerosene">38 commercial-scale e-kerosene projects</a> have been announced in Europe between which aim to be operational from 2027 onwards. 50 such projects would require a total capital investment of between €50 and €100bn. ETS revenues generated by fairly pricing all of aviation’s emissions could be used to support schemes which help projects overcome these capital expenditure barriers, such as the <a target="_blank" href="https://commission.europa.eu/funding-tenders/find-funding/eu-funding-programmes/innovation-fund_en">EU\'s Innovation Fund</a>.'
                        },
                        'annotation-2012-2023': {
                                y: 69.5,
                                category: 'historical',
                                dataSet: '2027-2035',
                                displayText: '€69.5bn: ETS revenues lost 2012-2023'
                        },
                        'annotation-actual-revenues-2012-2023': {
                                y: 7,
                                category: 'historical',
                                dataSet: '2012-2023',
                                displayText: '€7bn: The actual ETS revenues generated from aviation, 2012-2023'
                        }
                };
                this.baseAnnotationStyle = {
                        borderWidth: 2,
                        borderColor: 'rgba(0, 0, 0, 3)',
                        opacity: 0.1,
                        strokeDashArray: 10,
                        label: {
                                offsetX: 80,
                                textAnchor: 'start',
                                borderColor: 'rgba(0, 0, 0, 1)',
                                style: {
                                        fontSize: '10px',
                                        fontWeight: 400,
                                        padding: { left: 6, right: 6, top: 2, bottom: 2 }
                                }
                        }
                };
                this.currentDataset = '2012-2023';
                this.datasets = {
                        '2012-2023': {
                                checkboxes: [
                                        { id: 'extra-eea', value: 25.6, label: 'Extra-EEA aviation', enabled: true },
                                        { id: 'non-co2-emissions', value: 28.9, label: 'Non-CO₂ emissions', enabled: true },
                                        { id: 'free-allowances', value: 8, label: 'Free allowances', enabled: true }
                                ],
                                yAxisMax: 70
                        },
                        '2027-2035': {
                                checkboxes: [
                                        { id: 'extra-eea', value: 79, label: 'Extra-EEA aviation', enabled: true },
                                        { id: 'non-co2-emissions', value: 91, label: 'Non-CO₂ emissions', enabled: true },
                                        { id: 'free-allowances', value: 0, label: 'Free allowances', enabled: false } // Greyed out
                                ],
                                yAxisMax: 180
                        }
                };
                this.infoIconSvg = `
                        <svg width="15" height="15" viewBox="0 0 750 750" fill="white">
                            <path d="M 375.244 258.657 C 363.564 258.657 353.970 255.153 346.463 248.141 C 338.951 241.133 335.197 232.289 335.197 221.609 C 335.197 210.922 338.951 202.156 346.463 195.313 C 353.970 188.469 363.564 185.047 375.244 185.047 C 386.931 185.047 396.529 188.469 404.041 195.313 C 411.549 202.156 415.307 210.922 415.307 221.609 C 415.307 232.289 411.549 241.133 404.041 248.141 C 396.529 255.153 386.931 258.657 375.244 258.657 Z M 343.197 545.578 L 343.197 297.219 L 407.291 297.219 L 407.291 545.578 Z"/>
                        </svg>
                    `;
                this.isDatasetToggleActive = false;
                this.currentStep = 0;
                this.tutorialSteps = [
                        {
                                type: 'introduction-modal',
                                title: 'Introduction to the EU aviation climate cost calculator',
                                content: 'For too long, the aviation sector has enjoyed a privileged policy framework at the expense of climate action.<br><br>This system has left masses of emissions unregulated and revenues uncollected.<br><br>Use this tool to see what aviation’s free passes have cost European climate action — and what’s at stake in the 2026 ETS Review.<br><br><em>Read the <a href="https://www.opportunitygreen.org/publication-policy-guide-eu-ets-aviation" target="_blank">Policy guide to the EU ETS for aviation</a> to learn more.</em>',
                                position: 'center'
                        },
                        {
                                type: 'highlight',
                                target: '.dataset-toggle-section',
                                title: 'Select time period',
                                content: 'In 2012 the EU Commission gave international aviation an exemption from the ETS, leaving tonnes of CO<sub>2</sub> emissions unregulated. In 2026 it has the chance to bring them into the ETS.<br><br>Click to see how much revenue was lost in 2012-2023 because of the exemption, and how much we\'re set to lose if the Commission does not decide to price emissions from international flights next year.',
                                position: 'right'
                        },
                        {
                                type: 'highlight',
                                target: '.checkbox-section',
                                title: 'Add revenue sources',
                                content: 'The aviation industry has not been paying the full price for its climate impacts.<br><br>Tick the boxes to decide which revenues you want to reallocate:<br><br><ul><li> Extra-EEA flights = The revenues that would have been collected if CO<sub>2</sub> emissions from flights departing the EEA were priced.</li><li>Non-CO<sub>2</sub> emissions = The revenues that would have been collected if non-CO<sub>2</sub> emissions, as well as CO<sub>2</sub> emissions, were priced.</li><li>Free allowances = The total worth of the ETS allowances that were allocated for free to aviation.</li></ul><br><br><em>Click the checkboxes to add revenue sources, and click the information icons to learn more.</em>',
                                position: 'right'
                        },
                        {
                                type: 'highlight',
                                target: '.slider-section',
                                title: 'Allocate revenues to different climate action purposes',
                                content: 'Now distribute revenues between climate action uses:<br><br><ul><li>International climate finance = Funding mitigation, adaptation and action to address loss and damage in developing and climate vulnerable countries.</li><li>National climate action = Funding mitigation and adaptation domestically in EU Member States.</li><li>E-kerosene funding = Supporting the aviation energy transition by developing e-kerosene made with renewable hydrogen, the aviation fuel with the lowest lifecycle emissions.</li></ul><br><br><em>Use the sliders and padlocks to distribute the revenues, and click the information icons to learn more.</em>',
                                position: 'right'
                        },
                        {
                                type: 'highlight',
                                target: '.center-panel',
                                title: 'See the climate costs of giving aviation a free pass',
                                content: 'Learn how much could have been achieved if pollution from EU flights had been fairly priced.',
                                position: 'left'
                        }
                ];
                this.isMobile = this.detectMobile();
                this.init();
        }

        init() {
                this.initChart();
                this.generateCheckboxSection();
                this.generateSliderSection();
                this.setupEventListeners();
                this.updateDisplay(); //change name to 'updateBars'?
                this.setupModal();
                this.updateChart();
                this.setupDatasetToggle();
                this.updateSliders();
                this.annotationsSetup = false;
                this.setupAnnotationStyles();
                this.updateCheckboxes();
                this.updateTotalRevenue();
                this.initTutorial();
        }

        detectMobile() {
                // Screen width check (adjust breakpoint as needed)
                const screenWidth = window.innerWidth <= 768;

                // User agent check for mobile devices
                const userAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

                // Touch capability check
                const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

                // Return true if any mobile indicator is present
                return screenWidth || userAgent || touchDevice;
        }

        initInfoIcons() {
                const iconSpans = document.querySelectorAll('.info-icon');
                iconSpans.forEach(iconSpan => {
                        iconSpan.innerHTML = this.infoIconSvg;
                });
        }

        initChart() {
                const options = {
                        chart: {
                                type: 'bar',
                                height: '100%',
                                width: '100%',
                                background: 'transparent',
                                fontFamily: "'DM Sans', sans-serif",
                                toolbar: { show: false },
                                zoom: { enabled: false },
                                animations: {
                                        enabled: false,
                                        animateGradually: { enabled: false },
                                        dynamicAnimation: { enabled: false }
                                },
                                events: {
                                        dataPointSelection: (event, chartContext, config) => {
                                                const dataPointIndex = config.dataPointIndex;
                                                const categories = Object.keys(this.categoryData);
                                                if (dataPointIndex < categories.length) {
                                                        this.openModal(categories[dataPointIndex]);
                                                }
                                        },
                                        dataPointMouseEnter: (event, chartContext, config) => {
                                                this.handleBarHover(config.dataPointIndex, true);
                                        },
                                        dataPointMouseLeave: (event, chartContext, config) => {
                                                this.handleBarHover(config.dataPointIndex, false);
                                        }
                                }
                        },
                        series: [{
                                name: 'Revenue',
                                type: 'bar',
                                data: Object.values(this.categoryData).map(category => ({
                                        x: category.title,
                                        y: 0
                                }))
                        }],
                        colors: [
                                this.colors.climate.base,
                                this.colors.national.base,
                                this.colors.ekerosene.base
                        ],
                        plotOptions: {
                                bar: {
                                        borderRadius: 0,
                                        horizontal: false,
                                        columnWidth: '40%',
                                        distributed: true,
                                        dataLabels: { position: 'top' },
                                }
                        },
                        stroke: {
                                width: 1.5,
                                colors: ['#000000', '#000000', '#000000']
                        },
                        dataLabels: {
                                enabled: true,
                                formatter: function (val, opt) {
                                        const dataPoint = opt.w.config.series[opt.seriesIndex].data[opt.dataPointIndex];
                                        let value = dataPoint.y || dataPoint || val;
                                        if (isNaN(value) || value === undefined || value === null) {
                                                value = 0;
                                        }
                                        return '€' + Number(value).toFixed(0) + 'bn';
                                },
                                style: { fontSize: '17px', fontWeight: 'normal', colors: ['#1c3b38'] },
                                offsetY: -34,
                                background: { enabled: false },
                                dropShadow: { enabled: false }
                        },
                        xaxis: {
                                labels: {
                                        style: { colors: '#1c3b38', fontSize: '15px', fontWeight: '600' }
                                },
                                axisBorder: { show: true, color: '#1c3b38' },
                                axisTicks: { show: false }
                        },
                        yaxis: {
                                title: {
                                        text: 'Revenue',
                                        offsetX: -10,
                                        style: { color: '#1c3b38', fontSize: '20px', fontWeight: '600' }
                                },
                                labels: {
                                        minWidth: 44,
                                        maxWidth: 44,
                                        style: { colors: '#1c3b38', fontSize: '11px', fontWeight: '500' },
                                        formatter: function (val) { return '€' + val + 'bn'; }
                                },
                                min: 0,
                                max: this.datasets[this.currentDataset].yAxisMax,
                                stepSize: this.currentDataset === '2012-2023' ? 10 : 40
                        },
                        grid: {
                                show: true,
                                borderColor: 'rgba(28, 59, 56, 0.1)',
                                strokeDashArray: 2,
                                position: 'back',
                                xaxis: { lines: { show: false } },
                                yaxis: { lines: { show: true } }
                        },
                        responsive: [{
                                breakpoint: 768,
                                options: {
                                        dataLabels: { style: { fontSize: '14px' } },
                                        xaxis: { labels: { style: { fontSize: '10px' } } }
                                }
                        }],
                        legend: { show: false },
                        tooltip: { enabled: false }
                };

                this.chart = new ApexCharts(document.querySelector("#chart"), options);
                this.chart.render();

                // Resize listener
                this.resizeTimeout = null;
                window.addEventListener('resize', () => {
                        clearTimeout(this.resizeTimeout);
                        this.resizeTimeout = setTimeout(() => {
                                this.handleResize();
                        }, 200);
                });

                // Listen for chart resize events
                this.chart.addEventListener('rendered', () => {
                        if (!this.annotationsSetup) {
                                this.setupAnnotationStyles();
                        }
                });
        }

        handleResize() {
                console.log('=== Resize Event Start ===');
                if (this.resizeTimeout) {
                        clearTimeout(this.resizeTimeout);
                }

                this.annotationsSetup = false;

                // Update chart annotations with proper sequencing
                requestAnimationFrame(() => {
                        this.updateChart();
                });
        }

        setupDatasetToggle() {
                // Create toggle HTML and insert it into your control panel
                const toggleHTML = `
                        <div class="dataset-toggle-section">
                            <span class="toggle-title">Time period<span class="info-icon" data-category="timePeriod"></span>
                            </span>
                            <div class="toggle-container">
                                <button class="toggle-btn ${this.currentDataset === '2012-2023' ? 'active' : ''}" 
                                        data-dataset="2012-2023">2012-2023</button>
                                <button class="toggle-btn ${this.currentDataset === '2027-2035' ? 'active' : ''}" 
                                        data-dataset="2027-2035">2027-2035</button>
                            </div>
                        </div>
                    `;

                // Insert before checkbox section
                const checkboxSection = document.querySelector('.checkbox-section');
                checkboxSection.insertAdjacentHTML('beforebegin', toggleHTML);

                // Add event listeners
                document.querySelectorAll('.toggle-btn').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                                this.switchDataset(e.target.dataset.dataset);
                        });
                });
        }

        switchDataset(datasetType) {
                if (this.currentDataset === datasetType) return;

                this.currentDataset = datasetType;

                this.isDatasetToggleActive = (datasetType === '2027-2035');

                // Update toggle button states
                document.querySelectorAll('.toggle-btn').forEach(btn => {
                        btn.classList.toggle('active', btn.dataset.dataset === datasetType);
                });

                this.updateCheckboxes();
                this.annotationsSetup = false;
                this.updateTotalRevenue();
                if (this.annotationsSetup) {
                        this.updateAnnotationOpacity();
                }

                const datasetText = document.getElementById('dataset-text');
                if (datasetText) {
                        datasetText.textContent = `Total available revenue (${datasetType})`;
                }
        }

        shouldShowForDataset(annotationType) {
                if (this.currentDataset === '2012-2023') {
                        if (this.annotationData[annotationType].dataSet === '2012-2023') return true;
                        if (this.annotationData[annotationType].dataSet === '2027-2035') return false;
                }

                if (this.currentDataset === '2027-2035') {
                        if (this.annotationData[annotationType].dataSet === '2012-2023') return false;
                        if (this.annotationData[annotationType].dataSet === '2027-2035') return true;
                }
        }

        generateCheckboxSection() {
                const container = document.querySelector('.checkbox-section');
                const title = container.querySelector('.checkbox-title');

                // Clear existing items but keep title
                container.innerHTML = '';
                container.appendChild(title);

                Object.entries(this.revenueData).forEach(([key, data]) => {
                        const item = document.createElement('div');
                        item.className = 'checkbox-item';
                        item.innerHTML = `
                            <div class="checkbox-label-wrapper">
                                <input type="checkbox" id="${key}" data-value="${data.value}">
                                <label for="${key}">${data.title}</label>
                            </div>
                            <span class="revenue-value" id="${key}-revenue">€${data.value}bn</span>
                            <span class="info-icon" data-category="${data.infoCategory}"></span>
                        `;
                        container.appendChild(item);
                });

                //Event listeners
                document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                        checkbox.addEventListener('change', (e) => {
                                this.updateTotalRevenue();

                                // Find the corresponding revenue-value span
                                const checkboxItem = e.target.closest('.checkbox-item');
                                const revenueValue = checkboxItem.querySelector('.revenue-value');

                                // Toggle opacity based on checkbox state
                                if (e.target.checked) {
                                        revenueValue.classList.add('checked');
                                } else {
                                        revenueValue.classList.remove('checked');
                                }
                        });
                });
        }

        updateCheckboxes() {
                const currentData = this.datasets[this.currentDataset];

                currentData.checkboxes.forEach(item => {
                        const checkbox = document.getElementById(item.id);
                        const label = document.querySelector(`label[for="${item.id}"]`);
                        const revenueSpan = document.getElementById(`${item.id}-revenue`);
                        const checkboxItem = checkbox.closest('.checkbox-item');

                        if (checkbox && label && revenueSpan) {
                                // Update value and label
                                checkbox.dataset.value = item.value;
                                revenueSpan.textContent = `€${item.value}bn`;

                                // Enable/disable checkbox
                                checkbox.disabled = !item.enabled;

                                // Grey out disabled items
                                if (item.enabled) {
                                        checkboxItem.classList.remove('disabled');
                                } else {
                                        checkboxItem.classList.add('disabled');
                                        checkbox.checked = false; // Uncheck disabled items
                                }
                        }
                });
        }

        handleBarHover(barIndex, isHovering) {
                if (!this.chart) return;

                const allBars = document.querySelectorAll('.apexcharts-bar-area');
                allBars.forEach((bar, index) => {
                        if (index !== barIndex) {
                                bar.style.opacity = isHovering ? '0.7' : '1';
                                bar.style.transition = 'opacity 0.3s ease';
                        } else {
                                bar.style.opacity = '1';
                                bar.style.filter = isHovering ? 'brightness(1.1)' : 'none';
                        }
                });

                if (isHovering && this.totalRevenue > 0) {
                        this.showReadMore(barIndex);
                } else {
                        this.hideReadMore();
                }
        }

        //ANNOTATION SECTION

        getColorScheme(annotationType) {
                // Determine threshold status
                const category = this.annotationData[annotationType].category;

                let isExceeded;
                if (category === 'historical') {
                        isExceeded = Math.max(...Object.values(this.distributedRevenue)) >= this.annotationData[annotationType].y;
                } else {
                        isExceeded = this.distributedRevenue[category] >= this.annotationData[annotationType].y;
                }

                //determine color
                const colors = this.colors[this.annotationData[annotationType].category];
                return {
                        background: isExceeded ? colors.active : colors.inactive,
                        hover: colors.base,
                        text: isExceeded ? colors.text.active : colors.text.inactive,
                        hoverText: colors.text.active,
                        isExceeded // Include this for borderWidth logic
                };
        }

        get distributedRevenue() {
                return Object.fromEntries(
                        Object.keys(this.categoryData).map(key => [
                                key,
                                this.totalRevenue * this.percentages[key] / 100
                        ])
                );
        }

        setupAnnotationStyles() {

                // Prevent multiple setups
                if (this.annotationsSetup) return;
                this.isSettingUpAnnotations = true;

                // Clear any existing HTML annotations first
                document.querySelectorAll('.custom-annotation').forEach(el => el.remove());

                const annotationLines = document.querySelectorAll('.apexcharts-yaxis-annotations line');

                annotationLines.forEach((lineElement, index) => {

                        // Get the computed position from the line element
                        const rect = lineElement.getBoundingClientRect();
                        const chartContainer = document.querySelector('#chart');
                        const chartRect = chartContainer.getBoundingClientRect();
                        const chartContainerParent = chartContainer.parentElement;

                        // Calculate position relative to chart container
                        const relativeY = rect.top - chartRect.top;

                        // Get text content from annotationData
                        let textContent = '';
                        let annotationType = '';

                        const chartYValues = Object.values(this.annotationData).map(config => config.y);

                        if (chartYValues[index]) {
                                const matchingEntry = Object.entries(this.annotationData)[index];
                                if (matchingEntry) {
                                        annotationType = matchingEntry[0];
                                        textContent = matchingEntry[1].displayText;
                                }
                        }

                        if (!this.shouldShowForDataset(annotationType)) {
                                return; // Skip this iteration
                        }

                        // Create HTML div using SVG position
                        const htmlDiv = document.createElement('div');
                        htmlDiv.className = 'custom-annotation';
                        if (this.isMobile) {
                                htmlDiv.innerHTML = '';
                        } else {
                                htmlDiv.innerHTML = textContent;
                        }

                        htmlDiv.dataset.annotationType = annotationType;
                        htmlDiv.style.cssText = `
                            position: absolute;
                            left: ${this.isMobile ? (chartRect.width - 10) + 'px' : (chartRect.width - 120) + 'px'};
                            top: ${relativeY - 35}px;
                            width: ${this.isMobile ? '24px' : '180px'};
                            height: ${this.isMobile ? '24px' : 'auto'};
                            font-size: 10px;
                            font-weight: 400;
                            color: ${this.isMobile ? 'transparent' : this.getColorScheme(annotationType).text};
                            background: ${this.isMobile ? 'transparent' : this.getColorScheme(annotationType).background};
                            padding: 6px;
                            padding-right: 10px;
                            cursor: pointer;
                            margin: 15px;
                            border: ${this.isMobile ? 'none' : 'solid 1px black'};
                            border-radius: 4px;
                            line-height: 1.3;
                            word-wrap: break-word;
                            z-index: 7;
                            transition: all 0.2s ease;
                            pointer-events: ${this.isMobile ? 'none' : 'auto'};
                        `;

                        // Create the info icon
                        const infoIcon = document.createElement('span');
                        infoIcon.className = 'info-icon';
                        infoIcon.style.cssText = `
                            position: ${this.isMobile ? 'static' : 'absolute'};
                            top: ${this.isMobile ? 'auto' : '1px'};
                            right: ${this.isMobile ? 'auto' : '1px'};
                            height: ${this.isMobile ? '18px' : '12px'} !important;
                            width: ${this.isMobile ? '18px' : '12px'} !important;
                            min-width: ${this.isMobile ? '18px' : '12px'} !important;
                            top: 1px;
                            margin-left: 0;
                            font-size: ${this.isMobile ? '12px' : '9px'};
                            background-color: ${this.isMobile ? this.getColorScheme(annotationType).background : 'inherit'} !important;
                            color: ${this.isMobile ? this.getColorScheme(annotationType).text : 'inherit'};
                            margin: 2px;
                            pointer-events: ${this.isMobile ? 'auto' : 'inherit'};
                            cursor: ${this.isMobile ? 'pointer' : 'inherit'};
                        `;

                        // Add the icon to the div
                        if (this.annotationData[annotationType].category !== 'historical') {
                                htmlDiv.appendChild(infoIcon);
                        }

                        //Hover styles
                        if (!this.isMobile) {
                                htmlDiv.addEventListener('mouseenter', () => {
                                        htmlDiv.style.fontWeight = '600';
                                        htmlDiv.style.background = this.getColorScheme(annotationType).hover;
                                        htmlDiv.style.color = this.getColorScheme(annotationType).hoverText;
                                        htmlDiv.style.transform = 'scale(1.05)';
                                        infoIcon.style.fontWeight = '600';
                                });

                                htmlDiv.addEventListener('mouseleave', () => {
                                        htmlDiv.style.fontWeight = '400';
                                        htmlDiv.style.background = this.getColorScheme(annotationType).background;
                                        htmlDiv.style.transform = 'scale(1)';
                                        htmlDiv.style.color = this.getColorScheme(annotationType).text;
                                });
                        } else {
                                infoIcon.addEventListener('mouseenter', () => {
                                        infoIcon.style.transform = 'scale(1.2)';
                                });

                                infoIcon.addEventListener('mouseleave', () => {
                                        infoIcon.style.transform = 'scale(1)';
                                });
                        }

                        // Click handler
                        if (!this.isMobile) {
                                if (this.annotationData[annotationType].category !== 'historical') {
                                        htmlDiv.addEventListener('click', (e) => {
                                                this.openModal(e.target.dataset.annotationType);
                                        });
                                }
                        } else {
                                infoIcon.addEventListener('click', (e) => {
                                        this.openModal(annotationType);
                                });
                        }

                        // Add HTML element to chart container
                        chartContainerParent.appendChild(htmlDiv);
                });

                this.createCustomAnnotationLines();
                this.isSettingUpAnnotations = false;

                // Mark as setup complete
                this.annotationsSetup = true;

                //make sure annotations info icons work
                this.initInfoIcons();
        }

        showReadMore(barIndex) {

                // Remove any existing read more elements
                this.hideReadMore();

                // Get the SVG chart container and bar element
                const chartContainer = document.querySelector('#chart');
                const barElement = document.querySelectorAll('.apexcharts-bar-area')[barIndex];

                if (!chartContainer || !barElement) {
                        return;
                }
                // Wait for chart to be fully rendered
                setTimeout(() => {
                        const allBars = document.querySelectorAll('.apexcharts-bar-area');

                        if (barIndex >= allBars.length || barIndex < 0) {
                                return;
                        }

                        const barElement = allBars[barIndex];
                        if (!barElement) {
                                return;
                        }

                        // Get positioning info
                        const barRect = barElement.getBoundingClientRect();
                        const chartRect = chartContainer.getBoundingClientRect();

                        // Create the "read more" element
                        const readMoreElement = document.createElement('div');
                        readMoreElement.id = 'read-more-tooltip';
                        readMoreElement.textContent = 'Read more';
                        readMoreElement.style.cssText = `
                            position: absolute;
                            background: rgba(28, 59, 56, 1);
                            color: white;
                            padding: 4px 8px;
                            border-radius: 4px;
                            font-size: 15px;
                            font-weight: 500;
                            pointer-events: none;
                            z-index: 1000;
                            white-space: nowrap;
                        `;
                        readMoreElement.style.transition = 'opacity 0.2s ease-out';
                        readMoreElement.style.opacity = '0'; // Start hidden
                        requestAnimationFrame(() => {
                                readMoreElement.style.opacity = '1'; // Trigger fade-in
                        });

                        // Position the element above the center of the bar
                        const leftPosition = (barRect.left - chartRect.left) + (barRect.width / 2) - 47; // Approximate center
                        const topPosition = (barRect.top - chartRect.top) - 37; // height above bar

                        readMoreElement.style.left = `${leftPosition}px`;
                        readMoreElement.style.top = `${topPosition}px`;

                        chartContainer.appendChild(readMoreElement);
                }, 0);
        }

        // Helper function to hide "read more" text
        hideReadMore() {
                const existingElement = document.getElementById('read-more-tooltip');
                if (existingElement) {
                        // Add fade out transition
                        existingElement.style.transition = 'opacity 0.3s ease-out';
                        existingElement.style.opacity = '0';

                        // Remove element after fade completes
                        setTimeout(() => {
                                existingElement.remove();
                        }, 300);
                }
        }

        createCustomAnnotationLines() {
                // Remove any existing custom lines
                console.log('Creating custom annotation lines...');
                document.querySelectorAll('.custom-annotation-line').forEach(el => el.remove());

                const annotationLines = document.querySelectorAll('.apexcharts-yaxis-annotations line');
                const chartContainer = document.querySelector('#chart');
                if (!chartContainer || annotationLines.length === 0) return;

                const svgElement = chartContainer.querySelector('svg');
                if (!svgElement) {
                        return;
                }

                const graphicalGroup = svgElement.querySelector('.apexcharts-inner.apexcharts-graphical');
                if (!graphicalGroup) return;

                const barElements = graphicalGroup.querySelectorAll('.apexcharts-bar-area');

                // Wait for bar positions to be properly initialized
                if (!barElements.length || !barElements[0].getAttribute('d')) {
                        setTimeout(() => this.createCustomAnnotationLines(), 100);
                        return;
                        console.log('Bar elements not ready yet, retrying...');
                }

                const barSeriesGroup = graphicalGroup.querySelector('.apexcharts-bar-series');

                // Get bar centers with category mapping
                const barCenters = {};
                const categories = ['climate', 'national', 'ekerosene'];

                barElements.forEach((bar, index) => {
                        const pathD = bar.getAttribute('d');
                        const barWidth = parseFloat(bar.getAttribute('barWidth')) || 0;
                        const pathMatch = pathD ? pathD.match(/M\s*([\d.]+)\s*([\d.]+)/) : null;

                        if (pathMatch) {
                                const barLeftX = parseFloat(pathMatch[1]);
                                const barCenterX = barLeftX + (barWidth / 2);
                                const category = categories[index];
                                if (category) {
                                        barCenters[category] = barCenterX;
                                }
                        }
                });

                // Calculate the proper end point - use the custom annotation positions
                let lineEndX;

                if (this.isMobile) {
                        // On mobile, extend to the right edge of the SVG
                        lineEndX = parseFloat(svgElement.getAttribute('width')) - (this.chart.w.globals.translateX || 0);
                } else {
                        console.log('Finding custom annotation positions for line ends...');
                        // On desktop, find where the custom annotations are positioned
                        const customAnnotations = document.querySelectorAll('.custom-annotation');
                        if (customAnnotations.length > 0) {
                                // Get the position of the first annotation relative to the chart
                                const annotationRect = customAnnotations[0].getBoundingClientRect();
                                const svgRect = svgElement.getBoundingClientRect();

                                // Calculate position relative to SVG, accounting for transforms
                                const annotationLeftRelativeToSVG = annotationRect.left - svgRect.left;
                                lineEndX = annotationLeftRelativeToSVG - (this.chart.w.globals.translateX || 0);
                        } else {
                                // Fallback: use grid width
                                lineEndX = this.chart.w.globals.gridWidth;
                        }
                }

                annotationLines.forEach((lineElement, index) => {
                        console.log('Processing annotation line index:', index);
                        const annotationEntry = Object.entries(this.annotationData)[index];
                        if (!annotationEntry) return;

                        const [key, data] = annotationEntry;
                        if (!this.shouldShowForDataset(key)) return;

                        const category = data.category;
                        const isHistorical = category === 'historical';

                        const yCoord = parseFloat(lineElement.getAttribute('y1'));

                        let startX = 0;
                        if (!isHistorical && barCenters[category]) {
                                startX = barCenters[category];
                        }

                        // Get styling
                        const colorScheme = this.getColorScheme(key);
                        const borderWidth = colorScheme.isExceeded ? 3 : 2;

                        // Create SVG line element
                        const customLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                        customLine.setAttribute('class', 'custom-annotation-line');
                        customLine.setAttribute('x1', startX);
                        customLine.setAttribute('x2', lineEndX);
                        customLine.setAttribute('y1', yCoord);
                        customLine.setAttribute('y2', yCoord);
                        customLine.setAttribute('stroke', colorScheme.background);
                        customLine.setAttribute('stroke-width', borderWidth);
                        customLine.setAttribute('stroke-dasharray', '5,5');
                        customLine.setAttribute('opacity', '1');

                        if (barSeriesGroup) {
                                graphicalGroup.insertBefore(customLine, barSeriesGroup);
                                console.log('Custom line inserted before bar series group.');
                        } else {
                                graphicalGroup.appendChild(customLine);
                                console.log('Custom line appended to graphical group.');
                        }
                });

                console.log('Custom annotation lines created.');
        }

        updateAnnotationOpacity(isTransitioningFromZero) { //maybe remove the isTransitioningFromZero param
                if (!this.chart) return;

                // Helper function to calculate final border properties
                const getFinalBorderProps = (annotationType) => {
                        if (!this.shouldShowForDataset(annotationType)) {
                                return {
                                        borderWidth: 0,
                                        borderColor: 'transparent'
                                };
                        }
                        return {
                                borderWidth: 0, // Make invisible
                                borderColor: 'transparent' // Make invisible
                        };
                };
                // Check if we're transitioning from zero by comparing previous and new values
                //     console.log('previousTotalRevenue(UAO):', this.previousTotalRevenue);
                // console.log('isTransitioningFromZero(UAO):', isTransitioningFromZero);
                // Store current value for next comparison

                this.previousTotalRevenue = this.totalRevenue;

                // Keep Apex annotations for positioning but make them invisible
                const newAnnotations = {
                        yaxis: Object.entries(this.annotationData).map(([key, data]) => ({
                                y: data.y,
                                ...this.baseAnnotationStyle,
                                ...getFinalBorderProps(key)
                        }))
                };

                this.chart.updateOptions({
                        annotations: newAnnotations
                }, !isTransitioningFromZero, true, true, false);
                // console.log('transitioning from zero:', isTransitioningFromZero);

                this.annotationsSetup = false;
                // requestAnimationFrame(() => {
                this.setupAnnotationStyles();
        }

        updateChart() {
                if (!this.chart) return;
                // Check if we're transitioning from zero by comparing previous and new values
                const isTransitioningFromZero = this.totalRevenue > 0 &&
                        (!this.previousTotalRevenue || this.previousTotalRevenue === 0);
                //     console.log('previousTotalRevenue(UC):', this.previousTotalRevenue);
                // console.log('isTransitioningFromZero(UC):', isTransitioningFromZero);

                // Store current value for next comparison
                this.previousTotalRevenue = this.totalRevenue;

                // Use animations only when NOT actively sliding
                const shouldAnimate = !this.isSliding;

                const newData = Object.entries(this.categoryData).map(([key, category]) => ({
                        x: category.title,
                        y: this.distributedRevenue[key] + 0.001, // Use the key from Object.entries
                }));

                this.chart.updateSeries([{ name: 'Revenue', data: newData }], !isTransitioningFromZero);

                this.chart.updateOptions({
                        chart: {
                                animations: {
                                        enabled: shouldAnimate && !isTransitioningFromZero,
                                        easing: 'easeinout',
                                        speed: 800,
                                        dynamicAnimation: { enabled: shouldAnimate && !isTransitioningFromZero },
                                        antimateGradually: { enabled: false }
                                }
                        },
                        yaxis: {
                                min: 0,
                                max: this.datasets[this.currentDataset].yAxisMax,
                                labels: {
                                        minWidth: 44,
                                        formatter: function (val) { return '€' + Number(val).toFixed(0) + 'bn'; }
                                },
                                stepSize: this.currentDataset === '2012-2023' ? 10 : 40
                        },
                        dataLabels: {},
                        annotations: {}
                }, !isTransitioningFromZero);

                const chartContainer = document.querySelector("#chart");
                if (this.totalRevenue > 0) {
                        chartContainer.classList.add('show-borders');
                } else {
                        chartContainer.classList.remove('show-borders');
                }

                this.updateAnnotationOpacity(isTransitioningFromZero);
        }

        setupModal() {
                const modal = document.getElementById('modal-overlay');
                const closeBtn = document.getElementById('modal-close');

                closeBtn.addEventListener('click', () => this.closeModal());

                modal.addEventListener('click', (e) => {
                        if (e.target === modal) { this.closeModal(); }
                });

                document.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape' && modal.classList.contains('active')) { this.closeModal(); }
                });
        }

        openModal(category) {
                const modal = document.getElementById('modal-overlay');
                const title = document.getElementById('modal-title');
                const content = document.getElementById('modal-content');
                const footer = document.getElementById('modal-footer');

                const categoryData = {
                        climate: {
                                title: 'International climate finance',
                                content: 'International climate finance refers to funding mechanisms designed to support climate change mitigation and adaptation efforts. The aviation sector bears a historical responsibility for <a target="_blank" href=" https://ourworldindata.org/global-aviation-emissions">4% of global warming to date</a>. As such, it is right that it contributes to climate change adaptation and mitigation finance for climate vulnerable countries.<br><br>It is also in Europe’s best interest to mobilise international climate finance. Every 1tCO<sub>2</sub> emitted globally is projected to cause between $22.53 and $125.27 in damages within the EEA bloc (including Switzerland). By financing climate mitigation in developing countries, where it today costs less to abate carbon emissions, and thus reducing the climate impacts, developed countries can see a return on investment between 180.2% and 1457.2%.<br><br>This opportunity for the EU to contribute fairly and proportionately to the global goal of $1.3tn a year of climate finance to developing countries, as agreed at COP29, should not be missed. Mandating a proportion of revenue from aviation allowances to meet the EU’s climate finance goals from this global sector is only proportionate and fair, as well as likely to be well received by partner nations across the world.',
                                // footer: 'Learn more about how ETS revenues could support reaching international climate finance goals in the policy guide.'                      
                        },
                        national: {
                                title: 'National climate action',
                                content: 'EU member states need new or additional sources of finance to satisfy urgent climate mitigation and adaptation needs. The World Bank estimates that EU climate change adaptation costs up to the 2030s could be between €15bn to €64bn annually.<br><br>It is widely recognised that aviation has been historically undertaxed, through fuel tax and VAT exemptions, and therefore contributes little to the general budgets of EU Member States.  Bringing aviation’s full climate impacts under the ETS would increase the stock of revenues available for national climate action and therefore free up other general tax revenues to be spent where aviation has not heretofore contributed its fair share to national finances.',
                                // footer: 'Learn more about how EU Member States could use extra revenues to fund climate action in the policy guide.'                       
                        },
                        ekerosene: {
                                title: 'E-kerosene funding',
                                content: 'A section of funding needs to go towards the aviation industry’s own energy transition. The only credible fuel solution for net zero aviation is renewable fuels of non-biological origin (RFNBOs), such as e-kerosene produced from renewable hydrogen and/or renewable hydrogen itself. Beyond its climate credentials, producing RFNBOs in the EU is both an economic opportunity and a means to mitigate the energy security risks brought about by relying on the import of fossil fuels to the EU. <br><br>Even though RFNBOs having the lowest lifecycle emissions, it is struggling to compete against fossil fuels as well as other so-called sustainable aviation fuels (SAFs), like biofuels, that are currently supported under the ETS despite having higher lifecycle emissions, jeopardising biodiversity, and not offering the sector long-term economic resilience due to limited feedstock supplies.<br><br>A proportion of ETS aviation revenues should be mandated for financing RFNBO development and deployment specifically, and not other unsustainable SAFs.',
                                // footer: 'Learn more about the support RFNBO producers need in the policy guide.'

                        },
                        methodology: {
                                title: 'Methodology',
                                content: 'This tool estimates the financial impact of aviation\’s privileged ETS regime by calculating the potential revenue from various sources and how it could be allocated to climate action.<br><br><u>CO<sub>2</sub> emissions from extra-EEA flights</u>: For 2012-2023 data, estimates are based off national GHG inventories and country submissions to the UNFCCC, for the EU27, Iceland, Norway and Liechtenstein from 2012-2023, while data for the UK were included for the period 2012-2020. Emissions are translated to revenues using annual average EU ETS allowance prices. For the period 2027-2035, figures are derived from EEA Member States\’ own projections of CO<sub>2</sub> emissions, and a representative carbon price of €100 per tonne of CO<sub>2</sub>. Projections of future ETS allowance prices vary significantly, with one recent projection suggesting prices may surge to almost <a target="_blank" href="https://about.bnef.com/insights/finance/europes-new-emissions-trading-system-expected-to-have-worlds-highest-carbon-price-in-2030-at-e149-bloombergnef-forecast-reveals/">€150 per tonne of CO<sub>2</sub> in 2030</a>.<br><br><u>Non-CO<sub>2</sub> emissions</u>: Aviation’s non-CO<sub>2</sub> emissions have <a target="_blank" href="https://www.opportunitygreen.org/publication-controlling-contrails-lowering-climate-impact-of-aviation">significant climate impacts</a> which are not currently included in the EU ETS. Using the commonly-applied GWP metric on a 100-year timescale suggests that aviation’s total climate impact – including non-CO<sub>2</sub> impacts – is 1.7 times larger than that from CO<sub>2</sub> emissions alone. Therefore, we applied this multiplier to our calculations of CO<sub>2</sub> emissions to estimate the magnitude of non-CO<sub>2</sub> climate impacts.',
                                // footer: 'Find the full methodology in the policy guide annex. [link]'
                        },
                        extraEea: {
                                title: 'Extra-EEA aviation',
                                content: 'In 2012, the EU Commission exempted flights leaving European countries for non-European countries from the ETS, excluding around 60% of the sector’s climate impacts from being priced. In just the 12 years covering 2012–2023, this exemption let <strong>1.1bn tCO<sub>2</sub> go unregulated</strong>, the equivalent of Greece’s entire greenhouse gas emissions in the same period, losing €26bn in revenues that could have funded climate action.<br><br>Next year the EU Commission is set to make a decision on whether or not to start pricing emissions from extra-EEA flights from 2027. Failing to take these emissions into the ETS scope could leave <strong>1.3bn tCO<sub>2</sub> unregulated and €79bn in revenues uncollected</strong>.',
                                // footer: 'Learn more about how extra-EEA flights can be taken back into the ETS in the policy guide.'
                        },
                        nonC02: {
                                title: 'Non-CO2 emissions',
                                content: 'The EU ETS has also so far neglected to account for aviation’s non-CO<sub>2</sub> climate impacts. In addition to CO<sub>2</sub>, aircraft also emit nitrogen oxides (NO<sub>x</sub>), as well as water vapour, soot and other particles. These emissions are left in a trail (known as a contrail) behind the aircraft. If the atmosphere is sufficiently cold and humid, the water vapour condenses around the particles, leading to contrails persisting in the atmosphere and forming contrail cirrus clouds.<br><br>The <a target="_blank" href="https://www.opportunitygreen.org/publication-controlling-contrails-lowering-climate-impact-of-aviation">warming impacts of non-CO<sub>2</sub> emissions and contrail formation</a> are responsible for as much as two thirds of aviation’s total climate impact, and more than 40% based on the commonly-applied GWP metric on a 100-year timescale. Using this GWP estimate suggests that, had the EU ETS included non-CO<sub>2</sub>  climate impacts between 2012-2023, additional emissions equivalent to 470mn tCO<sub>2</sub> would have been accounted for from flights within the original EU ETS scope alone, and an additional 767mn tCO<sub>2</sub>e from all other flights departing from the EEA (see Annex 1).Including all these non-CO<sub>2</sub>  climate impacts could have generated <strong>€28.9bn</strong> in revenues.<br><br>From 2027-2035, flights within and departing from the EEA could together produce the equivalent of 914mn tCO<sub>2</sub> in non-CO<sub>2</sub> impacts, which, if priced, would generate <strong>€91bn</strong><br><br>*<em>The value of revenue given here is from pricing non-CO<sub>2</sub> impacts of both intra- and extra-EEA flights.</em>',
                                // footer: 'Learn more about how non-CO<sub>2</sub> emissions could be priced by the ETS need in the policy guide.'
                        },
                        freeAllowances: {
                                title: 'Free allowances',
                                content: 'As well as having its pollution largely unaccounted, EU aviation also enjoyed free ETS allowances, meaning the industry did not pay a price on all its intra-EEA CO<sub>2</sub> emissions. Between 2013-2020, <a target="_blank" href=https://climate.ec.europa.eu/eu-action/eu-emissions-trading-system-eu-ets/free-allocation/allocation-aviation-sector_en> 82% of aviation\’s ETS allowances were free</a>.<br><br>The free allowances were because the industry argued that the ETS’s coverage of aviation would cause carbon leakage, however the <a target="_blank" href=https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:52021SC0603&from=EN>European Commission\’s 2021 impact assessment</a> found that “there is no evidence of carbon leakage at present for aviation, because there is equal treatment of all airlines on flight routes covered by the ETS" and that free allowances “undermines the effectiveness of the carbon price signal thereby removing incentives for aircraft operators to decarbonise their activities".<br><br>These allowances are set to be fully phased out in 2026, yet between 2012-2023 alone, their worth totalled around €8bn, based on the average price of allowances for each year.',
                                // footer: 'Learn more about how aviation has benefited from free ETS allowances and other privileges in the policy guide.'
                        },
                        timePeriod: {
                                title: 'Time period',
                                content: 'In 2012, the EU Commission exempted extra-EEA flights from paying for their emissions. Thanks to this exemption, between 2012 and 2023, the ETS left <strong>1.1bn tCO<sub>2</sub> unregulated</strong> (see Annex 1 for methododology).<br><br>This is equivalent to the total GHG emissions from Greece over the same period (1.04bn tCO<sub>2</sub>e).<br><br>Next year, the EU Commission has the opportunity to price extra-EEA flight emissions from 2027. If it does not do so, it will leave unregulated a projected <strong>2.04bn tCO<sub>2</sub></strong> between 2027 and 2035 (see Annex 1 for methodology).',
                                footer: 'Learn how the EU can take extra-EEA flights into the ETS in the policy guide.'
                        },
                        ...this.annotationData  // Use the data from constructor
                };

                const data = categoryData[category];
                if (data) {
                        title.textContent = data.title;
                        content.innerHTML = data.content;

                        if (data.footer) {
                                footer.textContent = data.footer;
                                footer.style.display = 'block';
                        } else {
                                footer.style.display = 'none';
                        }
                }
                modal.classList.add('active');

                document.body.style.overflow = 'hidden'; // Prevent scrolling
        }

        closeModal() {
                const modal = document.getElementById('modal-overlay');
                modal.classList.remove('active');
                document.body.style.overflow = '';
        }

        setupEventListeners() {

                //info + methodology button listeners
                setTimeout(() => {
                        document.querySelectorAll('.info-icon, .methodology-btn').forEach(element => {
                                const category = element.getAttribute('data-category');
                                element.addEventListener('click', () => this.openModal(category));
                        });
                }, 100);

                //tutorial button listener
                document.querySelector('.instructions-btn').addEventListener('click', () => {
                        this.showTutorialStepDesktop();
                });

                //report button listener
                document.querySelector('.report-btn').addEventListener('click', () => {
                        window.location.href = 'https://www.opportunitygreen.org/publication-policy-guide-eu-ets-aviation';
                });

                //Lock event listener
                document.querySelectorAll('.lock-btn').forEach(btn => {
                        btn.addEventListener('click', (e) => this.toggleLock(e.target.dataset.slider));
                });
        }

        toggleLock(sliderType) {
                const btn = document.querySelector(`[data-slider="${sliderType}"]`);
                const slider = document.getElementById(`${sliderType}-slider`);

                if (this.lockedSlider === sliderType) {
                        this.lockedSlider = null;
                        btn.querySelector('.lock-icon').src = 'https://static1.squarespace.com/static/64871f9937497e658cf744f5/t/685c0d8337603932491b0e6f/1750863235925/1.png';
                        btn.classList.remove('locked');
                        slider.disabled = false;
                } else {
                        if (this.lockedSlider) {
                                const prevBtn = document.querySelector(`[data-slider="${this.lockedSlider}"]`);
                                const prevSlider = document.getElementById(`${this.lockedSlider}-slider`);
                                btn.querySelector('.lock-icon').src = 'https://static1.squarespace.com/static/64871f9937497e658cf744f5/t/685c0d8337603932491b0e6f/1750863235925/1.png';
                                prevBtn.classList.remove('locked');
                                prevSlider.disabled = false;
                        }

                        this.lockedSlider = sliderType;
                        btn.querySelector('.lock-icon').src = 'https://static1.squarespace.com/static/64871f9937497e658cf744f5/t/685c0d830297415cddfa835c/1750863235934/2.png';
                        btn.classList.add('locked');
                        slider.disabled = true;
                }
        }

        updateTotalRevenue() {
                let additionalRevenue = 0;
                document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
                        additionalRevenue += parseFloat(checkbox.dataset.value);
                });

                this.totalRevenue = additionalRevenue;
                this.updateDisplay();
                this.updateChart();
        }

        generateSliderSection() {
                const container = document.querySelector('.slider-section');
                const title = container.querySelector('.slider-title');

                // Clear existing items but keep title
                container.innerHTML = '';
                container.appendChild(title);

                Object.entries(this.categoryData).forEach(([key, data]) => {
                        const item = document.createElement('div');
                        item.className = 'slider-item';
                        item.innerHTML = `
                            <div class="slider-header">
                                <span class="slider-label">${data.title}</span>
                                <span class="info-icon" data-category="${key}"></span>
                            </div>
                            <div class="slider-container">
                                <input type="range" min="0" max="100" value="33.3" class="slider slider-${key}" id="${key}-slider">
                                <button class="lock-btn" data-slider="${key}">
                                    <img src="https://static1.squarespace.com/static/64871f9937497e658cf744f5/t/685c0d8337603932491b0e6f/1750863235925/1.png" alt="unlock" class="lock-icon">
                                </button>
                            </div>
                            <div class="slider-value">
                                <span><span id="${key}-percent">33.3</span>%</span>
                                <span class="value-amount">€<span id="${key}-amount">0.0</span>bn</span>
                            </div>
                        `;
                        container.appendChild(item);
                });

                //Event listeners
                Object.keys(this.categoryData).forEach(type => {
                        const slider = document.getElementById(`${type}-slider`);

                        // Track when sliding starts
                        ['mousedown', 'touchstart'].forEach(event => {
                                slider.addEventListener(event, () => {
                                        this.isSliding = true;
                                });
                        });

                        // Track when sliding stops
                        ['mouseup', 'touchend'].forEach(event => {
                                slider.addEventListener(event, () => {
                                        setTimeout(() => { this.isSliding = false; }, 100);
                                });
                        });

                        slider.addEventListener('input', (e) => this.handleSliderChange(type, parseFloat(e.target.value)));
                });
        }

        handleSliderChange(changedSlider, newValue) {
                if (this.lockedSlider === changedSlider) return;

                const oldValue = this.percentages[changedSlider];
                const difference = newValue - oldValue;

                //changing CSS for slider track
                const slider = document.getElementById(`${changedSlider}-slider`);
                const percentage = (newValue / slider.max) * 100;
                slider.style.setProperty('--value', `${percentage}%`);

                if (this.lockedSlider) {
                        const otherSliders = Object.keys(this.categoryData).filter(s => s !== changedSlider && s !== this.lockedSlider);
                        const otherSlider = otherSliders[0];

                        const newOtherValue = this.percentages[otherSlider] - difference;

                        if (newOtherValue < 0) {
                                const maxIncrease = this.percentages[otherSlider];
                                const limitedNewValue = oldValue + maxIncrease;

                                document.getElementById(`${changedSlider}-slider`).value = limitedNewValue;

                                this.percentages[changedSlider] = limitedNewValue;
                                this.percentages[otherSlider] = 0;
                        } else {
                                this.percentages[changedSlider] = newValue;
                                this.percentages[otherSlider] = newOtherValue;
                        }
                } else {
                        // No slider locked, distribute change equally among other two
                        const otherSliders = Object.keys(this.categoryData).filter(s => s !== changedSlider);
                        const adjustmentPerSlider = difference / 2;

                        // Check if either other slider would go below 0%
                        const newValues = {};
                        let totalNegativeAdjustment = 0;
                        let slidersAtZero = [];

                        otherSliders.forEach(slider => {
                                const newVal = this.percentages[slider] - adjustmentPerSlider;
                                if (newVal < 0) {
                                        totalNegativeAdjustment += Math.abs(newVal);
                                        slidersAtZero.push(slider);
                                        newValues[slider] = 0;
                                } else {
                                        newValues[slider] = newVal;
                                }
                        });

                        // If some sliders would go negative, adjust accordingly
                        if (slidersAtZero.length > 0) {
                                // Calculate how much we can actually change
                                const availableFromOthers = otherSliders.reduce((sum, slider) =>
                                        sum + this.percentages[slider], 0);
                                const maxIncrease = availableFromOthers;
                                const limitedNewValue = Math.min(newValue, oldValue + maxIncrease);

                                // Update the slider input value to reflect the limit
                                document.getElementById(`${changedSlider}-slider`).value = limitedNewValue;

                                const actualDifference = limitedNewValue - oldValue;
                                const actualAdjustmentPerSlider = actualDifference / 2;

                                this.percentages[changedSlider] = limitedNewValue;

                                // Distribute the actual adjustment
                                otherSliders.forEach(slider => {
                                        this.percentages[slider] = Math.max(0, this.percentages[slider] - actualAdjustmentPerSlider);
                                });
                        } else {
                                // Normal case - no sliders would go negative
                                this.percentages[changedSlider] = newValue;
                                otherSliders.forEach(slider => {
                                        this.percentages[slider] = newValues[slider];
                                });
                        }
                }

                // Normalize to ensure total is exactly 100%
                this.normalizePercentages();
                this.updateSliders();
                this.updateDisplay();
                this.updateChart();
        }

        normalizePercentages() {
                const total = Object.keys(this.categoryData).reduce((sum, key) => sum + this.percentages[key], 0);

                if (total > 0.001) {
                        const factor = 100 / total;
                        Object.keys(this.categoryData).forEach(key => {
                                this.percentages[key] *= factor;
                        });
                }
        }

        updateSliders() {
                Object.keys(this.categoryData).forEach(type => {
                        const slider = document.getElementById(`${type}-slider`);
                        if (slider) {
                                slider.value = this.percentages[type];
                                const percentage = (this.percentages[type] / slider.max) * 100;
                                slider.style.setProperty('--value', `${percentage}%`);
                        }
                });
        }

        updateDisplay() {
                // Update total amount
                const totalElement = document.getElementById('total-amount');
                if (totalElement) {
                        totalElement.textContent = `€${this.totalRevenue.toFixed(1)}bn`;
                }

                // Update percentage and amount displays
                Object.keys(this.categoryData).forEach(type => {
                        const percentage = this.percentages[type];
                        const amount = this.distributedRevenue[type];
                        const percentElement = document.getElementById(`${type}-percent`);
                        const amountElement = document.getElementById(`${type}-amount`);

                        if (percentElement) {
                                percentElement.textContent = percentage.toFixed(1);
                        }
                        if (amountElement) {
                                amountElement.textContent = amount.toFixed(2);
                        }
                });
        }

        // TUTORIAL methods

        initTutorial() {
                if (this.isMobile) {
                        this.showMobileTutorial();
                } else {
                        this.showTutorialStepDesktop();
                }
        }

        async showTutorialStepDesktop() {
                if (!this.tutorialSteps) { return; }
                if (!this.tutorialSteps[this.currentStep]) { return; }

                // Disable scrolling at the start
                if (!this.tutorialActive) {
                        this.disableScroll();
                        this.tutorialActive = true;
                }

                // Remove any existing tutorial elements
                this.removeTutorialElements();

                const currentTutorialStep = this.tutorialSteps[this.currentStep];

                if (currentTutorialStep.type === 'highlight' && currentTutorialStep.target) {
                        await this.scrollToTarget(currentTutorialStep.target);
                }

                // Create overlay
                const overlay = document.createElement('div');
                overlay.className = 'tutorial-overlay';
                overlay.id = 'tutorial-overlay';
                document.body.appendChild(overlay);

                // Handle highlighting for target elements
                if (currentTutorialStep.type === 'highlight' && currentTutorialStep.target) {
                        const targetElement = document.querySelector(currentTutorialStep.target);
                        if (targetElement) {
                                this.createOverlayCutout(targetElement, overlay);
                        }
                }

                // Create modal
                const modal = document.createElement('div');
                modal.className = 'tutorial-modal';
                if (currentTutorialStep.type === 'introduction-modal') {
                        modal.className += ' introduction-modal';
                }
                modal.id = 'tutorial-modal';

                // Create modal content
                modal.innerHTML = `
                        <div class="modal-header">
                            <h2 class="modal-title">${currentTutorialStep.title}</h2>
                            <div class="tutorial-step-counter">${this.currentStep + 1} of ${this.tutorialSteps.length}</div>
                        </div>
                        <div class="tutorial-content">
                            ${currentTutorialStep.content}
                        </div>
                        <div class="tutorial-buttons">
                            ${this.currentStep > 0 ? '<button class="tutorial-btn tutorial-back">Back</button>' : ''}
                            ${this.currentStep < this.tutorialSteps.length - 1 ? `<button class="tutorial-btn tutorial-next">${this.currentStep === 0 ? "Let's get started" : "Next"}</button>` : '<button class="tutorial-btn tutorial-finish">Finish</button>'}                            ${this.currentStep < this.tutorialSteps.length - 1 ? '<button class="tutorial-btn tutorial-skip">Skip</button>' : ''}
                        </div>
                    `;

                document.body.appendChild(modal);

                // Position modal
                modal.style.position = 'fixed';
                if (currentTutorialStep.type === 'introduction-modal' || currentTutorialStep.position === 'center') {
                        modal.style.top = '50vh';
                        modal.style.left = '50vw';
                        modal.style.transform = 'translate(-50%, -50%)';
                } else if (currentTutorialStep.type === 'highlight' && currentTutorialStep.target) {
                        this.positionModalNearTarget(modal, currentTutorialStep.target, currentTutorialStep.position);
                }

                // Add event listeners after adding to DOM
                if (this.currentStep > 0) {
                        modal.querySelector('.tutorial-back')?.addEventListener('click', () => this.previousStep());
                }

                if (this.currentStep < this.tutorialSteps.length - 1) {
                        modal.querySelector('.tutorial-next')?.addEventListener('click', () => this.nextStep());
                } else {
                        modal.querySelector('.tutorial-finish')?.addEventListener('click', () => this.endTutorial());
                }

                modal.querySelector('.tutorial-skip')?.addEventListener('click', () => this.endTutorial());

                const chart = document.getElementById('chart');

                if (window.innerWidth <= 768) {
                        document.body.style.overflow = 'hidden';
                }
        }

        disableScroll() {
                document.documentElement.style.overflow = 'hidden';
        }

        enableScroll() {
                document.documentElement.style.overflow = '';
        }

        scrollToTarget(targetSelector) {
                const targetElement = document.querySelector(targetSelector);
                if (!targetElement) return;

                const rect = targetElement.getBoundingClientRect();
                const headerHeight = document.querySelector('#header')?.offsetHeight || 0;
                const viewportHeight = window.innerHeight;

                // Calculate scroll position to center the element in the available viewport
                const targetCenter = rect.top + window.scrollY + (rect.height / 2);
                const availableViewportCenter = (viewportHeight - headerHeight) / 2 + headerHeight;
                const scrollTo = targetCenter - availableViewportCenter;

                return new Promise((resolve) => {
                        window.scrollTo({
                                top: Math.max(0, scrollTo),
                                behavior: 'smooth'
                        });

                        // Wait for smooth scroll to complete
                        setTimeout(resolve, 500);
                });
        }

        updateTutorialPositions() {
                const currentTutorialStep = this.tutorialSteps[this.currentStep];

                if (currentTutorialStep.type === 'highlight' && currentTutorialStep.target) {
                        const targetElement = document.querySelector(currentTutorialStep.target);
                        const modal = document.getElementById('tutorial-modal');

                        if (targetElement && modal) {
                                // Update modal position
                                this.positionModalNearTarget(modal, currentTutorialStep.target, currentTutorialStep.position);

                                // Update overlay cutout
                                this.updateOverlayCutout(targetElement);
                        }
                }
        }

        updateOverlayCutout(targetElement) {
                const highlightFrame = document.getElementById('tutorial-highlight-frame');
                if (!highlightFrame) return;

                const rect = targetElement.getBoundingClientRect();
                const padding = 8;
                const header = document.querySelector('#header');
                const headerHeight = header ? header.offsetHeight : 0;

                highlightFrame.style.top = `${rect.top - padding}px`;
                highlightFrame.style.left = `${rect.left - padding}px`;
                highlightFrame.style.width = `${rect.width + (padding * 2)}px`;
                highlightFrame.style.height = `${rect.height + (padding * 2)}px`;

                // Update clip-path if needed
                if (rect.top < headerHeight) {
                        highlightFrame.style.clipPath = `inset(${Math.max(0, headerHeight - rect.top + padding)}px 0 0 0)`;
                } else {
                        highlightFrame.style.clipPath = 'none';
                }
        }

        positionModalNearTarget(modal, targetSelector, position = 'bottom') {
                const targetElement = document.querySelector(targetSelector);
                if (!targetElement) return;

                const rect = targetElement.getBoundingClientRect();

                // Force modal to render and get its dimensions
                modal.style.visibility = 'hidden';
                modal.style.display = 'block';
                const modalRect = modal.getBoundingClientRect();
                modal.style.visibility = '';

                const targetCenterY = rect.top + (rect.height / 2);

                // For desktop, position based on specified position
                switch (position) {
                        case 'right':
                                modal.style.top = (targetCenterY - (modalRect.height / 2)) + 'px';
                                modal.style.left = (rect.right + 20) + 'px';
                                break;
                        case 'left':
                                modal.style.top = (targetCenterY - (modalRect.height / 2)) + 'px';
                                modal.style.right = (window.innerWidth - rect.left + 20) + 'px';
                                break;
                }
        }

        createOverlayCutout(targetElement, overlay) {
                overlay.remove();

                const rect = targetElement.getBoundingClientRect();
                const padding = 8;
                const borderRadius = 8;
                const header = document.querySelector('#header');
                const headerHeight = header ? header.offsetHeight : 0;

                // Main highlight frame (stops at header)
                const highlightFrame = document.createElement('div');
                highlightFrame.className = 'tutorial-highlight-frame';
                highlightFrame.style.cssText = `
                        position: fixed;
                        top: ${Math.max(rect.top - padding, headerHeight)}px;
                        left: ${rect.left - padding}px;
                        width: ${rect.width + (padding * 2)}px;
                        height: ${rect.height + (padding * 2) - Math.max(0, headerHeight - (rect.top - padding))}px;
                        border-radius: ${borderRadius}px;
                        box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
                        z-index: 9;
                        pointer-events: none;
                    `;
                highlightFrame.id = 'tutorial-highlight-frame';
                document.body.appendChild(highlightFrame);

                // Header overlay (goes over header with same darkness as main overlay)
                const headerOverlay = document.createElement('div');
                headerOverlay.className = 'tutorial-header-overlay';
                headerOverlay.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: ${headerHeight + 1} px;
                        background: rgba(0, 0, 0, 0.5);
                        z-index: 15; /* Above header (z-index 10) but below modal */
                        pointer-events: none;
                    `;
                headerOverlay.id = 'tutorial-header-overlay';
                document.body.appendChild(headerOverlay);
        }

        removeTutorialElements() {
                // Remove existing overlays
                document.querySelectorAll('[id^="tutorial-highlight-frame"]').forEach(el => el.remove());
                document.getElementById('tutorial-overlay')?.remove();
                document.querySelector('#tutorial-overlay')?.remove();
                document.querySelector('#tutorial-highlight-frame')?.remove();
                document.querySelector('#tutorial-header-overlay')?.remove();


                // Remove modal
                document.getElementById('tutorial-modal')?.remove();
                document.getElementById('mobile-tutorial-modal')?.remove();
                document.querySelector('#tutorial-modal')?.remove();
        }

        nextStep() {
                if (this.currentStep < this.tutorialSteps.length - 1) {
                        this.currentStep++;
                        this.showTutorialStepDesktop();
                } else {
                        this.endTutorial();
                }
        }

        previousStep() {
                if (this.currentStep > 0) {
                        this.currentStep--;
                        this.showTutorialStepDesktop();
                }
        }

        endTutorial() {
                this.removeTutorialElements();
                this.enableScroll();
                this.currentStep = 0;
                this.tutorialActive = false; //check, i don't know if these two are necessary
                this.currentStep = 0;
        }

        //mobile tutorial
        showMobileTutorial() {

                this.removeTutorialElements();
                this.updateSliders();

                const overlay = document.createElement('div');
                overlay.className = 'tutorial-overlay';
                overlay.id = 'tutorial-overlay';
                document.body.appendChild(overlay);

                const modal = document.createElement('div');
                modal.className = 'mobile-tutorial-modal';
                modal.id = 'mobile-tutorial-modal';

                // Position modal
                modal.style.position = 'fixed';
                modal.style.top = '50vh';
                modal.style.left = '50vw';
                modal.style.transform = 'translate(-50%, -50%)';

                modal.innerHTML = `
                        <div class="mobile-tutorial-wrapper">
                            <div class="modal-header">
                                <h2 class="modal-title">Introduction to the EU aviation climate cost calculator</h2>
                            </div>
                            <div class="tutorial-content">
                                <p>${this.tutorialSteps[0].content.replace('<br>For more information read the <a href="https://www.opportunitygreen.org/publication-policy-guide-eu-ets-aviation" target="_blank"><em>Policy guide to the EU ETS for aviation</em></a>.', '')}</p>
                                <ol>
                                    <li>
                                        <h4>Select time period</h4>
                                        <p>${this.tutorialSteps[1].content.replace('line to remove', '')}</p>
                                    </li>
                                    <div class="tutorial-demo-controls">
                                        <div class="toggle-container">
                                            <button class="toggle-btn ${this.currentDataset === '2012-2023' ? 'active' : ''}" 
                                                    data-dataset="2012-2023">2012-2023</button>
                                            <button class="toggle-btn ${this.currentDataset === '2027-2035' ? 'active' : ''}" 
                                                    data-dataset="2027-2035">2027-2035</button>
                                        </div>
                                    </div>
                                    <li>
                                        <h4>Add revenue sources</h4>
                                        <p>${this.tutorialSteps[2].content.replace('<br><br><em>Click the checkboxes to add revenue sources, and click the information icons to learn more.</em>', '')}</p>
                                    </li>
                                    <div class="tutorial-demo-controls">
                                        <div class="checkbox-item">
                                            <div class="checkbox-label-wrapper">
                                                <input type="checkbox">
                                                <label for="extra-eea">Extra-EEA CO<sub>2</sub> emissions</label>
                                            </div>
                                            <span class="revenue-value">€25.6bn</span>
                                        </div>
                                    </div>
                                    <li>
                                        <h4>Allocate revenues to different climate action purposes</h4>
                                        <p>${this.tutorialSteps[3].content.replace('<br><br><em>Use the sliders and padlocks to distribute the revenues, and click the information icons to learn more.</em>', '')}</p>
                                    </li>
                                    <div class="tutorial-demo-controls">
                                        <div class="slider-item" style="margin-bottom: 0;">
                                            <div class="slider-header">
                                                <span class="slider-label">International climate finance</span>
                                            </div>
                                            <div class="slider-container">
                                                <input type="range" min="0" max="100" value="33.3" class="slider slider-climate" id="climate-slider">
                                                <button class="lock-btn" data-slider="climate">
                                                    <img src="https://static1.squarespace.com/static/64871f9937497e658cf744f5/t/685c0d8337603932491b0e6f/1750863235925/1.png" alt="unlock" class="lock-icon">
                                                </button>
                                            </div>
                                            <div class="slider-value">
                                                <span><span id="climate-percent">33.3</span>%</span>
                                                <span class="value-amount">€<span id="climate-amount">0.0</span>bn</span>
                                            </div>
                                        </div>
                                    </div>
                                    <li>
                                        <h4>View results</h4>
                                        <p>${this.tutorialSteps[4].content}</p>
                                    </li>
                                    <img src="https://static1.squarespace.com/static/64871f9937497e658cf744f5/t/68642b797992a9234047f68e/1751395193790/example_chart_ets_tool.jpg" alt="Example chart" style="width: 100%; max-width: 500px; height: auto;">
                                    </div>
                                </ol>
                                <br>
                                <div class="mobile-tutorial-footer">
                                    <p>For more information read the <a href="https://www.opportunitygreen.org/publication-policy-guide-eu-ets-aviation" target="_blank"><em>Policy guide to the EU ETS for aviation</em></a></p>
                                </div>
                            </div>
                            <div class="tutorial-buttons">
                                <button class="tutorial-btn tutorial-finish">Finish</button>
                            </div>
                        </div>
                    `;

                modal.querySelector('.tutorial-finish')?.addEventListener('click', () => this.endTutorial());

                document.body.appendChild(modal);
        }
}

// Initialize the tool when the page loads
document.addEventListener('DOMContentLoaded', () => {
        new RevenueAllocationTool();
})


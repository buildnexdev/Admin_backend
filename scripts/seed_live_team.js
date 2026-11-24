const jwt = require('../node_modules/jsonwebtoken');

const JWT_SECRET = '762b202d614f2d80e9db9816871d1c9b43f2b3a1e63ad4c8';
const API_URL = 'https://api.buildnexdev.in';

const team = [
  {
    name: 'Mrs. Soban Prabhu',
    designation: 'Proprietor',
    tags: 'Field Research, Quality Control, Project Management, Team Leadership, State-Level Coordination',
    imageUrl: '/logo.jpg',
    phoneNumber: '9876543210',
    bio: `Professional Profile
My career in the research industry began in 2007 when, as a postgraduate, I undertook my first field survey in Udumalpet, located in the Coimbatore district of Tamil Nadu. From the very beginning, I approached field research with dedication, discipline, and a strong commitment to achieving project objectives.

Over the years, I worked extensively as a Field Investigator across all districts of Tamil Nadu, gaining comprehensive grassroots experience and deep regional exposure. My consistent focus on data accuracy, quality control, and timely execution earned appreciation directly from clients and stakeholders.

Recognizing my performance and leadership abilities, I was promoted to Field Supervisor. Through effective team coordination, operational planning, and strict adherence to research standards, I further progressed to the roles of Zonal Coordinator and State-Level Coordinator. These positions allowed me to manage larger teams, oversee complex assignments, and ensure high-quality data delivery across multiple regions.

After nearly a decade of hands-on experience and professional growth, I established SMART RESEARCH SOLUTION in 2017. This venture was founded on strong field expertise, ethical research practices, and a commitment to delivering reliable and actionable insights. The organization was built with the support of a skilled and dedicated team, reflecting the collective experience gained over years of field operations.

With nearly 18 years of experience in the research sector, I have successfully handled a diverse range of projects and collaborated with numerous clients across India. I take pride in maintaining long-term professional relationships and consistently delivering high standards of quality, integrity, and client satisfaction.`
  },
  {
    name: 'Mr. R. Elango',
    designation: 'Senior Consultant',
    tags: 'Market Research, Consumer Behavior, Social Studies, Survey Operations, Monitoring & Evaluation, 35+ Years Experience',
    imageUrl: null,
    phoneNumber: '9876543211',
    bio: `Professional Profile
Holds a Bachelor’s degree in Law and a Doctorate in Economics, with over 35 years of experience in research and analytics. Began the professional journey with ORG-MARG, later continuing through its transition into NIQ-GfK.

Over the course of the career, successfully handled and delivered more than 3,000 research projects across India and served as a Master Trainer for large-scale surveys and research programs. Operational and field experience includes major assignments conducted with project execution and monitoring covering all regions of India.

Areas of Specialization
Marketing Research
Consumer Behaviour & Insights
Brand & Media Analytics
Social Studies: Monitoring & Evaluation

In the area of Social Studies and Development Research, projects were undertaken for several Central and State Government departments and leading international development agencies, including World Bank, Planning Commission of India, UNICEF, United Nations Development Programme, USAID, and World Health Organization.

Possessing in-depth knowledge of large-scale survey operations, field management systems, and quality control processes, with a proven track record of successfully managing multi-state assignments. Demonstrated ability to coordinate diverse field teams, conduct capacity-building programs, and ensure smooth implementation of complex research projects across Tamil Nadu and Kerala.

A dedicated professional with strong organizational, leadership, and communication skills, capable of executing assignments independently while effectively collaborating within team environments.

Professional Experience
From 1994 till date
Nielsen (India) Private Limited, Coimbatore. SR. FIELD EXECUTIVE
India
R Elango is working as a Sr DA Executive and has experience of over 25 years in issues related to social research. He has experience in rural development, livelihood, rehabilitation, health, water sanitation Program, and communication etc. He has developed specialized skills in conducting In-depth Discussions, Focus Group Discussions. He has good experience of organizing & imparting pieces of training on various social issues in the states of Tamil Nadu and Kerala. Also, he has an experience of co-ordinating social surveys on a large scale, field-level data quality checks, monitoring the progress of fieldwork completion, also coordinating with data entry centres. He has a holistic understanding of the social sector research, having field co-ordinating multiple sectors - including rural development and poverty alleviation, livelihoods, education, maternal and child health and nutrition, governance, water and sanitation, etc.
From 1993-1994
Department of Anthropology, University of Madras, Madras. Field co-ordinator
India
Field co-ordinator
From 1992-1993
Ministry of Health and Family Welfare – NFHS 2. Field co-ordinator
India
Field co-ordinator for Tamilnadu, Kerala and Bihar

Key Responsibilities and Contributions
1
Work closely with the manager, facilitate, and delegate the work to the Supervisors / interviewers / freelancers & work plan for the supervisor
2
Summarize, evaluate and update on a regular basis the project status in accordance with the established planning schedules
3
Ensuring quality & Productivity at all levels as per the project guidelines
4
Recruit, brief, supervise and perform regular evaluations of freelancers
5
Effectively ensuring Project and logistics management
6
Conduct back-checks and address errors in questionnaires and other logical checks
7
Contribute to the monthly activities report(MIS) & Monitor the daily status of interviews from interviewers, recruiters
8
Ensuring timely Query Resolution
9
Managing team within given time, cost and quality constraints
10
Training all the supervisors in all projects at the initial stage for a better understanding of the project
11
Responsible for Field level data quality checks, Monitoring the progress of fieldwork completion
12
Checking Questionnaire and ensure that all the questions are properly filled new
13
Maintaining the process of backchecking and accompaniments and ensuring updating of the project file on a daily basis
14
Is responsible for the overall field-level data collection timeline

Special Skills
Tsunami rehabilitations project in Kanyakumari, Tamil Nādu (American Red Cross society & CARE India)
Health and Nutrition: Rapid Survey on Children, UNICEF (2013-2014); UNDP survey – Round 1 (Indradhanush); Swachh Bharat Mission by C R C 1 and 2 - PAF; National Immunization Coverage Evaluation (INCHIS 2014); Coverage Evaluation Survey: Measles Rubella Vaccination Campaign Phase 1 - WHO; Midline Evaluation of Avahan Community Mobilization Phase III; ORBIS PRE IMPLEMENTION KAP SURVEY ON REFRACTIVE ERROR; TNHSP Health program by State Govt; TANSAC Self help group training Evaluation; KERALA Cooking habits survey
Livelihood and Rehabilitation: Issue of Photo identity cards to Handloom weavers in India, Ministry of Handloom and Textiles; Child labor study in slums of Hyderabad, CGG; Study on Moving out of poverty in India, World Bank

Language Proficiency
Tamil
English
Malayalam`
  },
  {
    name: 'A. Maria Jacquilin Mary',
    designation: 'Researcher',
    tags: 'Epi Info, SPSS, Public Health, ICMR, Field Surveillance, Epidemiology, Outbreak Investigation, NCAER',
    imageUrl: '/maria.png',
    phoneNumber: '9876543212',
    bio: `Professional Profile
With a strong foundation in public health research, epidemiological surveillance, and data-driven program management, I bring multidisciplinary experience spanning content development, infectious disease research, outbreak investigation, and large-scale field implementation across Tamil Nadu, India.

The carrier started with Content writer with several projects. Also, worked as a project manager in Public Health Institution, USA based project. This was an Anti-Microbial Resistance was established in few districts in Tamilnadu. In COVID period I joined as Technical Assistant in ICMR (Indian Council of Medical Research). There was a field surveillance evaluation in 12 districts of Tamilnadu in PHCs (Primary Health Centre). This research about SARI (Severe Acute Respiratory Infection), ILI (Influence like Illness) and AFI (Acute febrile Illness). An outbreak investigation of COVID in Vellore describes the outbreak in the Paiyur refugee camp. Advance data analysis Epi info and SPSS. Writing protocols for field survey.
Also, I worked as a Field supervisor the project directly from NCAER the survey name Woman’s Empowerment study in Tamilnadu and Kerala.
Youth survey in Tamilnadu about orange economic study

Early Career – Research & Content Development
I began my professional journey as a Content Writer, contributing to multiple research-based and technical writing projects. This role strengthened my ability to interpret scientific information, develop structured documentation, and communicate complex concepts clearly and effectively. It laid the foundation for my later work in public health documentation, protocol development, and reporting.

Project Management – Anti-Microbial Resistance (AMR) Program
I later served as a Project Manager for a USA-based public health initiative focused on Anti-Microbial Resistance (AMR). The program was implemented across selected districts in Tamil Nadu with the goal of strengthening surveillance systems and promoting rational antimicrobial practices.
In this role, I:
• Coordinated with district-level stakeholders and healthcare facilities
• Supervised field-level implementation activities
• Supported monitoring and evaluation of AMR indicators
• Prepared technical reports and documentation
• Ensured alignment between field operations and project objectives

Technical Assistant – Indian Council of Medical Research (ICMR)
During the COVID-19 pandemic, I joined the Indian Council of Medical Research (ICMR) as a Technical Assistant, contributing to large-scale infectious disease surveillance and field evaluation studies across Tamil Nadu.

Field Surveillance & Research
I was actively involved in field surveillance evaluation across 12 districts of Tamil Nadu, working closely with Primary Health Centres (PHCs). The research focused on strengthening surveillance systems for:
• Severe Acute Respiratory Infection (SARI)
• Influenza-Like Illness (ILI)
• Acute Febrile Illness (AFI)

COVID-19 Outbreak Investigation – Vellore
As part of the pandemic response, I participated in a COVID-19 outbreak investigation in Vellore, including detailed documentation of an outbreak in the Paiyur refugee camp.
My responsibilities included:
• Coordinate field data collection and validation
• Epidemiological line listing and contact tracing analysis
• Situation assessment and outbreak description
• Preparation of technical outbreak reports

Core Competencies
• Infectious Disease Surveillance
• Field Epidemiology
• Outbreak Investigation
• Public Health Program Management
• Advanced Data Analysis (Epi Info, SPSS)
• Scientific & Technical Writing
• Stakeholder Coordination

Professional Experience
Recent Projects
NCAER (National Council of Applied Economic Research)
India
Field Supervisor - Women’s Empowerment Study (Tamil Nadu & Kerala)
Recent Projects
NielsenIQ
India
Field Supervisor - Youth Survey / Orange Economic Study (Tamil Nadu)
COVID-19 Period
ICMR (Indian Council of Medical Research)
India
Technical Assistant - Field Surveillance & Outbreak Investigation
USA Based Project
Public Health Institution
India
Project Manager - Anti-Microbial Resistance (AMR) Program

Special Skills
Epi Info, SPSS, Data cleaning and validation, Descriptive and analytical statistics, Writing research protocols for field surveys, Designing data collection tools, Monitoring and evaluation frameworks`
  },
  {
    name: 'Mrs. Uma',
    designation: 'State Co-ordinator',
    tags: 'Manpower Management, Field Coordination, State Operations, Training, Survey Execution, TNHPS',
    imageUrl: '/uma.png',
    phoneNumber: '9876543213',
    bio: `Professional Profile
Our State Co-Coordinator began her career as a Data Entry Operator in the Statistical Department in Tiruchirappalli. During her tenure in the same department, the government initiated the Tamil Nadu House hold Panel Systems Project (TNHPS) survey for the district, where she conducted her first field survey.

She later received specialized training from Emory University, USA, equipping her to handle additional large-scale surveys with expertise and precision. Her exceptional performance and dedication were highly appreciated by the client, leading to her promotion as District Field Coordinator.

Over the years, she has trained numerous candidates across various levels and has actively participated in multiple collaborative projects with clients. The quality and consistency of her work have always spoken for themselves.

Across Tamil Nadu, she has successfully managed manpower supply operations. In every district, she has worked directly with clients to ensure effective coordination and improved outcomes.

Even today, she continues to lead from the front co-ordinating teams, managing manpower supply, and conducting regular field visits to maintain excellence in project execution.

Core Competencies
• Manpower Supply Operations
• Field Survey Coordination
• Team Leadership & Capacity Building
• Quality Assurance & Audit
• Client Stakeholder Coordination

Special Skills
TNHPS (Tamil Nadu Household Panel Systems Project), Emory University Survey Training, District & State Level Research Supervision`
  }
];

async function seedLive() {
  for (const cid of [3, 4]) {
    const token = jwt.sign(
      { id: 1, companyID: cid, role: 'SUPER_ADMIN', isAdmin: 1, isSuperAdmin: 1 },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    for (const m of team) {
      const res = await fetch(`${API_URL}/content/team-members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...m, companyID: cid })
      });
      const data = await res.json();
      console.log(`Added ${m.name} for company ${cid}:`, data.success);
    }
  }
  console.log('Seeded live API successfully!');
}

seedLive().catch(console.error);

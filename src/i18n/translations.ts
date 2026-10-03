export interface ExperienceItem {
    title: string;
    organization: string;
    period: string;
    /** Phrase courte, ou liste de points (affichée en puces) */
    description: string | string[];
    descriptionPlus?: string;
    type: string;
    /** Colonne du parcours : expériences ou formations */
    section: "work" | "education";
    /** Carte mise en avant par un léger accent (teinte, bordure, pastille pleine) */
    highlight?: boolean;
}

export interface SkillCategory {
    name: string;
    skills: string[];
}

export interface ProjectItem {
    title: string;
    theme: string;
    description: string;
    tags: string[];
    link?: string;
    githubLink?: string;
    /** Plusieurs sites dans la même carte : un bouton par site */
    sites?: { name: string; url: string }[];
}

export interface TranslationStructure {
    nav: {
        profile: string;
        journey: string;
        skills: string;
        projects: string;
        contact: string;
    };
    hero: {
        name: string;
        description: string;
        viewProjects: string;
        contactMe: string;
        pauseAnimation: string;
        playAnimation: string;
    };
    experience: {
        title: string;
        academic: string;
        professional: string;
        experiences: ExperienceItem[];
    };
    skills: {
        title: string;
        categories: SkillCategory[];
    };
    projects: {
        title: string;
        details: string;
        seeProject: string;
        items: ProjectItem[];
    };
    contact: {
        title: string;
        subtitle: string;
        directMessage: string;
        networks: string;
        quote: string;
        quoteAuthor: string;
        formLabels: {
            identity: string;
            coordinates: string;
            transmission: string;
        };
        placeholders: {
            name: string;
            email: string;
            message: string;
        };
        submit: string;
        footerNote: string;
    };
    footer: {
        copyright: string;
    };
}

export const translations: Record<Language, TranslationStructure> = {
    fr: {
        // Navigation
        nav: {
            profile: "Profil",
            journey: "Parcours",
            skills: "Competences",
            projects: "Projets",
            contact: "Contact",
        },
        // Hero Section
        hero: {
            name: "Jordy Bacherot",
            description: "Ingénieur en Intelligence Artificielle et enseignant vacataire en IA à l'Université",
            viewProjects: "Voir mes projets",
            contactMe: "Me contacter",
            pauseAnimation: "Mettre l'animation en pause",
            playAnimation: "Relancer l'animation",
        },
        // Experience Section
        experience: {
            title: "Parcours",
            academic: "Formations",
            professional: "Expériences",
            experiences: [
                {
                    title: "Ingénieur en Intelligence Artificielle",
                    organization: "Direction du Numérique - Université de Lorraine",
                    period: "2026 - Présent",
                    description: [
                        "Conception de solutions d'IA : modèles hébergés en interne, outils pour la pédagogie, la recherche et l'administration",
                        "Formation des personnels à l'IA générative",
                        "Pilotage de projets IA : faisabilité, cadrage, suivi",
                    ],
                    type: "Professionnel",
                    section: "work"
                },
                {
                    title: "Vacations d'enseignement",
                    organization: "IDMC - Université de Lorraine",
                    period: "2026 - Présent",
                    description: [
                        "Écosystème technique et conceptuel autour des LLM",
                        "Appeler un LLM, créer un chatbot, automatiser des processus",
                        "Dimensionner des LLM pour les entreprises",
                        "TD « Développement Logiciel avec l'IA »",
                    ],
                    type: "Enseignement",
                    section: "work",
                    highlight: true
                },
                {
                    title: "Alternance - Ingénieur IA Générative - Projet PLEIADES",
                    organization: "Direction du Numérique - Université de Lorraine",
                    period: "2024 - 2026",
                    description: [
                        "Applications d'IA pour la pédagogie, la recherche et l'administration (programme Services & Simplification)",
                        "Test et intégration d'outils open source d'IA générative",
                        "Ateliers et sensibilisations à l'usage de l'IA",
                    ],
                    type: "Professionnel",
                    section: "work"
                },
                {
                    title: "Master Sciences Cognitives",
                    organization: "IDMC",
                    period: "2024 - 2026",
                    description: "Parcours IACH : Intelligence Artificielle Centrée Humain.",
                    descriptionPlus: "Major de promotion",
                    type: "Académique",
                    section: "education"
                },
                {
                    title: "Licence MIASHS",
                    organization: "Université de Lorraine",
                    period: "2021 - 2024",
                    description: "Mathématiques et Informatique Appliquées aux Sciences Humaines et Sociales, parcours Sciences Cognitives.",
                    descriptionPlus: "Major de promotion",
                    type: "Académique",
                    section: "education"
                }
            ],
        },
        // Skills Section
        skills: {
            title: "Competences",
            categories: [
                {
                    name: "Data Science & IA",
                    skills: ["Machine Learning", "Deep Learning", "Scikit-Learn", "PyTorch", "TensorFlow/Keras"]
                },
                {
                    name: "Intégration IA",
                    skills: ["LLMs", "RAG", "LangChain", "LangGraph", "LangFuse", "Ollama", "HuggingFace"]
                },
                {
                    name: "Développement Web & Logiciel",
                    skills: ["Python", "Java", "TypeScript", "React", "Flutter", "Hono", "SQL", "Git", "PostgreSQL/MariaDB", "Supabase", "Docker", "CI/CD", "VPS"]
                },
                {
                    name: "Sciences Cognitives & UX",
                    skills: ["Psychologie Cognitive", "Neurosciences", "Statistiques", "UX Design", "Éthique de l'IA"]
                },
            ],
        },
        // Projects Section
        projects: {
            title: "Projets",
            details: "Détails",
            seeProject: "Voir le site web",
            items: [
                {
                    title: "Création de chatbots RAG",
                    theme: "Intégration IA - Professionnel",
                    description: "Application permettant l'intégration de chatbots RAG dans des applications tierces via API, pour l'assistance aux premières questions utilisateurs sur des logiciels spécifiques.",
                    tags: ["Projet Professionnel", "LLM", "RAG", "LangChain", "LangGraph", "LangFuse", "VLLM"]
                },
                {
                    title: "Algorithme de recommandation de jeux steams",
                    theme: "Embedding + ANN - Académique",
                    description: "Algorithme de recommandation de jeux steams basé sur un ANN (approximate nearest neighbors) et sur les embeddings des utilisateurs.",
                    tags: ["Projet Académique", "Python", "Pytorch", "Embedding", "ANN"]
                },
                {
                    title: "Application fullstack Flutter + Hono de recommandation de jeux",
                    theme: "Développement Web - Académique",
                    description: "Application fullstack de recommandation de jeux Steam basée sur l'algorithme ANN. Déployée sur un VPS avec Docker.",
                    tags: ["Projet Académique", "Flutter", "Dart", "TypeScript", "Hono", "Bun", "MariaDB", "Docker", "Déploiement - VPS", "CI/CD"],
                    githubLink: "https://github.com/JordyBacherot/steam_reco_app"
                },
                {
                    title: "Deep Learning - Application de détection de scènes dangereuses en extèrieur pour personne malvoyante",
                    theme: "Deep Learning - Académique",
                    description: "Application de détection d'éléments dangereux en extérieur pour personnes malvoyantes. Fine-tuning d'un modèle de vision mobile pour la détection d'obstacles (transformer-based).",
                    tags: ["Projet Académique", "Python", "Pytorch", "Deep Learning", "CNN", "Transformers"],
                    link: "https://scene-hazard-detection.vercel.app/",
                    githubLink: "https://github.com/JordyBacherot/DeepLearningProject_SceneHazardDetection"
                },
                {
                    title: "Fine-Tuning LLM pour le Storytelling",
                    theme: "LLM - Académique",
                    description: "Pipeline ML end-to-end pour fine-tuner Qwen 2.5 7B sur la génération de scripts YouTube narratifs (EGO, Lemmino, Squeezie…). Projet d'apprentissage centré sur QLoRA 4-bit et Unsloth, de l'extraction jusqu'à l'évaluation LLM-as-Judge.",
                    tags: ["Projet Académique", "Python", "LLM", "QLoRA", "Unsloth", "HuggingFace", "vLLM", "FastAPI"],
                    link: "https://github.com/JordyBacherot/FineTunning_LLM_StoryTelling"
                },
                {
                    title: "Maison\u00a0Bacherot & Burger\u00a0Buxy\u00a0— Sites vitrines",
                    theme: "Développement Web - Familial",
                    description: "Sites vitrines de deux commerces familiaux en Bourgogne : la boucherie artisanale Maison Bacherot et Burger Buxy, restaurant de burgers maison à Buxy.",
                    tags: ["Projet Personnel", "React", "Vite", "Tailwind CSS v4", "Framer Motion", "GSAP"],
                    sites: [
                        { name: "Maison Bacherot", url: "https://www.boucherie-mercurey.fr/" },
                        { name: "Burger Buxy", url: "https://www.burger-buxy.fr/" },
                    ]
                },

            ],
        },
        // Contact Section
        contact: {
            title: "Contact",
            subtitle: "N'hésitez pas à me contacter pour toute question. Même si c'est pour parler de Dune ...",
            directMessage: "Message",
            networks: "Mes Réseaux",
            quote: "La vie est un jeu dont les règles s'apprennent en y sautant à pieds joints pour être immergé jusqu'au cou, sous peine d'être toujours pris au dépourvu...",
            quoteAuthor: "Dune : La Maison des Mères - Darwi Odrade",
            formLabels: {
                identity: "Identité",
                coordinates: "Coordonnées",
                transmission: "Votre message",
            },
            placeholders: {
                name: "Votre nom",
                email: "votre@email.com",
                message: "Écrivez votre message...",
            },
            submit: "Envoyer",
            footerNote: "Plus qu'à appuyer sur envoyer !",
        },
        // Footer
        footer: {
            copyright: "Jordy - AI & Cognition",
        },
    },

    en: {
        // Navigation
        nav: {
            profile: "Profile",
            journey: "Journey",
            skills: "Skills",
            projects: "Projects",
            contact: "Contact",
        },
        // Hero Section
        hero: {
            name: "Jordy Bacherot",
            description: "Artificial Intelligence Engineer and AI lecturer at the University of Lorraine.",
            viewProjects: "View my projects",
            contactMe: "Contact me",
            pauseAnimation: "Pause animation",
            playAnimation: "Play animation",
        },
        // Experience Section
        experience: {
            title: "Journey",
            academic: "Education",
            professional: "Experience",
            experiences: [
                {
                    title: "Artificial Intelligence Engineer",
                    organization: "Digital Directorate - University of Lorraine",
                    period: "2026 - Present",
                    description: [
                        "AI solution design: in-house hosted models, tools for teaching, research and administration",
                        "Generative AI training for staff",
                        "AI project management: feasibility, scoping, follow-up",
                    ],
                    type: "Professional",
                    section: "work"
                },
                {
                    title: "Part-time university teaching",
                    organization: "IDMC - University of Lorraine",
                    period: "2026 - Present",
                    description: [
                        "Technical and conceptual ecosystem around LLMs",
                        "“Developing with AI” course",
                        "Calling an LLM, building a chatbot, automating processes",
                        "Sizing models for businesses",
                    ],
                    type: "Teaching",
                    section: "work",
                    highlight: true
                },
                {
                    title: "Apprenticeship - Generative AI Engineer - PLEIADES Project",
                    organization: "Digital Directorate - University of Lorraine",
                    period: "2024 - 2026",
                    description: [
                        "AI applications for teaching, research and administration (Services & Simplification programme)",
                        "Testing and integration of open-source generative AI tools",
                        "AI workshops and awareness sessions",
                    ],
                    type: "Professional",
                    section: "work"
                },
                {
                    title: "Master in Cognitive Sciences",
                    organization: "IDMC",
                    period: "2024 - 2026",
                    description: "IACH Track: Human-Centered Artificial Intelligence.",
                    descriptionPlus: "Valedictorian · M1 & M2",
                    type: "Academic",
                    section: "education"
                },
                {
                    title: "Bachelor's in MIASHS",
                    organization: "University of Lorraine",
                    period: "2021 - 2024",
                    description: "Mathematics and Computer Science Applied to Human and Social Sciences, Cognitive Sciences track.",
                    descriptionPlus: "Valedictorian",
                    type: "Academic",
                    section: "education"
                }
            ],
        },
        // Skills Section
        skills: {
            title: "Skills",
            categories: [
                {
                    name: "Data Science & AI",
                    skills: ["Machine Learning", "Deep Learning", "Scikit-Learn", "PyTorch", "TensorFlow/Keras"]
                },
                {
                    name: "AI Integration",
                    skills: ["LLMs", "RAG", "LangChain", "LangGraph", "LangFuse", "Ollama", "HuggingFace"]
                },
                {
                    name: "Web & Software Development",
                    skills: ["Python", "Java", "TypeScript", "React", "Flutter", "Hono", "SQL", "Git", "PostgreSQL/MariaDB", "Supabase", "Docker", "CI/CD", "VPS"]
                },
                {
                    name: "Cognitive Science & UX",
                    skills: ["Cognitive Psychology", "Neuroscience", "Statistics", "UX Design", "AI Ethics"]
                },
            ],
        },
        // Projects Section
        projects: {
            title: "Projects",
            details: "Details",
            seeProject: "See Website",
            items: [
                {
                    title: "RAG Chatbot Development",
                    theme: "AI Integration - Professional",
                    description: "Application enabling RAG chatbot integration into third-party apps via API, handling initial user queries on specific software.",
                    tags: ["Professional Project", "LLM", "RAG", "LangChain", "LangGraph", "LangFuse", "VLLM"]
                },
                {
                    title: "Steam Game Recommendation Algorithm",
                    theme: "Embedding + ANN - Academic",
                    description: "Game recommendation algorithm based on ANN (Approximate Nearest Neighbors) and user embeddings.",
                    tags: ["Academic Project", "Python", "Pytorch", "Embedding", "ANN"]
                },
                {
                    title: "Fullstack Flutter + Hono Recommendation App",
                    theme: "Web Development - Academic",
                    description: "Fullstack Steam game recommendation app based on the ANN algorithm. Deployed on a VPS with Docker.",
                    tags: ["Academic Project", "Flutter", "Dart", "TypeScript", "Hono", "Bun", "MariaDB", "Docker", "VPS Deployment", "CI/CD"],
                    githubLink: "https://github.com/JordyBacherot/steam_reco_app"
                },
                {
                    title: "Deep Learning - Outdoor Hazard Detection for the Visually Impaired",
                    theme: "Deep Learning - Academic",
                    description: "Hazard detection app for outdoor environments designed for visually impaired users. Fine-tuning of a mobile vision model for obstacle detection (transformer-based).",
                    tags: ["Academic Project", "Python", "Pytorch", "Deep Learning", "CNN", "Transformers"],
                    link: "https://scene-hazard-detection.vercel.app/",
                    githubLink: "https://github.com/JordyBacherot/DeepLearningProject_SceneHazardDetection"
                },
                {
                    title: "LLM Fine-Tuning for Storytelling",
                    theme: "LLM - Academic",
                    description: "End-to-end ML pipeline to fine-tune Qwen 2.5 7B on narrative YouTube script generation (EGO, Lemmino, Squeezie style…). Learning project focused on 4-bit QLoRA and Unsloth, from extraction to LLM-as-Judge evaluation.",
                    tags: ["Academic Project", "Python", "LLM", "QLoRA", "Unsloth", "HuggingFace", "vLLM", "FastAPI"],
                    link: "https://github.com/JordyBacherot/FineTunning_LLM_StoryTelling"
                },
                {
                    title: "Maison\u00a0Bacherot & Burger\u00a0Buxy\u00a0— Showcase Websites",
                    theme: "Web Development - Family",
                    description: "Showcase websites for two family businesses in Burgundy: artisanal butcher Maison Bacherot and Burger Buxy, a homemade burger restaurant in Buxy.",
                    tags: ["Personal Project", "React", "Vite", "Tailwind CSS v4", "Framer Motion", "GSAP"],
                    sites: [
                        { name: "Maison Bacherot", url: "https://www.boucherie-mercurey.fr/" },
                        { name: "Burger Buxy", url: "https://www.burger-buxy.fr/" },
                    ]
                },
            ],
        },
        // Contact Section
        contact: {
            title: "Contact",
            subtitle: "Feel free to contact me for any questions. Even if it's to talk about Dune...",
            directMessage: "Message",
            networks: "My Networks",
            quote: "Life is a game whose rules you learn if you leap into it and play it to the hilt.",
            quoteAuthor: "Dune : The House of Mères - Darwi Odrade",
            formLabels: {
                identity: "Identity",
                coordinates: "Coordinates",
                transmission: "Your message",
            },
            placeholders: {
                name: "Your name",
                email: "your@email.com",
                message: "Write your message...",
            },
            submit: "Send",
            footerNote: "Just have to press send!",
        },
        // Footer
        footer: {
            copyright: "Jordy - AI & Cognition",
        },
    },
};

export type Language = 'fr' | 'en';
export type Translations = TranslationStructure;

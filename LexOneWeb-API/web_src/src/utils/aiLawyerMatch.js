// Local directory of demo lawyers used to power the "Find Lawyers" AI search
// while no backend/LLM endpoint is wired up. simulateAiLawyerMatch() is the
// single function that would be replaced by a real API call later.
export const MOCK_LAWYERS_DIRECTORY = [
    {
        id: 'lawyer-corporate-01',
        name: 'Mariana Solis',
        specialty: 'Corporate & Business Law',
        keywords: ['business', 'company', 'startup', 'corporate', 'contract', 'incorporation', 'merger', 'negotiation', 'shareholder'],
        rating: 4.9,
        location: 'Ciudad de Mexico',
        price_range: '$$$',
        bio: 'Helps founders and companies with incorporation, contracts, and commercial negotiations.',
    },
    {
        id: 'lawyer-family-01',
        name: 'Carla Jimenez',
        specialty: 'Family Law',
        keywords: ['family', 'divorce', 'custody', 'child support', 'alimony', 'marriage', 'adoption'],
        rating: 4.8,
        location: 'Guadalajara',
        price_range: '$$',
        bio: 'Focuses on divorce, custody, and family mediation with a calm, practical approach.',
    },
    {
        id: 'lawyer-immigration-01',
        name: 'Hugo Ramirez',
        specialty: 'Immigration Law',
        keywords: ['immigration', 'visa', 'residency', 'citizenship', 'deportation', 'work permit'],
        rating: 4.7,
        location: 'Tijuana',
        price_range: '$$',
        bio: 'Handles visas, residency applications, and immigration appeals.',
    },
    {
        id: 'lawyer-realestate-01',
        name: 'Diego Fernandez',
        specialty: 'Real Estate Law',
        keywords: ['real estate', 'property', 'lease', 'rental', 'tenant', 'landlord', 'purchase', 'deed', 'title'],
        rating: 4.6,
        location: 'Ciudad de Mexico',
        price_range: '$$',
        bio: 'Reviews leases, purchase agreements, and resolves landlord-tenant disputes.',
    },
    {
        id: 'lawyer-labor-01',
        name: 'Patricia Nunez',
        specialty: 'Labor & Employment Law',
        keywords: ['labor', 'employment', 'workplace', 'severance', 'wrongful termination', 'wages', 'harassment'],
        rating: 4.8,
        location: 'Monterrey',
        price_range: '$$',
        bio: 'Represents employees and employers in workplace disputes and severance negotiations.',
    },
    {
        id: 'lawyer-criminal-01',
        name: 'Javier Torres',
        specialty: 'Criminal Defense',
        keywords: ['criminal', 'arrest', 'defense', 'charges', 'bail', 'fraud', 'theft'],
        rating: 4.5,
        location: 'Puebla',
        price_range: '$$$',
        bio: 'Defends clients facing criminal charges, from initial arrest through trial.',
    },
    {
        id: 'lawyer-ip-01',
        name: 'Sofia Castillo',
        specialty: 'Intellectual Property',
        keywords: ['trademark', 'patent', 'copyright', 'intellectual property', 'brand', 'infringement'],
        rating: 4.9,
        location: 'Ciudad de Mexico',
        price_range: '$$$',
        bio: 'Protects trademarks, patents, and copyrights for creators and businesses.',
    },
    {
        id: 'lawyer-tax-01',
        name: 'Roberto Aguilar',
        specialty: 'Tax Law',
        keywords: ['tax', 'taxes', 'audit', 'sat', 'deduction', 'fiscal', 'accounting'],
        rating: 4.6,
        location: 'Queretaro',
        price_range: '$$',
        bio: 'Advises individuals and businesses on tax compliance, audits, and disputes with tax authorities.',
    },
];

const scoreLawyer = (lawyer, queryLower, queryWords) => {
    let score = 0;

    lawyer.keywords.forEach((keyword) => {
        if (queryLower.includes(keyword)) {
            score += 3;
        }
    });

    const specialtyLower = lawyer.specialty.toLowerCase();
    queryWords.forEach((word) => {
        if (word.length > 2 && specialtyLower.includes(word)) {
            score += 1;
        }
    });

    return score;
};

const buildReason = (lawyer, score) => {
    if (score <= 0) {
        return `Highly rated generalist (${lawyer.rating}★) who can take a first look at your situation.`;
    }
    return `Specializes in ${lawyer.specialty} — closely matches the details you shared.`;
};

// Simulates sending the user's request + lawyer directory to an AI for a
// recommendation. Returns a short summary plus the top ranked matches.
export const simulateAiLawyerMatch = (query, lawyers = MOCK_LAWYERS_DIRECTORY) => {
    const queryLower = (query || '').toLowerCase();
    const queryWords = queryLower.split(/[^a-z0-9]+/i).filter(Boolean);

    const scored = lawyers.map((lawyer) => ({
        lawyer,
        score: scoreLawyer(lawyer, queryLower, queryWords),
    }));

    scored.sort((a, b) => b.score - a.score || b.lawyer.rating - a.lawyer.rating);

    const hasStrongMatch = scored[0] && scored[0].score > 0;
    const top = scored.slice(0, 3).map(({ lawyer, score }) => ({
        lawyer,
        reason: buildReason(lawyer, score),
    }));

    const summary = hasStrongMatch
        ? `Based on what you shared, here are the lawyers best suited to help:`
        : `I couldn't find an exact specialty match, so here are our top-rated lawyers who can help or point you in the right direction:`;

    return { summary, matches: top };
};

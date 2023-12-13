export const INFINITE_QUERY_LIMIT = 10;

export const PLANS = [
    {
        name: "Free Forever",
        slug: "free",
        quota: 10,
        pagesPerPdf: 50,
        maxDocumentSize: {
            bytes: 4_194_304, // ** in bytes,
            mb: "4MB"
        },
        price: {
            amount: 0,
            priceIds: {
                test: "",
                production: "",
            },
        },
    },
    {
        name: "Pro",
        slug: "pro",
        quota: 50,
        pagesPerPdf: 200,
        maxDocumentSize: {
            bytes: 16_777_216, // ** in bytes
            mb: "16MB"
        },
        price: {
            amount: 7.99,
            priceIds: {
                test: "price_1OMLWBCdBNTwtb1qvOQfJaxW",
                production: "",
            },
        },
    },
];

export const pricingItems = [
    {
        plan: "Free",
        tagline: "Works best for individuals, studens and small side projects.",
        quota: 10,
        features: [
            {
                text: "5 pages per PDF",
                footnote: "The maximum amount of pages per PDF-file.",
            },
            {
                text: "4MB file size limit",
                footnote: "The maximum file size of a single PDF file.",
            },
            {
                text: "Mobile-friendly interface",
            },
            {
                text: "Upload more thatn 10 documents / month",
                footnote: "You can upload a maximum of 10 documents per month.",
                negative: true,
            },
            {
                text: "Higher-quality responses",
                footnote:
                    "Better algorithmic responses for enhanced content quality",
                negative: true,
            },
            {
                text: "Priority support",
                negative: true,
            },
        ],
    },
    {
        plan: "Pro",
        tagline: "Works best for pros, bigger projects and commercial use.",
        quota: PLANS.find((p) => p.slug === "pro")!.quota,
        features: [
            {
                text: "25 pages per PDF",
                footnote: "The maximum amount of pages per PDF-file.",
            },
            {
                text: "16MB file size limit",
                footnote: "The maximum file size of a single PDF file.",
            },
            {
                text: "Mobile-friendly interface",
            },
            {
                text: "Upload more thatn 10 documents / month",
                footnote: "You can upload a maximum of 50 documents per month.",
            },
            {
                text: "Higher-quality responses",
                footnote:
                    "Better algorithmic responses for enhanced content quality",
            },
            {
                text: "Priority support",
            },
        ],
    },
];

export const INFINITE_QUERY_LIMIT = 10;

export const PLANS = [
    {
        name: "Free Forever",
        slug: "free",
        quota: 3,
        pagesPerPdf: 20,
        maxDocumentSize: {
            bytes: 4_194_304, // ** in bytes,
            mb: "4MB",
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
        quota: 100,
        pagesPerPdf: 100,
        maxDocumentSize: {
            bytes: 16_777_216, // ** in bytes
            mb: "16MB",
        },
        price: {
            amount: 7.99,
            priceIds: {
                test: "price_1ORdlPLD5fYySUvDYoalF4rC",
                production: "",
            },
        },
    },
];

export const pricingItems = [
    {
        plan: "Free",
        tagline: "Works best for individuals, studens and small projects.",
        quota: 10,
        features: [
            {
                text: "4MB file size limit",
                footnote: "The maximum file size of a single PDF file.",
            },
            {
                text: "Upload Quoata of 3 files",
                footnote: "You can upload 3 files or less.",
            },
            {
                text: "Files up to 20 pages",
                footnote: "The mximum number of pages your files can have.",
            },
            {
                text: "Mobile-friendly interface",
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
                text: "16MB file size limit",
                footnote: "The maximum file size of a single PDF file.",
            },
            {
                text: "Upload Quoata of 100 files",
                footnote: "The maximum number of files you can upload.",
            },
            {
                text: "Files up to 100 pages",
                footnote: "The mximum number of pages your files can have.",
            },
            {
                text: "Mobile-friendly interface",
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

// Insights / articles (spec Part 6.11). Six planned launch pieces.
// Each publishes under a named author once written; `published: false` keeps it off the
// live list and out of the sitemap until Laura writes it. Adding an article = filling `body`.

export type Article = {
  slug: string;
  title: string;
  tag: string;
  dek: string;
  date: string | null; // ISO, set when published
  author: string | null; // [[LAURA]] — a named Person, per spec
  readingMinutes: number | null;
  published: boolean;
  body: string[] | null; // paragraphs; [[LAURA]] until written
};

export const articles: Article[] = [
  {
    slug: "units-awarded-is-a-vanity-metric",
    title: "Units awarded is a vanity metric. Here's the one that isn't.",
    tag: "Franchise",
    dek: "The number that actually predicts a healthy franchise system — and why the award count hides it.",
    date: null,
    author: null,
    readingMinutes: null,
    published: false,
    body: null,
  },
  {
    slug: "first-100-days-founder-led-portfolio-company",
    title: "What actually happens in the first 100 days inside a founder-led portfolio company",
    tag: "Private equity",
    dek: "The under-served lower-middle-market angle: what post-close execution really looks like when the founder is still in the building.",
    date: null,
    author: null,
    readingMinutes: null,
    published: false,
    body: null,
  },
  {
    slug: "five-numbers-a-20m-business-watches-weekly",
    title: "The five numbers a $20M business should look at weekly, and the twenty it shouldn't",
    tag: "Systems",
    dek: "Most dashboards measure everything and decide nothing. Here's the short list that actually runs the business.",
    date: null,
    author: null,
    readingMinutes: null,
    published: false,
    body: null,
  },
  {
    slug: "why-operating-improvements-dont-survive-the-consultant",
    title: "Why most operating improvements don't survive the consultant leaving",
    tag: "Operating",
    dek: "The handover problem nobody scopes for — and how to build an engagement that keeps running after you go.",
    date: null,
    author: null,
    readingMinutes: null,
    published: false,
    body: null,
  },
  {
    slug: "running-an-american-business-as-an-australian",
    title: "Running an American business as an Australian, and the four things that don't translate",
    tag: "Cross-border",
    dek: "What an operator moving between the two markets learns the hard way.",
    date: null,
    author: null,
    readingMinutes: null,
    published: false,
    body: null,
  },
  {
    slug: "four-wall-ebitda-the-arithmetic-most-operators-arent-doing",
    title: "Four-wall EBITDA: the arithmetic most multi-unit operators aren't doing",
    tag: "Multi-unit",
    dek: "The unit-level P&L that decides whether growth is worth having.",
    date: null,
    author: null,
    readingMinutes: null,
    published: false,
    body: null,
  },
];

export const publishedArticles = () => articles.filter((a) => a.published);
export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

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
    date: null, // set on publish
    author: null, // [[LAURA — byline]]
    readingMinutes: 4,
    published: false, // DRAFT — needs Laura's approval + byline before it goes live
    body: [
      "The healthiest number in a franchise system isn't units awarded, units sold, or even units open. It's the share of open units running at or above a defined four-wall EBITDA. Awards measure how good your development team is at selling. Four-wall EBITDA measures whether the thing they sold actually works. Those are not the same question, and a system can win the first one while quietly losing the second.",
      "Here is how that happens. A brand adds fifty awards in a year and puts the number on a slide. Meanwhile a third of the units already open are below the line — not making money for the operator after rent, labour and the real cost of running the four walls. Every new operator is buying into an average, and the average is falling. Awards go up. The system gets weaker. Nobody looking at the award count can see it.",
      "Units awarded is an easy number to love. It goes up and to the right, it fits in a press release, and it is usually the number the development team is paid on. Early on it isn't even the wrong number — in a young system, awards are close to the only signal you have. The problem starts later, when the brand is big enough to be judged on how its operators are doing and the story is still being told in awards.",
      "There are two gaps the award count hides. The first is between awarded and open: units sold that never open, or open two years late, or get handed back. The second is more important — between open and working: units that are trading but don't clear four-wall EBITDA. The first gap embarrasses you. The second one compounds, because unhappy operators don't validate, don't reinvest, don't buy their second and third unit, and eventually don't stay quiet about it.",
      "So measure the thing that predicts all of that. The headline is the percentage of open units at or above a target four-wall EBITDA, tracked over time. Underneath it, look at the distribution of AUV, not the average — an average hides the bottom quartile, and the bottom quartile is where your risk lives. And watch the field support ratio: the number of units each field consultant actually supports, because past a certain point support becomes a calendar invite rather than help, and four-wall performance follows the ratio down.",
      "This is not an argument against growth. It is an argument for growing on a base that works, because a franchise system is the one business model where your customers publish their results to your next customers. A prospective franchisee reads Item 19, calls three existing operators, and asks the only question that matters: are you making money? Units awarded cannot answer that. The share of units clearing four-wall EBITDA is the answer, whether or not you are the one saying it.",
      "If you only change one number on your board this quarter, retire units awarded from the top line and put the four-wall figure there instead. Keep selling. Just stop grading yourself on the sale.",
    ],
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

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
    author: null, // [[LAURA — byline]]
    readingMinutes: 4,
    published: false, // DRAFT — needs approval + byline
    body: [
      "In a founder-led portfolio company, the first hundred days are not about writing the value creation plan — that mostly exists already, in the deck. They're about installing an operating cadence the founder will actually run, and earning the right to change things before you change them. The failure mode is rarely a bad plan. It's a good plan the founder quietly ignores because the sponsor's operator showed up and started rearranging the business they spent a decade building.",
      "The founder is not a portfolio-company executive who happens to own stock. They are the person who made every decision of consequence for years, and post-close they are watching to see whether the new owners understand that. Language does real work here. \"Workstream,\" \"target operating model,\" and \"100-day plan\" can read as an occupation force. The same work described as \"let's get the numbers we both trust in front of us every week\" reads as help. It is the same work.",
      "So the first two weeks go to one thing: a single set of numbers everyone believes. Most lower-middle-market founder businesses run on management accounts that are late, contested, or built to minimise tax rather than to run the company. You cannot manage against the underwriting case if the actuals land on the 25th and no two people in the room agree on them. Fix that first, before touching anything strategic.",
      "Weeks three to six build the scoreboard — five to seven numbers tied to the EBITDA bridge, reviewed weekly with the founder in the room, not in a board pack sent afterward. The point is a shared instrument. When a number moves the wrong way, the conversation is then about the number, not about whose fault it is. That distinction is most of what determines whether the next ten months are collaborative or defensive.",
      "Sometimes the honest finding in the first hundred days is that the founder is the constraint and isn't ready to move off it. That is a real outcome, not a failure of the process, and the earlier the sponsor knows it the better every later decision gets — including whether the value creation plan quietly depends on a second-in-command who doesn't exist yet.",
      "The transition-out is designed in from day one, not bolted on at the end. The measure of a good hundred days is not how much you did. It's how much is now running without you, and whether the founder would still take your call in month seven.",
    ],
  },
  {
    slug: "five-numbers-a-20m-business-watches-weekly",
    title: "The five numbers a $20M business should look at weekly, and the twenty it shouldn't",
    tag: "Systems",
    dek: "Most dashboards measure everything and decide nothing. Here's the short list that actually runs the business.",
    date: null,
    author: null, // [[LAURA — byline]]
    readingMinutes: 5,
    published: false, // DRAFT — needs approval + byline
    body: [
      "A $20M business does not need a dashboard with forty tiles. It needs about five numbers, looked at weekly, that a decision actually hangs on. The rest are monthly, or they're vanity. The test for the weekly set is simple: if the number moved, would you do something different this week? If the answer is no, it doesn't belong on the weekly board — it belongs on a monthly one, or in the bin.",
      "One: cash, as a rolling thirteen-week forecast, not a bank balance. A balance tells you where you've been. The thirteen-week tells you where you're going, and it buys you the two or three weeks of warning that turn a cash crisis into a cash decision. Every business that got surprised by running out of money had the information to see it coming and wasn't looking at it weekly.",
      "Two: revenue you can count on — booked or committed revenue, and pipeline coverage against the number you need. Recognised revenue is a lagging indicator; by the time it's down, the quarter is already decided. Coverage is the leading one, and it's the number that tells you in week three whether the quarter is in trouble.",
      "Three: gross margin or contribution, by line, not blended. A blended margin holding steady can hide one line quietly collapsing while another props it up. You don't manage the average — you manage the lines, and you can only manage what the report actually separates out.",
      "Four: a labour-efficiency ratio — revenue per full-time head, or labour as a percentage of revenue, whichever fits your business. For most companies under $50M, labour is the largest controllable cost, and it's the first place drift shows up when nobody's watching it weekly.",
      "Five: one leading operational number specific to you. For a franchise, units below four-wall EBITDA. For a services firm, utilisation. For an e-commerce business, contribution after ad spend. This is the number only you can name, and it's usually the most valuable one on the board, because it's the one that moves before the financials do.",
      "And the twenty you shouldn't watch weekly: website traffic, social followers, gross bookings before refunds, headcount as if it were an achievement, cumulative totals that only ever go up, and a satisfaction score you check often enough to worry about but not often enough to act on. They feel like progress. None of them changes what you do on Monday. Measure less, and decide more.",
    ],
  },
  {
    slug: "why-operating-improvements-dont-survive-the-consultant",
    title: "Why most operating improvements don't survive the consultant leaving",
    tag: "Operating",
    dek: "The handover problem nobody scopes for — and how to build an engagement that keeps running after you go.",
    date: null,
    author: null, // [[LAURA — byline]]
    readingMinutes: 4,
    published: false, // DRAFT — needs approval + byline
    body: [
      "Most operating improvements don't survive the adviser leaving because the improvement never actually moved into the business. It lived in the outsider's spreadsheet, their weekly follow-up, and the borrowed authority of being the expensive expert in the room. Take those three things away and the business reverts — because nothing structural changed. A person was temporarily doing a job the organisation still can't do on its own.",
      "The tell is a great final report. A document is the easiest deliverable to produce and the easiest to quietly ignore. Good advice is worth paying for — but if the engagement ends with a bound PDF and a presentation and nothing else, the odds it's still in use in six months are poor, and most people involved half-know it on the day.",
      "What survives instead is unglamorous: a process someone inside owns, a number they're accountable for, and a cadence that runs whether or not you're in the room. Improvements stick when they have a named owner who was trained on the job rather than briefed on it — someone whose week now includes the new thing, by default, without being reminded.",
      "This is why we write the leaving date into the scope before we start. A fixed end forces the handover to be the plan from day one: you build the thing to run without you precisely because you've promised to go. An open-ended arrangement quietly optimises for the opposite, whatever everyone's intentions are.",
      "It's slower this way, and it can look less impressive. Doing it for the client and handing over a finished result is faster in the moment and makes a better slide. It also produces the reversion. Training your people to run it is the less satisfying choice that actually holds after the invoice is paid.",
      "Then we come back at ninety days to see whether it held. Partly that's integrity. Partly it's that knowing there's a check at ninety days changes how carefully the handover gets done in the first place — including by us.",
    ],
  },
  {
    slug: "running-an-american-business-as-an-australian",
    title: "Running an American business as an Australian, and the four things that don't translate",
    tag: "Cross-border",
    dek: "What an operator moving between the two markets learns the hard way.",
    date: null,
    author: null, // [[LAURA — byline]]
    readingMinutes: 4,
    published: false, // DRAFT — needs approval + byline
    body: [
      "Most of running a business is the same in Sydney and in New Jersey. Cash is cash, a good operator is a good operator, and customers can smell indifference in any accent. But a few things genuinely don't translate, and each one has cost Australians money on the way into the US market. Four stand out.",
      "One: the sheer size of the market changes the strategy, not just the numbers. In Australia you often win by being one of the few — a national footprint is achievable and defensible. In the US the same category has a hundred credible competitors, and \"national\" is a decade-long campaign, not a plan for next year. Strategies built on the idea that you can cover the market don't survive contact with a country this big. You win by owning a segment or a geography, not by being everywhere.",
      "Two: employment. At-will employment and the litigation posture around it are a different world from the Australian system. Hiring is faster and letting people go is faster, but the documentation discipline and the cost of getting it wrong are unfamiliar and unforgiving. Australians used to a more protective regime tend to under-document, and it's an expensive habit to bring across.",
      "Three: directness. Australian workplace feedback is blunt, and the send-up is a form of affection. American professional norms are warmer on the surface and more careful underneath, and blunt Australian feedback can land as hostility rather than honesty. The content can be word-for-word identical; the wrapping is not, and the wrapping decides whether it's heard or resented.",
      "Four: self-promotion. Tall-poppy instinct runs deep, and understatement is a virtue at home. In the US, understatement often reads as not having much to say. You don't need to become a different person — but a market that expects you to state plainly what you're good at will quietly penalise the reflex to play it down.",
      "None of this makes one country's way better. The Australian instincts — direct, unshowy, sceptical of hype — are an advantage in the US precisely because they're rare there. The trick is knowing which ones to keep, and which four to adjust.",
    ],
  },
  {
    slug: "four-wall-ebitda-the-arithmetic-most-operators-arent-doing",
    title: "Four-wall EBITDA: the arithmetic most multi-unit operators aren't doing",
    tag: "Multi-unit",
    dek: "The unit-level P&L that decides whether growth is worth having.",
    date: null,
    author: null, // [[LAURA — byline]]
    readingMinutes: 5,
    published: false, // DRAFT — needs approval + byline
    body: [
      "Four-wall EBITDA is the profit a single unit makes after every cost inside its four walls — rent, labour, cost of goods, local marketing, the lot — but before corporate overhead, royalty allocation, interest and depreciation. It answers one question: does this location, on its own, make money? Most multi-unit operators can quote system revenue and blended margin to the decimal and cannot cleanly say which of their units clear four-wall. That's the arithmetic that's missing, and it's the one that matters most.",
      "It's missing because the P&L is built for the entity, not the unit. Costs land in shared buckets, allocations get political, and a strong flagship quietly subsidises three weak units inside a blended number that looks perfectly healthy. Growth then compounds the problem: you open unit twelve using the economics of unit three — your best one — and wonder later why the average keeps drifting down.",
      "Doing it honestly is mostly discipline about where the line sits. Push every controllable cost down to the unit, and be strict about what's four-wall versus what's above-store: rent yes, the regional manager's car no; local marketing yes, the national brand campaign no. Consistency matters more than being theoretically perfect — the same rules applied to every unit will tell you the truth even if a purist would argue with a line or two.",
      "What it reveals is the distribution. Rank every unit by four-wall EBITDA and the estate usually sorts into three groups: the ones that work, the ones that could with a specific fix, and the ones that won't. Most operators are surprised by how much of total profit comes from the top third — and how much cash the bottom third quietly burns while the blended number hides it.",
      "What you do with it is triage: close, fix or convert, unit by unit. You cannot make those calls on a blended number. You can make them the moment you can see each unit on its own — and the same view tells you where the next unit should go, and where it absolutely shouldn't.",
      "It's uncomfortable arithmetic, because it names your worst units and sometimes your favourite one. But every serious decision — where to open, what to renegotiate, what to close, what the business is worth to a buyer — runs off this number. If you're not doing it, you're managing the average and hoping. The operators who do it aren't smarter; they're just looking at the right number.",
    ],
  },
];

export const publishedArticles = () => articles.filter((a) => a.published);
export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

import CaseStudy, { type CaseStudyData } from "./CaseStudy";
import DirectionalDependenceLab from "./DirectionalDependenceLab";
import DDSurface from "./DDSurface";
import StatCounter from "./StatCounter";
import MethodFlow from "./MethodFlow";

const data: CaseStudyData = {
  accent: "#a855f7",
  accentRgb: "168, 85, 247",
  accentLight: "#d8b4fe",
  category: "Statistics · Senior Thesis",
  title: "Modeling Bivariate Directional Dependence using Order Statistics and Concomitants",
  tagline:
    "Correlation tells you two variables move together. It can't tell you which one leads. This thesis builds a sampling algorithm that does, and finds that uniformly-distributed variables carry the strongest directional signal.",
  authors: "Wahid T. Ratul · Engin A. Sungur",
  affiliation: "University of Minnesota, Morris, Division of Science and Mathematics",
  meta: [
    { label: "Type", value: "Senior Thesis + Seminar" },
    { label: "Field", value: "Statistics" },
    { label: "Method", value: "Order statistics · Concomitants" },
    { label: "Tools", value: "R" },
  ],
  heroLogos: [
    { domain: "umn.edu", label: "University of Minnesota" },
    { domain: "r-project.org", label: "R" },
  ],
  source: [
    { label: "GitHub, thesis + slides", href: "https://github.com/ratul003/Modeling-Directional-Dependence-using-Order-Statistics-and-Concomitants" },
  ],
  sections: [
    {
      id: "abstract",
      num: "01",
      label: "Abstract",
      heading: "A simulation study for the direction of dependence",
      paras: [
        "We introduce a new algorithm to sample bivariate directional dependence based on order statistics and concomitants. Simulating data from the Normal and Uniform distributions and applying concomitant methods, we found that uniformly-distributed variables tend to exhibit the strongest directional dependency.",
        "Building on that, we randomly generated the model parameters of the sampling algorithm to search for the combinations that produce the strongest bivariate directional dependence. The construction adapts easily to a wide range of dependence-modeling problems with the same structure.",
      ],
      blocks: [
        { type: "tags", items: ["Concomitants", "Order Statistics", "Directional Dependence", "Correlation", "Monte Carlo"] },
      ],
    },
    {
      id: "motivation",
      num: "02",
      label: "Motivation",
      heading: "Direction is not the same as causality, and correlation is blind to both",
      paras: [
        "In a bivariate setting, directional dependence asks whether the distributional behavior of one variable changes in response to the other, a question distinct from the symmetric strength that Pearson's correlation reports, and distinct from causality, which generally needs a designed experiment.",
        "Pearson's r is symmetric by construction, so a single coefficient can never separate the X→Y story from the Y→X one. Following Sungur & Celebioglu (2011), I attack the asymmetry through order: if X drives Y, then ordering the data by X should substantially scramble Y's own ordering, leaving a weaker tie between Y's order statistics and its concomitants.",
      ],
      blocks: [
        {
          type: "math",
          items: [
            { tex: "r_{XY}=\\frac{1}{(n-1)s_X s_Y}\\sum_{i=1}^{n}(y_i-\\bar y)(x_i-\\bar x)", note: "Pearson's r, symmetric: identical whether you read it X→Y or Y→X." },
          ],
        },
      ],
    },
    {
      id: "machinery",
      num: "03",
      label: "Machinery",
      heading: "Order statistics and concomitants",
      paras: [
        "Let (X, Y) be an absolutely continuous random pair. Take a sample of n observations and let X₁:ₙ ≤ X₂:ₙ ≤ … ≤ Xₙ:ₙ be the order statistics of X. The Y value that travels with Xᵢ:ₙ is the concomitant Y[ᵢ:ₙ]. Symmetrically, X[ᵢ:ₙ] is the X-concomitant of Yᵢ:ₙ.",
        "The directional measures compare each variable's own order statistics against its concomitants. He & Nagaraja (2007) give sample estimators for these directional correlations:",
      ],
      blocks: [
        {
          type: "math",
          items: [
            { tex: "r_{X\\to Y}=\\frac{\\sum_{i=1}^{n}(y_{i:n}-\\bar y)(y_{[i:n]}-\\bar y)}{\\sum_{i=1}^{n}(y_{i:n}-\\bar y)^2}", note: "Estimator of ρ_{X→Y}: how well Y's natural order survives ordering by X." },
            { tex: "r_{Y\\to X}=\\frac{\\sum_{i=1}^{n}(x_{i:n}-\\bar x)(x_{[i:n]}-\\bar x)}{\\sum_{i=1}^{n}(x_{i:n}-\\bar x)^2}", note: "Estimator of ρ_{Y→X}: the mirror image, ordering by Y." },
          ],
        },
        {
          type: "callout",
          text: "Sungur's ordering criterion: X → Y is the dominant direction when |r on the Y side| < |r on the X side|, ordering by X disrupts Y's order more than the reverse.",
        },
      ],
    },
    {
      id: "algorithm",
      num: "04",
      label: "Sampling algorithm",
      heading: "Generating a pair with a tunable direction",
      paras: [
        "Take an independent pair (U, V), both Normal, or both Uniform, and a parameter matrix that mixes them into (X, Y). With α₁ > α₂ > 0, β₁ > 0 and β₂ < 0, the linear combinations below produce a bivariate pair whose dependence structure is controlled entirely by four numbers:",
      ],
      blocks: [
        {
          type: "math",
          items: [
            { tex: "X=\\alpha_1 U+\\alpha_2 V,\\qquad Y=\\beta_1 U+\\beta_2 V", note: "The mixing weights decide how much of the shared driver U each variable inherits, and therefore the asymmetry between them." },
          ],
        },
        {
          type: "node",
          node: (
            <MethodFlow
              stages={[
                { title: "Draw (U, V)", sub: "Independent pair, Normal or Uniform" },
                { title: "Mix into (X, Y)", sub: "X = α₁U + α₂V, Y = β₁U + β₂V" },
                { title: "Order + concomitants", sub: "Sort X, carry Y alongside as concomitants" },
                { title: "Directional r", sub: "Order statistics vs concomitants, each side" },
                { title: "Ordering criterion", sub: "Smaller |r| side is the response variable" },
                { title: "Parameter search", sub: "Repeat across 100 parameter sets, map Δr" },
              ]}
              loop="Re-randomize the mixing weights and resample to trace the directional surface."
            />
          ),
        },
      ],
    },
    {
      id: "lab",
      num: "05",
      label: "Interactive",
      heading: "Run the algorithm yourself",
      paras: [
        "This is the thesis algorithm, live. Move the weights, switch the driving distribution between Uniform and Normal, and resample. The panel computes the order statistics and concomitants on the spot, reports the directional correlation on each side, and applies the ordering criterion to call the dominant direction.",
      ],
      blocks: [
        { type: "node", node: <DirectionalDependenceLab /> },
        { type: "callout", text: "Try this: keep the weights fixed and flip Uniform → Normal. The gap between the two correlations, the directional signal, typically collapses under the Normal, exactly the thesis result." },
      ],
    },
    {
      id: "results",
      num: "06",
      label: "Results",
      heading: "Uniform carries the signal; Normal hides it",
      paras: [
        "Running the dependence cycle on data simulated from each distribution gave the two key correlations below. Under the Normal the two sides are practically tied, so no direction can be claimed. Under the Uniform they separate sharply, the asymmetry that signals genuine directional dependence.",
      ],
      blocks: [
        {
          type: "node",
          node: (
            <StatCounter
              stats={[
                { value: 100, label: "Parameter sets searched for the strongest direction" },
                { value: 0.73, decimals: 2, label: "Uniform Y-side correlation, vs 0.53 on X: the directional signal" },
                { value: 2, label: "Driving distributions compared, Normal and Uniform" },
                { value: 4, label: "Mixing weights that tune the dependence" },
              ]}
            />
          ),
        },
        {
          type: "table",
          head: ["Driving distribution", "Y-side r", "X-side r", "Read"],
          rows: [
            ["Normal", "0.50", "0.48", "≈ equal → inconclusive"],
            ["Uniform", "0.73", "0.53", "clear asymmetry → directional"],
          ],
          caption: "Pairwise correlations from the distributional cycle (Figures 3-4 of the thesis).",
        },
      ],
    },
    {
      id: "parameters",
      num: "07",
      label: "Parameter search",
      heading: "Hunting the strongest direction across 100 simulations",
      paras: [
        "The final stage generated 100 parameter sets under the uniform constraints, and for each measured the directional gap Δr = r(X→Y) − r(Y→X) against the contrasts Δα = α₁ − α₂ and Δβ = β₁ − β₂. Plotting Δr over that plane gives a rough, peaked landscape, this surface is simulated live in your browser:",
      ],
      blocks: [
        { type: "node", node: <DDSurface /> },
        {
          type: "table",
          head: ["Δα", "Δβ", "r(X→Y)", "r(Y→X)", "Δr"],
          rows: [
            ["4.06", "29.12", "−0.31", "−0.30", "−0.01"],
            ["22.40", "51.28", "0.37", "0.31", "0.06"],
            ["12.51", "16.75", "0.05", "0.06", "−0.01"],
            ["7.18", "30.48", "0.01", "0.00", "0.01"],
            ["0.26", "28.08", "0.23", "0.22", "0.01"],
            ["10.43", "20.58", "0.75", "0.70", "0.05"],
          ],
          caption: "Six of the 100 simulated parameter sets. Strongest directional dependence appeared near Δα ≈ 4.32, Δβ ≈ −11.98 (Δr ≈ 0.06).",
        },
        {
          type: "callout",
          text: "A negative result worth stating: across the surface and scatter plots, Δα and Δβ showed no clean relationship with Δr, and whether the underlying (X, Y) were strongly correlated (ρ = 0.9) or uncorrelated (ρ = 0) made no difference to the directional dependence. Direction and strength are genuinely different axes.",
        },
      ],
    },
    {
      id: "future",
      num: "08",
      label: "Future work",
      heading: "Where it goes next",
      paras: [
        "The sampling algorithm extends naturally to discrete or continuous direction variables, opening more general dependence models. Promising next steps: raising the dimension of the parameter set, generating (U, V) from other distributions, and holding (α₁, α₂) fixed while varying (β₁, β₂) to map how the dependence structure responds.",
      ],
    },
    {
      id: "references",
      num: "09",
      label: "References",
      heading: "Selected references",
      blocks: [
        {
          type: "refs",
          items: [
            "Sungur, E. A., & Celebioglu, S. (2011). Copulas with Directional Dependence Property. Gazi University Journal of Science, 24(3), 415-424.",
            "Nelsen, R., & Úbeda-Flores, M. (2012). Directional Dependence in Multivariate Distributions. Annals of the Institute of Statistical Mathematics, 64(3), 677-685.",
            "He, Q., & Nagaraja, H. N. (2009). Correlation Estimation Using Concomitants of Order Statistics from Bivariate Normal Samples. Communications in Statistics, Theory and Methods, 38, 2003-2015.",
            "Barnett, V., Green, P. J., & Robinson, A. (1976). Concomitants and Correlation Estimates. Biometrika, 63(2), 323-329.",
            "Schechtman, E., & Yitzhaki, S. (2002). On the Proper Bounds of the Gini Correlation. Economics Letters, 63(2), 133-138.",
          ],
        },
      ],
    },
  ],
  related: [
    { label: "Directional Dependence via Copulas (HHMI)", href: "https://research-copulas-directional-depend.vercel.app" },
    { label: "Cognitive Change & NHANES (UROP)", href: "https://research-nhanes-cognitive.vercel.app" },
    { label: "Portfolio home", href: "https://wahid-ratul.vercel.app" },
  ],
};

export default function Page() {
  return <CaseStudy data={data} />;
}

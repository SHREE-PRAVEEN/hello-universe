const prisma = require("../utils/prisma");

// Lightweight rules engine (upgrade path for future AI recommender).
const mapUseCaseToCategory = (useCase) => {
  const normalized = useCase.toLowerCase();

  if (normalized.includes("farm") || normalized.includes("agri")) return "AGRICULTURE";
  if (normalized.includes("security") || normalized.includes("surveillance")) return "SECURITY";
  if (normalized.includes("home") || normalized.includes("smart")) return "HOME_AUTOMATION";
  return "INDUSTRIAL_AUTOMATION";
};

const recommendRobot = async ({ budget, useCase }) => {
  const solutionCategory = mapUseCaseToCategory(useCase);

  const [solutions, guides, products] = await Promise.all([
    prisma.solution.findMany({
      where: {
        category: solutionCategory,
        estimatedCost: { lte: budget },
      },
      take: 3,
      orderBy: { estimatedCost: "asc" },
    }),
    prisma.guide.findMany({
      where: {
        OR: [
          { title: { contains: useCase, mode: "insensitive" } },
          { tags: { has: useCase.toLowerCase() } },
        ],
      },
      take: 3,
    }),
    prisma.product.findMany({
      where: {
        price: { lte: budget / 2 },
      },
      take: 6,
      orderBy: { price: "asc" },
    }),
  ]);

  const estimatedCost = products.reduce((sum, product) => sum + Number(product.price), 0);

  return {
    recommendedDesign: solutions[0]?.title || `${useCase} Starter Robot`,
    partsList: products,
    estimatedCost,
    relatedGuides: guides,
    relatedSolutions: solutions,
  };
};

module.exports = { recommendRobot };

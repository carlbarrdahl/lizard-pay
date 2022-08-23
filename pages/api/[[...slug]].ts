import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter, expressWrapper } from "next-connect";
import cors from "cors";

const router = createRouter<
  NextApiRequest & { params: any },
  NextApiResponse
>().use(expressWrapper(cors()));

function validate({ body }) {
  console.log("validate");
  return async (req, res, next) => {
    const { success, error } = body.safeParse(req.body);
    console.log(success, error, req.body);
    if (!success) {
      throw new Error(error);
    }
    return await next();
  };
}

router.post("/api/webhooks/alchemy/create", async (req, res) => {
  const { address, invoice } = req.body;

  const sdk = require("api")("@alchemy-docs/v1.0#1q84j11l6middf5");
  return sdk
    .createWebhook({
      addresses: [address],
      network: "ETH_GOERLI",
      webhook_type: "ADDRESS_ACTIVITY",
      webhook_url: `${serverURL}/webhooks/alchemy?invoice=${invoice}`,
    })
    .then((r) => res.status(201).json(r));
});
router.post("/api/webhooks/alchemy/receive", async (req, res) => {
  // const invoiceId =
  return res.json({ status: "ok" });
});
router.post("/api/quiz", validate({ body: CreateQuiz }), async (req, res) => {
  console.log("CREATE");
  const quiz = await prisma.quiz.create({
    data: wrapCreate(req.body),
    include: { questions: { include: { answers: true } } },
  });
  console.log("CREATE2", quiz);
  return res.status(201).json(quiz);
});

const quizIncludeDefault = {
  questions: {
    include: { answers: { select: { id: true, title: true } } },
  },
};
const quizIncludeWithAnswers = {
  questions: {
    include: { answers: { select: { id: true, title: true, correct: true } } },
  },
};
router.get("/api/quiz/", async (req, res) => {
  const quizzes = await prisma.quiz.findMany({
    where: { ownerId: 1 },
    include: quizIncludeDefault,
  });
  return res.json(quizzes);
});

router.get("/api/quiz/:quizId", async (req, res) => {
  const quiz = await prisma.quiz
    .findFirst({
      where: { id: Number(req.params.quizId) },
      include: quizIncludeDefault,
    })
    .then((q) => {
      return {
        ...q,
        questions: q?.questions.map((question) => ({
          ...question,
          // Store type instead?
          // type: question.answers.
        })),
      };
    })
    .catch(console.log);
  return res.json(quiz);
});

router.all((req, res) => {
  res.status(405).json({
    error: "Method not allowed",
  });
});

export default router.handler({
  onError(err, req, res) {
    console.log("error", err);
    res.status(400).json({
      error: (err as Error).message,
    });
  },
});

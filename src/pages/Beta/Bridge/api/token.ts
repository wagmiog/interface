// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(
  req: any,
  res: any
) {
  const tokens = await fetch(req.headers.referer + "tokens.json").then((res) =>
    res.json()
  );
  res.status(200).json({
    status: true,
    data: tokens,
  });
}

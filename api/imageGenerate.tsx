/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.query);

  const param1 = req.query.param1;
  let param2 = req.query.param2;
  param2 = String(param2).replace("ipfs://", "https://ipfs.io/ipfs/");

  try {
    //   const satoriHTML = (await import("satori-html")).default;

    //   const markup = satoriHTML.html(`
    // <img
    //   src=${param2} style="height: 400; width: 600; display: flex; flex-direction: column; align-items: center; justify-content: center;"
    // />`);

    const response = await fetch(param2);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // const svg = await satori(markup, {
    //   width: 600,
    //   height: 400,
    //   fonts: [],
    // });

    // Convert SVG to PNG using Sharp
    const pngBuffer = await sharp(buffer).toFormat("png").toBuffer();

    // Set the content type to PNG and send the response
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "max-age=10");
    res.send(pngBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
}

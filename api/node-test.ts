import { VercelRequest, VercelResponse } from "@vercel/node";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

let postsArray = [];
let selectedData;

export default async function (req: VercelRequest, res: VercelResponse) {
  if (req.method == "POST") {
    const fid = req.body?.untrustedData?.fid;
    const { hash } = req.body?.untrustedData.castId;
    const buttonIndex = req.body.untrustedData.buttonIndex;

    if (buttonIndex === 2) {
      res.status(200).setHeader("Content-Type", "text/html").send(`
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width" />
      <meta property="og:title" content="mint tapped" />
      <meta
        property="og:image"
        content="https://i.postimg.cc/9M36GCbZ/frame-img-2.png"
      />
      <meta property="fc:frame" content="vNext" />
      <meta
      property="fc:frame:image"
      content="https://i.postimg.cc/9M36GCbZ/frame-img-2.png?image_Redirect=https://uplink.wtf/basedmanagement/mintboard/post/${selectedData.id}?referrer=0x5371d2E73edf765752121426b842063fbd84f713"
    />
    </head>
  </html>
      `);
    } else {
      await fetchDataAndStore();
      const randomPost = getRandomPost();
      selectedData = randomPost;

      res.status(200).setHeader("Content-Type", "text/html").send(`
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width" />
      <meta property="og:title" content="randomize Mints" />
      <meta
        property="og:image"
        content="https://vercel-node-test-sepia.vercel.app/api/imageGenerate?param1=${
          randomPost.id
        }&param2=${String(randomPost.edition.imageURI)}"
      />
      <meta property="fc:frame" content="vNext" />
      <meta
        property="fc:frame:image"
        content="https://vercel-node-test-sepia.vercel.app/api/imageGenerate?param1=${
          randomPost.id
        }&param2=${String(randomPost.edition.imageURI)}"
      />
      <meta
        property="fc:frame:button:1"
        content="Randomise"
      />
      <meta
        property="fc:frame:button:2"
        content="Mint"
      />
      <meta
        name="fc:frame:post_url"
        content="https://vercel-node-test-sepia.vercel.app/api/node-test"
      />
    </head>
  </html>
      `);
    }
  } else {
  }
}

async function getBMNFTs() {
  const client = new ApolloClient({
    uri: "https://hub.uplink.wtf/api/graphql",
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      query mintBoard($spaceName: String!) {
        mintBoard(spaceName: $spaceName) {
          id
          referrer
          posts {
            id
            created
            totalMints
            author {
              id
              address
              userName
              displayName
              profileAvatar
            }
            edition {
              id
              chainId
              contractAddress
              name
              symbol
              editionSize
              royaltyBPS
              fundsRecipient
              defaultAdmin
              saleConfig {
                publicSalePrice
                maxSalePurchasePerAddress
                publicSaleStart
                publicSaleEnd
                presaleStart
                presaleEnd
                presaleMerkleRoot
              }
              description
              animationURI
              imageURI
              referrer
            }
          }
        }
      }
    `,
    variables: {
      spaceName: "basedmanagement",
    },
  });

  return data;
}

async function fetchDataAndStore() {
  try {
    const data = await getBMNFTs(); // Call your function
    postsArray = data.mintBoard.posts; // Extract and store the posts
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function getRandomPost() {
  if (postsArray.length === 0) {
    console.error(
      "No posts available. Ensure fetchDataAndStore has been called."
    );
    return null;
  }

  const randomIndex = Math.floor(Math.random() * postsArray.length);
  return postsArray[randomIndex];
}

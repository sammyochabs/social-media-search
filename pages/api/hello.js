// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

async function handler(req, res) {
  req.body = JSON.parse(req.body);
  let term = req.body.searchValue;
  const url = `https://api.twitter.com/2/tweets/search/recent?query=${term}&max_results=100&expansions=attachments.media_keys,author_id&user.fields=username&media.fields=url`;
  const resp = await fetch(url, {
    method: "GET",
    headers: {
      Authorization:
        "Bearer AAAAAAAAAAAAAAAAAAAAAF9IRAEAAAAAlvZ5FFM5tappFincPtqWODRDKBs%3DnZHFpBXBUy3ftBXs2GdehndKIgZuf4rBD3sB7e0eRg9cBGXgXv",
      "Access-Control-Allow-Origin": "*",
    },
    redirect: "follow",
  });
  const tweets = await resp.json();

  const vidResp = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=100&key=AIzaSyBZf_-RivsmpSnTvb7EOL1Ma303ovwNI3s&q=${term}`,
    {
      method: "GET",
      redirect: "follow",
    }
  );

  const videos = await vidResp.json();

  res.status(200).json({ tweets, videos });
}

export default handler;

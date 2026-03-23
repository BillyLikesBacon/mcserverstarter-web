import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send({ error: "Only POST allowed" });
    return;
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = "BillyLikesBacon/mcserverstarter";
  const WORKFLOW_FILE = "main.yml";
  const BRANCH = "main";

  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
        body: JSON.stringify({ ref: BRANCH }),
      }
    );

    if (response.status === 204) {
      // Success, no content returned
      res.status(200).json({ status: "Workflow triggered!" });
    } else {
      // Only try to parse JSON if there is content
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }
      res.status(response.status).json({ status: "Failed", detail: data });
    }
  } catch (err) {
    res.status(500).json({ status: "Error", detail: err.message });
  }
}
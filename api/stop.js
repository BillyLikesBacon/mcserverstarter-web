import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = "BillyLikesBacon/mcserverstarter";
  const WORKFLOW_FILE = "SeleniumSTOP.yml";  // Stop workflow
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

    if (response.status === 204) return res.status(200).json({ status: "Stop triggered!" });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
    return res.status(response.status).json({ status: "Failed", detail: data });
  } catch (err) {
    return res.status(500).json({ status: "Error", detail: err.message });
  }
}
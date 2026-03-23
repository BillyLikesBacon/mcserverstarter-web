import os
import requests
from flask import Flask, jsonify

app = Flask(__name__)

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
REPO = "BillyLikesBacon/mcserverstarter"
WORKFLOW_FILE = "main.yml"
BRANCH = "main"

@app.route("/", methods=["POST"])
def trigger():
    url = f"https://api.github.com/repos/{REPO}/actions/workflows/{WORKFLOW_FILE}/dispatches"
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json"
    }
    r = requests.post(url, json={"ref": BRANCH}, headers=headers)
    if r.status_code == 204:
        return jsonify({"status": "Workflow triggered!"})
    else:
        return jsonify({"status": "Failed", "detail": r.json()}), 400

def main(request):
    # Vercel serverless entrypoint
    with app.test_request_context(
        path=request.path,
        base_url=request.base_url,
        query_string=request.query_string,
        method=request.method,
        headers=request.headers,
        data=request.get_data()
    ):
        return app.full_dispatch_request()
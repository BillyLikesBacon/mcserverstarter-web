from flask import Flask, jsonify, request #Force Deploy
import os
import requests

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
    data = {"ref": BRANCH}

    response = requests.post(url, json=data, headers=headers)
    if response.status_code == 204:
        return jsonify({"status": "Workflow triggered!"})
    else:
        return jsonify({"status": "Failed", "detail": response.json()}), 400

def main(vercel_request):
    with app.test_request_context(
        path=vercel_request.path,
        base_url=vercel_request.base_url,
        query_string=vercel_request.query_string,
        method=vercel_request.method,
        headers=vercel_request.headers,
        data=vercel_request.get_data()
    ):
        return app.full_dispatch_request()
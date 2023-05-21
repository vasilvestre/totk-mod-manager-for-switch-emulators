import { Octokit, App } from "octokit";

const octokit = new Octokit({
    auth: 'YOUR-TOKEN'
})

await octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
    owner: 'OWNER',
    repo: 'REPO',
    headers: {
        'X-GitHub-Api-Version': '2022-11-28'
    }
})
import {Octokit} from "octokit";
import {Endpoints} from "@octokit/types";

const octokit = new Octokit({ auth: process.env.GITHUB_AUTH_TOKEN });

export type GithubRelease = Endpoints["GET /repos/{owner}/{repo}/releases/latest"]["response"]

export async function fetchGithubUpdatedMods(): Promise<GithubRelease> {
    return await octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
        owner: 'HolographicWings',
        repo: 'TOTK-Mods-collection',
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });
}
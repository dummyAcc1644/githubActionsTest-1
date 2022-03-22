const core = require('@actions/core');
const github = require('@actions/github');

run();
async function run() {
  const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
  const context = github.context;
  try {
    // Get info of the fork PR
    const prNumber = context.issue.number;
    const {data} = await octokit.rest.pulls.get({
      ...context.repo,
      pull_number: prNumber
    });
    const branch = `${data.user.login}-${data.head.ref}`;
    const ref = `refs/heads/${branch}`;
    const sha = data.head.sha;

    // Look up if branch for fork PR exists in base repo
    let res = await octokit.rest.repos.getBranch({
      ...context.repo,
      branch
    });

    if (res.status === 200) {
      // If branch already exists update it to match fork PR state
      await octokit.rest.git.updateRef({
        ...context.repo,
        sha,
        ref,
        force: true
      })
    } else if (res.status === 404) {
      // If branch doesn't exist for the forked PR, create one so we can get a
      // build for it
      await octokit.rest.git.createRef({
        ...context.repo,
        ref,
        sha: sha
      });
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

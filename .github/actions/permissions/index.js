const core = require('@actions/core');
const github = require('@actions/github');

run();
async function run() {
  const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
  const context = github.context;
  try {
    // Get permission level
    const {data} = await octokit.rest.repos.getCollaboratorPermissionLevel({
      ...context.repo,
      username: context.actor
    });

    if (!['admin','write'].includes(data.permission)) {
      core.setFailed('User doesn\'t have write permissions or higher');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

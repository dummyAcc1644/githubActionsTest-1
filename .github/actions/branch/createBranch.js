const core = require('@actions/core');
const github = require('@actions/github');

const octokit = new github.GitHub(process.env.GITHUB_TOKEN);
run();

async function run() {
  let branch = core.getInput('branch');
  let sha = core.getInput('sha');
  core.debug(`branch: ${branch} and sha: ${sha}`);
}

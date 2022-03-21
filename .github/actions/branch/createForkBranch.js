const core = require('@actions/core');
const github = require('@actions/github');

const octokit = new github.GitHub(process.env.GITHUB_TOKEN);
run();

async function run() {
  try {
    let branch = core.getInput('branch');
    let sha = core.getInput('sha');
    core.debug(`branch: ${branch} and sha: ${sha}`);

    branch = branch.replace('refs/heads/', '');
    let ref = `refs/heads/${branch}`;

    // Testing if there is a PR related to the commit
    let {data: prs} = await octokit.repos.listPullRequestsAssociatedWithCommit({
      ...github.context.repo,
      commit_sha: github.context.sha
    });

    core.debug(`prs: ${prs}`)

    try {
      await octokit.rest.repos.getBranch({
        ...github.context.repo,
        branch
      });
    } catch (error) {
      if (error.name === 'HttpError' && error.status === 404) {
        console.debug('in if')
        // const resp = await octokit.rest.git.createRef({
        //   ref,
        //   sha: sha || context.sha,
        //   ...context.repo,
        // });
        // core.debug(`response: ${resp.data.ref}`);
        // return resp?.data?.ref === ref;
      } else {
        // If
        throw Error(error);
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

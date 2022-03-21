const core = require('@actions/core');
const github = require('@actions/github');

run();

async function run() {
  const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
  const context = github.context;
  try {
    // Need to grab PR number since the event won't have the sha/branch name available
    console.log(`context: ${toJSON(context)}`);
    let prNumber = github.context.issue.number;
    console.log('prNumber', prNumber)
    let prInfo = octokit.rest.pulls.get({
      ...context.repo,
      pull_number: prNumber
    });
    console.log(`pr info: ${toJSON(prInfo)}`);

    // let branch = core.getInput('branch');
    // let sha = core.getInput('sha');
    // console.log(`branch: ${github.context.branch} and sha: ${github.context.sha}`)
    // core.debug(`branch: ${branch} and sha: ${sha}`);

    // branch = branch.replace('refs/heads/', '');
    // let ref = `refs/heads/${branch}`;
    // core.debug(`ref: ${ref}`);
    // Testing if there is a PR related to the commit
    // let {data: prs} = await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
    //   ...github.context.repo,
    //   commit_sha: github.context.sha
    // });

    // core.debug(`prs: ${prs}`)

    // TODO: replace hardcoded branch and ref
    let branch = 'blah';
    let ref = 'refs/heads/blah';

    try {
      await octokit.rest.repos.getBranch({
        ...github.context.repo,
        branch
      });
    } catch (error) {
      if (error.name === 'HttpError' && error.status === 404) {
        console.log('in if');
        // core.debug('in if')
        const resp = await octokit.rest.git.createRef({
          ref,
          sha: sha || context.sha,
          ...context.repo,
        });
        console.log(`response: ${resp}`);
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

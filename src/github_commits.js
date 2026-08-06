const axios = require("axios").default;

const parseData = (resData) => {
  if (resData.errors) {
    throw new Error(`GitHub GraphQL error: ${JSON.stringify(resData.errors)}`);
  }

  const user = resData.data?.user;
  if (!user) {
    throw new Error("GitHub GraphQL returned empty user data");
  }

  const sumStargazers = user.repositories.edges.reduce(
    (sum, node) => sum + (node.node.stargazers.totalCount || 0),
    0
  );

  return {
    totalRepositories: user.repositories.totalCount,
    totalCommits: user.contributionsCollection.totalCommitContributions,
    contributions: user.repositoriesContributedTo.totalCount,
    pullRequests: user.pullRequests.totalCount,
    closedIssues: user.closedIssues.totalCount,
    followers: user.followers.totalCount,
    totalStargazers: sumStargazers,
  };
};

const get = async (username, token) => {
  const body = {
    query: `
      query {
        user(login: "${username}") {
          name
          login
          contributionsCollection {
            totalCommitContributions
            restrictedContributionsCount
          }
          repositoriesContributedTo(contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
            totalCount
          }
          pullRequests {
            totalCount
          }
          openIssues: issues(states: OPEN) {
            totalCount
          }
          closedIssues: issues(states: CLOSED) {
            totalCount
          }
          followers {
            totalCount
          }
          repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
            totalCount
            edges {
              cursor
              node {
                name
                stargazers {
                  totalCount
                }
                watchers {
                  totalCount	
                }
              }
            }
          }
        }
      }
    `,
    variables: {},
  };

  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
  };

  const response = await axios.post("https://api.github.com/graphql", body, options);
  return parseData(response.data);
};

module.exports = { get };
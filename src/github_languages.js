const axios = require("axios").default;

const parseData = (resData) => {
  if (resData.errors) {
    throw new Error(`GitHub Languages GraphQL error: ${JSON.stringify(resData.errors)}`);
  }

  const user = resData.data?.user;
  if (!user) {
    throw new Error("GitHub Languages GraphQL returned empty user data");
  }

  const repNodes = user.repositories.nodes;
  const resultArray = [];

  repNodes.forEach((repNode) => {
    const langNodes = repNode.languages.edges;
    langNodes.forEach((langNode) => {
      resultArray.push({ [langNode.node.name]: langNode.size });
    });
  });

  const reducedMap = resultArray.reduce((accumulator, item) => {
    Object.keys(item).forEach((key) => {
      accumulator[key] = (accumulator[key] || 0) + item[key];
    });
    return accumulator;
  }, {});

  const sortable = [];
  let allSize = 0;
  for (const language in reducedMap) {
    sortable.push([language, reducedMap[language]]);
    allSize += reducedMap[language];
  }

  sortable.sort((a, b) => b[1] - a[1]);

  const languages = sortable.map((item) => ({
    name: item[0],
    totalSize: item[1],
    percentage: Math.round((item[1] / allSize) * 100 * 10) / 10,
  }));

  return {
    totalRepositories: user.repositories.totalCount,
    totalSize: allSize,
    languages,
  };
};

const get = async (username, token) => {
  const body = {
    query: `
      query {
        user(login: "${username}") {
          repositories(isFork: false, privacy: PUBLIC, ownerAffiliations: [OWNER], first: 100, orderBy: {field: NAME, direction: ASC}) {
            totalCount
            nodes {
              name
              owner {
                login
              }
              languages(first: 100, orderBy: {field: SIZE, direction: DESC}) {
                totalCount
                edges {
                  size
                  node {
                    name
                  }
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
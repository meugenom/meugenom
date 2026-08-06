const axios = require("axios").default;

const parseData = (resData) => {
  if (resData.errors) {
    throw new Error(`LeetCode GraphQL error: ${JSON.stringify(resData.errors)}`);
  }

  const data = resData.data;
  if (!data || !data.matchedUser) {
    throw new Error("LeetCode GraphQL returned empty data");
  }

  const acSubmissionNum = data.matchedUser.submitStats.acSubmissionNum;
  const problemSolvedStats = data.matchedUser.problemSolvedStats;
  const allQuestionsStats = data.allQuestionsStats;

  return {
    allQuestionsStats: [
      { difficulty: "All", count: allQuestionsStats[0].count },
      { difficulty: "Easy", count: allQuestionsStats[1].count },
      { difficulty: "Medium", count: allQuestionsStats[2].count },
      { difficulty: "Hard", count: allQuestionsStats[3].count },
    ],
    problemSolvedStats: [
      { difficulty: "Easy", percentage: problemSolvedStats[0].percentage },
      { difficulty: "Medium", percentage: problemSolvedStats[1].percentage },
      { difficulty: "Hard", percentage: problemSolvedStats[2].percentage },
    ],
    acSubmissionNum: [
      { difficulty: "All", count: acSubmissionNum[0].count },
      { difficulty: "Easy", count: acSubmissionNum[1].count },
      { difficulty: "Medium", count: acSubmissionNum[2].count },
      { difficulty: "Hard", count: acSubmissionNum[3].count },
    ],
  };
};

const get = async (username) => {
  const body = {
    query: `
      {	
        matchedUser(username: "${username}") {
          username
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
          problemSolvedStats: problemsSolvedBeatsStats {
            difficulty
            percentage
          }
        }				  
        allQuestionsStats: allQuestionsCount {
          difficulty
          count
        }
      }
    `,
    variables: { username },
  };

  const options = {
    headers: {
      "Content-Type": "application/json",
      Referer: "https://leetcode.com",
    },
  };

  const response = await axios.post("https://leetcode.com/graphql", body, options);
  return parseData(response.data);
};

module.exports = { get };
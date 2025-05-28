const fs = require("fs");
const svgHeader = require("./svg_github_bicycle_total_parts/header")
const svgFooter = require("./svg_github_bicycle_total_parts/footer")

//icons
const star = require("./svg_github_bicycle_total_parts/star")
const followers = require("./svg_github_bicycle_total_parts/followers")
const repositories = require("./svg_github_bicycle_total_parts/repositories")
const commits = require("./svg_github_bicycle_total_parts/commits")
const contributions = require("./svg_github_bicycle_total_parts/contributions")
const issues = require("./svg_github_bicycle_total_parts/issues")
const pullRequests = require("./svg_github_bicycle_total_parts/pullRequests")
const lantern = require("./svg_github_bicycle_total_parts/lantern")
const bump = require("./svg_github_bicycle_total_parts/bump");
const tree = require("./svg_github_bicycle_total_parts/tree");

//declarations
let out = svgHeader.header;

const generateSVG = async function (info) {

	//console.log(info)

	await setInfo(info);
  
  //construct all to one template
  out = out + svgFooter.footer;

  await fs.writeFile("./assets/github-total-bicycle.svg", out, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

function setInfo(info){
	out = out +
	`
	<g fill="none" stroke-width="1" class="ground">
		
		
		${pullRequests.pullRequests}
		<text x="-40" y="145" stroke-width="1" stroke="#3288bd" fill="#3288bd" class="totals">Total PRs: ${info["pullRequests"]}</text>
		<g id="lantern" transform="translate(-15, 150) scale(1.5)">
			${lantern.lantern}
		</g>
		<g id="bump" transform="translate(-30, 210) scale(1.0)">
		    ${bump.bump}
		</g>

		<g id="tree" transform="translate(90, 15) scale(1.5)">
		    ${tree.tree}
		</g>


		${issues.issues}
		<text x="250" y="145" stroke-width="1" stroke="#3288bd" fill="#3288bd" class="totals">Closed Issues: ${info["closedIssues"]}</text>
		<g id="lantern" transform="translate(285, 150) scale(1.5)">
			${lantern.lantern}
		</g>
		<g id="bump" transform="translate(270, 210) scale(1.0)">
		    ${bump.bump}
		</g>


		${contributions.contributions}
		<text x="555" y="145" stroke-width="1" stroke="#3288bd" fill="#3288bd" class="totals">Contributions: ${info["contributions"]}</text>
		<g id="lantern" transform="translate(585, 150) scale(1.5)">
			${lantern.lantern}
		</g>
		<g id="bump" transform="translate(570, 210) scale(1.0)">
		    ${bump.bump}
		</g>
		<g id="tree" transform="translate(690, 15) scale(1.5)">
		    ${tree.tree}
		</g>


		${commits.commits}
		<text x="830" y="145" stroke-width="1" stroke="#3288bd" fill="#3288bd" class="totals">Total Commits: ${info["totalCommits"]}</text>
		<g id="lantern" transform="translate(885, 150) scale(1.5)">
			${lantern.lantern}
		</g>
		<g id="bump" transform="translate(870, 210) scale(1.0)">
		    ${bump.bump}
		</g>



		${repositories.repositories}
		<text x="1120" y="145" stroke-width="1" stroke="#3288bd" fill="#3288bd" class="totals">Github Repositories: ${info["totalRepositories"]}</text>
		<g id="lantern" transform="translate(1185, 150) scale(1.5)">
			${lantern.lantern}
		</g>
		<g id="bump" transform="translate(1170, 210) scale(1.0)">
		    ${bump.bump}
		</g>
		<g id="tree" transform="translate(1290, 15) scale(1.5)">
		    ${tree.tree}
		</g>



		${followers.followers}
		<text x="1455" y="145" stroke-width="1" stroke="#3288bd" fill="#3288bd" class="totals">Followers: ${info["followers"]}</text>
		<g id="lantern" transform="translate(1485, 150) scale(1.5)">
			${lantern.lantern}
		</g>
		<g id="bump" transform="translate(1470, 210) scale(1.0)">
		    ${bump.bump}
		</g>




		${star.star}
		<text x="1730" y="145" stroke-width="1" stroke="#3288bd" fill="#3288bd" class="totals">Total Stars Earned: ${info["totalStargazers"]}</text>
		<g id="lantern" transform="translate(1785, 150) scale(1.5)">
			${lantern.lantern}
		</g>
		<g id="bump" transform="translate(1770, 210) scale(1.0)">
		    ${bump.bump}
		</g>

	</g>`
}

exports.generateSVG = generateSVG;


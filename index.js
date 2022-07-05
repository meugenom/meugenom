// index.js
const Mustache = require('mustache');
const fs = require('fs');
const MUSTACHE_MAIN_DIR = './main.mustache';
const axios = require('axios').default;


let DATA = {
  name: 'Eugen',
  city: 'Neu-Isenburg',
  url: 'meugenom.com',
  mail: 'hallo@meugenom.com',
  date: new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: 'Europe/Berlin',
  }),
  leetcode: {
	countAll : 0,
	submissionsAll : 0,
	byDifficulty: {
		easy : {
			name: "EASY",
			count: 0,
			submissions : 0
		},
		medium : {
			name: "MEDIUM",
			count: 0,
			submissions : 0
		},
		 hard : {
			name: "HARD",
			count: 0,
			submissions : 0
		}
	}
  }


};



function generateReadMe() {
  fs.readFile(MUSTACHE_MAIN_DIR, (err, data) =>  {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
  });
}

function getProfile() {

	let username = "meugenom";
	let body =  { 
		query: `
		{
			matchedUser(username: "${username}") {
				username
				submitStats: submitStatsGlobal {
				  acSubmissionNum {
					difficulty
					count
					submissions
				  }
				}
			  }
		}
		`, 
		variables: {}
	}
	let options = {
		headers: {
			'Content-Type': 'application/json'
		}
	}
	axios.post('https://leetcode.com/graphql',body, options)
	.then((response)=>{
			//console.log(response.data);
			setBadge(JSON.stringify(response.data));
	});
}

function setBadge(res) {
	let object = JSON.parse(res)["data"];
	let arr = object["matchedUser"]["submitStats"]["acSubmissionNum"];
	
	DATA.leetcode.countAll = arr[0]["count"]
	DATA.leetcode.submissionsAll = arr[0]["submissions"]

	DATA.leetcode.byDifficulty.easy.count = arr[1]["count"]
	DATA.leetcode.byDifficulty.easy.submissions = arr[1]["submissions"]

	DATA.leetcode.byDifficulty.medium.count = arr[2]["count"]
	DATA.leetcode.byDifficulty.medium.submissions = arr[2]["submissions"]

	DATA.leetcode.byDifficulty.hard.count = arr[3]["count"]
	DATA.leetcode.byDifficulty.hard.submissions = arr[3]["submissions"]

	//console.log(arr);
	/*
	axios.get('/user?ID=12345')
  		.then(function (response) {
    		// handle success
    		console.log(response);
  		})
  		.catch(function (error) {
    	// handle error
    	console.log(error);
  		})
  		.then(function () {
    	// always executed
  	});
	*/

	generateReadMe();
}


getProfile();




const wait = (amount = 0) => new Promise(resolve => setTimeout(resolve, amount));
alert('welcome to twitter')
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");







//-----------------------------get tweets------------------------------------------------------------------------
async function getTweet() {
  // Function to get New Tweet Bodies
  let tweetIds = [];

  // } // Load Tweet Elements by checking for specific Attribute
  let articles = document.querySelectorAll('article');
  let tweets=[];
  for (let art of articles)
  {
    let dataTestId = art.getAttribute("data-testid");
      if (dataTestId == "tweet") {
        tweets.push(art);
      }
  } 
  let parsedTweets = [];
  let sentiment;
  for (let tweet=0;tweet<tweets.length;tweet++) {
    let aTags = tweets[tweet].getElementsByTagName("a");
    for (let aTag=0; aTag<aTags.length;aTag++) {
      let href = aTags[aTag].getAttribute("href");
      if (href.includes("/status/")) {
        let tweetId = href.split("/status/");
        tweetId = tweetId[1];
        if(tweetId.length>19)
        {
          continue;
        }
        else if(!(tweetId in parsedTweets)) {
          tweetIds.push(tweetId);
          let divs = tweets[tweet].getElementsByTagName('div')
          
          for (let di of divs)
            {
              let attr = di.getAttribute("data-testid");
              if(attr == "tweetText")
                {

                  const result = {text:String}
                  result.text=di.innerText
                  var raw = [result];
                  //Using cross-site scripting since the rest api uses an http request
                  chrome.runtime.sendMessage({type: "POST", url: "http://twitter-extn.eba-iz3p2gzp.us-west-1.elasticbeanstalk.com/api/sentiment-score", data: raw}, function(response) {
                  sentiment = response;
                  addsemoji(tweets[tweet], sentiment);
                  });
                  
                  parsedTweets[tweetId]= di.innerText;

                }
            }
          }
        }
      } 
    } 
  return parsedTweets;
}
//------------------------------------------------------------------------------------------------------------------



//---------------------------------------------------add emoji-----------------------------------------------

  function addsemoji(art,sentiment) 
  {
      let dataTestId = art.getAttribute("data-testid");
        if (dataTestId == "tweet") {
          //tweets.push(art);
          let divs = art.getElementsByTagName('div');
          for (let di of divs)
          {
            let attr1 = di.getAttribute("class");
            if(attr1 == "css-1dbjc4n r-18u37iz r-1wbh5a2 r-13hce6t")
              { 
                if(di.firstChild.children.length==4)
                {
                  continue;
                }
                else{
                const div = document.createElement('div')
                div.setAttribute('dir','ltr')
                div.setAttribute('aria-hidden','true')
                div.setAttribute('id','find-me')
                div.className="css-901oao r-14j79pv r-1q142lx r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-s1qlax r-qvutc0"
                if(sentiment[0].detected_mood=="positive"){
                  div.innerHTML ="<span class='css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0'>· Detected Mood: 😊</span>"
                }
                else if(sentiment[0].detected_mood=="negative"){
                  div.innerHTML ="<span class='css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0'>· Detected Mood: ☹️</span>"
                }
                else if(sentiment[0].detected_mood=="neutral"){
                div.innerHTML ="<span class='css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0'>· Detected Mood: 😐</span>"}
                di.firstChild.appendChild(div)
                }
            }
          }
        }  
  }
//-----------------------------------------------------------------------------------------------------------------





//-----------------------------------------------------------------------Main Funciton
let main = async function () {

  let parsedTweetsGlobal = {};
  await wait(5000);
  parsedTweetsGlobal = await getTweet();
  window.addEventListener("scroll", async function () {
    let newParsedTweets = await getTweet();

    let newDistinctTweets = new Object();
    for (let newTweetID in newParsedTweets) {
      if (!(newTweetID in parsedTweetsGlobal)) {
        newDistinctTweets[newTweetID] = newParsedTweets[newTweetID];
      }
    }

    parsedTweetsGlobal = { ...parsedTweetsGlobal, ...newParsedTweets };
  });
};

main();

# Tweet Analysis
1. ## Rest-api-server  
    * This folder contains the code for the two rest api end_points.  
    * The index.js file contains the router for both the api's.
    * The server is deployed using AWS Elastic Beanstalk on an EC2 server instance.  
    * Following are the api's:  
      * http://twitter-extn.eba-iz3p2gzp.us-west-1.elasticbeanstalk.com/api/sentiment-score
      * http://twitter-extn.eba-iz3p2gzp.us-west-1.elasticbeanstalk.com/api/language-detection
     
2. ## twitter_chrome_extension
    * Contains the manifest.json configuration file.  
    * index.js contains the primary executable script.  
    * background.js file contains an event listener for the `chrome.runtime.sendMessage` function to facilitate an http request from https.
    
3. ## Execution
    * To use the chrome extension unload the `twitter_chrome_extension` folder and once you open twitter, **reload the page** to make the extension active.
    

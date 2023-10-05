# HRI app, a Jacks.Media project for [Combased.io](http//combased.io)

This app provides calculations of metadata based upon wallet addresses on the MultiversX blockchain. An optional website can build from these data, too.

### API Features:
- serves data (API endpoints) after updating local files from blockchain
- built for automation via linux cron daemon


### Website Features:
- same blockchain-fresh data as API, in table form
- outlinks to client resources

AWS Lightsail works well as a cloud instance for running the API; the optional website built by this code is [deployed here](https://comverse.netlify.app/): this is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator, using Netlify free tier for website hosting.

## Installation of Dependencies
1. ```$ pip install -r requirements.txt```

2. ``` $ yarn ``` Or ``` $ npm install```

## How to Scrape the Blockchain
```$ python main.py ```

## How to Run API server
Either locally or deployed in your cloud, this command starts the API running 24/7/365:

```$ node appy.js```

With express endpoints running locally, they can be tested against the collected CSVs in this way:
`http://localhost:3000/hri/erd159mypt4myss3mqrs89ft0hjeacffks2690gq9u3mlh73m9sh0w5s09eqhh`

When deployed to a cloud instance, you will need to expose the HTML port and aim at your instance in a similar fashion, like this:

`http://your-ip/hri/erd159mypt4myss3mqrs89ft0hjeacffks2690gq9u3mlh73m9sh0w5s09eqhh`


## Build Optional Website Locally

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static content hosting service.

## Deployment + Automatic Refresh of API Data

Use ```crond``` to automate the blockchain scraping. 
Edit the crontab (```crontab -e```) and describe the routine you wish.

Here is a suggested, 4-hour routine:
```
0 */4 * * * python ./main.py
```

## Optional Sauce: Automatic Website Refresh
Having cloned this repo to your own account, you are able to easily commit changes to GitHub if there is a GPG signature on your instance. (That's beyond the scope of this readme, tho.)

Once you have your own copy of this repo set up like this, the included **localdaemon.sh** will run the scraper & then build and commit changes *and* push to GitHub (which will then trigger Netlify to create the optional website if that's configured). That might look something like this:
```
0 */4 * * * source ./localdaemon.sh
```
Finally, depending upon your cloud instance, you may need to use multiple ```screen``` sessions (especially if you're both running the API and wanting to work in the instance simultaneously). The localdaemon running via *crond* won't disturb the express server in AWS Lightsail-- this has not been tested in other clouds.

See [Netlify docs](https://www.netlify.com/products/deploy-previews/?utm_medium=paid_search&utm_source=google&utm_campaign=GS_Connect:+Netlify+Brand&utm_term=netlify) for more info about signing up, and then hosting this on (currently still free!) tier.
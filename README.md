# HRI app, a Jacks.Media project for [Combased.io](http//combased.io)

This app provides calculations of metadata based upon wallet addresses on the MultiversX blockchain. An optional website can build from these data, too.

### API Features:
- serves data (API endpoints) after updating local files from blockchain
- built for automation via linux cron daemon


### Website Features:
- same blockchain-fresh data as API, in table form
- outlinks to client resources

The optional website built by this code is [deployed here](https://comverse.netlify.app/). This is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator. Netlify is used for cloud functions and hosting, (and suggested for any variants ofc).

## Installation of Dependencies
```
pip install -r requirements.txt
```

```
$ yarn
```
Or
```
$ npm install
```

## How to Run API server

```
$ netlify dev
```
This command starts a local development server as well as a lambda proxy server. Use the following link to test the 'hello' API function in ```src/netlify/functions``` directory:

```http://localhost:8888/api/hello?name=Viktor```

With express endpoints running locally, they can be tested against the CSVs in this way:
`http://localhost:3000/hri/erd159mypt4myss3mqrs89ft0hjeacffks2690gq9u3mlh73m9sh0w5s09eqhh`

When deployed to a cloud instance, you will need to expose the HTML port and aim at your instance in a similar fashion, like this:

```
node appy.js
```

`http://your-ip/hri/erd159mypt4myss3mqrs89ft0hjeacffks2690gq9u3mlh73m9sh0w5s09eqhh`



## Build Optional Website Locally

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment + Automatic Refresh of API Data

Use ```crond``` to automate the blockchain scraping. Here is a suggested, 4-hour routine:

```
0 */4 * * * python ./main.py
```

The included localdaemon.sh will build and commit changes to the local files *and* push to GitHub (which will then trigger Netlify to create the optional website if that's configured).

See [Netlify docs](https://www.netlify.com/products/deploy-previews/?utm_medium=paid_search&utm_source=google&utm_campaign=GS_Connect:+Netlify+Brand&utm_term=netlify) for more info about signing up, and then hosting this on (currently still free!) tier.
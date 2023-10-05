# HRI app, a Jacks.Media project for [Combased.io](http//combased.io)

This app provides calculations of metadata based upon wallet addresses on the MultiversX blockchain.

### Features:
- serves data (API endpoints) after updating local files from blockchain
- built for automation via linux cron daemon

The optional website built by this code is [deployed here](https://comverse.netlify.app/).

### Features:
- same blockchain-fresh data as API, in table form
- outlinks to client resources

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator. Netlify is used for cloud functions and hosting, (and suggested for any variants ofc).

### Installation
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

### Run API server

```
node appy.js
```

Runs the express endpoint locally. Can be tested in against the local CSV in this way:
`http://localhost:3000/hri/erd159mypt4myss3mqrs89ft0hjeacffks2690gq9u3mlh73m9sh0w5s09eqhh`


```
$ netlify dev
```

This command starts a local development server as well as a lambda proxy server. Use the following link to test the 'hello' API function in ```src/netlify/functions``` directory:

```http://localhost:8888/api/hello?name=Viktor```

Modify and add to functions in this directory & Netlify will build them.

This is the test of the API response function, endpoint.ts:

```http://localhost:8888/api/endpoint?input=erd1f4dw0ws0rv8kdwhm5s62ywchldr6l0l2gq36s7k7ky4cc0ya0saqnkpwtn```

![endpointts.png](./endpointts.png)

This is the test of the blockchain scraper & collation function, still not working as expected in typescript vs python:

```http://localhost:8888/api/main```

### Build Locally

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Use ```crond``` to automate the blockchain scraping. Here is a suggested, 4-hour routine:

```
0 */4 * * * python ./main.py
```

The included localdaemon.sh will build and commit changes to the local files and push to GitHub, which will then trigger Netlify to create the optional website.

See [Netlify docs](https://www.netlify.com/products/deploy-previews/?utm_medium=paid_search&utm_source=google&utm_campaign=GS_Connect:+Netlify+Brand&utm_term=netlify) for more info about signing up, and then hosting this.
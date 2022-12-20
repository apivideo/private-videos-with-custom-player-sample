[![badge](https://img.shields.io/twitter/follow/api_video?style=social)](https://twitter.com/intent/follow?screen_name=api_video) &nbsp; [![badge](https://img.shields.io/github/stars/apivideo/private-videos-with-custom-player-sample?style=social)](https://github.com/apivideo/private-videos-with-custom-player-sample) &nbsp; [![badge](https://img.shields.io/discourse/topics?server=https%3A%2F%2Fcommunity.api.video)](https://community.api.video)
![](https://github.com/apivideo/.github/blob/main/assets/apivideo_banner.png)
<h1 align="center">api.video private videos sample</h1>


[api.video](https://api.video) is the video infrastructure for product builders. Lightning fast video APIs for integrating, scaling, and managing on-demand & low latency live streaming features in your app.

# Table of contents
- [Table of contents](#table-of-contents)
- [Project description](#project-description)
- [Getting started](#getting-started)
- [Documentation](#documentation)
  - [Application entry point: `/index.js`](#application-entry-point-indexjs)
  - [Main page template: `/views/pages/index.ejs`](#main-page-template-viewspagesindexejs)
  - [Service worker: `/public/service-worker.js`](#service-worker-publicservice-workerjs)

# Project description

This sample app shows how to use the [api.video](https://api.video) private videos with custom player. In this sample app, videojs & hls.js based video player are used, but you can use any video player you want.

The application is deployed on Heroku here: [https://apivideo-private-videos.herokuapp.com/](https://apivideo-private-videos.herokuapp.com/).

# Getting started

To run the sample app locally:
```shell
npm install
API_KEY=<your-api-key> VIDEO_ID=<id-of-a-private-video> npm start
```

# Documentation

The sample application is composed of the following components:

## Application entry point: `/index.js`

The purpose of this file is to start an express server that will respond to the following request:
- `GET /`: when the home page is requested, a request is made to the api.video API to retrieve the private video details (including the video asset url that contains the private token). Once the video details are retrieved, the `views/pages/index.ejs` template is populated with the video details and the template is rendered.
- `GET /service-worker.js`: returns the `service-worker.js` file that is located in the `/public` folder.

## Main page template: `/views/pages/index.ejs`

Contains the main page HTML template. It contains a short js snippet that is used to:
- install the service worker
- once the service worker is installed and activated, the two video players (hls.js & videojs) are initialized.

## Service worker: `/public/service-worker.js`

The service worker will basically intercept all the requests. If a request url doesn't match the pattern of an api.video private asset url, the service worker does nothing.
On the contrary, if the request url matches the pattern of an api.video private asset url, the service worker will first intercept the token value in the URL and then:
1. if this token has not been seen before, the service worker will make the request to this url, and read the `x-token-session` header to retrieve the private session id
2. if thi token has already been seen, the service worker will add a `x-token-session` header to the request with the private session id that was retrieved in step 1.
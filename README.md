# Project Instructions

This repo is your starter code for the project. It is the same as the starter code we began with in lesson 2. Install and configure Webpack just as we did in the course. Feel free to refer to the course repo as you build this one, and remember to make frequent commits and to create and merge branches as necessary!

The goal of this project is to give you practice with:
- Setting up Webpack
- Sass styles
- Webpack Loaders and Plugins
- Creating layouts and page design
- Service workers
- Using APIs and creating requests to external urls

On top of that, I want to introduce you to the topic of Natural Language Processing. NLPs leverage machine learning and deep learning create a program that can interpret natural human speech. Systems like Alexa, Google Assistant, and many voice interaction programs are well known to us, but understanding human speech is an incredibly difficult task and requires a lot of resources to achieve. Full disclosure, this is the Wikipedia definition, but I found it to be a clear one:

> Natural language processing (NLP) is a subfield of computer science, information engineering, and artificial intelligence
concerned with the interactions between computers and human (natural) languages, in particular how to program computers to
process and analyze large amounts of natural language data.

You could spend years and get a masters degree focusing on the details of creating NLP systems and algorithms. Typically, NLP programs require far more resources than individuals have access to, but a fairly new API called Aylien has put a public facing API in front of their NLP system. We will use it in this project to determine various attributes of an article or blog post.

## Getting started

It would probably be good to first get your basic project setup and functioning. Follow the steps from the course up to Lesson 4 but don't add Service Workers just yet. We won't need the service workers during development and having extra caches floating around just means there's more potential for confusion. So, fork this repo and begin your project setup.

Remember that once you clone, you will still need to install everything:

`cd` into your new folder and run:
- `npm install`

## Setting up the API
We will be using a Udacity API which will perform the text analysis.
API link is: `https://kooye7u703.execute-api.us-east-1.amazonaws.com/NLPAnalyzer`
You do not need to configure or install any SDKs or external libraries. The project directly communicates with the AWS endpoint via HTTP requests.

### Using the API

The `/analyze` POST route in your server has been configured to forward requests to this AWS endpoint. Here's an example of how the integration works:

1. The client sends a POST request to the `/analyze` endpoint of the local server.
2. The server forwards the request to the AWS endpoint.
3. The AWS endpoint processes the text and returns the sentiment analysis results to the server.
4. The server responds to the client with the analysis results.

### Example Request

A sample POST request to the AWS endpoint might look like this:
```json
{
  "text": "I love building serverless applications with AWS!"
}
```
### Example Response
```json
{
  "sentiment": "POSITIVE",
  "sentiment_scores": {
    "Positive": 0.95,
    "Negative": 0.02,
    "Neutral": 0.03,
    "Mixed": 0.00
  },
  "text": "I love building serverless applications with AWS!"
}
```

Once you are hooked up to the API, you are most of the way there! Along with making sure you are following all the requirements in the project rubric in the classroom, here are a few other steps to make sure you take.

- Parse the response body to dynamically fill content on the page.
- Test that the server and form submission work, making sure to also handle error responses if the user input does not match API requirements.
- Go back to the web pack config and add the setup for service workers. 
- Test that the site is now available even when you stop your local server

## Deploying

A great step to take with your finished project would be to deploy it! Unfortunately its a bit out of scope for me to explain too much about how to do that here, but checkout [Netlify](https://www.netlify.com/) or [Heroku](https://www.heroku.com/) for some really intuitive free hosting options.

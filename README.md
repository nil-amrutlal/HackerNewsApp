# HackerNewsApp

This is application to retrieve information from the HackerNews API and display the top words 

## Install

    npm install

## Run the app

    npm run prod

## Run the tests

    npm test

# REST API

The API runs on http://localhost:3000

### Requests

`GET /TopWords` 

    example: http://localhost:3000/TopWords
    Functionality : Gets the top 10 most occurring words in the titles of the last 25 stories
    
`GET /LastWeekPostWords`

    example: http://localhost:3000/LastWeekPostWords
    Functionality: Gets the top 10 most occuring words in a story's title from exacly one week ago (7 days)

### Response

    Status: 200 OK
    Content-Type: application/json
    Response: { error: boolean, data: array }
    
### Assumptions 
- The API works on GTM+2 timezone
- The `GET /LastWeekPostWords` gets the top 10 word occurencies of a story's title

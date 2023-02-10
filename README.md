# Food manager

[![dockeri.co](https://dockeri.co/image/moreillon/food-manager)](https://hub.docker.com/r/moreillon/food-manager)

A calorie and macronutrients tracking web application.

More information about this project [here](https://articles.maximemoreillon.com/articles/573)

The source-code of the GUI for this application is available in [this repository](https://github.com/maximemoreillon/food_manager_front)

## API

| Route            | Method | query/body      | Description                          |
| ---------------- | ------ | --------------- | ------------------------------------ |
| /                | GET    | -               | Show application configuration       |
| /foods           | GET    | -               | Get list of food                     |
| /foods           | POST   | food properties | Create food                          |
| /foods/:food_id  | GET    | -               | Get the food with the given user ID. |
| /foods/:food_id  | DELETE | -               | Delete food with the given user ID.  |
| /foods/:food_id} | PATCH  | new properties  | Update food with the given user ID.  |

## Environment variables

| Variable    | Description                      |
| ----------- | -------------------------------- |
| MONGODB_URL | URL of the MongoDB instance      |
| APP_PORT    | Application port, defaults to 80 |

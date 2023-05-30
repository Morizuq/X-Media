# X-Media API Documentation

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

This documentation provides an overview of the endpoints available in the X-media API built with NestJS, TypeScript, and Prisma. The API allows users to perform various actions related to authentication, posts, comments, likes, notifications, user management, and search.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Authentication Endpoints
```javascript

POST /auth/signup
// Create a new user account.

POST /auth/signin
// Sign in with an existing user account.

POST /auth/forget-password
//Initiate the password reset process by sending a reset password email.

POST /auth/reset-password/:token
//Reset the user's password using the provided reset password token.

```

## Post Endpoints
```javascript

GET /posts/feed
//Retrieve all posts from different users for the user's feed.

POST /posts
//Create a new post.

GET /posts
//Retrieve all posts by the logged-in user.

GET /posts/:id
//Retrieve a specific post by its ID.

PATCH /posts/:id
//Update a specific post by its ID.

DELETE /posts/:id
//Delete a specific post by its ID.

GET /posts/:postId/comments
//Retrieve all comments for a specific post.

POST /posts/:postId/comments
//Create a new comment for a specific post.

PATCH /posts/:postId/comments/:commentId
//Update a specific comment by its ID.

DELETE /posts/:postId/comments/:commentId
//Delete a specific comment by its ID.

POST /posts/:postId/likes
//Like a specific post.

DELETE /posts/:postId/likes/:likeId
//Unlike a specific post.

```

## Notification Endpoints
```js
//ike a specific post.

GET /notifications/unread
//Retrieve all unread notifications for the currently logged-in user.

GET /notifications/:notificationId
//Retrieve a specific notification by its ID.

```

## Search Endpoints
```js

GET /search/users
//Search for users based on input fields.

GET /search/posts
//Search for posts based on input fields.

```

## User Endpoints
```js

GET /users/me
//Retrieve the details of the currently signed-in user.

PATCH /users/update-me
//Update the details of the currently signed-in user.

POST /users/follow/:followingId
//Follow another user.

POST /users/unfollow/:followingId
//Unfollow a user that is already being followed.

```

Note: Replace :id, :postId, :commentId, :likeId, :notificationId, and :followingId in the endpoint paths with the corresponding IDs or values.

## License

X-Media is [MIT licensed](LICENSE).

# asyncHandler

## Purpose
- The purpose of asyncHandler is to catch any errors that occur during the execution of the asynchronous function and pass them to the Express error handling middleware, allowing you to handle errors in a centralized way.

## How it Works
- The async keyword is used to define asynchronous functions, but it doesn't handle errors in the same way asyncHandler does.
- By wrapping your asynchronous function with asyncHandler, you ensure that any errors thrown within the function are caught and passed to Express's error handling middleware.

## Installation
```bash
npm install asynchandler
```

# Understanding Mongoose/Sequelize Save Methods

In a Node.js application using frameworks like Express.js and an ORM like Mongoose or Sequelize, you'll often encounter scenarios where you need to save data to a database. Two common methods for this are `await newUser.save()` and `const user = await User.create({...})`.

## `await newUser.save()`

- **Usage**: This syntax is commonly used with Mongoose, which is an ODM (Object Data Modeling) library for MongoDB.
- **Description**: `newUser` represents a Mongoose model instance (a document). `save()` is a method provided by Mongoose to save the document to the MongoDB database. It returns a promise that resolves to the saved document after it's successfully saved.
- **When to Use**: This method is typically used when you have already instantiated a model object and want to save it to the database.

Example:
```javascript
const newUser = new User({ name, email, password, pic });
await newUser.save();
``` 
# Automatic Deletion of Unverified Users in MongoDB

## Overview
This guide outlines the steps to implement automatic deletion of unverified users after a certain period of time using MongoDB's TTL (Time-To-Live) index feature.

## Steps

1. **Add a new field to your user schema**: 
   - In your MongoDB user schema, add a field to store the creation time of each user. Commonly named something like `createdAt`, this field will hold the timestamp when the user document was created.
   - Example user schema:
     ```json
     {
       "_id": ObjectId("123456789012"),
       "username": "example_user",
       "email": "user@example.com",
       "createdAt": ISODate("2024-04-30T12:00:00Z")
     }
     ```

2. **Create a TTL index on the createdAt field**: 
   - Once the `createdAt` field is in place, create a TTL index on it. This index automatically deletes documents after a specified period since the value of the indexed field.
   - Example of creating a TTL index:
     ```javascript
     db.users.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 86400 })
     ```
     In the above example, `86400` seconds (24 hours) is specified. Any document in the `users` collection with a `createdAt` timestamp older than 24 hours will be automatically deleted.

3. **Explanation of TTL index**: 
   - The TTL index, or "Time-To-Live" index, allows setting an expiration time for documents. MongoDB periodically scans the collection for documents with expired TTL values and removes them.
   - When a TTL index is created on a field, MongoDB deletes documents in the collection after the specified time since the value of that field. This feature is useful for automatically cleaning up old or temporary data.

4. **Considerations**:
   - Ensure the `createdAt` field is properly populated with the creation time of each user document.
   - Choose an appropriate expiration time based on application requirements, balancing user verification needs and data cleanup efficiency.
   - Periodically review and adjust the expiration time according to changes in application usage patterns or requirements.

By following these steps, automatic deletion of unverified users after a certain period using MongoDB's TTL index feature can be implemented.


# Rotate API
This is the API for the Perspective Website. It currently has the functionality to add and get users, topics, posts, and user-topic relationships. There is a lot of things that need to be added currently, and functionality constantly gets updated. Right now, we can:

- Register and Login a user, creating a Jwt Token that is required for the rest of the controllers
- Get a user based on their User ID
- Update a user
- Update a user's password
- Add a post
- Get a post based on Post ID
- Get a list of posts based on Topic ID
- Get a list of posts based on User ID
- Get a list of posts based on Type
- Get a list of posts based on both User ID and Type
- Update a post
- Add a topic
- Get a topic
- Add a UserTopic relationship
- Get a list of UserIDs all following one topic
- Get a list of TopicIDs a user is following


We currently need to add the following:

- Delete users and posts
- Delete a UserTopic relationship


## URLS
This paragraph is a list of the different URLs to connect to the API, what they do, and what to send to them

### Base URL
There are two base URLs you can use. This first one is for the https protocol, which is secure. The second one is for the http protocol, which is less secure. Throughout this doc I will use the https link, this is interchangable with the http link.

```
https://localhost:5001
http://localhost:5000
```

### User & Registration
These URLs are for the user's and authorizing users

The first URL is for registering a new user. This is a HTTP Post request, which means you have to send a JSON Object over the URL. In this object, you need a Username, Email, and Password (and optionally a Phone Number)

```
https://localhost:5001/api/v1/register-user
```

The next URL is for logging in a user. This is also a Post request, in this object you just need to send the Username and Password.

```
https://localhost:5001/api/v1/login-user
```

This URL is used to get a user based on the UserID. This is a HTTP Get request, which means you have to send an ID to check within the URL. The brackets around the ID are not necessary, and need to be removed.

```
https://localhost:5001/api/v1/get-user/{id}
```

This URL is used to update a user based on their UserID. This is a HTTP Patch Request, which means you have to send an ID in the URL AND send a JSON Object, in this case a "Json Patch Document," that's a document that is formatted to change things. This format is listed below:

```
https://localhost:5001/api/v1/update-user/{id}

JSON Patch Document Format
[
    {
        "op": "replace", "path" : "/[attribute to change], "value" : "[value to change to]"
    },
    {
        "op": "replace", "path" : "/[attribute to change], "value" : "[value to change to]"
    }
]
```

This URL is used to update a user's password to a new password. This is a Patch request, which means you have to send an ID in the URL and send a JSON Object, in this case an object containing the Old Password, a New Password, and a New Password to Confirm so the user doesn't mess up the passwords. 

```
https://localhost:5001/api/v1/update-user-password/{id}
```

### Posts
These URLs are for posts.

This URL is used to add a new post to the database. This URL is a Post request, which requires a UserID, Type, TopicID (optional), Tone (optional), Title (optional), ParentPostID (optional), and Body (optional).

```
https://localhost:5001/api/v1/add-post
```

This URL is to get a post based on the PostID. This is a Get request, which means the PostID is within the URL.

```
https://localhost:5001/api/v1/get-post/{id}
```

This URL is to update a post. This is a Patch request, which means it needs an ID in the URL and a JSON Object, in this case formatted as a JSON Patch Document.

```
https://localhost:5001/api/v1/update-post/{id}
```

### Sorting Posts Functions

These URLs are for sorting the posts into various sections.

This URL is to get a list of posts based on their TopicIDs. This is a get request, which means the TopicID is sent in the URL.

```
https://localhost:5001/api/v1/get-posts-topic-id/{id}
```

This URL is to get a list of posts based on their UserIDs. This is a get request, which means the UserID is sent in the URL.

```
https://localhost:5001/api/v1/get-posts-user-id/{id}
```


This URL is to get a list of posts based on their Types. This is a get request, which means the TopicID is sent in the URL.

```
https://localhost:5001/api/v1/get-posts-topic-id/{id}
```

### Topics
These URLs are for topics.

This URL is used to add a new topic to the database. This is a Post request, which means you have to send a JSON Object with the TopicName to the database. (Eventually, I will make this command admin only or maybe even remove it entirely; we don't want users to be able to add a topic to the database)

```
https://localhost:5001/api/v1/add-topic
```

This URL is used to get a topic based on its TopicID. This is a Get request, which means the TopicID must be sent in the URL.

```
https://localhost:5001/api/v1/get-topic/{id}
```

### User Topic Relationships
These URLs are for user-topic relationships

This URL adds a new User-Topic relationship to the database. This is a Post request, which means you have to send a JSON Object with the UserID and the TopicID.

```
https://localhost:5001/api/v1/follow-topic
```

This URL gets a list of a user's followed topics. This is a Get request, which means you have to send the UserID in the URL.

```
https://localhost:5001/api/v1/get-followed-topic-user-id/{id}
```

This URL gets a list of users that follow a specific topic. This is a Get request, which meants you have to send the TopicID in the URL.

```
https://localhost:5001/api/v1/get-followed-topic-id/{id}
```
# Chat Application

We are building a chat application that will be a mix of popular chat applications Slack and WhatsApp.

The features we are planning to clone are :

- Direct Chats
- Group Chats (Channels)
- Pin Chats
- Online / Offline Status
- Read Receipts

The tech stack we'll be using is :

- Frontend - React.JS
- Backend - NodeJS, ExpressJS
- Database - MongoDB
- Storage - Firebase

# API Documentation

## Auth

The authentication related endpoints such as user registration, login.

### Sign Up

This end point will be used to create a new account

#### Request

```javascript
POST /api/auth/register
  {
    data: {
        name: String,
        phoneNumber: String,
        image: File,
        email: String,
        password: String,
        confirmPassword: String
    },
  };
```

#### Response

##### Success Response

```javascript
{
    status: 201,
    data: {
        message: String,
        token: String
    }
}
```

##### Error Response

```javascript
{
    status: 400 || 500,
    data: {
        message: String,
    }
}
```

| Status Code | Message                                      |
| ----------- | -------------------------------------------- |
| 201         | Account Created Successfully                 |
| 400         | Invalid Input                                |
| 500         | Something went wrong, please try again later |

### Sign In

This end point will be used to sign in to an existing account

#### Request

```javascript
POST /api/auth/login
  {
    data: {
        email: String,
        password: String,
    },
  };
```

#### Response

##### Success Response

```javascript
{
    status: 200,
    data: {
        message: String,
        token: String
    }
}
```

##### Error Response

```javascript
{
    status: 400 || 500,
    data: {
        message: String,
    }
}
```

| Status Code | Message                                      |
| ----------- | -------------------------------------------- |
| 200         | Signed In Successfully                       |
| 400         | Invalid Input                                |
| 500         | Something went wrong, please try again later |

## User

The user related endpoints such as fetching user profile, verifying login, updating profile details or password

### Get Auth Status & Current User's Profile

This end point will be used to verify the login by verifying the JWT token and if all's well, fetch the profile of the user

#### Request

```javascript
GET / api / user;
{
  headers: {
    Authorization: `Bearer ${token}`;
  }
}
```

#### Response

##### Success Response

```javascript
{
    status: 200,
    data: {
        message: String,
        userData: Object
    }
}
```

##### Error Response

```javascript
{
    status:  402 || 404 || 500,
    data: {
        message: String,
    }
}
```

| Status Code | Message                                      |
| ----------- | -------------------------------------------- |
| 200         | User profile fetched successfully            |
| 402         | Unauthorized                                 |
| 404         | No token found OR no user found              |
| 500         | Something went wrong, please try again later |

### Get All Users

This endpoint will be used to get all the users except the current logged in user

#### Request

```javascript
GET / api / user / all;
{
  headers: {
    Authorization: `Bearer ${token}`;
  }
}
```

#### Response

##### Success Response

```javascript
{
    status: 200,
    data: {
        message: String,
        users: Object[]
    }
}
```

##### Error Response

```javascript
{
    status:  402 || 404 || 500,
    data: {
        message: String,
    }
}
```

| Status Code | Message                                      |
| ----------- | -------------------------------------------- |
| 200         | Users fetched successfully                   |
| 402         | Unauthorized                                 |
| 404         | No token found                               |
| 500         | Something went wrong, please try again later |

### Update User Profile

This endpoint will be used to update the profile details of the currently logged in user

#### Request

```javascript
PATCH /api/user
{
  headers: {
    Authorization: `Bearer ${token}`;
  },
  body: {
    name: String,
    phoneNumber: String,
    image: File,
  }
}
```

#### Response

##### Success Response

```javascript
{
    status: 200,
    data: {
        message: String
    }
}
```

##### Error Response

```javascript
{
    status:  400 || 402 || 404 || 500,
    data: {
        message: String,
    }
}
```

| Status Code | Message                                      |
| ----------- | -------------------------------------------- |
| 200         | Profile updated successfully                 |
| 400         | Invalid inputs                               |
| 402         | Unauthorized                                 |
| 404         | No token or user found                       |
| 500         | Something went wrong, please try again later |

### Update User Password

This endpoint will be used to update the password of the currently logged in user

#### Request

```javascript
PATCH /api/user/password
{
  headers: {
    Authorization: `Bearer ${token}`;
  },
  body: {
    oldPassword: String,
    newPassword: String,
    confirmNewPassword: String
  }
}
```

#### Response

##### Success Response

```javascript
{
    status: 200,
    data: {
        message: String
    }
}
```

##### Error Response

```javascript
{
    status:  400 || 402 || 404 || 500,
    data: {
        message: String,
    }
}
```

| Status Code | Message                                      |
| ----------- | -------------------------------------------- |
| 200         | Password changed successfully                |
| 400         | Invalid inputs                               |
| 402         | Unauthorized                                 |
| 404         | No token or user found                       |
| 500         | Something went wrong, please try again later |

### Get User Profile By ID

This endpoint will be used to fetch the profile of user by using his ID

#### Request

```javascript
GET /api/user/:userId
{
  headers: {
    Authorization: `Bearer ${token}`;
  }
}
```

#### Response

##### Success Response

```javascript
{
    status: 200,
    data: {
        message: String,
        user: Object
    }
}
```

##### Error Response

```javascript
{
    status:  404 || 500,
    data: {
        message: String,
    }
}
```

| Status Code | Message                                      |
| ----------- | -------------------------------------------- |
| 200         | Profile fetched successfully                 |
| 404         | No token or user found                       |
| 500         | Something went wrong, please try again later |

## Chats

The chat related endpoints such as creating or removing a chat, renaming group chats or adding new members. Pinning chats or unpinning them, etc.

### Create A New Chat

This end point will be used to create a new chat

#### Request

```javascript
POST /api/chat/
{
  headers: {
    Authorization: `Bearer ${token}`;
  },
  data: {
    users: String[],
    isGroupChat: Boolean,
    groupChatName: String,
  }
}
```

#### Response

##### Success Response

```javascript
{
    status: 201,
    data: {
        message: String,
        chat: Object
    }
}
```

##### Error Response

```javascript
{
    status:  400 || 402 || 404 || 500,
    data: {
        message: String,
    }
}
```

| Status Code | Message                                      |
| ----------- | -------------------------------------------- |
| 201         | Chat created successfully                    |
| 400         | Invalid Chat Name                            |
| 402         | Unauthorized                                 |
| 404         | No token found OR no user found              |
| 500         | Something went wrong, please try again later |

### Rename A Group Chat

This end point will be used to rename a group chat

#### Request

```javascript
PATCH /api/chat/rename/:chatId
{
  headers: {
    Authorization: `Bearer ${token}`;
  },
  data: {
    groupChatName: String,
  }
}
```

#### Response

##### Success Response

```javascript
{
    status: 200,
    data: {
        message: String,
        chat: Object
    }
}
```

##### Error Response

```javascript
{
    status:  400 || 402 || 404 || 500,
    data: {
        message: String,
    }
}
```

| Status Code | Message                                      |
| ----------- | -------------------------------------------- |
| 200         | Chat renamed successfully                    |
| 400         | Invalid Chat Name                            |
| 402         | Unauthorized                                 |
| 404         | No token found OR no chat found              |
| 500         | Something went wrong, please try again later |

### Add User To A Group Chat

This end point will be used to add user to a group chat

#### Request

```javascript
PATCH /api/chat/add/:chatId
{
  headers: {
    Authorization: `Bearer ${token}`;
  },
  data: {
    user: String
  }
}
```

#### Response

##### Success Response

```javascript
{
    status: 200,
    data: {
        message: String,
        chat: Object
    }
}
```

##### Error Response

```javascript
{
    status:  402 || 404 || 500,
    data: {
        message: String,
    }
}
```

| Status Code | Message                                      |
| ----------- | -------------------------------------------- |
| 200         | User added successfully                      |
| 402         | Unauthorized                                 |
| 404         | No token found OR no chat found              |
| 500         | Something went wrong, please try again later |

### Remove User From A Group Chat

This end point will be used to remove user from a group chat

#### Request

```javascript
PATCH /api/chat/remove/:chatId
{
  headers: {
    Authorization: `Bearer ${token}`;
  },
  data: {
    user: String
  }
}
```

#### Response

##### Success Response

```javascript
{
    status: 200,
    data: {
        message: String,
        chat: Object
    }
}
```

##### Error Response

```javascript
{
    status:  402 || 404 || 500,
    data: {
        message: String,
    }
}
```

| Status Code | Message                                      |
| ----------- | -------------------------------------------- |
| 200         | User removed successfully                    |
| 402         | Unauthorized                                 |
| 404         | No token found OR no chat found              |
| 500         | Something went wrong, please try again later |

### Delete A Chat

This end point will be used to remove a chat

#### Request

```javascript
DELETE /api/chat/:chatId
{
  headers: {
    Authorization: `Bearer ${token}`;
  },
}
```

#### Response

##### Success Response

```javascript
{
    status: 200,
    data: {
        message: String,
    }
}
```

##### Error Response

```javascript
{
    status:  402 || 404 || 500,
    data: {
        message: String,
    }
}
```

| Status Code | Message                                      |
| ----------- | -------------------------------------------- |
| 200         | Chat deleted successfully                    |
| 402         | Unauthorized                                 |
| 404         | No token found OR no chat found              |
| 500         | Something went wrong, please try again later |

### Get All Chats For A User

This end point will be used to fetch all the chats of the currently logged in user

#### Request

```javascript
GET /api/chat/
{
  headers: {
    Authorization: `Bearer ${token}`;
  },
}
```

#### Response

##### Success Response

```javascript
{
    status: 200,
    data: {
        message: String,
        chats: Object[]
    }
}
```

##### Error Response

```javascript
{
    status:   402 || 404 || 500,
    data: {
        message: String,
    }
}
```

| Status Code | Message                                      |
| ----------- | -------------------------------------------- |
| 200         | Chats fetched successfully                   |
| 402         | Unauthorized                                 |
| 404         | No token found                               |
| 500         | Something went wrong, please try again later |

### Get A Specific Chat

This end point will be used to fetch a specific chat

#### Request

```javascript
GET /api/chat/:chatId
{
  headers: {
    Authorization: `Bearer ${token}`;
  },
}
```

#### Response

##### Success Response

```javascript
{
    status: 200,
    data: {
        message: String,
        chat: Object
    }
}
```

##### Error Response

```javascript
{
    status:   402 || 404 || 500,
    data: {
        message: String,
    }
}
```

| Status Code | Message                                      |
| ----------- | -------------------------------------------- |
| 200         | Chats fetched successfully                   |
| 402         | Unauthorized                                 |
| 404         | No token found                               |
| 500         | Something went wrong, please try again later |

### Pin A Chat

This end point will be used to pin a chat

#### Request

```javascript
POST /api/chat/pin/:chatId
{
  headers: {
    Authorization: `Bearer ${token}`;
  },
}
```

#### Response

##### Success Response

```javascript
{
    status: 200,
    data: {
        message: String
    }
}
```

##### Error Response

```javascript
{
    status:   402 || 404 || 500,
    data: {
        message: String,
    }
}
```

| Status Code | Message                                      |
| ----------- | -------------------------------------------- |
| 200         | Chat pinned successfully                     |
| 402         | Unauthorized                                 |
| 404         | No token found OR no chat found              |
| 500         | Something went wrong, please try again later |

### Unpin A Chat

This end point will be used to unpin a chat

#### Request

```javascript
DELETE /api/chat/pin/:chatId
{
  headers: {
    Authorization: `Bearer ${token}`;
  },
}
```

#### Response

##### Success Response

```javascript
{
    status: 200,
    data: {
        message: String
    }
}
```

##### Error Response

```javascript
{
    status:   402 || 404 || 500,
    data: {
        message: String,
    }
}
```

| Status Code | Message                                      |
| ----------- | -------------------------------------------- |
| 200         | Chat unpinned successfully                   |
| 402         | Unauthorized                                 |
| 404         | No token found OR no chat found              |
| 500         | Something went wrong, please try again later |

## Messages

The endpoints to create edit or remove messages from a chat

### Create a new message transaction

This end point will be used to create a new message transaction for a chat

#### Request

```javascript
POST /api/message/
{
  headers: {
    Authorization: `Bearer ${token}`;
  },
  data: {
    message: String,
    chatId: String,
    transactionType: String,
    messageId: String (OPTIONAL)
  }
}
```

#### Response

##### Success Response

```javascript
{
    status: 201,
    data: {
        message: String
    }
}
```

##### Error Response

```javascript
{
    status:   400 || 402 || 404 || 500,
    data: {
        message: String,
    }
}
```

| Status Code | Message                                        |
| ----------- | ---------------------------------------------- |
| 201         | Transaction created successfully               |
| 400         | Invalid message OR chat ID or transaction type |
| 402         | Unauthorized                                   |
| 404         | No token found OR no chat found                |
| 500         | Something went wrong, please try again later   |

### Check for new message transactions

This end point will be used to check if newer transactions have been made for a chat after a given transaction

#### Request

```javascript
GET /api/message/transaction/:chatId/:transactionId
{
  headers: {
    Authorization: `Bearer ${token}`;
  },
}
```

#### Response

##### Success Response

```javascript
{
    status: 200,
    data: {
        message: String,
        unfetchedTransactions: Boolean
    }
}
```

##### Error Response

```javascript
{
    status:   402 || 404 || 500,
    data: {
        message: String,
    }
}
```

| Status Code | Message                                                 |
| ----------- | ------------------------------------------------------- |
| 200         | Transaction status fetched successfully                 |
| 402         | Unauthorized                                            |
| 404         | No token found OR no chat found OR No transaction found |
| 500         | Something went wrong, please try again later            |

### Get all messages for a chat

This end point will be used to fetch all messages for a chat

#### Request

```javascript
GET /api/message/:chatId
{
  headers: {
    Authorization: `Bearer ${token}`;
  },
}
```

#### Response

##### Success Response

```javascript
{
    status: 200,
    data: {
        message: String,
        messages: Object[]
    }
}
```

##### Error Response

```javascript
{
    status:   402 || 404 || 500,
    data: {
        message: String,
    }
}
```

| Status Code | Message                                      |
| ----------- | -------------------------------------------- |
| 200         | Messaged fetched successfully                |
| 402         | Unauthorized                                 |
| 404         | No token found OR no chat found              |
| 500         | Something went wrong, please try again later |

### Get all transactions for a chat after a transaction

This end point will be used to fetch all transactions for a chat after a certain transaction

#### Request

```javascript
GET /api/message/:chatId/:transactionId
{
  headers: {
    Authorization: `Bearer ${token}`;
  },
}
```

#### Response

##### Success Response

```javascript
{
    status: 200,
    data: {
        message: String,
        transactions: Object[]
    }
}
```

##### Error Response

```javascript
{
    status:   402 || 404 || 500,
    data: {
        message: String,
    }
}
```

| Status Code | Message                                      |
| ----------- | -------------------------------------------- |
| 200         | Transactions fetched successfully            |
| 402         | Unauthorized                                 |
| 404         | No token found OR no chat found              |
| 500         | Something went wrong, please try again later |

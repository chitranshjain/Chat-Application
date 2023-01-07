# User

- Name : String
- Phone Number : String
- Email : String
- Image URL : String
- Password : Encrypted String
- Chats : Array Of ObjectID (Reference)
- Pinned Chats : Array Of ObjectID (Reference)

# Chats

- Chat Name : String
- Is Group Chat : Boolean
- Users : Array Of ObjectID (Reference)
- Latest Message : ObjectID (Reference)
- Group Admin : ObjectID (Reference)
- Messages : Array Of ObjectID (Reference)

# Messages

- Sender : ObjectID (Reference)
- Content : String
- Chat : ObjectID (Reference)

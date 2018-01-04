# chat-codes-socket
A command line chat client, with Socket.IO and Vorpal.

## Usage

First run the server:

```
node server.js
```

Then run the client:

```
node client.js
```

In the client type `help` to get started.

## Commands

```
help [command...]        Provides help for a given command.
exit                     Exits application.
\join <room>             Joins a room.
\leave <room>            Leaves a room.
\send <message> [event]  Sends message to room.
\subscribe <event>       Subscribes to an event type.
\unsubscribe <event>     Unsubscribes to an event type.
```
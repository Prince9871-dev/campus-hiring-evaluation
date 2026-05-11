# Stage 1

## Notification System Design

The notification service should support some basic actions for students and admins.

### Main Features

- Fetch notifications
- Mark notification as read
- Mark all notifications as read
- Create notification
- Delete notification
- Real-time notification updates

---

# Base API

```http
/api/v1/notifications
```

---

# Fetch Notifications

```http
GET /api/v1/notifications
```

### Headers

```json
{
  "Authorization": "Bearer token"
}
```

### Query Params

| Param | Purpose |
|---|---|
| page | page number |
| limit | notifications per page |
| unreadOnly | fetch unread notifications only |

### Sample Response

```json
{
  "success": true,
  "notifications": [
    {
      "id": "n101",
      "studentId": "1042",
      "type": "Placement",
      "message": "Amazon hiring drive",
      "isRead": false
    }
  ]
}
```

---

# Mark Notification as Read

```http
PATCH /api/v1/notifications/:id/read
```

### Response

```json
{
  "message": "Notification marked as read"
}
```

---

# Mark All Notifications as Read

```http
PATCH /api/v1/notifications/read-all
```

### Response

```json
{
  "message": "All notifications marked as read"
}
```

---

# Create Notification

```http
POST /api/v1/notifications
```

### Request Body

```json
{
  "studentId": "1042",
  "type": "Placement",
  "message": "Microsoft placement drive"
}
```

### Response

```json
{
  "success": true,
  "message": "Notification created"
}
```

---

# Delete Notification

```http
DELETE /api/v1/notifications/:id
```

### Response

```json
{
  "message": "Notification deleted"
}
```

---

# Notification Object

```json
{
  "id": "string",
  "studentId": "string",
  "type": "Event | Result | Placement",
  "message": "string",
  "isRead": false,
  "createdAt": "timestamp"
}
```

---

# Real-Time Notifications

For real-time updates, WebSocket can be used so students receive notifications instantly without refreshing the page.

### WebSocket URL

```http
ws://localhost:3000/notifications
```

### Event Example

```json
{
  "event": "new_notification",
  "data": {
    "message": "Adobe hiring drive"
  }
}
```

---

# Status Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

# Stage 2

## Database Choice

For storing notifications, I would prefer PostgreSQL because notifications contain structured data and relationships with students.
IT also supports indexing, filtering, sorting, and scaling properly for large dataset. Another reason for choosing PostgreSQL is reliability and ACID properties which are useful for notification systems.

---

# Database Schema

## notifications table

| Column | Type |
|---|---|
| id | UUID |
| studentId | VARCHAR |
| type | VARCHAR |
| message | TEXT |
| isRead | BOOLEAN |
| createdAt | TIMESTAMP |

---

# Sample SQL Schema

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    studentId VARCHAR(50),
    type VARCHAR(20),
    message TEXT,
    isRead BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# Possible Problems with Large Data

As notification count increases, there are issues:

- Slow queries
- High DB load
- Delay in fetching unread notifications
- Increased storage usage

---

# Solutions

Some optimizations that can be used:

- Add indexes on studentId and isRead
- Use pagination
- Archive old notifications
- Use caching for frequently accessed notifications

---

# Useful Queries

## Fetch unread notifications

```sql
SELECT * 
FROM notifications
WHERE studentId = '1042'
AND isRead = false
ORDER BY createdAt DESC;
```

---

## Mark notification as read

```sql
UPDATE notifications
SET isRead = true
WHERE id = 'n101';
```

---

## Mark all notifications as read

```sql
UPDATE notifications
SET isRead = true
WHERE studentId = '1042';
```

---

## Delete notification

```sql
DELETE FROM notifications
WHERE id = 'n101';
```

---

## Create notification

```sql
INSERT INTO notifications(id, studentId, type, message)
VALUES(
    'n201',
    '1042',
    'Placement',
    'Microsoft hiring drive'
);
```

# Stage 3

The query is correct because it fetches unread notifications of a particular student and shows latest notifications first.

```sql
SELECT * FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt DESC;
```

As the number of notifications increases, this query can become slow because the database has to scan many rows. sorting also takes extra time when there are millions of records.

to improve performance, indexing can be used.

```sql
CREATE INDEX idx_notification
ON notifications(studentId, isRead, createdAt);
```

This will help in faster searching and sorting. Adding indexes on every column is not a good idea because it increases storage and slows down insert /update operations.
indexes should only be added on columns which are searched frequently.
Query for students who got placement notifications in last 7 days:

```sql
SELECT DISTINCT studentId
FROM notifications
WHERE type = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```

Some other improvements can be:
- pagination
- caching
- archiving old notifications
- table partitioning for huge data

# Stage 4

Fetching notifications from database on every page load can increase load on the DB when thousands of students are active together.
Can be solved using Caching.

Frequently accessed notifications can be stored in Redis cache so the application does not query db every time improves response speed and reduces DB load.

Another improvement can be pagination so only limited notifications are fetched instead of loading everything at once. webSockets can also help because notifications can be pushed in real-time instead of fetching repeatedly.


- caching improves speed but increases memory usage
- webSockets improve real time experience but are harder to manage at scale
- pagination reduces load but users cannot see all notifications instantly

# Stage 5

The current implementation can be improved. If sending email fails in between, some students may receive notifications while others may not and can also be inconsistency where notification is saved in db but email is not sent.

Doing everything sequentially for 50,000 students is also slow.

A better approach is to use queues and background workers as Notifications can first be stored in database and then jobs can be added to a queue for email sending and push notifications, makes the system more reliable and scalable.

Retry mechanism can also be added if email sending fails.

pseudocode:

```js
function notifyAll(studentIds, message) {

    for (const studentId of studentIds) {

        saveToDB(studentId, message);

        addEmailJob(studentId, message);

        addPushNotificationJob(studentId, message);
    }
}
```

Workers will process queue jobs separately.

Benefits:
- better reliability
- retries possible
- faster execution
- reduced failure chances


# Stage 6

In this stage, notifications are fetched using the provided API.

Priority is calculated based on:
- Placement notifications having highest priority
- Result notifications having medium priority
- Event notifications having lower priority

Recent notifications are also given preference using timestamps.

The notifications are sorted using both weight and timestamp and then top 10 notifications are displayed.

For handling continuous incoming notifications efficiently, a priority queue or heap structure can be used so top notifications can be maintained without sorting the entire array repeatedly.
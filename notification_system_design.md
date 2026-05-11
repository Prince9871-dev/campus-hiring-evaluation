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
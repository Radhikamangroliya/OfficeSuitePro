# API Documentation

Complete Swagger API documentation for My OS backend endpoints.

**Base URL**: `http://localhost:5007/api`

**Swagger UI**: http://localhost:5007/swagger

---

## 🔐 Authentication

All endpoints (except authentication endpoints) require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## 📋 Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [Timeline Endpoints](#timeline-endpoints)
3. [GitHub Endpoints](#github-endpoints)

---

## 🔑 Authentication Endpoints

### POST /api/auth/google/token

Exchange Google ID token for application JWT token.

**Request Body:**
```json
{
  "IdToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
}
```

**Response (200 OK):**
```json
{
  "Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "ExpiresIn": 3600
}
```

**Error Responses:**
- `400 Bad Request`: Invalid ID token
- `401 Unauthorized`: Token validation failed

**Example:**
```bash
curl -X POST http://localhost:5007/api/auth/google/token \
  -H "Content-Type: application/json" \
  -d '{"IdToken": "your-google-id-token"}'
```

---

### GET /api/auth/google/callback

OAuth callback endpoint for Google authentication flow.

**Query Parameters:**
- `code` (string): Authorization code from Google
- `error` (string, optional): Error message if authentication failed

**Response:**
- Redirects to frontend with token or error

**Note**: This endpoint is used internally by the OAuth flow and typically not called directly.

---

## 📅 Timeline Endpoints

### GET /api/timeline

Get all timeline entries for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Meeting with Team",
    "description": "Weekly standup meeting",
    "category": "Meeting",
    "imageUrl": "https://example.com/image.jpg",
    "eventDate": "2024-01-15T10:00:00Z",
    "createdAt": "2024-01-15T09:00:00Z",
    "entryType": "Activity",
    "sourceApi": "manual"
  }
]
```

**Example:**
```bash
curl -X GET http://localhost:5007/api/timeline \
  -H "Authorization: Bearer your-jwt-token"
```

---

### POST /api/timeline

Create a new timeline entry.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "Title": "New Timeline Entry",
  "Description": "Description of the entry",
  "Category": "GitHub",
  "ImageUrl": "https://example.com/image.jpg",
  "EventDate": "2024-01-15T10:00:00Z",
  "EntryType": "Activity",
  "SourceApi": "manual",
  "ExternalUrl": "https://example.com",
  "ExternalId": "unique-external-id",
  "Metadata": "{\"key\":\"value\"}"
}
```

**Required Fields:**
- `Title` (string, max 200 characters)

**Optional Fields:**
- `Description` (string, max 1000 characters)
- `Category` (string, max 50 characters)
- `ImageUrl` (string)
- `EventDate` (DateTime, ISO 8601 format)
- `EntryType` (string, max 50 characters)
- `SourceApi` (string)
- `ExternalUrl` (string)
- `ExternalId` (string)
- `Metadata` (string, JSON format)

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "New Timeline Entry",
  "description": "Description of the entry",
  "category": "GitHub",
  "imageUrl": "https://example.com/image.jpg",
  "eventDate": "2024-01-15T10:00:00Z",
  "createdAt": "2024-01-15T09:00:00Z",
  "updatedAt": "2024-01-15T09:00:00Z",
  "userId": 1
}
```

**Error Responses:**
- `400 Bad Request`: Validation failed (missing required fields, invalid data)
- `401 Unauthorized`: Invalid or missing JWT token

**Example:**
```bash
curl -X POST http://localhost:5007/api/timeline \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "Title": "New Entry",
    "Description": "Entry description",
    "Category": "GitHub"
  }'
```

---

### PUT /api/timeline/{id}

Update an existing timeline entry.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Path Parameters:**
- `id` (integer): The ID of the timeline entry to update

**Request Body:**
```json
{
  "Title": "Updated Title",
  "Description": "Updated description",
  "Category": "Meeting",
  "ImageUrl": "https://example.com/new-image.jpg"
}
```

**Note**: All fields are optional for updates. Only include fields you want to update.

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Updated Title",
  "description": "Updated description",
  "category": "Meeting",
  "imageUrl": "https://example.com/new-image.jpg",
  "eventDate": "2024-01-15T10:00:00Z",
  "createdAt": "2024-01-15T09:00:00Z",
  "updatedAt": "2024-01-15T11:00:00Z",
  "userId": 1
}
```

**Error Responses:**
- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Invalid or missing JWT token
- `404 Not Found`: Entry not found or doesn't belong to user

**Example:**
```bash
curl -X PUT http://localhost:5007/api/timeline/1 \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "Title": "Updated Title",
    "Description": "New description"
  }'
```

---

### DELETE /api/timeline/{id}

Delete a timeline entry.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Path Parameters:**
- `id` (integer): The ID of the timeline entry to delete

**Response (204 No Content):**
- Successfully deleted

**Error Responses:**
- `401 Unauthorized`: Invalid or missing JWT token
- `404 Not Found`: Entry not found or doesn't belong to user

**Example:**
```bash
curl -X DELETE http://localhost:5007/api/timeline/1 \
  -H "Authorization: Bearer your-jwt-token"
```

---

## 🐙 GitHub Endpoints

All GitHub endpoints require authentication and return data from the GitHub API.

### GET /api/github/activity

Get GitHub activity events for a user.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `username` (string, required): GitHub username

**Response (200 OK):**
```json
[
  {
    "type": "PushEvent",
    "repo": {
      "name": "username/repository"
    },
    "created_at": "2024-01-15T10:00:00Z"
  }
]
```

**Example:**
```bash
curl -X GET "http://localhost:5007/api/github/activity?username=Radhikamangroliya" \
  -H "Authorization: Bearer your-jwt-token"
```

---

### GET /api/github/profile

Get GitHub user profile information.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `username` (string, required): GitHub username

**Response (200 OK):**
```json
{
  "login": "Radhikamangroliya",
  "name": "Radhika Mangroliya",
  "avatar_url": "https://avatars.githubusercontent.com/u/...",
  "bio": "Full Stack Developer",
  "public_repos": 21,
  "followers": 10,
  "following": 5,
  "created_at": "2020-01-01T00:00:00Z"
}
```

**Example:**
```bash
curl -X GET "http://localhost:5007/api/github/profile?username=Radhikamangroliya" \
  -H "Authorization: Bearer your-jwt-token"
```

---

### GET /api/github/repos

Get GitHub repositories for a user.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `username` (string, required): GitHub username

**Response (200 OK):**
```json
[
  {
    "id": 123456,
    "name": "repository-name",
    "full_name": "username/repository-name",
    "description": "Repository description",
    "language": "TypeScript",
    "stargazers_count": 10,
    "forks_count": 5,
    "open_issues_count": 2,
    "updated_at": "2024-01-15T10:00:00Z",
    "html_url": "https://github.com/username/repository-name"
  }
]
```

**Example:**
```bash
curl -X GET "http://localhost:5007/api/github/repos?username=Radhikamangroliya" \
  -H "Authorization: Bearer your-jwt-token"
```

---

### GET /api/github/contributions

Get GitHub contributions/events for a user.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `username` (string, required): GitHub username

**Response (200 OK):**
```json
[
  {
    "type": "PushEvent",
    "repo": {
      "name": "username/repository"
    },
    "payload": {
      "commits": [...]
    },
    "created_at": "2024-01-15T10:00:00Z"
  }
]
```

**Example:**
```bash
curl -X GET "http://localhost:5007/api/github/contributions?username=Radhikamangroliya" \
  -H "Authorization: Bearer your-jwt-token"
```

---

### GET /api/github/commits

Get commits for a specific repository.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `username` (string, required): GitHub username
- `repo` (string, required): Repository name

**Response (200 OK):**
```json
[
  {
    "sha": "abc123...",
    "commit": {
      "message": "Commit message",
      "author": {
        "name": "Author Name",
        "date": "2024-01-15T10:00:00Z"
      }
    },
    "html_url": "https://github.com/username/repo/commit/abc123"
  }
]
```

**Example:**
```bash
curl -X GET "http://localhost:5007/api/github/commits?username=Radhikamangroliya&repo=OfficeSuitePro" \
  -H "Authorization: Bearer your-jwt-token"
```

---

## 🔒 Authentication & Authorization

### Getting a JWT Token

1. Sign in with Google on the frontend
2. Frontend receives Google ID token
3. Frontend sends ID token to `POST /api/auth/google/token`
4. Backend validates and returns JWT token
5. Store JWT token and include in all subsequent requests

### Using JWT Token

Include the token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiration

- Default expiration: 60 minutes
- Configured in `appsettings.json` under `Jwt:ExpirationMinutes`
- When token expires, user must sign in again

---

## 📊 Response Formats

### Success Response

All successful responses return HTTP status codes:
- `200 OK`: Request successful, data returned
- `201 Created`: Resource created successfully
- `204 No Content`: Request successful, no content returned

### Error Response Format

```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

### Common HTTP Status Codes

- `200 OK`: Success
- `201 Created`: Resource created
- `204 No Content`: Success, no content
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## 🧪 Testing with Swagger

1. Navigate to http://localhost:5007/swagger
2. Click **Authorize** button at the top
3. Enter your JWT token: `Bearer <your-token>`
4. Click **Authorize**
5. Test endpoints directly from Swagger UI

---

## 📝 Data Models

### TimelineEntry

```typescript
{
  id: number;
  title: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  eventDate: DateTime;
  createdAt: DateTime;
  updatedAt: DateTime;
  entryType?: string;
  sourceApi?: string;
  externalUrl?: string;
  externalId?: string;
  metadata?: string;
  userId: number;
}
```

### TimelineEntryRequest

```typescript
{
  Title: string;              // Required, max 200 chars
  Description?: string;       // Optional, max 1000 chars
  Category?: string;         // Optional, max 50 chars
  ImageUrl?: string;         // Optional
  EventDate?: DateTime;       // Optional, ISO 8601 format
  EntryType?: string;        // Optional, max 50 chars
  SourceApi?: string;        // Optional
  ExternalUrl?: string;      // Optional
  ExternalId?: string;       // Optional
  Metadata?: string;         // Optional, JSON string
}
```

---

## 🔍 Rate Limiting

Currently, there are no rate limits implemented. For production, consider implementing:
- Request rate limiting per user
- API key-based rate limiting
- IP-based rate limiting

---

## 🛡️ Security Considerations

1. **Always use HTTPS in production**
2. **Store JWT tokens securely** (httpOnly cookies recommended)
3. **Validate all input data** on both client and server
4. **Use environment variables** for sensitive configuration
5. **Implement CORS properly** for production domains
6. **Regularly rotate JWT keys** and secrets
7. **Monitor API usage** for suspicious activity

---

## 📞 Support

For API issues:
- Check Swagger UI: http://localhost:5007/swagger
- Review backend logs for detailed error messages
- Check browser console for frontend errors

---

**Last Updated**: January 2024


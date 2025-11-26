# My OS - Personal Operating System

A full-stack personal productivity application that tracks your timeline, GitHub activity, and manages your work-life balance. Built with React, TypeScript, ASP.NET Core 8, and SQLite.

## 📋 Overview

My OS is a comprehensive personal operating system that helps you:
- **Track Timeline**: Create, edit, and manage timeline entries with categories, images, and metadata
- **GitHub Integration**: View your GitHub profile, repositories, contributions, and commits
- **Calendar View**: Visualize timeline entries in a calendar format
- **Workspace**: Detailed view of timeline entries with navigation
- **User Profile**: Manage your personal information and social links
- **Google OAuth**: Secure authentication using Google Sign-In

---

## 🏗️ Architecture Overview

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 7
- **State Management**: React Context API (AuthContext, TimelineContext)
- **Routing**: React Router v6
- **API Communication**: Axios with custom service layer
- **UI Framework**: Tailwind CSS
- **Icons**: Lucide React

### Backend (.NET 8)
- **Framework**: ASP.NET Core 8 Web API
- **Database**: SQLite with Entity Framework Core
- **Authentication**: JWT Bearer tokens
- **OAuth**: Google Identity Services
- **Documentation**: Swagger/OpenAPI
- **CORS**: Configured for frontend integration

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **.NET 8.0 SDK** or later - [Download](https://dotnet.microsoft.com/download)
- **Node.js** 18.x or later - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/downloads)
- **Google Cloud Console Account** (for OAuth setup)
- **GitHub Account** (for GitHub API token)

---

## 🚀 Getting Started

### Part 1: Backend Setup


#### Step 1: Navigate to Backend Directory

```bash
cd TodoTimelineApi
```

#### Step 2: Install Required NuGet Packages

The following packages are already included in `TodoTimelineApi.csproj`:

**Swagger / OpenAPI:**
- `Microsoft.AspNetCore.OpenApi` (Version 8.0.21)
- `Swashbuckle.AspNetCore` (Version 6.6.2)

**Entity Framework Core:**
- `Microsoft.EntityFrameworkCore` (Version 8.0.21)
- `Microsoft.EntityFrameworkCore.Sqlite` (Version 8.0.21)
- `Microsoft.EntityFrameworkCore.Design` (Version 8.0.21)
- `Microsoft.EntityFrameworkCore.Tools` (Version 8.0.21)

**Authentication:**
- `Google.Apis.Auth` (Version 1.68.0)
- `Microsoft.AspNetCore.Authentication.JwtBearer` (Version 8.0.21)
- `System.IdentityModel.Tokens.Jwt` (Version 8.0.1)

**To manually install (if needed):**
```bash
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package System.IdentityModel.Tokens.Jwt
dotnet add package Google.Apis.Auth
dotnet add package Swashbuckle.AspNetCore
```

**What these packages provide:**
- `Microsoft.EntityFrameworkCore`: Core Entity Framework functionality
- `Microsoft.EntityFrameworkCore.Sqlite`: SQLite database provider
- `Microsoft.EntityFrameworkCore.Tools`: CLI tools for migrations
- `Microsoft.EntityFrameworkCore.Design`: Design-time support for migrations
- `Microsoft.AspNetCore.Authentication.JwtBearer`: JWT authentication middleware
- `System.IdentityModel.Tokens.Jwt`: JWT token handling
- `Google.Apis.Auth`: Google OAuth token validation
- `Swashbuckle.AspNetCore`: Swagger/OpenAPI documentation

#### Step 3: Restore Dependencies

```bash
dotnet restore
```

#### Step 4: Configure App Settings

Edit `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "SqliteConnection": "Data Source=timeline.db"
  },
  "Jwt": {
    "Key": "YOUR_BASE64_ENCODED_JWT_KEY_HERE",
    "Issuer": "TodoTimelineAPI",
    "Audience": "TodoTimelineClient",
    "ExpirationMinutes": 60
  },
  "Authentication": {
    "Google": {
      "ClientId": "YOUR_GOOGLE_CLIENT_ID",
      "ClientSecret": "YOUR_GOOGLE_CLIENT_SECRET",
      "RedirectUri": "http://localhost:5007/api/auth/google/callback",
      "FrontendRedirectUri": "http://localhost:5173/oauth-callback"
    }
  },
  "Github": {
    "Token": "YOUR_GITHUB_PERSONAL_ACCESS_TOKEN"
  }
}
```

#### Step 5: Generate JWT Key

Generate a secure base64-encoded JWT key:

**Option 1: Using OpenSSL (Mac/Linux)**
```bash
openssl rand -base64 64
```

**Option 2: Using PowerShell (Windows)**
```powershell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Option 3: Using .NET**
```bash
dotnet user-secrets init
dotnet user-secrets set "Jwt:Key" "$(openssl rand -base64 64)"
```

Copy the generated key to `appsettings.Development.json` under `Jwt:Key`.

#### Step 6: Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project named "MyOS" or select an existing one
3. Enable Google+ API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: "Web application"
   - Name: "MyOS"
   - **Authorized JavaScript origins:**
     - `http://localhost:5007`
     - `http://localhost:5173`
   - **Authorized redirect URIs:**
     - `http://localhost:5007/api/auth/google/callback`
     - `http://localhost:5173/oauth-callback`
5. Save and copy:
   - **Client ID**: Copy to `appsettings.Development.json` under `Authentication:Google:ClientId`
   - **Client Secret**: Copy to `appsettings.Development.json` under `Authentication:Google:ClientSecret`

#### Step 7: Set Up GitHub Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "MyOS API")
4. Select scopes:
   - `repo` (Full control of private repositories)
   - `read:user` (Read user profile data)
5. Generate token and copy it
6. Paste token in `appsettings.Development.json` under `Github:Token`

#### Step 8: Database Migrations

**Create Initial Migration:**
```bash
# Ensure you're in TodoTimelineApi directory
dotnet ef migrations add InitialCreate
```

**Apply Migration to Create Database:**
```bash
# Create the database and apply migrations
dotnet ef database update
```

This creates the SQLite database file (`timeline.db`) in the `TodoTimelineApi` directory.

#### Step 9: Build the Backend

```bash
dotnet build
```

#### Step 10: Run the Backend

```bash
dotnet run
```

The backend will start on **http://localhost:5007**

**Backend URLs:**
- **API Base URL**: http://localhost:5007/api
- **Swagger UI**: http://localhost:5007/swagger
- **OpenAPI Spec**: http://localhost:5007/swagger/v1/swagger.json

---

### Part 2: Frontend Setup

#### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

####📦 Install Frontend Dependencies (React + TypeScript)

Your frontend uses React, TypeScript, Axios, routing, TailwindCSS, icons, and Vite.
```
npm install react react-dom
npm install -D typescript @types/react @types/react-dom
npm install react-router-dom
npm install -D @types/react-router-dom
npm install axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install lucide-react
npm install @vitejs/plugin-react

```
index.css(`src/index.css`) must include:
```
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Dashboard Layout */
.dashboard-grid {
  @apply grid grid-cols-3 gap-5;
}

/* Widget Card */
.card {
  @apply bg-white p-4 rounded-xl shadow-md;
}

/* GitHub event item */
.event-item {
  @apply mb-2;
}

/* Google Sign-In Button Styling - Professional Rounded */
#root [id^="gsi"] {
  border-radius: 9999px !important;
  overflow: hidden !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
  transition: all 0.3s ease !important;
}

#root [id^="gsi"]:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
  transform: translateY(-1px) !important;
}

```

#### Step 2: Install Dependencies

```bash
npm install
```

**Key Dependencies:**
- `react` & `react-dom`: React framework
- `react-router-dom`: Routing
- `axios`: HTTP client
- `lucide-react`: Icons
- `tailwindcss`: CSS framework
- `@vitejs/plugin-react`: Vite React plugin

#### Step 3: create .env and Google Client ID 

The Google Client ID(.env) is stored in `frontend/.env`. Update it if needed:

```typescript
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```


#### Step 4: Run the Frontend

```bash
npm run dev
```

The frontend will start on **http://localhost:5173**

---

## 🚀 Running the Application

### Start Both Servers

**Terminal 1 - Backend:**
```bash
cd TodoTimelineApi
dotnet run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Access the Application

- **Frontend Application**: http://localhost:5173
- **Frontend Login pagen**: http://localhost:5173/login
- **Backend API**: http://localhost:5007/api
- **Swagger Documentation**: http://localhost:5007/swagger

---

## 🔐 How to Collect Tokens

### 1. Google OAuth Token (Automatic)

1. Open http://localhost:5173
2. Click "Sign in with Google"
3. Select your Google account
4. The frontend automatically:
   - Receives Google ID token
   - Sends it to backend: `POST /api/auth/google/token`
   - Receives JWT token from backend
   - Stores JWT in `localStorage`

**Check Token in Browser:**
```javascript
// Open browser console (F12)
localStorage.getItem("token")
```

### 2. GitHub Personal Access Token (Manual)

1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` and `read:user` scopes
3. Copy token to `appsettings.Development.json`:
   ```json
   "Github": {
     "Token": "github_pat_..."
   }
   ```

### 3. JWT Token (For API Testing)

**From Browser Console:**
```javascript
localStorage.getItem("token")
```

**From Swagger UI:**
1. Go to http://localhost:5007/swagger
2. Click "Authorize" button
3. Enter: `Bearer <your-jwt-token>`
4. Click "Authorize"

---

## 📚 How to Check Swagger

### Access Swagger UI

1. Start the backend server:
   ```bash
   cd TodoTimelineApi
   dotnet run
   ```

2. Open browser and navigate to:
   **http://localhost:5007/swagger**

### Using Swagger UI

1. **View All Endpoints**: All API endpoints are listed by controller
2. **Test Endpoints**:
   - Click on an endpoint to expand
   - Click "Try it out"
   - Fill in parameters
   - Click "Execute"
3. **Authorize Requests**:
   - Click "Authorize" button at top
   - Enter: `Bearer <your-jwt-token>`
   - Click "Authorize"
   - All requests will now include the token
4. **View Response**: See response code, headers, and body
5. **View Schema**: Click "Schema" to see request/response models

**Note on `GET /api/auth/google`**: 
- This endpoint normally redirects to Google OAuth (for browser use)
- To test in Swagger, add query parameter `format=json` (e.g., `/api/auth/google?format=json`)
- This returns JSON with the OAuth URL instead of redirecting

### Swagger Endpoints

- **Swagger UI**: http://localhost:5007/swagger
- **OpenAPI JSON**: http://localhost:5007/swagger/v1/swagger.json
- **OpenAPI YAML**: http://localhost:5007/swagger/v1/swagger.yaml

---

## 📡 API Endpoints

### Authentication API (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/auth/google` | Initiate Google OAuth flow (redirects to Google). Use `?format=json` for JSON response | No |
| GET | `/api/auth/google/callback` | Google OAuth callback | No |
| POST | `/api/auth/google/token` | Exchange Google ID token for JWT | No |
| GET | `/api/auth/me` | Get current user info | Yes |

### Timeline API (`/api/timeline`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/timeline` | Get all timeline entries for user | Yes |
| POST | `/api/timeline` | Create new timeline entry | Yes |
| PUT | `/api/timeline/{id}` | Update timeline entry | Yes |
| DELETE | `/api/timeline/{id}` | Delete timeline entry | Yes |

### GitHub API (`/api/github`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/github/activity?username={username}` | Get GitHub activity events | Yes |
| GET | `/api/github/profile?username={username}` | Get GitHub user profile | Yes |
| GET | `/api/github/repos?username={username}` | Get GitHub repositories | Yes |
| GET | `/api/github/contributions?username={username}` | Get GitHub contributions | Yes |
| GET | `/api/github/commits?username={username}&repo={repo}` | Get repository commits | Yes |

---

## 📁 Project Structure

### Backend Project Structure

```
TodoTimelineApi/
├── Controllers/              # API Controllers
│   ├── AuthController.cs     # Authentication endpoints
│   ├── TimelineController.cs # Timeline CRUD operations
│   └── GithubController.cs  # GitHub API integration
│
├── Services/                 # Business Logic Layer
│   ├── Interfaces/          # Service interfaces
│   │   ├── IAuthService.cs
│   │   ├── ITimelineService.cs
│   │   └── IGithubService.cs
│   ├── AuthService.cs       # Authentication logic
│   ├── TimelineService.cs   # Timeline operations
│   └── GithubService.cs     # GitHub API calls
│
├── Models/                   # Database Models
│   ├── User.cs              # User entity
│   ├── TimelineEntry.cs    # Timeline entry entity
│   └── ApiConnection.cs     # API connection entity
│
├── DTOs/                     # Data Transfer Objects
│   ├── AuthDtos.cs          # Authentication DTOs
│   ├── TimelineEntryRequest.cs  # Timeline request DTO
│   └── TimelineEntryResponse.cs # Timeline response DTO
│
├── Data/                     # Database Context
│   └── AppDbContext.cs      # EF Core DbContext
│
├── Migrations/               # Database Migrations
│   ├── 20251122062931_InitialCreate.cs
│   └── AppDbContextModelSnapshot.cs
│
├── Utils/                     # Utilities
│   └── JwtHelper.cs         # JWT token generation
│
├── Properties/               # Project Properties
│   └── launchSettings.json  # Launch configuration
│
├── uploads/                  # Uploaded files directory
│
├── Program.cs               # Application entry point
├── appsettings.json         # Production configuration
├── appsettings.Development.json  # Development configuration
└── TodoTimelineApi.csproj   # Project file
```

### Frontend Project Structure

```
frontend/
├── src/
│   ├── api/                  # API Client Functions
│   │   ├── authApi.ts       # Authentication API calls
│   │   ├── timelineApi.ts  # Timeline API calls
│   │   ├── github.ts        # GitHub API calls
│   │   └── uploadApi.ts     # File upload API calls
│   │
│   ├── components/          # React Components
│   │   ├── Navigation.tsx   # Main navigation bar
│   │   ├── github/         # GitHub components
│   │   │   ├── GithubDashboard.tsx
│   │   │   └── GithubWidget.tsx
│   │   └── timeline/       # Timeline components
│   │       ├── TimelineItem.tsx
│   │       ├── TimelineList.tsx
│   │       ├── TimelineCreateModal.tsx
│   │       ├── TimelineEditModal.tsx
│   │       ├── TimelineFilters.tsx
│   │       ├── TimelineStats.tsx
│   │       ├── TimelineCalendarView.tsx
│   │       └── ...
│   │
│   ├── context/             # React Context Providers
│   │   ├── AuthContext.tsx  # Authentication state
│   │   └── TimelineContext.tsx  # Timeline data state
│   │
│   ├── pages/              # Page Components
│   │   ├── Login.tsx       # Login page
│   │   ├── Timeline.tsx    # Main timeline page
│   │   ├── TimelineWorkspace.tsx  # Entry detail page
│   │   ├── Dashboard.tsx   # GitHub dashboard
│   │   ├── Profile.tsx     # User profile page
│   │   └── OAuthCallback.tsx  # OAuth callback handler
│   │
│   ├── types/              # TypeScript Type Definitions
│   │   └── TimelineEntry.ts
│   │
│   ├── utils/              # Utility Functions
│   │   └── formatDate.ts
│   │
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
│
├── public/                # Static Assets
│   └── login-visual.png
│
├── index.html            # HTML template
├── package.json          # Dependencies
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

---

## 🗄️ Database Schema Summary

### Users Table

| Column | Type | Description |
|--------|------|-------------|
| Id | int | Primary key, auto-incremented |
| Email | string | User email address (unique) |
| Name | string | User display name |
| CreatedAt | DateTime | Account creation timestamp |

### TimelineEntries Table

| Column | Type | Description |
|--------|------|-------------|
| Id | int | Primary key, auto-incremented |
| UserId | int | Foreign key to Users table |
| Title | string | Entry title (required, max 200 chars) |
| Description | string | Entry description (max 1000 chars) |
| Category | string | Entry category (max 50 chars) |
| ImageUrl | string | URL to associated image |
| EventDate | DateTime | When the event occurred |
| EntryType | string | Type: Activity, Achievement, Milestone, Memory |
| SourceApi | string | Source: manual, github, spotify |
| ExternalUrl | string | Link to external resource |
| ExternalId | string | External system ID |
| Metadata | string | JSON metadata (stored as string) |
| CreatedAt | DateTime | Creation timestamp |
| UpdatedAt | DateTime | Last update timestamp |

### ApiConnections Table

| Column | Type | Description |
|--------|------|-------------|
| Id | int | Primary key, auto-incremented |
| UserId | int | Foreign key to Users table |
| ApiName | string | API name (e.g., "GitHub", "Spotify") |
| AccessToken | string | Encrypted access token |
| RefreshToken | string | Encrypted refresh token |
| ExpiresAt | DateTime | Token expiration time |
| CreatedAt | DateTime | Connection creation timestamp |

---

## 📝 Timeline Entry Structure

### Complete Field Reference

#### Required Fields

| Field | Type | Description | Max Length | Example |
|-------|------|-------------|------------|---------|
| **Title** | `string` | The main title/name of the timeline entry | 200 characters | `"Meeting with Team"` |
| **UserId** | `int` | ID of the user who owns this entry (auto-set by backend) | - | `1` |

#### Optional Fields

| Field | Type | Description | Max Length | Example |
|-------|------|-------------|------------|---------|
| **Description** | `string` | Detailed description of the entry | 1000 characters | `"Weekly standup meeting"` |
| **Category** | `string` | Category/type of entry for filtering | 50 characters | `"GitHub"`, `"Meeting"`, `"Code"` |
| **ImageUrl** | `string` | URL to an image associated with the entry | Unlimited | `"https://example.com/image.jpg"` |
| **EventDate** | `DateTime` | When the event occurred (ISO 8601 format) | - | `"2024-01-15T10:00:00Z"` |
| **EntryType** | `string` | Type classification | 50 characters | `"Activity"`, `"Achievement"` |
| **SourceApi** | `string` | Source of the entry | - | `"manual"`, `"github"` |
| **ExternalUrl** | `string` | Link to external resource | - | `"https://github.com/user/repo"` |
| **ExternalId** | `string` | External system's ID | - | `"github-event-123"` |
| **Metadata** | `string` | Additional JSON data (stored as string) | - | `"{\"source\":\"github\"}"` |

#### Auto-Generated Fields

| Field | Type | Description |
|-------|------|-------------|
| **Id** | `int` | Unique identifier (auto-incremented) |
| **CreatedAt** | `DateTime` | Creation timestamp |
| **UpdatedAt** | `DateTime` | Last update timestamp |

### Example Request (Create Entry)

```json
{
  "Title": "Completed Feature Implementation",
  "Description": "Finished implementing user authentication",
  "Category": "GitHub",
  "ImageUrl": "https://example.com/image.jpg",
  "EventDate": "2024-01-15T10:00:00Z",
  "EntryType": "Activity",
  "SourceApi": "manual"
}
```

### Example Response

```json
{
  "Id": 1,
  "UserId": 1,
  "Title": "Completed Feature Implementation",
  "Description": "Finished implementing user authentication",
  "Category": "GitHub",
  "ImageUrl": "https://example.com/image.jpg",
  "EventDate": "2024-01-15T10:00:00Z",
  "EntryType": "Activity",
  "SourceApi": "manual",
  "CreatedAt": "2024-01-15T10:00:00Z",
  "UpdatedAt": "2024-01-15T10:00:00Z"
}
```

---

## 🔒 CORS Configuration

The API is configured with CORS to allow requests from:

- **Development**: `http://localhost:5173` (Vite default)
- **Production**: Configure in `Program.cs` for your production domain

**CORS Policy** (configured in `Program.cs`):
```csharp
policy.AllowAnyHeader()
      .AllowAnyMethod()
      .AllowAnyOrigin();
```

**Note**: For production, restrict `AllowAnyOrigin()` to specific domains.

---

## 🔐 OAuth Authentication Flow

### Key Configuration Notes

**⚠️ Critical Setup Requirements:**

1. **Google Cloud Console**:
   - Authorized JavaScript origins must include `http://localhost:5173`
   - Authorized redirect URIs must include `http://localhost:5007/api/auth/google/callback`

2. **Frontend**:
   - Google Client ID must match the one in Google Cloud Console
   - Configured in `src/context/AuthContext.tsx`

3. **Backend**:
   - Client ID and Secret must match Google Cloud Console
   - Configured in `appsettings.Development.json`

### Authentication Flow

1. User clicks "Sign in with Google" on frontend
2. Google Identity Services shows sign-in popup
3. User authenticates with Google
4. Google returns ID token to frontend
5. Frontend sends ID token to backend: `POST /api/auth/google/token`
6. Backend validates token with Google and creates JWT
7. Backend returns JWT to frontend
8. Frontend stores JWT in `localStorage`
9. All subsequent API requests include JWT in Authorization header

---

## 🔗 API Integration

### Data Flow

```
Frontend (React)
    ↓
API Service Layer (axios)
    ↓
Backend API (ASP.NET Core)
    ↓
Service Layer (Business Logic)
    ↓
Entity Framework Core
    ↓
SQLite Database
```

### Frontend API Configuration

API base URL is configured in:
- `src/api/authApi.ts`
- `src/api/timelineApi.ts`
- `src/api/github.ts`

Default: `http://localhost:5007/api`

---

## 🛠️ Development Features

### Error Handling

- API request failures are handled gracefully
- Error states display in UI with retry options
- Console logging for debugging
- Network error resilience

### Loading States

- Loading indicators during API calls
- Skeleton screens for better UX
- Async operation feedback
- Optimistic UI updates

---

## 📦 Building for Production

### Backend

```bash
cd TodoTimelineApi
dotnet publish -c Release -o ./publish
```

### Frontend

```bash
cd frontend
npm run build
```

Production build will be in `frontend/dist/`

---

## 🚢 Deployment Considerations

### Frontend

- Build: `npm run build`
- Serve: `npm run preview`
- Environment variables for API URL
- Static file hosting ready (Netlify, Vercel, GitHub Pages)

### Backend

- Build: `dotnet build`
- Run: `dotnet run`
- Update `appsettings.json` with production values
- Set environment variables for sensitive data
- Run migrations on production database

---

## 🧪 Testing

### Backend Testing

```bash
cd TodoTimelineApi
dotnet test
```

### Frontend Testing

```bash
cd frontend
npm test
```

### Manual Testing with Swagger

1. Start backend: `dotnet run`
2. Open http://localhost:5007/swagger
3. Click "Authorize"
4. Enter JWT token: `Bearer <your-token>`
5. Test endpoints directly from Swagger UI

---

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
lsof -i :5007
kill -9 <PID>
```

**Database migration errors:**
```bash
rm TodoTimelineApi/timeline.db
dotnet ef database update
```

**JWT validation errors:**
- Ensure JWT key is base64 encoded
- Check key is at least 64 characters

### Frontend Issues

**Port already in use:**
```bash
lsof -ti:5173 | xargs kill -9
```

**Module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**CORS errors:**
- Check backend CORS configuration in `Program.cs`
- Verify frontend URL is allowed

**Google OAuth errors:**
- Verify JavaScript origin in Google Cloud Console
- Check redirect URI matches exactly
- Ensure Client ID is correct

---

## 📝 Environment Variables

### Backend (.NET)

```bash
export Jwt__Key="your-jwt-key"
export Authentication__Google__ClientId="your-client-id"
export Authentication__Google__ClientSecret="your-client-secret"
export Github__Token="your-github-token"
```

### Frontend

Create `.env` file:
```
VITE_API_BASE_URL=http://localhost:5007/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

---

## 📚 Additional Documentation

- **API Documentation**: See `API_DOCUMENTATION.md` for complete API reference
- **Swagger UI**: http://localhost:5007/swagger (when backend is running)

---

## 👤 Author

**Radhika Mangroliya**
- GitHub: [@Radhikamangroliya](https://github.com/Radhikamangroliya)
- LinkedIn: [Radhika Mangroliya](https://www.linkedin.com/in/radhika-mangroliya-87aa75214/)
- Portfolio: [radhika-mangroliya-ai.netlify.app](https://radhika-mangroliya-ai.netlify.app/)
- Email: radhikamangroliya0@gmail.com

---

## 📄 License

This project is licensed under the MIT License.

---

**Happy Coding! 🚀**
How to Test in Swagger
Go to http://localhost:5007/swagger
Find GET /api/auth/google
Click "Try it out"
Add query parameter: format = json
Click "Execute"
You should now see a JSON response like:

{
  "oauthUrl": "https://accounts.google.com/o/oauth2/v2/auth?...",
  "redirectUri": "http://localhost:5007/api/auth/google/callback",
  "message": "Use this URL to initiate Google OAuth flow..."
}

Test in Swagger
Open http://localhost:5007/swagger
Find GET /api/auth/google
Click "Try it out"
Click "Execute" (no parameters needed)
You should see a JSON response like:
{
  "oauthUrl": "https://accounts.google.com/o/oauth2/v2/auth?...",
  "redirectUri": "http://localhost:5007/api/auth/google/callback",
  "message": "Use this URL to initiate Google OAuth flow..."
}


add authorize token 
find GET/api/auth/me
Click "Execute"
You should now see a JSON response like:
{
  "id": "2",
  "email": null,
  "name": "Radhika Mangroliya"
}


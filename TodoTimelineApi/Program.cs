using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TodoTimelineApi.Data;
using TodoTimelineApi.Services.Interfaces;
using TodoTimelineApi.Services;

var builder = WebApplication.CreateBuilder(args);

//
// -------------------------------------------------------------
// 1️⃣ Database Setup (SQLite)
// -------------------------------------------------------------
// Here I'm connecting Entity Framework to a local SQLite database.
// This keeps things simple during development and also satisfies
// the project requirement for persistent storage.
//
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("SqliteConnection"))
);

//
// -------------------------------------------------------------
// 2️⃣ Register Application Services
// -------------------------------------------------------------
// Adding my services to the DI container so controllers can
// request them through constructor injection. These services
// handle all the core logic for authentication and timeline CRUD.
//
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITimelineService, TimelineService>();
// Later I'll uncomment these once I finish API integrations.
builder.Services.AddScoped<IGithubService, GithubService>();
builder.Services.AddScoped<IGoogleCalendarService, GoogleCalendarService>();

//builder.Services.AddScoped<ISpotifyService, SpotifyService>();

//
// -------------------------------------------------------------
// 3️⃣ Controller + JSON Options
// -------------------------------------------------------------
// Enabling controllers and customizing JSON settings.
// I'm keeping PascalCase because my DTOs use it, but also
// allowing case-insensitive input so the frontend doesn't break.
//
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null; 
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

//
// -------------------------------------------------------------
// 4️⃣ Swagger (API Documentation)
// -------------------------------------------------------------
// Enabling Swagger so it's easier to test endpoints and so that
// the project includes proper API documentation, which is a
// submission requirement.
//
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//
// -------------------------------------------------------------
// 5️⃣ CORS for React Frontend
// -------------------------------------------------------------
// Allowing requests from the local React dev server. Without this,
// the browser would block calls from the frontend to the API.
//
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .WithOrigins("http://localhost:5173", "http://127.0.0.1:5173");
    });
});

//
// -------------------------------------------------------------
// 6️⃣ JWT Authentication Setup
// -------------------------------------------------------------
// Configuring JWT bearer authentication. I'm loading the signing
// key and issuer/audience values from appsettings.json.
// This part validates tokens for all protected API routes.
//
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey))
        };
    });

//
// -------------------------------------------------------------
// 7️⃣ Authorization Middleware
// -------------------------------------------------------------
// Just enabling the built-in authorization system. Most of my
// timeline endpoints will use [Authorize] attribute.
//
builder.Services.AddAuthorization();

var app = builder.Build();

//
// -------------------------------------------------------------
// 8️⃣ Apply EF Core Migrations Automatically
// -------------------------------------------------------------
// Running migrations at startup so the database always matches
// the models. This prevents common errors during development.
//
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

//
// -------------------------------------------------------------
// 9️⃣ Common Middleware
// -------------------------------------------------------------
// Enabling CORS, Swagger (only in development), authentication,
// and authorization. This is the normal pipeline for most APIs.
//
app.UseCors("AllowFrontend");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

//
// -------------------------------------------------------------
// 🔟 Map All Controllers
// -------------------------------------------------------------
// This tells ASP.NET Core to look for controller classes and
// map their routes automatically.
//
app.MapControllers();

app.Run();
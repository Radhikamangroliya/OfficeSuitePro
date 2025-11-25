using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using TodoTimelineApi.Data;
using TodoTimelineApi.Services.Interfaces;
using TodoTimelineApi.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

//
// -------------------------------------------------------------
// 1️⃣ DATABASE (SQLite)
// -------------------------------------------------------------
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("SqliteConnection"))
);

//
// -------------------------------------------------------------
// 2️⃣ DEPENDENCY INJECTION
// -------------------------------------------------------------
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITimelineService, TimelineService>();
builder.Services.AddScoped<IGithubService, GithubService>();
builder.Services.AddScoped<IGoogleCalendarService, GoogleCalendarService>();

//
// -------------------------------------------------------------
// 3️⃣ CONTROLLERS + JSON
// -------------------------------------------------------------
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

//
// -------------------------------------------------------------
// 4️⃣ SWAGGER + JWT AUTHORIZATION BUTTON
// -------------------------------------------------------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "TodoTimelineApi",
        Version = "v1"
    });

    // --- JWT Security Definition ---
    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Enter: Bearer {token}",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = "Bearer"
        }
    };

    c.AddSecurityDefinition("Bearer", securityScheme);

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { securityScheme, new string[] {} }
    });
});

//
// -------------------------------------------------------------
// 5️⃣ CORS FOR FRONTEND
// -------------------------------------------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .WithOrigins("http://localhost:5173", "http://127.0.0.1:5173");
    });
});

//
// -------------------------------------------------------------
// 6️⃣ JWT AUTHENTICATION
// -------------------------------------------------------------
var jwtKey = Convert.FromBase64String(builder.Configuration["Jwt:Key"]);
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
            IssuerSigningKey = new SymmetricSecurityKey(jwtKey)
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

//
// -------------------------------------------------------------
// 7️⃣ APPLY DB MIGRATIONS
// -------------------------------------------------------------
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

//
// -------------------------------------------------------------
// 8️⃣ MIDDLEWARE PIPELINE
// -------------------------------------------------------------
app.UseCors("AllowFrontend");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

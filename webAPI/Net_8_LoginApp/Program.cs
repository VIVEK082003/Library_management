    using Microsoft.AspNetCore.Authentication.JwtBearer;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.IdentityModel.Tokens;
    using System.Text;
    using LibraryManagementAPI.Models;
    using Lms.Services.Repository;

    var builder = WebApplication.CreateBuilder(args);

    // Add services to the container.
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    // Add AutoMapper
    builder.Services.AddAutoMapper(typeof(Program)); 

    builder.Services.AddScoped<IUserService, UserService>();
    builder.Services.AddScoped<IGenreService, GenreService>();
    builder.Services.AddScoped<IBookService, BookService>();
    builder.Services.AddScoped<IRequestBookService, RequestBookService>();
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowLocalhost",
            policy =>
            {
                policy.WithOrigins("http://localhost:4201/") // Specify the local React app origin
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            });
    });

    builder.Services.AddDbContext<LmsContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("DBCS")));

    var key = Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"]);
    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    }).AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

    builder.Services.AddAuthorization();

    var app = builder.Build();

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();

    app.UseCors("AllowLocalhost");

    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();

    app.Run();

using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public static class JwtUtility
{
    public static string GenerateJwtToken(string email, string secretKey, string issuer, string audience, double expirationMinutes = 60)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(secretKey);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Email, email),
                // Add more claims as needed
            }),
            Expires = DateTime.UtcNow.AddMinutes(expirationMinutes),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = issuer,
            Audience = audience
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public static ClaimsPrincipal ValidateJwtToken(string token, string secretKey, string issuer, string audience)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(secretKey);
        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
        try
        {
            SecurityToken validatedToken;
            return tokenHandler.ValidateToken(token, validationParameters, out validatedToken);
        }
        catch
        {
            return null;
        }
    }
}

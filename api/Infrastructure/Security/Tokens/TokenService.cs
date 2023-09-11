using Domain.Entities;
using MFC.Infrastructure.DataBase;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Security.Tokens
{
    public class TokenService : ITokenService
    {
        private readonly KTMSDbContext _context;

        public TokenService(KTMSDbContext context)
        {
            _context = context;
        }
        
        public bool DeleteRefreshToken(string refreshToken)
        {
            try
            {
                var Token = _context.Tokens.FirstOrDefault(t => t.RefreshToken == refreshToken);
                if (Token != null)
                {
                    _context.Tokens.Remove(Token);
                    _context.SaveChanges();
                    return true;
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
            return false;
        }

        public string GenerateAccessToken(IEnumerable<Claim> claims)
        {
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("superSecretKey@345"));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokeOptions = new JwtSecurityToken(
                issuer: "https://localhost:5001",
                audience: "https://localhost:5001",
                claims: claims,
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: signinCredentials
            );
            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
            return tokenString;
        }
        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }
        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false, //you might want to validate the audience and issuer depending on your use case
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("superSecretKey@345")),
                ValidateLifetime = false //here we are saying that we don't care about the token's expiration date
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken;
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");
            return principal;
        }

        public TokenModel GetUserByToken(string refreshToken)
        {
            return _context.Tokens.Include(u=>u.User).FirstOrDefault(t => t.RefreshToken== refreshToken);
        }

        public void SaveRefreshToken(TokenModel tokenModel)
        {
            var token = _context.Tokens.FirstOrDefault(tkn=>tkn.User.Id == tokenModel.User.Id);
            if (token == null)
            {
                _context.Tokens.Add(tokenModel);
            }
            else
            {
                token.RefreshToken = tokenModel.RefreshToken;
                token.DateExpires = tokenModel.DateExpires; 
                _context.Update(token);
            }
            _context.SaveChanges();
        }
        public void UpdateRefreshToken(TokenModel tokenModel)
        {
            _context.Tokens.Update(tokenModel);
            _context.SaveChanges();
        }
    }
}

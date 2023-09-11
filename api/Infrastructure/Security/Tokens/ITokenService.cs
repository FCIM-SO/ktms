using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Security.Tokens
{
    public interface ITokenService
    {
        string GenerateAccessToken(IEnumerable<Claim> claims);
        string GenerateRefreshToken();
        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
        void SaveRefreshToken(TokenModel tokenModel);
        TokenModel GetUserByToken(string refreshToken);
        void UpdateRefreshToken(TokenModel tokenModel);
        bool DeleteRefreshToken(string refreshToken);
    }
}

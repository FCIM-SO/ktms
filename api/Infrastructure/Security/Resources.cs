using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Security
{
    public sealed record LoginResource(string Username, string Password);
    public sealed record UserResource(int Id, string Username,Person Person,Role Role);
    public sealed record RegisterResource(string Username, string Password, 
        Person Person,Role Role);

    public class AuthenticatedResponse
    {
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
        public UserResource? User { get; set; }
    }
    public class TokenApiModel
    {
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
    }
}

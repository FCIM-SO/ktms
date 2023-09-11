using Domain.Entities;
using Infrastructure.IRepositories;
using Infrastructure.Security;
using Infrastructure.Security.Tokens;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Internal;
using System.Security.Claims;

namespace KTMSApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserService _userService;
        private readonly ITokenService _tokenService;
        public AuthController(IUserRepository userRepository, ITokenService tokenService, IUserService userService)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
            _userService = userService;
        }
        [HttpPost, Route("login")]
        public IActionResult Login([FromBody] LoginResource loginModel)
        {
            if (loginModel is null)
            {
                return BadRequest("Invalid client request");
            }
            var user = _userService.Login(loginModel);
            if (user is null)
                return Unauthorized();
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, loginModel.Username),
        };
            var accessToken = _tokenService.GenerateAccessToken(claims);
            var refreshToken = _tokenService.GenerateRefreshToken();
            TokenModel UserToken = new TokenModel()
            {
                RefreshToken = refreshToken,
                DateExpires = DateTime.Now.AddDays(7),
                User = _userService.GetUser(user)
            };
            _tokenService.SaveRefreshToken(UserToken);
            HttpContext.Response.Cookies.Append("refreshToken", UserToken.RefreshToken);
            //user.RefreshToken = refreshToken;
            //user.RefreshTokenExpiryTime = 
            //_userContext.SaveChanges();
            return Ok(new AuthenticatedResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                User = user,
            });
        }

        [HttpPost, Route("register")]
        public IActionResult Register([FromBody] RegisterResource registerModel)
        {
            if (registerModel is null) return BadRequest("Null From Client");

            var usr = _userService.Register(registerModel);
            return Ok(usr);
        }

    }
}


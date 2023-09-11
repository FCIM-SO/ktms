using Infrastructure.Security.Tokens;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace KTMSApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ITokenService _tokenService;
        public TokenController(IUserService userContext, ITokenService tokenService)
        {
            this._userService = userContext ?? throw new ArgumentNullException(nameof(userContext));
            this._tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
        }
        [HttpGet]
        [Route("refresh")]
        public IActionResult Refresh()
        {

            string refresh = HttpContext.Request.Cookies["refreshToken"];
            if (refresh is null || refresh == "")
                return Unauthorized();
            try
            {
                var UserTokens = _tokenService.GetUserByToken(refresh);
                if(UserTokens is null)
                {
                    return BadRequest();
                }
                var user = _userService.GetUserByName(UserTokens.User.Id);

                if (user is null || UserTokens.RefreshToken != refresh || UserTokens.DateExpires <= DateTime.Now)
                    return Unauthorized();
                var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.UserName),
        };
                var newAccessToken = _tokenService.GenerateAccessToken(claims);
                var newRefreshToken = _tokenService.GenerateRefreshToken();
                UserTokens.RefreshToken = newRefreshToken;
                UserTokens.DateExpires = DateTime.Now.AddDays(7);
                HttpContext.Response.Cookies.Delete("refreshToken");
                _tokenService.UpdateRefreshToken(UserTokens);
                HttpContext.Response.Cookies.Append("refreshToken", UserTokens.RefreshToken);
                return Ok(new AuthenticatedResponse()
                {
                    AccessToken = newAccessToken,
                    RefreshToken = newRefreshToken,
                    User = new UserResource(user.Id,user.UserName,user.Person,user.Role),
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
        [HttpPost, Authorize]
        [Route("logout")]
        public IActionResult Logout()
        {
           
            try
            {
                var refreshToken = HttpContext.Request.Cookies["refreshToken"];
                if (refreshToken != null)
                {
                    _tokenService.DeleteRefreshToken(refreshToken);
                    return Ok();
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
            return NoContent();
        }

    }
}

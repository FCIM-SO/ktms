using BCrypt.Net;
using Domain.Entities;
using Infrastructure.IRepositories;
using Infrastructure.Security;
using MFC.Infrastructure.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private KTMSDbContext _context;
        private IUserService _userService;

        
        public UserRepository(KTMSDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

      
        public void CreateUser(string login, string password)
        {
            throw new NotImplementedException();
        }

        public UserModel GetUser(LoginResource userModel)
        {
            throw new NotImplementedException();

        }
    }
}

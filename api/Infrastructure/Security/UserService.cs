using Domain.Entities;
using MFC.Infrastructure.DataBase;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Security
{
    public sealed class UserService : IUserService
    {
        private readonly KTMSDbContext _context;
        private readonly string _pepper;
        private readonly int _iteration = 3;

        public UserService(KTMSDbContext context)
        {
            _context = context;
            _pepper = Environment.GetEnvironmentVariable("PasswordHashExamplePepper");
        }

        public async Task<UserResource> Register(RegisterResource resource)
        {
            var user = new UserModel
            {
                UserName = resource.Username,
                PasswordSalt = PasswordHasher.GenerateSalt(),
                Role = _context.Roles.Where(p => p.Id == resource.Role.Id).FirstOrDefault(),
                Person = _context.Persons.Where(p => p.Id == resource.Person.Id).FirstOrDefault()
                
            };
            user.PasswordHash = PasswordHasher.ComputeHash(resource.Password, user.PasswordSalt, _pepper, _iteration);
            _context.Users.Add(user);
             _context.SaveChanges();

            return new UserResource(user.Id, user.UserName,user.Person,user.Role);
        }

        public  UserResource Login(LoginResource resource)
        {
            var user =  _context.Users.Include(r => r.Role)
                .Include(p => p.Person)
                .FirstOrDefault(x => x.UserName == resource.Username);

            if (user == null)
                throw new Exception("Username or password did not match.");

            var passwordHash = PasswordHasher.ComputeHash(resource.Password, user.PasswordSalt, _pepper, _iteration);
            if (user.PasswordHash != passwordHash)
                throw new Exception("Username or password did not match.");

            return new UserResource(user.Id, user.UserName, user.Person, user.Role);
        }
        public UserModel GetUser(UserResource userModel)
        {
            var user = _context.Users.FirstOrDefault(
                usr => usr.Id == userModel.Id
                );
            return user;
        }
        public UserModel GetUserByName(int Id)
        {
            return _context.Users
                .Include(r=>r.Role)
                .Include(p=>p.Person)
                .SingleOrDefault(u => u.Id == Id);
        }
    }
}

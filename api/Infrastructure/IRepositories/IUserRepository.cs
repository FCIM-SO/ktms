using Domain.Entities;
using Infrastructure.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.IRepositories
{
    public interface IUserRepository
    {
       void CreateUser(string login,string password);

        UserModel GetUser(LoginResource userModel);

    }
}

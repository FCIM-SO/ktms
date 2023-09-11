using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class UserModel
    {
        public UserModel()
        {
        }

        public UserModel(int _Id)
        {
            Id = _Id;
        }
        public int Id { get; set; }
        public string UserName { get; set; }
        public string PasswordSalt { get; set; }
        public string PasswordHash { get; set; }
        public Role Role { get; set; }
        public Person Person { get; set; }

        [JsonIgnore]
        public ICollection<TokenModel> Tokens { get; }
    }
}

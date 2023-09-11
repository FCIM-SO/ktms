using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class TokenModel
    {
        public int Id { get; set; } 
        public UserModel User { get; set; }
        public string RefreshToken { get; set; }

        public  DateTime DateExpires { get;set; }
    }
}

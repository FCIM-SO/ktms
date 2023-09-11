using Microsoft.AspNetCore.SignalR;
using System.Runtime.InteropServices;

namespace KTMSApi
{
    public class VideoHub : Hub
    {
        //public async Task JoinRoom()
        //{
        //}

        public async Task BroadCastVideo(object stream)
        {
            await Clients.Others.SendAsync("ReceiveVideo", stream);
        }
    }
}

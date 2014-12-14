using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;

namespace TwilioSvc.Controllers
{
    public class TwilioController : ApiController
    {
        private static List<string> _numbers;

        public HttpResponseMessage Get(string from, string body)
        {
            if(!Numbers.Contains(from))
                _numbers.Add(from);

            string content = @"<?xml version=""1.0"" encoding=""UTF-8"" ?>
<Response>
    <Message>Message received!  Stay tuned...</Message>
</Response>";

            var resp = new HttpResponseMessage(HttpStatusCode.OK);
            resp.Content = new StringContent(content, Encoding.UTF8, "application/xml");
            return resp;
        }

        public List<string> GetList()
        {
            return Numbers;
        }


        public static List<string> Numbers
        {
            get
            {
                _numbers = _numbers ?? new List<string>();
                return _numbers;
            }
        }
    }
}
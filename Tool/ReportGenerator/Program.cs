using System;

namespace ReportGenerator
{
    class Program
    {
        static void Main(string[] args)
        {
            TestSignWithKey();
        }

        static void TestSignWithKey()
        {
            var signService = new SignService();
            var publicKey = "0x04436c5ea4d5bd45d5369e80096af55d81e93053233423a71536b360708c880402d935e4d9d888bff43be1b2b1d92e168a59c63e940c86e4d4108e456c7cbc9bf0";
            var address = signService.GenerateAddressOnEthereum(publicKey);
            Console.WriteLine(address);
            Console.WriteLine("0x824b3998700F7dcB7100D484c62a7b472B6894B6");
        }
    }
}
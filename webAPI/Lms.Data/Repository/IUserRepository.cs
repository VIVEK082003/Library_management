namespace Lms.Data.Repository
{
    internal interface IUserRepository
    {
        void AddUser(User user);
        User GetUserByEmailAndPassword(string email, string password);
        User GetUserByUsernameOrEmail(string username, string email);


    }
}

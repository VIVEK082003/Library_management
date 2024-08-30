
using LibraryManagementAPI.Models;
using Lms.Data.Repository;

namespace Lms.Data.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly LmsContext dbContext;

        public UserRepository(LmsContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public User GetUserByEmailAndPassword(string email, string password)
        {
            return dbContext.Users.FirstOrDefault(x => x.Email == email && x.Password == password);
        }

        public User GetUserByUsernameOrEmail(string username, string email)
        {
            return dbContext.Users.FirstOrDefault(x => x.UserName == username || x.Email == email);
        }

        public void AddUser(User user)
        {
            dbContext.Users.Add(user);
            dbContext.SaveChanges();
        }

        //private EmsContext _context;
        //public UserRepository(EmsContext context)
        //{
        //        _context = context;
        //}
        //void IUserRepository.AddUser(User user)
        //{
        //    return _context..FirstOrDefault(x => x.Email == email && x.Password == password);
        //}

        //User IUserRepository.GetUserByEmailAndPassword(string email, string password)
        //{
        //    throw new NotImplementedException();
        //}

        //User IUserRepository.GetUserByUsernameOrEmail(string username, string email)
        //{
        //    throw new NotImplementedException();
        //}
    }
}

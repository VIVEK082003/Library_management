namespace Lms.Services.Repository
{
    public interface IUserService
    {
        LoginResponseDTO Authenticate(string email, string password);
        string GenerateJwtToken(UserDTO user);
        IEnumerable<UserDTO> GetAllUsers();
        UserDTO AddUser(UserDTO newUser);

        // New method to delete a user
        bool DeleteUser(int userId);
        UserDTO UpdateUser(int userId, UserDTO updatedUser);

    }
}

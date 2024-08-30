using AutoMapper;
using LibraryManagementAPI.Models;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<BookDTO, Book>();
        CreateMap<Book, BookDTO>();
    }
}

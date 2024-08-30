using LibraryManagementAPI.Models;
using Lms.Services.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

public class GenreService : IGenreService
{
    private readonly LmsContext dbContext;
    private readonly ILogger<GenreService> _logger;

    public GenreService(LmsContext dbContext, ILogger<GenreService> logger)
    {
        this.dbContext = dbContext;
        _logger = logger;
    }

    public IEnumerable<GenreDTO> GetAllGenres()
    {
        try
        {
            return dbContext.Genres.Select(genre => new GenreDTO
            {
                GenreId = genre.GenreId,
                GenreType = genre.GenreType
                // Map other properties as needed
            }).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while getting all genres.");
            throw;
        }
    }
    public GenreDTO UpdateGenre(int genreId, GenreDTO updatedGenre)
    {
        var genre = dbContext.Genres.FirstOrDefault(u => u.GenreId == genreId);

        if (genre == null)
        {
            return null; // Or throw an exception or handle accordingly
        }

        // Update user properties
        genre.GenreId = updatedGenre.GenreId;
        genre.GenreType = updatedGenre.GenreType;

        dbContext.SaveChanges();

        return new GenreDTO
        {
            GenreId = genre.GenreId,
            GenreType= updatedGenre.GenreType
        };
    }

    public GenreDTO AddGenre(GenreDTO newGenre)
    {
        var genre = new Genre
        {
            GenreId= newGenre.GenreId,
            GenreType= newGenre.GenreType
        };

        dbContext.Genres.Add(genre);
        dbContext.SaveChanges();

        return new GenreDTO
        {
            GenreId=newGenre.GenreId,
            GenreType=newGenre.GenreType
        };
    }

    public bool DeleteGenre(int genreId)
    {
        try
        {
            var genreEntity = dbContext.Genres.Find(genreId);
            if (genreEntity == null)
            {
                return false;
            }

            dbContext.Genres.Remove(genreEntity);
            dbContext.SaveChanges();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting the genre.");
            throw;
        }
    }
}

using LibraryManagementAPI.Models;
using Lms.Services.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace LibraryManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenreController : ControllerBase
    {
        private readonly IGenreService _genreService;

        public GenreController(IGenreService genreService)
        {
            _genreService = genreService;

        }

        // GET: api/Genre/GetGenre
        [HttpGet]
        [Route("GetGenre")]
        public ActionResult<IEnumerable<GenreDTO>> GetGenres()
        {
            var genres = _genreService.GetAllGenres();
            return Ok(genres);
        }

        // POST: api/Genre/AddGenre
        [HttpPost]
        [Route("AddGenre")]
        public ActionResult<GenreDTO> PostGenre([FromBody] GenreDTO genre)
        {
            if (genre == null)
            {
                return BadRequest("Genre data is null.");
            }

            try
            {
                var newGenre = _genreService.AddGenre(genre);
                return CreatedAtAction(nameof(GetGenres), new { id = newGenre.GenreId }, newGenre);
            }
            catch (ArgumentNullException ex)
            {
                // Log the exception (implement logging as needed)
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                // Log the exception (implement logging as needed)
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
            catch (Exception ex)
            {
                // Log the exception (implement logging as needed)
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {ex.Message}");
            }
        }
        [HttpPut]
        [Route("EditGenre/{genreId}")]
        public IActionResult UpdateGenre(int genreId, [FromBody] GenreDTO updatedGenre)
        {
            var result = _genreService.UpdateGenre(genreId, updatedGenre);

            if (result == null)
            {
                return NotFound(); // Or handle accordingly
            }

            return Ok(result);
        }
    }
}

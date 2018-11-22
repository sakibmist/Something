using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Todo.Api.Models;

namespace Todo.Api.Controllers
{
    [Route("api/todo-items")]
    [ApiController]
    public class TodoItemsController : ControllerBase
    {
        private readonly DataContext _dataContext;
        public TodoItemsController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [HttpGet]
        public IActionResult GetAllItems()
        {
            try
            {
                var items = _dataContext.Items.ToList();
                return Ok(items);
            }
            catch (System.Exception)
            {
                return BadRequest();
            }
        }

        [HttpGet("{id}", Name = "GetItem")]
        public IActionResult GetItemById(int id)
        {
            try
            {
                var item = _dataContext.Items.FirstOrDefault(x => x.Id == id);
                return Ok(item);
            }
            catch (System.Exception)
            {

                return BadRequest();
            }
        }

        [HttpPost]
        public IActionResult AddItem(Item item)
        {
            try
            {
                _dataContext.Add(item);
                _dataContext.SaveChanges();
                return CreatedAtRoute("GetItem", new { id = item.Id }, item);
            }
            catch (System.Exception)
            {
                return BadRequest();
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteById(int id)
        {
            try
            {
                var item = _dataContext.Items.FirstOrDefault(x => x.Id == id);
                if (item == null) return null;
                _dataContext.Items.Remove(item);
                _dataContext.SaveChanges();
                return Ok();
            }
            catch (System.Exception)
            {
                return BadRequest(); //statusCode 400
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateItem(int id, Item item)
        {
            try
            {
                if (id != item.Id) return BadRequest("Invalid Data");// validation status 400
                var data = _dataContext.Items.FirstOrDefault(x => x.Id == id);
                if (data == null) return NotFound(); // validation
                data.Name = item.Name;
                _dataContext.Items.Update(data);
                _dataContext.SaveChanges();
                return NoContent(); //statusCode 204
            }
            catch (System.Exception)
            {
                return BadRequest("Error occured");
            }
        }
    }
}
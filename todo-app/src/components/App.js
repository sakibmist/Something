import React, { Component } from "react";
//import logo from './logo.svg';
import "./App.css";
import http from "axios";

class App extends Component {
  state = {
    item: "",
    listofItems: [],
    isEditMode: false,
    editId: null
  };

  handleChange = event => {
    const { value } = event.target;
    this.setState({ item: value });
  };

  baseUrl = "http://localhost:5000/api/todo-items";

  async componentDidMount() {
    const response = await http.get(`${this.baseUrl}`);
    const listofItems = response.data || [];
    this.setState({ listofItems });
  }

  handleSubmit = async event => {
    event.preventDefault();
    //const { item, isEditMode, editId, listofItems } = this.state;

    const { isEditMode } = this.state;

    if (isEditMode) {
      this.updateTodoItem();
    } else {
      this.addTodoItem();
    }
  };

  updateTodoItem = async () => {
    const { editId, item, listofItems } = this.state;
    const response = await http.put(`${this.baseUrl}/${editId}`, {
      id: editId,
      name: item
    });
    if (response.status === 204) {
      const index = listofItems.findIndex(todoItem => todoItem.id === editId);
      if (index > -1) {
        listofItems[index].name = item;
        this.setState({
          listofItems,
          item: "",
          editId: null,
          isEditMode: false
        });
      }
    }
  };

  addTodoItem = async () => {
    const { item } = this.state;
    const response = await http.post(this.baseUrl, { name: item });
    if (response.status === 201) {
      const todoItem = response.data;
      this.setState(prevState => ({
        listofItems: [todoItem, ...prevState.listofItems],
        item: ""
      }));
    }
  };

  handleToggleEditMode = (todoItem = null) => {
    const isTodoItemEmpty = todoItem === null;
    this.setState({
      isEditMode: !isTodoItemEmpty,
      editId: !isTodoItemEmpty ? todoItem.id : null,
      item: !isTodoItemEmpty ? todoItem.name : ""
    });
  };

  // handleEnableEdit = (todoItem) => {
  //   this.setState({
  //     isEditMode: true,
  //     item: todoItem.name
  //   });
  // };

  // async doSomething () {

  // }

  handleToggle = async id => {
    const response = await http.put(`${this.baseUrl}/toggle-complete/${id}`);
    if (response.status === 204) {
      const { listofItems } = this.state;
      const index = listofItems.findIndex(item => item.id === id);
      if (index > -1) {
        listofItems[index].isDoneFlag = !listofItems[index].isDoneFlag;
        this.setState({ listofItems });
      }
    }
  };

  handleRemoveItem = async id => {
    const response = await http.delete(`${this.baseUrl}/${id}`);
    if (response.status === 200) {
      const { listofItems } = this.state;
      const index = listofItems.findIndex(todoItem => todoItem.id === id);
      if (index > -1) {
        listofItems.splice(index, 1);
        this.setState({ listofItems });
      }
    }
  };

  // handleCancelEditMode = () => {
  //   this.setState({
  //     isEditMode: false,
  //     item: ''
  //   });
  // };

  render() {
    const { item, isEditMode, listofItems } = this.state;
    return (
      <div className="container offset-1 col-sm-10">
        <div className="container">
          <div className="card-header jumbotron border">
            <h2 className="text-center">Header </h2>
          </div>
          <div className="card-body border design">
            <div className="offset-1 col-sm-10">
              <form onSubmit={this.handleSubmit}>
                <div className="offset-1 col-sm-10">
                  <div className="form-group row">
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className="form-control "
                        name="item"
                        value={item}
                        placeholder="Item"
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="col-sm-8">
                      <button className="btn btn-primary" type="submit">
                        {isEditMode ? "Update Item" : "Add Item"}
                      </button>
                      {isEditMode && (
                        <button
                          className="btn btn-warning ml-2"
                          onClick={() => this.handleToggleEditMode()}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
              <div>
                <ul className="list-group">
                  {listofItems.map((oneObj, index) => (
                    <li
                      key={index}
                      className={`list-group-item list-group-item-info d-flex justify-content-between${oneObj.isDoneFlag ? ' style' : ''}`}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input"
                        
                        defaultChecked={oneObj.isDoneFlag}
                        onClick={() => this.handleToggle(oneObj.id)}
                      />
                      {oneObj.name}
                      {!oneObj.isDoneFlag &&  ( 
                        <div>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => this.handleToggleEditMode(oneObj)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger ml-2"
                            onClick={() => this.handleRemoveItem(oneObj.id)}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="card-footer text-center border">
            All Records are reserved by the authority
          </div>
        </div>
      </div>
    );
  }
}

export default App;

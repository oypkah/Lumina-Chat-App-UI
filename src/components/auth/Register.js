import React from "react";
import { Link } from "react-router-dom";

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      userName: "",
      emailAddress: "",
      password: "",
      passwordType: "password",
      errorMessageStatus: "hidden",
      image: null
    };
  }

  componentDidMount() {
      if (sessionStorage.getItem("LCAToken") !== null) this.props.history.push("/");
  }

  formValid = (value) => {
    let isValid = false;

    Object.values(value).forEach((val) => {
      if (val !== null){
        if (val.length === 0) {
          isValid = true;
        }
      }
    });

    return isValid;
  };

  showAndHidePassword = () => {
    if (this.state.passwordType === "password")
      this.setState({ passwordType: "text" });
    else this.setState({ passwordType: "password" });
  };

  imageSelectedHandler = (e) => {
    this.setState({image: e.target.files[0]});
  }

  clickSubmit = () => {
    let result = this.formValid(this.state);
    if (result) this.setState({ errorMessageStatus: "" });
    else {
      this.setState({ errorMessageStatus: "hidden" });

      // const requestOptions = {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: {ProfilePic : this.state.image},
      // };
      // fetch("http://localhost:52941/uploads", requestOptions)
      //   .then((response) => response.json())
      //   .then((data) => console.log(data.resultMessage));
    }
  };

  render() {
    return (
      <div className="App">
        <div className="wrapper">
          <section className="form signup">
            <header>Lumina Chat App</header>
            <form
              id="myForm"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="error-txt" hidden={this.state.errorMessageStatus}>
                This Form Is Invalid
              </div>
              <div className="name-details">
                <div className="field input">
                  <label>First Name</label>
                  <input
                    type="text"
                    placeholder="First Name"
                    onChange={(e) =>
                      this.setState({ firstName: e.target.value })
                    }
                    value={this.state.firstName}
                    name={this.state.firstName}
                  />
                </div>
                <div className="field input">
                  <label>Last Name</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    onChange={(e) =>
                      this.setState({ lastName: e.target.value })
                    }
                    value={this.state.lastName.toUpperCase()}
                    name={this.state.lastName.toUpperCase()}
                  />
                </div>
              </div>
              <div className="field input">
                <label>User Name</label>
                <input
                  type="text"
                  placeholder="Enter Your Nickname"
                  onChange={(e) => this.setState({ userName: e.target.value })}
                  value={this.state.userName}
                  name={this.state.userName}
                />
              </div>
              <div className="field input">
                <label>E-Mail Address</label>
                <input
                  type="text"
                  placeholder="Enter Your E-Mail"
                  onChange={(e) =>
                    this.setState({ emailAddress: e.target.value })
                  }
                  value={this.state.emailAddress}
                  name={this.state.emailAddress}
                />
              </div>
              <div className="field input">
                <label>Password</label>
                <input
                  type={this.state.passwordType}
                  placeholder="Password"
                  onChange={(e) => this.setState({ password: e.target.value })}
                  value={this.state.password}
                  name={this.state.password}
                />
                <i
                  className="fas fa-eye"
                  onClick={this.showAndHidePassword}
                ></i>
              </div>
              <div className="field image">
                <label>Select Image</label>
                <input type="file" name="file" accept=".jpg,.jpeg,.png"  onChange={this.imageSelectedHandler}/>
              </div>
              <div className="field button">
                <input
                  type="submit"
                  value="Continue To Chat"
                  onClick={this.clickSubmit}
                />
              </div>
            </form>
            <div className="link">
              Already Signed Up? <Link to="/login">Login Now</Link>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default Register;

import React from "react";
import { Link } from "react-router-dom";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      passwordType: "password",
      errorMessage: "This Form Is Invalid",
      errorMessageStatus: "hidden",
    };
  }

  componentDidMount() {
    if (sessionStorage.getItem("LCAToken") !== null)
      this.props.history.push("/");
  }

  formValid = (value) => {
    let isValid = false;
    if (this.state.email.length < 1 && this.state.password.length < 1)
      isValid = true;
    return isValid;
  };

  showAndHidePassword = () => {
    if (this.state.passwordType === "password")
      this.setState({ passwordType: "text" });
    else this.setState({ passwordType: "password" });
  };

  clickSubmit = async () => {
    let result = this.formValid(this.state);
    if (result) this.setState({ errorMessageStatus: "" });
    else {
      // this.setState({ errorMessageStatus: "hidden" });

      const requestOptions = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: this.state.email,
          Password: this.state.password,
        }),
      };
      await fetch("http://localhost:52941/api/account/login", requestOptions)
        .then((resp) => resp.json())
        .then((response) => {
          if (!response.isSuccess) {
            this.setState({
              errorMessage: response.resultMessage,
              errorMessageStatus: "",
            });
          } else {
            sessionStorage.setItem(
              "LCAToken",
              response.resultData.accessToken.accessToken
            );
            sessionStorage.setItem("_id", response.resultData.id);
            this.props.history.push("/");
          }
        })
        .catch((error) => console.log(error));
    }
  }

  render() {
    return (
      <div className="wrapper">
        <section className="form login">
          <header>Lumina Chat App</header>
          <form id="loginForm" onSubmit={(e) => e.preventDefault()}>
            <div className="error-txt" hidden={this.state.errorMessageStatus}>
              {this.state.errorMessage}
            </div>
            <div className="field input">
              <label>E-Mail Address</label>
              <input
                type="text"
                placeholder="Enter Your E-Mail"
                onChange={(e) => this.setState({ email: e.target.value })}
                value={this.state.email}
              />
            </div>
            <div className="field input">
              <label>Password</label>
              <input
                type={this.state.passwordType}
                placeholder="Enter Your Password"
                onChange={(e) => this.setState({ password: e.target.value })}
                value={this.state.password}
              />
              <i className="fas fa-eye" onClick={this.showAndHidePassword}></i>
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
            Not Yet Signed Up? <Link to="/register">Signup Now</Link>
          </div>
        </section>
      </div>
    );
  }
}

export default Login;

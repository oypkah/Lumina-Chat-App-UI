import React from "react";

class HomeHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "...",
      lastName: "...",
      about: "...",
      ppFilePath: "http://localhost:52941/uploads/default.jpg",
      ppId: "",
    };
  }

  async componentDidMount() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("LCAToken")}`,
      },
    };
    await fetch(
      `http://localhost:52941/api/member/${sessionStorage.getItem("_id")}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.isSuccess) {
          this.setState({
            firstName: data.resultData.firstName,
            lastName: data.resultData.lastName,
            about: data.resultData.about,
            ppId: data.resultData.profilePicId,
            ppFilePath: data.resultData.membersProfilePicture.filepath,
          });
        }
      })
      .catch((e) => console.log(e));
  }

  clickLogout = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    console.log(this.props);
    await fetch(
      `http://localhost:52941/api/account/logout/${sessionStorage.getItem(
        "_id"
      )}`,
      requestOptions
    );
    sessionStorage.clear();

    this.props.history.push("/login");
  };

  render() {
    return (
      <header>
        <div className="content">
          <img src={this.state.ppFilePath} alt={this.state.firstName} />
          <div className="details">
            <span>
              {this.state.firstName} {this.state.lastName}
            </span>
            <p>
              {this.state.about <= 15
                ? this.state.about
                : this.state.about.substring(0, 15)}
            </p>
          </div>
        </div>
        <i className="fas fa-bell"><sup>15</sup></i>
        <a className="logout" onClick={this.clickLogout}>
          Logout
        </a>
      </header>
    );
  }
}

export default HomeHeader;

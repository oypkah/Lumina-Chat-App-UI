import React from "react";
import { Link } from "react-router-dom";

class ChatHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      status: "",
      ppFilePath: "",
    };
  }

  async componentDidMount() {
    const hubConnection = this.props.conn;
    /* try {
      await hubConnection.start();
      //hubConnection.connectionId; connectionId chat yaparken işimize yarayacak
      console.log("connection success chatheader");
    } catch (error) {
      console.log(error);
    }*/

    hubConnection.on("getIsMemberTyping", (mstatus) =>
      this.setState({ status: mstatus == 0 ? "Typing..." : "Online" })
    );

    hubConnection.on("getMemberStatus", (memberStatus, memberid) =>
      this.setState({
        status: memberStatus == 0 ? "Online" : "Offline",
      })
    );

    hubConnection.on("GetMemberIdFromConnected", () => {
      hubConnection.invoke(
        "SetMemberConnect",
        parseInt(sessionStorage.getItem("_id"))
      );
    });

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("LCAToken")}`,
      },
    };
    await fetch(
      `http://localhost:52941/api/member/getbyusername/${this.props.ReceivUserName}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.isSuccess) {
          this.setState({
            firstName: data.resultData.firstName,
            lastName: data.resultData.lastName,
            ppFilePath: data.resultData.membersProfilePicture.filepath,
            status: data.resultData.memberStatus == 0 ? "Online" : "Offline",
          });
        }
      })
      .catch((e) => console.log(e));

    this.props.getFilePath(this.state.ppFilePath);
  }
  
  render() {
    return (
      <header>
        <Link to="/" className="back-icon">
          <i className="fas fa-arrow-left"></i>
        </Link>
        <img src={this.state.ppFilePath} alt={this.state.firstName} />
        <div className="details">
          <span>
            {this.state.firstName} {this.state.lastName}
          </span>
          <p>{this.state.status}</p>
        </div>
      </header>
    );
  }
}
export default ChatHeader;

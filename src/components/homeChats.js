import React from "react";
import { Link } from "react-router-dom";
import * as signalR from "@microsoft/signalr";

const hubConnection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:52941/chathub")
  .build();

class HomeChats extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      statusOnline: "fas fa-circle",
      statusOffline: "fas fa-circle offline",
    };
  }

  async componentDidMount() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("LCAToken")}`,
      },
    };

    await fetch(
      `http://localhost:52941/api/chatroom/${sessionStorage.getItem("_id")}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.isSuccess) {
          this.setState({ users: data.resultData });
        }
      });

    try {
      await hubConnection.start();
    } catch (error) {
      console.log(error);
    }
    hubConnection.on(
      "getLastMessage",
      async (reponsemessage, responsereceivememberid) => {
        let us = [...this.state.users];
        let index = us.findIndex((x) => x.memberId == responsereceivememberid);
        us[index] = { ...us[index], message: reponsemessage};
        this.setState({ users: us });
      }
    );

    hubConnection.on("GetMemberIdFromConnected", () => {
      hubConnection.invoke(
        "SetMemberConnect",
        parseInt(sessionStorage.getItem("_id"))
      );
    });

    hubConnection.on("getMemberStatus", (ms, memberid) => {
      //State güncelleme işlemi
      let us = [...this.state.users];
      let index = us.findIndex((x) => x.memberId == memberid);
      us[index] = { ...us[index], memberStatus: ms };
      this.setState({ users: us });
    });

    hubConnection.on("getIsMemberTyping", (mstatus, memberid) => {
      let us = [...this.state.users];
      let index = us.findIndex((x) => x.memberId == memberid);
      us[index] = { ...us[index], isMemberTypingStatus: mstatus };
      this.setState({ users: us });
    });
  }

  componentWillMount() {
    hubConnection.stop();
  }

  render() {
    return (
      <div className="users-list">
        {/* <a href="#">
          <div className="content">
            <img src="/Images/pic2.jpeg" alt="" />
            <div className="details">
              <span>Furkan Aslan</span>
              <p>123456789012345678901234567...(27 karakterden sonra ...)</p>
            </div>
          </div>
          <div className="status-dot">
            <i className="fas fa-circle"></i>
          </div>
        </a> */}
        {this.state.users.map((user) => {
          return (
            <Link
              to={`/chat/${user.userName}/${user.memberId}/${user.id}`}
              key={user.id}
            >
              <div className="content">
                <img src={user.filepath} alt={user.firstName} />
                <div className="details">
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                  <p>
                    {user.isMemberTypingStatus == 0
                      ? "Typing..."
                      : user.messageSenderId == sessionStorage.getItem("_id")
                      ? "You: " + user.message
                      : user.message}
                  </p>
                </div>
              </div>
              <div className="status-dot">
                <i
                  className={
                    user.memberStatus == 0
                      ? this.state.statusOnline
                      : this.state.statusOffline
                  }
                ></i>
              </div>
              {user.unreadMessageCount > 0 && (
                <div className="status-dot">
                  <div align="center" className="unread-messages">
                    {user.unreadMessageCount}
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    );
  }
}

export default HomeChats;

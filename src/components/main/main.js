import { useEffect, useState } from "react";
import WorkSpaceAction from "../../actions/workspaceAction";
import BoardList from "../boardslist/boardslist";
import AuthAction from "../../actions/authAction";
import BoardsAction from "../../actions/boardsAction";
import UserNotificationAction from "../../actions/userNotificationAction";
import notifyImage from "../../resources/notify.png";
import "./main.css";
import NotificationList from "../notificationlist/notificationlist";
import { auth } from "../../firebase-config";
import WorkSpace from "../../models/workspace";
import Menu from "../menu/menu";

export default function Main({ user }) {
  const [workSpaces, setWorkSpaces] = useState([]);
  const [currentWorkSpace, setCurrentWorkSpace] = useState(null);
  const [boards, setBoards] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [openNotificationList, setOpenNotificationList] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    WorkSpaceAction.getWorkSpaces(setWorkSpaces, user.email);
  }, []);

  function selectWorkSpace(e) {
    const eventData = e.target.value.split(";");
    setCurrentWorkSpace(workSpaces.find(workspace=>workspace.id === eventData[0]));
    BoardsAction.getBoards(setBoards, eventData[0]);
    UserNotificationAction.getUserNotification(setNotifications, eventData[0]);
  }
  function notificationListOpen(e) {
    if (e.target.className === "notify-image") {
      setOpenNotificationList(!openNotificationList);
    }
  }

  return (
    <div className="main">
      <div className="header">
        <div className="select__body">
          <select
            className="select"
            defaultValue={0}
            onChange={(e) => {
              selectWorkSpace(e);
            }}
          >
            <option value={0} disabled>
              Выберите рабочую область
            </option>
            {workSpaces
              ? workSpaces.map((workSpace) => {
                  return (
                    <option
                      value={workSpace.id + ";" + workSpace.name}
                      key={workSpace.id}
                    >
                      {workSpace.name}
                    </option>
                  );
                })
              : ""}
          </select>
        </div>
        <div className="header__button">
          {currentWorkSpace ? (
            <div
              className="notify-container"
              onClick={(e) => {
                notificationListOpen(e);
              }}
            >
              <img className="notify-image" alt="notify" src={notifyImage} />
              {notifications.length > 0 ? (
                <div className="notify-count">{notifications.length}</div>
              ) : (
                ""
              )}
              {openNotificationList && notifications.length > 0 ? (
                <NotificationList
                  setOpenNotificationList={setOpenNotificationList}
                  notifications={notifications}
                />
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
          <div
            className="menu-container"
            onClick={() => {
              setOpenMenu(!openMenu);
            }}
          >
            <div className="menu-line"></div>
            <div className="menu-line"></div>
            <div className="menu-line"></div>
          </div>
          {openMenu ? (
            <Menu
              setOpenMenu={setOpenMenu}
              workspace={currentWorkSpace}
              user={user}
              boards={boards}
            />
          ) : (
            ""
          )}
          <input
            className="header-button__logoff"
            type="button"
            value="Выйти"
            onClick={() => AuthAction.logout()}
          />
        </div>
      </div>
      {boards && currentWorkSpace !== null ? (
        <BoardList
          workSpace={currentWorkSpace}
          user={user}
          boards={boards}
          setBoards={setBoards}
        />
      ) : (
        ""
      )}
    </div>
  );
}

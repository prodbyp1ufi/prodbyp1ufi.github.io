import AvatarUtils from "../../utils/avatarUtils";
import "./menu.css";
import cameraImage from "../../resources/camera.png";
import { useState } from "react";
import UsersAction from "../../actions/usersAction";
import FileAction from "../../actions/fileAction";
import WorkSpaceAction from "../../actions/workspaceAction";
import AddUsers from "../addusers/addusers";
import AddTags from "../addtags/addtags";
import { RemoveModal } from "../removeModal/removeModal";
import PrintAction from "../../actions/printAction";

export default function Menu({ setOpenMenu, workspace, user, boards }) {
  const [newPhoto, setNewPhoto] = useState();
  const [newPhotoFile, setNewPhotoFile] = useState();
  const [newDisplayName, setNewDisplayName] = useState(user.displayName);
  const [editDisplayName, setEditDisplayName] = useState(false);
  const [newWorkSpaceName, setNewWorkSpaceName] = useState(
    workspace ? workspace.name : ""
  );
  const [newWorkSpace, setNewWorkSpace] = useState("");
  const [adduser, setAddUser] = useState(false);
  const [openEditTag, setOpenEditTag] = useState(false);
  const [isRemovable, setIsRemovable] = useState(false);
  const [openSelectBoard, setOpenSelectBoard] = useState(false)

  function closeMenu(e) {
    if (e.target.className === "menu-close-container") {
      setOpenMenu(false);
    }
  }
  function selectNewPhoto() {
    const imagePicker = document.getElementById(
      "menu-profil-new-avatar-selector"
    );
    imagePicker?.click();
  }
  function pickNewPhoto(e) {
    const files = e.target.files;
    try {
      setNewPhotoFile(files[0]);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setNewPhoto(fileReader.result);
      };
      fileReader.readAsDataURL(files[0]);
    } catch {}
  }
  function changeDisplayName(e) {
    setNewDisplayName(e.target.value);
    user.displayName = e.target.value;
  }
  async function saveEditProfile() {
    if (newPhotoFile) {
      const resultURL = await FileAction.uploadNewProfileImage(
        newPhotoFile,
        user
      );
      await UsersAction.updateUser(resultURL, newDisplayName, user);
    }
    await UsersAction.updateUser(null, newDisplayName, user);
  }

  async function updateWorkspaceName() {
    await WorkSpaceAction.updateWorkspaceName(workspace.id, newWorkSpaceName);
  }
  async function addNewWorkSpace() {
    await WorkSpaceAction.addWorkspace(newWorkSpace);
    setNewWorkSpace("");
  }
  async function deleteWorkSpace() {
    setOpenMenu(false);
    WorkSpaceAction.removeWorkspace(workspace.id).then(() => {
      window.location.reload();
    });
  }

  async function printCardsInBoard(board){
    await PrintAction.printCardsInBoard(board)
  }

  return (
    <div
      className="menu-close-container"
      onClick={(e) => {
        closeMenu(e);
      }}
    >
      {isRemovable ? <RemoveModal l setIsRemovable={setIsRemovable} removeFunction={deleteWorkSpace} type={"workspace"}/> : ''}
      <div className="menu-content-container">
        <h2 className="menu-profile__title">Профиль</h2>
        <div className="menu-profile-container">
          <div className="menu-profil-avatar-container">
            {newPhoto ? (
              <img className="menu-profil-avatar" src={newPhoto} />
            ) : user.photoURL ? (
              <img className="menu-profil-avatar" src={user.photoURL} />
            ) : (
              <div className="menu-profil-avatar-replacer">
                {AvatarUtils.getAvatarReplacerText(
                  user.displayName,
                  user.email
                )}
              </div>
            )}
            <div className="menu-profil-new-avatar-container">
              <img
                className="menu-profil-new-avatar"
                onClick={() => selectNewPhoto()}
                src={cameraImage}
              />
              <input
                onChange={(e) => pickNewPhoto(e)}
                id="menu-profil-new-avatar-selector"
                type="file"
                accept="image/*"
              />
            </div>
          </div>
          <div className="menu-profile-displayname-container">
            <div
              className="menu-profile-displayname-info"
              onClick={() => {
                setEditDisplayName(true);
              }}
            >
              {editDisplayName ? (
                <textarea
                  maxLength="128"
                  value={newDisplayName}
                  onBlur={() => {
                    setEditDisplayName(false);
                  }}
                  className="menu-profile-displayname-info-add"
                  onChange={(e) => changeDisplayName(e)}
                  autoFocus
                  onFocus={(e) => {
                    e.target.setSelectionRange(0, 512);
                  }}
                />
              ) : (
                user.displayName || "Нажмите чтобы добавить имя пользователя"
              )}
            </div>
            <input
              className="menu-profile-displayname-btn"
              type="button"
              value="Сохранить"
              onClick={() => {
                saveEditProfile();
              }}
            />
          </div>
        </div>
        <div className="menu-workspace-contianer">
          <h2 className="menu-workspace-contianer__title">Рабочая область</h2>
          {workspace ? (
            <div className="menu-this-workspace-container">
              <h2 className="menu-this-workspace-contianer__title">
                Текущая рабочая область:
              </h2>
              <div className="menu-this-workspace-action-container">
                <div className="this-workspace-user-edit-name-container">
                  <input
                    type="text"
                    placeholder="Введите новое название.."
                    value={newWorkSpaceName}
                    onChange={(e) => {
                      setNewWorkSpaceName(e.target.value);
                    }}
                  />
                  <input
                    onClick={() => {
                      updateWorkspaceName();
                    }}
                    className="this-workspace-check-image"
                    type="button"
                    value="сохранить"
                  />
                </div>
                <input
                  className="this-workspace-check-btn"
                  onClick={() => setIsRemovable(true)}
                  value="Удалить"
                  type="button"
                />
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="menu-add-workspace-container">
            <h2 className="menu-add-workspace-container__title">
              Добавить новую
            </h2>
            <div className="menu-add-workspace-container__input">
              <input
                value={newWorkSpace}
                onChange={(e) => {
                  setNewWorkSpace(e.target.value);
                }}
                type="text"
                placeholder="Введите название новой области.."
              />
              <input
                onClick={() => {
                  addNewWorkSpace();
                }}
                className="menu-add-workspace-container__input-btn"
                value="Добавить"
                type="button"
              />
            </div>
          </div>
          {workspace ? (
            <div className="menu-users-container">
              <h2 className="menu-users-container__title">Пользователи</h2>
              <input
                className="menu-users-container__btn"
                type="button"
                onClick={() => setAddUser(true)}
                value="Управление пользователями"
              />
              {adduser ? (
                <AddUsers setAddUser={setAddUser} workspaceId={workspace.id} />
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
          {workspace ? (
            <div className="menu-tags-container">
              Метки
              <input
                className="menu-tags-container__btn"
                type="button"
                onClick={() => setOpenEditTag(!openEditTag)}
                value="Управление метками"
              />
              {openEditTag ? <AddTags workSpaceId={workspace.id} /> : ""}
            </div>
          ) : (
            ""
          )}
          {
            workspace && boards ?
            <div className="menu-print-container">
              <h2 className="menu-print-container__title">Печать</h2>
                {
                  <ul className="print-board-list" onClick={(e)=>{e.target.className === 'print-board-list' ? setOpenSelectBoard(!openSelectBoard) : (e)={} }}>
                    Выберите столбец
                    { openSelectBoard ?
                      boards.map(board=>{
                        return <li onClick={()=>{printCardsInBoard(board)}} key={board.id}>{board.name}</li>
                      })
                      :''
                    }
                  </ul>
                }
            </div>
            : ''
          }
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import TagsAction from "../../actions/tagsAction";
import "./addtags.css";
import checkImage from "../../resources/check.png";
import editImage from "../../resources/edit.png";
import { RemoveModal } from "../removeModal/removeModal";

export default function AddTags({ cardId, workSpaceId }) {
  const [tags, setTags] = useState([]);
  const [editTag, setEditTag] = useState(null);
  const [possition, setPossition] = useState();
  const [isRemovable, setIsRemovable] = useState(false);
  const colors = [
    "#61bd4f",
    "#f2d600",
    "#ff9f1a",
    "#eb5a46",
    "#c377e0",
    "#0079bf",
    "#00c2e0",
    "#51e898",
    "#ff78cb",
    "#344563",
  ];
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("");
  useEffect(() => {
    TagsAction.getTags(setTags, workSpaceId);
  }, []);
  async function addRemoveTagFromCard(tag) {
    if (tag.cardids.includes(cardId)) {
      tag.cardids = tag.cardids.filter((cardid) => cardid !== cardId);
      await TagsAction.updateTagCards(tag);
    } else {
      tag.cardids.push(cardId);
      await TagsAction.updateTagCards(tag);
    }
  }
  function plug() {}
  function closeEditTag(e) {
    if (e.target.className === "modal-edit-tag-close-container") {
      setEditTag(null);
    }
  }
  function startEdit(e, tag) {
    setPossition(e.pageY - 250);
    setNewName(tag.name);
    setNewColor(tag.color);
    setEditTag(tag);
  }
  function addTag(e) {
    setPossition(e.pageY - 247);
    setNewName("");
    setNewColor("");
    setEditTag({ id: undefined });
  }
  async function saveEditTag() {
    if (editTag.id) {
      if (newName !== "") {
        await TagsAction.updateTag(editTag.id, newName, newColor);
        setEditTag(null);
        setNewColor("");
        setNewName("");
      }
    } else {
      if (newName !== "" && newColor !== "") {
        await TagsAction.addTag(newName, newColor, workSpaceId);
        setEditTag(null);
        setNewColor("");
        setNewName("");
      }
    }
  }
  async function removeTag() {
    await TagsAction.removeTag(editTag.id);
    setEditTag(null);
    setNewColor("");
    setNewName("");
  }
  return (
    <div>
      {editTag ? (
        <div
          className="modal-edit-tag-close-container"
          onClick={(e) => closeEditTag(e)}
        >
          {isRemovable ? <RemoveModal l setIsRemovable={setIsRemovable} removeFunction={removeTag} type={"tag"}/> : ''}
          <div
            style={{ top: `${possition}px` }}
            className="modal-edit-tag-content-container"
          >
            Название
            <input
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
              }}
              type="text"
            />
            Цвет
            <div className="tag-color-selector">
              {colors.map((color, index) => {
                return (
                  <div
                    key={index}
                    onClick={(e) => {
                      setNewColor(color);
                    }}
                    className="tag-color"
                    style={{ backgroundColor: color }}
                  >
                    {newColor === color ? "✔" : ""}
                  </div>
                );
              })}
            </div>
            <div className="edit-tag-buttons-container">
              <input
                type="button"
                className="edit-tag-button"
                value="Сохранить"
                onClick={() => saveEditTag()}
              />
              {editTag.id ? (
                <input
                  type="button"
                  className="edit-tag-button"
                  value="Удалить"
                  onClick={() => setIsRemovable(true)}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {tags
        ? tags.map((tag) => {
            return (
              <div
                onClick={() => {
                  cardId ? addRemoveTagFromCard(tag) : plug();
                }}
                key={tag.id}
                className="tag-add"
                style={{
                  backgroundColor: tag.color,
                  width: 150 + "px",
                  fontSize: 16 + "px",
                  color: "#fafafa",
                }}
              >
                {tag.name}
                {cardId ? (
                  tag.cardids.includes(cardId) ? (
                    <img className="tag-check" src={checkImage} />
                  ) : (
                    ""
                  )
                ) : (
                  <img
                    className="tag-check"
                    onClick={(e) => {
                      startEdit(e, tag);
                    }}
                    src={editImage}
                  />
                )}
              </div>
            );
          })
        : ""}
      {cardId ? (
        ""
      ) : (
        <input
          value="Добавить метку"
          className="tag-add__btn"
          onClick={(e) => addTag(e)}
          type="button"
        />
      )}
    </div>
  );
}

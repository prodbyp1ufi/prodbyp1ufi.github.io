import { useState } from "react";
import CardList from "../cardslist/cardslist";
import "./boardslist.css";
import { useEffect } from "react";
import CardsAction from "../../actions/cardsAction";
import BoardsAction from "../../actions/boardsAction";
import basketImage from "../../resources/basket.png";
import CardHistoryAction from "../../actions/cardHistoryAction";
import Board from "../../models/board";
import Card from "../../models/card";

export default function BoardList({ boards, setBoards, user, workSpace }) {
    const [cards, setCards] = useState([]);
    const [currentCardForBoard, setCurrentCardForBoard] = useState(null);
    const [currentBoard, setCurrentBoard] = useState(null);
    const [draggableBoard, setDraggableBoard] = useState(true);
    const [editName, setEditName] = useState(null);
    const [addNewCard, setAddNewCard] = useState(false);
    useEffect(() => {
        CardsAction.getCards(setCards);
    }, []);

    function updateCards(newCards) {
        const cardIds = newCards.map((card) => {
            return card.id;
        });

        setCards(
            cards.map((card) => {
                if (cardIds.includes(card.id)) {
                    return newCards.find((c) => c.id === card.id);
                }
                return card;
            })
        );

        CardsAction.updateCards(cards);
    }

    function dropOnBoard(e, board) {
        e.preventDefault();
        if (currentCardForBoard !== null) {
            let newCards = cards.map((card) => {
                if (card.boardId === board.id) {
                    card.sortIndex += 1;
                    return card;
                }
                if (card.boardId === currentCardForBoard.boardId) {
                    card.sortIndex -= 1;
                    return card;
                }
                return card;
            });
            const fromBoard = boards.find(
                (b) => b.id === currentCardForBoard.boardId
            );
            currentCardForBoard.sortIndex = 1;
            currentCardForBoard.boardId = board.id;
            newCards.push(currentCardForBoard);
            CardsAction.updateCards(newCards);
            if (fromBoard !== board) {
                CardHistoryAction.addHistroy(
                    "move",
                    `${
                        user.displayName || user.email
                    } переместил(-а) карточку из \'${fromBoard.name}\' в \'${
                        board.name
                    }\'`,
                    [],
                    currentCardForBoard,
                    workSpace.id
                );
            }
            setCurrentCardForBoard(null);
        } else {
            const boardSortIndex = board.sortIndex;
            const currentBoardSortIndex = currentBoard.sortIndex;

            currentBoard.sortIndex = boardSortIndex;
            board.sortIndex = currentBoardSortIndex;

            setBoards(
                boards.map((b) => {
                    if (b.id === board.id) {
                        return board;
                    }
                    if (b.id === currentBoard.id) {
                        return currentBoard;
                    }
                    return b;
                })
            );
            BoardsAction.updateAllBoards(boards);
            setCurrentBoard(null);
        }
    }

    function dragStartBoard(e, board) {
        setCurrentBoard(board);
        if (e.target.className === "board" || e.target.className === "card") {
            e.target.style.transform = "rotate(-10deg)";
        }
    }
    function dragEndBoard(e) {
        e.target.style.transform = "none";
    }
    function resizeTextArea(e) {
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
    }

    async function saveEditName(e, boardName) {
        const newBoardName = e.target.value;
        if (editName !== 1) {
            if (boardName === newBoardName) {
                setEditName(null);
                setDraggableBoard(true);
            } else {
                await BoardsAction.updateBoardName(editName, newBoardName);
                setEditName(null);
                setDraggableBoard(true);
            }
        } else {
            if (newBoardName !== "") {
                let board = boards.find((board) => board.id === editName);
                board.name = newBoardName;
                await BoardsAction.addBoard(board);
                setEditName(null);
            } else {
                boards.pop();
                setBoards(boards);
                setEditName(null);
            }
        }
    }

    function addBoard() {
        const sortIndex =
            boards.length > 0 ? boards[boards.length - 1].sortIndex + 1 : 1;
        boards.push(new Board(1, "", sortIndex, workSpace.id));
        setBoards(boards);
        setEditName(1);
    }

    async function addCard(e, boardId) {
        if (e.target.value !== "") {
            const cardsInboard = cards.filter((c) => c.boardId === boardId);
            const sortIndex =
                cardsInboard.length > 0
                    ? cardsInboard[cardsInboard.length - 1].sortIndex + 1
                    : 1;
            const newCard = new Card(
                "",
                e.target.value,
                null,
                sortIndex,
                boardId,
                null,
                null,
                0
            );
            await CardsAction.addCard(newCard, workSpace.id);
            setAddNewCard(false);
        } else {
            setAddNewCard(false);
        }
    }

    return (
        <div className="boards-list-container">
            {boards
                ? boards.map((board) => {
                        return (
                            <div
                                key={board.id}
                                className="board"
                                onDrop={(e) => {
                                    dropOnBoard(e, board);
                                }}
                                onDragStart={(e) => {
                                    dragStartBoard(e, board);
                                }}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                }}
                                onDragEnd={(e) => {
                                    dragEndBoard(e);
                                }}
                                draggable={draggableBoard}
                            >
                                <div className="board-name-container">
                                    <div
                                        className="board-name"
                                        onClick={() => {
                                            setDraggableBoard(false);
                                            setEditName(board.id);
                                        }}
                                        onEnded={(e) => {
                                            console.log(e);
                                        }}
                                    >
                                        {board.id !== editName ? (
                                            board.name
                                        ) : (
                                            <textarea
                                                maxLength={128}
                                                draggable={false}
                                                onBlur={(e) => {
                                                    saveEditName(e, board.name);
                                                }}
                                                className="board-name-edit"
                                                autoFocus
                                                spellCheck={false}
                                                onFocus={(e) => {
                                                    e.target.setSelectionRange(
                                                        0,
                                                        512
                                                    );
                                                }}
                                                defaultValue={board.name}
                                                onChange={(e) => {
                                                    resizeTextArea(e);
                                                }}
                                            />
                                        )}
                                    </div>
                                    {cards.filter((c) => c.boardId === board.id)
                                        .length === 0 ? (
                                        <img
                                            onClick={async () => {
                                                await BoardsAction.deleteBoard(
                                                    board.id
                                                );
                                            }}
                                            src={basketImage}
                                            className="board-remove"
                                        />
                                    ) : (
                                        ""
                                    )}
                                </div>
                                <div className="board-cards-container">
                                    {cards ? (
                                        <CardList
                                            workSpaceId={board.workspaceId}
                                            setDraggableBoard={setDraggableBoard}
                                            setCurrentCardForBoard={
                                                setCurrentCardForBoard
                                            }
                                            updateCards={updateCards}
                                            cards={cards.filter(
                                                (c) => c.boardId === board.id
                                            )}
                                        />
                                    ) : (
                                        ""
                                    )}
                                </div>
                                <div
                                    onClick={() => setAddNewCard(board.id)}
                                    className="add-new-card-container"
                                >
                                    {addNewCard === board.id ? (
                                        <textarea
                                            maxLength={128}
                                            onChange={(e) => {
                                                resizeTextArea(e);
                                            }}
                                            className="add-new-card"
                                            autoFocus
                                            onBlur={(e) => addCard(e, board.id)}
                                        />
                                    ) : (
                                        "Добавить карточку"
                                    )}
                                </div>
                            </div>
                        );
                    })
                : ""}
            <input
                type="button"
                className="boards-list-container__btn"
                onClick={() => addBoard()}
                value="+"
            />
        </div>
    );
}

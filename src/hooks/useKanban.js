import { useState, useEffect } from 'react';

export const useKanban = (userId) => {
  const [boards, setBoards] = useState([]);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = () => {
    const storedBoards = JSON.parse(localStorage.getItem(`kanban_boards_${userId}`) || '[]');
    const storedLists = JSON.parse(localStorage.getItem(`kanban_lists_${userId}`) || '[]');
    const storedCards = JSON.parse(localStorage.getItem(`kanban_cards_${userId}`) || '[]');
    
    setBoards(storedBoards);
    setLists(storedLists);
    setCards(storedCards);
  };

  const saveData = (boards, lists, cards) => {
    localStorage.setItem(`kanban_boards_${userId}`, JSON.stringify(boards));
    localStorage.setItem(`kanban_lists_${userId}`, JSON.stringify(lists));
    localStorage.setItem(`kanban_cards_${userId}`, JSON.stringify(cards));
  };

  const createBoard = (title, description) => {
    const newBoard = {
      id: Date.now().toString(),
      title,
      description,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedBoards = [...boards, newBoard];
    setBoards(updatedBoards);
    saveData(updatedBoards, lists, cards);
    return newBoard;
  };

  const createList = (boardId, title) => {
    const newList = {
      id: Date.now().toString(),
      title,
      boardId,
      order: lists.filter(l => l.boardId === boardId).length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedLists = [...lists, newList];
    setLists(updatedLists);
    saveData(boards, updatedLists, cards);
    return newList;
  };

  const createCard = (listId, title, description) => {
    const newCard = {
      id: Date.now().toString(),
      title,
      description,
      listId,
      order: cards.filter(c => c.listId === listId).length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    saveData(boards, lists, updatedCards);
    return newCard;
  };

  const updateCard = (cardId, updates) => {
    const updatedCards = cards.map(card =>
      card.id === cardId
        ? { ...card, ...updates, updatedAt: new Date().toISOString() }
        : card
    );
    setCards(updatedCards);
    saveData(boards, lists, updatedCards);
  };

  const moveCard = (cardId, newListId, newOrder) => {
    const updatedCards = cards.map(card => {
      if (card.id === cardId) {
        return { ...card, listId: newListId, order: newOrder };
      }
      return card;
    });
    setCards(updatedCards);
    saveData(boards, lists, updatedCards);
  };

  const deleteCard = (cardId) => {
    const updatedCards = cards.filter(card => card.id !== cardId);
    setCards(updatedCards);
    saveData(boards, lists, updatedCards);
  };

  const deleteList = (listId) => {
    const updatedLists = lists.filter(list => list.id !== listId);
    const updatedCards = cards.filter(card => card.listId !== listId);
    setLists(updatedLists);
    setCards(updatedCards);
    saveData(boards, updatedLists, updatedCards);
  };

  const deleteBoard = (boardId) => {
    const updatedBoards = boards.filter(board => board.id !== boardId);
    const updatedLists = lists.filter(list => list.boardId !== boardId);
    const updatedCards = cards.filter(card => 
      !lists.some(list => list.id === card.listId && list.boardId === boardId)
    );
    
    setBoards(updatedBoards);
    setLists(updatedLists);
    setCards(updatedCards);
    saveData(updatedBoards, updatedLists, updatedCards);
  };

  return {
    boards,
    lists,
    cards,
    currentBoard,
    setCurrentBoard,
    createBoard,
    createList,
    createCard,
    updateCard,
    moveCard,
    deleteCard,
    deleteList,
    deleteBoard,
  };
};
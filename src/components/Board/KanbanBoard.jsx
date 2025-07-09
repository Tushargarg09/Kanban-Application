import React, { useState } from 'react';
import { KanbanList } from './KanbanList';
import { CardModal } from './CardModal';
import { Plus, ArrowLeft, Settings } from 'lucide-react';

export const KanbanBoard = ({
  board,
  lists,
  cards,
  onBack,
  onCreateList,
  onCreateCard,
  onUpdateCard,
  onMoveCard,
  onDeleteCard,
  onDeleteList,
}) => {
  const [showCreateList, setShowCreateList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCreateList = (e) => {
    e.preventDefault();
    if (newListTitle.trim()) {
      onCreateList(board.id, newListTitle.trim());
      setNewListTitle('');
      setShowCreateList(false);
    }
  };

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(card));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetListId) => {
    e.preventDefault();
    const cardData = JSON.parse(e.dataTransfer.getData('text/plain'));
    const cardsInTargetList = cards.filter(c => c.listId === targetListId);
    onMoveCard(cardData.id, targetListId, cardsInTargetList.length);
  };

  const boardLists = lists.filter(list => list.boardId === board.id).sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all text-gray-700 dark:text-gray-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Boards
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">{board.title}</h1>
              {board.description && (
                <p className="text-gray-600 dark:text-gray-400 mt-1">{board.description}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-6">
          {boardLists.map((list) => (
            <KanbanList
              key={list.id}
              list={list}
              cards={cards.filter(card => card.listId === list.id).sort((a, b) => a.order - b.order)}
              onCreateCard={onCreateCard}
              onCardClick={setSelectedCard}
              onDeleteList={onDeleteList}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}

          <div className="min-w-80 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
            {showCreateList ? (
              <form onSubmit={handleCreateList} className="p-4">
                <input
                  type="text"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  placeholder="Enter list title"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add List
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateList(false)}
                    className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowCreateList(true)}
                className="w-full h-full p-6 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors min-h-[200px]"
              >
                <Plus className="w-8 h-8 mb-2" />
                <span className="font-medium">Add New List</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onUpdate={onUpdateCard}
          onDelete={onDeleteCard}
        />
      )}
    </div>
  );
};
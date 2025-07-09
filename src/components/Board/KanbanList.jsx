import React, { useState } from 'react';
import { KanbanCard } from './KanbanCard';
import { Plus, MoreHorizontal, Trash2 } from 'lucide-react';

export const KanbanList = ({
  list,
  cards,
  onCreateCard,
  onCardClick,
  onDeleteList,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const handleCreateCard = (e) => {
    e.preventDefault();
    if (newCardTitle.trim()) {
      onCreateCard(list.id, newCardTitle.trim(), newCardDescription.trim() || undefined);
      setNewCardTitle('');
      setNewCardDescription('');
      setShowCreateCard(false);
    }
  };

  return (
    <div className="min-w-80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            {list.title}
            <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full">
              {cards.length}
            </span>
          </h3>
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            {showOptions && (
              <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                <button
                  onClick={() => {
                    onDeleteList(list.id);
                    setShowOptions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete List
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="p-4 space-y-3 min-h-[200px] max-h-[calc(100vh-300px)] overflow-y-auto"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, list.id)}
      >
        {cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            onClick={() => onCardClick(card)}
            onDragStart={(e) => onDragStart(e, card)}
          />
        ))}

        {showCreateCard ? (
          <form onSubmit={handleCreateCard} className="space-y-3">
            <input
              type="text"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Card title"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              autoFocus
            />
            <textarea
              value={newCardDescription}
              onChange={(e) => setNewCardDescription(e.target.value)}
              placeholder="Card description (optional)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                Add Card
              </button>
              <button
                type="button"
                onClick={() => setShowCreateCard(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowCreateCard(true)}
            className="w-full p-3 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-2 justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
          >
            <Plus className="w-4 h-4" />
            Add a card
          </button>
        )}
      </div>
    </div>
  );
};
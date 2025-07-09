import React from 'react';
import { Calendar, Paperclip, User, Clock } from 'lucide-react';

export const KanbanCard = ({ card, onClick, onDragStart }) => {
  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();
  const isDueSoon = card.dueDate && new Date(card.dueDate) < new Date(Date.now() + 24 * 60 * 60 * 1000);

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 cursor-pointer hover:shadow-md transition-all transform hover:scale-105"
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
    >
      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">{card.title}</h4>
      
      {card.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{card.description}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {card.dueDate && (
            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
              isOverdue 
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' 
                : isDueSoon 
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' 
                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
            }`}>
              <Calendar className="w-3 h-3" />
              {new Date(card.dueDate).toLocaleDateString()}
            </div>
          )}
          
          {card.assignedTo && (
            <div className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
              <User className="w-3 h-3" />
              {card.assignedTo}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {card.attachments && card.attachments.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Paperclip className="w-3 h-3" />
              {card.attachments.length}
            </div>
          )}
          
          <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
            <Clock className="w-3 h-3" />
            {new Date(card.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};
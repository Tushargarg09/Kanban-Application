import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useKanban } from './hooks/useKanban';
import { useTheme } from './contexts/ThemeContext';
import { AuthPage } from './components/Auth/AuthPage';
import { Header } from './components/Layout/Header';
import { BoardList } from './components/Board/BoardList';
import { KanbanBoard } from './components/Board/KanbanBoard';

function App() {
  const { user, login, register, logout, loading } = useAuth();
  const { isDark } = useTheme();
  const kanban = useKanban(user?.id || '');
  const [currentView, setCurrentView] = useState('boards');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onLogin={login} onRegister={register} />;
  }

  const handleSelectBoard = (board) => {
    kanban.setCurrentBoard(board);
    setCurrentView('board');
  };

  const handleBackToBoards = () => {
    kanban.setCurrentBoard(null);
    setCurrentView('boards');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <Header user={user} onLogout={logout} />
      
      {currentView === 'boards' ? (
        <BoardList
          boards={kanban.boards}
          onSelectBoard={handleSelectBoard}
          onCreateBoard={kanban.createBoard}
          onDeleteBoard={kanban.deleteBoard}
        />
      ) : kanban.currentBoard ? (
        <KanbanBoard
          board={kanban.currentBoard}
          lists={kanban.lists.filter(list => list.boardId === kanban.currentBoard.id)}
          cards={kanban.cards}
          onBack={handleBackToBoards}
          onCreateList={kanban.createList}
          onCreateCard={kanban.createCard}
          onUpdateCard={kanban.updateCard}
          onMoveCard={kanban.moveCard}
          onDeleteCard={kanban.deleteCard}
          onDeleteList={kanban.deleteList}
        />
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600 dark:text-gray-300">No board selected</p>
        </div>
      )}
    </div>
  );
}

export default App;
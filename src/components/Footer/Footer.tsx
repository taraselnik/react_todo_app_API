import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { removeTodo } from '../../api/todos';
import { Errors } from '../../types/Errors';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[]
  onSetFilterGlobal: React.Dispatch<React.SetStateAction<Filter>>
  selectedFilter: string
  onSetTypeError: React.Dispatch<React.SetStateAction<Errors>>
  toLoad:() => Promise<void>
  onSetisDeleting: React.Dispatch<React.SetStateAction<boolean>>
};

export const Footer: React.FC<Props> = ({
  todos,
  onSetFilterGlobal,
  selectedFilter,
  onSetTypeError,
  toLoad,
  onSetisDeleting,
}) => {
  const [amountActiveTodos, setAmountActiveTodos] = useState(0);
  const [compTodos, setCompTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const activeTodos = todos.filter(
      todo => todo.completed === false,
    ).length;
    const completedTodos = todos.filter(todo => todo.completed);

    setCompTodos(completedTodos);
    setAmountActiveTodos(activeTodos);
  }, [todos]);

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    filter: Filter,
  ) => {
    e.preventDefault();
    onSetFilterGlobal(filter);
  };

  const clearCompletedTodos = () => {
    compTodos.forEach(async (todo) => {
      try {
        onSetisDeleting(true);
        await removeTodo(todo.id);
      } catch (inError) {
        onSetTypeError(Errors.ErrDEL);
      }

      onSetisDeleting(false);
      onSetFilterGlobal(Filter.ALL);
      toLoad();
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${amountActiveTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          title={Filter.ALL}
          className={classNames(
            'filter__link',
            { selected: selectedFilter === Filter.ALL },
          )}
          onClick={event => handleAnchorClick(event, Filter.ALL)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          title={Filter.ACTIVE}
          className={classNames(
            'filter__link',
            { selected: selectedFilter === Filter.ACTIVE },
          )}
          onClick={event => handleAnchorClick(event, Filter.ACTIVE)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          title={Filter.COMPLETED}
          className={classNames(
            'filter__link',
            { selected: selectedFilter === Filter.COMPLETED },
          )}
          onClick={event => handleAnchorClick(event, Filter.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          {
            todoapp__hidden: !compTodos.length,
          },
        )}
        onClick={clearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};

import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

const fetchTodos = async () => {
  const res = await fetch('http://localhost:3001/todos');

  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.message);
  }

  return res.json();
};

// const fetchTodos = async () => {
//   const res = await axios.get('http://localhost:3001/todos');

//   return res.data;
// };

const Todo = () => {
  const [name, setName] = useState('');

  const queryClient = useQueryClient();

  const addTodo = async () => {
    const res = await fetch('http://localhost:3001/todos/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
      }),
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    return res.json();
  };

  const deleteTodo = async (id) => {
    const res = await fetch(`http://localhost:3001/todos/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return res.json();
  };

  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    // onMutate: (variables) => {
    //   console.log('onMutate');
    //   return variables;
    // },
    // onSuccess: (data, variables, context) => {
    //   console.log('data', data);
    //   console.log('variables', variables);
    //   console.log('context', context);
    //   console.log('onSuccess');
    // },
    // onError: () => {
    //   console.log('onError');
    // },
    // onSettled: () => {
    //   console.log('onSettled');
    // },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addMutation.mutate({ id: 1 });
  };

  const handleRemoveTodo = (id) => {
    deleteMutation.mutate(id);
  };

  const {
    data: todos,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;

    // return <span>Error: {error.response.data.message}</span>;
  }

  return (
    <>
      <h1>Todo一覧</h1>
      <div>
        <form onSubmit={handleSubmit}>
          Add Todo :
          <input
            placeholder="Add New Todo"
            value={name}
            onChange={handleChange}
          />
          <button>追加</button>
        </form>
      </div>
      <ul>
        {todos?.map((todo) => (
          <li key={todo.id}>
            {todo.name}
            <button
              style={{ marginLeft: '0.2em', cursor: 'pointer' }}
              onClick={() => handleRemoveTodo(todo.id)}
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Todo;

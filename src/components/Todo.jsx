import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// const fetchTodos = async () => {
//   const res = await fetch('http://localhost:3001/todos');

//   if (!res.ok) {
//     const json = await res.json();
//     throw new Error(json.message);
//   }

//   return res.json();
// };

const fetchTodos = async () => {
  const res = await axios.get('http://localhost:3001/todos');

  return res.data;
};

const Todo = () => {
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
    // return <span>Error: {error.message}</span>;

    return <span>Error: {error.response.data.message}</span>;
  }

  return (
    <>
      <h1>Todo一覧</h1>
      <ul>
        {todos?.map((todo) => (
          <li key={todo.id}>{todo.name}</li>
        ))}
      </ul>
    </>
  );
};

export default Todo;

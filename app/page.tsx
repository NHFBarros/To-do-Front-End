'use client'

import { useEffect, useState } from 'react';

type Todo = {
  _id: string;
  name: string;
  description: string;
  completed: boolean;
};

type EditFormState = {
  name: string;
  description: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null); // manter referência do todo sendo editado
  const [editForm, setEditForm] = useState<EditFormState>({ name: '', description: '', completed: false }); // agora inclui o campo completed

  async function getData() {
    const url = "http://localhost:3005/todo/all";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const result = await response.json();
      console.log(result);
      setTodos(result);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(String(error));
      }
      return null;
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Defensive check for currentTarget being a valid HTMLFormElement
    const form = event.currentTarget as HTMLFormElement | null;

    const formData = form ? new FormData(form) : new FormData();
    const name = formData.get('name')?.toString().trim() || "";
    const description = formData.get('description')?.toString().trim() || "";

    if (!name) {
      alert("Nome é obrigatório.");
      return;
    }
    const newTodo = { name, description, completed: false };

    try {
      const response = await fetch("http://localhost:3005/todo/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        throw new Error(`Erro ao adicionar tarefa: ${response.status}`);
      }

      await getData();
      if (form && typeof form.reset === 'function') {
        form.reset();
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(String(error));
      }
    }
  }

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`http://localhost:3005/todo/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Erro ao deletar tarefa: ${response.status}`);
      }

      await getData();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(String(error));
      }
    }
  }

  async function handleToggleCompleted(id: string, completed: boolean) {
    try {
      const response = await fetch(`http://localhost:3005/todo/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Erro ao alternar o estado da tarefa: 404");
        } else {
          throw new Error(`Erro ao alternar o estado da tarefa: ${response.status}`);
        }
      }

      await getData();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(String(error));
      }
    }
  }

  // NOVO: Submit do edital
  async function handleEditSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingTodo) return;

    // Só enviar se algo foi editado
    const updatedName = editForm.name.trim();
    const updatedDescription = editForm.description.trim();
    const updatedCompleted = editForm.completed;

    if (!updatedName) {
      alert("Nome é obrigatório.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3005/todo/update/${editingTodo._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: updatedName,
          description: updatedDescription,
          completed: updatedCompleted,
        }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Tarefa não encontrada para edição");
        } else {
          throw new Error(`Erro ao editar tarefa: ${response.status}`);
        }
      }

      await getData();
      setEditingTodo(null);
      setEditForm({ name: '', description: '', completed: false });
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(String(error));
      }
    }
  }

  function openEditForm(todo: Todo) {
    setEditingTodo(todo);
    setEditForm({
      name: todo.name,
      description: todo.description ?? '',
      completed: todo.completed ?? false,
    });
  }

  function closeEditForm() {
    setEditingTodo(null);
    setEditForm({ name: '', description: '', completed: false });
  }

  // Função para manipulação dos campos controlados na edição
  function handleEditInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setEditForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (type === "select-one" && name === "completed") {
      setEditForm(prev => ({ ...prev, completed: value === "true" }));
    } else {
      setEditForm(prev => ({ ...prev, [name]: value }));
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {/* Adicionar */}
      <div style={{
        position: "fixed",
        top: 20,
        left: 20,
        height: "50vh",
        width: "100%",
        maxWidth: "380px",
        background: "#f8fafc",
        borderRight: "1px solid #e5e7eb",
        borderRadius: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "2.5rem 1.5rem",
        zIndex: 10,
      }}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full"
          style={{ maxWidth: "300px" }}
        >
          <h2 className="text-2xl font-bold mb-2 text-black">Adicionar Tarefa</h2>
          <input
            name="name"
            placeholder="Nome"
            className="rounded border px-3 py-2"
            style={{ background: "#fff", color: "#111" }}
            autoComplete="off"
            required
          />
          <input
            name="description"
            placeholder="Descrição"
            className="rounded border px-3 py-2"
            style={{ background: "#fff", color: "#111" }}
            autoComplete="off"
          />
          <button
            type="submit"
            className="font-semibold rounded px-4 py-2"
            style={{
              background: "#2563eb",
              color: "#fff"
            }}
          >
            Adicionar
          </button>
        </form>
      </div>

      {/* Editar */}
      {editingTodo && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            height: "55vh",
            width: "100%",
            maxWidth: "380px",
            background: "#f8fafc",
            borderLeft: "1px solid #e5e7eb",
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: "1rem 1rem",
            zIndex: 20,
            boxShadow: "0 6px 32px 0 rgba(0,0,0,0.10)"
          }}>
          <button
            aria-label="Fechar edição"
            onClick={closeEditForm}
            style={{
              position: "absolute",
              top: 12,
              right: 18,
              background: "transparent",
              border: "none",
              fontSize: "1.6rem",
              cursor: "pointer",
              color: "#223",
              zIndex: 100,
              padding: 0,
              lineHeight: 1,
            }}
            title="Fechar"
            type="button"
          >
            ×
          </button>
          <form
            onSubmit={handleEditSubmit}
            className="flex flex-col gap-4 w-full"
            style={{ maxWidth: "300px", marginTop: "1.5rem" }}
          >
            <h2 className="text-2xl font-bold mb-2 text-black">Editar Tarefa</h2>
            <input
              name="name"
              placeholder="Nome"
              className="rounded border px-3 py-2"
              style={{ background: "#fff", color: "#111" }}
              autoComplete="off"
              required
              value={editForm.name}
              onChange={handleEditInputChange}
            />
            <input
              name="description"
              placeholder="Descrição"
              className="rounded border px-3 py-2"
              style={{ background: "#fff", color: "#111" }}
              autoComplete="off"
              value={editForm.description}
              onChange={handleEditInputChange}
            />
            <label style={{ color: "#111", fontWeight: 500 }}>
              Status:
              <select
                name="completed"
                className="rounded border px-3 py-2 ml-2"
                style={{ background: "#fff", color: "#111" }}
                value={editForm.completed ? "true" : "false"}
                onChange={handleEditInputChange}
              >
                <option value="false">Pendente</option>
                <option value="true">Concluída</option>
              </select>
            </label>
            <button
              type="submit"
              className="font-semibold rounded px-4 py-2"
              style={{
                background: "#2563eb",
                color: "#fff"
              }}
            >
              Salvar
            </button>
          </form>
        </div>
      )}

      <div style={{ marginLeft: "380px" }}></div>
      <ul>
        {todos.map((todo: any) => (
          <li
            key={todo._id}
            className="m-4 border border-gray-400 rounded-md p-4"
            style={{ background: "#0a0a0a", maxWidth: "400px", margin: "1rem auto" }}
          >
            <div className="flex flex-row justify-between items-start w-full">
              <div className="flex flex-col items-start">
                <span className="font-semibold">{todo.name}</span>
                <span className="text-gray-600">{todo.description}</span>
              </div>
              <div className="flex flex-col items-end h-full ml-4">
                <span
                  className={`bg-gray-200 px-3 py-1 rounded flex items-center justify-center cursor-pointer select-none`}
                  style={{
                    minWidth: "65px",
                    minHeight: "32px",
                    display: "inline-flex",
                    backgroundColor:
                      typeof todo.completed === 'boolean'
                        ? todo.completed
                          ? '#14532d'
                          : '#7f1d1d'
                        : undefined,
                    color: typeof todo.completed === 'boolean' ? "#fff" : undefined,
                    userSelect: "none",
                  }}
                  title="Clique para mudar o status"
                  onClick={() => {
                    if (typeof todo.completed === "boolean") {
                      handleToggleCompleted(todo._id, !todo.completed);
                    }
                  }}
                >
                  {typeof todo.completed === 'boolean'
                    ? todo.completed
                      ? 'Concluído'
                      : 'Pendente'
                    : todo.completed}
                </span>
                <div className="flex flex-row gap-2 mt-2">
                  <button
                    className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                    title="Editar"
                    onClick={() => openEditForm(todo)}
                    type="button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182l-12.073 12.073a4.5 4.5 0 0 1-1.897 1.126l-2.03.579a.75.75 0 0 1-.927-.928l.58-2.03a4.5 4.5 0 0 1 1.126-1.897l12.073-12.073z" />
                    </svg>
                  </button>
                  <button
                    className="flex items-center justify-center bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    title="Remover"
                    onClick={() => handleDelete(todo._id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

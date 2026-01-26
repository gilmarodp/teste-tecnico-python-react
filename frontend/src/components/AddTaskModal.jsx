import { useState } from "react";
import { X } from "lucide-react";

function AddTaskModal({ isOpen, onClose, onAddTask, columnId }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask(columnId, {
        title: title.trim(),
        description: description.trim(),
      });
      setTitle("");
      setDescription("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg shadow-xl w-96 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Adicionar Tarefa</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da tarefa..."
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite a descrição da tarefa..."
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-colors cursor-pointer"
            >
              Adicionar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-medium py-2 rounded-md transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;

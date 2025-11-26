"use client";

import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function SettingsMenu({ onClose }: { onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  async function handleSubimit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;

    const formData = new FormData();
    formData.append("name", form.blogName.value);
    formData.append("type", form.blogType.value);
    formData.append("description", form.blogDescription.value);

    // pega arquivo se existir
    const file = form.blogImage.files[0];
    if (file) {
      formData.append("file", file);
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você não está logado!");
      return;
    }

    const res = await fetch("/api/createBlog", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // ❌ NÃO ENVIE Content-Type aqui, o browser define automaticamente
      },
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json();
      alert("Erro: " + error.message);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);
  }


  if (isLoading) {
    return (
      <LoadingSpinner />
    )
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
        <div className="w-[90%] max-w-md rounded-xl bg-neutral-800 border border-neutral-700 shadow-xl p-6 text-center space-y-4">
          
          <h2 className="text-xl font-semibold text-green-400">
            Blog criado com sucesso! 🎉
          </h2>

          <p className="text-neutral-300">
            Seu novo blog foi criado e já está disponível no painel.
          </p>

          <button
            onClick={() => {
              onClose();
              window.location.reload();
            }}

            className="mt-2 px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-[90%] max-w-md rounded-xl bg-neutral-800 border border-neutral-700 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-center bg-neutral-700 px-4 h-12 rounded-t-xl">
          <h2 className="text-lg font-semibold text-white">
            Menu de Criação de Blog
          </h2>
        </div>

        {/* Conteúdo */}
        <form onSubmit={handleSubimit}>
          <div className="p-4 space-y-5">

            {/* Nome */}
            <div className="space-y-1">
              <label className="text-neutral-300 text-sm font-medium">
                Nome do blog
              </label>
              <input
                type="text"
                name="blogName"
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-600 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-300"
                placeholder="Digite o nome do seu blog..."
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-300 text-sm font-medium">
                Descrição
              </label>

              <textarea
                name="blogDescription"
                className="
                  w-full
                  px-3
                  py-2
                  h-20
                  bg-neutral-900
                  border border-neutral-600
                  rounded-md
                  text-white
                  placeholder-neutral-400
                  focus:outline-none
                  focus:border-neutral-300
                  resize-none
                  custom-scroll
                "
                placeholder="Digite a descrição do seu blog..."
                required
              />
            </div>


            <div className="space-y-1">
              <label className="text-neutral-300 text-sm font-medium">
                Imagem do blog
              </label>

              <input
                type="file"
                name="blogImage"
                accept="image/*"
                required
                onChange={handleImageChange}
                className="w-full cursor-pointer px-3 py-2 bg-neutral-900 border border-neutral-600 rounded-md text-white"
              />
              <div className="flex w-full my-2">
                {preview && (
                  <div className="flex justify-center">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-md border border-neutral-700"
                    />
                  </div>
                )}
              </div>
            </div>


            {/* Tipo */}
            <div className="flex flex-col space-y-2 text-white">
              <p className="text-sm font-medium">Tipo do blog</p>

              <label className="flex items-center cursor-pointer space-x-2">
                <input
                  type="radio"
                  name="blogType"
                  value="publico"
                  className="accent-neutral-300"
                  required
                />
                <span>Público</span>
              </label>

              <label className="flex items-center cursor-pointer space-x-2">
                <input
                  type="radio"
                  name="blogType"
                  value="privado"
                  className="accent-neutral-300"
                />
                <span>Privado</span>
              </label>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer w-30 py-2 rounded-md border border-neutral-600 text-neutral-300 hover:bg-neutral-700 transition"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="cursor-pointer w-30 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-500 transition"
              >
                Salvar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

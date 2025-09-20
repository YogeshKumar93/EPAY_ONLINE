import React, { useState } from "react";
import { createNews } from "./api";

const DeleteNews = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { title, content };
      await createNews(data);
      alert("News created successfully!");
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Error creating news:", err);
    }
  };

  return (
    <div>
      <h2>Create News</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Enter content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <br />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default DeleteNews;

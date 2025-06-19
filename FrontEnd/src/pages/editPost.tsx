import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

function EditPost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [markdown, setMarkdown] = useState('');

  const handleSubmit = () => {
    const post = { title, description, content: markdown };
    console.log('Post created:', post);
    alert('Post saved (ver console)');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Create New Post</h1>
        <div className="grid grid-cols-2 gap-4 h-[85vh]">
          <div className="flex flex-col space-y-4 h-full">
            <input type="text" placeholder="Post title" value={title} onChange={e => setTitle(e.target.value)} className="p-3 border border-gray-300 rounded-lg text-xl font-semibold" />
            <textarea placeholder="Short description..." value={description} onChange={e => setDescription(e.target.value)} className="p-3 border border-gray-300 rounded-lg h-24 resize-none" />
            <textarea value={markdown} onChange={e => setMarkdown(e.target.value)} placeholder="Write your post content in Markdown..." className="flex-grow p-3 border border-gray-300 rounded-lg font-mono resize-none" spellCheck={false} />
            <div className="flex justify-end">
              <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Save Post</button>
            </div>
          </div>
          <div className="flex flex-col h-full bg-white border border-gray-300 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Live Preview</h2>
            </div>
            <div className="p-6 overflow-y-auto flex-grow prose max-w-none">
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;

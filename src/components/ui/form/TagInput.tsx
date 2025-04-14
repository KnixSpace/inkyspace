// components/ui/form/TagInput.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export interface Tag {
  id: string;
  name: string;
}

interface TagInputProps {
  onChange: (tags: Tag[]) => void;
  error?: string;
  initialTags?: Tag[];
}

const TagInput = ({ onChange, error, initialTags = [] }: TagInputProps) => {
  const [tagInput, setTagInput] = useState("");
  const [tagError, setTagError] = useState("");
  const [tags, setTags] = useState<Tag[]>(initialTags);

  useEffect(() => {
    if (initialTags.length > 0 && tags.length === 0) {
      setTags(initialTags);
    }
  }, [initialTags]);

  const validateTag = (tag: string) => {
    if (!tag.trim()) {
      setTagError("Tag cannot be empty");
      return false;
    }

    // Check if the tag already exists in tags
    const tagExists = tags.some(
      (t) => t.name.toLowerCase() === tag.toLowerCase()
    );

    if (tagExists) {
      setTagError("This tag has already been added");
      return false;
    }

    return true;
  };

  const handleAddTag = () => {
    if (tags.length >= 5) {
      setTagError("You can only add up to 5 tags");
      return;
    }

    if (!validateTag(tagInput)) {
      return;
    }

    const newTag: Tag = {
      id: uuidv4(),
      name: tagInput.trim(),
    };

    const updatedTags = [...tags, newTag];
    setTags(updatedTags);
    setTagInput("");
    setTagError("");

    onChange(updatedTags);
  };

  const handleRemoveTag = (tagId: string) => {
    const updatedTags = tags.filter((tag) => tag.id !== tagId);
    setTags(updatedTags);
    onChange(updatedTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }

    if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      handleRemoveTag(tags[tags.length - 1]?.id || "");
    }

    if (e.key === "Escape") {
      setTagInput("");
      setTagError("");
    }
  };

  return (
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-2">
        Tags * (Add up to 5 tags)
      </label>
      <div className="flex mb-2">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter tag"
          className={`flex-1 px-4 py-2 border-2 border-dashed rounded-md ${
            tagError ? "border-rose-500" : "border-gray-300"
          }`}
          disabled={tags.length >= 5}
        />
        <button
          type="button"
          onClick={handleAddTag}
          disabled={tags.length >= 5}
          className="ml-2 p-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
        </button>
      </div>

      {tagError && <p className="text-rose-500 text-sm mb-2">{tagError}</p>}

      {tags.length > 0 ? (
        <div className="mt-3 mb-2">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center px-3 py-2 bg-purple-50 text-purple-600 border-2 border-dashed border-purple-500 rounded-md"
              >
                <span className="font-medium mr-2">{tag.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag.id)}
                  className="text-purple-400 hover:text-rose-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-sm italic mt-2">No tags added yet</p>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default TagInput;

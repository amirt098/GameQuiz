import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getCategories, addCategory, updateCategory, deleteCategory } from "../services/api";
import "../css/ManageCategories.css";

const ManageCategories = () => {
    const { darkMode } = useTheme();
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);
    const [editValue, setEditValue] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const fetchedCategories = await getCategories();
            setCategories(fetchedCategories);
            setError("");
        } catch (err) {
            setError("Failed to load categories");
            console.error("Error fetching categories:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        try {
            setError("");
            const response = await addCategory(newCategory);
            if (response.success) {
                setCategories(response.categories);
                setNewCategory("");
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError("An error occurred while adding the category");
            console.error("Error adding category:", err);
        }
    };

    const startEditing = (category) => {
        setEditingCategory(category);
        setEditValue(category);
    };

    const cancelEditing = () => {
        setEditingCategory(null);
        setEditValue("");
    };

    const handleEdit = async (oldCategory) => {
        if (!editValue.trim() || editValue === oldCategory) {
            cancelEditing();
            return;
        }

        try {
            setError("");
            const response = await updateCategory(oldCategory, editValue);
            if (response.success) {
                setCategories(response.categories);
                cancelEditing();
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError("Failed to update category");
            console.error("Error updating category:", err);
        }
    };

    const handleDelete = async (categoryToDelete) => {
        if (!window.confirm("Are you sure you want to delete this category?")) {
            return;
        }

        try {
            setError("");
            const response = await deleteCategory(categoryToDelete);
            if (response.success) {
                setCategories(response.categories);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError("Failed to delete category");
            console.error("Error deleting category:", err);
        }
    };

    const filteredCategories = categories.filter(category =>
        category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className={`manage-categories-page ${darkMode ? 'dark' : 'light'}`}>
                <div className="loading">Loading categories...</div>
            </div>
        );
    }

    return (
        <div className={`manage-categories-page ${darkMode ? 'dark' : 'light'}`}>
            <div className="page-header">
                <h1>Manage Categories</h1>
                <p>Total categories: {categories.length}</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="category-controls">
                <form onSubmit={handleAddCategory} className="add-category-form">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Enter new category name"
                        className="category-input"
                    />
                    <button type="submit" className="add-button">
                        Add Category
                    </button>
                </form>

                <div className="search-bar">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search categories..."
                        className="search-input"
                    />
                </div>
            </div>

            <div className="categories-list">
                {filteredCategories.length === 0 ? (
                    <div className="no-results">
                        {searchTerm ? "No categories found matching your search" : "No categories added yet"}
                    </div>
                ) : (
                    filteredCategories.map((category) => (
                        <div key={category} className="category-item">
                            {editingCategory === category ? (
                                <div className="category-edit">
                                    <input
                                        type="text"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="edit-input"
                                        autoFocus
                                    />
                                    <div className="edit-actions">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="save-button"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={cancelEditing}
                                            className="cancel-button"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="category-content">
                                    <span className="category-name">{category}</span>
                                    <div className="category-actions">
                                        <button
                                            onClick={() => startEditing(category)}
                                            className="edit-button"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category)}
                                            className="delete-button"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageCategories;

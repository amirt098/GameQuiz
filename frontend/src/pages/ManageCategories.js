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
    const [successMessage, setSuccessMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [actionInProgress, setActionInProgress] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const showMessage = (message, isError = false) => {
        if (isError) {
            setError(message);
            setSuccessMessage("");
        } else {
            setSuccessMessage(message);
            setError("");
        }
        setTimeout(() => {
            setError("");
            setSuccessMessage("");
        }, 3000);
    };

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await getCategories();
            
            if (response?.status === 200 && response.data) {
                setCategories(response.data.categories || []);
            } else {
                throw new Error(response?.error || "Failed to load categories");
            }
        } catch (err) {
            console.error("Error fetching categories:", err);
            showMessage("Failed to load categories. Please try again.", true);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.trim() || actionInProgress) return;

        try {
            setActionInProgress(true);
            const response = await addCategory(newCategory.trim());
            
            if (response?.status === 200) {
                await fetchCategories();
                setNewCategory("");
                showMessage("Category added successfully!");
            } else {
                throw new Error(response?.error || "Failed to add category");
            }
        } catch (err) {
            console.error("Error adding category:", err);
            showMessage(err.message || "Failed to add category. Please try again.", true);
        } finally {
            setActionInProgress(false);
        }
    };

    const handleEdit = async (oldCategory) => {
        if (!editValue.trim() || editValue === oldCategory?.name || actionInProgress) {
            cancelEditing();
            return;
        }

        try {
            setActionInProgress(true);
            const response = await updateCategory(oldCategory.name, editValue.trim());
            
            if (response?.status === 200) {
                await fetchCategories();
                cancelEditing();
                showMessage("Category updated successfully!");
            } else {
                throw new Error(response?.error || "Failed to update category");
            }
        } catch (err) {
            console.error("Error updating category:", err);
            showMessage(err.message || "Failed to update category. Please try again.", true);
        } finally {
            setActionInProgress(false);
        }
    };

    const handleDelete = async (category) => {
        if (!category?.name || actionInProgress || 
            !window.confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
            return;
        }

        try {
            setActionInProgress(true);
            const response = await deleteCategory(category.name);
            
            if (response?.status === 200) {
                await fetchCategories();
                showMessage("Category deleted successfully!");
            } else {
                throw new Error(response?.error || "Failed to delete category");
            }
        } catch (err) {
            console.error("Error deleting category:", err);
            showMessage(err.message || "Failed to delete category. Please try again.", true);
        } finally {
            setActionInProgress(false);
        }
    };

    const startEditing = (category) => {
        if (!category?.name || actionInProgress) return;
        setEditingCategory(category);
        setEditValue(category.name);
    };

    const cancelEditing = () => {
        setEditingCategory(null);
        setEditValue("");
    };

    const filteredCategories = categories.filter(category =>
        category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
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

            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => setError("")} className="close-error">×</button>
                </div>
            )}

            {successMessage && (
                <div className="success-message">
                    <p>{successMessage}</p>
                    <button onClick={() => setSuccessMessage("")} className="close-success">×</button>
                </div>
            )}

            <div className="category-controls">
                <form onSubmit={handleAddCategory} className="add-category-form">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Enter new category name"
                        className="category-input"
                        disabled={actionInProgress}
                    />
                    <button 
                        type="submit" 
                        className={`add-button ${actionInProgress ? 'disabled' : ''}`}
                        disabled={actionInProgress || !newCategory.trim()}
                    >
                        {actionInProgress ? 'Adding...' : 'Add Category'}
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
                        {searchTerm ? "No categories found matching your search" : "No categories available"}
                    </div>
                ) : (
                    filteredCategories.map((category) => (
                        <div key={category?.id || Math.random()} className="category-item">
                            {editingCategory === category ? (
                                <div className="category-edit">
                                    <input
                                        type="text"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="edit-input"
                                        disabled={actionInProgress}
                                        autoFocus
                                    />
                                    <div className="edit-actions">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className={`save-button ${actionInProgress ? 'disabled' : ''}`}
                                            disabled={actionInProgress || !editValue.trim()}
                                        >
                                            {actionInProgress ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            onClick={cancelEditing}
                                            className="cancel-button"
                                            disabled={actionInProgress}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="category-content">
                                    <span className="category-name">{category?.name}</span>
                                    <div className="category-actions">
                                        <button
                                            onClick={() => startEditing(category)}
                                            className={`edit-button ${actionInProgress ? 'disabled' : ''}`}
                                            disabled={actionInProgress}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category)}
                                            className={`delete-button ${actionInProgress ? 'disabled' : ''}`}
                                            disabled={actionInProgress}
                                        >
                                            {actionInProgress ? 'Deleting...' : 'Delete'}
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

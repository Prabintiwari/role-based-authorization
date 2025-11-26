import { useState, useEffect } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addToCart,
} from "../services/api";
import Loader from "../components/Loader";
import { Pencil, Plus, RefreshCcw, ShoppingCart, Trash2, XIcon } from "lucide-react";

function Products({ user, updateCartCount }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
  });
  const [error, setError] = useState("");

  const canManageProducts = user.role === "ADMIN" || user.role === "STAFF";

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getProducts();
      const data = response?.data ?? response;
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await createProduct(formData);
      }

      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        quantity: "",
      });
      setShowForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.error || "Operation failed");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description || "",
      category: product.category || "",
      price: product.price.toString(),
      quantity: product.quantity.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch {
        setError("Failed to delete product");
      }
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({
      title: "",
      description: "",
      category: "",
      price: "",
      quantity: "",
    });
    setError("");
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId);
      updateCartCount();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add to cart");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 px-5 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Products Collection
            </h1>
            <p className="text-gray-600">Manage your inventory with ease</p>
          </div>

          {canManageProducts && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus size={16}/> Add Product
            </button>
          )}
        </div>

        {!canManageProducts && (
          <div className="bg-linear-to-r from-blue-100 to-cyan-100 border-l-4 border-blue-500 text-blue-800 p-5 rounded-lg mb-6 shadow-md">
            <p className="font-semibold">
              You can view products but cannot add or modify them.
            </p>
          </div>
        )}

        {/* Errors */}
        {error && (
          <div className="bg-linear-to-r from-red-100 to-rose-100 border-l-4 border-red-500 text-red-700 p-5 rounded-lg mb-6 shadow-md">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && canManageProducts && (
          <div className="bg-white/90  backdrop-blur-sm p-8 rounded-2xl shadow-2xl mb-10 border-2 border-purple-100">
            <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-purple-200">
              {editingProduct ? (<><Pencil className="text-purple-500 font-bold" size={20}/>Edit Product</>)  : (<><Plus className="text-green-500 tfont-bold" size={20}/> Add New Product</>)}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-semibold mb-2 text-gray-700 text-sm uppercase tracking-wide">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-white"
                  placeholder="Enter product title"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700 text-sm uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none bg-white"
                  placeholder="Describe your product..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700 text-sm uppercase tracking-wide">
                    Category *
                  </label>
                  <input
                    type="text"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-white"
                    placeholder="e.g., Electronics"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-gray-700 text-sm uppercase tracking-wide">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-white"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700 text-sm uppercase tracking-wide">
                    Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-white"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="px-8 py-3 flex items-center gap-2 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  {editingProduct ? (<><RefreshCcw size={16}/> Update</>) : (<><Plus size={16}/> Create</>)}
                </button>

                <button
                  type="button"
                  onClick={cancelForm}
                  className="px-8 py-3 flex items-center gap-2 bg-linear-to-r from-gray-400 to-gray-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <XIcon className="text-red-500 font-semibold" size={16}/> Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-200">
                    {p.title}
                  </h3>
                </div>

                {p.description && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {p.description}
                  </p>
                )}

                {p.category && (
                  <div className="mb-4">
                    <span className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full bg-linear-to-br from-purple-400 to-pink-400 text-white shadow-md">
                      {p.category}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center mb-5 pt-4 border-t-2 border-gray-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-gray-500 font-medium">
                      Rs.
                    </span>
                    <span className="text-2xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {p.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-linear-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-lg">
                    <span className="text-xs font-medium text-gray-600">
                      Qty:
                    </span>
                    <span className="font-bold text-gray-800">
                      {p.quantity}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleAddToCart(p.id)}
                    className="w-full px-4 py-2.5 flex items-center justify-center gap-2 bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <ShoppingCart size={16}/> Add to Cart
                  </button>

                  {/* Admin/Staff buttons */}
                  {canManageProducts && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(p)}
                        className="flex flex-1 items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-amber-400 to-orange-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <Pencil size={16}/> Edit
                      </button>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="flex flex-1 items-center justify-center gap-2  px-4 py-2.5 bg-linear-to-r from-red-500 to-rose-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <Trash2 size={16}/> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No Products Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start by adding your first product to the inventory
            </p>
            {canManageProducts && (
              <button
                onClick={() => setShowForm(true)}
                className="px-8 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                + Add Your First Product
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
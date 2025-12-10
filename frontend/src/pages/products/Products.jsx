import { useEffect, useState } from "react";
import {
  addToCart,
  API_URL,
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../../services/api";
import { Plus } from "lucide-react";
import ProductGrid from "./ProductGrid";
import ProductForm from "./ProductForm ";

function Products({ user, updateCartCount }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
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

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return `${API_URL}/${imagePath}`;
  };
  const handleImageChange = (e, shouldRemove = false) => {
    if (shouldRemove) {
      setImagePreview(null);
      setFormData({ ...formData, image: null });
      return;
    }

    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setFormData({ ...formData, image: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("category", formData.category);
      submitData.append("price", formData.price);
      submitData.append("quantity", formData.quantity);

      if (formData.image) {
        submitData.append("image", formData.image);
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, submitData);
      } else {
        await createProduct(submitData);
      }

      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        quantity: "",
        image: null,
      });
      setImagePreview(null);
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
      price: product.price,
      quantity: product.quantity,
      image: null,
    });
    setImagePreview(product.image ? getImageUrl(product.image) : null);
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
      image: null,
    });
    setImagePreview(null);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

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
              <Plus size={16} /> Add Product
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

        {error && (
          <div className="bg-linear-to-r from-red-100 to-rose-100 border-l-4 border-red-500 text-red-700 p-5 rounded-lg mb-6 shadow-md">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Product Form */}
        {showForm && canManageProducts && (
          <ProductForm
            editingProduct={editingProduct}
            formData={formData}
            imagePreview={imagePreview}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onImageChange={handleImageChange}
            onCancel={cancelForm}
          />
        )}

        {/* Product Grid or Empty State */}
        {products.length === 0 ? (
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
        ) : (
          <ProductGrid
            products={products}
            canManageProducts={canManageProducts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddToCart={handleAddToCart}
          />
        )}
      </div>
    </div>
  );
}

export default Products;

import { ImageIcon, Pencil, Plus, RefreshCcw, Upload, X } from "lucide-react";

const ProductForm = ({
  editingProduct,
  formData,
  imagePreview,
  onSubmit,
  onChange,
  onImageChange,
  onCancel,
}) => {
  const handleImageRemove = () => {
    onImageChange({ target: { files: null } }, true);
  };
  return (
    <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl mb-10 border-2 border-purple-100">
      <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-purple-200">
        {editingProduct ? (
          <>
            <Pencil className="text-purple-500 font-bold" size={20} />
            Edit Product
          </>
        ) : (
          <>
            <Plus className="text-green-500 font-bold" size={20} />
            Add New Product
          </>
        )}
      </h3>

      <div className="space-y-6">
        {/* Image Upload Section */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700 text-sm uppercase tracking-wide">
            Product Image
          </label>
          <div className="flex flex-col items-center gap-4">
            {imagePreview ? (
              <div className="relative w-full max-w-md">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-xl border-4 border-purple-200 shadow-lg"
                />
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="w-full max-w-md h-64 border-4 border-dashed border-purple-300 rounded-xl flex flex-col items-center justify-center bg-purple-50 hover:bg-purple-100 transition-colors">
                <ImageIcon size={48} className="text-purple-400 mb-2" />
                <p className="text-gray-600 font-medium">No image selected</p>
              </div>
            )}

            <label className="px-6 py-3 flex items-center gap-2 bg-linear-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
              <Upload size={16} />
              {imagePreview ? "Change Image" : "Upload Image"}
              <input
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700 text-sm uppercase tracking-wide">
            Product Title *
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={onChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-white"
            placeholder="Enter product title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700 text-sm uppercase tracking-wide">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={onChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none bg-white"
            placeholder="Describe your product..."
          />
        </div>

        {/* Category and Quantity */}
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
              onChange={onChange}
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
              onChange={onChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-white"
              placeholder="0"
            />
          </div>
        </div>

        {/* Price */}
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
              onChange={onChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-white"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={onSubmit}
            className="px-8 py-3 flex items-center gap-2 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            {editingProduct ? (
              <>
                <RefreshCcw size={16} /> Update
              </>
            ) : (
              <>
                <Plus size={16} /> Create
              </>
            )}
          </button>

          <button
            onClick={onCancel}
            className="px-8 py-3 flex items-center gap-2 bg-linear-to-r from-gray-400 to-gray-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <X size={16} /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProductForm;

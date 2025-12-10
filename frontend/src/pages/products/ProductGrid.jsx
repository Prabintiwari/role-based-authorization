import { ImageIcon, Pencil, ShoppingCart, Trash2 } from "lucide-react";
import { API_URL } from "../../services/api";

const ProductGrid = ({
  products,
  canManageProducts,
  onEdit,
  onDelete,
  onAddToCart,
}) => {
  const getImageUrl = (imagePath) => {
    if (!imagePath) return undefined;
    return `${API_URL}/${imagePath}`;
  };
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((p) => (
        <div
          key={p.id}
          className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1"
        >
          {p.image ? (
            <div className="relative h-40 overflow-hidden bg-linear-to-br from-purple-100 to-pink-100">
              <img
                src={getImageUrl(p.image)}
                alt={p.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ) : (
            <div className="h-40 bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <ImageIcon size={64} className="text-purple-300" />
            </div>
          )}

          <div className="p-2">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-lg line-clamp-2 font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-200">
                {p.title}
              </h3>
            </div>

            {p.description && (
              <p className="text-gray-600 text-xs line-clamp-2 mb-2 leading-relaxed">
                {p.description}
              </p>
            )}

            {p.category && (
              <div className="mb-2">
                <span className="inline-block px-2 py-1 text-xs font-normal rounded-full bg-linear-to-br from-purple-400 to-pink-400 text-white shadow-md">
                  {p.category}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center mb-1 pt-1 border-t-2 border-gray-100">
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-gray-500 font-medium">Rs.</span>
                <span className="text-xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {p.price.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-linear-to-r from-gray-100 to-gray-200 px-2 py-1 rounded-lg">
                <span className="text-xs font-medium text-gray-600">Qty:</span>
                <span className="text-xs font-bold text-gray-800">{p.quantity}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => onAddToCart(p.id)}
                className="w-full px-2 py-2.5 flex items-center justify-center gap-2 bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <ShoppingCart size={16} /> Add to Cart
              </button>

              {canManageProducts && (
                <div className="flex gap-3">
                  <button
                    onClick={() => onEdit(p)}
                    className="flex flex-1 items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-amber-400 to-orange-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Pencil size={16} /> Edit
                  </button>

                  <button
                    onClick={() => onDelete(p.id)}
                    className="flex flex-1 items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-red-500 to-rose-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default ProductGrid
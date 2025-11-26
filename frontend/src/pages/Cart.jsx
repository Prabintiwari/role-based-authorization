import { useState, useEffect } from "react";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import {
  getMyCarts,
  updateCartQuantity,
  removeFromCart,
  deleteCart,
} from "../services/api";
import Loader from "../components/Loader";

function Cart({ updateCartCount }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await getMyCarts();
      setCartItems(response.data.cart || []);
      setError("");
    } catch (err) {
      setError("Failed to load cart");
      console.error("Fetch cart error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, action) => {
    try {
      const response = await updateCartQuantity(productId, action);

      if (response.data.deleted) {
        setCartItems(cartItems.filter((item) => item.product_id !== productId));
      } else {
        setCartItems(
          cartItems.map((item) =>
            item.product_id === productId
              ? { ...item, count: response.data.cartItem.count }
              : item
          )
        );
      }

      updateCartCount();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update quantity");
    }
  };

  const removeItem = async (productId) => {
    try {
      await removeFromCart(productId);
      setCartItems(cartItems.filter((item) => item.product_id !== productId));
      updateCartCount();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to remove item");
    }
  };

  const clearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;

    try {
      await deleteCart();
      setCartItems([]);
      updateCartCount();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to clear cart");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.count,
      0
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 px-5 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-linear-to-r from-red-100 to-rose-100 border-l-4 border-red-500 text-red-700 p-5 rounded-lg shadow-md">
            <p className="font-semibold">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 px-5 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Shopping Cart
            </h1>
            <p className="text-gray-600">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
              your cart
            </p>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="px-6 py-3 bg-linear-to-r from-red-500 to-rose-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg">
            <ShoppingBag className="mx-auto mb-4 text-gray-400" size={80} />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              Your Cart is Empty
            </h3>
            <p className="text-gray-500 mb-6">
              Add some products to your cart to get started
            </p>
            <a
              href="/products"
              className="inline-block px-8 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Browse Products
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.product_id}
                  className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-6 items-center hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {item.product.title}
                    </h3>
                    {item.product.category && (
                      <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-linear-to-br from-purple-400 to-pink-400 text-white">
                        {item.product.category}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <div className="text-2xl font-bold text-green-600">
                      Rs. {item.product.price.toFixed(2)}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.product_id, "decrement")
                        }
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow hover:bg-gray-50 transition"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center font-bold text-lg">
                        {item.count}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product_id, "increment")
                        }
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow hover:bg-gray-50 transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="text-lg font-bold text-gray-800">
                      Subtotal: Rs.{" "}
                      {(item.product.price * item.count).toFixed(2)}
                    </div>

                    <button
                      onClick={() => removeItem(item.product_id)}
                      className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-red-500 to-rose-600 text-white rounded-lg font-semibold shadow hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-purple-200">
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      Rs. {calculateTotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold">Rs. 0.00</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (13%)</span>
                    <span className="font-semibold">
                      Rs. {(calculateTotal() * 0.13).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-800">
                      <span>Total</span>
                      <span className="text-green-600">
                        Rs. {(calculateTotal() * 1.13).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="w-full px-6 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                  Proceed to Checkout
                </button>

                <a
                  href="/products"
                  className="block text-center mt-4 text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Continue Shopping
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;

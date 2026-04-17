import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Package, Weight, IndianRupee, ShoppingBag, User } from "lucide-react";

const INITIAL_STATE = {
  farmer: "",
  productName: "",
  weight: "",
  rate: "",
  bagQuantity: "",
  material: "",
  status: "pending",
};

const MATERIALS = [
  { value: "makka", label: "Makka" },
  { value: "gehu", label: "Gehu" },
  { value: "dhan", label: "Dhan" },
  { value: "haldi", label: "Haldi" },
];

const AddDeal = () => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [farmers, setFarmers] = useState([]);
  const [farmersLoading, setFarmersLoading] = useState(false);

  // Fetch farmers on component mount
  useEffect(() => {
    const fetchFarmers = async () => {
      setFarmersLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/farmers`,
          {
            credentials: "include",
          },
        );
        const data = await response.json();
        if (data.success) {
          setFarmers(data.data);
        }
      } catch (error) {
        console.error("Error fetching farmers:", error);
      } finally {
        setFarmersLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Deal added successfully");
        setFormData(INITIAL_STATE);
      } else {
        toast.error(data.message || "Failed to add deal");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Live total calculation
  const total =
    formData.weight && formData.rate
      ? (parseFloat(formData.weight) * parseFloat(formData.rate)).toFixed(2)
      : null;

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-warning/10 to-success/10 rounded-2xl p-6 mb-6 border border-warning/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-warning/20 border border-warning/30 flex items-center justify-center">
            <Package size={20} className="text-warning" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-base-content">
              Add New Deal
            </h2>
            <p className="text-sm text-base-content/60 mt-1">
              Record a new transaction deal for farmer products
            </p>
          </div>
        </div>
      </div>

      {/* Form with card styling */}
      <div className=" rounded-2xl border border-base-300 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Farmer Selection Section */}
          <div>
            <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-wide mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-warning rounded-full"></div>
              Farmer Selection
            </h3>
            <div className="form-control">
              <label className="label py-0 mb-2">
                <span className="label-text text-sm font-medium">
                  Select Farmer <span className="text-error">*</span>
                </span>
              </label>
              <select
                name="farmer"
                value={formData.farmer}
                onChange={handleInputChange}
                className="select outline-none text-sm focus:border-warning focus:ring-2 focus:ring-warning/20 focus:outline-none w-full transition-all"
                required
                disabled={farmersLoading}
              >
                <option value="">Choose a farmer from the list</option>
                {farmers.map((farmer) => (
                  <option key={farmer._id} value={farmer._id}>
                    {farmer.name} - {farmer.mobile}
                  </option>
                ))}
              </select>
              {farmersLoading && (
                <label className="label py-0">
                  <span className="label-text-alt text-xs text-warning/60 flex items-center gap-1">
                    <span className="loading loading-spinner loading-xs"></span>
                    Loading farmers...
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Product Details Section */}
          <div>
            <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-wide mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-success rounded-full"></div>
              Product Details
            </h3>

            <div className="space-y-4">
              {/* Product Name */}
              <div className="form-control">
                <label className="label py-0 mb-2">
                  <span className="label-text text-sm font-medium">
                    Product Name
                  </span>
                </label>
                <label className="input outline-none flex items-center gap-3 focus-within:border-success focus-within:ring-2 focus-within:ring-success/20 transition-all">
                  <Package
                    size={16}
                    className="text-base-content/40 shrink-0"
                  />
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    className="grow text-sm bg-transparent outline-none placeholder:text-base-content/30"
                  />
                </label>
              </div>

              {/* Weight + Rate side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label py-0 mb-2">
                    <span className="label-text text-sm font-medium">
                      Weight (kg)
                    </span>
                  </label>
                  <label className="input outline-none flex items-center gap-3 focus-within:border-success focus-within:ring-2 focus-within:ring-success/20 transition-all">
                    <Weight
                      size={16}
                      className="text-base-content/40 shrink-0"
                    />
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="0.0"
                      className="grow text-sm bg-transparent outline-none placeholder:text-base-content/30"
                      step="0.1"
                      min="0"
                    />
                  </label>
                </div>

                <div className="form-control">
                  <label className="label py-0 mb-2">
                    <span className="label-text text-sm font-medium">
                      Rate (per kg)
                    </span>
                  </label>
                  <label className="input outline-none flex items-center gap-3 focus-within:border-success focus-within:ring-2 focus-within:ring-success/20 transition-all">
                    <IndianRupee
                      size={16}
                      className="text-base-content/40 shrink-0"
                    />
                    <input
                      type="number"
                      name="rate"
                      value={formData.rate}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="grow text-sm bg-transparent outline-none placeholder:text-base-content/30"
                      step="0.01"
                      min="0"
                    />
                  </label>
                </div>
              </div>

              {/* Live total calculation */}
              {total && (
                <div className="bg-success/10 border border-success/25 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                      <IndianRupee size={14} className="text-success" />
                    </div>
                    <span className="text-sm font-medium text-success/80">
                      Estimated Total
                    </span>
                  </div>
                  <span className="text-lg font-bold text-success">
                    Rs. {total}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information Section */}
          <div>
            <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-wide mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-info rounded-full"></div>
              Additional Information
            </h3>

            <div className="space-y-4">
              {/* Bag Quantity */}
              <div className="form-control">
                <label className="label py-0 mb-2">
                  <span className="label-text text-sm font-medium">
                    Bag Quantity
                  </span>
                </label>
                <label className="input outline-none flex items-center gap-3 focus-within:border-success focus-within:ring-2 focus-within:ring-success/20  transition-all">
                  <ShoppingBag
                    size={16}
                    className="text-base-content/40 shrink-0"
                  />
                  <input
                    type="number"
                    name="bagQuantity"
                    value={formData.bagQuantity}
                    onChange={handleInputChange}
                    placeholder="Number of bags"
                    className="grow text-sm bg-transparent outline-none placeholder:text-base-content/30"
                    min="0"
                  />
                </label>
              </div>

              {/* Material + Status side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label py-0 mb-2">
                    <span className="label-text text-sm font-medium">
                      Material <span className="text-error">*</span>
                    </span>
                  </label>
                  <select
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    className="select outline-none text-sm focus:border-success focus:ring-2 focus:ring-success/20 focus:outline-none w-full  transition-all"
                    required
                  >
                    <option value="">Select material type</option>
                    {MATERIALS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label py-0 mb-2">
                    <span className="label-text text-sm font-medium">
                      Payment Status
                    </span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="select outline-none text-sm focus:border-success focus:ring-2 focus:ring-success/20 focus:outline-none w-full  transition-all"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-base-200">
            <button
              type="submit"
              className="btn btn-warning w-full text-sm font-medium tracking-wide shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Adding deal...
                </>
              ) : (
                <>
                  <Package size={16} className="mr-2" />
                  Add Deal
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeal;

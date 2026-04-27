import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { IndianRupee, Calendar } from "lucide-react";
import { getFarmerPayments } from "../../api/payments";
import LoadingSpinner from "../LoadingSpinner";
import BackButton from "../admin/BackButton";

const FarmerViewPayments = () => {
  const [page, setPage] = useState(1);
  const [farmer, setFarmer] = useState(null);
  const limit = 10;

  // Get farmer ID from localStorage
  useEffect(() => {
    const storedFarmer = localStorage.getItem("farmer");
    if (storedFarmer) {
      try {
        const farmerData = JSON.parse(storedFarmer);
        setFarmer(farmerData);
      } catch (error) {
        console.error("Error parsing farmer data:", error);
        localStorage.removeItem("farmer");
      }
    }
  }, []);

  // Fetch payments for the logged-in farmer
  const { data: paymentsData, isLoading: loadingPayments } = useQuery({
    queryKey: ["farmer-payments", farmer?._id, page],
    queryFn: () => getFarmerPayments(farmer?._id, { page, limit }),
    enabled: !!farmer?._id,
  });

  const payments = paymentsData?.data ?? [];
  const pagination = paymentsData?.pagination;

  if (!farmer) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading farmer information..." />
      </div>
    );
  }

  if (loadingPayments) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading payments..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mobile Back Button */}
      <div className="flex justify-between items-center">
        <BackButton />
      </div>

      

      {payments.length === 0 ? (
        <div className="text-center py-8">
          <IndianRupee
            size={48}
            className="text-base-content/30 mx-auto mb-4"
          />
          <p className="text-base-content/60">No payment records found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Advance Payment</th>
                  <th>Remaining</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-base-content/40" />
                        <span className="text-sm text-nowrap">
                          {new Date(payment.paymentDate).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <IndianRupee size={14} />
                        <span className="font-medium">
                          {payment?.advancePayment?.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <IndianRupee size={14} className="text-warning" />
                        <span className="font-medium text-warning">
                          {payment?.remainingPayment?.toFixed(2) || 0}
                        </span>
                      </div>
                    </td>
                    <td className="max-w-xs">
                      <div className="truncate" title={payment.reason}>
                        {payment.reason}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-base-content/60">
                Page {pagination.page} of {pagination.totalPages} ·{" "}
                {pagination.total} payments
              </span>
              <div className="join">
                <button
                  className="join-item btn btn-sm"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  «
                </button>
                <button className="join-item btn btn-sm">
                  {pagination.page}
                </button>
                <button
                  className="join-item btn btn-sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FarmerViewPayments;

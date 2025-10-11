import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../../components/ui/button";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { useI18n } from "@/contexts/I18nContext";

interface Car {
  id: number;
  brand_id: number;
  model_id: number;
  year_id: number;
  approved: boolean;
  // ...other fields as needed
  brand_name?: string;
  model_name?: string;
  year_value?: string;
}

const AdminAddsPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [admin, setAdmin] = useState<{ name: string } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState<any | null>(null);
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [models, setModels] = useState<{ id: number; name: string }[]>([]);
  const [years, setYears] = useState<{ id: number; value: string }[]>([]);
  const { currentLanguage } = useI18n();
  // Helper functions to get names/values
  const getBrandName = (id: number, fallback?: string) =>
    brands.find((b) => b.id === id)?.name || fallback || id;
  const getModelName = (id: number, fallback?: string) =>
    models.find((m) => m.id === id)?.name || fallback || id;
  const getYearValue = (id: number, fallback?: string) =>
    years.find((y) => y.id === id)?.value || fallback || id;

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      window.location.href = `/${currentLanguage}/admin`;
      return;
    }
    try {
      const parsed = JSON.parse(user);
      if (!parsed.admin) {
        window.location.href = `/${currentLanguage}/admin`;
        return;
      }
      setAdmin(parsed);
    } catch {
      window.location.href = `/${currentLanguage}/admin`;
      return;
    }
    fetchCars();
    // eslint-disable-next-line
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = `/${currentLanguage}/admin`;
  };

  const fetchCars = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/cars", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars(res.data);
    } catch (err: any) {
      setError("Failed to fetch cars");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/api/cars/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      fetchCars();
    } catch (err) {
      alert("Failed to approve add");
    }
  };

  const handleReject = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/api/cars/${id}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      fetchCars();
    } catch (err) {
      alert("Failed to reject add");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this add?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/cars/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCars();
    } catch (err) {
      alert("Failed to delete add");
    }
  };

  const handleShow = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/cars/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedCar(res.data);
      setShowModal(true);
    } catch (err) {
      alert("Failed to fetch car details");
    }
  };

  // TODO: Implement create/edit modal logic

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <AdminNavbar admin={admin} handleLogout={handleLogout} />
      <div className="flex w-full">
        <AdminSidebar active="adds" />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-4">Autokuulutused (Adds)</h1>
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">{error}</div>}
          <table className="min-w-full border">
            <thead>
              <tr>
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">Brand</th>
                <th className="border px-2 py-1">Model</th>
                <th className="border px-2 py-1">Year</th>
                <th className="border px-2 py-1">Status</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id}>
                  <td className="border px-2 py-1">{car.id}</td>
                  <td className="border px-2 py-1">
                    {getBrandName(car.brand_id, car.brand_name)}
                  </td>
                  <td className="border px-2 py-1">
                    {getModelName(car.model_id, car.model_name)}
                  </td>
                  <td className="border px-2 py-1">
                    {getYearValue(car.year_id, car.year_value)}
                  </td>
                  <td className="border px-2 py-1">
                    {car.approved ? "Live" : "Hidden"}
                  </td>
                  <td className="border px-2 py-1 space-x-2">
                    <Button size="sm" onClick={() => handleShow(car.id)}>
                      Show
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(car.id)}
                    >
                      Delete
                    </Button>

                    {car.approved
                      ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(car.id)}
                            className="bg-red-500 text-white"
                          >
                            Hide
                          </Button>
                        )
                      : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove(car.id)}
                            className="bg-green-500 text-white"
                          >
                            Show
                          </Button>
                        )
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent>
              <DialogTitle>Car Details</DialogTitle>
              {selectedCar && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <b>Brand:</b> {selectedCar.brand_name}
                    </div>
                    <div>
                      <b>Model:</b> {selectedCar.model_name}
                    </div>
                    <div>
                      <b>Year:</b> {selectedCar.year_value}
                    </div>
                    <div>
                      <b>Category:</b> {selectedCar.category}
                    </div>
                    <div>
                      <b>Transmission:</b> {selectedCar.transmission}
                    </div>
                    <div>
                      <b>Fuel Type:</b> {selectedCar.fuelType}
                    </div>
                    <div>
                      <b>Plate Number:</b> {selectedCar.plateNumber}
                    </div>
                    <div>
                      <b>Mileage:</b> {selectedCar.mileage}
                    </div>
                    <div>
                      <b>Power:</b> {selectedCar.power}
                    </div>
                    <div>
                      <b>Displacement:</b> {selectedCar.displacement}
                    </div>
                    <div>
                      <b>Owner Count:</b> {selectedCar.ownerCount}
                    </div>
                    <div>
                      <b>Drive Type:</b> {selectedCar.driveType}
                    </div>
                    <div>
                      <b>Model Detail:</b> {selectedCar.modelDetail}
                    </div>
                    <div>
                      <b>Price:</b> {selectedCar.price}
                    </div>
                    <div>
                      <b>Discount Price:</b> {selectedCar.discountPrice}
                    </div>
                    <div>
                      <b>Warranty:</b> {selectedCar.warranty}
                    </div>
                    <div>
                      <b>VAT Refundable:</b> {selectedCar.vatRefundable}
                    </div>
                    <div>
                      <b>VAT Rate:</b> {selectedCar.vatRate}
                    </div>
                    <div>
                      <b>Accident:</b> {selectedCar.accident}
                    </div>
                    <div>
                      <b>VIN Code:</b> {selectedCar.vinCode}
                    </div>
                    <div>
                      <b>Description:</b> {selectedCar.description}
                    </div>
                    <div>
                      <b>Equipment:</b> {selectedCar.equipment}
                    </div>
                    <div>
                      <b>Additional Info:</b> {selectedCar.additionalInfo}
                    </div>
                    <div>
                      <b>Country:</b> {selectedCar.country}
                    </div>
                    <div>
                      <b>Phone:</b> {selectedCar.phone}
                    </div>
                    <div>
                      <b>Business Type:</b> {selectedCar.businessType}
                    </div>
                    <div>
                      <b>Social Network:</b> {selectedCar.socialNetwork}
                    </div>
                    <div>
                      <b>Email:</b> {selectedCar.email}
                    </div>
                    <div>
                      <b>Approved:</b> {selectedCar.approved ? "Yes" : "No"}
                    </div>
                    <div>
                      <b>Created At:</b> {selectedCar.created_at}
                    </div>
                    <div>
                      <b>Updated At:</b> {selectedCar.updated_at}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(
                      (i) =>
                        selectedCar[`image_${i}`] && (
                          <img
                            key={i}
                            src={selectedCar[`image_${i}`]}
                            alt={`Car image ${i}`}
                            className="w-full h-24 object-cover rounded"
                          />
                        ),
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default AdminAddsPage;

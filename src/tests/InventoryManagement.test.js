import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import InventoryManagement from "../components/InventoryManagement";
import { fireDB } from "../firebaseConfig";
import { collection, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

// Mock Firebase Firestore functions
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
}));

describe("InventoryManagement Component", () => {
  const mockProducts = [
    { id: "1", name: "Product 1", price: 100, category: "Electronics", quantity: 5, manufacturer: "Manufacturer A", description: "Description 1", imageURL: "http://example.com/product1.jpg" },
    { id: "2", name: "Product 2", price: 200, category: "Fashion", quantity: 3, manufacturer: "Manufacturer B", description: "Description 2", imageURL: "http://example.com/product2.jpg" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    getDocs.mockResolvedValue({
      forEach: (callback) => mockProducts.forEach((product) => callback({ id: product.id, data: () => product })),
    });
  });

  test("renders the component without crashing", async () => {
    render(<InventoryManagement />);
    expect(screen.getByText(/inventory management/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
      expect(screen.getByText("Product 2")).toBeInTheDocument();
    });
  });

  test("fetches and displays the list of products", async () => {
    render(<InventoryManagement />);
    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
      expect(screen.getByText("Manufacturer A")).toBeInTheDocument();
    });
  });

  test("opens the add product modal when Add Product button is clicked", () => {
    render(<InventoryManagement />);
    const addButton = screen.getByText(/add product/i);
    fireEvent.click(addButton);
    expect(screen.getByText(/add product/i)).toBeInTheDocument();
  });

  test("adds a new product successfully", async () => {
    addDoc.mockResolvedValueOnce();
    render(<InventoryManagement />);
    fireEvent.click(screen.getByText(/add product/i));

    fireEvent.change(screen.getByLabelText(/name:/i), { target: { value: "New Product" } });
    fireEvent.change(screen.getByLabelText(/price:/i), { target: { value: "300" } });
    fireEvent.change(screen.getByLabelText(/description:/i), { target: { value: "New Description" } });
    fireEvent.change(screen.getByLabelText(/category:/i), { target: { value: "Category C" } });
    fireEvent.change(screen.getByLabelText(/quantity:/i), { target: { value: "10" } });
    fireEvent.change(screen.getByLabelText(/manufacturer:/i), { target: { value: "Manufacturer C" } });
    fireEvent.change(screen.getByLabelText(/image url:/i), { target: { value: "http://example.com/newproduct.jpg" } });

    fireEvent.click(screen.getByText(/add/i));

    await waitFor(() => {
      expect(addDoc).toHaveBeenCalledTimes(1);
    });
  });

  test("opens the edit product modal with pre-filled values", async () => {
    render(<InventoryManagement />);
    await waitFor(() => {
      const editButton = screen.getAllByText(/edit/i)[0];
      fireEvent.click(editButton);
    });

    expect(screen.getByDisplayValue("Product 1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("100")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Description 1")).toBeInTheDocument();
  });

  test("edits a product successfully", async () => {
    updateDoc.mockResolvedValueOnce();
    render(<InventoryManagement />);
    await waitFor(() => {
      fireEvent.click(screen.getAllByText(/edit/i)[0]);
    });

    fireEvent.change(screen.getByLabelText(/name:/i), { target: { value: "Updated Product" } });
    fireEvent.click(screen.getByText(/update/i));

    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalledTimes(1);
    });
  });

  test("deletes a product successfully", async () => {
    deleteDoc.mockResolvedValueOnce();
    render(<InventoryManagement />);
    await waitFor(() => {
      fireEvent.click(screen.getAllByText(/delete/i)[0]);
    });

    global.confirm = jest.fn(() => true); // Mock confirm dialog

    await waitFor(() => {
      expect(deleteDoc).toHaveBeenCalledTimes(1);
    });
  });

  test("displays the loader while fetching products", async () => {
    setTimeout(() => render(<InventoryManagement />), 100); // Simulate loading delay
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("displays an error if fetching products fails", async () => {
    getDocs.mockRejectedValueOnce(new Error("Fetching error"));
    render(<InventoryManagement />);
    await waitFor(() => {
      expect(screen.getByText(/error fetching products/i)).toBeInTheDocument();
    });
  });

  test("resets the form when cancel is clicked in the modal", async () => {
    render(<InventoryManagement />);
    fireEvent.click(screen.getByText(/add product/i));

    fireEvent.change(screen.getByLabelText(/name:/i), { target: { value: "Temporary Product" } });
    fireEvent.click(screen.getByText(/cancel/i));

    expect(screen.queryByDisplayValue("Temporary Product")).not.toBeInTheDocument();
  });
});
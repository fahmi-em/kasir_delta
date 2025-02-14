"use client";

import React from "react";
import { useTheme } from 'next-themes';
import { IoAddCircleOutline, IoPrintOutline, IoTrashOutline } from "react-icons/io5";
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { deleteCust, deleteAllOrderList, deleteOrder, deleteBahanById, deleteOrderList, deleteOrderSatu } from "@/lib/actions";
import clsx from "clsx";
import Swal from "sweetalert2";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { signOut } from 'next-auth/react';
import { Edit2Icon } from "lucide-react";


export function Button({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) {
  return (
    <button className="w-full bg-gray-800 text-white py-3 px-4 rounded-md hover:bg-gray-700  dark:bg-[#03346E] dark:hover:bg-[#03336e9d] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" onClick={onClick}>
      {children}
    </button>
  );
}

export const Delete = ({ onClick }: { onClick?: () => void }) => {
  const {pending} = useFormStatus();

  const className = clsx(
    "text-white bg-red-600 hover:bg-red-700 font-medium rounded-md text-sm w-full px-5 py-3 text-center dark:bg-[#750E21] dark:hover:bg-[#750e2179]",
    {
      "opacity-50 cursor-progress": pending,
    }
  );
  return (
    <button className={className} onClick={onClick} disabled={pending}>
      <p>Clear</p>
    </button>
  );
}

export const AddButton = ({ label }: { label: string }) => {
  const { pending } = useFormStatus();

  const className = clsx(
    "text-white bg-blue-500 hover:bg-blue-700 font-medium rounded-md text-sm w-full px-5 py-3 text-center ",
    {
      "opacity-50 cursor-progress": pending,
    }
  );
  return (
    <button
      type="submit"
      className={`flex items-center gap-2 ${className} dark:bg-[#03346E] dark:hover:bg-[#03336e9d]`}
      disabled={pending}
    >
      <IoAddCircleOutline />
      <p>Add Order</p>
    </button>

  );
};

export const DeleteButton = ({ nik }: { nik: string }) => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  
  const handleDelete = async () => {
    const themeConfig = currentTheme === 'dark'
      ? {
        background: '#191919',
        color: '#fff',
        iconColor: '#f8bb86',
      }
      : {
        background: '#ffffff',
        // color: '#000',
        // iconColor: '#000',
      };

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      ...themeConfig,
    });

    if (result.isConfirmed) {
      try {
        const deleteResult = await deleteCust(nik);
        if (deleteResult.success) {
          Swal.fire({
            title: "Deleted!",
            text: deleteResult.message,
            icon: "success",
            ...themeConfig,
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: deleteResult.message,
            icon: "error",
            ...themeConfig,
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete the customer.",
          icon: "error",
          ...themeConfig,
        });
        console.error("Error deleting customer:", error);
      }
    }
  };

  return (
    <button
      className="rounded-sm border p-1 ml-1 hover:bg-gray-200 dark:hover:bg-[#444343]"
      onClick={handleDelete}
    >
      <IoTrashOutline size={20} />
    </button>
  );
};


export const SubmitButton = ({ label }: { label: string }) => {
  const { pending } = useFormStatus();

  const className = clsx(
    "text-white bg-black hover:bg-gray-800 font-medium rounded-md text-sm w-full px-5 py-3 text-center dark:bg-[#03346E] dark:hover:bg-[#03336e9d]",
    {
      "opacity-50 cursor-progress": pending,
    }
  );


  return (
    <button type="submit" className={className} disabled={pending}>
      {label === "save" ? (
        <span>{pending ? "Saving..." : "Save"}</span>
      ) : (
        <span>{pending ? "Updating..." : "Update"}</span>
      )}
    </button>
  );
};


interface PrintButtonProps {
  id_pengenal: string;
  handleModalToggle: (id_pengenal: string) => void;
}

export const PrintButton: React.FC<PrintButtonProps> = ({ id_pengenal, handleModalToggle }) => {
  return (
    <button
      className="rounded-sm border p-1 ml-1 hover:bg-gray-200 dark:hover:dark:bg-[#333333]"
      onClick={() => handleModalToggle(id_pengenal)}
    >
      <IoPrintOutline size={20} />
    </button>
  );
};

interface EditButtonProps {
  id_pengenal: string;
  handleModalToggle: (id_pengenal: string) => void;
}

export const EditButtonOrder: React.FC<EditButtonProps> = ({ id_pengenal, handleModalToggle }) => {
  return (
    <button
      className="rounded-sm border p-1 ml-1 hover:bg-gray-200 dark:hover:dark:bg-[#333333]"
      onClick={() => handleModalToggle(id_pengenal)}
    >
      <Edit2Icon size={20} />
    </button>
  );
};

export const DeletePending = ({ status }: { status: string }) => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  const handleDelete = async () => {
    const themeConfig = currentTheme === 'dark'
      ? {
        background: '#191919',
        color: '#fff',
        iconColor: '#f8bb86',
        confirmButtonColor: "#750E21",
        cancelButtonColor: "#03346E",
      }
      : {
        background: '#ffffff',
        color: '#000',
        iconColor: '#f8bb86',
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      };

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      ...themeConfig,
    });

    if (result.isConfirmed) {
      try {
        await deleteAllOrderList(status);
        Swal.fire({
          title: "Deleted!",
          text: "The order has been deleted.",
          icon: "success",
          ...themeConfig,
        }).then(() => {
          window.location.reload();
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete the order.",
          icon: "error",
          ...themeConfig,
        });
        console.error("Error deleting customer:", error);
      }
    }
  };

  return (
    <button
      type="button"
      className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-[#750E21] dark:hover:bg-[#750e2179]"
      onClick={handleDelete}
      disabled={!status}
    >
      <p>Delete</p>
    </button>
  );
};


export const DeleteList = ({id_pesanan, onDelete }: {id_pesanan: number, onDelete: (id_pesanan: number) => void }) => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  const handleDelete = async () => {
    const themeConfig = currentTheme === 'dark'
      ? {
        background: '#191919',
        color: '#fff',
        iconColor: '#f8bb86',
        confirmButtonColor: "#750E21",
        cancelButtonColor: "#03346E",
      }
      : {
        background: '#ffffff',
        color: '#000',
        iconColor: '#f8bb86',
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      };

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      ...themeConfig,
    });

    if (result.isConfirmed) {
      try {
        await deleteOrderList(id_pesanan);
        Swal.fire({
          title: "Deleted!",
          text: "The order has been deleted.",
          icon: "success",
          ...themeConfig,
        });
        onDelete(id_pesanan);
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete the order.",
          icon: "error",
          ...themeConfig,
        });
        console.error("Error deleting customer:", error);
      }
    }
  };

  return (
    <button type="button" onClick={handleDelete}>
      <FontAwesomeIcon
        icon={faTrash}
        className="text-red-600 text-lg cursor-pointer hover:text-red-700 dark:text-[#750E21] dark:hover:text-[#750e2179]"
      />
    </button>
  );
};


export const InvoiceButton = ({ id_pengenal }: { id_pengenal: string }) => {
  const router = useRouter();

  const handlePrint = () => {
    router.push(`/view-order/print-invoice?id_pengenal=${id_pengenal}`);
  };

  return (
    <div className="flex">
      <button
        className="flex items-center gap-2 rounded-md border p-2 ml-auto mt-5 hover:bg-gray-100 dark:bg-[#03346E] dark:hover:bg-[#03336e9d]"
        onClick={handlePrint}
      >
        <IoPrintOutline size={20} />
        <span>Print Invoice</span>
      </button>
    </div>
  );
};


export const DeleteOrder = ({ id_pengenal }: { id_pengenal: string }) => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  const handleDelete = async () => {
    const themeConfig = currentTheme === 'dark'
      ? {
        background: '#191919',
        color: '#fff',
        iconColor: '#f8bb86',
        confirmButtonColor: "#750E21",
        cancelButtonColor: "#03346E",
      }
      : {
        background: '#ffffff',
        color: '#000',
        iconColor: '#f8bb86', 
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      };

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      ...themeConfig,
    });

    if (result.isConfirmed) {
      try {
        await deleteOrder(id_pengenal);
        Swal.fire({
          title: "Deleted!",
          text: "The order has been deleted.",
          icon: "success",
          ...themeConfig,
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete the order.",
          icon: "error",
          ...themeConfig,
        });
        console.error("Error deleting customer:", error);
      }
    }
  };

  return (
    <button
      className="rounded-sm border p-1 ml-1 hover:bg-gray-200 dark:hover:dark:bg-[#333333]"
      onClick={handleDelete}
    >
      <IoTrashOutline size={20} />
    </button>
  );
};

export const LoginButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-white bg-black hover:bg-gray-800 font-medium rounded-md text-sm w-full px-5 py-3 text-center dark:bg-[#03346E] dark:hover:bg-[#03336e9d]"
    >
      <p>{pending ? "Authenticating..." : "Login"}</p>
    </button>
  );
}


export const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/login' });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  return (
    <button
      className="bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-[#750E21] dark:hover:bg-[#750e2179]"
      onClick={handleLogout}
    >
      LogOut
    </button>
  );
};

export const DeleteBahan = ({ id_bahan }: { id_bahan: number }) => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  const handleDelete = async () => {
    const themeConfig = currentTheme === 'dark'
      ? {
        background: '#191919',
        color: '#fff',
        iconColor: '#f8bb86',
        confirmButtonColor: "#750E21",
        cancelButtonColor: "#03346E",
      }
      : {
        background: '#ffffff',
        color: '#000',
        iconColor: '#f8bb86', 
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      };

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      ...themeConfig,
    });

    if (result.isConfirmed) {
      try {
        await deleteBahanById(id_bahan);
        Swal.fire({
          title: "Deleted!",
          text: "The order has been deleted.",
          icon: "success",
          ...themeConfig,
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete the order.",
          icon: "error",
          ...themeConfig,
        });
        console.error("Error deleting customer:", error);
      }
    }
  };

  return (
    <button
      className="rounded-sm border p-1 ml-1 hover:bg-gray-200 dark:hover:dark:bg-[#444343]"
      onClick={handleDelete}
    >
      <IoTrashOutline size={20} />
    </button>
  );
};

export const DeleteOrderList = ({id_pesanan, onDelete }: {id_pesanan: number, onDelete: (id_pesanan: number) => void }) => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  const handleDelete = async () => {
    const themeConfig = currentTheme === 'dark'
      ? {
        background: '#191919',
        color: '#fff',
        iconColor: '#f8bb86',
        confirmButtonColor: "#750E21",
        cancelButtonColor: "#03346E",
      }
      : {
        background: '#ffffff',
        color: '#000',
        iconColor: '#f8bb86',
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      };

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      ...themeConfig,
    });

    if (result.isConfirmed) {
      try {
        await deleteOrderSatu(id_pesanan);
        Swal.fire({
          title: "Deleted!",
          text: "The order has been deleted.",
          icon: "success",
          ...themeConfig,
        });
        onDelete(id_pesanan);
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete the order.",
          icon: "error",
          ...themeConfig,
        });
        console.error("Error deleting customer:", error);
      }
    }
  };

  return (
    <button type="button" onClick={handleDelete}>
      <FontAwesomeIcon
        icon={faTrash}
        className="text-red-600 text-lg cursor-pointer hover:text-red-700 dark:text-[#750E21] dark:hover:text-[#750e2179]"
      />
    </button>
  );
};

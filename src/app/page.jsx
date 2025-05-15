'use client'

import DocumentTable from "@/components/features/document/DocumentTable";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { categories } from "@/utils/constant"

export default function Home() {
  const { user } = useUser();
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter()

  const handleCreate = async (title, template) => {

    if (isCreating) return; // Ngăn chặn nhiều lần click
    
    setIsCreating(true);
    const toastId = toast.loading("Đang tạo tài liệu mới...");

    try {
      // 1. Tạo document trong database
      const response = await fetch('/api/document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title,
          template: template
        })
      });

      
      if (!response.ok) {
        throw new Error('Không thể tạo tài liệu');
      }

      const newDoc = await response.json();
      const documentId = newDoc.insertedId;

      // 2. Cập nhật documentIds cho user
      const updateUserResponse = await fetch('/api/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          documentId: documentId
        })
      });

      if (!updateUserResponse.ok) {
        // Nếu cập nhật user thất bại, xóa document đã tạo
        await fetch(`/api/document/${documentId}`, {
          method: 'DELETE'
        });
        throw new Error('Không thể tạo tài liệu');
      }

      // 3. Tạo Liveblock room thông qua API route mới
      try {
        // Gọi API tạo room mới
        const roomResponse = await fetch('/api/liveblock/createRoom', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roomId: documentId,
          }),
        });

        if (!roomResponse.ok) {
          throw new Error('Có lỗi xảy ra. Vui lòng thử lại!');
        }

        // 4. Đợi room được tạo
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast.update(toastId, {
          render: "Tạo thành công",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        
        // 5. Chuyển hướng
        router.push(`/document/${documentId}`);

      } catch (roomError) {
        // Nếu tạo room thất bại, xóa document và cleanup
        await fetch(`/api/document/${documentId}`, {
          method: 'DELETE'
        });
        
        // Gọi API xóa room để cleanup
        await fetch(`/api/liveblock/deleteRoom?roomId=${documentId}`, {
          method: 'DELETE',
        });
        
        throw new Error('Có lỗi xảy ra. Vui lòng thử lại!');
      }

    } catch (error) {
      toast.update(toastId, {
        render: error.message || "Có lỗi xảy ra. Vui lòng thử lại!",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  if (!user) {
    return <></>;
  }

  return (
    <div className="self-center min-h-screen mx-auto w-[1140px] mt-20 flex flex-col justify-center">
      {/* Create and template */}
      <div className="w-full h-[440px] bg-slate-400 relative flex flex-col text-black justify-around">
        {/* Background */}  
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-full bg-gradient-to-r bg-gray-100 z-0"></div>
        <div className="flex flex-col my-auto">
          <span className="text-2xl font-semibold z-10 ml-2">Tạo mới tài liệu</span>
          <div className="flex mt-4 gap-4">
            {categories.map((category, i) => (
              <div className="z-10" key={i}>
                <div className={`border-2 border-gray-200 rounded-lg overflow-hidden ${isCreating ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-200 cursor-pointer'} transition-all duration-300 mb-2 relative`}>
                  <div 
                    onClick={() => !isCreating && handleCreate(category.title, category.template)} 
                    className="relative"
                  >
                    <Image 
                      src="/docs-blank-googlecolors.png" 
                      alt="Template" 
                      width={400} 
                      height={440} 
                      className={isCreating ? 'opacity-50' : ''}
                    />
                    
                    {isCreating && (
                      <div className="absolute inset-0 flex items-center justify-center"></div>
                    )}
                  </div>
                </div>
                <span className="ml-2 text-lg text-black font-medium">
                  {category.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full flex-1 bg-white text-black">
        <DocumentTable />
      </div>
    </div>
  );
}

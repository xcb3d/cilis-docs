import { Loader2 } from "lucide-react";

const Spinner = () => {
  return (
    <div className="relative mx-auto mb-8 w-20 h-20">
      {/* Vòng xoay chính */}
      <div className="absolute inset-0 rounded-full border-t-4 border-blue-500 animate-spin"></div>

      {/* Vòng xoay phụ - ngược chiều */}
      <div className="absolute inset-2 rounded-full border-r-4 border-indigo-400 animate-[spin_1.5s_linear_infinite_reverse]"></div>

      {/* Vòng xoay trong cùng */}
      <div className="absolute inset-4 rounded-full border-b-4 border-sky-300 animate-[spin_3s_ease-in-out_infinite]"></div>

      {/* Icon ở giữa */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-pulse" />
      </div>

      {/* Hiệu ứng glow */}
      <div className="absolute inset-0 rounded-full bg-blue-200 opacity-20 animate-pulse blur-xl"></div>
    </div>
  );
};

export default Spinner;

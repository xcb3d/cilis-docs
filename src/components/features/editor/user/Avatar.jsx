const IMAGE_SIZE = 48;

const Avatar= ({ src, name }) => {
  return (
    <div className="relative flex items-center justify-center w-9 h-9 -ml-3 border-4 border-white rounded-full bg-gray-400 group">
      <img
        src={src}
        height={IMAGE_SIZE}
        width={IMAGE_SIZE}
        className="w-full h-full rounded-full"
        alt={name}
      />
      <span className="absolute top-full mt-1 opacity-0 transition-opacity duration-150 ease-in group-hover:opacity-100 bg-black text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
        {name}
      </span>
    </div>
  );
}

export default Avatar;

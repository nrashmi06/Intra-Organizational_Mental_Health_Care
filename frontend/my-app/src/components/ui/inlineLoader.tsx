export default function InlineLoader({height: height = "h-32"}: {height?: string}) {
  return (
    <div className={`flex justify-center ${height} items-center gap-2`}>
      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
    </div>
  );
}

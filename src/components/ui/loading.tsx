const Loading = ({ className }: { className?: string }) => {
  return (
    <div className={`flex justify-center ${className}`}>
      <div className="w-12 h-12 rounded-full animate-spin border-8 border-solid border-blue border-t-transparent" />
    </div>
  );
};

export default Loading;

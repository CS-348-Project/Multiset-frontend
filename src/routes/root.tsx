const Root = () => {
  const handleLogin = () => {
    window.location.href = 'http://127.0.0.1:8000/accounts/google/login/';
  };
  return (
    <div className="w-screen h-screen bg-orange-50">
      <div className="w-full h-full flex items-center justify-center">
      <button onClick={handleLogin}>Login with Google</button>
        <div className="text-4xl font-bold text-black"> Multiset </div>
      </div>
    </div>
  );
};

export default Root;

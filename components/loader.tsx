// components/Loader.js
export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-whute/50 z-50">
      <span className="loader"></span>{" "}
      <style>{`
          .loader {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: inline-block;
            position: relative;
            background: linear-gradient(0deg, rgba(255, 61, 0, 0.2) 33%, hsl(328 100% 43%) 100%);
            box-sizing: border-box;
            animation: rotation 1s linear infinite;
          }
          .loader::after {
            content: '';  
            box-sizing: border-box;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: white;
          }
          @keyframes rotation {
            0% { transform: rotate(0deg) }
            100% { transform: rotate(360deg)}
          } 
        `}</style>
    </div>
  );
}

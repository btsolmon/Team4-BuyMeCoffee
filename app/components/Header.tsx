export const Header = () => {
  return (
    <div className="py-2 px-4 bg-white flex w-full flex justify-center">
      <div className="flex justify-between items-center container">
        <div className="flex gap-2 items-center ">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 8H18C19.0609 8 20.0783 8.42143 20.8284 9.17157C21.5786 9.92172 22 10.9391 22 12C22 13.0609 21.5786 14.0783 20.8284 14.8284C20.0783 15.5786 19.0609 16 18 16H17M17 8H3V17C3 18.0609 3.42143 19.0783 4.17157 19.8284C4.92172 20.5786 5.93913 21 7 21H13C14.0609 21 15.0783 20.5786 15.8284 19.8284C16.5786 19.0783 17 18.0609 17 17V8ZM6 2V4M10 2V4M14 2V4"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1 className="text-[16px] font-bold">Buy Me Coffee</h1>
        </div>
        <div className="px-4 py-2 flex gap-2 items-center">
          <p>Jake</p>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="#09090B"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

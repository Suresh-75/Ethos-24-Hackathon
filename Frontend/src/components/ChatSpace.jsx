function ChatSpace({
  selectedUser,
  selectedChat,
  username,
  message,
  setMessage,
  handleKeyPress,
  sendMessage,
}) {
  return (
    <div className="overflow-y-auto h-[80vh]">
      {selectedUser ? (
        <>
          {selectedChat.map((msg, index) => (
            <p
              key={index}
              className={`mb-2 text-white ${
                msg.sender === username ? "text-right" : "textmessage-left"
              }`}
            >
              <strong>{msg.sender}</strong>: {msg.msg}
            </p>
          ))}
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="absolute bottom-4 left-4 p-2 bg-white text-black rounded-md w-[90%] focus:outline-none"
            placeholder="Write Something..."
          />
          <button
            onClick={sendMessage}
            className=" absolute bottom-4 right-4 bg-violet-500 text-white p-2 rounded-md"
          >
            Send Message
          </button>
        </>
      ) : (
        <div className="flex justify-center items-center text-2xl font-semibold text-white h-[100%]">
          <p>Select an user</p>
        </div>
      )}
    </div>
  );
}

export default ChatSpace;

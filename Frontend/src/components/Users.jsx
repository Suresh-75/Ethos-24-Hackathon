import { Avatar, Box, Card, Flex, Text } from "@radix-ui/themes";

const truncate = (text, len) => {
  if (text?.length > len && text.length > 0) {
    return `${text.split(" ").slice(0, len).join(" ")} ...`;
  } else {
    return text;
  }
};

function Users({
  users,
  selectedUser,
  setSelUser,
  setSelUserName,
  setSelectedChat,
  onSelectFriend,
  chat,
}) {
  return (
    <>
      <div className="col-span-1 bg-[rgba(120,120,120,0.2)] rounded-md">
        {users.map((u, index) => {
          return (
            <Box
              key={index}
              onClick={() => {
                if (selectedUser == u.id) return;
                setSelUser(u.id);
                setSelUserName(u.username);
                setSelectedChat([]);
                onSelectFriend(u.username);
              }}
            >
              <Card
                className={`  transition ${
                  selectedUser == u.id ? "bg-white" : "bg-grey-200"
                }  hover:bg-purple-200 hover:cursor-pointer `}
              >
                <Flex gap="2" align="center">
                  <Avatar
                    size="4"
                    // src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
                    radius="full"
                    fallback={u.username.split("")[0]}
                  />
                  <Box>
                    <Text as="div" size="5" weight="bold">
                      {u.username}
                    </Text>
                    <Text as="div" size="2" color="gray">
                      {chat.map((c) => {
                        if (c.username === u.username) {
                          // console.log(c.chats[c.chats.length - 1]);
                          if (c.chats[c.chats.length - 1]) {
                            return (
                              <>
                                <span className="font-semibold text-md">
                                  {c.chats[c.chats.length - 1].sender}
                                </span>{" "}
                                :{truncate(c.chats[c.chats.length - 1].msg, 15)}
                              </>
                            );
                          }
                        }
                        return null;
                      })}
                    </Text>
                  </Box>
                </Flex>
              </Card>
            </Box>
          );
        })}
      </div>
    </>
  );
}

export default Users;

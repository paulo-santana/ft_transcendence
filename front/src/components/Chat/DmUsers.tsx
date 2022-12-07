import { CheckIcon, CloseIcon, StarIcon } from '@chakra-ui/icons';
import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Channel } from '../../models/Channel';
import { TableUser } from '../../models/TableUser';
import { emptyUser, User } from '../../models/User';
import { channelApi } from '../../services/api_index';
import userStorage from '../../services/userStorage';
import { PublicProfile } from '../Profile/profile.public';

function UserDmMenu(props: {
  user: TableUser,
  user2: User,
}) {
  const [reload, setReload] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const me: User = userStorage.getUser() || emptyUser();
  const toast = useToast();

  async function blockUser() {
    const response: any = await channelApi.blockUser(me.id, props.user.id);
    const status = response.status == 201 ? 'success' : 'error';
    const message = response.status == 201 ? '' : response.data.message;
    toast({
      title: 'User block request sent',
      status: status,
      description: message,
    })
    await userStorage.updateUser();
    setReload(!reload);
  }

  async function unblockUser() {
    const response: any = await channelApi.unblockUser(me.id, props.user.id);
    const status = response.status == 200 ? 'success' : 'error';
    const message = response.status == 200 ? '' : response.data.message;
    toast({
      title: 'User unblock request sent',
      status: status,
      description: message,
    })
    await userStorage.updateUser();
    setReload(!reload);
  }

  const isMyself = me.id == props.user.id;
  const isBlocked = me.blocked.find((user) => props.user.id == user.id);
  return (
    <Box padding={1}>
      <PublicProfile
        user={props.user}
        isOpen={isOpen}
        onClose={onClose}
      ></PublicProfile>
      <Menu isLazy>
        <MenuButton>
          {props.user.nickname}
        </MenuButton>
        <MenuList>
          <MenuItem onClick={onOpen}>view profile</MenuItem>
          <MenuItem>invite to game</MenuItem>
          {
            isMyself
              ? null
              : (
                isBlocked
                  ? <MenuItem onClick={unblockUser}>unblock user</MenuItem>
                  : <MenuItem onClick={blockUser}>block user</MenuItem>
              )
          }
        </MenuList>
      </Menu>
    </Box>
  );
}

function PendingRequestMenu(props: {
  user: TableUser,
  user2: User,
}) {
  return (
    <Box padding={1}>
      <Text>{props.user.nickname}</Text>
      <CheckIcon
        onClick={() => console.log('friend request accepted')}
        color={'green.500'}
        marginRight={'10px'}
      ></CheckIcon>
      <CloseIcon
        color={'red.500'}
        boxSize={'0.8em'}
        onClick={() => console.log('friend request removed')}
      ></CloseIcon>
    </Box>
  )
}

export function DmUsers(props: {
  users: User[],
  requests: User[]
}) {
  const [reload, setReload] = useState<boolean>(false);

  const userList = props.users.map((user: User, i: number) => {
    const tableuser = TableUser(user);
    return (
      <UserDmMenu key={i} user={tableuser} user2={user}
    ></UserDmMenu>
    );
  });
  const requestList = props.requests.map((user: User, i: number) => {
    const tableuser = TableUser(user);
    return <PendingRequestMenu key={i} user={tableuser} user2={user}/>
  })
  return (
    <>
      <Text> Friends</Text>
      <hr></hr>
      {userList}
      <br></br>
      <Text>Friend Requests</Text>
      <hr></hr>
      {requestList}
    </>
  );
}

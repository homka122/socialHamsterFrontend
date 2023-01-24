import { axiosService } from "./axiosService";

export const getUserNickname = async (id) => {
  const res = await axiosService.get('/users/' + id);

  if (res.status === 'error') {
    console.log(res)
  }

  return res.data.user.username;

}
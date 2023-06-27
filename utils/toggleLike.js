import axios from "axios";
import {notifyInfo} from "~/components/Notify";

export const toggleLike = ({id, session, setLiked, setLikes}) => {
  axios.post(`/api/like/${id}/${session}`,
    { userId: session, postId: id })
    .then(response => {
      if (response.data === 'Like removed') {
        setLiked(false);
      } else if (response.status === 201) {
        setLiked(true);
      } else if (response.data === 'Failed to toggle like') {
        console.log('toggleLike is called');
        notifyInfo();
      }

      axios.get(`/api/like/${id}`)
        .then(response => {
          setLikes(response.data.likesCount);
        })
        .catch(error => console.error(error));
    })
    .catch(error => {
      if (error.response && error.response.status === 500) {
        notifyInfo();
      } else {
        console.error(error);
      }
    });
};
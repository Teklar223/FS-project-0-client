import React, {useContext , useEffect, useState} from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import { AuthContext } from "../helpers/AuthContext";


function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const { authState } = useContext(AuthContext);
  let history = useHistory();

  useEffect (() => {
    if (!localStorage.getItem("accessToken")){
      history.push("/login");
    }else {
    axios.get("https://full-stack-api-yonatan-ratner.herokuapp.com/posts", { headers: { accessToken: localStorage.getItem("accessToken")}}
    ).then((response) => {
      setListOfPosts(response.data.listOfPosts);
      setLikedPosts(response.data.likedPosts.map((like) => {return like.PostId;}));
    })}
  }, [history]);

  /*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ LIKE SYSTEM ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
  const likePost = (postId) => {
    axios.post("https://full-stack-api-yonatan-ratner.herokuapp.com/likes", {PostId: postId}, { headers: { accessToken: localStorage.getItem("accessToken")}}
    ).then((response) => {
      setListOfPosts(listOfPosts.map((post) => {
        if (post.id === postId){
          if (response.data.liked) {return { ...post, Likes: [...post.Likes, 0] };}
          else {
            const likesArray = post.Likes;
            likesArray.pop();
            return { ...post, Likes: likesArray };
          }
        }
        else {return post;}
      }));
      if (likedPosts.includes(postId)) {setLikedPosts(likedPosts.filter((id)=>{return id !== postId}));}
      else {setLikedPosts([...likedPosts, postId]);}

    });
  };
  /*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ LIKE SYSTEM ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/

    return (
        <div>
            {listOfPosts.map((value, key) => {
        return (
         <div key={key} className="post">
            <div className="title">{value.title} </div>
            <div className="body" onClick={() => {history.push(`/post/${value.id}`)}}>{value.content} </div>
            <div className="footer">
              <div className="username"><Link style={{'color':'darkblue','cursor':'pointer','text-decoration':"underline"}} 
              to={`/profile/${value.UserUsername}`}>{value.UserUsername}</Link>
              </div>
              <div className="buttons">              
                <ThumbUpAltIcon onClick={() => {likePost(value.id);}}               
                  className={likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn" }
                />
               <label>{value.Likes.length}</label>
              </div>
            </div>
         </div>
        );
      })}
      </div>
    )
}

export default Home;

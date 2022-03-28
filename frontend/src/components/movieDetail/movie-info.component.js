import React, {useState, useEffect } from "react";
import { Container, Container2, PosterImg, InfoColumn, MovieName, MovieInfo, Button } from "./movie-info.styles";
import { useParams } from "react-router-dom";
import Reviews from "../review/reviews";
import { getDetails } from "../../services/movieAPI.service";
import { trailer } from "../../services/movieAPI.service";
import { BiLoaderAlt } from "react-icons/bi";
import {IoCloseOutline} from "react-icons/io5";
import FavouriteComp from "../favourites/favourite.component";

const MovieInfoComponent = () => {
    const link = "https://www.youtube.com/embed/{4UZrsTqkcW4}"
    const[trailerDetails, setTrailerDetails] = useState();
    const [movieInfo, setMovieInfo] = useState();
    const [modal, setModal] = useState(false);
    const [videoLoading, setVideoLoading] = useState(true);
    const {id} = useParams()
    //console.log(id)

    useEffect( ()=>{
   
      (async ()=>{
        const response = await getDetails(id)
        setMovieInfo(response)
        //console.log(setMovieInfo);
      })();
      
    },[])

  // const getTrailer = () =>{
      
    useEffect(() => {
      console.log(trailerDetails?.results)
    }, [trailerDetails]);

    const handleClick = async () => {
      const res =  await trailer(id);
      setTrailerDetails(res);
    }

    const openModal = () => {
      setModal(!modal);
    };

    const spinner = () => {
      setVideoLoading(!videoLoading);
    };


  // }

    // useEffect (() =>{
    //   (async ()=>{
    //     const response = await trailer(id)
    //     setTrailerDetails(response)
    //   })();
    // },[])
  
    return (
      <Container>
          <PosterImg src = {`https://image.tmdb.org/t/p/original/${movieInfo?.poster_path}`}/>
          <InfoColumn>
            <MovieName>
              {movieInfo?.title}
            </MovieName>
            <MovieInfo>
              Release Date: {movieInfo?.release_date}
            </MovieInfo>
            <MovieInfo>
              Average: {movieInfo?.vote_average}
            </MovieInfo>
            <MovieInfo>
              Plot: {movieInfo?.overview}
            </MovieInfo>
          </InfoColumn>
          <Button onClick={openModal}>Play
            {
              modal ? (
                <section className="modal__bg">
                  <div className="modal__align">
                    <div className="modal__content" modal={modal}>
                      <IoCloseOutline
                        className="modal__close"
                        arial-label="Close modal"
                        onClick={setModal}
                      />
                      <div className="modal__video-align">
                        {videoLoading ? (
                          <div className="modal__spinner">
                            <BiLoaderAlt
                              className="modal__spinner-style"
                              fadeIn="none"
                            />
                          </div>
                        ) : null}
                        <iframe
                          className="modal__video-style"
                          onLoad={spinner}
                          loading="lazy"
                          width="800"
                          height="500"
                          src="https://www.youtube.com/embed/jK2VROKKTSQ"
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowfullscreen
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </section>
              ) : null}
          </Button>
          <div>
          <FavouriteComp userFrom = {localStorage.getItem('userId')} movieInfo={movieInfo}/>
          </div>
          <div>
          <Container2>
            <Reviews/>
          </Container2>
          </div>
      </Container>
    );
  };

export default MovieInfoComponent

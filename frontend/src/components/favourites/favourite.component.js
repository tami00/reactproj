import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import authService from '../../services/auth.service';
import authHeader from '../../services/auth-header';

const FavouriteButton = styled.button`
  height: 30px;
  width: 40px;
`;

function FavouriteComp(props) {

    const currentUser = authService.getCurrentUser();

    const [favourited, setFavourited] =  useState(false);

    const variable = {
        //change userFrom
        userFrom: currentUser.id,
        movieId: props.movieInfo?.id,
        movieTitle: props.movieInfo?.title,
        movieImg: props.movieInfo?.poster_path
    }

    const onClickFavourite = () => {
        if(favourited) {
            Axios.post('http://localhost:8080/api/favourite/removeFavorite', variable, { headers: authHeader() })
                .then(response =>{
                    if(response.data.success){
                        setFavourited(!favourited)
                        console.log("Removed from favourites")
                    }else {
                        alert('Failed to remove');
                    }
                })

        }else {
            Axios.post('http://localhost:8080/api/favourite/addToFavourite', variable, { headers: authHeader() })
                .then(response =>{
                    if(response.data.success){
                        setFavourited(!favourited)
                        console.log("Added to favourites")
                    }else {
                        alert('Failed to add');
                    }
                })
        }
    }

    useEffect(() => {

        Axios.post('http://localhost:8080/api/favourite/favourited', variable, { headers: authHeader() }) 
            .then(response =>{
                if(response.data.success){
                    setFavourited(response.data.favourited)
                    console.log(response.data.favourited)
                }else {
                    alert('Failed to get info');
                }
            })

    }, [])


    return (
        <div>
            <FavouriteButton onClick={onClickFavourite}>{!favourited ? "add" : "remove"}</FavouriteButton>
        </div>
    )
}

export default FavouriteComp
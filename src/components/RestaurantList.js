import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import RestaurantFinder from "../apis/RestaurantFinder";
import { RestaurantsContext } from "../context/RestaurantsContext";
import StarRating from "./StarRating";
import RestaurantPagination from './RestaurantPagination';

const RestaurantList = () => {
  const { restaurants, setRestaurants } = useContext(RestaurantsContext);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [restaurantsPerPage] = useState(6);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await RestaurantFinder.get("/");
        setRestaurants(response.data.data.restaurants);
      } catch (err) {
        console.log(err)
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const indexOfLastRestaurant = currentPage * restaurantsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;
  const currentRestaurants = restaurants.slice(indexOfFirstRestaurant, indexOfLastRestaurant);
  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await RestaurantFinder.delete(`/${id}`);
         setRestaurants(
            restaurants.filter((restaurant) => {
              return restaurant.id !== id;
            })
          );
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdate = (e, id) => {
    e.stopPropagation();
    navigate(`/restaurants/${id}/update`);
  };

  const handleRestaurantSelect = (id) => {
    navigate(`/restaurants/${id}`);
  };

  const renderRating = (restaurant) => {
    if (!restaurant.count) {
      return <span className="text-warning">0 reviews</span>;
    }
    return (
      <>
        <StarRating rating={restaurant.average_rating} />
        <span className="text-warning ml-1">({restaurant.count})</span>
      </>
    );
  };

  return (
<div className="list-group restaurantList">
  <input placeholder="Search for Title or Author" onChange={event => setQuery(event.target.value)} className="form-control" />
      <table className="table table-hover table-dark">
        <thead>
          <tr className="bg-primary listHeader">
            <th scope="col" className="tableCol">Title</th>
            <th scope="col" className="tableCol">Author</th>
            <th scope="col" className="tableCol">Level</th>
            <th scope="col" className="tableCol">Reviews</th>
            <th scope="col" className="tableCol">Edit</th>
            <th scope="col" className="tableCol">Delete</th>
          </tr>
        </thead>
        <tbody className="tableBody">
      {query ? restaurants.filter(restaurant => {
    if (restaurant.name.toLowerCase().includes(query.toLowerCase()) || restaurant.location.toLowerCase().includes(query.toLowerCase()) ) {
      return restaurant;
    }
  }).map((restaurant) => {
            return (
              <tr 
                onClick={() => handleRestaurantSelect(restaurant.id)}
                key={restaurant.id}>
                  <td>{restaurant.name}</td>
                  <td>{restaurant.location}</td>
                  <td>{"↑".repeat(restaurant.price_range)}</td>
                  <td className="restaurantRating">{renderRating(restaurant)}</td>
                  <td>
                     <button 
                          onClick={(e) => handleUpdate(e, restaurant.id)}
                          className="btn btn-secondary listButton">
                       Update
                     </button>
                  </td>
                  <td>
                     <button 
                         onClick={(e) => handleDelete(e, restaurant.id)}
                         className="btn btn-info listButton">
                       Delete
                     </button>
                  </td>
              </tr>
              );
          }) : currentRestaurants &&
                  currentRestaurants.map((restaurant) => {
            return (
              <tr 
                onClick={() => handleRestaurantSelect(restaurant.id)}
                key={restaurant.id}>
                  <td>{restaurant.name}</td>
                  <td>{restaurant.location}</td>
                  <td>{"↑".repeat(restaurant.price_range)}</td>
                  <td className="restaurantRating">{renderRating(restaurant)}</td>
                  <td>
                     <button 
                          onClick={(e) => handleUpdate(e, restaurant.id)}
                          className="btn btn-secondary listButton">
                       Update
                     </button>
                  </td>
                  <td>
                     <button 
                         onClick={(e) => handleDelete(e, restaurant.id)}
                         className="btn btn-info listButton">
                       Delete
                     </button>
                  </td>
              </tr>
              );
           })}
        </tbody>
      </table>
      {restaurants.length > restaurantsPerPage &&
      <RestaurantPagination
        restaurantsPerPage={restaurantsPerPage}
        totalRestaurants={restaurants.length}
        paginate={paginate}
      />
    }
    </div>
  );
}

export default RestaurantList;
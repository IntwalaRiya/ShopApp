import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchSingleProductAction } from "../redux/actions/product-actions/fetchSingleProductAction";
import { toast, Slide as toastSlide } from "react-toastify";
import { addToCart } from "./../redux/actions/cart-actions/addToCart";
import { addToWishlist } from "./../redux/actions/wishlist-actions/addToWishlist";
import ProductsCarousel from "./home-page/ProductsCarousel";
import Page404 from "./404";
import { Link } from "react-router-dom";
import ExploreMore from "./home-page/ExploreMore";
import Loader from "react-loader-spinner";
import {
  CarouselProvider,
  Slider,
  Slide,
  ImageWithZoom,
  Dot,
  Image
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";

function SingleProduct(props) {
  const [orderQuantity, setOrderQuantity] = useState(0);

  // import product, loading, error from redux store
  const { product, loading, error } = useSelector(state => state.singleProducttt);
  const { user } = useSelector(state => state.userrr);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSingleProductAction(props.match.params.id));
    console.log(props.match.params.id)
  }, [dispatch, props.match.params.id]);

  // just in case someone deleted a category
  const prodCategory = () => {
    if (product.category !== null) {
      return (
        <p className='product-category'>
          Category:{" "}
          <Link to={`/category/${product.CategoryID}`}>{product.Name.S}</Link>
        </p>
      );
    } else {
      return <div className='product-category'>Category: undefined "will edit soon"</div>;
    }
  };

  // to return options with just order in stock
  let numberInStock = product.NumberInStock;
  function options() {
    let arr = [];

    for (let i = 1; i <= numberInStock; i++) {
      arr.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }

    return arr;
  }

  // handle add to cart and wishlist
  const addTo = addFunction => {
    dispatch(addFunction)
      .then(res => {
        toast.success(res, {
          position: toast.POSITION.BOTTOM_LEFT,
          transition: toastSlide
        });
      })
      .catch(err => {
        toast.error(err, {
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: false
        });
      });
  };

  // if the user request an id that doesn't exist, render 404 page
  // else the id does exist, render everything normal
  if (error === "Request failed with status code 404") {
    return <Page404 />;
  } else {
    return (
      <Container fluid className='single-product-page'>
        {loading && (
          <Loader
            type='Circles'
            color='#123'
            height={100}
            width={100}
            className='dashboard-spinner'
          />
        )}
        {error && <div>{error}</div>}
        {console.log(product)}
        {product.CategoryID !== undefined && (
          <Row>
            <Col md='6' sm='12'>
              <Card.Img
                className='product-image'
                variant='top'
                src="https://shopappimages.s3.amazonaws.com/pictures/10-20B14_phoneFront.png"
              />
            </Col>
            {/* <Col md='6' sm='12'>
              <CarouselProvider
                naturalSlideWidth={90}
                naturalSlideHeight={90}
                hasMasterSpinner='true'
                totalSlides={product.productImage.length}>
                <Slider>
                  {product.productImage.map((image, index) => {
                    //let imgPath = image.path.replace(/\\/g, "/");
                    return (
                      <Slide index={index} key={index}>
                        <ImageWithZoom
                          className='d-block w-100 product-card-image'
                          src={image}
                        />
                      </Slide>
                    );
                  })}
                  <div className='down'>Roll over image to zoom in</div>
                </Slider>

                <div className='all-dots'>
                  {product.productImage.map((image, index) => {
                    return (
                      <Dot slide={index} key={index}>
                        <Image className='d-block w-100 product-card-image' src={image} />
                      </Dot>
                    );
                  })}
                </div>
              </CarouselProvider>
            </Col> */}

            {/* *** Product Details *** */}
            <Col>
              <span className='product-name'>{product.Name.S}</span>

              {/* <p className='sold-by'>
                by <span>{product.seller.username}</span>
              </p> */}

              <Row>
                <Col>
                  <div className='product-price'>${product.Price.S}</div>
                </Col>
                <Col>
                  <i
                    class='fa fa-heart-o add-to-wish-list'
                    onClick={() => {
                      addTo(addToWishlist(product.ProductID.S));
                    }}
                    aria-hidden='true'
                    title='Add to wish list'>Add to Wishlist</i>
                </Col>
              </Row>

              <p className='product-desc'>
                Description: <span>{product.Description.S}</span>
              </p>

              {product.numberInStock < 67 && (
                <div className='product-stock'>
                  only {product.NumberInStock.S} left in Stock, order soon.
                </div>
              )}

              <Row>
                <Col className='order-quantity'>
                  <span>Quantity:</span>
                  <select
                    className='browser-default custom-select'
                    onChange={e => {
                      setOrderQuantity();
                    }}>
                    <option value={0}>QTY</option>
                    {options()}
                  </select>
                </Col>
                <Col>
                  <Button
                    className='add-to-cart'
                    variant='secondary'
                    onClick={() => {
                      let quantity = { orderQuantity };
                      console.log(product.ProductID.S, quantity, user.Email.S)
                      dispatch(addToCart(product.ProductID.S, quantity, user.Email.S));
                    }}>
                    Add to cart
                  </Button>
                </Col>
              </Row>

              {prodCategory()}
            </Col>
          </Row>
        )}

        <ProductsCarousel title='Similar Products' productsNumber='4' />
        <ExploreMore />
      </Container>
    );
  }
}

export default SingleProduct;
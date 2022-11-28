import React, { useState, useEffect } from "react";
import { addProductToUserCart, getProducts, getProductsById } from "../api-adapter";
import "./products.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminProducts from "../admin/AdminProducts";


const Products = (props) => {
  let user = props.user;
  let existingItems = [];

  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      let placeholder = await getProducts();
      // console.log(placeholder);
      setProducts(placeholder.products);
    }
    fetchProducts();
  }, []);

  function handleBackToMyCart(e) {
    e.preventDefault();
    navigate("/mycart/cart_items");
  }

  const addProduct = async (productId, price)  => {
 
    // pass props.quantitity into APTUC later, once that is fixed
    const addedToCart = await addProductToUserCart(productId, price)
    //fix quantitity 
    console.log(addedToCart)
  }
  

  async function addToCart(productId) {
    console.log(productId, "id of the thing we clicked");
    let holder = await getProductsById(productId);
    let product = holder.products;
    const tempID = productId;
    const newCartItem = {
      tempID: tempID,
      product: {
        price: product.price,
        image_url: product.image_url,
        name: product.name,
        id: product.id,
      },
    };

    console.log(
      localStorage.getItem("guestCart"),
      "testing response empty pointer"
    );

    if (localStorage.getItem("guestCart") == "") {
      existingItems = [];
    } else {
      existingItems = JSON.parse(localStorage.getItem("guestCart"));
    }

    console.log(typeof existingItems, "existing items type");

    if (!existingItems) {
      existingItems = [];
    }

    existingItems.push(newCartItem);
    localStorage.setItem("guestCart", JSON.stringify(existingItems));

    let tester = localStorage.getItem("guestCart");
    console.log(tester, "tester right here");
  }

  return !user.is_admin ? (

    <div>
      <h1>products</h1>
      <div id="container">
        {products.length ? (
          products.map((product) => {
            return (
              <div key={`product-${product.id}`} className="productBox">
                <div className="productName">{product.name}</div>
                <div className="productDescription">
                  Description: {product.description}
                </div>
                <div className="productDescription">
                  {` testing product id ${product.id}`}
                </div>

                <div className="productInStock">In stock: {product.stock}</div>
                <div className="productID">Price: {product.price}</div>
                <img id="productImage" src={`${product.image_url}`} />

                {user ? (
                  <button onClick={() => addProduct(product.id)}>
                    Add to cart
                  </button>
                ) : (
                  <button onClick={() => addToCart(product.id, product.price)}>
                    Add to cart testing guest
                  </button>
                )}

                <Link to={`/product/${product.id}`}>
                  <button>Display More Info</button>
                </Link>

                <button onClick={handleBackToMyCart}>My Cart</button>
              </div>
            );
          })
        ) : (
          <div>Loading your products... </div>
        )}
      </div>
    </div>
  ) : <AdminProducts/>;
};

export default Products;

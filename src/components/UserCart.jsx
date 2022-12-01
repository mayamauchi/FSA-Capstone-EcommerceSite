import { React, useState, useEffect } from "react";
import { getUserCart, deleteCartItem, updateQuantity } from "../api-adapter";
import { Link, useNavigate, useParams } from "react-router-dom";

const UserCart = (props) => {
  const {quantity, setCount} = useParams;
  console.log(props, "wassup")
  const [userCart, setUserCart] = useState([]);
  const [cartItemId, setCartItemId] = useState(0);
  const [selectedItem, setSelectedItem] = useState();
  const products = props.products;
  const navigate = useNavigate();

  async function handleNewDelete(productId) {
console.log(productId,"DELETE PRODUCTID")
    const cartItemId = Number(productId);
    const deleted = await deleteCartItem(cartItemId);
    
    
  }

  //USED BY REFRESH TECHNIQUE
  async function fetchUserCart() {
    const allCart = await getUserCart();
    console.log(allCart);
    setUserCart(allCart);
  }

  useEffect(() => {
    fetchUserCart();
  }, []);

  function handleBack() {
    navigate("/products");
  }

  const [selectedQuantity, setSelectedQuantity] = useState(0)
  
  function handleQuantChange(e){
    const val = Number(e.target.value)
    setSelectedQuantity(val)
    console.log(selectedQuantity, "this is selected")
  }
  async function settingNewQuant(cartItemId){
    
    console.log(selectedQuantity,"trying to feed this quant")
   const updatedQuant = await updateQuantity(cartItemId, selectedQuantity)
   console.log(updatedQuant)

   /// REFRESH TECHNIQUE
   let placeholder = await fetchUserCart();
    setUserCart(placeholder)
    fetchUserCart()
    /// REFRESH TECHNIQUE
  }
  
  
  async function handleDelete(e) {
    e.preventDefault();
    // const cartItemId = Number(selectedItem.id);
    const deletedCartItem = await deleteCartItem(cartItemId);
    // if (deleted.success) {
      
      // navigate("/mycart/cart_items");
    // }
  }


  
  async function handleNewDelete(productId) {
console.log(productId,"DELETE PRODUCTID")
    const cartItemId = Number(productId);
    const deleted = await deleteCartItem(cartItemId);
    console.log(deleted, "here is deleted")

    //REFRESH TECHNIQUE
    let placeholder = await fetchUserCart();
    setUserCart(placeholder)
    fetchUserCart()
      //REFRESH TECHNIQUE
    }
  

  let incrementCount = () => {
    props.setCount(props.quantity + 1);
  };
  
  let decrementCount = () => {
    if(props.quantity > 0){props.setCount(props.quantity - 1)};
  };


  return (
    <div>
      <h1>My Cart</h1>
          <button onClick={handleBack}>Continue Shopping</button>
      {/* <select onChange={handleSelectChange}>
        {userCart.map((item) => (
          <option key={item.id} value={item.id}>
            price: {item.price}
            quantity: {item.quantity}
            Product Id: {item.id}
          </option>
        ))}
      </select> */}
      

      <div id="container">
        {userCart ? (
          userCart.map((cartItem) => {
            return (
              <div key={`cartItem-${cartItem.id}`}>
                {products.length ? (
                  products.map((product) => {
                    if (cartItem.productId === product.id) {
                      return (
                        <div
                          key={`product-${product.id}`}
                          className="productBox"
                        >
                          <div className="productName">{product.name}</div>
                          {/* <div className="productDescription">
                            Description: {product.description}
                          </div> */}
                          {/* <div className="productDescription">
                            {` testing product id ${product.id}`}
                          </div> */}

                          <div className="productInStock">
                            In stock: {product.stock > 0 ? "Yes" : "No"}
                          </div>
                          <div className="productID">
                            Price: ${product.price / 100}
                          </div>
                          <div>Quantity: {cartItem.quantity}</div>
                          <button onClick={() => handleNewDelete(cartItem.id)}> Delete </button>
                          <select onChange={handleQuantChange}>
        
        <option id="selectedQuantity" value="0">0</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
      </select>
      <button onClick={() => settingNewQuant(cartItem.id)} id="submitnewQuantity">Update Quantity</button>
                          <img id="productImage" src={`${product.image_url}`} />
                          {/* <button>Add to cart</button> */}
                          <Link to={`/product/${product.id}`}>
                            <button>Product Details</button>
                          </Link>
                          {/* <button onClick={handleBack}>Go Back</button> */}
                  
                         
                        </div>
                      );
                    }
                  })
                ) : (
                  <div>Loading your products... </div>
                )}
              </div>
            );
          })
        ) : (
          <div>Loading your userCart... </div>
        )}
      </div>
    </div>
  );
};

export default UserCart;

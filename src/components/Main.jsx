import React, { useState, useEffect } from "react";
import { Navbar, UserCart } from "./";
import LoginPage from "./LoginPage";
import Products from "./Products";
import Register from "./Register";
import { authUser, getProducts } from "../api-adapter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SingleProduct from "./SingleProduct";
import Home from "./Home";
import GuestCart from "./GuestCart";
import Footer from "./Footer";
import ContactForm from "./ContactForm";
import AdminPage from "../admin/AdminPage";
import AdminUsers from "../admin/AdminUsers";
import AdminProducts from "../admin/AdminProducts";

import {
  RouterProvider,
  Route,
  Link,
  Switch,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

const Main = () => {
  const [user, setUser] = useState("");
  const [token, setToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);
  // console.log(products, "products info")
  const [quantity, setCount] = useState(0);

  useEffect(() => {
    async function fetchProducts() {
      let placeholder = await getProducts();
      // console.log(placeholder);
      setProducts(placeholder.products);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken && !isLoggedIn) {
      async function fetchUser() {
        const me = await authUser(localToken);
        setUser(me);
        setIsLoggedIn(true);
      }
      fetchUser();
    }
  }, [isLoggedIn]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={
          <Navbar
            setUser={setUser}
            user={user}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
          />
        }
      >
        <Route
          path="/login"
          element={
            <LoginPage setUser={setUser} setIsLoggedIn={setIsLoggedIn} />
          }
        ></Route>
        <Route path="/register" element={<Register />}></Route>

        <Route path="/products" element={<Products
        user = {user} />}></Route>


        <Route path="/guestcart" element={<GuestCart />}></Route>
        <Route
          path="/product/:productId"
          element={
            <SingleProduct
              user={user}
              quantity={quantity}
              setCount={setCount}
            />
          }
        ></Route>

        <Route
          path="/mycart/cart_items"
          element={
            <UserCart
              products={products}
              setProducts={setProducts}
              quantity={quantity}
              setCount={setCount}
            />
          }
        ></Route>
        <Route path="/contactform" element={<ContactForm />}></Route>
        <Route path="/" element={<Footer />}></Route>
        <Route path="/Admin" element={<AdminPage user={user}/>}></Route>
        <Route path="/AdminUsers" element={<AdminUsers user={user}/>}></Route>
        <Route path="/AdminProducts" element={<AdminProducts/>}></Route>
        <Route path="/Home" element={<Home/>}></Route>
      </Route>
    )
  );

  return (
    <main>
      <div id="main">
        <RouterProvider router={router}></RouterProvider>
        <ToastContainer />
      </div>
    </main>
  );
};

export default Main;

import React, { useState } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import {
  loginApi,
  getArticlesApi,
  createArticleApi,
  updateArticleApi,
  deleteArticleApi,
} from "../axios";

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);
 
  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate("/");
  };

  const redirectToArticles = () => {
    navigate("articles");
  };

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.clear();
    setMessage("Goodbye!");
    redirectToLogin();
  };

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage("");
    setSpinnerOn(true);
    loginApi({ username, password })
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("token", response.data.token);
          setMessage(response.data.message);
          setSpinnerOn(false);
          redirectToArticles();
        }
      })
      .catch((error) => {
        setMessage(error.response.data.message);
        setSpinnerOn(false);
      });
  };

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setMessage("");
    setSpinnerOn(true);
    getArticlesApi()
      .then((response) => {
        if (response.status === 200) {
          setArticles(response.data.articles);
          setMessage(response.data.message);
          setSpinnerOn(false);
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          logout();
        }
        setMessage(error.response.data.message);
        setSpinnerOn(false);
      });
  };

  const postArticle = (article, callback) => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setMessage("");
    setSpinnerOn(true);
    createArticleApi(article)
      .then((response) => {
        if (response.status === 201) {
          callback()
          const copyArticles = [...articles]
          copyArticles.push(response.data.article)
          setArticles(copyArticles)
          setMessage(response.data.message);
          setSpinnerOn(false);
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          logout();
        }
        setMessage(error.response.data.message);
        setSpinnerOn(false);
      });
  };

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    setMessage("");
    setSpinnerOn(true);
    updateArticleApi(article_id, article)
      .then((response) => {
        if (response.status === 200) {
          setMessage(response.data.message);
          setSpinnerOn(false);
          const index = articles.findIndex((article) => article.article_id === currentArticleId)
          const copyArticles = [...articles]
          copyArticles.splice(index, 1, response.data.article)
          setArticles(copyArticles)
          setCurrentArticleId()
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          logout();
        }
        setMessage(error.response.data.message);
        setSpinnerOn(false);
      });
  };

  const deleteArticle = (article_id, index) => {
    // ✨ implement
    setMessage("");
    setSpinnerOn(true);
    deleteArticleApi(article_id)
      .then((response) => {
        if (response.status === 200) {
          setMessage(response.data.message);
          setSpinnerOn(false);
          const copyArticles = [...articles]
          copyArticles.splice(index, 1)
          setArticles(copyArticles)
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          logout();
        }
        setMessage(error.response.data.message);
        setSpinnerOn(false);
      });
  };

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {" "}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            element={
              <>
                <ArticleForm
                  updateArticle={updateArticle}
                  postArticle={postArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  currentArticle={articles.find((article) => article.article_id === currentArticleId)}
                />
                <Articles
                  articles={articles}
                  getArticles={getArticles}
                  deleteArticle={deleteArticle}
                  currentArticleId={currentArticleId}
                  setCurrentArticleId={setCurrentArticleId}
                />
              </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
}

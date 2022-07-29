// ✨ implement axiosWithAuth
import axios from "axios";

const getToken = () => {
  return localStorage.getItem("token");
};
const api = axios.create({
  baseURL: "http://localhost:9000/api",
});

export const loginApi = (data) => {
  return api.post("/login", data);
};

export const getArticlesApi = () => {
  return api.get("/articles", { headers: { Authorization: getToken() } });
};

export const createArticleApi = (data) => {
  return api.post("/articles", data, {
    headers: { Authorization: getToken() },
  });
};

export const updateArticleApi = (articleId, data) => {
  return api.put(`/articles/${articleId}`, data, {
    headers: { Authorization: getToken() },
  });
};

export const deleteArticleApi = (articleId) => {
  return api.delete(`/articles/${articleId}`, {
    headers: { Authorization: getToken() },
  });
};

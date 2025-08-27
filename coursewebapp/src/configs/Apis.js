import axios from "axios";

const BASE_URL = "http://localhost:8080/CourseWeb/api/";

export const endpoints = {
    'categories': '/categories',
    'products': '/products',
    'register': '/users'
}

export default axios.create({
    baseURL: BASE_URL
})
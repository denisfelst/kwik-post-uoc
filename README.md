Making API calls using Axios (from components):

import api from '../api/axios';

// GET request
const getPosts = async () => {
const { data } = await api.get('/posts');
return data;
};

// POST request
const createPost = async (postData) => {
const { data } = await api.post('/posts', postData);
return data;
};

// PUT request
const updatePost = async (id, postData) => {
const { data } = await api.put(`/posts/${id}`, postData);
return data;
};

// DELETE request
const deletePost = async (id) => {
await api.delete(`/posts/${id}`);
};

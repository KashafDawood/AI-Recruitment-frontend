import axiosInstance from "../axiosConfig";

export const getAllBlogs = async (page = 1, pageSize = 10, status = "") => {
  try {
    const statusQuery = status ? `&status=${status}` : "";
    const response = await axiosInstance.get(
      `/api/blogs?page=${page}&page_size=${pageSize}${statusQuery}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getEmployerAllBlogs = async (
  page = 1,
  pageSize = 10,
  status = ""
) => {
  try {
    const statusQuery = status ? `&status=${status}` : "";
    const response = await axiosInstance.get(
      `/api/blogs/my-blogs?page=${page}&page_size=${pageSize}${statusQuery}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBlogBySlug = async (slug: string) => {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_URL}/api/blogs/${slug}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getLatestBlogs = async () => {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_URL}/api/blogs/latest/`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createBlog = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_URL}/api/blogs/publish/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBlog = async (slug: string, formData: FormData) => {
  try {
    const response = await axiosInstance.put(
      `${process.env.NEXT_PUBLIC_URL}/api/blogs/${slug}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBlogStatus = async (slug: string, data: FormData) => {
  try {
    const response = await axiosInstance.patch(
      `${process.env.NEXT_PUBLIC_URL}/api/blogs/${slug}/`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBlog = async (slug: string) => {
  try {
    const response = await axiosInstance.delete(
      `${process.env.NEXT_PUBLIC_URL}/api/blogs/${slug}/`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

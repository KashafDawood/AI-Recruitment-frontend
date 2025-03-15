import axiosInstance from '../axiosConfig';

export const getAllJobs = async () => {
    try{
        const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_URL}/api/jobs/`);
        return response.data;
    } catch(error){
        throw error;
    }
}